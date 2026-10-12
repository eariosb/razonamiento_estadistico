# Laboratorio de Puertas: una batería de ejemplos para el curso

Un modulo del curso en una **puerta que el estudiante abre con sus propias manos**. No le contamos que la intuición falla. Lo dejamos fallar, y después le mostramos la trampa. Eso es exactamente lo que Kahneman y Tversky hicieron en el laboratorio durante décadas. Aquí solo cambiamos el entorno: en lugar de un cubículo con una hoja de papel, el estudiante entra a una aplicación que responde, se mueve y le devuelve su error con gráficos, números y animaciones.

Lo que sigue es un catálogo de piezas, agrupadas por el tipo de engaño o de ilusión que explotan. Cada una puede implementarse con las herramientas gratuitas que ya revisamos. La meta no es tener cincuenta ejercicios, sino tener **cinco o seis que se puedan reutilizar en varios módulos con variaciones pequeñas**.

---

## 1. El taller de gráficos mentirosos

Hay una familia de ejemplos que comparten una estructura simple: un conjunto de datos honesto, una representación visual deshonesta, y una conclusión que el gráfico sugiere pero los datos no sostienen. La ventaja pedagógica es que el estudiante ve **el mismo dato** transformado en dos o tres gráficos distintos, y la opinión que se forma cambia según la representación.

### 1.1 Ejes truncados y escalas tramposas

El ejercicio clásico: se presenta un gráfico de barras con el eje Y comenzando en 95 en lugar de 0. Una diferencia de dos puntos porcentuales parece una catástrofe. El estudiante puede **arrastrar el punto de inicio del eje** y ver cómo la historia visual se desinfla o se infla. Un segundo panel muestra el mismo dato con eje en 0. La comparación lado a lado, con una transición animada, deja la lección clavada.

Herramientas: D3.js para el gráfico, Framer Motion para la transición del eje. La manipulación puede ser un simple slider que mueve el dominio del eje Y.

### 1.2 El cuarteto de Anscombe

Cuatro conjuntos de datos con la misma media, la misma varianza, la misma correlación y la misma recta de regresión. Pero al graficarlos, uno es lineal, otro curvilíneo, otro tiene un outlier, y otro tiene un punto de alto apalancamiento. Anscombe inventó este cuarteto precisamente para mostrar que **los estadísticos descriptivos no cuentan la historia completa**.

La interacción: cuatro scatter plots lado a lado, con los mismos estadísticos calculados debajo de cada uno. El estudiante puede arrastrar puntos y ver cómo los estadísticos **cambian o no cambian**. El punto pedagógico es que la regresión es un resumen, no una verdad.

### 1.3 La paradoja de Simpson

El caso de Berkeley es el más citado: los datos agregados muestran sesgo de admisión contra las mujeres, pero al desagregar por departamento, el sesgo se invierte o desaparece. El estudiante puede **alternar entre vista agregada y desagregada** con un clic, y ver cómo la conclusión cambia por completo.

La implementación ideal usa TanStack Table para la tabla de contingencia y D3 para el gráfico de barras agrupadas. Un slider permite ajustar la distribución de la variable de confusión y observar cuándo la paradoja aparece y cuándo se disuelve.

### 1.4 Correlaciones espurias

El sitio *Spurious Correlations* de Tyler Vigen es una mina de ejemplos: consumo de queso per cápita correlaciona con doctorados en ingeniería civil, o el número de ahogamientos en piscinas correlaciona con las películas de Nicolas Cage. La interacción aquí es simple: el estudiante elige dos variables de una lista, ve el scatter plot, la correlación, y luego un botón **"generar correlación aleatoria"** produce nuevas series con correlación alta por puro azar. La lección sobre la falacia *cum hoc ergo propter hoc* se instala sin discurso.

---

## 2. La sala de simulaciones psicológicas

Kahneman y Tversky no solo describieron sesgos: los midieron en experimentos que cualquiera puede replicar. La ventaja de tener un laboratorio interactivo es que el estudiante **se convierte en sujeto experimental de su propio sesgo**, y luego en investigador que analiza sus resultados.

