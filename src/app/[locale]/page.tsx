import { getTranslations, getLocale, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getAllModules, COURSE_BLOCKS } from '@/lib/modules';

/**
 * Portada del curso (docs/diseno.md §1, §4.1, §5.1):
 * asimetría controlada, vacío generoso, tarjetas planas que se separan
 * del fondo por borde y espacio, nunca por sombras. El ocre aparece solo
 * en la interacción y en la barra de la cita: revelación, no adorno.
 */
export default async function HomePage() {
  const locale = await getLocale();
  setRequestLocale(locale);
  const modules = getAllModules(locale);
  const t = await getTranslations('home');
  const tNav = await getTranslations('nav');
  const tBlocks = await getTranslations('blocks');

  return (
    <main className="mx-auto max-w-4xl px-6 pb-28 pt-16 sm:pt-20">
      <header>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-pizarra-100">
          {t('eyebrow')}
        </p>
        <h1 className="mt-4 max-w-[14ch] font-display text-5xl font-semibold leading-[1.05] tracking-tight text-tinta-100 sm:text-6xl text-balance">
          {t('title')}
        </h1>
        <p className="mt-6 max-w-[65ch] text-lg leading-relaxed text-pizarra-100">
          {t('tagline')}
        </p>
        <blockquote className="mt-12 max-w-[52ch] border-l-2 border-ocre-75 pl-6">
          <p className="font-display text-lg italic leading-relaxed text-tinta-75">
            &ldquo;{t('quote')}&rdquo;
          </p>
          <footer className="mt-2 font-mono text-xs uppercase tracking-[0.18em] not-italic text-pizarra-100">
            {t('quoteAuthor')}
          </footer>
        </blockquote>
      </header>

      <section aria-label={t('modulesAria')} className="mt-20">
        {COURSE_BLOCKS.map((block) => {
          const blockModules = modules.filter(
            (m) => m.meta.order >= block.from && m.meta.order <= block.to
          );
          if (blockModules.length === 0) return null;
          return (
            <div key={block.id} className="mt-14 first:mt-0">
              <div className="flex items-baseline justify-between gap-4 border-t border-pizarra-30 pt-4">
                <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-pizarra-100">
                  {tNav('block')} {block.id} · {tBlocks(block.id)}
                </h2>
                <span className="shrink-0 font-mono text-xs text-pizarra-100">
                  {String(block.from).padStart(2, '0')}–{String(block.to).padStart(2, '0')}
                </span>
              </div>
              <ol className="mt-6 space-y-3">
                {blockModules.map((mod) => (
                  <li key={mod.meta.slug}>
                    <Link
                      href={`/cursos/${mod.meta.slug}`}
                      className="group flex items-start gap-5 rounded-lg border border-pizarra-30 bg-surface px-5 py-4 transition-[transform,border-color] duration-150 ease-out-expo hover:-translate-y-0.5 hover:border-ocre-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-100"
                    >
                      <span className="w-7 shrink-0 pt-0.5 font-mono text-sm tabular-nums text-pizarra-100">
                        {mod.meta.order === 0 ? '·' : String(mod.meta.order).padStart(2, '0')}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium leading-snug text-tinta-100">
                          {mod.meta.title.replace(/^\d+\.\s*/, '')}
                        </span>
                        <span className="mt-1 block max-w-[62ch] text-sm leading-relaxed text-pizarra-100">
                          {mod.meta.objective}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </section>
    </main>
  );
}
