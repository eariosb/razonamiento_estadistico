/**
 * English transcreation of the course bibliography appendix
 * (docs/bilingue.md §3): same citations, notes rewritten in the English
 * voice: contractions, germanic roots, active voice. Source data lives
 * in lecturas.ts (Spanish); entries stay aligned by array order.
 */

import type { SeccionLecturas, Enlace } from './lecturas';

export const LECTURAS_EN: SeccionLecturas[] = [
  {
    titulo: 'Course core (across all eight modules)',
    nota: 'The works that carry the whole argument; keep them within reach at all times.',
    entradas: [
      {
        cita: 'Kahneman D. Thinking, Fast and Slow. Nueva York: Farrar, Straus and Giroux; 2011.',
        nota: "The popular synthesis of his life's work; required reading for System 1/System 2 and the core biases.",
      },
      {
        cita: 'Kahneman D, Slovic P, Tversky A (eds.). Judgment under Uncertainty: Heuristics and Biases. Cambridge: Cambridge University Press; 1982.',
        nota: 'The canonical collection of the original experiments; the documentary backbone of the course.',
      },
      {
        cita: 'Tversky A, Kahneman D. Judgment under uncertainty: heuristics and biases. Science. 1974;185(4157):1124–1131.',
        doi: '10.1126/science.185.4157.1124',
        nota: 'The seminal paper: representativeness, availability and anchoring.',
      },
      {
        cita: 'Liberman V, Tversky A. Critical Thinking: Statistical Reasoning and Intuitive Judgment. Nueva York: Columbia University Press; 2024.',
        nota: "Tversky's posthumous book, written explicitly as a college text on statistical reasoning.",
      },
      {
        cita: 'Downey AB. Probably Overthinking It: How to Use Data to Answer Questions, Avoid Statistical Traps, and Make Better Decisions. Chicago: University of Chicago Press; 2025.',
        nota: "A contemporary guide to base rates, biased sampling and Simpson's paradox; teaches with pictures, not equations.",
      },
    ],
  },
  {
    titulo: 'Module 1 · Foundational paradoxes and intuitions',
    entradas: [
      {
        cita: 'Tversky A, Kahneman D. Belief in the law of small numbers. Psychological Bulletin. 1971;76(2):105–110.',
        doi: '10.1037/h0031322',
        nota: 'Over-reading small samples, documented even among trained researchers.',
      },
      {
        cita: 'Tversky A, Kahneman D. Extensional versus intuitive reasoning: the conjunction fallacy in probability judgment. Psychological Review. 1983;90(4):293–315.',
        doi: '10.1037/0033-295X.90.4.293',
        nota: 'The Linda problem and the conjunction fallacy.',
      },
      {
        cita: 'Kahneman D, Tversky A. Subjective probability: a judgment of representativeness. Cognitive Psychology. 1972;3(3):430–454.',
        nota: 'The experimental origin of the representativeness heuristic.',
      },
      {
        cita: 'Gilovich T, Griffin D, Kahneman D (eds.). Heuristics and Biases: The Psychology of Intuitive Judgment. Cambridge: Cambridge University Press; 2002.',
        nota: 'The update and extension of the original research program.',
      },
    ],
  },
  {
    titulo: 'Module 2 · Probability and the Bayes problem',
    entradas: [
      {
        cita: 'Kahneman D, Tversky A. On the psychology of prediction. Psychological Review. 1973;80(4):237–251.',
        doi: '10.1037/h0034747',
        nota: 'Base-rate neglect; the lawyer–engineer experiment.',
      },
      {
        cita: 'Gigerenzer G, Hoffrage U. How to improve Bayesian reasoning without instruction: frequency formats. Psychological Review. 1995;102(4):684–704.',
        doi: '10.1037/0033-295X.102.4.684',
        nota: 'Natural frequencies as a pedagogical alternative to the formula; the documented cure for base-rate neglect.',
      },
      {
        cita: 'Kahneman D, Slovic P, Tversky A (eds.). Probabilistic reasoning in clinical medicine. En: Judgment under Uncertainty. Cambridge University Press; 1982.',
        nota: 'The direct application to medical diagnosis and epidemiology.',
      },
    ],
  },
  {
    titulo: 'Module 3 · Inference and estimation',
    entradas: [
      {
        cita: 'Tversky A, Kahneman D. Judgment under uncertainty: heuristics and biases (section III: anchoring and adjustment). Science. 1974;185:1124–1131.',
        nota: 'Why subjective confidence intervals come out too narrow.',
      },
      {
        cita: 'Alpert M, Raiffa H. A progress report on the training of probability assessors. En: Judgment under Uncertainty. Cambridge University Press; 1982.',
        nota: 'Overconfidence in estimates and the calibration of intervals.',
      },
      {
        cita: 'Kahneman D, Sibony O, Sunstein CR. Noise: A Flaw in Human Judgment. Nueva York: Little, Brown Spark; 2021.',
        nota: 'Unwanted variability in professional judgment: noise as a first-order problem, distinct from bias.',
      },
    ],
  },
  {
    titulo: 'Module 4 · Regression and causality',
    entradas: [
      {
        cita: 'Kahneman D. Regression to the mean. En: Thinking, Fast and Slow, cap. 17. 2011.',
        nota: 'The most readable account of regression to the mean and its misreading as a treatment effect.',
      },
      {
        cita: 'Tversky A, Kahneman D. Causal schemas in judgments under uncertainty. En: Judgment under Uncertainty. Cambridge University Press; 1982.',
        nota: 'The illusion of causality built from correlation.',
      },
      {
        cita: 'Pearl J. Causality: Models, Reasoning, and Inference. 2.ª ed. Cambridge: Cambridge University Press; 2009.',
        nota: 'The formal framework for telling correlation from causation.',
      },
    ],
  },
  {
    titulo: 'Module 5 · Stochastic processes and time series',
    entradas: [
      {
        cita: 'Tversky A, Kahneman D. Availability: a heuristic for judging frequency and probability. Cognitive Psychology. 1973;5(2):207–232.',
        doi: '10.1016/0010-0285(73)90033-9',
        nota: 'How what comes easily to mind distorts risk perception.',
      },
      {
        cita: 'Hamilton JD. Time Series Analysis. Princeton: Princeton University Press; 1994.',
        nota: 'The reference text for the formal treatment of time series.',
      },
      {
        cita: 'Chatfield C. The Analysis of Time Series: An Introduction. 6.ª ed. Boca Raton: Chapman & Hall/CRC; 2003.',
        nota: 'The accessible introduction to time-series fundamentals.',
      },
    ],
  },
  {
    titulo: 'Module 6 · Nonparametric and robust statistics',
    entradas: [
      {
        cita: 'Huber PJ, Ronchetti EM. Robust Statistics. 2.ª ed. Hoboken: Wiley; 2009.',
        nota: 'The founding text of robust statistics.',
      },
      {
        cita: 'Hampel FR, Ronchetti EM, Rousseeuw PJ, Stahel WA. Robust Statistics: The Approach Based on Influence Functions. Nueva York: Wiley; 1986.',
        nota: 'The influence-function approach; the formal treatment of the outlier.',
      },
      {
        cita: 'Hollander M, Wolfe DA, Chicken E. Nonparametric Statistical Methods. 3.ª ed. Hoboken: Wiley; 2013.',
        nota: 'The reference for nonparametric methods.',
      },
    ],
  },
  {
    titulo: 'Module 7 · The Bayesian paradigm',
    entradas: [
      {
        cita: 'Gigerenzer G. On narrow norms and vague heuristics: a reply to Kahneman and Tversky. Psychological Review. 1996;103(3):592–596.',
        nota: 'The critique from ecological rationality; the epistemological axis of the course.',
      },
      {
        cita: 'Kahneman D, Tversky A. On the reality of cognitive illusions: a reply to Gigerenzer. Psychological Review. 1996;103(3):582–591.',
        nota: "The answer to Gigerenzer; the defense of the heuristics-and-biases tradition.",
      },
      {
        cita: 'Gigerenzer G, Todd PM, ABC Research Group. Simple Heuristics That Make Us Smart. Nueva York: Oxford University Press; 1999.',
        nota: 'The full development of ecological rationality.',
      },
      {
        cita: 'Jaynes ET. Probability Theory: The Logic of Science. Cambridge: Cambridge University Press; 2003.',
        nota: 'The formal Bayesian treatment from the logic of inference.',
      },
    ],
  },
  {
    titulo: 'Module 8 · Machine learning, deep learning and decision',
    entradas: [
      {
        cita: 'Angwin J, Larson J, Mattu S, Kirchner L. Machine Bias. ProPublica; 2016.',
        nota: 'The landmark journalistic case on algorithmic bias in recidivism prediction (COMPAS).',
      },
      {
        cita: 'Barocas S, Hardt M, Narayanan A. Fairness and Machine Learning: Limitations and Opportunities. fairmlbook.org; 2023.',
        nota: 'The systematic treatment of bias and fairness in ML; freely available online.',
      },
      {
        cita: 'Breiman L. Statistical modeling: the two cultures. Statistical Science. 2001;16(3):199–231.',
        doi: '10.1214/ss/1009213726',
        nota: 'The debate on predictive vs. inferential modeling; the bridge between classical statistics and ML.',
      },
      {
        cita: 'Kahneman D, Sibony O, Sunstein CR. Noise (chapters on algorithmic noise). 2021.',
        nota: 'Noise carried over into automated decision systems.',
      },
    ],
  },
  {
    titulo: 'Further reading',
    entradas: [
      {
        cita: 'Thaler RH, Sunstein CR. Nudge: Improving Decisions about Health, Wealth, and Happiness. Nueva York: Penguin; 2008.',
        nota: 'Behavioral economics applied to public policy.',
      },
      {
        cita: 'Lewis M. The Undoing Project: A Friendship That Changed Our Minds. Nueva York: W. W. Norton; 2017.',
        nota: 'The story of the Kahneman–Tversky partnership; the human and academic context of the course.',
      },
      {
        cita: 'Thaler RH. Misbehaving: The Making of Behavioral Economics. Nueva York: W. W. Norton; 2015.',
        nota: "The rise of behavioral economics from Thaler's vantage point.",
      },
      {
        cita: 'Kahneman D, Tversky A (eds.). Choices, Values, and Frames. Cambridge: Cambridge University Press; 2000.',
        nota: 'The anthology on prospect theory and framing effects.',
      },
      {
        cita: 'Montgomery DC. Design and Analysis of Experiments. 9.ª ed. Hoboken: Wiley; 2017.',
        nota: 'The reference for experimental design.',
      },
    ],
  },
];

