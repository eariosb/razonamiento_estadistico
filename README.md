# Razonamiento Estadístico

Curso interactivo y bilingüe de **razonamiento estadístico** con R
ejecutándose en el navegador (webR). Hereda la arquitectura del curso de
análisis de datos epidemiológicos (ADEI, UNAL Medellín): pizarra digital
colaborativa, asistente IA con RAG acotado al curso, contenido MDX,
simuladores y el mismo sistema de diseño, con contenido nuevo guiado por
la documentación de `docs/` y la tradición Kahneman–Tversky–Gigerenzer.

## Modelo pedagógico

La escritura es deliberadamente **de falla primero** (*failure-first*):

1. El estudiante se compromete con una respuesta intuitiva.
2. Una interacción o simulación expone dónde falla esa intuición.
3. La discrepancia se hace visible en números y en gráficos.
4. La estadística formal llega como herramienta de corrección,
   ejecutable en R sin instalar nada.

La voz del curso está fijada en **`docs/redaccion.md`**: español, tuteo,
ejemplos concretos antes de abstracciones, sin guiones largos ni
construcciones «no es X, sino Y». El §7 fija el estándar de los ejemplos
cuantitativos: cada celda de código declara el proceso aleatorio que
simula, cómo lo hace y qué mirar en la salida; las tareas piden
interpretar resultados, nunca los regalan.

## Estructura del curso (ocho módulos)

| # | Módulo | Tema | Interactivos |
|---|--------|------|--------------|
| 1 | Paradojas e intuiciones fundacionales | Sistema 1 vs Sistema 2, Monty Hall, Linda, ley de los números pequeños | `MontyHallGame`, `LindaVenn`, `SmallNumbersLab` |
| 2 | Probabilidad y el problema de Bayes | Tasa base, pruebas diagnósticas, teorema de Bayes | `DiagnosticTestExplorer` |
| 3 | Inferencia y estimación | Anclaje, sobreconfianza, calibración, ruido, IC | `CalibrationGame` |
| 4 | Regresión y causalidad | Regresión a la media, Simpson, correlación espuria | `QualityControlSim`, `SimpsonExplorer`, `SpuriousCorrelationExplorer` |
| 5 | Procesos estocásticos y series de tiempo | Azar vs señal en el tiempo, caminatas aleatorias | `RandomWalkChallenge`, `AvailabilityLab` |
| 6 | Estadística no paramétrica y robusta | Outliers, rangos, permutación, bootstrap | `OutlierDragLab`, `RankVsTExplorer` |
| 7 | El paradigma bayesiano | Prior → posterior, actualización secuencial | `BayesianUpdater`, `LindleyExplorer` |
| 8 | Machine learning, deep learning y decisión | Sobreajuste, validación, umbrales, sesgo algorítmico | `AlgorithmicBiasLab`, `NoisyJudgeSim` |

## Rutas de la aplicación

| Ruta | Contenido |
|------|-----------|
| `/es`, `/en` | Portada del curso |
| `/{locale}/cursos/{slug}` | Los ocho módulos MDX con interactivos, celdas R, quizzes y lectura en voz alta |
| `/{locale}/glosario` | Glosario navegable y buscable (~50 términos, 8 familias) |
| `/{locale}/bibliografia` | Referencias, lecturas y enlaces recomendados |
| `/{locale}/anexos` | Material descargable/complementario |
| `/api/rag-corpus` | Corpus BM25 del asistente IA |

## Estructura del repositorio

```
├── docs/                     # Fuentes de verdad del proyecto
│   ├── diseno.md             #   diseño visual (gobierna todo pixel)
│   ├── redaccion.md          #   voz y estándares editoriales
│   ├── bilingue.md           #   reglas de localización y transcreación
│   ├── produccion.md         #   plan de producción por fases
│   └── …                     #   el_curso, ejemplos, referencias, etc.
├── messages/                 # Cadenas de interfaz: es.json, en.json
├── glossary/terms.json       # Equivalencias bilingües de términos
├── src/
│   ├── app/[locale]/         # Rutas App Router por idioma
│   ├── components/           # ~50 componentes React
│   │   ├── RCell.tsx         #   celda R + editor CodeMirror oneDark
│   │   ├── ReadAloud.tsx     #   lectura en voz alta (Web Speech API)
│   │   ├── ReasoningSims.tsx #   los 16 simuladores del curso
│   │   ├── Quiz.tsx, Callout.tsx, Term.tsx, LabExercise.tsx, …
│   ├── content/modules/      # Los 8 módulos MDX (español)
│   ├── content/en/modules/   # Transcreaciones inglesas (8/8 módulos)
│   ├── i18n/                 # next-intl: routing, request, navigation
│   ├── lib/
│   │   ├── design-tokens.ts  #   paleta + MARCADORES/TRAZOS para charts
│   │   ├── glossary.ts/.en.ts     # glosario por idioma (secciones)
│   │   ├── lecturas.ts/.en.ts     # bibliografía por idioma
│   │   ├── lectura.ts        #   extracción de texto hablable
│   │   ├── webr.ts           #   runtime webR + datasets locales
│   │   └── rag/              #   corpus BM25 del asistente
│   └── workers/              # web workers (webR, RAG)
├── packages/blackboard/      # Pizarra Excalidraw (@cursos/blackboard)
├── public/anexos/            # Archivos de anexos
├── scripts/                  # check_mdx, check_render, run_all_r, audit_terms…
└── tests/                    # Playwright visual tests
```

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS 3.4 · `next-intl`
(rutas `/es`, `/en`) · MDX via `next-mdx-remote/rsc` + KaTeX · webR (R en
WebAssembly) · CodeMirror (editor R, tema oneDark) · `prism-react-renderer`
· Excalidraw (`@cursos/blackboard`, workspace local) · Web Speech API
(lectura en voz alta) · RAG BM25 · Vitest + Playwright.

