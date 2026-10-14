import { AppLayout } from '@/components/AppLayout';
import { GlossaryIndex } from '@/components/GlossaryIndex';
import { getGlossarySections } from '@/lib/glossary';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'glosario' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function GlosarioPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('glosario');
  const sections = await getGlossarySections(locale);
  const total = sections.reduce((n, s) => n + s.entradas.length, 0);

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 border-b border-pizarra-25 pb-6">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-pizarra-100">
            {t('eyebrow')}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-tight text-tinta-100">
            {t('title')}
          </h1>
          <p className="mt-3 text-pizarra-100">{t('intro', { total })}</p>
        </header>

        <GlossaryIndex sections={sections} />
      </div>
    </AppLayout>
  );
}
