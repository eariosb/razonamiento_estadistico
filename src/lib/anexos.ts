import { z } from 'zod';

/**
 * Manifiesto de anexos del curso. Cada entrada apunta a un archivo servido
 * desde /anexos (public/anexos). Regla dura del plan de implementación:
 * NINGÚN material de terceros se publica sin `permiso` — por eso el campo
 * es obligatorio para TODAS las entradas y `tercero` exige `licencia`.
 */

export const ANEXO_TIPOS = ['pdf', 'script', 'documento', 'figura', 'datos'] as const;
export const ANEXO_PERMISOS = ['autor-curso', 'material-docente', 'tercero'] as const;

const anexoSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    titulo: z.string().min(1),
    descripcion: z.string().min(1),
    tipo: z.enum(ANEXO_TIPOS),
    /** Ruta pública bajo /anexos/ (ej. "ensayo-test-exacto-fisher.pdf"). */
    archivo: z.string().min(1),
    modulo: z.string().optional(),
    autores: z.string().optional(),
    anio: z.number().int().optional(),
    permiso: z.enum(ANEXO_PERMISOS),
    /** Obligatoria cuando permiso === 'tercero'. */
    licencia: z.string().optional(),
  })
  .refine((a) => a.permiso !== 'tercero' || !!a.licencia, {
    message: 'los anexos de terceros requieren el campo licencia',
  });

export type Anexo = z.infer<typeof anexoSchema>;

const RAW_ANEXOS: unknown[] = [
  // Manifiesto inicialmente vacío: los scripts, figuras y documentos del
  // curso se irán publicando aquí a medida que se creen (siempre con
  // `permiso` declarado y `licencia` cuando sean de terceros).
];

export const ANEXOS: Anexo[] = RAW_ANEXOS.map((a) => anexoSchema.parse(a));

export function getAnexo(id: string): Anexo | undefined {
  return ANEXOS.find((a) => a.id === id);
}
