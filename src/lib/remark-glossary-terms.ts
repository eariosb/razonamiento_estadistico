// Plugin remark: detecta términos del glosario en la prosa del MDX y los
// envuelve en <Term k="…"> automáticamente, para que cada aparición tenga
// tooltip con la definición sin salir del módulo.
//
// Reglas:
// - Solo en párrafos, ítems de lista, citas y celdas de tabla (prosa).
// - Nunca dentro de código, enlaces, encabezados ni JSX existente
//   (<Term>, <MRef>, props de componentes).
// - Primera aparición de cada término por bloque: suficiente para que el
//   lector recupere la definición sin cubrir el texto de subrayados.
// - Coincidencia insensible a mayúsculas, con límites de palabra Unicode.

import { GLOSSARY_SECTIONS } from './glossary';

type MdNode = {
  type: string;
  value?: string;
  name?: string;
  children?: MdNode[];
};

// Nodos cuyo contenido nunca se procesa.
const SKIP_TYPES = new Set([
  'code', 'inlineCode', 'html', 'heading', 'link', 'linkReference',
  'definition', 'footnote', 'footnoteDefinition', 'mdxjsEsm',
  'mdxFlowExpression', 'mdxTextExpression',
]);

// Elementos JSX cuyos hijos no se tocan (ya son tooltips o enlaces).
const SKIP_JSX = new Set(['Term', 'MRef']);

// Bloques de prosa donde se marca la primera aparición de cada término.
const PROSE_CONTAINERS = new Set([
  'paragraph', 'listItem', 'tableCell', 'blockquote',
]);

// Alias adicionales por clave: plurales, formas comunes en prosa,
// equivalentes en inglés que el texto usa en préstamo.
const ALIASES: Record<string, string[]> = {
  S1: ['Sistema uno'],
  S2: ['Sistema dos'],
  Kahneman: ['Kahneman'],
  Tversky: ['Tversky'],
  Gigerenzer: ['Gigerenzer'],
  representatividad: ['representatividad'],
  disponibilidad: ['disponibilidad'],
  anclaje: ['anclajes', 'anclado'],
  'tasa base': ['tasas base', 'base rate', 'base rates'],
  'falacia de conjunción': ['falacia de la conjunción'],
  LNP: ['ley de números pequeños'],
  'regresión a la media': ['regresión hacia la media', 'regresan a la media', 'regresa a la media'],
  'paradoja de Simpson': ['Simpson'],
  'correlación espuria': ['correlaciones espurias', 'espuria'],
  VPP: ['VPP'],
  VPN: ['VPN'],
  'frecuencias naturales': ['frecuencia natural'],
  verosimilitud: ['likelihood'],
  prior: ['priors', 'previa', 'previas'],
  posterior: ['posteriori', 'posteriores'],
  odds: ['momio', 'momios'],
  IC: ['intervalos de confianza'],
  EE: ['errores estándar'],
  p: ['valor p', 'p-valor', 'p-valores', 'valor-p'],
  H0: ['hipótesis nula', 'H₀', 'H0'],
  TCL: ['teorema del límite central'],
  MAD: ['MAD'],
  'colas pesadas': ['cola pesada', 'heavy tails'],
  'punto de quiebre': ['breakdown point', 'breakdown'],
  'caminata aleatoria': ['caminatas aleatorias', 'random walk', 'random walks'],
  'ruido blanco': ['ruidos blancos', 'white noise'],
  estacionariedad: ['estacionario', 'estacionaria', 'estacionarios'],
  AUC: ['AUC'],
  ROC: ['curva ROC', 'ROC'],
  'sesgo algorítmico': ['sesgos algorítmicos'],
  'dos culturas': ['dos culturas'],
  ruido: ['ruidos'],
};

// Claves cuya forma `k` nunca se usa como superficie (siglas que en prosa
// aparecen por su nombre completo, o palabras demasiado ambiguas).
const K_NO_SURFACE = new Set(['S1', 'S2', 'LNP', 'IC', 'EE', 'p', 'H0', 'TCL', 'LGN', 'MAD', 'AUC', 'ROC', 'VPP', 'VPN']);

