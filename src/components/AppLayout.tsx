import type { ReactNode } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';
import { getAllModules, COURSE_BLOCKS } from '@/lib/modules';
import { Navigation } from './Navigation';
import { MainColumn } from './MainColumn';
import { DynamicCourseBlackboard } from './DynamicCourseBlackboard';
import { RoleAwareBlackboardTrigger } from './RoleAwareBlackboardTrigger';
import { CaptureTrigger } from './CaptureTrigger';
import { CaptureManager } from './CaptureManager';
import { BlackboardBridge } from './BlackboardBridge';

/**
 * Shell de nivel superior para las páginas de módulo: navegación lateral +
 * columna de contenido acoplable + pizarra digital (misma arquitectura que
 * el curso MLM: la pizarra empuja el contenido cuando está abierta).
 */
export async function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale();
  const modules = getAllModules(locale);
  const tBlocks = await getTranslations('blocks');
  const blocks = COURSE_BLOCKS.map((b) => ({ ...b, title: tBlocks(b.id) }));
  const moduleNav = modules.map((m) => ({
    slug: m.meta.slug,
    title: m.meta.title,
    order: m.meta.order,
  }));
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Navigation modules={modules} blocks={blocks} />
      <MainColumn>{children}</MainColumn>
      <DynamicCourseBlackboard modules={moduleNav} blocks={blocks} />
      <RoleAwareBlackboardTrigger />
      <CaptureTrigger />
      <CaptureManager />
      <BlackboardBridge />
    </div>
  );
}
