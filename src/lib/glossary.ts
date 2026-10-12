/**
 * Glosario del curso: siglas, heurísticas, sesgos y conceptos con su forma
 * expandida en español y, cuando el uso internacional lo exige, el original
 * en inglés. Textos cortos de una línea; el tooltip quiere refrescar la
 * memoria, no dar una lección.
 */
export const GLOSSARY: Record<string, string> = {
  // Los dos sistemas
  S1: 'Sistema 1: el pensamiento rápido, automático e intuitivo; excelente para narrativas, débil para probabilidades. Kahneman: siempre gana si no se le entrena.',
  S2: 'Sistema 2: el pensamiento lento, analítico y esforzado; el que verifica, calcula y corrige al Sistema 1 cuando algo huele mal.',
  Kahneman:
    'Daniel Kahneman (1934–2024): psicólogo, Nobel de Economía 2002; con Amos Tversky documentó las heurísticas y sesgos del juicio bajo incertidumbre. Thinking, Fast and Slow (2011) es el texto guía del curso.',
  Tversky:
    'Amos Tversky (1937–1996): psicólogo, socio intelectual de Kahneman; los experimentos de la ley de los números pequeños, Linda y la representatividad son suyos en gran parte.',
  Gigerenzer:
    'Gerd Gigerenzer: psicólogo alemán, director del debate contra Kahneman; sostiene que las heurísticas son adaptaciones ecológicas útiles y que las frecuencias naturales curan la falacia de tasa base.',

  // Heurísticas
  representatividad:
    'Heurística de representatividad: juzgar la probabilidad por parecido a un estereotipo en lugar de por la tasa base; origen de la falacia de conjunción (Linda) y de la ley de los números pequeños.',
  disponibilidad:
    'Heurística de disponibilidad: juzgar la frecuencia o probabilidad de un evento por la facilidad con que vienen ejemplos a la mente; la cobertura mediática distorsiona la percepción de riesgo.',
  anclaje:
    'Anclaje y ajuste: la primera cifra disponible arrastra la estimación, y el ajuste posterior suele quedarse corto; explica los intervalos de confianza subjetivos demasiado estrechos.',
  'afecto':
    'Heurística de afecto: juzgar riesgos y beneficios por la emoción que evocan; lo que da miedo parece frecuente, lo que agrada parece seguro.',

  // Sesgos y falacias
  'tasa base':
    'Tasa base (base rate): la prevalencia o frecuencia a priori de una clase en la población; ignorarla es la falacia de tasa base, el error fundacional del curso.',
  'falacia de conjunción':
    'Falacia de conjunción: juzgar P(A y B) mayor que P(A), violando la lógica de conjuntos; el problema de Linda (cajera y feminista) es su demostración canónica (Tversky y Kahneman, 1983).',
  LNP: 'Ley de los números pequeños: la creencia de que muestras pequeñas deben reproducir las proporciones poblacionales; esperar que 10 lanzamientos se comporten como 1000 (Tversky y Kahneman, 1971).',
  'falacia del jugador':
    'Falacia del jugador: creer que una racha se "compensa" en el siguiente ensayo independiente (cinco caras y "ya toca" cruz); confundir la memoria del jugador con la de la moneda.',
  'regresión a la media':
    'Regresión a la media: tras un valor extremo, el siguiente tiende a acercarse al promedio por puro azar; explica la mayoría de las "mejoras" tras intervenir lo peor y de los "castigos" que parecen funcionar.',
  'paradoja de Simpson':
    'Paradoja de Simpson: una tendencia visible en el dato agregado se invierte o desaparece al desagregar por un confusor; el caso Berkeley de admisiones es el ejemplo clásico.',
  'correlación espuria':
    'Correlación espuria: asociación alta entre dos series por azar o por una tercera variable; la falacia cum hoc ergo propter hoc.',
  sobreconfianza:
    'Sobreconfianza: intervalos de incertidumbre demasiado estrechos respecto de la frecuencia real de acierto; en calibración, declarar 90% y acertar 50%.',
  'sesgo de confirmación':
    'Sesgo de confirmación: buscar, recordar y pesar preferentemente la evidencia que apoya la creencia previa; el motor silencioso del p-hacking.',
  ruido:
    'Ruido (Noise, Kahneman-Sibony-Sunstein, 2021): variabilidad no deseada en juicios que deberían coincidir; distinto del sesgo: el sesgo empuja en una dirección, el ruido dispersa sin patrón.',

  // Probabilidad y Bayes
  prevalencia:
    'Prevalencia: la proporción de la población que tiene la condición en un momento dado; en el test diagnóstico es la tasa base que la intuición olvida.',
  sensibilidad:
    'Sensibilidad: P(test+ | enfermo); la probabilidad de detectar la enfermedad cuando está presente.',
  especificidad:
    'Especificidad: P(test− | sano); la probabilidad de que una persona sana dé negativo.',
  VPP: 'Valor predictivo positivo: P(enfermo | test+); la pregunta que el paciente hace y la que la intuición casi siempre sobreestima cuando la prevalencia es baja.',
  VPN: 'Valor predictivo negativo: P(sano | test−); suele ser alto en enfermedades raras aun con tests mediocres.',
  'frecuencias naturales':
    'Frecuencias naturales: expresar probabilidades condicionales como conteos de una población (de cada 1000 personas, 1 enferma, 51 positivas); el formato que Gigerenzer y Hoffrage (1995) mostraron que "cura" la falacia de tasa base.',
  verosimilitud:
    'Verosimilitud (likelihood): P(datos | hipótesis); lo que los datos dicen de cada hipótesis, ingrediente central de Bayes y de los tests de razón de verosimilitud.',
  prior:
    'Prior o previa: la distribución de creencias sobre el parámetro antes de ver los datos; en el test diagnóstico, la prevalencia es la prior.',
  posterior:
    'Posterior: la distribución de creencias tras ver los datos; prior × verosimilitud, normalizada.',
  'odds':
    'Odds o momio: p/(1−p); la forma en que Bayes se escribe más simple: odds posterior = odds previo × factor de Bayes.',
  'factor de Bayes':
    'Factor de Bayes: la razón de verosimilitudes P(datos|H₁)/P(datos|H₀); cuánto mueven los datos las creencias, en escala multiplicativa.',

  // Inferencia y estimación
  IC: 'Intervalo de confianza (CI): el rango de valores del parámetro compatibles con los datos al nivel declarado; reportar siempre junto al estimador.',
  EE: 'Error estándar (SE): la desviación estándar del estimador entre muestras repetidas; decrece como 1/√n.',
  p: 'Valor p (p-value): probabilidad de un resultado al menos tan extremo como el observado, bajo H₀; no es la probabilidad de que H₀ sea cierta.',
  H0: 'Hipótesis nula: el modelo concreto que el test pone a prueba (típicamente ausencia de efecto o de asociación).',
  TCL: 'Teorema central del límite: la distribución de la media muestral se acerca a la normal al crecer n, casi cualquiera sea la distribución de origen.',
  LGN: 'Ley de los grandes números: la media muestral converge al valor esperado al crecer n; su caricatura en muestras chicas es la LNP.',
  calibración:
    'Calibración: coincidencia entre la confianza declarada y la frecuencia real de aciertos; un juez calibrado acierta el 90% de lo que afirma al 90%.',
  bootstrap:
    'Bootstrap: remuestreo con reemplazo de los propios datos para estimar la distribución muestral de un estadístico sin supuestos distribucionales.',

  // Robustez y no paramétrica
  mediana:
    'Mediana: el valor central ordenado; resiste hasta casi 50% de contaminación, frente a la media que un solo outlier arrastra.',
  MAD: 'Desviación absoluta respecto de la mediana: la compañera robusta de la mediana; tolera outliers que la desviación estándar amplifica al cuadrado.',
  'colas pesadas':
    'Colas pesadas (heavy tails): distribuciones donde los extremos ocurren con más frecuencia que la normal predice; tiempos de entrega, retornos financieros, siniestros.',
  'punto de quiebre':
    'Punto de quiebre (breakdown point): la fracción máxima de datos contaminados que un estimador tolera antes de dar un resultado arbitrario; media ≈ 0%, mediana ≈ 50%.',

  // Series y azar
  'caminata aleatoria':
    'Caminata aleatoria (random walk): suma acumulada de pasos aleatorios independientes; produce "tendencias" y "rachas" que el ojo interpreta como señal pero son ruido puro.',
  'ruido blanco':
    'Ruido blanco: serie de innovaciones independientes con media cero; el ingrediente de toda caminata aleatoria.',
  estacionariedad:
    'Estacionariedad: propiedad de una serie cuyo comportamiento estadístico no cambia en el tiempo; la caminata aleatoria no la cumple (su varianza crece con t).',

  // ML y decisión
  AUC: 'Área bajo la curva ROC: probabilidad de que el modelo ranque un positivo real por encima de un negativo; resume discriminación, no calibración.',
  ROC: 'Curva ROC (receiver operating characteristic): sensibilidad contra 1−especificidad al variar el umbral de decisión.',
  'sesgo algorítmico':
    'Sesgo algorítmico: discriminación sistemática que el modelo hereda de los datos de entrenamiento o de la tasa base diferencial entre grupos; el caso COMPAS (Machine Bias, ProPublica 2016) es el referente.',
  'dos culturas':
    'Las dos culturas (Breiman, 2001): modelado de datos (inferir el mecanismo) vs. modelado algorítmico (predecir bien aunque la caja sea negra); puente entre estadística clásica y ML.',
};
