Vamos a diseñar la arquitectura de contenido interactivo para el curso "Razonamiento Estadístico". La propuesta cruza los ocho módulos del plan con el stack técnico que mencionas, priorizando que cada ejemplo sea experiencial: que el estudiante primero sienta la intuición errónea, luego vea la corrección formal en tiempo real, y finalmente ejecute el cálculo correcto.

El enfoque de diseño minimalista funcional se alinea con la filosofía de tasteskill.dev: evitar el "boilerplate-looking UI" y construir una interfaz que sirva al contenido, no que lo decore. La tipografía debe ser austera (una sola familia, pesos controlados), el espaciado generoso, y el color reservado exclusivamente para codificar información estadística (intervalos de confianza, densidades, residuos), no para decorar.

Stack técnico base
Capa	Tecnología	Rol en el curso
Framework	Next.js (App Router) + TypeScript	SSR para el contenido bibliográfico; client components para simulaciones
Diseño	tasteskill.dev skills + Tailwind CSS	Layout, tipografía, motion y spacing sin boilerplate
Gráficos reactivos	D3.js dentro de componentes React	Visualizaciones que el usuario manipula con sliders y drag
Diagramas de flujo	React Flow	Árboles de decisión, diagramas causales, flujos bayesianos
Computación en navegador	WebR embebido vía @jupyter-kit/executor-webr	Ejecutar R directamente en el browser para simulaciones y cálculos
Datos tabulares	TanStack Table	Tablas de experimentos, matrices de confusión, datasets sintéticos
Estado	TanStack Store / Query	Estado de simulaciones, caché de resultados computados
Motion	Framer Motion o CSS transitions	Transiciones que revelan la brecha entre intuición y formalismo
La clave es que WebR no sea un añadido decorativo: debe ejecutarse en el mismo hilo de la interacción. Cuando el usuario mueve un slider de prevalencia, el chunk de R se reevalúa y el gráfico D3 se actualiza. @jupyter-kit permite renderizar celdas de R en el navegador con ejecución real vía WebR, incluyendo plots inline.

Módulo I: Paradojas e intuiciones fundacionales
Ejemplo 1: La paradoja de Monty Hall como simulación de decisión repetida
Interacción: El estudiante ve tres puertas. Elige una. El host (animado) revela una cabra. Se le pregunta si quiere cambiar. Tras su decisión, ve el resultado. La simulación se repite automáticamente 100, 1.000 o 10.000 veces, y el gráfico de barras acumuladas muestra la proporción de victorias con cambio vs. sin cambio.

Implementación: Componente React con estado de puertas; D3 para el gráfico acumulado; WebR para calcular el intervalo de confianza de la diferencia de proporciones en tiempo real. El punto pedagógico es que la intuición dice "da igual cambiar o no", pero la simulación masiva fuerza el Sistema 1 a confrontar la evidencia.

Ejemplo 2: El problema de Linda como diagrama de conjuntos interactivo
Interacción: Se presenta la descripción de Linda. Dos afirmaciones: (A) "Linda es cajera de banco" y (B) "Linda es cajera de banco y feminista". El estudiante las ordena por probabilidad subjetiva. Luego, un diagrama de Venn interactivo muestra los conjuntos A y B, con B siempre contenido en A. El usuario puede arrastrar el punto de Linda dentro del diagrama para ver que no existe región donde B sea más probable que A.

Implementación: React Flow o SVG con D3 para el Venn. La falacia de conjunción se hace geométricamente visible, no solo verbal.

Módulo II: Probabilidad y el problema de Bayes
Ejemplo central: El test diagnóstico con prevalencia variable
Este es el ejemplo ancla del curso. La interacción tiene tres capas superpuestas:

Capa 1 — Intuición: Se presenta el problema clásico (enfermedad con prevalencia 1/1000, test con 99% de sensibilidad y 95% de especificidad). El estudiante ingresa su estimación de P(enfermo | test positivo).

Capa 2 — Corrección visual (frecuencias naturales): Un diagrama de iconos de muñecos (1.000 puntos) se colorea: 1 enfermo, 999 sanos. El test marca 99% de enfermos (1 positivo verdadero) y 5% de sanos (≈50 falsos positivos). El estudiante ve que de 51 positivos, solo 1 es verdadero.

Capa 3 — Cálculo ejecutado en WebR: Un slider permite variar la prevalencia de 0.0001 a 0.5. El gráfico de P(enfermo | positivo) se actualiza en tiempo real. Una celda de R ejecutable muestra:

