1. Sistemas de diseño, UI y recursos de inspiración visual
Repositorio	Descripción	Relevancia para el curso
Lucas-vdr-a11y/free-design-md-reference-collection	77 referencias de sistemas de diseño en formato DESIGN.md de Google, con tokens machine-readable, análisis de tipografía, layout, color y profundidad. Licencia CC0-1.0.	Base directa para definir el sistema de diseño minimalista del curso: tipografía editorial, paletas monocromáticas, spacing controlado. Los tokens pueden alimentar Tailwind CSS v4.
Axtillar/Cipher	Portafolio creativo con Next.js 16, React 19, Tailwind v4, GSAP para animaciones scroll-triggered, Framer Motion para componentes, Radix UI y tipografía editorial (Bebas Neue + IBM Plex Sans/Mono).	Referencia de arquitectura para el curso: muestra cómo integrar animación declarativa, tipografía editorial y layout grid-based sin sacrificar rendimiento.
mobalti/open-props-interfaces	Interfaces responsivas construidas con Open Props, incluyendo carousels con scroll-driven animations y storefronts con Next.js.	Patrones de componentes reutilizables para el catálogo de ejemplos interactivos.
jowel-ahmed-design-system	Design system accesible con React 18/19, TypeScript, Tailwind v4, Radix UI, Framer Motion y Style Dictionary v4 para design tokens.	Plantilla directa para el sistema de componentes del curso, con tokens que separan color, tipografía y motion.
Criterio de selección: el diseño del curso debe ser minimalista funcional, donde el color se reserve exclusivamente para codificar información estadística (intervalos, densidades, residuos) y no para decorar. Estos repositorios ofrecen sistemas ya validados que cumplen ese principio.

2. Animación y motion design
Repositorio	Descripción	Relevancia
framer/motion	Librería de animación y gestos para React, con motor de motion acelerado por hardware, transiciones declarativas, layout interpolation y estados de animación.	Núcleo del motion del curso: transiciones que revelan la brecha entre intuición y formalismo, layout animations para tablas que cambian de estado, y gestos para drag de outliers.
react-spring/react-spring	Librería de animación basada en física de resortes (spring physics).	Ideal para simulaciones donde el movimiento debe sentirse natural: la convergencia de una caminata aleatoria, la actualización de una posterior bayesiana.
chenglou/react-motion	Alternativa de animación basada en física de resortes, con API declarativa.	Referencia histórica y opción ligera para micro-interacciones.
okikio/spring-easing	Utilidad de easing tipo resorte compatible con GSAP, anime.js, Framer Motion y WAAPI.	Útil para unificar el lenguaje de motion si se combinan librerías.
dylanfeltus/skills — motion-design-patterns	Skill de agente que documenta patrones de Framer Motion para React: springs, staggers, layout animations, micro-interacciones, scroll effects y page transitions.	Documenta directamente cómo implementar el motion del curso con agentes de IA, alineado con TanStack Intent.
Criterio de selección: el motion del curso no es decorativo. Cada transición debe revelar información: mostrar cómo cambia una posterior, cómo un outlier desplaza la media, cómo un p-valor oscila bajo violación de supuestos. Framer Motion y React Spring son los estándares para este tipo de motion informativo.

3. Educación estadística interactiva (Shiny + R)
Repositorio	Descripción	Relevancia
HaoWang47/intro-stats (ShinyEd)	Aplicaciones Shiny para estadística introductoria: Teorema Central del Límite (medias y proporciones), juego de correlación, calculadora de distribuciones, diagnósticos de regresión lineal simple.	Base directa para los Módulos I, III y IV del curso. Los diagnósticos de regresión son especialmente relevantes para el ejemplo de regresión a la media.
r-for-educators/Shiny-Apps-for-Education	Colección de enlaces y código fuente para recursos de educación estadística en Shiny, incluyendo Burro Data Explorer y LearnR.	Repositorio agregador que permite descubrir apps adicionales para cada módulo.
StatisticTeach1 (CRAN)	Herramienta interactiva para estadística y probabilidad, con interfaz que permite explorar y visualizar conceptos estadísticos de forma intuitiva: descriptiva, distribuciones de probabilidad para variables continuas y cualitativas.	Referencia para el diseño de la interfaz de exploración intuitiva en los Módulos I y II.
STATISTICS 101, 201, 202	Tres aplicaciones web interactivas open-source construidas con R y Shiny para apoyar la enseñanza de estadística y probabilidad introductorias.	Modelo de estructura modular por niveles que puede inspirar la progresión del curso.
Criterio de selección: estos repositorios demuestran que las simulaciones estadísticas interactivas son viables con R, y ofrecen código fuente directamente reutilizable o adaptables al stack Next.js + WebR del curso.

