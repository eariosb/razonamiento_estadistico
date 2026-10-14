/**
 * Tokens semánticos para contextos donde las clases Tailwind no llegan:
 * series de SVG, atributos fill/stroke, objetos style en JSX.
 *
 * Re-anclado a docs/diseno.md: las series ya no usan la paleta seaborn
 * heredada sino las cinco familias del curso (§6). Para código nuevo,
 * preferir `src/lib/design-tokens.ts` (este módulo queda como puente
 * hasta que se retire el último uso).
 */
export const tokens = {
  /** Series y elementos de los gráficos SVG de los simuladores (§6.2). */
  chart: {
    /** Serie principal / foco → ocre. */
    primary: '#C8A11F',
    /** Serie de comparación / lo previo → arena. */
    secondary: '#8F7D5B',
    /** Tercera serie / contexto → pizarra. */
    tertiary: '#6F7A85',
    /** Discordancia / punto relevante → ocre (marca el foco, §2.2). */
    alert: '#C8A11F',
    /** Curva de sesgo² en el explorador de correcciones → arena. */
    bias: '#8F7D5B',
    /** Curva de varianza → pizarra. */
    variance: '#6F7A85',
    /** Serie auxiliar (cuarta serie) → tinta. */
    aux: '#2C3136',
    /** Texto y ejes → tinta y pizarra (§6.1). */
    axis: '#2C3136',
    title: '#2C3136',
    text: '#6F7A85',
    tick: '#8A95A0',
    /** Rejillas y bordes → neutros de la rampa tinta/pizarra/lienzo. */
    grid: '#C3C8CE',
    gridSoft: '#E0E3E6',
    border: '#C3C8CE',
    borderSoft: '#AAB2BB',
    deep: '#2C3136',
  },
  /** Estados semánticos en contextos inline (no clase). Son colores de
   *  UI — veredictos, errores, cautelas — nunca series de datos (§2.2). */
  status: {
    danger: '#dc2626',
    dangerText: '#b91c1c',
    dangerMid: '#f87171',
    dangerSoft: '#fecaca',
    info: '#0284c7',
    infoSoft: '#38bdf8',
    ok: '#16a34a',
    okSoft: '#86efac',
    warning: '#b45309',
  },
  /** Otros colores de UI usados inline. */
  ui: {
    codeBg: '#262A2E',
    surface: '#ffffff',
    cursor: '#C8A11F',
    boardWood: '#937860',
    ink: '#2C3136',
  },
} as const;
