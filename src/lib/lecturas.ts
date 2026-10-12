/**
 * Apéndice de bibliografía, enlaces y lecturas de interés del curso.
 *
 * Las citas provienen de la documentación del curso y se agrupan por los
 * ocho módulos, más un núcleo transversal y complementarias. No reemplazan
 * a la bibliografía canónica del asistente (`rag/bibliography`), que es la
 * única citable por [bib:*]; estas son lecturas de ampliación.
 */

export interface Lectura {
  /** Referencia completa, en formato de cita. */
  cita: string;
  /** Para qué la usa el curso (una línea). */
  nota?: string;
  doi?: string;
}

export interface SeccionLecturas {
  titulo: string;
  nota?: string;
  entradas: Lectura[];
}

export const LECTURAS: SeccionLecturas[] = [
  {
    titulo: 'Núcleo del curso (transversal a los ocho módulos)',
    nota: 'Las obras que sostienen el argumento completo; conviene tenerlas a la mano siempre.',
    entradas: [
      {
        cita: 'Kahneman D. Thinking, Fast and Slow. Nueva York: Farrar, Straus and Giroux; 2011.',
        nota: 'La síntesis divulgativa de toda la obra; referencia obligada para el Sistema 1/Sistema 2 y los sesgos fundamentales.',
      },
      {
        cita: 'Kahneman D, Slovic P, Tversky A (eds.). Judgment under Uncertainty: Heuristics and Biases. Cambridge: Cambridge University Press; 1982.',
        nota: 'La compilación canónica de los estudios experimentales originales; la base documental del curso.',
      },
      {
        cita: 'Tversky A, Kahneman D. Judgment under uncertainty: heuristics and biases. Science. 1974;185(4157):1124–1131.',
        doi: '10.1126/science.185.4157.1124',
        nota: 'El artículo seminal: representatividad, disponibilidad y anclaje.',
      },
      {
        cita: 'Liberman V, Tversky A. Critical Thinking: Statistical Reasoning and Intuitive Judgment. Nueva York: Columbia University Press; 2024.',
        nota: 'Obra póstuma de Tversky, escrita explícitamente como texto universitario de razonamiento estadístico.',
      },
      {
        cita: 'Downey AB. Probably Overthinking It: How to Use Data to Answer Questions, Avoid Statistical Traps, and Make Better Decisions. Chicago: University of Chicago Press; 2025.',
        nota: 'Guía contemporánea sobre tasa base, muestreo sesgado y paradoja de Simpson; enseña con visualizaciones en lugar de ecuaciones.',
      },
    ],
  },
  {
    titulo: 'Módulo 1 · Paradojas e intuiciones fundacionales',
    entradas: [
      {
        cita: 'Tversky A, Kahneman D. Belief in the law of small numbers. Psychological Bulletin. 1971;76(2):105–110.',
        doi: '10.1037/h0031322',
        nota: 'La extrapolación de muestras pequeñas, documentada incluso en investigadores entrenados.',
      },
      {
        cita: 'Tversky A, Kahneman D. Extensional versus intuitive reasoning: the conjunction fallacy in probability judgment. Psychological Review. 1983;90(4):293–315.',
        doi: '10.1037/0033-295X.90.4.293',
        nota: 'El problema de Linda y la falacia de conjunción.',
      },
      {
        cita: 'Kahneman D, Tversky A. Subjective probability: a judgment of representativeness. Cognitive Psychology. 1972;3(3):430–454.',
        nota: 'El origen experimental de la heurística de representatividad.',
      },
      {
        cita: 'Gilovich T, Griffin D, Kahneman D (eds.). Heuristics and Biases: The Psychology of Intuitive Judgment. Cambridge: Cambridge University Press; 2002.',
        nota: 'La actualización y extensión de la investigación original.',
      },
    ],
  },
  {
    titulo: 'Módulo 2 · Probabilidad y el problema de Bayes',
    entradas: [
      {
        cita: 'Kahneman D, Tversky A. On the psychology of prediction. Psychological Review. 1973;80(4):237–251.',
        doi: '10.1037/h0034747',
        nota: 'La insensibilidad a la tasa base; el experimento del abogado y el ingeniero.',
      },
      {
        cita: 'Gigerenzer G, Hoffrage U. How to improve Bayesian reasoning without instruction: frequency formats. Psychological Review. 1995;102(4):684–704.',
        doi: '10.1037/0033-295X.102.4.684',
        nota: 'Las frecuencias naturales como alternativa pedagógica a la fórmula; la cura documentada de la falacia de tasa base.',
      },
      {
        cita: 'Kahneman D, Slovic P, Tversky A (eds.). Probabilistic reasoning in clinical medicine. En: Judgment under Uncertainty. Cambridge University Press; 1982.',
        nota: 'La aplicación directa a diagnóstico médico y epidemiología.',
      },
    ],
  },
  {
    titulo: 'Módulo 3 · Inferencia y estimación',
    entradas: [
      {
        cita: 'Tversky A, Kahneman D. Judgment under uncertainty: heuristics and biases (sección III: anclaje y ajuste). Science. 1974;185:1124–1131.',
        nota: 'Por qué los intervalos de confianza subjetivos salen demasiado estrechos.',
      },
      {
        cita: 'Alpert M, Raiffa H. A progress report on the training of probability assessors. En: Judgment under Uncertainty. Cambridge University Press; 1982.',
        nota: 'La sobreconfianza en las estimaciones y la calibración de intervalos.',
      },
      {
        cita: 'Kahneman D, Sibony O, Sunstein CR. Noise: A Flaw in Human Judgment. Nueva York: Little, Brown Spark; 2021.',
        nota: 'La variabilidad no deseada en juicios profesionales: el ruido como problema de primer orden, distinto del sesgo.',
      },
    ],
  },
  {
    titulo: 'Módulo 4 · Regresión y causalidad',
    entradas: [
      {
        cita: 'Kahneman D. Regression to the mean. En: Thinking, Fast and Slow, cap. 17. 2011.',
        nota: 'La explicación más accesible de la regresión a la media y su mala interpretación como efecto de intervención.',
      },
      {
        cita: 'Tversky A, Kahneman D. Causal schemas in judgments under uncertainty. En: Judgment under Uncertainty. Cambridge University Press; 1982.',
        nota: 'La ilusión de causalidad a partir de correlación.',
      },
      {
        cita: 'Pearl J. Causality: Models, Reasoning, and Inference. 2.ª ed. Cambridge: Cambridge University Press; 2009.',
        nota: 'El marco formal para distinguir correlación de causalidad.',
      },
    ],
  },
  {
    titulo: 'Módulo 5 · Procesos estocásticos y series de tiempo',
    entradas: [
      {
        cita: 'Tversky A, Kahneman D. Availability: a heuristic for judging frequency and probability. Cognitive Psychology. 1973;5(2):207–232.',
        doi: '10.1016/0010-0285(73)90033-9',
        nota: 'La distorsión de la percepción de riesgos por lo que viene fácil a la mente.',
      },
      {
        cita: 'Hamilton JD. Time Series Analysis. Princeton: Princeton University Press; 1994.',
        nota: 'El texto de referencia para el tratamiento formal de series de tiempo.',
      },
      {
        cita: 'Chatfield C. The Analysis of Time Series: An Introduction. 6.ª ed. Boca Raton: Chapman & Hall/CRC; 2003.',
        nota: 'La introducción accesible a los fundamentos de series de tiempo.',
      },
    ],
  },
  {
    titulo: 'Módulo 6 · Estadística no paramétrica y robusta',
    entradas: [
      {
        cita: 'Huber PJ, Ronchetti EM. Robust Statistics. 2.ª ed. Hoboken: Wiley; 2009.',
        nota: 'El texto fundacional de la estadística robusta.',
      },
      {
        cita: 'Hampel FR, Ronchetti EM, Rousseeuw PJ, Stahel WA. Robust Statistics: The Approach Based on Influence Functions. Nueva York: Wiley; 1986.',
        nota: 'El enfoque por funciones de influencia; el tratamiento formal del outlier.',
      },
      {
        cita: 'Hollander M, Wolfe DA, Chicken E. Nonparametric Statistical Methods. 3.ª ed. Hoboken: Wiley; 2013.',
        nota: 'La referencia para métodos no paramétricos.',
      },
    ],
  },
  {
    titulo: 'Módulo 7 · El paradigma bayesiano',
    entradas: [
      {
        cita: 'Gigerenzer G. On narrow norms and vague heuristics: a reply to Kahneman and Tversky. Psychological Review. 1996;103(3):592–596.',
        nota: 'La crítica desde la racionalidad ecológica; el eje epistemológico del curso.',
      },
      {
        cita: 'Kahneman D, Tversky A. On the reality of cognitive illusions: a reply to Gigerenzer. Psychological Review. 1996;103(3):582–591.',
        nota: 'La respuesta a Gigerenzer; la defensa de la tradición heurística y sesgo.',
      },
      {
        cita: 'Gigerenzer G, Todd PM, ABC Research Group. Simple Heuristics That Make Us Smart. Nueva York: Oxford University Press; 1999.',
        nota: 'El desarrollo completo de la racionalidad ecológica.',
      },
      {
        cita: 'Jaynes ET. Probability Theory: The Logic of Science. Cambridge: Cambridge University Press; 2003.',
        nota: 'El tratamiento bayesiano formal desde la lógica de la inferencia.',
      },
    ],
  },
  {
    titulo: 'Módulo 8 · Machine learning, deep learning y decisión',
    entradas: [
      {
        cita: 'Angwin J, Larson J, Mattu S, Kirchner L. Machine Bias. ProPublica; 2016.',
        nota: 'El caso periodístico fundamental sobre sesgo algorítmico en la predicción de reincidencia (COMPAS).',
      },
      {
        cita: 'Barocas S, Hardt M, Narayanan A. Fairness and Machine Learning: Limitations and Opportunities. fairmlbook.org; 2023.',
        nota: 'El tratamiento sistemático de sesgo y equidad en ML; disponible en línea.',
      },
      {
        cita: 'Breiman L. Statistical modeling: the two cultures. Statistical Science. 2001;16(3):199–231.',
        doi: '10.1214/ss/1009213726',
        nota: 'El debate sobre modelado predictivo vs. inferencial; el puente entre la estadística clásica y el ML.',
      },
      {
        cita: 'Kahneman D, Sibony O, Sunstein CR. Noise (capítulos sobre ruido algorítmico). 2021.',
        nota: 'El ruido trasladado a los sistemas automatizados de decisión.',
      },
    ],
  },
  {
    titulo: 'Complementarias',
    entradas: [
      {
        cita: 'Thaler RH, Sunstein CR. Nudge: Improving Decisions about Health, Wealth, and Happiness. Nueva York: Penguin; 2008.',
        nota: 'La aplicación de la economía conductual a políticas públicas.',
      },
      {
        cita: 'Lewis M. The Undoing Project: A Friendship That Changed Our Minds. Nueva York: W. W. Norton; 2017.',
        nota: 'La historia de la colaboración Kahneman-Tversky; el contexto humano y académico del curso.',
      },
      {
        cita: 'Thaler RH. Misbehaving: The Making of Behavioral Economics. Nueva York: W. W. Norton; 2015.',
        nota: 'El desarrollo de la economía conductual desde la perspectiva de Thaler.',
      },
      {
        cita: 'Kahneman D, Tversky A (eds.). Choices, Values, and Frames. Cambridge: Cambridge University Press; 2000.',
        nota: 'La antología sobre teoría de las perspectivas y efectos de encuadre.',
      },
      {
        cita: 'Montgomery DC. Design and Analysis of Experiments. 9.ª ed. Hoboken: Wiley; 2017.',
        nota: 'La referencia para diseño experimental.',
      },
    ],
  },
];

