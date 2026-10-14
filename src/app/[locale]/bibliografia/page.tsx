import { AppLayout } from '@/components/AppLayout';
import { getLecturas } from '@/lib/lecturas';
import { BookOpen, ExternalLink } from 'lucide-react';
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
  const t = await getTranslations({ locale, namespace: 'bibliografia' });
  return { title: t('metaTitle'), description: t('metaDescription') };
}

export default async function BibliografiaPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('bibliografia');
  const { lecturas, enlaces } = await getLecturas(locale);
  const total = lecturas.reduce((n, s) => n + s.entradas.length, 0);

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
          <p className="mt-3 rounded border border-arena-25 bg-arena-10 px-3 py-2 text-sm text-tinta-75">
            {t('verification')}
          </p>
        </header>

        {lecturas.map((seccion) => (
          <section key={seccion.titulo} className="mb-10">
            <h2 className="mb-1 font-mono text-sm uppercase tracking-[0.14em] text-pizarra-100">
              {seccion.titulo}
            </h2>
            {seccion.nota && (
              <p className="mb-3 text-sm italic text-pizarra-100">{seccion.nota}</p>
            )}
            <ul className="divide-y divide-pizarra-15 rounded border border-pizarra-25 bg-surface">
              {seccion.entradas.map((l) => (
                <li key={l.cita} className="flex items-start gap-3 p-4">
                  <BookOpen
                    className="mt-0.5 h-5 w-5 shrink-0 text-ocre-100"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-relaxed text-tinta-100">
                      {l.cita}
                    </p>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      {l.nota && <span className="text-pizarra-100">{l.nota}</span>}
                      {l.doi && (
                        <a
                          href={`https://doi.org/${l.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-tinta-100 underline decoration-ocre-75 underline-offset-2 transition-colors hover:decoration-ocre-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-100"
                        >
                          DOI
                          <ExternalLink className="h-3 w-3" aria-hidden />
                        </a>
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <h2 className="mb-4 mt-12 border-t border-pizarra-25 pt-8 font-mono text-sm uppercase tracking-[0.14em] text-pizarra-100">
          {t('linksHeading')}
        </h2>
        {enlaces.map((grupo) => (
          <section key={grupo.titulo} className="mb-8">
            <h3 className="mb-3 text-sm font-semibold text-tinta-75">
              {grupo.titulo}
            </h3>
            <ul className="divide-y divide-pizarra-15 rounded border border-pizarra-25 bg-surface">
              {grupo.items.map((e) => (
                <li key={e.url} className="flex items-start gap-3 p-4">
                  <ExternalLink
                    className="mt-0.5 h-5 w-5 shrink-0 text-ocre-100"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-tinta-100 underline decoration-pizarra-30 underline-offset-2 transition-colors hover:decoration-ocre-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-100"
                    >
                      {e.nombre}
                    </a>
                    <p className="mt-1 text-sm leading-relaxed text-pizarra-100">
                      {e.nota}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </AppLayout>
  );
}
