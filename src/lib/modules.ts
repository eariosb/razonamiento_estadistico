import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

/**
 * Punto de entrada único para resolver el contenido del curso desde
 * `src/content/modules/*.mdx` (mismo patrón DIP que el curso MLM:
 * las páginas dependen de este módulo, no del filesystem).
 *
 * Bilingüe (docs/bilingue.md): el español es la fuente y vive en
 * `src/content/modules`; las transcreaciones viven en
 * `src/content/<locale>/modules` con el MISMO nombre de archivo y el
 * MISMO slug (decisión registrada en docs/produccion.md). Si la pieza
 * no existe en el locale pedido, se cae al español: nada se sirve roto,
 * y el checker de paridad reporta las piezas faltantes.
 *
 * El frontmatter se valida con Zod: un módulo con metadatos incompletos
 * rompe el build, no la experiencia del estudiante.
 */

const MODULES_DIR = join(process.cwd(), 'src', 'content', 'modules');

/** Directorios alternativos por locale (es = fuente, en `MODULES_DIR`). */
const LOCALE_DIRS: Record<string, string> = {
  en: join(process.cwd(), 'src', 'content', 'en', 'modules'),
};

function localizedFilePath(fileName: string, locale?: string): string {
  if (locale && LOCALE_DIRS[locale]) {
    const candidate = join(LOCALE_DIRS[locale], fileName);
    if (existsSync(candidate)) return candidate;
  }
  return join(MODULES_DIR, fileName);
}

export const moduleMetaSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  objective: z.string().min(1),
  order: z.number().int().min(0).max(19),
  datasets: z.array(z.string()).default([]),
  duration: z.number().int().positive().optional(),
  prerequisites: z.array(z.string()).default([]),
});

export type ModuleMeta = z.infer<typeof moduleMetaSchema>;

export interface ModuleEntry {
  meta: ModuleMeta;
  fileName: string;
}

/** Bloques temáticos del curso (agrupan los módulos en el sidebar). */
export const COURSE_BLOCKS = [
  { id: 'I', title: 'La intuición y sus trampas', from: 1, to: 2 },
  { id: 'II', title: 'La corrección formal', from: 3, to: 6 },
  { id: 'III', title: 'Bayes y la era algorítmica', from: 7, to: 8 },
] as const;

export function blockForOrder(order: number) {
  return COURSE_BLOCKS.find((b) => order >= b.from && order <= b.to) ?? COURSE_BLOCKS[0];
}

const cachedEntries = new Map<string, ModuleEntry[]>();

function readModuleFile(fileName: string, locale?: string): ModuleEntry {
  const filePath = localizedFilePath(fileName, locale);
  const raw = readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);
  const parsed = moduleMetaSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Frontmatter inválido en ${filePath}: ${parsed.error.issues
        .map((i) => `${i.path.join('.')}: ${i.message}`)
        .join('; ')}`
    );
  }
  return { meta: parsed.data, fileName };
}

/**
 * Todos los módulos, ordenados por `order`. Con `locale` distinto de
 * 'es', cada pieza usa su transcreación si existe (mismo fileName);
 * el slugs debe coincidir en ambos frontmatter para que las rutas
 * `/es|cursos|en/...` permanezcan estables.
 */
export function getAllModules(locale?: string): ModuleEntry[] {
  const key = locale ?? 'es';
  if (cachedEntries.get(key) && process.env.NODE_ENV === 'production') {
    return cachedEntries.get(key)!;
  }
  const files = readdirSync(MODULES_DIR).filter((f) => f.endsWith('.mdx'));
  const entries = files.map((f) => readModuleFile(f, locale));
  entries.sort((a, b) => a.meta.order - b.meta.order);
  cachedEntries.set(key, entries);
  return entries;
}

/** Busca un módulo por su `slug` (estable entre locales). */
export function findModule(slug: string, locale?: string): ModuleEntry | undefined {
  return getAllModules(locale).find((entry) => entry.meta.slug === slug);
}

/** Fuente MDX cruda (sin frontmatter) de un módulo, en su locale si existe. */
export function getModuleSource(fileName: string, locale?: string): string {
  const raw = readFileSync(localizedFilePath(fileName, locale), 'utf-8');
  const { content } = matter(raw);
  return content;
}

export interface AdjacentModules {
  prev?: ModuleEntry;
  next?: ModuleEntry;
}

/** Módulos anterior/siguiente relativo a un slug, por `order`. */
export function getAdjacentModules(slug: string, locale?: string): AdjacentModules {
  const modules = getAllModules(locale);
  const idx = modules.findIndex((entry) => entry.meta.slug === slug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? modules[idx - 1] : undefined,
    next: idx < modules.length - 1 ? modules[idx + 1] : undefined,
  };
}
