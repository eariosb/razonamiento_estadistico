import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Todo excepto API, assets estáticos e internals de Next.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
