import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

/**
 * Sistema de diseño del curso — docs/diseno.md es la fuente de verdad.
 *
 * Las cinco familias (ocre/tinta/pizarra/arena/lienzo) se exponen con los
 * pasos de alfa del doc (10/25/50/75/100) y sus canales viven en
 * globals.css, lo que habilita la reinterpretación de modo oscuro (§2.4).
 *
 * Puentes legacy: `brand` y `accent` derivan ahora del ocre, e `ink` es la
 * rampa neutra anclada en lienzo (200), pizarra (500) y tinta (900). Todo
 * componente nuevo usa las familias del doc; los puentes desaparecen al
 * terminar la migración (docs/produccion.md, F2).
 */
const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/content/**/*.{ts,tsx,mdx}',
    // El paquete workspace @cursos/blackboard trae sus propias clases
    // Tailwind — sin esta entrada sus clases no generarían CSS.
    './packages/blackboard/src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ---- Las cinco familias (diseno.md §2.1, §12.1) ---- */
        ocre: {
          10: 'rgb(var(--ocre) / 0.1)',
          25: 'rgb(var(--ocre) / 0.25)',
          50: 'rgb(var(--ocre) / 0.5)',
          75: 'rgb(var(--ocre) / 0.75)',
          100: 'rgb(var(--ocre) / <alpha-value>)',
          DEFAULT: 'rgb(var(--ocre) / <alpha-value>)',
        },
        tinta: {
          5: 'rgb(var(--tinta) / 0.05)',
          10: 'rgb(var(--tinta) / 0.1)',
          25: 'rgb(var(--tinta) / 0.25)',
          50: 'rgb(var(--tinta) / 0.5)',
          75: 'rgb(var(--tinta) / 0.75)',
          100: 'rgb(var(--tinta) / <alpha-value>)',
          DEFAULT: 'rgb(var(--tinta) / <alpha-value>)',
        },
        pizarra: {
          10: 'rgb(var(--pizarra) / 0.1)',
          15: 'rgb(var(--pizarra) / 0.15)',
          25: 'rgb(var(--pizarra) / 0.25)',
          30: 'rgb(var(--pizarra) / 0.3)',
          50: 'rgb(var(--pizarra) / 0.5)',
          75: 'rgb(var(--pizarra) / 0.75)',
          100: 'rgb(var(--pizarra) / <alpha-value>)',
          DEFAULT: 'rgb(var(--pizarra) / <alpha-value>)',
        },
        arena: {
          10: 'rgb(var(--arena) / 0.1)',
          25: 'rgb(var(--arena) / 0.25)',
          50: 'rgb(var(--arena) / 0.5)',
          75: 'rgb(var(--arena) / 0.75)',
          100: 'rgb(var(--arena) / <alpha-value>)',
          DEFAULT: 'rgb(var(--arena) / <alpha-value>)',
        },
        lienzo: {
          25: 'rgb(var(--lienzo) / 0.25)',
          50: 'rgb(var(--lienzo) / 0.5)',
          100: 'rgb(var(--lienzo) / <alpha-value>)',
          DEFAULT: 'rgb(var(--lienzo) / <alpha-value>)',
        },
        /* Superficie elevada (tarjetas/sidebar §5.1): lienzo en claro,
         * tinta elevada en oscuro — reinterpretación §2.4. */
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-hover': 'rgb(var(--surface-hover) / <alpha-value>)',
        /* ---- Puentes legacy (deprecados, ver produccion.md F2) ---- */
        accent: {
          50: '#fbf6e7',
          100: '#f5ebc8',
          200: '#ebd88f',
          300: '#dec158',
          400: '#d1ae33',
          500: '#c8a11f',
          600: '#a98819',
          700: '#8a6e14',
          800: '#6b5410',
          900: '#4c3b0b',
        },
        /* Rampa neutra puente (legacy): canales --ink-N en globals.css;
         * en .dark la rampa se invierte (diseno.md §2.4), así todo uso
         * ink-* se reinterpreta sin variantes manuales. */
        ink: {
          50: 'rgb(var(--ink-50) / <alpha-value>)',
          100: 'rgb(var(--ink-100) / <alpha-value>)',
          200: 'rgb(var(--ink-200) / <alpha-value>)',
          300: 'rgb(var(--ink-300) / <alpha-value>)',
          400: 'rgb(var(--ink-400) / <alpha-value>)',
          500: 'rgb(var(--ink-500) / <alpha-value>)',
          600: 'rgb(var(--ink-600) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          900: 'rgb(var(--ink-900) / <alpha-value>)',
        },
        positive: {
          50: '#e8f5e9',
          500: '#2e7d32',
          700: '#1b5e20',
        },
        /* ----------------------------------------------------------
         * Tokens semánticos (fase 5): los valores viven en
         * globals.css como canales RGB (--rol-tono). Los nombres
         * describen el PAPEL del color, no su apariencia, para que
         * futuras fases (sistema visual, modo oscuro) redefinan la
         * variable y no cada uso.
         * brand → identidad del curso · warning → cautelas
         * danger → rechazo/error · success → favorable/meta
         * info → resaltado neutral · code → fondo de código
         * Tonos interpolados (55…715): hex heredados de positive,
         * green y rose preservados bit a bit.
         * ---------------------------------------------------------- */
        brand: {
          50: 'rgb(var(--brand-50) / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
          800: 'rgb(var(--brand-800) / <alpha-value>)',
          900: 'rgb(var(--brand-900) / <alpha-value>)',
        },
        warning: {
          50: 'rgb(var(--warning-50) / <alpha-value>)',
          100: 'rgb(var(--warning-100) / <alpha-value>)',
          200: 'rgb(var(--warning-200) / <alpha-value>)',
          300: 'rgb(var(--warning-300) / <alpha-value>)',
          400: 'rgb(var(--warning-400) / <alpha-value>)',
          500: 'rgb(var(--warning-500) / <alpha-value>)',
          600: 'rgb(var(--warning-600) / <alpha-value>)',
          700: 'rgb(var(--warning-700) / <alpha-value>)',
          800: 'rgb(var(--warning-800) / <alpha-value>)',
          900: 'rgb(var(--warning-900) / <alpha-value>)',
        },
        danger: {
          50: 'rgb(var(--danger-50) / <alpha-value>)',
          100: 'rgb(var(--danger-100) / <alpha-value>)',
          200: 'rgb(var(--danger-200) / <alpha-value>)',
          300: 'rgb(var(--danger-300) / <alpha-value>)',
          400: 'rgb(var(--danger-400) / <alpha-value>)',
          500: 'rgb(var(--danger-500) / <alpha-value>)',
          600: 'rgb(var(--danger-600) / <alpha-value>)',
          650: 'rgb(var(--danger-650) / <alpha-value>)',
          700: 'rgb(var(--danger-700) / <alpha-value>)',
          800: 'rgb(var(--danger-800) / <alpha-value>)',
          900: 'rgb(var(--danger-900) / <alpha-value>)',
        },
        success: {
          50: 'rgb(var(--success-50) / <alpha-value>)',
          55: 'rgb(var(--success-55) / <alpha-value>)',
          100: 'rgb(var(--success-100) / <alpha-value>)',
          105: 'rgb(var(--success-105) / <alpha-value>)',
          200: 'rgb(var(--success-200) / <alpha-value>)',
          300: 'rgb(var(--success-300) / <alpha-value>)',
          400: 'rgb(var(--success-400) / <alpha-value>)',
          405: 'rgb(var(--success-405) / <alpha-value>)',
          500: 'rgb(var(--success-500) / <alpha-value>)',
          505: 'rgb(var(--success-505) / <alpha-value>)',
          515: 'rgb(var(--success-515) / <alpha-value>)',
          600: 'rgb(var(--success-600) / <alpha-value>)',
          700: 'rgb(var(--success-700) / <alpha-value>)',
          705: 'rgb(var(--success-705) / <alpha-value>)',
          715: 'rgb(var(--success-715) / <alpha-value>)',
          800: 'rgb(var(--success-800) / <alpha-value>)',
          900: 'rgb(var(--success-900) / <alpha-value>)',
        },
        info: {
          50: 'rgb(var(--info-50) / <alpha-value>)',
          100: 'rgb(var(--info-100) / <alpha-value>)',
          200: 'rgb(var(--info-200) / <alpha-value>)',
          300: 'rgb(var(--info-300) / <alpha-value>)',
          400: 'rgb(var(--info-400) / <alpha-value>)',
          500: 'rgb(var(--info-500) / <alpha-value>)',
          600: 'rgb(var(--info-600) / <alpha-value>)',
          700: 'rgb(var(--info-700) / <alpha-value>)',
          800: 'rgb(var(--info-800) / <alpha-value>)',
          900: 'rgb(var(--info-900) / <alpha-value>)',
        },
        code: 'rgb(var(--code) / <alpha-value>)',
        /* Texto sobre superficies siempre oscuras (terminal/código):
         * no se reinterpreta en .dark. */
        'code-fg': 'rgb(var(--code-fg) / <alpha-value>)',
        'on-accent': 'rgb(var(--on-accent) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
      },
      /* ----------------------------------------------------------
       * Movimiento (fase 7): una sola curva ease-out tipo "expo"
       * para todo lo interactivo; duraciones cortas (150–250ms) y
       * solo transform/opacity. prefers-reduced-motion se respeta
       * en globals.css.
       * ---------------------------------------------------------- */
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        /* Aproximación spring suave (diseno.md §7.1: física natural). */
        spring: 'cubic-bezier(0.34, 1.4, 0.64, 1)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-in': {
          from: { transform: 'translateX(-8px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in': 'slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [typography],
};

export default config;