## Bilingüismo (docs/bilingue.md)

El español es el idioma fuente; el inglés es **transcreación** paralela,
nunca traducción literal. Nada se publica en un solo idioma.

- **Interfaz**: `messages/es.json` + `messages/en.json` (claves estables).
- **Contenido**: `src/content/modules/*.mdx` (ES) → `src/content/en/modules/`.
- **Datos**: `lecturas.ts`/`lecturas.en.ts`, `glossary.ts`/`glossary.en.ts`.
- **Glosario cruzado**: `glossary/terms.json` fija las equivalencias.
- `<Term k="…">` resuelve tooltips según el locale activo.

## Diseño (docs/diseno.md)

`docs/diseno.md` gobierna todo código que produzca píxeles. Paleta de
cinco familias (ocre, tinta, pizarra, arena, lienzo) como tokens CSS en
`src/app/globals.css` + `tailwind.config.ts` + `src/lib/design-tokens.ts`.
Prohibido hex/rgb hardcodeado en componentes; ocre nunca es texto sobre
lienzo; los gráficos usan ocre (señal), arena (comparación), pizarra
(línea base) y tinta (anotaciones) con doble codificación. Tipografía:
Fraunces (titulares), Inter (cuerpo), IBM Plex Mono (números, código,
fórmulas).

## Accesibilidad

- **Lectura en voz alta** (`ReadAloud.tsx` + `src/lib/lectura.ts`):
  Web Speech API en el navegador, lee el módulo párrafo a párrafo con
  resaltado ocre, controles de velocidad y voz, salto por clic en
  párrafos, vigilancia de voces mudas, y **lectura de texto seleccionado**
  mediante botón flotante. Excluye automáticamente código, tablas,
  simuladores y controles (`data-lectura-ui`).
- Contraste AA verificado en ambos modos (claro y oscuro); el color nunca
  es el único canal de información.
- `aria-live` en cambios dinámicos, foco ocre, `prefers-reduced-motion`
  respetado, `dl/dt/dd` semántico en el glosario.

## Desarrollo

```bash
pnpm install
pnpm dev          # http://localhost:3000 (un solo proceso; dos dev
                  # servers sobre el mismo .next/ se corrompen)
```

## Compuertas de calidad

```bash
pnpm typecheck            # tsc --noEmit
pnpm check:mdx            # compila los 8 MDX (frontmatter + sintaxis)
pnpm exec tsx scripts/check_render.mjs   # render real a HTML + KaTeX
pnpm test                 # vitest
pnpm build                # build de producción
pnpm check:r              # ejecuta el código R de las celdas (si hay R)
pnpm qa                   # typecheck + build + test + check:mdx + check:r + visual
```

> **Nota:** `pnpm build` y `pnpm test:visual` comparten `.next` con
> `pnpm dev`; después de correrlos hay que borrar `.next` y relanzar dev.

## Autoría de contenido

- Módulos en `src/content/modules/*.mdx` con frontmatter Zod (`title`,
  `slug`, `order`, `objective`, `keywords`).
- Términos del glosario: el plugin `remark-glossary-terms` detecta
  automáticamente las menciones en la prosa y las envuelve en
  `<Term k="…">` (tooltip con la definición al hover/focus, sin salir
  del módulo). Marca la primera aparición por bloque; `<Term>` manual
  sigue disponible para forzar claves concretas;
  `scripts/audit_terms.py` reporta usos sin envolver.
- Referencias `M1`–`M8` en prosa se convierten automáticamente en
  enlaces con tooltip (`remark-module-refs` + `<MRef>`).
- Celdas R: `<RCell>` (editor + webR) y `<LabExercise>` (código + tareas
  + pista). Base R portable; los datos se generan por simulación con
  `set.seed`; paleta de gráficos = las cinco familias, nunca colores
  externos (`steelblue`, `tomato`, …).
- Cada celda de código lleva un preámbulo: qué hace, cómo lo hace, qué
  mirar en la salida (`docs/redaccion.md` §7).
- Bibliografía: `src/lib/lecturas.ts` (+ `.en.ts`), vista `/bibliografia`.
- Glosario: `src/lib/glossary.ts` (+ `.en.ts`), vista `/glosario`.
- Anexos: manifiesto validado en `src/lib/anexos.ts`, archivos en
  `public/anexos/`, vista `/anexos`.
- Corpus RAG: `src/lib/rag/corpus.ts` (módulos + quizzes + bibliografía
  + anexos) servido en `/api/rag-corpus` al asistente.
# razonamiento_estadistico
