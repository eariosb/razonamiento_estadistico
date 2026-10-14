'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { GlossarySection } from '@/lib/glossary';

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * Índice del glosario con búsqueda local: filtra por término o por
 * definición, insensible a mayúsculas y acentos. Mismo lenguaje visual
 * que la bibliografía — secciones con rótulo mono y listas planas con
 * borde pizarra (docs/diseno.md §5.1).
 */
export function GlossaryIndex({ sections }: { sections: GlossarySection[] }) {
  const t = useTranslations('glosario');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const needle = normalize(q.trim());
    if (!needle) return sections;
    return sections
      .map((s) => ({
        ...s,
        entradas: s.entradas.filter(
          (e) =>
            normalize(e.term).includes(needle) ||
            normalize(e.def).includes(needle) ||
            normalize(e.k).includes(needle),
        ),
      }))
      .filter((s) => s.entradas.length > 0);
  }, [q, sections]);

  const visible = filtered.reduce((n, s) => n + s.entradas.length, 0);

  return (
    <>
      <div className="relative mb-8">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pizarra-100"
          aria-hidden
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('search')}
          aria-label={t('search')}
          className="w-full rounded border border-pizarra-25 bg-surface py-2.5 pl-10 pr-4 text-sm text-tinta-100 placeholder:text-pizarra-75 focus-visible:border-ocre-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-100"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-pizarra-100">
          {t('count', { visible })}
        </span>
      </div>

      {visible === 0 ? (
        <p className="rounded border border-pizarra-25 bg-surface px-4 py-6 text-center text-sm text-pizarra-100">
          {t('empty', { q })}
        </p>
      ) : (
        filtered.map((seccion) => (
          <section key={seccion.titulo} className="mb-10">
            <h2 className="mb-3 font-mono text-sm uppercase tracking-[0.14em] text-pizarra-100">
              {seccion.titulo}
            </h2>
            <dl className="divide-y divide-pizarra-15 rounded border border-pizarra-25 bg-surface">
              {seccion.entradas.map((e) => (
                <div key={e.k} className="px-4 py-3.5">
                  <dt className="text-sm font-medium text-tinta-100">
                    {e.term}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-tinta-75">
                    {e.def}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))
      )}
    </>
  );
}