### 2.1 El test diagnóstico con prevalencia variable

Este es el ejemplo ancla del curso, y merece la implementación más cuidada. La interacción tiene tres capas:

Primero, el estudiante lee el problema clásico: una enfermedad con prevalencia de 1 en 1000, un test con 99% de sensibilidad y 95% de especificidad. Se le pide que estime la probabilidad de estar enfermo dado un test positivo. La mayoría responde algo cercano al 95%. El sistema **registra esa respuesta**.

Segundo, aparece un diagrama de frecuencias naturales: 1000 iconos de personas. Uno está enfermo. El test lo detecta. Pero entre los 999 sanos, el 5% da falso positivo, unos 50. Total de positivos: 51. Enfermos entre los positivos: 1. El estudiante **ve** que su respuesta estaba equivocada por un factor de cincuenta.

Tercero, un slider permite variar la prevalencia de 0.0001 a 0.5. El gráfico de P(enfermo | positivo) se actualiza en tiempo real. Cuando la prevalencia es baja, la tasa base domina. Cuando sube, el test se vuelve más informativo. Una celda de R ejecutable vía WebR muestra el cálculo formal: `sensibilidad * prevalencia / (sensibilidad * prevalencia + (1 - especificidad) * (1 - prevalencia))`. El estudiante puede modificar los valores y ejecutar la celda.

### 2.2 El problema de Linda y la falacia de conjunción

La descripción de Linda es un experimento de Tversky y Kahneman de 1983. Linda tiene 31 años, es soltera, extrovertida y brillante, se graduó en filosofía, y de estudiante le preocupaban la discriminación y la justicia social. Se pide al estudiante que ordene por probabilidad varias afirmaciones: "Linda es cajera de banco", "Linda es cajera de banco y feminista", "Linda es feminista", etc.

La mayoría considera más probable la conjunción (cajera y feminista) que uno de sus componentes (cajera). Eso viola la lógica de conjuntos: la intersección nunca es mayor que el conjunto. El laboratorio muestra un **diagrama de Venn interactivo** donde el estudiante puede arrastrar el punto de Linda. Cuando intenta colocarlo en la región "cajera y feminista", el sistema le muestra que esa región es un subconjunto de "cajera", y por lo tanto no puede ser más probable. La geometría hace visible lo que el lenguaje oculta.

### 2.3 La ley de los números pequeños

Tversky y Kahneman (1971) mostraron que incluso investigadores entrenados tratan muestras pequeñas como si fueran representativas de la población. El laboratorio simula esto con un ejercicio simple: se lanza una moneda 10 veces y se registra la proporción de caras. El estudiante predice cuántas caras espera. Luego se repite el experimento 1000 veces con muestras de tamaño 10, 100 y 1000. Las distribuciones de proporciones se grafican lado a lado. Con n=10, las proporciones varían salvajemente. Con n=1000, se apiñan alrededor de 0.5.

El punto no es solo que la varianza muestral decrece con n. Es que **la intuición del estudiante espera que n=10 se comporte como n=1000**. El gráfico lo desmiente.

### 2.4 La regresión a la media en contextos aplicados

Kahneman cuenta en *Thinking, Fast and Slow* que descubrió la regresión a la media cuando intentaba explicar por qué los pilotos de la Fuerza Aérea israelí mejoraban después de ser criticados y empeoraban después de ser elogiados. La explicación no era psicológica, sino estadística: los extremos vuelven a la media.

El laboratorio implementa esto con un simulador de control de calidad. Se genera un proceso con media 100 y desviación 5. En cada ronda, se seleccionan las 10 unidades con peor desempeño y se aplica una "intervención" (reentrenamiento, ajuste). En la siguiente ronda, esas unidades tienden a volver cerca de la media **sin que la intervención haya hecho nada**. El estudiante puede desactivar la intervención y ver que el efecto persiste. La lección: la mayoría de las "mejoras" en sistemas ruidosos son la media reclamando su lugar.

---

## 3. La galería de juegos de pensamiento

