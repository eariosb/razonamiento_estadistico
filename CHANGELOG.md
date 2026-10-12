# Changelog

## [0.1.0] — scaffold inicial

Herencia de la plataforma del curso ADEI (epidemiología) con contenido y
metadatos nuevos de Razonamiento Estadístico.

### Heredado de la plataforma

- Next.js 15 App Router + TypeScript + Tailwind; MDX con KaTeX,
  `remark-module-refs` (M1–M8 → enlaces con tooltip) y glosario `<Term>`.
- `@cursos/blackboard` copiado a `packages/blackboard` (pizarra
  Excalidraw, captura de fórmulas/salidas, calculadora, sesión).
- Asistente IA con RAG BM25 sobre módulos, quizzes, bibliografía y
  anexos (`/api/rag-corpus`), perfil nuevo en `src/config/assistant.ts`.
- webR 0.6 en el navegador (`src/lib/webr.ts`, datasets locales en
  `public/data/` cuando haga falta).
- Infra de QA: `check:mdx`, `check_render.mjs`, Vitest (121 tests),
  Playwright, `check:r`.

### Agregado (contenido nuevo)

- Ocho módulos en `src/lib/modules.ts` + `COURSE_BLOCKS`.
- **Módulo I completo** (`01-paradojas-e-intuicion`): Monty Hall, Linda,
  ley de los números pequeños; quizzes, flashcards, RCell/webR.
- Módulos II–VIII como esqueletos navegables con objetivos y keywords.
- `ReasoningSims.tsx`: `MontyHallGame`, `LindaVenn`, `SmallNumbersLab`.
- Glosario, lecturas (Kahneman/Tversky/Gigerenzer), manifiesto de
  anexos y bibliografía RAG nuevos; tests de corpus actualizados.

### Removido (específico de epidemiología)

- Módulos MDX del curso anterior, `EpiSims`/`ExactSims`/`QualitySims`/
  `WorldSims`, `ConductStudy`, `DecisionPanel`/`DecisionCard` (NNT),
  `Claim`, `SasBlock`, workers exactos, datasets y anexos epi.
