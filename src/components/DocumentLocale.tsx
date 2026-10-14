'use client';

import { useEffect } from 'react';

/** Sincroniza el atributo lang del documento con el segmento activo. */
export function DocumentLocale({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
