import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ThemeToggle } from './ThemeToggle';

export function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="border-t border-pizarra-25 bg-surface px-4 py-2.5 text-center font-mono text-[11px] leading-tight text-pizarra-100">
      {t('credit')} ·{' '}
      <a
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        target="_blank"
        rel="noreferrer"
        className="text-pizarra-100 underline decoration-pizarra-30 underline-offset-2 transition-colors hover:text-tinta-100 hover:decoration-ocre-75"
      >
        CC BY-NC-SA 4.0
      </a>
      {' · '}
      <LocaleSwitcher />
      {' · '}
      <ThemeToggle />
    </footer>
  );
}