4. Simulación y modelado basado en agentes
Repositorio	Descripción	Lenguaje	Relevancia
projectmesa/mesa	Librería open-source para modelado basado en agentes, ideal para simular sistemas complejos y explorar comportamientos emergentes. 2.8k stars.	Python	Referencia conceptual para simulaciones de comportamiento colectivo en el Módulo V (procesos estocásticos) y Módulo VIII (decisión algorítmica).
scottpdo/flocc	Modelado basado en agentes en JavaScript, ejecutable en navegador o servidor. Incluye ABM en React con Flocc.js para simulaciones de comportamiento emergente.	JavaScript	La opción más directamente integrable con Next.js: permite simulaciones de agentes sin salir del ecosistema TypeScript/React.
NetLogo/NetLogo	Entorno de modelado multi-agente para científicos, profesores y estudiantes. 1k stars.	HTML/Java	Referencia pedagógica clásica; su filosofía de "turtles, patches and links" es un modelo de interfaz accesible para simulación.
jofmi/agentpy	Framework open-source para desarrollo y análisis de modelos basados en agentes. 338 stars.	Python	Alternativa ligera a Mesa; útil como referencia de API.
EpiModel/EpiModel	Modelado matemático de dinámicas de enfermedades infecciosas. 250 stars.	R	Directamente relevante para tu investigación en historia de la salud y epidemiología. Modela difusión de enfermedades con agentes.
noncomputable/AgentMaps	Simulaciones sociales sobre mapas reales; modelado basado en agentes para la web. 927 stars.	JavaScript	Potencial para ejemplos espaciales en epidemiología o logística.
Criterio de selección: flocc es la opción natural para el stack del curso por ser JavaScript/TypeScript y ejecutarse en el navegador. Mesa y EpiModel sirven como referencia conceptual para el diseño de las simulaciones en R ejecutadas vía WebR.

5. Kahneman, sesgos cognitivos y psicología del juicio
Repositorio	Descripción	Relevancia
antopag/cognitive-biases-llm	Repositorio de investigación sobre sesgos cognitivos en LLMs, con artefactos open-source archivados en Zenodo.	Conexión directa entre sesgos Kahneman-Tversky y modelos de lenguaje; relevante para el Módulo VIII.
Rayraegah/bias-viz	Visualización del "cognitive bias codex", el mapa de sesgos cognitivos.	Referencia visual para el catálogo de sesgos del curso; puede inspirar una visualización interactiva del codex.
JohnStarich/cognitive-bias	Juego para explorar sesgos cognitivos que experimentamos en la vida diaria.	Modelo de gamificación para el Módulo I: el estudiante experimenta el sesgo antes de que se le explique.
rand-net/human-biases	Lista de sesgos cognitivos humanos en formato de datos (Python).	Fuente de datos estructurada para construir el catálogo interactivo de sesgos.
wesslen/vast2017-anchoringeffect	Materiales suplementarios del paper de Cho et al. (2017) "The Anchoring Effect in Decision-Making with Visual Analytics".	Investigación empírica sobre anclaje en analítica visual; conecta directamente con el Módulo III.
MacCracken/bodh	Repositorio de psicología que cubre memoria de trabajo (Baddeley), teoría de proceso dual (Kahneman), teoría de las perspectivas (Kahneman/Tversky), utilidad esperada y racionalidad limitada.	Compendio conceptual que puede servir como referencia bibliográfica estructurada.
expert-kahneman (SkillsMP)	Agent Skill que carga el marco de economía conductual y sesgos cognitivos de Kahneman para auditorías de calidad de decisión y detección de sesgos.	Meta-relevante: un skill de agente que enseña a los agentes de IA a razonar sobre sesgos. Alineado con TanStack Intent.
Criterio de selección: estos repositorios cubren el espectro desde la teoría (bodh) hasta la visualización (bias-viz), la gamificación (cognitive-bias) y la aplicación a LLMs (cognitive-biases-llm). El skill expert-kahneman es particularmente valioso porque ejemplifica cómo el curso puede publicar sus propios skills para agentes.

