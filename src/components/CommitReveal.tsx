'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { LockKeyhole, CheckCircle2, XCircle } from 'lucide-react';
import clsx from 'clsx';
import { MathText } from '@/lib/math-text';

export interface CommitRevealProps {
  question: string;
  options: string[];
  /** Si se da, marca la opción correcta tras comprometer la respuesta. */
  correctIndex?: number;
  children: ReactNode;
}

/**
 * Compuerta de compromiso: el lector registra una respuesta antes de
 * que el contenido (la revelación pedagógica) exista en el documento.
 * Sin respuesta registrada, el resto del bloque no se renderiza: el
 * intento-fallo es estructural, no sugerido. El widget se excluye de
 * la lectura en voz alta ([data-lectura-ui]); el contenido revelado
 * queda fuera de ese marcador para que sí se lea.
 */
export function CommitReveal({ question, options, correctIndex, children }: CommitRevealProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [committed, setCommitted] = useState(false);
  const t = useTranslations('commitReveal');

  return (
    <>
      <div data-lectura-ui className="my-6 rounded border border-ink-200 bg-surface p-5 shadow-sm">
        <p className="mb-3 flex items-start gap-2 font-medium text-ink-900">
          <LockKeyhole aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-ink-500" />
          <MathText text={question} />
        </p>
        <fieldset disabled={committed} className="space-y-2">
          <legend className="sr-only">{t('optionsLegend')}</legend>
          {options.map((opt, i) => (
            <label
              key={i}
              className={clsx(
                'flex cursor-pointer items-start gap-2.5 rounded border px-3 py-2 text-sm transition-colors',
                committed && correctIndex !== undefined && i === correctIndex && 'border-success-300 bg-success-50',
                committed && correctIndex !== undefined && selected === i && i !== correctIndex && 'border-danger-300 bg-danger-50',
                !committed && selected === i && 'border-brand-400 bg-brand-50',
                !committed && selected !== i && 'border-ink-200 hover:bg-ink-50'
              )}
            >
              <input
                type="radio"
                name={question}
                checked={selected === i}
                onChange={() => setSelected(i)}
                className="mt-0.5 accent-brand-600"
              />
              <span className="text-ink-700"><MathText text={opt} /></span>
            </label>
          ))}
        </fieldset>

        {!committed ? (
          <button
            type="button"
            disabled={selected === null}
            onClick={() => setCommitted(true)}
            className="mt-4 rounded bg-ocre-100 px-4 py-1.5 text-sm font-medium text-on-accent transition-colors hover:bg-ocre-75 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            {t('commit')}
          </button>
        ) : (
          <div className="mt-3 flex items-center gap-2 text-sm" role="status">
            {correctIndex !== undefined ? (
              selected === correctIndex ? (
                <>
                  <CheckCircle2 aria-hidden className="h-4 w-4 text-success-600" />
                  <span className="text-success-900">{t('revealedCorrect')}</span>
                </>
              ) : (
                <>
                  <XCircle aria-hidden className="h-4 w-4 text-warning-700" />
                  <span className="text-warning-900">{t('revealedWrong')}</span>
                </>
              )
            ) : (
              <span className="text-ink-700">{t('revealed')}</span>
            )}
          </div>
        )}
      </div>
      {committed ? (
        <div className="animate-fade-in">{children}</div>
      ) : null}
    </>
  );
}
