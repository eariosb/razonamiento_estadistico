El hilo conductor del curso: cinco ideas que atraviesan todo el programa
Antes de los módulos, conviene explicitar las cinco ideas que deben estar presentes en cada tema, desde la paradoja de Bertrand hasta las redes neuronales profundas. Estas ideas son el ADN del curso:

1. La estadística es cognitivamente antinatural. No es una técnica que "se aprende" y se aplica; es un conjunto de correcciones sistemáticas a intuiciones que persisten incluso en expertos. Kahneman y Tversky demostraron que las ideas subyacentes a la inferencia son contraintuitivas. El curso debe enseñar contra qué intuiciones compite cada método.

2. El Sistema 1 siempre gana si no se le entrena. La distinción entre pensamiento rápido e intuitivo (Sistema 1) y pensamiento lento y analítico (Sistema 2) no es una anécdota de psicología: es la razón por la que la formación estadística existe. Kahneman señaló que el Sistema 1 es "débil en el razonamiento estadístico" aunque sea poderoso para narrativas causales.

3. La falacia de tasa base es el error fundacional. Todo estudiante debe resolver problemas de test diagnóstico con prevalencias bajas antes de aprender fórmulas bayesianas, y debe entender por qué su intuición falla. La insensibilidad a la tasa base se ha documentado persistentemente en estudiantes y profesionales, y se manifiesta en el "abandono abrumador de la epidemiología como factor en el razonamiento diagnóstico".

4. La ley de los números pequeños es una intuición universal. La creencia de que las muestras pequeñas son representativas de la población es tan arraigada que incluso investigadores con formación estadística la exhiben. Kahneman concluyó que "la gente extrapola los resultados de pequeñas muestras a la población total".

5. El ruido es tan grave como el sesgo. No basta con corregir sesgos sistemáticos; la variabilidad no deseada en juicios profesionales es un problema de primer orden, especialmente en medicina, justicia y análisis de riesgos.

Estructura modular del curso
Propongo ocho módulos que recorren el arco completo desde la intuición hasta el aprendizaje automático, con los ejemplos disciplinares integrados en cada módulo.

Módulo	Tema central	Anclaje en Kahneman	Aplicaciones disciplinares
I	Paradojas e intuiciones fundacionales	Heurística de representatividad; ley de números pequeños	Medicina (test diagnóstico); ingeniería (confiabilidad)
II	Probabilidad y el problema de Bayes	Falacia de tasa base; negligencia de la prevalencia	Epidemiología; actuaria; detección de fraude
III	Inferencia y estimación	Anclaje; sobreconfianza en intervalos	Control de calidad; ensayos clínicos; minería (leyes de corte)
IV	Regresión y causalidad	Regresión a la media; ilusión de causalidad	Economía; marketing; ingeniería de petróleos (declinación de producción)
V	Procesos estocásticos y series de tiempo	Disponibilidad; predicción intuitiva	Finanzas; hidrología; mantenimiento predictivo
VI	Estadística no paramétrica y robusta	Resistencia a la contaminación de datos	Investigación de operaciones; logística; datos ambientales
VII	El paradigma bayesiano	Razonamiento bayesiano intuitivo vs. formal	Epidemiología; inteligencia artificial; diagnóstico médico
VIII	Machine learning, deep learning y decisión	Heurísticas en la era algorítmica; ruido en modelos	Ciencia de datos; petróleos; finanzas; automatización industrial
Módulo I: Paradojas e intuiciones fundacionales
Este módulo abre el curso no con definiciones, sino con problemas que revelan el fracaso de la intuición. La paradoja de Bertrand, la paradoja de San Petersburgo, el problema de Monty Hall y el problema de Linda (la "cajera de banco feminista") son el punto de entrada. El objetivo no es resolverlos correctamente de inmediato, sino experimentar la tensión cognitiva que produce el choque entre la respuesta intuitiva y la respuesta correcta.

La ley de los números pequeños de Tversky y Kahneman es el concepto central: la creencia de que las proporciones en muestras pequeñas deben reflejar las proporciones poblacionales. Esto se conecta directamente con la insensibilidad al tamaño de la muestra, uno de los sesgos más documentados en estudiantes universitarios.

Módulo II: Probabilidad y el problema de Bayes
Aquí se introduce el teorema de Bayes no como fórmula, sino como problema cognitivo. El ejemplo paradigmático es el test diagnóstico: se presenta a los estudiantes la prevalencia, la sensibilidad y la especificidad, y se les pide estimar la probabilidad de enfermedad tras un resultado positivo. La mayoría sobreestimará drásticamente. Solo entonces se introduce la fórmula como herramienta de corrección.

Kahneman documentó que la gente juzga la probabilidad por representatividad (similitud con el estereotipo) en lugar de por tasa base. Esto tiene consecuencias directas en epidemiología (interpretación de pruebas), actuaria (evaluación de riesgos) y detección de fraude (falsos positivos en transacciones).

Módulo III: Inferencia y estimación
La inferencia estadística formal —intervalos de confianza, pruebas de hipótesis, estimación puntual— se presenta como corrección sistemática de sesgos intuitivos. El anclaje (la influencia desproporcionada de la primera información recibida) explica por qué los intervalos de confianza subjetivos son demasiado estrechos. La sobreconfianza en la precisión de las estimaciones es un sesgo documentado que afecta a analistas, ingenieros y médicos.

