import { describe, expect, it } from 'vitest';
import { buildCorpus, stripMdx } from './corpus';
import { BIBLIOGRAPHY } from './bibliography';
import { Bm25Index } from '@cursos/blackboard/rag';

const docs = buildCorpus();

describe('rag corpus', () => {
  it('has unique ids and the expected sources', () => {
    const ids = docs.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(docs.filter((d) => d.source === 'module').length).toBeGreaterThan(30);
    expect(docs.filter((d) => d.source === 'quiz').length).toBeGreaterThan(2);
    expect(docs.filter((d) => d.source === 'bibliography').length).toBe(BIBLIOGRAPHY.length);
  });

  it('leaks no executable code into BM25 text', () => {
    // Mencionar `rbinom` o `dbeta` en prosa es contenido de recuperación
    // legítimo; lo que no debe llegar al índice es código: asignaciones,
    // literales de plantilla, fences y etiquetas JSX.
    const leaks = docs.filter((d) =>
      /<-|\{`|```|<RCell|<LabExercise|<Quiz|set\.seed\(/.test(d.text),
    );
    expect(leaks.map((d) => d.id)).toEqual([]);
  });

  it('indexes quiz docs with question, options and explanation', () => {
    const quiz = docs.filter((d) => d.source === 'quiz');
    expect(quiz.every((d) => d.text.startsWith('Pregunta de autoevaluación:'))).toBe(true);
    const m1 = quiz.find((d) => d.id === 'quiz:01-paradojas-e-intuicion:1');
    expect(m1?.text).toContain('Respuesta correcta:');
  });

  it('stripMdx keeps prose but drops code and JSX', () => {
    const out = stripMdx(
      'Texto con `inline` y ```r\ncat(x)\n``` más <RCell code={`a <- 1`} /> y <Quiz question="q" />.',
    );
    expect(out).toContain('Texto con');
    expect(out).not.toMatch(/cat\(|a <-|<RCell|<Quiz/);
  });

  // Preguntas de referencia del curso: cada una debe recuperar, en el
  // top-5 de BM25, un documento del módulo/quiz/bibliografía esperado.
  const REFERENCE: Array<{ q: string; expect: string[] }> = [
    {
      q: 'Monty Hall tres puertas cambiar o quedarse',
      expect: ['mod:01-', 'quiz:01-'],
    },
    {
      q: 'Linda cajera feminista falacia de conjunción',
      expect: ['mod:01-', 'bib:tk-1983-conjunction'],
    },
    {
      q: 'test diagnóstico prevalencia baja falsos positivos',
      expect: ['mod:02-', 'bib:gigerenzer-hoffrage-1995'],
    },
    {
      q: 'ley de los números pequeños muestras pequeñas representativas',
      expect: ['bib:tk-1971-small-numbers', 'mod:01-'],
    },
    {
      q: 'anclaje intervalos de confianza sobreconfianza calibración',
      expect: ['mod:03-', 'bib:alpert-raiffa-1982'],
    },
    {
      q: 'regresión a la media elogio castigo pilotos',
      expect: ['mod:04-', 'bib:kahneman-2011'],
    },
    {
      q: 'paradoja de Simpson admisiones Berkeley desagregar',
      expect: ['mod:04-', 'bib:downey-2025'],
    },
    {
      q: 'caminata aleatoria ilusión de tendencia ruido',
      expect: ['mod:05-', 'bib:hamilton-1994'],
    },
    {
      q: 'mediana resistente outlier media arrastra contaminación',
      expect: ['mod:06-', 'bib:huber-2009'],
    },
    {
      q: 'paradoja de Lindley prior posterior bayesiano frecuentista',
      expect: ['mod:07-', 'bib:jaynes-2003'],
    },
    {
      q: 'sesgo algorítmico COMPAS machine bias reincidencia',
      expect: ['mod:08-', 'bib:angwin-2016'],
    },
  ];

  it.each(REFERENCE)('recovers a relevant doc for "$q"', ({ q, expect: prefixes }) => {
    const idx = new Bm25Index();
    idx.add(docs);
    const hits = idx.search(q, 5).map((h) => h.id);
    const ok = hits.some((id) => prefixes.some((p) => id.startsWith(p)));
    expect(ok, `ningún hit esperado en top-5: ${hits.join(', ')}`).toBe(true);
  });
});