interface Pattern {
  key: string;
  re: RegExp;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Mapa superficie -> clave. Se prueba primero el patrón más largo para que
// «ruido blanco» gane sobre «ruido» y «ley de los números pequeños» sobre
// «números pequeños».
const PATTERNS: Pattern[] = (() => {
  const surfaces: Array<{ surface: string; key: string }> = [];
  for (const sec of GLOSSARY_SECTIONS) {
    for (const e of sec.entradas) {
      const base = e.term.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
      const seen = new Set<string>();
      const add = (s: string) => {
        const t = s.trim();
        if (t.length >= 3 && !seen.has(t.toLowerCase())) {
          seen.add(t.toLowerCase());
          surfaces.push({ surface: t, key: e.k });
        }
      };
      add(base);
      if (!K_NO_SURFACE.has(e.k) && e.k.length >= 3) add(e.k);
      for (const a of ALIASES[e.k] ?? []) add(a);
    }
  }
  surfaces.sort((a, b) => b.surface.length - a.surface.length);
  return surfaces.map(({ surface, key }) => ({
    key,
    re: new RegExp(`(^|[^\\p{L}\\p{N}])(${escapeRe(surface)}s?)(?![\\p{L}\\p{N}])`, 'iu'),
  }));
})();

function termNode(key: string, label: string): MdNode {
  return {
    type: 'mdxJsxTextElement',
    name: 'Term',
    // @ts-expect-error atributo JSX en mdast
    attributes: [{ type: 'mdxJsxAttribute', name: 'k', value: key }],
    children: [{ type: 'text', value: label }],
  };
}

// Marca la primera aparición de cada término dentro de un bloque de prosa.
function wrapTerms(children: MdNode[]): MdNode[] {
  const used = new Set<string>();
  const out: MdNode[] = [];

  const process = (node: MdNode): MdNode[] => {
    // JSX hijo: no tocar Term/MRef; el resto (Callout, etc.) se recorre.
    if (node.type === 'mdxJsxTextElement' || node.type === 'mdxJsxFlowElement') {
      if (SKIP_JSX.has(node.name ?? '')) return [node];
      if (node.children) node.children = flatMapChildren(node.children);
      return [node];
    }
    if (SKIP_TYPES.has(node.type)) return [node];
    if (node.children) {
      node.children = flatMapChildren(node.children);
      return [node];
    }
    if (node.type !== 'text' || !node.value) return [node];

    // Intenta dividir el texto por cada patrón no usado aún.
    let text = node.value;
    for (const { key, re } of PATTERNS) {
      if (used.has(key)) continue;
      const m = re.exec(text);
      if (!m) continue;
      used.add(key);
      const [full, prefix, label] = m;
      const start = m.index + prefix.length;
      const before = text.slice(0, start);
      const after = text.slice(start + full.length - prefix.length);
      const nodes: MdNode[] = [];
      if (before) nodes.push({ type: 'text', value: before });
      nodes.push(termNode(key, label));
      if (after) nodes.push(...process({ type: 'text', value: after }));
      return nodes;
    }
    return [node];
  };

  const flatMapChildren = (kids: MdNode[]): MdNode[] =>
    kids.flatMap((k) => process(k));

  for (const child of children) out.push(...process(child));
  return out;
}

function walk(node: MdNode): void {
  if (!node.children) return;
  if (PROSE_CONTAINERS.has(node.type)) {
    // wrapTerms procesa también los descendientes (blockquote > p, etc.).
    node.children = wrapTerms(node.children);
    return;
  }
  for (const c of node.children) {
    if (SKIP_TYPES.has(c.type)) continue;
    if ((c.type === 'mdxJsxTextElement' || c.type === 'mdxJsxFlowElement') && SKIP_JSX.has(c.name ?? '')) continue;
    walk(c);
  }
}

/** remark plugin: envuelve términos del glosario en <Term k="…">. */
export function remarkGlossaryTerms() {
  return (tree: MdNode) => {
    walk(tree);
  };
}
