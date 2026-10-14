'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useState } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import type { ModuleEntry } from '@/lib/modules';

interface BlockDef {
  id: string;
  title: string;
  from: number;
  to: number;
}

interface NavigationProps {
  modules: ModuleEntry[];
  blocks: BlockDef[];
}

function NavContent({ modules, blocks, onNavigate }: NavigationProps & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <nav aria-label={t('courseIndex')} className="flex h-full flex-col">
      <div className="border-b border-pizarra-25 px-4 py-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="block rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-100"
        >
          <span className="inline-flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.png" alt="" width={22} height={22} aria-hidden className="shrink-0 rounded-full" />
            <span className="text-sm font-semibold tracking-tight text-tinta-100">Razonamiento Estadístico</span>
          </span>
          <span className="mt-1 block text-xs text-pizarra-100">{t('school')}</span>
        </Link>
        <p className="mt-1 text-xs text-pizarra-100">{t('campus')}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        {blocks.map((block) => {
          const blockModules = modules.filter(
            (m) => m.meta.order >= block.from && m.meta.order <= block.to
          );
          if (blockModules.length === 0) return null;
          return (
            <div key={block.id} className="mb-4">
              <p className="px-3 pb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-pizarra-100">
                {t('block')} {block.id} · {block.title}
              </p>
              <ul className="space-y-0.5">
                {blockModules.map((mod) => {
                  const href = `/cursos/${mod.meta.slug}`;
                  const active = pathname === href;
                  return (
                    <li key={mod.meta.slug}>
                      <Link
                        href={href}
                        onClick={onNavigate}
                        aria-current={active ? 'page' : undefined}
                        className={clsx(
                          'flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors duration-150 ease-out-expo focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-100',
                          active
                            ? 'bg-surface-hover font-medium text-tinta-100'
                            : 'text-pizarra-100 hover:bg-surface-hover hover:text-tinta-100'
                        )}
                      >
                        {active && (
                          <span
                            aria-hidden
                            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-ocre"
                          />
                        )}
                        <span className="truncate">
                          {mod.meta.order === 0 ? t('review') : `${mod.meta.order}.`}{' '}
                          {mod.meta.title.replace(/^\d+\.\s*/, '')}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {/* Recursos del curso (apéndices transversales) */}
        <div className="mt-6 border-t border-pizarra-15 pt-3">
          <p className="px-3 pb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-pizarra-100">
            {t('resources')}
          </p>
          <ul className="space-y-0.5">
            {(
              [
                { href: '/bibliografia', label: t('bibliografia') },
                { href: '/glosario', label: t('glosario') },
                { href: '/anexos', label: t('anexos') },
              ] as const
            ).map((r) => {
              const active = pathname === r.href;
              return (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={clsx(
                      'flex items-center gap-2 rounded px-3 py-1.5 text-sm transition-colors duration-150 ease-out-expo focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-100',
                      active
                        ? 'bg-surface-hover font-medium text-tinta-100'
                        : 'text-pizarra-100 hover:bg-surface-hover hover:text-tinta-100'
                    )}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-ocre"
                      />
                    )}
                    <span className="truncate">{r.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

/**
 * Sidebar de navegación agrupado por bloques (I–IV), con drawer en móvil.
 * Mismo patrón de UX que el Sidebar del curso MLM.
 */
export function Navigation({ modules, blocks }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations('nav');

  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-pizarra-25 bg-surface lg:block">
        <NavContent modules={modules} blocks={blocks} />
      </aside>

      {/* Mobile: botón hamburguesa + drawer */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label={t('openMenu')}
          className="fixed left-4 top-4 z-40 rounded border border-pizarra-30 bg-surface p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-100"
        >
          <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {mobileOpen && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-tinta-100/40 animate-fade-in"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <aside className="absolute inset-y-0 left-0 w-80 max-w-[85vw] border-r border-pizarra-25 bg-surface animate-slide-in">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label={t('closeMenu')}
                className="absolute right-3 top-3 rounded p-1.5 text-pizarra-100 hover:bg-surface-hover hover:text-tinta-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-100"
              >
                <X aria-hidden className="h-4 w-4" />
              </button>
              <NavContent modules={modules} blocks={blocks} onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
