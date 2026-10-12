# Por qué este curso importa, y por qué importa más ahora

## La ciencia como empresa de corrección

Hay una idea que suele quedar implícita en la formación científica: que el método científico existe porque la mente humana se equivoca de formas predecibles. No basta con ser inteligente, ni con dominar las técnicas. Los sesgos que Kahneman y Tversky documentaron no desaparecen con un doctorado. Al contrario, la formación especializada puede volverlos más peligrosos, porque le da al experto una confianza que no siempre está justificada por su capacidad de razonar bien bajo incertidumbre.

Un estudiante de ciencias aprende cálculo, álgebra lineal, estadística, métodos numéricos. Aprende a ejecutar pruebas, a ajustar modelos, a interpretar coeficientes. Lo que rara vez aprende es que **su propia mente está calibrada para otro tipo de entorno**. El cerebro que sobrevivió a la sabana no evolucionó para razonar sobre tasas base, intervalos de confianza ni regresiones múltiples. Evolucionó para detectar patrones, para reaccionar rápido, para confiar en la narrativa. Esas capacidades siguen operando cuando el estudiante se sienta frente a un dataset.

El curso "Razonamiento Estadístico" propone algo que la formación científica convencional deja al azar: enseñar explícitamente **contra qué intuiciones compiten los métodos que estamos enseñando**. Un estudiante que aprende el teorema de Bayes sin haber sentido antes la falacia de tasa base en sus propias carnes va a aplicar la fórmula mecánicamente, y en la primera situación real donde no haya una fórmula a mano, va a recurrir a la intuición. Y la intuición, en ese terreno, falla.

Esto tiene consecuencias concretas. En medicina, la interpretación de pruebas diagnósticas sigue siendo un desastre en la práctica clínica, décadas después de que Kahneman y Tversky publicaran sus experimentos. En epidemiología, la comunicación de riesgos durante la pandemia de COVID-19 mostró que incluso profesionales entrenados caían en falacias de tasa base cuando interpretaban datos de vacunación. En ingeniería, la sobreconfianza en estimaciones de plazos y costos es legendaria. En economía, los modelos basados en utilidad esperada siguen sin capturar el comportamiento real de los agentes. La lista se extiende a cada disciplina que depende de decisiones bajo incertidumbre.

La ciencia avanza corrigiendo errores. Pero solo corrige los errores que reconoce. Los sesgos cognitivos son errores que no se sienten como errores. Se sienten como sentido común, como juicio experto, como la respuesta obvia. Enseñar a reconocerlos es tan importante como enseñar a calcular una derivada.

---

## La ciencia en tiempos de inteligencia artificial

Vivimos un momento en que las herramientas de análisis se han vuelto más poderosas y más accesibles que nunca. Cualquier estudiante puede entrenar un modelo de machine learning en su computadora. Cualquier investigador puede generar mil gráficos en una tarde. Cualquier analista puede ejecutar simulaciones de Monte Carlo sin entender del todo qué está simulando. La barrera técnica se ha desplomado, y eso tiene un efecto secundario que conviene mirar de frente: **la barrera cognitiva sigue intacta, y ahora es más fácil ignorarla**.

La inteligencia artificial amplifica lo que le ponemos delante. Si le damos una pregunta mal planteada, produce una respuesta mal planteada con una velocidad y una elocuencia que la hacen parecer correcta. Si le damos datos sesgados, aprende el sesgo y lo aplica a escala. Si le pedimos que encuentre patrones, los encuentra, incluso cuando no existen. La capacidad de cómputo no sustituye el juicio sobre qué preguntar, qué datos usar, qué resultados descartar, qué conclusiones evitar. Al contrario, la potencia de las herramientas hace que esos juicios sean más determinantes, porque sus consecuencias se multiplican.

Hay un ejemplo que ilustra bien el problema. Los sistemas de scoring crediticio entrenados con datos históricos reproducen la discriminación que esos datos contienen. No porque alguien haya programado el sesgo, sino porque el algoritmo aprende la estructura estadística del pasado y la proyecta hacia el futuro. Detectar eso requiere algo que el algoritmo no puede darse a sí mismo: **la capacidad de preguntar si el patrón aprendido corresponde a una regularidad real o a un artefacto de la recolección de datos**. Esa pregunta es estadística, pero también es cognitiva. Requiere sospechar de la respuesta fácil, resistir la tentación de la correlación alta, entender que un modelo puede ser técnicamente impecable y epistémicamente vacío.