Hay una categoría de ejemplos que funcionan mejor como juegos: el estudiante toma decisiones repetidas y el sistema acumula resultados, mostrando el patrón de sus sesgos a lo largo del tiempo.

### 3.1 Monty Hall con simulación masiva

El juego clásico: tres puertas, un premio, un host que revela una cabra. El estudiante elige una puerta, el host abre otra, y se le pregunta si quiere cambiar. Tras su decisión, ve el resultado. La simulación se repite automáticamente 100, 1000 o 10000 veces, y el gráfico de barras acumuladas muestra la proporción de victorias con cambio vs. sin cambio.

La intuición dice que da igual cambiar. La simulación masiva muestra que cambiar gana dos tercios de las veces. El estudiante ve **su propia secuencia de decisiones** comparada con la estrategia óptima. El impacto es visceral.

### 3.2 La falacia del jugador

El estudiante lanza una moneda repetidamente. Si salen cinco caras seguidas, se le pregunta: "¿Qué es más probable en el siguiente lanzamiento, cara o cruz?" La mayoría dice cruz, porque siente que "ya toca". El sistema registra esa respuesta y luego muestra 1000 secuencias aleatorias de 6 lanzamientos. La frecuencia de cara después de cinco caras es exactamente 0.5, como siempre. El estudiante puede **jugar contra la máquina** en rondas sucesivas y ver cómo su tasa de acierto se mantiene cerca del azar, mientras su confianza subjetiva aumenta.

### 3.3 El juego de la regresión lineal

El repositorio *shinyGC* de Georgetown College incluye un juego de línea de regresión que registra las puntuaciones de los estudiantes. La mecánica: se presentan puntos en un scatter plot, el estudiante arrastra una línea para minimizar el error, y el sistema calcula la suma de residuos al cuadrado. Cuando el estudiante cree haber terminado, el sistema muestra la línea de mínimos cuadrados y la diferencia. La brecha entre la línea subjetiva y la línea óptima es el punto.

### 3.4 El juego de la falacia del francotirador de Texas

El *TigerSAMPLING* de CAUSEweb es un juego donde los estudiantes actúan como investigadores en una reserva nacional, capturan tigres, recogen datos y estiman la edad de los animales usando regresión lineal sobre datos transformados. El juego enfatiza sesgos de muestreo y generalización: los tigres que se dejan capturar no son una muestra aleatoria de la población.

---

## 4. El rincón de la visualización honesta vs. deshonesta

Hay una línea de trabajo pedagógico que consiste en presentar al estudiante **el mismo dato** con dos o tres visualizaciones, una honesta y una engañosa, y pedirle que identifique qué se manipuló. Es un ejercicio de alfabetización visual que conecta directamente con la historia de la estadística gráfica.

### 4.1 El sitio *Data is Ugly*

El subreddit r/dataisugly es un archivo vivo de gráficos mal hechos. El laboratorio puede embeber una galería curada de ejemplos y pedir al estudiante que identifique el problema: eje truncado, colores confusos, 3D innecesario, doble eje Y, pictogramas de área engañosa. Cada ejemplo se acompaña de una versión corregida.

### 4.2 El ejercicio de "arregla este gráfico"

Inspirado en el *Fix This Chart* de Polypad, el estudiante recibe un gráfico engañoso y herramientas para modificarlo: cambiar el rango del eje, alternar entre barras y líneas, ajustar la escala, cambiar la paleta. El sistema evalúa si la versión corregida transmite la información sin distorsión.

### 4.3 La visualización de distribuciones con distorsión paramétrica

Un ejercicio más técnico: se presenta una distribución normal con un slider que controla el sesgo (skewness) y otro que controla la curtosis. El estudiante ve cómo la forma cambia. Luego se le pide que identifique qué distribución subyace a un histograma dado, sabiendo que los datos pueden haber sido transformados. La lección es que **la forma de una distribución es una decisión de modelado**, no un hecho bruto.

---

## 5. Herramientas gratuitas para construir el laboratorio

La buena noticia es que casi todo lo que necesitas ya existe en código abierto. La mala es que hay que elegir con cuidado para no terminar con un Frankenstein de dependencias.

