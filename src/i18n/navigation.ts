import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Navegación consciente del locale: `Link`, `usePathname` (sin prefijo)
 * y `useRouter` insertan/quitan `/es` `/en` automáticamente.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
