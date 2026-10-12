import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ANEXOS } from './anexos';

const PUBLIC_ANEXOS = join(process.cwd(), 'public', 'anexos');

describe('manifiesto de anexos', () => {
  it('tiene ids únicos y permiso declarado en todas las entradas', () => {
    const ids = ANEXOS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const a of ANEXOS) {
      expect(a.permiso.length, `${a.id} sin permiso`).toBeGreaterThan(0);
      if (a.permiso === 'tercero') expect(a.licencia, `${a.id} sin licencia`).toBeTruthy();
    }
  });

  it('cada anexo apunta a un archivo que existe en public/anexos', () => {
    const missing = ANEXOS.filter((a) => !existsSync(join(PUBLIC_ANEXOS, a.archivo))).map(
      (a) => `${a.id} -> ${a.archivo}`,
    );
    expect(missing).toEqual([]);
  });
});
