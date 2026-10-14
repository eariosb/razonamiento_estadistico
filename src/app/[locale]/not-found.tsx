import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('nav');
  return (
    <main className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="font-display text-4xl font-semibold text-ink-900">404</h1>
      <Link
        href="/"
        className="mt-6 inline-block rounded border border-ink-200 bg-surface px-4 py-2 text-sm text-ink-700 hover:border-brand-300"
      >
        ← {t('courseIndex')}
      </Link>
    </main>
  );
}