Un ejemplo concreto: en control de calidad, la tendencia intuitiva es reaccionar a cada fluctuación como si fuera una señal de cambio en el proceso, cuando en realidad la mayoría son variación aleatoria. Esto conecta con la regresión a la media, que Kahneman identificó como uno de los conceptos estadísticos más malinterpretados.

Módulo IV: Regresión y causalidad
La regresión es el caballo de batalla de la analítica, pero también el terreno donde más florecen las ilusiones causales. Kahneman y Tversky demostraron que la gente ve causalidad donde solo hay correlación, y que la regresión a la media se interpreta erróneamente como efecto de una intervención.

Aplicaciones: en ingeniería de petróleos, la declinación de producción de un pozo se atribuye a veces a cambios en la estrategia de extracción cuando es simplemente regresión a la media. En marketing, las campañas se evalúan sin controlar la regresión a la media. En economía, la relación entre incentivos y productividad se sobreinterpreta sin diseño experimental.

Módulo V: Procesos estocásticos y series de tiempo
La heurística de disponibilidad —juzgar la probabilidad de un evento por la facilidad con que vienen ejemplos a la mente— distorsiona la percepción de riesgos en series de tiempo. Los analistas sobreestiman la probabilidad de eventos recientes (crisis financieras, fallos de equipos) y subestiman eventos que no han ocurrido en el pasado reciente.

Las series de tiempo requieren pensamiento en procesos: la distinción entre tendencia, estacionalidad y ruido es contraintuitiva. En finanzas, la ilusión de patrones en series aleatorias lleva a estrategias de inversión basadas en "señales" inexistentes. En hidrología, la planificación de recursos hídricos exige modelos estocásticos que la intuición no proporciona.

Módulo VI: Estadística no paramétrica y robusta
La estadística robusta y no paramétrica responde a una realidad que la intuición ignora: los datos reales no siguen distribuciones ideales. Los outliers no son errores a eliminar, sino información sobre la cola de la distribución. En investigación de operaciones, la optimización de rutas o inventarios con datos contaminados requiere métodos robustos. En logística, los tiempos de entrega tienen colas pesadas que la distribución normal no captura.

Kahneman y Tversky mostraron que la gente subestima la frecuencia de eventos extremos y sobreestima la regularidad de los datos. La estadística robusta es, en cierto sentido, la respuesta formal a esa intuición defectuosa.

Módulo VII: El paradigma bayesiano
Aquí se retoma el hilo del Módulo II, pero con profundidad. La inferencia bayesiana se presenta como el marco formal que corresponde al razonamiento que la gente debería hacer pero no hace. Los conceptos de prior, verosimilitud y posterior se introducen a través de ejemplos médicos y epidemiológicos.

La paradoja de Lindley —donde la inferencia bayesiana y la frecuentista dan respuestas contradictorias— es un excelente punto de discusión sobre los fundamentos filosóficos de la estadística. El curso debe mostrar que la elección entre paradigmas no es solo técnica, sino epistemológica.

Módulo VIII: Machine learning, deep learning y decisión
El módulo final conecta todo lo anterior con la revolución algorítmica. El machine learning es, en esencia, estadística aplicada a gran escala, pero su enseñanza actual ha perdido la conexión con los fundamentos estadísticos. El curso debe mostrar que los sesgos cognitivos no desaparecen con más datos: se amplifican si no se controlan.

Ejemplos concretos: los sistemas de scoring crediticio reproducen sesgos de representatividad si los datos históricos los contienen; los modelos de deep learning en diagnóstico médico pueden ignorar la prevalencia si no se incorpora explícitamente. El ruido en las decisiones humanas (el tema del libro Noise) se traduce en ruido algorítmico.

Estrategias pedagógicas
La propuesta de Kahneman y Tversky no fue solo teórica: sugirieron que la enseñanza de la estadística debe ser activa y heurística para superar los sesgos. Esto implica:

Comenzar cada tema con un problema que active el Sistema 1. Presentar la intuición, dejar que falle, y solo entonces introducir la herramienta formal.

Usar simulaciones repetidas. La ley de los números grandes se entiende simulando, no memorizando. Los estudiantes deben ver cómo las proporciones convergen.

Incorporar el debate Kahneman-Gigerenzer. No como curiosidad, sino como parte de la formación epistemológica. Gigerenzer argumenta que los heurísticos son adaptaciones ecológicas, no errores. Esto obliga a los estudiantes a preguntarse cuándo la racionalidad formal y la ecológica divergen.

Evaluación por proyectos disciplinares. Cada estudiante aplica los conceptos a su campo: un epidemiólogo analiza un test diagnóstico, un ingeniero de minas evalúa leyes de corte, un analista financiero examina series de tiempo.

El valor diferencial del curso
Lo que distingue esta propuesta de un curso de estadística convencional es que no trata los sesgos como un tema aparte al final del programa, sino como el hilo que conecta todos los módulos. La estadística no se presenta como un conjunto de herramientas neutrales, sino como una tecnología cognitiva que existe precisamente porque la mente humana no razona estadísticamente de forma natural.