/** English labels and notes for the links; URLs shared with lecturas.ts. */
export const ENLACES_EN: { titulo: string; items: Enlace[] }[] = [
  {
    titulo: 'Interactive labs',
    items: [
      {
        nombre: 'Seeing Theory (Brown University)',
        url: 'https://seeing-theory.brown.edu',
        nota: 'The reference for interactive statistical visualization: probability, inference and regression, animated.',
      },
      {
        nombre: 'CAUSEweb',
        url: 'https://www.causeweb.org',
        nota: 'The statistics-education consortium: games, simulations and materials curated by topic.',
      },
      {
        nombre: 'Spurious Correlations (Tyler Vigen)',
        url: 'https://www.tylervigen.com/spurious-correlations',
        nota: "The mine of absurd correlations behind module 4.",
      },
      {
        nombre: 'Polypad · Fix This Chart',
        url: 'https://polypad.amplify.com',
        nota: 'Exercises on fixing misleading charts; inspiration for the lying-charts workshop.',
      },
    ],
  },
  {
    titulo: 'Bias and judgment',
    items: [
      {
        nombre: 'Cognitive Bias Codex',
        url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Cognitive_bias_codex_en.svg',
        nota: 'The full map of cognitive biases by Buster Benson and John Manoogian.',
      },
      {
        nombre: 'Machine Bias (ProPublica)',
        url: 'https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing',
        nota: 'The COMPAS investigation that anchors module 8.',
      },
      {
        nombre: 'Fairness and Machine Learning (online book)',
        url: 'https://fairmlbook.org',
        nota: 'Barocas, Hardt and Narayanan; the open text on algorithmic fairness.',
      },
    ],
  },
  {
    titulo: 'Software and computing',
    items: [
      {
        nombre: 'R project',
        url: 'https://www.r-project.org',
        nota: 'The language of the course; here it runs in the browser via WebR, nothing to install.',
      },
      {
        nombre: 'WebR',
        url: 'https://docs.r-wasm.org/webr/latest/',
        nota: 'R compiled to WebAssembly: the engine behind every runnable cell in the course.',
      },
      {
        nombre: 'r/dataisugly',
        url: 'https://www.reddit.com/r/dataisugly/',
        nota: 'The living archive of badly-made charts for the honest-visualization workshop.',
      },
    ],
  },
];
