# Razonamiento Estadístico

Curso interactivo de **razonamiento estadístico** con R ejecutándose en el
navegador (webR). Hereda la arquitectura completa del curso de análisis de
datos epidemiológicos (ADEI, UNAL Medellín): pizarra digital colaborativa,
asistente IA con RAG acotado al curso, contenido MDX, simuladores y el
mismo sistema de diseño — con contenido nuevo guiado por la documentación
de `docs/` y la tradición Kahneman–Tversky–Gigerenzer.

La escritura es deliberadamente **pedagógica y de falla-primero**: el
estudiante se compromete con una respuesta intuitiva, la observa fallar en
una simulación, y solo entonces recibe la corrección formal que puede
ejecutar en R sin instalar nada.

## Estructura (ocho módulos)

| # | Módulo | Tema |
|---|--------|------|
| I | Paradojas e intuiciones fundacionales | Sistema 1 vs Sistema 2, Monty Hall, Linda, ley de los números pequeños |
| II | Probabilidad y el problema de Bayes | Tasa base, pruebas diagnósticas, teorema de Bayes |
| III | Inferencia y estimación | Muestreo, IC, p-valores, potencia, bootstrap |
| IV | Regresión y causalidad | Regresión a la media, Simpson, correlación espuria |
| V | Procesos estocásticos y series | Azar vs señal en el tiempo, falacia del jugador |
| VI | Estadística no paramétrica y robusta | Outliers, rangos, permutación, robustez |
| VII | El paradigma bayesiano | Prior→posterior, actualización secuencial |
| VIII | ML, deep learning y decisión | Sobreajuste, validación, umbrales, sesgo algorítmico |

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · MDX via
`next-mdx-remote` · webR (R en WebAssembly) · Excalidraw
(`@cursos/blackboard`, paquete local en `packages/blackboard`) · RAG BM25
· Vitest + Playwright.

## Desarrollo

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Compuertas de calidad

```bash
pnpm typecheck            # tsc --noEmit
pnpm check:mdx            # compila los 8 MDX (frontmatter + sintaxis)
pnpm exec tsx scripts/check_render.mjs   # render real a HTML + KaTeX
pnpm test                 # vitest
pnpm build                # build de producción
pnpm check:r              # ejecuta el código R de las celdas (si hay R)
pnpm qa                   # typecheck + check:mdx + test
```

> **Nota:** `pnpm build` y `pnpm test:visual` comparten `.next` con
> `pnpm dev`; después de correrlos hay que borrar `.next` y relanzar dev.

## Autoría de contenido

- Los módulos viven en `src/content/modules/*.mdx` con frontmatter Zod
  (`title`, `slug`, `order`, `objective`, `keywords`).
- Siglas del glosario (`src/lib/glossary.ts`) se envuelven con
  `<Term k="...">`; `scripts/audit_terms.py` reporta usos sin envolver.
- Referencias `M1`–`M8` en prosa se convierten automáticamente en enlaces
  con tooltip (`remark-module-refs` + `<MRef>`).
- Simuladores: `src/components/ReasoningSims.tsx` con el patrón
  `FIG`/`CAPTION`/`SimGuide`/`SimReset` y tokens del tema.
- Lecturas: `src/lib/lecturas.ts` (vista `/bibliografia`).
- Anexos: manifiesto validado en `src/lib/anexos.ts`, archivos en
  `public/anexos/` (vista `/anexos`).
- Corpus RAG: `src/lib/rag/corpus.ts` (módulos + quizzes + bibliografía +
  anexos) servido en `/api/rag-corpus` al asistente.

## Convenciones de voz (docs/redaccion.md)

Español, tuteo, sin guiones largos ni construcciones «no es X, sino Y».
Ejemplos concretos antes de abstracciones. El código R usa base R
portable (los datos se generan por simulación; CSVs futuros van en
`public/data/` y se registran en `LOCAL_DATASETS` de `src/lib/webr.ts`).
