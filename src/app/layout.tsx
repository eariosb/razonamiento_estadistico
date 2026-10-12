import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/Footer';
import { WebRProvider } from '@/components/WebRProvider';
import { BlackboardProvider } from '@cursos/blackboard';
import { ThemeSync } from '@/components/ThemeSync';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const lora = Lora({ subsets: ['latin'], variable: '--font-display', style: ['normal', 'italic'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Razonamiento Estadístico | Curso Interactivo',
  description:
    'Curso interactivo de razonamiento estadístico con R en el navegador: heurísticas y sesgos, la falacia de tasa base, regresión a la media, paradoja de Simpson, estadística robusta, el paradigma bayesiano y la decisión algorítmica. La estadística como tecnología cognitiva contra la intuición defectuosa, en la tradición de Kahneman y Tversky. Universidad Nacional de Colombia, sede Medellín.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${lora.variable}`}>
      <body className="font-sans antialiased">
        <WebRProvider>
          <BlackboardProvider>
            <ThemeSync />
            {children}
          </BlackboardProvider>
        </WebRProvider>
        <Footer />
      </body>
    </html>
  );
}
