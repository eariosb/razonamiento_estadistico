import type { RagDoc } from '@cursos/blackboard/rag';

export interface BibEntry {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  /** Short topical summary used as the retrievable text. */
  summary: string;
  isbn?: string;
  doi?: string;
}

/**
 * Canonical references for the statistical-reasoning course. These are the
 * ONLY bibliography sources the assistant may cite as [bib:*] — anything
 * else is sanitized to [referencia no verificada].
 *
 * Texto guía: Kahneman (2011), con Tversky & Kahneman (1974) como artículo
 * seminal y el debate Gigerenzer-Kahneman (1996) como eje epistemológico.
 */
export const BIBLIOGRAPHY: BibEntry[] = [
  {
    id: 'kahneman-2011',
    title: 'Thinking, Fast and Slow',
    authors: 'Kahneman, D.',
    year: 2011,
    venue: 'Farrar, Straus and Giroux',
    isbn: '978-0-374-27563-1',
    summary:
      'Texto guía del curso. Sistema 1 (rápido, intuitivo, narrativo) vs. Sistema 2 (lento, analítico): el Sistema 1 es débil en razonamiento estadístico aunque poderoso en causas. Capítulos clave: la ley de los números pequeños (10), anclas (11), disponibilidad (12), representatividad (14), regresión a la media (17, con la anécdota de los pilotos de la Fuerza Aérea israelí), ilusión de validez (20) e intuición experta (22).',
  },
  {
    id: 'tversky-kahneman-1974',
    title: 'Judgment under Uncertainty: Heuristics and Biases',
    authors: 'Tversky, A.; Kahneman, D.',
    year: 1974,
    venue: 'Science, 185(4157)',
    doi: '10.1126/science.185.4157.1124',
    summary:
      'El artículo seminal: las tres heurísticas fundamentales. Representatividad (juzgar por parecido, insensible a tasas base y a n), disponibilidad (juzgar frecuencia por facilidad de recuerdo) y anclaje con ajuste insuficiente (estimaciones arrastradas por el primer número). Marco teórico de todo el curso.',
  },
  {
    id: 'ksl-1982',
    title: 'Judgment under Uncertainty: Heuristics and Biases',
    authors: 'Kahneman, D.; Slovic, P.; Tversky, A. (eds.)',
    year: 1982,
    venue: 'Cambridge University Press',
    summary:
      'La compilación canónica de los experimentos originales: insensibilidad a la tasa base (abogado/ingeniero), representatividad, causal schemas, razonamiento probabilístico en medicina clínica y el reporte de Alpert & Raiffa sobre calibración de evaluadores de probabilidad.',
  },
  {
    id: 'liberman-tversky-2024',
    title: 'Critical Thinking: Statistical Reasoning and Intuitive Judgment',
    authors: 'Liberman, V.; Tversky, A.',
    year: 2024,
    venue: 'Columbia University Press',
    summary:
      'La obra póstuma de Tversky, diseñada como texto universitario: razonamiento estadístico y juicio intuitivo con los experimentos clásicos presentados para el aula. La referencia más cercana en espíritu a este curso.',
  },
  {
    id: 'downey-2025',
    title: 'Probably Overthinking It',
    authors: 'Downey, A.B.',
    year: 2025,
    venue: 'University of Chicago Press',
    summary:
      'Guía contemporánea que enseña falacia de tasa base, muestreo sesgado y paradoja de Simpson con visualizaciones en lugar de ecuaciones; comparte con el curso la convicción de que las trampas estadísticas se ven antes de calcularse.',
  },
  {
    id: 'tk-1971-small-numbers',
    title: 'Belief in the Law of Small Numbers',
    authors: 'Tversky, A.; Kahneman, D.',
    year: 1971,
    venue: 'Psychological Bulletin, 76(2)',
    doi: '10.1037/h0031322',
    summary:
      'El concepto central del módulo 1: investigadores con formación estadística esperan que muestras de n=10 reproduzcan las proporciones poblacionales. La gente extrapola de muestras pequeñas a la población total; la intuición trata el azar como autocorrectivo a corto plazo.',
  },
  {
    id: 'tk-1983-conjunction',
    title: 'Extensional versus Intuitive Reasoning: The Conjunction Fallacy in Probability Judgment',
    authors: 'Tversky, A.; Kahneman, D.',
    year: 1983,
    venue: 'Psychological Review, 90(4)',
    doi: '10.1037/0033-295X.90.4.293',
    summary:
      'El problema de Linda: la mayoría ordena "cajera y feminista" como más probable que "cajera", violando la regla de conjuntos (la intersección nunca excede al conjunto). La representatividad vence a la lógica extensional.',
  },
  {
    id: 'kt-1973-prediction',
    title: 'On the Psychology of Prediction',
    authors: 'Kahneman, D.; Tversky, A.',
    year: 1973,
    venue: 'Psychological Review, 80(4)',
    doi: '10.1037/h0034747',
    summary:
      'La insensibilidad a la tasa base en predicción: descritos como estereotipos, los sujetos predicen por parecido y olvidan cuántos abogados e ingenieros hay en la muestra. Fundamento experimental del módulo 2.',
  },
  {
    id: 'gigerenzer-hoffrage-1995',
    title: 'How to Improve Bayesian Reasoning Without Instruction: Frequency Formats',
    authors: 'Gigerenzer, G.; Hoffrage, U.',
    year: 1995,
    venue: 'Psychological Review, 102(4)',
    doi: '10.1037/0033-295X.102.4.684',
    summary:
      'La cura documentada de la falacia de tasa base: el mismo problema de test diagnóstico en frecuencias naturales (de cada 1000 personas) eleva drásticamente las respuestas bayesianas correctas, sin instrucción formal. El formato mental del curso para todo problema de probabilidad condicional.',
  },
  {
    id: 'alpert-raiffa-1982',
    title: 'A Progress Report on the Training of Probability Assessors',
    authors: 'Alpert, M.; Raiffa, H.',
    year: 1982,
    venue: 'En Judgment under Uncertainty (Kahneman, Slovic, Tversky, eds.)',
    summary:
      'La sobreconfianza en intervalos de calibración: evaluadores que declaran 98% de confianza capturan el valor real menos del 60% de las veces. Los intervalos subjetivos salen demasiado estrechos; el anclaje y el ajuste insuficiente explican el patrón.',
  },
  {
    id: 'noise-2021',
    title: 'Noise: A Flaw in Human Judgment',
    authors: 'Kahneman, D.; Sibony, O.; Sunstein, C.R.',
    year: 2021,
    venue: 'Little, Brown Spark',
    summary:
      'El ruido como el otro villano: variabilidad no deseada en juicios que deberían ser idénticos (jueces, médicos, aseguradoras). El sesgo empuja en una dirección, el ruido dispersa; auditado, el ruido profesional es tan grave como el sesgo y mucho menos visible.',
  },
  {
    id: 'tk-1973-availability',
    title: 'Availability: A Heuristic for Judging Frequency and Probability',
    authors: 'Tversky, A.; Kahneman, D.',
    year: 1973,
    venue: 'Cognitive Psychology, 5(2)',
    doi: '10.1016/0010-0285(73)90033-9',
    summary:
      'La heurística de disponibilidad: la frecuencia se juzga por la facilidad con que vienen ejemplos a la mente. Sobreestimamos lo reciente, lo vivido y lo que cubren los medios; subestimamos lo que no ha ocurrido en el pasado reciente. Base del módulo de series de tiempo.',
  },
  {
    id: 'pearl-2009',
    title: 'Causality: Models, Reasoning, and Inference',
    authors: 'Pearl, J.',
    year: 2009,
    venue: 'Cambridge University Press, 2ª edición',
    summary:
      'El marco formal de la distinción correlación/causalidad: DAGs, el criterio back-door, confusores y colisionadores. El lenguaje matemático de lo que el módulo 4 enseña intuitivamente: ver asociación no es ver mecanismo.',
  },
  {
    id: 'huber-2009',
    title: 'Robust Statistics',
    authors: 'Huber, P.J.; Ronchetti, E.M.',
    year: 2009,
    venue: 'Wiley, 2ª edición',
    summary:
      'El texto fundacional de la estadística robusta: estimadores con función de influencia acotada, punto de quiebre, M-estimadores. Los datos reales no siguen distribuciones ideales; la mediana y el MAD existen porque un solo outlier arrastra a la media.',
  },
  {
    id: 'hollander-2013',
    title: 'Nonparametric Statistical Methods',
    authors: 'Hollander, M.; Wolfe, D.A.; Chicken, E.',
    year: 2013,
    venue: 'Wiley, 3ª edición',
    summary:
      'La referencia de métodos no paramétricos: pruebas de rangos (Wilcoxon, Mann-Whitney), tests de signos y métodos libres de distribución; la respuesta formal cuando la normalidad no se sostiene.',
  },
  {
    id: 'gigerenzer-1996',
    title: 'On Narrow Norms and Vague Heuristics: A Reply to Kahneman and Tversky',
    authors: 'Gigerenzer, G.',
    year: 1996,
    venue: 'Psychological Review, 103(3)',
    summary:
      'La crítica de la racionalidad ecológica: las heurísticas no son errores sino adaptaciones que funcionan en los ambientes para los que evolucionaron; llamar "falacia" a juicios evaluados con normas estrechas es injusto. Eje del debate epistemológico del módulo 7.',
  },
  {
    id: 'kt-1996-reply',
    title: 'On the Reality of Cognitive Illusions: A Reply to Gigerenzer',
    authors: 'Kahneman, D.; Tversky, A.',
    year: 1996,
    venue: 'Psychological Review, 103(3)',
    summary:
      'La respuesta a Gigerenzer: las ilusiones cognitivas son reales, replicables y tienen consecuencias; el debate no es si los sesgos existen sino cuándo la racionalidad formal y la ecológica divergen. El curso adopta las dos posiciones como formación, no como bando.',
  },
  {
    id: 'gigerenzer-todd-1999',
    title: 'Simple Heuristics That Make Us Smart',
    authors: 'Gigerenzer, G.; Todd, P.M.; ABC Research Group',
    year: 1999,
    venue: 'Oxford University Press',
    summary:
      'El desarrollo completo de la racionalidad ecológica: heurísticas rápidas y frugales (recognition, take-the-best) que igualan o superan a modelos completos con información limitada. Cuándo la intuición sí funciona.',
  },
  {
    id: 'jaynes-2003',
    title: 'Probability Theory: The Logic of Science',
    authors: 'Jaynes, E.T.',
    year: 2003,
    venue: 'Cambridge University Press',
    summary:
      'El tratamiento bayesiano como lógica de la inferencia: la probabilidad como extensión de la lógica booleana a grados de creencia; el fundamento filosófico del paradigma bayesiano del módulo 7.',
  },
  {
    id: 'angwin-2016',
    title: 'Machine Bias',
    authors: 'Angwin, J.; Larson, J.; Mattu, S.; Kirchner, L.',
    year: 2016,
    venue: 'ProPublica',
    summary:
      'El caso COMPAS: el software de evaluación de riesgo de reincidencia marcaba a acusados negros como de alto riesgo el doble que a blancos. Los modelos heredan la tasa base y los sesgos de los datos de entrenamiento; más datos no limpian, amplifican. Ancla del módulo 8.',
  },
  {
    id: 'barocas-2023',
    title: 'Fairness and Machine Learning: Limitations and Opportunities',
    authors: 'Barocas, S.; Hardt, M.; Narayanan, A.',
    year: 2023,
    venue: 'fairmlbook.org',
    summary:
      'El tratamiento sistemático de equidad algorítmica: definiciones incompatibles de justicia (paridad demográfica, igualdad de odds, calibración), sus trade-offs demostrables y los límites de la mitigación técnica.',
  },
  {
    id: 'breiman-2001',
    title: 'Statistical Modeling: The Two Cultures',
    authors: 'Breiman, L.',
    year: 2001,
    venue: 'Statistical Science, 16(3)',
    doi: '10.1214/ss/1009213726',
    summary:
      'Las dos culturas del análisis: modelado de datos (la caja debe explicar el mecanismo) vs. modelado algorítmico (basta que prediga). Breiman argumenta que la estadística clásica ignoró la segunda cultura; el ML la heredó. Puente entre el módulo de inferencia y el de decisión algorítmica.',
  },
  {
    id: 'hamilton-1994',
    title: 'Time Series Analysis',
    authors: 'Hamilton, J.D.',
    year: 1994,
    venue: 'Princeton University Press',
    summary:
      'La referencia formal de series de tiempo: estacionariedad, caminatas aleatorias, procesos ARMA; el tratamiento matemático de la ilusión de tendencia que el módulo 5 explora primero con simulación.',
  },
];

/** Converts the bibliography into retrievable BM25 documents. */
export function bibliographyToDocs(): RagDoc[] {
  return BIBLIOGRAPHY.map((b) => ({
    id: `bib:${b.id}`,
    source: 'bibliography',
    text: `${b.title}. ${b.authors} (${b.year}). ${b.venue}. ${b.summary}`,
    meta: {
      title: b.title,
      authors: b.authors,
      year: b.year,
      venue: b.venue,
      ...(b.doi ? { doi: b.doi } : {}),
      ...(b.isbn ? { isbn: b.isbn } : {}),
    },
  }));
}
