/**
 * English transcreation of the course glossary (docs/bilingue.md §3):
 * parallel voice, not literal translation. Same entry keys as
 * glossary.ts so <Term k="…"> resolves identically in both locales.
 */
import type { GlossarySection } from '@/lib/glossary';

export const GLOSSARY_SECTIONS_EN: GlossarySection[] = [
  {
    titulo: 'The two systems',
    entradas: [
      {
        k: 'S1',
        term: 'System 1',
        def: 'fast, automatic, intuitive thought; great at stories, weak at probabilities. Kahneman: it always wins unless you train it.',
      },
      {
        k: 'S2',
        term: 'System 2',
        def: 'slow, effortful, analytic thought; the one that checks, computes and corrects System 1 when something smells off.',
      },
      {
        k: 'Kahneman',
        term: 'Daniel Kahneman (1934–2024)',
        def: 'psychologist, 2002 Economics Nobel; with Amos Tversky he documented the heuristics and biases of judgment under uncertainty. Thinking, Fast and Slow (2011) is the course’s guide text.',
      },
      {
        k: 'Tversky',
        term: 'Amos Tversky (1937–1996)',
        def: 'psychologist, Kahneman’s intellectual partner; the law of small numbers, Linda and representativeness experiments are largely his.',
      },
      {
        k: 'Gigerenzer',
        term: 'Gerd Gigerenzer',
        def: 'German psychologist, Kahneman’s main sparring partner; he argues heuristics are useful ecological adaptations and that natural frequencies cure base-rate neglect.',
      },
      {
        k: 'conjuntos anidados',
        term: 'Nested sets',
        def: 'Barbey and Sloman (2007): the mind reasons with sets, not single-event probabilities; "ten out of a hundred" is processable, "10% of a person" is not.',
      },
    ],
  },
  {
    titulo: 'Heuristics',
    entradas: [
      {
        k: 'representatividad',
        term: 'Representativeness heuristic',
        def: 'judging probability by how well something matches a stereotype rather than by the base rate; source of the conjunction fallacy (Linda) and the law of small numbers.',
      },
      {
        k: 'disponibilidad',
        term: 'Availability heuristic',
        def: 'judging how frequent or likely an event is by how easily examples come to mind; media coverage skews risk perception.',
      },
      {
        k: 'anclaje',
        term: 'Anchoring and adjustment',
        def: 'the first available number drags the estimate, and the later adjustment usually falls short; it explains overly narrow subjective confidence intervals.',
      },
      {
        k: 'afecto',
        term: 'Affect heuristic',
        def: 'judging risks and benefits by the feeling they evoke; what scares you looks frequent, what pleases you looks safe.',
      },
    ],
  },
  {
    titulo: 'Biases and fallacies',
    entradas: [
      {
        k: 'tasa base',
        term: 'Base rate',
        def: 'the prior frequency or prevalence of a class in the population; ignoring it is the base-rate fallacy, the foundational error of the course.',
      },
      {
        k: 'falacia de conjunción',
        term: 'Conjunction fallacy',
        def: 'judging P(A and B) higher than P(A), in violation of set logic; the Linda problem (bank teller and feminist) is its canonical demo (Tversky & Kahneman, 1983).',
      },
      {
        k: 'LNP',
        term: 'Law of small numbers',
        def: 'the belief that small samples should mirror population proportions; expecting 10 flips to behave like 1,000 (Tversky & Kahneman, 1971).',
      },
      {
        k: 'utilidad',
        term: 'Utility',
        def: 'what an outcome is worth to the person receiving it, not what it weighs on a scale; Bernoulli coined it to solve St. Petersburg: utility grows slower than wealth.',
      },
      {
        k: 'teoría prospectiva',
        term: 'Prospect theory (Kahneman & Tversky, 1979)',
        def: 'how people actually choose: from a reference point, with loss aversion, framing sensitivity, and nonlinear probability weighting.',
      },
      {
        k: 'sustitución de atributos',
        term: 'Attribute substitution (Kahneman & Frederick, 2002)',
        def: 'when the question is hard, the mind answers an easier one: Linda swaps probability for resemblance; the mechanism that ties the course’s biases together.',
      },
      {
        k: 'falacia del jugador',
        term: 'Gambler’s fallacy',
        def: 'believing a streak gets “paid back” on the next independent trial (five heads and tails is “due”); mistaking the gambler’s memory for the coin’s.',
      },
      {
        k: 'regresión a la media',
        term: 'Regression to the mean',
        def: 'after an extreme value, the next one drifts toward the average by sheer luck; it explains most “improvements” after intervening on the worst and “punishments” that seem to work.',
      },
      {
        k: 'paradoja de Simpson',
        term: 'Simpson’s paradox',
        def: 'a trend visible in aggregate data flips or vanishes when you split by a confounder; the Berkeley admissions case is the classic example.',
      },
      {
        k: 'correlación espuria',
        term: 'Spurious correlation',
        def: 'a strong link between two series by chance or through a third variable; the cum hoc ergo propter hoc fallacy.',
      },
      {
        k: 'sobreconfianza',
        term: 'Overconfidence',
        def: 'uncertainty intervals too tight for the real hit rate; in calibration, claiming 90% and scoring 50%.',
      },
      {
        k: 'sesgo de confirmación',
        term: 'Confirmation bias',
        def: 'seeking, recalling and weighing mostly the evidence that backs your prior belief; the silent engine of p-hacking.',
      },
      {
        k: 'ruido',
        term: 'Noise (Kahneman–Sibony–Sunstein, 2021)',
        def: 'unwanted variability in judgments that should agree; different from bias: bias pushes one way, noise scatters at random.',
      },
      {
        k: 'falacia del fiscal',
        term: "Prosecutor's fallacy",
        def: 'swapping P(evidence | innocent) for P(innocent | evidence); the error that convicted Sally Clark and convicts anyone who forgets the base rate.',
      },
    ],
  },
  {
    titulo: 'Probability and Bayes',
    entradas: [
      {
        k: 'prevalencia',
        term: 'Prevalence',
        def: 'the share of the population with the condition at a given time; in a diagnostic test it is the base rate intuition forgets.',
      },
      {
        k: 'sensibilidad',
        term: 'Sensitivity',
        def: 'P(test+ | sick); the chance the test catches the disease when it is there.',
      },
      {
        k: 'especificidad',
        term: 'Specificity',
        def: 'P(test− | healthy); the chance a healthy person tests negative.',
      },
      {
        k: 'VPP',
        term: 'Positive predictive value',
        def: 'P(sick | test+); the question the patient actually asks, and the one intuition almost always overshoots when prevalence is low.',
      },
      {
        k: 'VPN',
        term: 'Negative predictive value',
        def: 'P(healthy | test−); usually high for rare diseases even with mediocre tests.',
      },
      {
        k: 'frecuencias naturales',
        term: 'Natural frequencies',
        def: 'stating conditional probabilities as counts in a population (of 1,000 people, 1 sick, 51 positive); the format Gigerenzer & Hoffrage (1995) showed “cures” base-rate neglect.',
      },
      {
        k: 'verosimilitud',
        term: 'Likelihood',
        def: 'P(data | hypothesis); what the data say about each hypothesis, a core ingredient of Bayes and of likelihood-ratio tests.',
      },
      {
        k: 'prior',
        term: 'Prior',
        def: 'the distribution of beliefs about the parameter before seeing data; in a diagnostic test, prevalence is the prior.',
      },
      {
        k: 'posterior',
        term: 'Posterior',
        def: 'the distribution of beliefs after seeing data; prior × likelihood, normalized.',
      },
      {
        k: 'odds',
        term: 'Odds',
        def: 'p/(1−p); the simplest way to write Bayes: posterior odds = prior odds × Bayes factor.',
      },
      {
        k: 'factor de Bayes',
        term: 'Bayes factor',
        def: 'the likelihood ratio P(data|H₁)/P(data|H₀); how far the data move beliefs, on a multiplicative scale.',
      },
    ],
  },
  {
    titulo: 'Inference and estimation',
    entradas: [
      {
        k: 'IC',
        term: 'Confidence interval (CI)',
        def: 'the range of parameter values compatible with the data at the stated level; always report it next to the estimate.',
      },
      {
        k: 'EE',
        term: 'Standard error (SE)',
        def: 'the standard deviation of the estimator across repeated samples; it shrinks as 1/√n.',
      },
      {
        k: 'p',
        term: 'p-value',
        def: 'the probability of a result at least as extreme as the observed one under H₀; it is not the probability that H₀ is true.',
      },
      {
        k: 'potencia',
        term: 'Statistical power',
        def: 'the chance of detecting an effect that is really there; an underpowered study that finds nothing has not proven absence.',
      },
      {
        k: 'falacia de planificación',
        term: 'Planning fallacy',
        def: 'estimating time and cost from the inside, adding up tasks, instead of asking how long similar projects took; the Sydney Opera House is the monument.',
      },
      {
        k: 'vista desde afuera',
        term: 'Outside view (reference class)',
        def: 'forecasting by reference class: how long cases of this kind took, not how long yours would take if everything went to plan.',
      },
      {
        k: 'H0',
        term: 'Null hypothesis',
        def: 'the concrete model the test puts on trial (typically no effect or no association).',
      },
      {
        k: 'TCL',
        term: 'Central limit theorem',
        def: 'the sampling distribution of the mean approaches normal as n grows, whatever the source distribution.',
      },
      {
        k: 'LGN',
        term: 'Law of large numbers',
        def: 'the sample mean converges to the expected value as n grows; its small-sample caricature is the law of small numbers.',
      },
      {
        k: 'calibración',
        term: 'Calibration',
        def: 'the match between stated confidence and actual hit rate; a calibrated judge is right 90% of the time on claims made at 90%.',
      },
      {
        k: 'bootstrap',
        term: 'Bootstrap',
        def: 'resampling your own data with replacement to estimate a statistic’s sampling distribution with no distributional assumptions.',
      },
    ],
  },
  {
    titulo: 'Robust and nonparametric',
    entradas: [
      {
        k: 'mediana',
        term: 'Median',
        def: 'the middle ordered value; it survives nearly 50% contamination, while a single outlier can drag the mean anywhere.',
      },
      {
        k: 'MAD',
        term: 'Median absolute deviation',
        def: 'the median’s robust partner; it shrugs off outliers that the standard deviation squares into monsters.',
      },
      {
        k: 'colas pesadas',
        term: 'Heavy tails',
        def: 'distributions where extremes happen more often than the normal predicts; delivery times, financial returns, insurance claims.',
      },
      {
        k: 'punto de quiebre',
        term: 'Breakdown point',
        def: 'the largest share of contaminated data an estimator can take before returning an arbitrary value; mean ≈ 0%, median ≈ 50%.',
      },
    ],
  },
  {
    titulo: 'Series and chance',
    entradas: [
      {
        k: 'caminata aleatoria',
        term: 'Random walk',
        def: 'the running sum of independent random steps; it draws “trends” and “streaks” the eye reads as signal but are pure noise.',
      },
      {
        k: 'ruido blanco',
        term: 'White noise',
        def: 'a series of independent zero-mean innovations; the raw material of every random walk.',
      },
      {
        k: 'estacionariedad',
        term: 'Stationarity',
        def: 'a series whose statistical behavior does not change over time; the random walk fails it (its variance grows with t).',
      },
    ],
  },
  {
    titulo: 'ML and decision-making',
    entradas: [
      {
        k: 'AUC',
        term: 'Area under the ROC curve',
        def: 'the chance the model ranks a real positive above a negative; it summarizes discrimination, not calibration.',
      },
      {
        k: 'ROC',
        term: 'ROC curve (receiver operating characteristic)',
        def: 'sensitivity vs. 1−specificity as the decision threshold moves.',
      },
      {
        k: 'sesgo algorítmico',
        term: 'Algorithmic bias',
        def: 'systematic discrimination the model inherits from training data or from differential base rates across groups; the COMPAS case (Machine Bias, ProPublica 2016) is the reference.',
      },
      {
        k: 'dos culturas',
        term: 'The two cultures (Breiman, 2001)',
        def: 'data modeling (infer the mechanism) vs. algorithmic modeling (predict well even if the box is black); the bridge between classical statistics and ML.',
      },
      {
        k: 'validación',
        term: 'Cross-validation',
        def: 'scoring the model on data it never trained on, rotating which part of the sample judges; the standard defense against overfitting.',
      },
      {
        k: 'umbral de decisión',
        term: 'Decision threshold',
        def: 'the cutoff that turns a score into an action; its right place is a ratio of costs, not a statistical number.',
      },
    ],
  },
];

export const GLOSSARY_EN: Record<string, string> = Object.fromEntries(
  GLOSSARY_SECTIONS_EN.flatMap((s) =>
    s.entradas.map((e) => [e.k, `${e.term}: ${e.def}`]),
  ),
);
