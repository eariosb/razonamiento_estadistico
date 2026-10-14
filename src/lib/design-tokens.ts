/**
 * Tokens de diseño del curso — docs/diseno.md §12.1.
 *
 * Úsalo en todo código que pinte fuera de Tailwind: simuladores D3,
 * canvas, SVG generado, Excalidraw, exportaciones a imagen/PDF.
 * Nunca hardcodees hex: importa de aquí para que la reinterpretación
 * de modo oscuro y la evolución de la paleta se propaguen solas.
 *
 * Semántica (§2.2):
 *   ocre    → revelación, foco activo, significancia, acierto
 *   tinta   → voz formal: ejes, texto, respuesta correcta
 *   pizarra → soporte: rejillas, IC, referencias, error sin drama
 *   arena   → lo previo/basal: priors, líneas base, contexto
 *   lienzo  → superficie de lectura
 */

export const OCRE = '#C8A11F';
export const TINTA = '#2C3136';
export const PIZARRA = '#6F7A85';
export const ARENA = '#8F7D5B';
export const LIENZO = '#E6E8EA';

/** Reinterpretación oscura (§2.4): preserva papeles, no invierte. */
export const DARK = {
  bg: '#1E2225', // tinta profunda, no carbón puro
  fg: LIENZO,
  pizarra: '#8F9AA5', // aclarada: sigue siendo soporte sobre oscuro
  arena: '#A08D69', // saturada: no se pierde en el fondo
  ocre: OCRE, // intacto
  tinta: TINTA,
} as const;

/** Lee el canal RGB activo de una familia y lo compone con alfa.
 *  Respeta el modo oscuro porque las CSS vars ya están redefinidas. */
export function canal(
  familia: 'ocre' | 'tinta' | 'pizarra' | 'arena' | 'lienzo',
  alpha = 1,
): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${familia}`)
    .trim();
  return `rgb(${raw} / ${alpha})`;
}

/** Roles de serie en visualizaciones (§6.2). */
export const SERIE = {
  principal: OCRE,
  comparacion: ARENA,
  base: PIZARRA,
  anotacion: TINTA,
} as const;

/** Doble codificación para daltonismo (§6.2): el color nunca es el
 *  único canal. Combinar con SERIE al pintar series múltiples. */
export const MARCADORES = ['circle', 'square', 'triangle'] as const;
export const TRAZOS = ['solid', 'dashed', 'dotted'] as const;

/** Opacidades y grosores estándar de los estándares de visualización. */
export const VIZ = {
  intervaloConfianza: 0.2, // alfa del color de su serie (§6.2)
  bandaConfianza: 0.15, // series de tiempo (§6.5)
  rellenoConjunto: 0.1, // Venn y conjuntos (§6.6)
  puntoDispersion: 0.6, // alfa de puntos tinta (§6.4)
  resaltadoAtipico: 0.1, // fondo ocre de outliers en tablas (§5.6)
  anchoLinea: 2,
  anchoLineaFina: 1,
} as const;

/** Motion (§7.1): 200–400 ms, ease-out o spring. */
export const MOTION = {
  rapido: 150, // microinteracciones (§7.3)
  base: 300, // actualización de gráficos
  eje: 200, // re-escalado de ejes (transición separada)
  morphing: 500, // agregada ↔ desagregada, p. ej. Simpson (§7.2)
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  spring: 'cubic-bezier(0.34, 1.4, 0.64, 1)',
} as const;
