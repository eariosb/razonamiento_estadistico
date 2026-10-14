import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  getAllModules,
  findModule,
  getModuleSource,
  getAdjacentModules,
  blockForOrder,
} from '@/lib/modules';
import { remarkModuleRefs } from '@/lib/remark-module-refs';
import { remarkGlossaryTerms } from '@/lib/remark-glossary-terms';
import { mdxComponents } from '@/components/mdx-components';
import { TableOfContents } from '@/components/TableOfContents';
import { ReadAloud } from '@/components/ReadAloud';
import { AppLayout } from '@/components/AppLayout';
import { SessionTracker } from '@/components/SessionTracker';
import { PresentationSync } from '@/components/PresentationSync';
import { RemoteCursor } from '@/components/RemoteCursor';
import { BlackboardContextBridge } from '@cursos/blackboard';
import type { ModuleContext } from '@cursos/blackboard';
import { RE_ASSISTANT_PROFILE } from '@/config/assistant';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllModules(locale).map((mod) => ({ locale, slug: mod.meta.slug }))
  );
}

export default async function ModulePage({
  params,
}: Readonly<{
  params: Promise<{ locale: string; slug: string }>;
}>) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const entry = findModule(slug, locale);
  if (!entry) notFound();

  const source = getModuleSource(entry.fileName, locale);
  const { prev, next } = getAdjacentModules(slug, locale);
  const block = blockForOrder(entry.meta.order);
  const modules = getAllModules(locale);
  const t = await getTranslations('course');
  const tNav = await getTranslations('nav');
  const tBlocks = await getTranslations('blocks');

  const moduleContext: ModuleContext = {
    slug: entry.meta.slug,
    title: entry.meta.title,
    objective: [entry.meta.objective],
    datasets: entry.meta.datasets,
    order: entry.meta.order,
  };

  return (
    <AppLayout>
      <BlackboardContextBridge context={moduleContext} profile={RE_ASSISTANT_PROFILE} />
      <SessionTracker slug={entry.meta.slug} title={entry.meta.title} />
      <PresentationSync />

      <div className="mx-auto flex max-w-6xl justify-center gap-8">
        <article className="min-w-0 max-w-3xl flex-1">
          <header className="mb-8 border-b border-ink-200 pb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-800">
              {tNav('block')} {block.id} · {tBlocks(block.id)} ·{' '}
              {entry.meta.order === 0
                ? tNav('review')
                : t('moduleOf', {
                    order: entry.meta.order,
                    total: modules.filter((m) => m.meta.order > 0).length,
                  })}
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold leading-tight tracking-tight text-ink-900">
              {entry.meta.title.replace(/^\d+\.\s*/, '')}
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-600">{entry.meta.objective}</p>
            {entry.meta.datasets.length > 0 && (
              <p className="mt-3 text-sm text-ink-500">
                <span className="font-medium uppercase tracking-wide">{t('data')}</span>{' '}
                {entry.meta.datasets.join(', ')}
              </p>
            )}
          </header>

          <ReadAloud targetId="contenido-modulo" />

          <div id="contenido-modulo" className="prose prose-ink max-w-none prose-headings:scroll-mt-20 prose-h2:mt-10 prose-h2:border-t prose-h2:border-ink-100 prose-h2:pt-7 prose-blockquote:font-display prose-code:rounded prose-code:bg-code prose-code:text-code-fg prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:bg-code prose-pre:text-code-fg">
            <MDXRemote
              source={source}
              components={mdxComponents}
              options={{
                // Contenido local y confiable: permitimos expresiones JSX en
                // los MDX (props de CodeBlock, Quiz, DataTable, etc.).
                blockJS: false,
                mdxOptions: {
                  remarkPlugins: [remarkMath, remarkGfm, remarkModuleRefs, remarkGlossaryTerms],
                  rehypePlugins: [rehypeKatex, rehypeSlug],
                },
              }}
            />
          </div>

          <nav aria-label={t('navAria')} className="mt-12 flex justify-between gap-4 border-t border-ink-200 pt-6">
            {prev ? (
              <Link
                href={`/cursos/${prev.meta.slug}`}
                className="rounded border border-ink-200 bg-surface px-4 py-2.5 text-sm text-ink-700 shadow-sm transition-all hover:border-brand-300 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                ← {prev.meta.order === 0 ? tNav('review') : `${prev.meta.order}.`}{' '}
                {prev.meta.title.replace(/^\d+\.\s*/, '')}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={`/cursos/${next.meta.slug}`}
                className="rounded border border-ink-200 bg-surface px-4 py-2.5 text-right text-sm text-ink-700 shadow-sm transition-all hover:border-brand-300 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
              >
                {next.meta.order === 0 ? tNav('review') : `${next.meta.order}.`}{' '}
                {next.meta.title.replace(/^\d+\.\s*/, '')} →
              </Link>
            )}
          </nav>
        </article>

        <div id="bb-toc" className="hidden shrink-0 xl:block">
          <TableOfContents />
        </div>
      </div>

      <RemoteCursor />
    </AppLayout>
  );
}
