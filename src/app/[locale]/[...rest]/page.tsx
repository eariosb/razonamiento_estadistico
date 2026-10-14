import { notFound } from 'next/navigation';

// Catch-all: cualquier ruta no existente bajo /es|en termina en el 404 localizado.
export default function CatchAllPage() {
  notFound();
}
