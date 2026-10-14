import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import type { ComponentType, ReactNode } from 'react';
import { Lightbulb, Info, TriangleAlert, Search, CheckCircle2 } from 'lucide-react';

export type CalloutType = 'note' | 'warning' | 'tip' | 'curiosity' | 'success';

export interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const STYLES: Record<
  CalloutType,
  { wrap: string; badge: string; Icon: ComponentType<{ className?: string }> }
> = {
  tip: {
    wrap: 'border-brand-200 bg-brand-50',
    badge: 'text-brand-800',
    Icon: Lightbulb,
  },
  note: {
    wrap: 'border-ink-200 bg-ink-50',
    badge: 'text-ink-700',
    Icon: Info,
  },
  warning: {
    wrap: 'border-warning-200 bg-warning-50',
    badge: 'text-warning-800',
    Icon: TriangleAlert,
  },
  curiosity: {
    wrap: 'border-brand-200 bg-brand-50',
    badge: 'text-brand-800',
    Icon: Search,
  },
  success: {
    wrap: 'border-success-200 bg-success-50',
    badge: 'text-success-800',
    Icon: CheckCircle2,
  },
};

/**
 * Caja de resalte dentro de la narrativa de un módulo: notas, advertencias,
 * tips, curiosidades teóricas y buenas prácticas. Mismo lenguaje visual que
 * el curso MLM.
 */
export function Callout({ type = 'tip', title, children }: CalloutProps) {
  const s = STYLES[type];
  const t = useTranslations('callout');
  return (
    <div className={clsx('my-6 rounded border px-4 py-3', s.wrap)}>
      <p className={clsx('mb-1 flex items-center gap-2 text-sm font-semibold', s.badge)}>
        <s.Icon aria-hidden className="h-4 w-4" />
        {title ?? t(type)}
      </p>
      <div className="prose prose-sm max-w-none text-tinta-75 prose-p:my-1 prose-code:before:content-none prose-code:after:content-none prose-code:bg-code prose-code:text-code-fg">{children}</div>
    </div>
  );
}
