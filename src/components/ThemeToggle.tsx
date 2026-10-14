'use client';

import { useTranslations } from 'next-intl';
import { useBlackboardContext } from '@cursos/blackboard';
import { Monitor, Moon, Sun } from 'lucide-react';
import clsx from 'clsx';

/**
 * Selector de tema claro/auto/oscuro (diseno.md §2.4): escribe en los
 * settings del blackboard (persisten en localStorage['bb-settings']) y
 * ThemeSync aplica la clase .dark al <html>. Estado activo con doble
 * canal (fondo + ocre + aria-pressed), nunca solo color.
 */
const OPTIONS = [
  { value: 'light', Icon: Sun, key: 'light' },
  { value: 'auto', Icon: Monitor, key: 'auto' },
  { value: 'dark', Icon: Moon, key: 'dark' },
] as const;

export function ThemeToggle() {
  const t = useTranslations('theme');
  const { state, dispatch } = useBlackboardContext();
  const current = state.settings.theme;

  return (
    <span className="inline-flex items-center gap-0.5" role="group" aria-label={t('label')}>
      {OPTIONS.map(({ value, Icon, key }) => {
        const active = current === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            title={t(key)}
            onClick={() => dispatch({ type: 'UPDATE_SETTINGS', patch: { theme: value } })}
            className={clsx(
              'rounded p-1 transition-colors duration-150 ease-out-expo',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-100',
              active
                ? 'bg-surface-hover text-ocre-100'
                : 'text-pizarra-100 hover:bg-surface-hover hover:text-tinta-100'
            )}
          >
            <Icon aria-hidden className="h-3.5 w-3.5" />
            <span className="sr-only">{t(key)}</span>
          </button>
        );
      })}
    </span>
  );
}
