'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import clsx from 'clsx';

/**
 * Selector de idioma: conserva la ruta actual entre /es y /en gracias al
 * Link consciente del locale (docs/bilingue.md, capa de interfaz).
 */
export function LocaleSwitcher() {
  const t = useTranslations('localeSwitcher');
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <span className="inline-flex items-center gap-1" role="group" aria-label={t('label')}>
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          aria-current={l === locale ? 'true' : undefined}
          className={clsx(
            'rounded px-1.5 py-0.5 uppercase transition-colors duration-150',
            l === locale
              ? 'font-semibold text-tinta-100'
              : 'text-pizarra-100 hover:text-tinta-75'
          )}
        >
          {l}
        </Link>
      ))}
    </span>
  );
}
