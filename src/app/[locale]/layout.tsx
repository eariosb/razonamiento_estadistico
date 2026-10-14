import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Footer } from '@/components/Footer';
import { WebRProvider } from '@/components/WebRProvider';
import { BlackboardProvider } from '@cursos/blackboard';
import { ThemeSync } from '@/components/ThemeSync';
import { DocumentLocale } from '@/components/DocumentLocale';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: t('title'), description: t('description') };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <DocumentLocale locale={locale} />
      <WebRProvider>
        <BlackboardProvider>
          <ThemeSync />
          {children}
          <Footer />
        </BlackboardProvider>
      </WebRProvider>
    </NextIntlClientProvider>
  );
}
