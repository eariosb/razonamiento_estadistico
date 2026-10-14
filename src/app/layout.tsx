import { Inter, Fraunces, IBM_Plex_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

/*
 * Layout raíz estable: Next debe emitir el CSS global desde `app/layout`
 * y no desde el segmento dinámico `[locale]`. Esto evita URLs de assets
 * dependientes del locale y mantiene una única hoja base para /es y /en.
 */
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  style: ['normal', 'italic'],
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${fraunces.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        {/*
         * Tema antes del primer paint (diseno.md §2.4): lee el ajuste
         * persistido por el blackboard (localStorage['bb-settings']) y
         * aplica .dark al <html> sin esperar a React. 'auto' sigue al
         * sistema operativo; luego ThemeSync toma el control.
         */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`try {
            var raw = localStorage.getItem('bb-settings');
            var theme = raw ? JSON.parse(raw).theme : 'auto';
            var dark = theme === 'dark' || (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            if (dark) document.documentElement.classList.add('dark');
          } catch (e) {}`}
        </Script>
        {/*
         * Defensa contra service workers foráneos en localhost: otros
         * proyectos servidos antes en este puerto pueden dejar un SW
         * registrado que intercepta /_next/* y sirve assets obsoletos
         * (página sin CSS). Desregistrar cualquier SW de este origen.
         */}
        <Script id="sw-cleanup" strategy="beforeInteractive">
          {`if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function (regs) {
              regs.forEach(function (r) { r.unregister(); });
            });
          }`}
        </Script>
        {children}
      </body>
    </html>
  );
}