export interface Enlace {
  nombre: string;
  url: string;
  nota: string;
}

/** Enlaces estables: recursos interactivos, repositorios y referencias del curso. */
export const ENLACES: { titulo: string; items: Enlace[] }[] = [
  {
    titulo: 'Laboratorios interactivos',
    items: [
      {
        nombre: 'Seeing Theory (Brown University)',
        url: 'https://seeing-theory.brown.edu',
        nota: 'El referente de visualización estadística interactiva: probabilidad, inferencia y regresión animadas.',
      },
      {
        nombre: 'CAUSEweb',
        url: 'https://www.causeweb.org',
        nota: 'El consorcio de educación estadística: juegos, simulaciones y materiales curados por tema.',
      },
      {
        nombre: 'Spurious Correlations (Tyler Vigen)',
        url: 'https://www.tylervigen.com/spurious-correlations',
        nota: 'La mina de correlaciones absurdas del módulo 4.',
      },
      {
        nombre: 'Polypad · Fix This Chart',
        url: 'https://polypad.amplify.com',
        nota: 'Ejercicios de reparar gráficos engañosos; inspiración del taller de gráficos mentirosos.',
      },
    ],
  },
  {
    titulo: 'Sesgos y juicio',
    items: [
      {
        nombre: 'Cognitive Bias Codex',
        url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Cognitive_bias_codex_en.svg',
        nota: 'El mapa completo de sesgos cognitivos de Buster Benson y John Manoogian.',
      },
      {
        nombre: 'Machine Bias (ProPublica)',
        url: 'https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing',
        nota: 'La investigación sobre COMPAS que ancla el módulo 8.',
      },
      {
        nombre: 'Fairness and Machine Learning (libro en línea)',
        url: 'https://fairmlbook.org',
        nota: 'Barocas, Hardt y Narayanan; el texto abierto sobre equidad algorítmica.',
      },
    ],
  },
  {
    titulo: 'Software y cómputo',
    items: [
      {
        nombre: 'R project',
        url: 'https://www.r-project.org',
        nota: 'El lenguaje del curso; aquí corre en el navegador vía WebR, sin instalar nada.',
      },
      {
        nombre: 'WebR',
        url: 'https://docs.r-wasm.org/webr/latest/',
        nota: 'R compilado a WebAssembly: el motor de todas las celdas ejecutables del curso.',
      },
      {
        nombre: 'r/dataisugly',
        url: 'https://www.reddit.com/r/dataisugly/',
        nota: 'El archivo vivo de gráficos mal hechos para el taller de visualización honesta.',
      },
    ],
  },
];