6. Estadística bayesiana interactiva
Repositorio	Descripción	Relevancia
Shiny dashboard para estadística bayesiana	Dashboard interactivo en R Shiny para explorar estadística bayesiana. Visualiza distribuciones prior y posterior para modelos Binomial, Poisson y Normal, con herramientas de simulación MCMC integradas.	Directamente alineado con el Módulo VII. Código fuente en R que puede ejecutarse vía WebR en el navegador.
flyaflya/causact	Paquete R para acelerar flujos de trabajo de inferencia bayesiana computacional a través de visualización interactiva de modelos y sus salidas.	Ejemplo de cómo visualizar DAGs y posterior de forma integrada. Relevante para el puente entre Módulo IV (causalidad) y Módulo VII (Bayes).
adamkurth/understand-bayes-nonparametrics	Repositorio educativo que combina Bayes y métodos no paramétricos con output HTML interactivo y R Markdown.	Conecta los Módulos VI y VII.
paulgovan/BayesianNetwork	Aplicación Shiny para crear modelos de redes bayesianas interactivas, aprender estructura y parámetros, y utilidades de análisis de red.	Relevante para el ejemplo de actualización secuencial de creencias y para redes causales.
probviz	Visualizador interactivo de distribuciones de probabilidad con interfaz Streamlit, API Python tipada, y toolkits para fitting, Monte Carlo y testing estadístico.	Referencia de API para el diseño del componente de distribuciones interactivas.
vizdraws (CRAN)	Crea visualizaciones interactivas usando draws de distribuciones prior y posterior.	Inspiración directa para la visualización de la actualización bayesiana en tiempo real.
Criterio de selección: el Módulo VII requiere que el estudiante vea la actualización de creencias con cada observación. Estos repositorios ofrecen implementaciones en R que pueden adaptarse a WebR, y algunos en Python/Streamlit que sirven como referencia de UX.

7. Visualización de datos con D3 y React
Repositorio	Descripción	Relevancia
nteract/semiotic	Framework de visualización de datos que combina React y D3. 2.4k stars.	La opción más madura para el stack del curso: permite usar D3 dentro de componentes React con API declarativa.
bkrem/react-d3-tree	Componente React para crear árboles D3 interactivos. 1k stars.	Útil para diagramas de decisión y árboles bayesianos.
danielcaldas/react-d3-graph	Grafos interactivos y configurables con React y D3.	Para diagramas causales (DAGs) y redes de sesgos.
oytla/carbon-charts	Framework robusto de dataviz implementado con D3 y TypeScript, framework-agnostic (Vanilla JS, React, Angular, Svelte, Vue).	Alternativa a Semiotic con tipado fuerte en TypeScript.
taehyeon3657/chartLibrary	Librería de charts modular construida sobre D3 y React, con soporte TypeScript nativo para line y bar charts.	Referencia ligera para componentes de charts reutilizables.
uber/react-vis	Librería declarativa de visualización de datos basada en componentes React, con bloques reutilizables para charts interactivos.	Referencia de API declarativa.
Criterio de selección: Semiotic es la recomendación principal por su madurez y su enfoque React-native con D3. React-d3-tree y react-d3-graph cubren necesidades específicas de diagramas y grafos.

8. WebR, ejecución de R en navegador y notebooks
Recurso	Descripción	Relevancia
@jupyter-kit/executor-webr	Ejecutor de R en el navegador vía WebR, integrable con JupyterKit para renderizar celdas de R con ejecución real y plots inline.	Componente central del stack: permite que los ejemplos del curso ejecuten R sin backend.
StatisticTeach1	App Shiny que demuestra la viabilidad de interfaces estadísticas interactivas con R.	Referencia de UX para la integración de R en la interfaz.
Criterio de selección: WebR es la tecnología que permite que el curso sea autocontenido: el estudiante no necesita instalar R, y las simulaciones se ejecutan en el navegador con la misma semántica que en un entorno local.

9. Repositorios de referencia estadística general
Repositorio	Descripción	Relevancia
mca91/EconometricsWithR	Compañero interactivo del texto "Introduction to Econometrics" de Stock & Watson (2015). 447 stars.	Referencia para el Módulo IV (regresión y causalidad) con ejemplos en R.
HaoWang47/intro-stats	Diagnósticos de regresión lineal simple en Shiny.	Directamente aplicable al ejemplo de regresión a la media.
probviz	Fitting, Monte Carlo y testing estadístico.	Referencia para el Módulo VI (no paramétrica y robusta).