r
prevalencia <- 0.001
sensibilidad <- 0.99
especificidad <- 0.95
P_positivo <- sensibilidad * prevalencia + (1 - especificidad) * (1 - prevalencia)
P_enfermo_dado_positivo <- sensibilidad * prevalencia / P_positivo
P_enfermo_dado_positivo
El estudiante puede modificar los valores y ejecutar la celda, viendo cómo el resultado cambia. La lección es que la tasa base domina cuando la prevalencia es baja, y la intuición falla precisamente ahí.

Implementación: WebR embebido vía @jupyter-kit/executor-webr; el gráfico de barras usa D3 con transiciones suaves; los iconos se renderizan como SVG con transiciones de opacidad.

Módulo III: Inferencia y estimación
Ejemplo: Intervalos de confianza subjetivos y calibración
Interacción: Se presentan 20 preguntas de trivia con respuestas numéricas (p. ej., "¿Cuántos años vivió Mozart?"). Para cada una, el estudiante debe dar un intervalo de confianza del 90%. Luego, el sistema cuenta cuántas de sus 20 respuestas cayeron dentro de sus propios intervalos.

Si el estudiante es como la mayoría, acertará menos del 90% (sobreconfianza) o más del 90% (subconfianza). El gráfico de calibración muestra la curva: en el eje X, el nivel de confianza declarado; en el eje Y, la proporción real de aciertos. La línea diagonal es la calibración perfecta.

Implementación: TanStack Table para las 20 preguntas; D3 para el gráfico de calibración; WebR para calcular el intervalo binomial de la proporción de aciertos.

Ejemplo: La regresión a la media en control de calidad
Interacción: Se simula un proceso de producción con media 100 y desviación 5. En cada ronda, se seleccionan las 10 unidades con peor desempeño y se aplica una "intervención" (reentrenamiento, ajuste de máquina). En la siguiente ronda, esas unidades tienden a volver cerca de la media sin que la intervención haya hecho nada.

Implementación: Simulación en WebR que genera datos; D3 muestra dos scatter plots (antes y después); el estudiante puede desactivar la intervención y ver que el efecto persiste. La lección: la regresión a la media explica la mayoría de las "mejoras" en sistemas ruidosos.

Módulo IV: Regresión y causalidad
Ejemplo: Ilusión de causalidad en correlaciones espurias
Interacción: Un panel muestra dos series temporales correlacionadas (p. ej., ventas de un producto y temperatura). El estudiante puede elegir entre 20 pares de series históricas. Un botón "Generar correlación aleatoria" produce nuevas series con correlación alta por azar. Un tercer panel permite introducir una variable de confusión (p. ej., estacionalidad) y ver cómo la correlación desaparece o se invierte.

Implementación: D3 para las series; React Flow para el diagrama causal (DAG) que el estudiante puede editar para expresar sus supuestos causales; WebR para calcular correlaciones parciales.

Ejemplo: Paradoja de Simpson interactiva
Interacción: Una tabla de contingencia con dos tratamientos (A y B) y un resultado (éxito/fracaso), desagregada por una tercera variable (p. ej., gravedad del paciente). El estudiante puede arrastrar las proporciones de gravedad y ver cómo la asociación entre tratamiento y resultado se invierte al agregar o desagregar.

Implementación: TanStack Table con celdas editables; D3 para el gráfico de barras agrupadas que muestra la inversión.

Módulo V: Procesos estocásticos y series de tiempo
Ejemplo: La caminata aleatoria y la ilusión de tendencia
Interacción: Se genera una caminata aleatoria pura (sin tendencia). Se muestra un gráfico de línea. Se pide al estudiante que prediga el siguiente valor. Luego se generan 100 caminatas y se muestra que la "tendencia" que veía era solo ruido. Un slider permite aumentar el número de pasos y ver cómo la varianza crece con el tiempo.

Implementación: WebR para generar la caminata (cumsum(rnorm(n))); D3 para la visualización; el estudiante puede ejecutar la celda de R con diferentes semillas.

Ejemplo: Disponibilidad y percepción de riesgo
Interacción: Se presentan dos causas de muerte (p. ej., ataúd vs. cáncer de estómago) y se pide al estudiante que elija cuál es más frecuente. El sistema muestra las tasas reales y luego pregunta: "¿Cuántos ejemplos de esta causa recuerdas haber visto en noticias recientes?" La correlación entre cobertura mediática y percepción de frecuencia se hace visible.

