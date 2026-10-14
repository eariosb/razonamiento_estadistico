'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Play, Pause, Square, SkipBack, SkipForward, Volume2,
} from 'lucide-react';
import clsx from 'clsx';
import {
  LECTURA_ACTUAL,
  recolectarBloques,
  textoDe,
  trozos,
  vocesDelIdioma,
  nombreCortoVoz,
  leerPref,
  guardarPref,
} from '@/lib/lectura';

type Modo = 'parado' | 'leyendo' | 'pausado';

/**
 * Lectura en voz alta del contenido del módulo (Web Speech API, sin
 * servidor). Dos modos: documento completo —párrafo a párrafo, con
 * resaltado ocre, clic para saltar, velocidad y voz persistentes— y
 * selección —botón flotante sobre el texto marcado por el usuario—.
 * Si el navegador no tiene síntesis de voz, no se renderiza nada.
 *
 * Port del sistema de Historia_Estadistica; la pausa se implementa como
 * cancelar + recordar posición (speechSynthesis.pause() falla en
 * Android/Chrome), con vigía que detecta voces que no suenan.
 */
export function ReadAloud({ targetId }: { targetId: string }) {
  const t = useTranslations('lectura');
  const en = useLocale() === 'en';

  const [listo, setListo] = useState(false);
  const [modo, setModo] = useState<Modo>('parado');
  const [estado, setEstado] = useState('');
  const [aviso, setAviso] = useState('');
  const [progreso, setProgreso] = useState(0);
  const [voces, setVoces] = useState<SpeechSynthesisVoice[]>([]);
  const [vel, setVel] = useState('1');
  const [vozUri, setVozUri] = useState('');
  const [selBtn, setSelBtn] = useState<{ x: number; y: number } | null>(null);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  const bloquesRef = useRef<HTMLElement[]>([]);
  const palabrasRef = useRef(0);
  const iBloque = useRef(0);
  const iTrozo = useRef(0);
  const partes = useRef<string[]>([]);
  const turno = useRef(0);
  const vigia = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallidas = useRef<Record<string, boolean>>({});
  const fallosSeguidos = useRef(0);
  const modoRef = useRef<Modo>('parado');
  // Lectura de selección: partes y cursor propios, sin resaltado DOM.
  const selPartes = useRef<string[] | null>(null);
  const iSel = useRef(0);
  const velRef = useRef('1');
  const vozUriRef = useRef('');

  modoRef.current = modo;
  velRef.current = vel;
  vozUriRef.current = vozUri;

  const synth = () => synthRef.current;

  // ---------- montaje: soporte, bloques y voces ----------
  useEffect(() => {
    const s = window.speechSynthesis;
    const root = document.getElementById(targetId);
    if (!s || !window.SpeechSynthesisUtterance || !root) return;
    const bloques = recolectarBloques(root, en);
    if (bloques.length < 3) return;

    synthRef.current = s;
    rootRef.current = root;
    bloquesRef.current = bloques;
    palabrasRef.current = bloques.reduce(
      (n, b) => n + textoDe(b, en).split(/\s+/).length, 0,
    );
    setVel(leerPref('vel', '1'));
    setListo(true);
    setEstado(`≈ ${Math.max(1, Math.round(palabrasRef.current / 150))} min`);

    const cargar = () => setVoces(vocesDelIdioma(s.getVoices(), en));
    cargar();
    s.addEventListener?.('voiceschanged', cargar);
    return () => {
      s.removeEventListener?.('voiceschanged', cargar);
      s.cancel();
      bloques.forEach((b) => b.classList.remove(LECTURA_ACTUAL, 'lectura-bloque'));
      document.body.classList.remove('lectura-activa');
    };
  }, [targetId, en]);

  // Preferencia de voz cuando llegan las voces o cambia el idioma.
  useEffect(() => {
    const elegida = leerPref(`voz-${en ? 'en' : 'es'}`, '');
    setVozUri(voces.some((v) => v.voiceURI === elegida) ? elegida : '');
  }, [voces, en]);

  const vozActual = useCallback(() => {
    const uri = vozUriRef.current;
    return voces.find((v) => v.voiceURI === uri) ?? voces[0] ?? null;
  }, [voces]);

  const vozUtil = useCallback(() => {
    const v = vozActual();
    if (v && !fallidas.current[v.voiceURI]) return v;
    const libres = voces.filter((x) => !fallidas.current[x.voiceURI]);
    return libres.find((x) => x.localService) ?? libres[0] ?? null;
  }, [voces, vozActual]);

  // ---------- resaltado y estado ----------
  const marcar = useCallback((i: number | null) => {
    const bloques = bloquesRef.current;
    bloques.forEach((b) => b.classList.remove(LECTURA_ACTUAL));
    if (i == null) return;
    const el = bloques[i];
    el.classList.add(LECTURA_ACTUAL);
    const r = el.getBoundingClientRect();
    if (r.top < 80 || r.bottom > window.innerHeight - 40) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setEstado(`${i + 1} / ${bloques.length}`);
    setProgreso((100 * (i + 1)) / bloques.length);
  }, []);

  const pintar = useCallback((m: Modo) => {
    modoRef.current = m;
    setModo(m);
    document.body.classList.toggle('lectura-activa', m !== 'parado');
    if (m === 'parado') {
      setEstado(`≈ ${Math.max(1, Math.round(palabrasRef.current / 150 / (parseFloat(velRef.current) || 1)))} min`);
      setProgreso(0);
    }
  }, []);

  const detener = useCallback(() => {
    if (vigia.current) clearTimeout(vigia.current);
    turno.current++;
    pintar('parado');
    synth()?.cancel();
    iBloque.current = 0;
    iTrozo.current = 0;
    partes.current = [];
    selPartes.current = null;
    marcar(null);
    setAviso('');
  }, [pintar, marcar]);

  const pausar = useCallback(() => {
    if (vigia.current) clearTimeout(vigia.current);
    turno.current++;
    pintar('pausado');
    synth()?.cancel();
  }, [pintar]);

  const vozFallo = useCallback(
    (v: SpeechSynthesisVoice | null, _motivo: string): boolean => {
      fallosSeguidos.current++;
      if (v) fallidas.current[v.voiceURI] = true;
      const otra = vozUtil();
      if (otra && fallosSeguidos.current <= 4) {
        setAviso(t('vozFallo', { voz: v?.name ?? '', otra: otra.name }));
        return true;
      }
      setAviso(t('sinAudio'));
      pausar();
      return false;
    },
    [vozUtil, t, pausar],
  );

  const decir = useCallback(() => {
    const s = synth();
    if (!s) return;
    const mio = ++turno.current;
    if (vigia.current) clearTimeout(vigia.current);

    const sel = selPartes.current;
    let texto: string;
    if (sel) {
      if (iSel.current >= sel.length) {
        detener();
        setEstado(t('fin'));
        return;
      }
      texto = sel[iSel.current];
      setEstado(`${t('seleccionCorta')} · ${iSel.current + 1} / ${sel.length}`);
      setProgreso((100 * (iSel.current + 1)) / sel.length);
    } else {
      const bloques = bloquesRef.current;
      if (iBloque.current >= bloques.length) {
        detener();
        setEstado(t('fin'));
        return;
      }
      if (iTrozo.current === 0 || !partes.current.length) {
        partes.current = trozos(textoDe(bloques[iBloque.current], en));
        marcar(iBloque.current);
      }
      if (iTrozo.current >= partes.current.length) {
        iBloque.current++;
        iTrozo.current = 0;
        partes.current = [];
        decir();
        return;
      }
      texto = partes.current[iTrozo.current];
    }

    const u = new SpeechSynthesisUtterance(texto);
    const v = vozUtil();
    if (v) { u.voice = v; u.lang = v.lang; } else u.lang = en ? 'en-US' : 'es-ES';
    u.rate = parseFloat(velRef.current) || 1;
    let inicio = 0;
    u.onstart = () => { inicio = performance.now(); };
    u.onend = () => {
      if (mio !== turno.current || modoRef.current !== 'leyendo') return;
      if (vigia.current) clearTimeout(vigia.current);
      // Terminar sin haber empezado o "leer" 60 caracteres en un instante es silencio.
      const dur = inicio ? performance.now() - inicio : 0;
      if (texto.length > 20 && dur < (10 * texto.length) / u.rate) {
        if (vozFallo(v, `${Math.round(dur)}ms`)) {
          turno.current++;
          setTimeout(decir, 60);
        }
        return;
      }
      fallosSeguidos.current = 0;
      if (sel) iSel.current++; else iTrozo.current++;
      decir();
    };
    u.onerror = (e) => {
      if (mio !== turno.current || modoRef.current !== 'leyendo') return;
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      if (vigia.current) clearTimeout(vigia.current);
      if (vozFallo(v, `error ${e.error}`)) {
        turno.current++;
        s.cancel();
        setTimeout(decir, 60);
      }
    };
    if (s.paused) s.resume();
    s.speak(u);
    // Vigía: si en 5 s no arrancó, la voz está colgada.
    vigia.current = setTimeout(() => {
      if (mio !== turno.current || modoRef.current !== 'leyendo' || inicio) return;
      turno.current++;
      s.cancel();
      if (vozFallo(v, 'sin arrancar')) setTimeout(decir, 60);
    }, 5000);
  }, [en, t, detener, marcar, vozUtil, vozFallo]);

  const leerDesde = useCallback(
    (i: number) => {
      turno.current++;
      synth()?.cancel();
      selPartes.current = null;
      iBloque.current = Math.max(0, Math.min(i, bloquesRef.current.length - 1));
      iTrozo.current = 0;
      partes.current = [];
      pintar('leyendo');
      setTimeout(decir, 60); // Chrome ignora speak() justo tras cancel()
    },
    [decir, pintar],
  );

  const leerSeleccion = useCallback(
    (texto: string) => {
      turno.current++;
      synth()?.cancel();
      marcar(null);
      selPartes.current = trozos(texto);
      iSel.current = 0;
      pintar('leyendo');
      setTimeout(decir, 60);
    },
    [decir, pintar, marcar],
  );

  const togglePlay = () => {
    if (modo === 'leyendo') pausar();
    else if (modo === 'pausado') {
      pintar('leyendo');
      decir(); // reanuda el trozo guardado
    } else leerDesde(0);
  };

  // ---------- clic en párrafo para saltar ----------
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onClick = (e: MouseEvent) => {
      if (modoRef.current === 'parado' || selPartes.current) return;
      const el = (e.target as HTMLElement).closest('.lectura-bloque');
      if (!el) return;
      const i = bloquesRef.current.indexOf(el as HTMLElement);
      if (i >= 0) leerDesde(i);
    };
    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
  }, [listo, leerDesde]);

  // ---------- botón flotante de selección ----------
  useEffect(() => {
    if (!listo) return;
    const root = rootRef.current;
    const revisar = () => {
      const sel = window.getSelection();
      if (
        !root || !sel || sel.isCollapsed ||
        !sel.toString().trim() ||
        !root.contains(sel.anchorNode) ||
        !root.contains(sel.focusNode) ||
        modoRef.current === 'leyendo'
      ) {
        setSelBtn(null);
        return;
      }
      const r = sel.getRangeAt(0).getBoundingClientRect();
      setSelBtn({ x: Math.min(r.right, window.innerWidth - 120), y: r.bottom + 8 });
    };
    const ocultar = () => setSelBtn(null);
    document.addEventListener('mouseup', revisar);
    document.addEventListener('keyup', revisar);
    document.addEventListener('selectionchange', ocultar);
    window.addEventListener('scroll', ocultar, true);
    return () => {
      document.removeEventListener('mouseup', revisar);
      document.removeEventListener('keyup', revisar);
      document.removeEventListener('selectionchange', ocultar);
      window.removeEventListener('scroll', ocultar, true);
    };
  }, [listo]);

  const tomarSeleccion = () => {
    const sel = window.getSelection();
    const texto = sel?.toString().replace(/\s+/g, ' ').trim() ?? '';
    sel?.removeAllRanges();
    setSelBtn(null);
    if (texto) leerSeleccion(texto);
  };

  // ---------- persistencia ----------
  const cambiarVel = (v: string) => {
    setVel(v);
    guardarPref('vel', v);
    if (modoRef.current === 'parado') {
      setEstado(`≈ ${Math.max(1, Math.round(palabrasRef.current / 150 / (parseFloat(v) || 1)))} min`);
    }
  };
  const cambiarVoz = (uri: string) => {
    setVozUri(uri);
    guardarPref(`voz-${en ? 'en' : 'es'}`, uri);
  };

  if (!listo) return null;
  const activo = modo !== 'parado';

  const btnBase =
    'inline-flex h-8 w-8 items-center justify-center rounded border border-pizarra-25 text-pizarra-100 transition-colors duration-150 ease-out-expo hover:bg-surface-hover hover:text-tinta-100 disabled:cursor-default disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-100';

  return (
    <>
      <div
        role="region"
        aria-label={t('barra')}
        className="lectura-ui mb-8 flex flex-col gap-2 rounded border border-pizarra-25 bg-surface px-3 py-2.5"
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-pizarra-100">
            {t('rotulo')}
          </span>
          <span
            aria-live="polite"
            className="font-mono text-[11px] tabular-nums text-pizarra-100"
            title={activo ? t('parrafo', { actual: estado.split(' ')[0], total: bloquesRef.current.length }) : undefined}
          >
            {estado}
          </span>
        </div>
        <div className="h-0.5 bg-pizarra-15" aria-hidden="true">
          <span
            className="block h-full bg-ocre-100 transition-[width] duration-300"
            style={{ width: `${progreso}%` }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePlay}
            aria-pressed={modo === 'leyendo'}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded bg-ocre-100 px-3 text-sm font-medium text-on-accent transition-colors duration-150 ease-out-expo hover:bg-ocre-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-100"
          >
            {modo === 'leyendo' ? (
              <><Pause className="h-3.5 w-3.5" aria-hidden />{t('pausa')}</>
            ) : modo === 'pausado' ? (
              <><Play className="h-3.5 w-3.5" aria-hidden />{t('seguir')}</>
            ) : (
              <><Play className="h-3.5 w-3.5" aria-hidden />{t('escuchar')}</>
            )}
          </button>
          <button
            type="button"
            onClick={() => leerDesde(iBloque.current - 1)}
            disabled={!activo || !!selPartes.current}
            aria-label={t('anterior')}
            title={t('anterior')}
            className={btnBase}
          >
            <SkipBack className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => leerDesde(iBloque.current + 1)}
            disabled={!activo || !!selPartes.current}
            aria-label={t('siguiente')}
            title={t('siguiente')}
            className={btnBase}
          >
            <SkipForward className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={detener}
            disabled={!activo}
            aria-label={t('detener')}
            title={t('detener')}
            className={btnBase}
          >
            <Square className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <select
            value={vel}
            onChange={(e) => cambiarVel(e.target.value)}
            aria-label={t('velocidad')}
            title={t('velocidad')}
            className="h-8 w-16 rounded border border-pizarra-25 bg-surface px-1.5 font-mono text-xs text-tinta-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-100"
          >
            {['0.8', '0.9', '1', '1.1', '1.25', '1.5', '1.75'].map((v) => (
              <option key={v} value={v}>{v.replace('.', en ? '.' : ',')}×</option>
            ))}
          </select>
          {voces.length > 1 && (
            <select
              value={vozUri}
              onChange={(e) => cambiarVoz(e.target.value)}
              aria-label={t('voz')}
              title={t('voz')}
              className="h-8 min-w-0 flex-1 rounded border border-pizarra-25 bg-surface px-1.5 text-xs text-tinta-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-100"
            >
              <option value="">{voces[0] ? nombreCortoVoz(voces[0]) : t('automatica')}</option>
              {voces.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {nombreCortoVoz(v)} · {v.lang}
                </option>
              ))}
            </select>
          )}
        </div>
        {aviso && <p className="text-xs text-pizarra-100">{aviso}</p>}
        {!aviso && modo === 'parado' && (
          <p className="text-xs text-pizarra-100">{t('pista')}</p>
        )}
      </div>

      {selBtn && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault() /* conserva la selección */}
          onClick={tomarSeleccion}
          style={{ position: 'fixed', left: selBtn.x, top: selBtn.y, transform: 'translateX(-100%)' }}
          className={clsx(
            'z-50 inline-flex items-center gap-1.5 rounded border border-ocre-50 bg-tinta-100 px-2.5 py-1.5 text-xs font-medium text-lienzo-100 shadow-lg',
            'transition-opacity duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-100',
          )}
        >
          <Volume2 className="h-3.5 w-3.5" aria-hidden />
          {t('seleccion')}
        </button>
      )}
    </>
  );
}
