import type { ComponentType, ReactNode } from 'react';

/** Mapa de componentes disponibles en MDX (equivalente liviano a mdx/types). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MDXComponents = Record<string, ComponentType<any>>;
import { Callout } from '@/components/Callout';
import { CodeBlock } from '@/components/CodeBlock';
import { Quiz } from '@/components/Quiz';
import { CommitReveal } from '@/components/CommitReveal';
import { Flashcard, Flashcards } from '@/components/Flashcard';
import { DataTable } from '@/components/DataTable';
import { ProcessSteps } from '@/components/ProcessSteps';
import { RCell } from '@/components/RCell';
import { LabExercise } from '@/components/LabExercise';
import {
  MontyHallGame,
  LindaVenn,
  SmallNumbersLab,
  DiagnosticTestExplorer,
  CalibrationGame,
  QualityControlSim,
  SimpsonExplorer,
  SpuriousCorrelationExplorer,
  RandomWalkChallenge,
  AvailabilityLab,
  OutlierDragLab,
  RankVsTExplorer,
  BayesianUpdater,
  LindleyExplorer,
  AlgorithmicBiasLab,
  NoisyJudgeSim,
} from '@/components/ReasoningSims';
import { SimReset } from '@/components/SimReset';
import { FormulaPalette } from '@/components/FormulaPalette';
import { Term } from '@/components/Term';
import { MRef } from '@/components/MRef';
import { Anexo } from '@/components/Anexo';
import { BlackboardAnchor, BlackboardEmbed } from '@cursos/blackboard';

/**
 * Mapeo de componentes disponibles dentro de los MDX de los módulos +
 * estilos de tablas Markdown (mismo patrón que el curso MLM).
 */

function MdxTable({ children }: { children?: ReactNode }) {
  return (
    <div className="my-6 w-full overflow-x-auto rounded border border-ink-200">
      <table className="min-w-full divide-y divide-ink-200 text-sm">{children}</table>
    </div>
  );
}

function MdxThead({ children }: { children?: ReactNode }) {
  return <thead className="bg-brand-50">{children}</thead>;
}

function MdxTh({ children }: { children?: ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-brand-800">
      {children}
    </th>
  );
}

function MdxTd({ children }: { children?: ReactNode }) {
  return <td className="border-t border-ink-100 px-4 py-2.5 align-top text-ink-700">{children}</td>;
}

function MdxPre({ children }: { children?: ReactNode }) {
  return (
    <pre className="my-4 overflow-x-auto rounded-lg bg-code px-4 py-3 text-sm leading-relaxed text-code-fg [&_code]:rounded-none [&_code]:bg-transparent [&_code]:px-0 [&_code]:py-0 [&_code]:text-inherit">
      {children}
    </pre>
  );
}

function MdxInlineCode({ children }: { children?: ReactNode }) {
  return (
    <code className="rounded bg-code px-1.5 py-0.5 text-[0.85em] font-mono text-code-fg">
      {children}
    </code>
  );
}

/** Envuelve un interactivo con el botón "Reiniciar" (remonta el estado). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withReset = (C: ComponentType<any>) =>
  function Resettable(props: Record<string, unknown>) {
    return (
      <SimReset>
        <C {...props} />
      </SimReset>
    );
  };

/**
 * Marca un componente como no-legible por la lectura en voz alta
 * (interactivos, código, paletas): ReadAloud excluye cualquier bloque
 * bajo [data-lectura-ui]. El wrapper es neutro: sin estilos ni flujo.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noLeer = (C: ComponentType<any>) =>
  function NoLeer(props: Record<string, unknown>) {
    return (
      <div data-lectura-ui>
        <C {...props} />
      </div>
    );
  };

export const mdxComponents: MDXComponents = {
  Callout,
  CodeBlock: noLeer(CodeBlock),
  Quiz: noLeer(Quiz),
  CommitReveal,
  Flashcard: noLeer(Flashcard),
  Flashcards: noLeer(Flashcards),
  DataTable: noLeer(DataTable),
  ProcessSteps,
  RCell: noLeer(RCell),
  LabExercise: noLeer(LabExercise),
  MontyHallGame: noLeer(withReset(MontyHallGame)),
  LindaVenn: noLeer(withReset(LindaVenn)),
  SmallNumbersLab: noLeer(withReset(SmallNumbersLab)),
  DiagnosticTestExplorer: noLeer(withReset(DiagnosticTestExplorer)),
  CalibrationGame: noLeer(withReset(CalibrationGame)),
  QualityControlSim: noLeer(withReset(QualityControlSim)),
  SimpsonExplorer: noLeer(withReset(SimpsonExplorer)),
  SpuriousCorrelationExplorer: noLeer(withReset(SpuriousCorrelationExplorer)),
  RandomWalkChallenge: noLeer(withReset(RandomWalkChallenge)),
  AvailabilityLab: noLeer(withReset(AvailabilityLab)),
  OutlierDragLab: noLeer(withReset(OutlierDragLab)),
  RankVsTExplorer: noLeer(withReset(RankVsTExplorer)),
  BayesianUpdater: noLeer(withReset(BayesianUpdater)),
  LindleyExplorer: noLeer(withReset(LindleyExplorer)),
  AlgorithmicBiasLab: noLeer(withReset(AlgorithmicBiasLab)),
  NoisyJudgeSim: noLeer(withReset(NoisyJudgeSim)),
  FormulaPalette: noLeer(FormulaPalette),
  Term,
  MRef,
  Anexo,
  BlackboardAnchor,
  BlackboardEmbed: noLeer(BlackboardEmbed),
  table: MdxTable,
  thead: MdxThead,
  th: MdxTh,
  td: MdxTd,
  pre: MdxPre,
  code: MdxInlineCode,
};
