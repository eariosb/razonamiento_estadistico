/**
 * Glosario del curso: siglas, heurísticas, sesgos y conceptos con su forma
 * expandida en español y, cuando el uso internacional lo exige, el original
 * en inglés. Textos cortos de una línea; el tooltip quiere refrescar la
 * memoria, no dar una lección.
 *
 * `GLOSSARY_SECTIONS` alimenta la página /glosario; `GLOSSARY` (derivado)
 * alimenta los tooltips de <Term k="…">.
 */
export interface GlossaryEntry {
  /** Clave estable que usan los <Term k="…"> del MDX. */
  k: string;
  /** Nombre del término tal como se muestra en el índice y el tooltip. */
  term: string;
  /** Definición breve, una línea. */
  def: string;
}

export interface GlossarySection {
  titulo: string;
  entradas: GlossaryEntry[];
}

export const GLOSSARY_SECTIONS: GlossarySection[] = [
  {
    titulo: 'Los dos sistemas',
    entradas: [
      {
        k: 'S1',
        term: 'Sistema 1',
        def: 'el pensamiento rápido, automático e intuitivo; excelente para narrativas, débil para probabilidades. Kahneman: siempre gana si no se le entrena.',
      },
      {
        k: 'S2',
        term: 'Sistema 2',
        def: 'el pensamiento lento, analítico y esforzado; el que verifica, calcula y corrige al Sistema 1 cuando algo huele mal.',
      },
      {
        k: 'Kahneman',
        term: 'Daniel Kahneman (1934–2024)',
        def: 'psicólogo, Nobel de Economía 2002; con Amos Tversky documentó las heurísticas y sesgos del juicio bajo incertidumbre. Thinking, Fast and Slow (2011) es el texto guía del curso.',
      },
      {
        k: 'Tversky',
        term: 'Amos Tversky (1937–1996)',
        def: 'psicólogo, socio intelectual de Kahneman; los experimentos de la ley de los números pequeños, Linda y la representatividad son suyos en gran parte.',
      },
      {
        k: 'Gigerenzer',
        term: 'Gerd Gigerenzer',
        def: 'psicólogo alemán, director del debate contra Kahneman; sostiene que las heurísticas son adaptaciones ecológicas útiles y que las frecuencias naturales curan la falacia de tasa base.',
      },
      {
        k: 'conjuntos anidados',
        term: 'Conjuntos anidados (nested sets)',
        def: 'tesis de Barbey y Sloman (2007): la mente razona con conjuntos, no con probabilidades de eventos; "diez de cien" se procesa, "10% de una persona" no.',
      },
    ],
  },
  {
    titulo: 'Heurísticas',
    entradas: [
      {
        k: 'representatividad',
        term: 'Heurística de representatividad',
        def: 'juzgar la probabilidad por parecido a un estereotipo en lugar de por la tasa base; origen de la falacia de conjunción (Linda) y de la ley de los números pequeños.',
      },
      {
        k: 'disponibilidad',
        term: 'Heurística de disponibilidad',
        def: 'juzgar la frecuencia o probabilidad de un evento por la facilidad con que vienen ejemplos a la mente; la cobertura mediática distorsiona la percepción de riesgo.',
      },
      {
        k: 'anclaje',
        term: 'Anclaje y ajuste',
        def: 'la primera cifra disponible arrastra la estimación, y el ajuste posterior suele quedarse corto; explica los intervalos de confianza subjetivos demasiado estrechos.',
      },
      {
        k: 'afecto',
        term: 'Heurística de afecto',
        def: 'juzgar riesgos y beneficios por la emoción que evocan; lo que da miedo parece frecuente, lo que agrada parece seguro.',
      },
    ],
  },
  {
    titulo: 'Sesgos y falacias',
    entradas: [
      {
        k: 'tasa base',
        term: 'Tasa base (base rate)',
        def: 'la prevalencia o frecuencia a priori de una clase en la población; ignorarla es la falacia de tasa base, el error fundacional del curso.',
      },
      {
        k: 'falacia de conjunción',
        term: 'Falacia de conjunción',
        def: 'juzgar P(A y B) mayor que P(A), violando la lógica de conjuntos; el problema de Linda (cajera y feminista) es su demostración canónica (Tversky y Kahneman, 1983).',
      },
      {
        k: 'LNP',
        term: 'Ley de los números pequeños',
        def: 'la creencia de que muestras pequeñas deben reproducir las proporciones poblacionales; esperar que 10 lanzamientos se comporten como 1000 (Tversky y Kahneman, 1971).',
      },
      {
        k: 'utilidad',
        term: 'Utilidad',
        def: 'lo que un resultado vale para quien lo recibe, no lo que pesa en la balanza; Bernoulli la inventó para resolver San Petersburgo: la utilidad crece más lento que la riqueza.',
      },
      {
        k: 'teoría prospectiva',
        term: 'Teoría prospectiva (Kahneman y Tversky, 1979)',
        def: 'cómo se decide de verdad: desde un punto de referencia, con aversión a la pérdida, sensibilidad al encuadre y ponderación no lineal de probabilidades.',
      },
      {
        k: 'sustitución de atributos',
        term: 'Sustitución de atributos (Kahneman y Frederick, 2002)',
        def: 'cuando la pregunta es difícil, la mente responde una más fácil: Linda cambia probabilidad por parecido; es el mecanismo que une los sesgos del curso.',
      },
      {
        k: 'falacia del jugador',
        term: 'Falacia del jugador',
        def: 'creer que una racha se "compensa" en el siguiente ensayo independiente (cinco caras y "ya toca" cruz); confundir la memoria del jugador con la de la moneda.',
      },
      {
        k: 'regresión a la media',
        term: 'Regresión a la media',
        def: 'tras un valor extremo, el siguiente tiende a acercarse al promedio por puro azar; explica la mayoría de las "mejoras" tras intervenir lo peor y de los "castigos" que parecen funcionar.',
      },
      {
        k: 'paradoja de Simpson',
        term: 'Paradoja de Simpson',
        def: 'una tendencia visible en el dato agregado se invierte o desaparece al desagregar por un confusor; el caso Berkeley de admisiones es el ejemplo clásico.',
      },
      {
        k: 'correlación espuria',
        term: 'Correlación espuria',
        def: 'asociación alta entre dos series por azar o por una tercera variable; la falacia cum hoc ergo propter hoc.',
      },
      {
        k: 'sobreconfianza',
        term: 'Sobreconfianza',
        def: 'intervalos de incertidumbre demasiado estrechos respecto de la frecuencia real de acierto; en calibración, declarar 90% y acertar 50%.',
      },
      {
        k: 'sesgo de confirmación',
        term: 'Sesgo de confirmación',
        def: 'buscar, recordar y pesar preferentemente la evidencia que apoya la creencia previa; el motor silencioso del p-hacking.',
      },
      {
        k: 'ruido',
        term: 'Ruido (Noise, Kahneman-Sibony-Sunstein, 2021)',
        def: 'variabilidad no deseada en juicios que deberían coincidir; distinto del sesgo: el sesgo empuja en una dirección, el ruido dispersa sin patrón.',
      },
      {
        k: 'falacia del fiscal',
        term: 'Falacia del fiscal',
        def: 'intercambiar P(evidencia | inocente) por P(inocente | evidencia); el error que condenó a Sally Clark y que condena a quien olvida la tasa base.',
      },
    ],
  },
  {
    titulo: 'Probabilidad y Bayes',
    entradas: [
      {
        k: 'prevalencia',
        term: 'Prevalencia',
        def: 'la proporción de la población que tiene la condición en un momento dado; en el test diagnóstico es la tasa base que la intuición olvida.',
      },
      {
        k: 'sensibilidad',
        term: 'Sensibilidad',
        def: 'P(test+ | enfermo); la probabilidad de detectar la enfermedad cuando está presente.',
      },
      {
        k: 'especificidad',
        term: 'Especificidad',
        def: 'P(test− | sano); la probabilidad de que una persona sana dé negativo.',
      },
      {
        k: 'VPP',
        term: 'Valor predictivo positivo',
        def: 'P(enfermo | test+); la pregunta que el paciente hace y la que la intuición casi siempre sobreestima cuando la prevalencia es baja.',
      },
      {
        k: 'VPN',
        term: 'Valor predictivo negativo',
        def: 'P(sano | test−); suele ser alto en enfermedades raras aun con tests mediocres.',
      },
      {
        k: 'frecuencias naturales',
        term: 'Frecuencias naturales',
        def: 'expresar probabilidades condicionales como conteos de una población (de cada 1000 personas, 1 enferma, 51 positivas); el formato que Gigerenzer y Hoffrage (1995) mostraron que "cura" la falacia de tasa base.',
      },
      {
        k: 'verosimilitud',
        term: 'Verosimilitud (likelihood)',
        def: 'P(datos | hipótesis); lo que los datos dicen de cada hipótesis, ingrediente central de Bayes y de los tests de razón de verosimilitud.',
      },
      {
        k: 'prior',
        term: 'Prior o previa',
        def: 'la distribución de creencias sobre el parámetro antes de ver los datos; en el test diagnóstico, la prevalencia es la prior.',
      },
      {
        k: 'posterior',
        term: 'Posterior',
        def: 'la distribución de creencias tras ver los datos; prior × verosimilitud, normalizada.',
      },
      {
        k: 'odds',
        term: 'Odds o momio',
        def: 'p/(1−p); la forma en que Bayes se escribe más simple: odds posterior = odds previo × factor de Bayes.',
      },
      {
        k: 'factor de Bayes',
        term: 'Factor de Bayes',
        def: 'la razón de verosimilitudes P(datos|H₁)/P(datos|H₀); cuánto mueven los datos las creencias, en escala multiplicativa.',
      },
    ],
  },
  {
    titulo: 'Inferencia y estimación',
    entradas: [
      {
        k: 'IC',
        term: 'Intervalo de confianza (CI)',
        def: 'el rango de valores del parámetro compatibles con los datos al nivel declarado; reportar siempre junto al estimador.',
      },
      {
        k: 'EE',
        term: 'Error estándar (SE)',
        def: 'la desviación estándar del estimador entre muestras repetidas; decrece como 1/√n.',
      },
      {
        k: 'p',
        term: 'Valor p (p-value)',
        def: 'probabilidad de un resultado al menos tan extremo como el observado, bajo H₀; no es la probabilidad de que H₀ sea cierta.',
      },
      {
        k: 'potencia',
        term: 'Potencia estadística',
        def: 'probabilidad de detectar un efecto que sí existe; un estudio con poca potencia que no encuentra nada no probó la ausencia.',
      },
      {
        k: 'falacia de planificación',
        term: 'Falacia de planificación',
        def: 'estimar plazos y costos por dentro, sumando tareas, en lugar de consultar cuánto tardaron proyectos parecidos; la Ópera de Sídney es el monumento.',
      },
      {
        k: 'vista desde afuera',
        term: 'Vista desde afuera (outside view)',
        def: 'pronosticar por clase de referencia: cuánto tardaron casos de la misma clase, no cuánto tardaría el tuyo si todo saliera según el plan.',
      },
      {
        k: 'H0',
        term: 'Hipótesis nula',
        def: 'el modelo concreto que el test pone a prueba (típicamente ausencia de efecto o de asociación).',
      },
      {
        k: 'TCL',
        term: 'Teorema central del límite',
        def: 'la distribución de la media muestral se acerca a la normal al crecer n, casi cualquiera sea la distribución de origen.',
      },
      {
        k: 'LGN',
        term: 'Ley de los grandes números',
        def: 'la media muestral converge al valor esperado al crecer n; su caricatura en muestras chicas es la LNP.',
      },
      {
        k: 'calibración',
        term: 'Calibración',
        def: 'coincidencia entre la confianza declarada y la frecuencia real de aciertos; un juez calibrado acierta el 90% de lo que afirma al 90%.',
      },
      {
        k: 'bootstrap',
        term: 'Bootstrap',
        def: 'remuestreo con reemplazo de los propios datos para estimar la distribución muestral de un estadístico sin supuestos distribucionales.',
      },
    ],
  },
  {
    titulo: 'Robustez y no paramétrica',
    entradas: [
      {
        k: 'mediana',
        term: 'Mediana',
        def: 'el valor central ordenado; resiste hasta casi 50% de contaminación, frente a la media que un solo outlier arrastra.',
      },
      {
        k: 'MAD',
        term: 'Desviación absoluta respecto de la mediana',
        def: 'la compañera robusta de la mediana; tolera outliers que la desviación estándar amplifica al cuadrado.',
      },
      {
        k: 'colas pesadas',
        term: 'Colas pesadas (heavy tails)',
        def: 'distribuciones donde los extremos ocurren con más frecuencia que la normal predice; tiempos de entrega, retornos financieros, siniestros.',
      },
      {
        k: 'punto de quiebre',
        term: 'Punto de quiebre (breakdown point)',
        def: 'la fracción máxima de datos contaminados que un estimador tolera antes de dar un resultado arbitrario; media ≈ 0%, mediana ≈ 50%.',
      },
    ],
  },
  {
    titulo: 'Series y azar',
    entradas: [
      {
        k: 'caminata aleatoria',
        term: 'Caminata aleatoria (random walk)',
        def: 'suma acumulada de pasos aleatorios independientes; produce "tendencias" y "rachas" que el ojo interpreta como señal pero son ruido puro.',
      },
      {
        k: 'ruido blanco',
        term: 'Ruido blanco',
        def: 'serie de innovaciones independientes con media cero; el ingrediente de toda caminata aleatoria.',
      },
      {
        k: 'estacionariedad',
        term: 'Estacionariedad',
        def: 'propiedad de una serie cuyo comportamiento estadístico no cambia en el tiempo; la caminata aleatoria no la cumple (su varianza crece con t).',
      },
    ],
  },
  {
    titulo: 'ML y decisión',
    entradas: [
      {
        k: 'AUC',
        term: 'Área bajo la curva ROC',
        def: 'probabilidad de que el modelo ranque un positivo real por encima de un negativo; resume discriminación, no calibración.',
      },
      {
        k: 'ROC',
        term: 'Curva ROC (receiver operating characteristic)',
        def: 'sensibilidad contra 1−especificidad al variar el umbral de decisión.',
      },
      {
        k: 'sesgo algorítmico',
        term: 'Sesgo algorítmico',
        def: 'discriminación sistemática que el modelo hereda de los datos de entrenamiento o de la tasa base diferencial entre grupos; el caso COMPAS (Machine Bias, ProPublica 2016) es el referente.',
      },
      {
        k: 'dos culturas',
        term: 'Las dos culturas (Breiman, 2001)',
        def: 'modelado de datos (inferir el mecanismo) vs. modelado algorítmico (predecir bien aunque la caja sea negra); puente entre estadística clásica y ML.',
      },
      {
        k: 'validación',
        term: 'Validación cruzada',
        def: 'evaluar el modelo sobre datos que no usó para entrenar, rotando qué parte de la muestra juzga; la defensa estándar contra el sobreajuste.',
      },
      {
        k: 'umbral de decisión',
        term: 'Umbral de decisión',
        def: 'el corte que convierte un score en acción; su posición correcta es un cociente de costos, no un número estadístico.',
      },
    ],
  },
];

function toRecord(sections: GlossarySection[]): Record<string, string> {
  return Object.fromEntries(
    sections.flatMap((s) =>
      s.entradas.map((e) => [e.k, `${e.term}: ${e.def}`]),
    ),
  );
}

export const GLOSSARY: Record<string, string> = toRecord(GLOSSARY_SECTIONS);

/** Secciones del glosario en el idioma pedido; inglés desde glossary.en.ts. */
export async function getGlossarySections(
  locale: string,
): Promise<GlossarySection[]> {
  if (locale === 'en') {
    const { GLOSSARY_SECTIONS_EN } = await import('@/lib/glossary.en');
    return GLOSSARY_SECTIONS_EN;
  }
  return GLOSSARY_SECTIONS;
}

/** Mapa clave → texto de tooltip para <Term>, por idioma. */
export async function getGlossary(
  locale: string,
): Promise<Record<string, string>> {
  return toRecord(await getGlossarySections(locale));
}
