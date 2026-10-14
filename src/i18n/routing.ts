import { defineRouting } from 'next-intl/routing';

/**
 * Locales del curso según docs/bilingue.md: español como idioma fuente,
 * inglés como transcreación paralela. Prefijo siempre visible
 * (`/es/...`, `/en/...`) para SEO y enlaces compartibles.
 */
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