Módulo VI: Estadística no paramétrica y robusta
Ejemplo: El efecto de un outlier en la media vs. la mediana
Interacción: Un conjunto de datos con 20 puntos. El estudiante puede arrastrar un punto hacia arriba. La media se mueve drásticamente; la mediana casi no se mueve. Un segundo panel muestra la distribución bootstrap de la media y de la mediana, revelando que la media tiene mayor varianza bajo contaminación.

Implementación: D3 para el scatter plot con drag; WebR para el bootstrap (remuestreo con reemplazo); los intervalos de confianza se actualizan en tiempo real.

Ejemplo: Pruebas de rangos vs. pruebas t bajo violación de normalidad
Interacción: Se generan datos de una distribución de colas pesadas (p. ej., Cauchy o t con 2 grados de libertad). El estudiante ejecuta una prueba t y una prueba de Mann-Whitney. El p-valor de la prueba t es errático; el de la prueba de rangos es estable. Un slider permite variar el tamaño de la cola y ver cuándo la prueba paramétrica falla.

Módulo VII: El paradigma bayesiano
Ejemplo: Actualización de creencias con datos secuenciales
Interacción: Se parte de una prior (distribución beta). Se observan datos (éxitos/fracasos) uno a uno. La posterior se actualiza en tiempo real con cada observación. El estudiante puede elegir diferentes priors (uniforme, concentrada, escéptica) y ver cómo la evidencia la desplaza.

Implementación: D3 para la distribución beta interactiva; WebR para calcular la posterior analíticamente (qbeta); la comparación con la aproximación por grid se muestra en un panel secundario.

Ejemplo: La paradoja de Lindley
Interacción: Un problema con dos hipótesis y un dato extremo. Se muestra que la inferencia bayesiana (con prior uniforme) y la frecuentista (p-valor) dan respuestas contradictorias. El estudiante puede ajustar el prior y ver cómo la contradicción se resuelve o se agrava.

Módulo VIII: Machine learning, deep learning y decisión
Ejemplo: Sesgo algorítmico en datos desbalanceados
Interacción: Se simula un dataset de admisiones con dos grupos (A y B). El grupo B tiene menor prevalencia de la característica predictiva. El estudiante entrena un modelo simple (regresión logística en WebR). El modelo discrimina contra el grupo B no por sesgo explícito, sino por la tasa base diferencial.

Implementación: WebR para entrenar el modelo; D3 para la curva ROC desagregada por grupo; TanStack Table para la matriz de confusión.

Ejemplo: El ruido en las decisiones humanas vs. algorítmicas
Interacción: Se presentan 50 casos idénticos a 10 "jueces" simulados (con diferentes sesgos y ruidos). El estudiante ve la dispersión de decisiones para el mismo caso. Luego se aplica un modelo algorítmico y se compara la dispersión. La lección de Noise: el ruido no es error aleatorio inocuo; es injusticia sistemática.

Diagrama de flujo pedagógico por ejemplo
Cada ejemplo interactivo sigue esta secuencia, implementada como máquina de estados en el componente:

text
[Presentación del problema]
        ↓
[Intuición: el estudiante responde/estima]
        ↓
[Revelación visual: la simulación muestra el error]
        ↓
[Corrección formal: WebR calcula el resultado correcto]
        ↓
[Manipulación: sliders, drag, ejecución de celdas]
        ↓
[Reflexión: ¿cuándo falla mi intuición y por qué?]
React Flow se usa para el diagrama de flujo del razonamiento en cada módulo: el estudiante puede ver cómo su proceso de decisión se desvía del flujo normativo, y dónde exactamente ocurre la falacia.

Consideraciones de implementación con Taste Skill y TanStack
Taste Skill se aplica como skill de agente para generar la UI base. En lugar de prompts genéricos que producen layouts centrados con tres cards y gradientes púrpura, se usan los skills de tasteskill.dev para forzar layout asimétrico controlado, tipografía con jerarquía real (no todo en negrita), y motion que revela información (transiciones que muestran el cambio de un estado a otro, no decoración). La documentación de tasteskill.dev indica que su propósito es "upgrade AI-built interfaces: stronger layout, typography, motion, and spacing instead of boilerplate-looking UIs".

TanStack se integra en dos frentes: TanStack Table para las tablas de datos experimentales (matrices de confusión, tablas de contingencia, datasets), y TanStack Intent para que los propios componentes del curso publiquen skills que enseñen a agentes de IA cómo usarlos correctamente. Esto es meta: el curso no solo enseña razonamiento estadístico; su infraestructura enseña a los agentes a construir herramientas de razonamiento estadístico.

