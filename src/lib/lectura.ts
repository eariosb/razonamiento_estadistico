/**
 * Lectura en voz alta: extracción de texto hablable y selección de bloques
 * del contenido MDX. Port del sistema de Historia_Estadistica a los
 * tokens y al DOM de este curso (KaTeX en lugar de MathJax, clases
 * Tailwind en lugar de Quarto).
 */

export const LECTURA_BLOQUE = 'lectura-bloque';
export const LECTURA_ACTUAL = 'lectura-actual';

const GRIEGAS_ES: Record<string, string> = {
  alpha: 'alfa', beta: 'beta', gamma: 'gamma', delta: 'delta',
  epsilon: 'épsilon', varepsilon: 'épsilon', theta: 'theta',
  lambda: 'lambda', mu: 'mu', nu: 'nu', pi: 'pi', rho: 'rho',
  sigma: 'sigma', tau: 'tau', phi: 'fi', varphi: 'fi', chi: 'ji',
  psi: 'psi', omega: 'omega',
  Sigma: 'sigma mayúscula', Delta: 'delta mayúscula',
  Omega: 'omega mayúscula', Phi: 'fi mayúscula',
};

const GRIEGAS_EN: Record<string, string> = {
  ...GRIEGAS_ES,
  phi: 'phi', varphi: 'phi', chi: 'chi',
  epsilon: 'epsilon', varepsilon: 'epsilon',
  Sigma: 'capital sigma', Delta: 'capital delta',
  Omega: 'capital omega', Phi: 'capital phi',
};

/**
 * Fórmulas en línea cortas (t, χ², σ, n) se leen; las de bloque y las
 * largas se omiten: no suenan bien y cortan la frase.
 */
export function formulaHablable(katex: Element, en: boolean): string {
  if (katex.closest('.katex-display')) return '';
  const ann = katex.querySelector('annotation[encoding="application/x-tex"]');
  const tex = (ann ? ann.textContent : katex.textContent || '').trim();
  if (!tex || tex.length > 14 || /\\(frac|sum|int|prod|sqrt|left|begin|mathbb|operatorname)/.test(tex))
    return '';
  const g = en ? GRIEGAS_EN : GRIEGAS_ES;
  const s = tex
    .replace(/\\([A-Za-z]+)/g, (_, n: string) => (g[n] ? ` ${g[n]} ` : ' '))
    .replace(/\^\{?2\}?/g, en ? ' squared ' : ' al cuadrado ')
    .replace(/\^\{?3\}?/g, en ? ' cubed ' : ' al cubo ')
    .replace(/_\{?([A-Za-z0-9]+)\}?/g, en ? ' sub $1 ' : ' sub $1 ')
    .replace(/[{}\\^_$]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return s.length > 30 ? '' : s;
}

/** Texto de un bloque tal como debe oírse. */
export function textoDe(el: HTMLElement, en: boolean): string {
  const c = el.cloneNode(true) as HTMLElement;
  const maths = el.querySelectorAll('.katex');
  c.querySelectorAll('.katex').forEach((m, i) => {
    m.replaceWith(document.createTextNode(` ${formulaHablable(maths[i] || m, en)} `));
  });
  c.querySelectorAll(
    'sup, code, script, style, .sr-only, [role="note"], [data-lectura-ui]',
  ).forEach((n) => n.remove());
  return ((c as HTMLElement).innerText || c.textContent || '')
    .replace(/[—–]/g, ', ')          // rayas → pausa
    .replace(/\s*,\s*,/g, ',')
    .replace(/\(\s*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const SELECTOR = 'h2, h3, h4, p, li, blockquote';
const EXCLUIR = [
  'pre', 'table', 'figure', 'aside', 'nav', 'form', 'fieldset',
  '[role="group"]', '[role="region"]', '[role="dialog"]',
  '[data-lectura-ui]', '.katex-display',
].join(',');

/**
 * Bloques legibles del contenedor: encabezados, párrafos, ítems y citas
 * que no cuelgan de un interactivo (Quiz, RCell, simuladores, tablas,
 * código). Se queda el bloque más interno (un <li> con <p> se lee por
 * sus <p>) y marca cada uno con .lectura-bloque para resaltado y
 * clic-para-saltar.
 */
export function recolectarBloques(root: HTMLElement, en: boolean): HTMLElement[] {
  const candidatos = Array.from(root.querySelectorAll<HTMLElement>(SELECTOR)).filter(
    (el) => !el.closest(EXCLUIR),
  );
  return candidatos
    .filter((el) => !candidatos.some((otro) => otro !== el && el.contains(otro)))
    .filter((el) => textoDe(el, en).length > 1)
    .map((el) => {
      el.classList.add(LECTURA_BLOQUE);
      return el;
    });
}

/**
 * Trozos ≤ ~220 caracteres: Chrome corta los enunciados largos (~15 s).
 * Se parte por frases y, si una frase sola excede, por comas.
 */
export function trozos(texto: string): string[] {
  const frases = texto.match(/[^.!?;:…]+[.!?;:…]*[\s»”"']*/g) || [texto];
  const out: string[] = [];
  let acc = '';
  frases.forEach((f) => {
    if ((acc + f).length > 220 && acc) { out.push(acc.trim()); acc = ''; }
    if (f.length > 220) {
      f.split(/(?<=,)\s+/).forEach((p) => {
        if ((acc + p).length > 220 && acc) { out.push(acc.trim()); acc = ''; }
        acc += p + ' ';
      });
    } else acc += f;
  });
  if (acc.trim()) out.push(acc.trim());
  // Trozos diminutos («St.», «W. R.») se funden con el vecino.
  for (let k = out.length - 2; k >= 0; k--) {
    if (out[k + 1].length < 30 || out[k].length < 30) {
      out.splice(k, 2, out[k] + ' ' + out[k + 1]);
    }
  }
  return out;
}

/** Puntaje de voces: prefieren neurales/naturales y del idioma del curso. */
export function puntajeVoz(v: SpeechSynthesisVoice, en: boolean): number {
  const n = v.name;
  let s = 0;
  if (/natural|neural|online|premium|enhanced|mejorad/i.test(n)) s += 10;
  if (/google/i.test(n)) s += 5;
  if (v.localService === false) s += 1;
  if (en ? /en[-_](US|GB)/i.test(v.lang) : /es[-_](ES|MX|US|CO|419)/i.test(v.lang)) s += 2;
  return s;
}

export function vocesDelIdioma(
  all: SpeechSynthesisVoice[],
  en: boolean,
): SpeechSynthesisVoice[] {
  const lang = en ? 'en' : 'es';
  return all
    .filter((v) => (v.lang || '').toLowerCase().slice(0, 2) === lang)
    .sort((a, b) => puntajeVoz(b, en) - puntajeVoz(a, en) || a.name.localeCompare(b.name));
}

export function nombreCortoVoz(v: SpeechSynthesisVoice): string {
  return v.name
    .replace(/^(Microsoft|Google|Apple)\s+/, '')
    .replace(/\s*[-–]\s*(Spanish|English|Español|Inglés).*$/i, '')
    .replace(/\s*Online\s*\(Natural\)/i, ' Natural')
    .trim();
}

const PREF = 're-lectura-';

export function leerPref(k: string, d: string): string {
  try { return localStorage.getItem(PREF + k) ?? d; } catch { return d; }
}

export function guardarPref(k: string, v: string): void {
  try { localStorage.setItem(PREF + k, v); } catch { /* sin storage */ }
}