Los estudiantes de ciencias que se formen sin esa capacidad van a ser usuarios competentes de herramientas que no comprenden del todo, y esa combinación es peligrosa. Van a producir análisis que parecen rigurosos, con intervalos de confianza, p-valores, curvas ROC, validación cruzada. Van a reportar resultados que pasan todas las pruebas automáticas de reproducibilidad. Y van a estar equivocados de formas que ni ellos ni sus revisores van a detectar, porque los errores no están en el código, están en los supuestos que nadie examinó.

La paradoja de esta época es que **la IA hace más fácil hacer estadística y más fácil hacerla mal**. La velocidad con que se pueden generar resultados supera la velocidad con que se pueden evaluar críticamente. El curso de razonamiento estadístico propone invertir esa relación: formar primero el juicio, después la técnica. O más precisamente, formar el juicio **a través de** la técnica, usando cada método como una ocasión para examinar los sesgos que ese método intenta corregir.

---

## Cómo transmitir esta materia

Enseñar razonamiento estadístico tiene una dificultad particular: **no se puede enseñar como se enseña una fórmula**. La fórmula se transmite, se practica, se memoriza. El razonamiento estadístico se construye a través de la experiencia del error, y esa experiencia no se puede transmitir verbalmente. Hay que provocarla.

Los experimentos de Kahneman y Tversky funcionan pedagógicamente porque **hacen que la persona falle antes de explicarle por qué falló**. En el aula tradicional, el profesor explica la falacia de tasa base y luego pone un ejemplo. El estudiante entiende la explicación, resuelve el ejemplo correctamente, y sale con la ilusión de que ha aprendido. Meses después, frente a una situación real donde la falacia aparece disfrazada, vuelve a caer. El conocimiento declarativo no se traduce automáticamente en juicio calibrado.

El orden invertido es el que funciona. Primero el problema, sin advertencia. El estudiante responde con lo que le dicta la intuición. Después ve la respuesta correcta, y siente la incomodidad de haber fallado. Recién entonces se introduce el concepto, y el concepto se ancla en esa incomodidad. La lección queda grabada porque tiene una carga emocional, porque el estudiante se reconoce en el error.

Eso es lo que el laboratorio interactivo que venimos diseñando permite hacer a escala. Un slider que mueve la prevalencia y muestra cómo la probabilidad posterior se desploma. Una simulación de Monty Hall que corre diez mil veces y desmiente la intuición de que da igual cambiar. Un diagrama de Venn que hace geométricamente imposible la falacia de conjunción. Una caminata aleatoria que revela cuánto de lo que llamamos tendencia es solo ruido acumulado.

La segunda condición para transmitir bien esta materia es **la honestidad sobre la propia falibilidad**. El profesor que enseña sesgos cognitivos desde una posición de superioridad epistémica transmite un mensaje equivocado: que los sesgos son cosas que le pasan a otros. Conviene mostrar que el propio instructor cae en ellos, que los investigadores que documentaron estos sesgos también los cometían en su vida cotidiana, que la lucha contra la propia intuición es permanente y no se gana de una vez. Esa honestidad no debilita la enseñanza. La hace creíble y la vuelve aplicable.

La tercera condición es **la conexión con la disciplina del estudiante**. Un ejemplo genérico de falacia de tasa base se olvida. Un ejemplo de interpretación de pruebas diagnósticas para un estudiante de medicina, de análisis de declinación de pozos para un ingeniero de petróleos, de evaluación de riesgo crediticio para un estudiante de finanzas, se queda. La estructura del sesgo es la misma, pero el disfraz es distinto, y el disfraz es lo que hace que el estudiante lo reconozca en su práctica profesional.

La cuarta condición es **la repetición con variación**. Un sesgo no se aprende en una sola exposición. Se aprende encontrándolo en contextos distintos, con disfraces distintos, hasta que la estructura subyacente se vuelve reconocible. El curso debería volver sobre los mismos sesgos en cada módulo, mostrando cómo reaparecen en la inferencia, en la regresión, en las series de tiempo, en el machine learning. La falacia de tasa base no es un tema del Módulo II. Es un hilo que atraviesa todo el programa.

---

## Lo que el curso ofrece

Un estudiante de ciencias que pase por este curso va a salir sabiendo **cuándo desconfiar de sí mismo**, y eso, en un mundo donde las herramientas de análisis se han vuelto tan potentes como opacas, puede ser la diferencia entre producir conocimiento y producir la ilusión de conocimiento.

La ciencia siempre fue una empresa de corrección de errores. Lo nuevo es que ahora los errores pueden generarse a una escala y una velocidad que superan nuestra capacidad de detectarlos. La inteligencia artificial no nos va a salvar de eso, porque no puede dudar de sus propios supuestos. Esa duda sigue siendo tarea humana, y el razonamiento estadístico, entendido como la psicología de la inferencia y no solo como el conjunto de sus técnicas, es la mejor herramienta que tenemos para ejercerla.