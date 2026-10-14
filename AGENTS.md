# Reglas del repositorio

## Fuente de verdad visual: `docs/diseno.md`

Todo código que produzca píxeles — componentes React, simuladores D3,
canvas, SVG, exports, estilos — debe obedecer `docs/diseno.md`. Si una
decisión visual no está en el doc, se propone ahí primero y luego se
codifica. Los tres principios rectores (§1): el color codifica
información (no adorna), la tipografía sirve a la lectura larga y a la
precisión numérica, el movimiento revela (no entretiene).

## Color

- **Prohibido** hardcodear hex/rgb en componentes nuevos. Usar las
  clases de las cinco familias (`bg-ocre-100`, `text-tinta-100`,
  `border-pizarra-15`, `bg-arena-25`, `bg-lienzo-100`) o los objetos de
  `src/lib/design-tokens.ts` en JS/TS (D3, canvas, Excalidraw).
- `brand-*`, `accent-*` e `ink-*` son puentes legacy deprecados: no
  usarlos en código nuevo; migrarlos al tocar un componente.
- El **ocre nunca es color de texto sobre lienzo** (contraste 2.8:1 <
  AA). Se usa como fondo con `text-tinta-100`, borde, o elemento
  gráfico (§9.1).
- Warning/danger/success/info son semánticos de UI, no colores de
  datos: nunca aparecen en gráficos.

## Visualización de datos (§6)

- Ningún gráfico usa colores fuera de las cinco familias.
- Serie principal = ocre, comparación = arena, línea base = pizarra,
  anotaciones = tinta. Prior = arena discontinua, posterior = ocre
  sólida.
- Eje Y de barras comienza en 0 (salvo documentación explícita y
  advertencia al lector). Escalas logarítmicas se anuncian.
- El color nunca es el único canal: doble codificación con
  `MARCADORES`/`TRAZOS` de `design-tokens.ts`.
- Todo gráfico: título, ejes etiquetados, nota explicativa, navegable
  por teclado, `<title>`/`<desc>` en SVG, descripción alternativa.

## Tipografía (§3)

- `font-display` (Fraunces) para titulares; `font-sans` (Inter) cuerpo;
  `font-mono` (IBM Plex Mono) para números, código, fórmulas y celdas
  numéricas de tablas.
- Medida de línea 65–75 caracteres (`prose`); interlineado 1.6–1.7.

## Motion (§7)

- Duraciones 200–400 ms (500 ms solo en morphing agregada↔desagregada),
  curvas `ease-out-expo` o `ease-spring`, solo transform/opacity.
- Toda animación debe revelar un cambio de estado; si no comunica
  información, se elimina.
- `prefers-reduced-motion` se respeta siempre (ya en globals.css).

## Accesibilidad (§9)

- Componentes interactivos con los cinco estados (reposo, hover, foco,
  activo, deshabilitado); foco = anillo/borde ocre.
- Sliders con flechas, simulaciones con pausa y paso a paso, cambios
  dinámicos anunciados con `aria-live`.

## Revisión (§13.2)

Antes de integrar un componente: ¿respeta la paleta? ¿tipografía
correcta? ¿espaciado base-4? ¿motion justificado? ¿pasa contraste,
teclado y lector de pantalla? El plan por fases está en
`docs/produccion.md`.

## Contenido bilingüe (`docs/bilingue.md`)

- Español = idioma fuente; inglés = **transcreación** paralela, nunca
  traducción literal. Ninguna pieza se publica en un solo idioma (§8).
- Cinco capas con tratamiento distinto: interfaz (JSON, traducción
  directa), editorial (MDX, transcrea), feedback (JSON por tipo de
  respuesta), estructurado (claves estables + valores por idioma),
  código (no se traduce; comentarios sí). §1
- Prohibido hardcodear cadenas de UI: claves semánticas
  (`modules.bayes.baseRate.intro`, `feedback.X.correct|overestimate|
  underestimate|hint`). §2.3
- Framework previsto: next-intl con rutas `/es`, `/en` y carga
  asíncrona de módulos. §2.1
- Formato de números y fechas respeta el locale activo (§7.3); los
  errores del intérprete R quedan en inglés (§7.4).
- Glosario fijado en §5: sesgo→bias (nunca skew), tasa base→base rate,
  regresión a la media→regression to the mean.

## Contenido

- Módulos MDX en `src/content/modules/` con frontmatter Zod.
- Voz: `docs/redaccion.md` (español, tuteo, ejemplos antes de
  abstracciones). Voz inglesa: `docs/bilingue.md` §3 (contracciones,
  germánico sobre latín, activa, sin "not X but Y").
- R en base R portable ejecutable vía webR.
- Compuertas: `pnpm typecheck`, `pnpm check:mdx`, `pnpm test`,
  `pnpm check:r`, `pnpm test:visual`.