**Para simulaciones estadísticas con R en el navegador**, `@jupyter-kit/executor-webr` es la vía más directa. Permite renderizar celdas de R con ejecución real vía WebR y plots inline. Las apps de `statsapps` y `shinyGC` son referencias de código que se pueden adaptar: la primera cubre distribuciones de probabilidad, tests de permutación, ANOVA y regresión; la segunda incluye un juego de línea de regresión, simulaciones de intervalos de confianza y el test chi-cuadrado.

**Para simulaciones basadas en agentes en JavaScript**, `flocc` es la opción natural por ser JavaScript puro y ejecutarse en el navegador. Para ejemplos más específicos de biología o epidemiología, `Artistoo` ofrece un framework completo de Cellular Potts Model en JavaScript, con simulaciones que corren en el navegador sin plugins ni servidores.

**Para visualización estadística interactiva**, `nteract/semiotic` combina React y D3 con una API declarativa. `Seeing Theory` es una referencia de arquitectura: usa D3.js para SVG, HTML Canvas para estimación puntual y jStat para cálculos estadísticos. Su código muestra cómo estructurar visualizaciones de inferencia frecuentista, intervalos de confianza y tests de hipótesis.

**Para animaciones y transiciones**, Framer Motion cubre gestos, layout animations y transiciones declarativas. Para simulaciones con física de resortes, React Spring es la alternativa. La ventaja de Framer Motion es su integración con React y su capacidad de animar propiedades de SVG.

**Para juegos de sesgos cognitivos**, el *Cognitive Bias Lab* es una plataforma modular con simulaciones, quizzes y role-play. *Whack-a-Mind* y *Bias Detector* son juegos breves que se pueden embeber. *A Statistical Odyssey* cubre sesgo de selección, regresión a la media, correlación vs. causalidad, falacia del jugador y falacia de tasa base en formato de aventura espacial.

**Para el laboratorio de WebR**, `Empiria` es un entorno composable basado en navegador que representa el flujo inferencial como un grafo de datos. Cada nodo es un módulo (bootstrap, contingency, t-test, OLS) y el estudiante los conecta con cables. Los resultados se actualizan en tiempo real junto a la fórmula que cada nodo calcula. Es exactamente el tipo de herramienta que hace visible el **proceso** de la inferencia, no solo el resultado.

---

## 6. Una propuesta de arquitectura para el laboratorio

El laboratorio puede pensarse como una aplicación Next.js con cuatro capas:

**Capa de contenido.** Cada ejemplo es un componente React que recibe una configuración: el problema, los parámetros iniciales, la función WebR que calcula el resultado correcto, y los gráficos D3 que se actualizan. El contenido bibliográfico (las citas de Kahneman, Tversky, Gigerenzer) se almacena como datos estructurados y se renderiza junto al ejemplo.

**Capa de simulación.** Un hook personalizado `useWebRSimulation` maneja el ciclo de vida de WebR: inicialización del intérprete, envío de código, recepción de resultados. Para simulaciones en JavaScript puro, un hook `useSimulation` con `requestAnimationFrame` y generadores aleatorios controlados por semilla.

**Capa de visualización.** Componentes reutilizables de D3 encapsulados en React: `<ScatterPlot>`, `<Histogram>`, `<BayesianUpdater>`, `<VennDiagram>`, `<CalibrationCurve>`. Cada uno acepta datos, opciones de escala y callbacks de interacción.

**Capa de juego.** Un componente `<GameShell>` que maneja el estado de rondas, acumula resultados y muestra el gráfico de rendimiento. Los juegos específicos (Monty Hall, falacia del jugador, regresión lineal) son variaciones de este shell.

La ventaja de esta arquitectura es que **un mismo motor sirve para todos los ejemplos**. El test diagnóstico, la regresión a la media y el bootstrap comparten el mismo ciclo: el estudiante ingresa una estimación, el sistema simula, el gráfico muestra la brecha, el estudiante ajusta parámetros. Cambia el contenido, no la mecánica.

---
