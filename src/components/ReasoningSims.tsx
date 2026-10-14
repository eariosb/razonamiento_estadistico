'use client';

import { Fragment, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { tokens } from '@/lib/tokens';
import { OCRE, TINTA, PIZARRA, ARENA, LIENZO, VIZ, MOTION } from '@/lib/design-tokens';
import { SimGuide, SimLegend } from '@/components/SimBits';

/* Estilos de los interactivos según diseno.md §5: tarjetas con borde
 * pizarra-15 y fondo lienzo sin sombras (§5.1); botón primario tinta,
 * botón de revelación ocre con texto tinta (§5.2). */
const BTN_MAIN =
  'rounded bg-tinta-100 px-3 py-1 text-xs font-medium text-lienzo-100 hover:bg-tinta-75';
const BTN_REVEAL =
  'rounded bg-ocre-100 px-3 py-1 text-xs font-medium text-tinta-100 hover:bg-ocre-75';
const BTN_GHOST =
  'rounded border border-pizarra-30 px-3 py-1 text-xs text-tinta-100 hover:bg-pizarra-10';
/* Selectores de opción (no acciones): chip de radio/píldora que se
 * distingue del botón por la forma y el punto de estado. §5.2. */
const CHIP =
  'inline-flex items-center gap-1.5 rounded-full border border-pizarra-30 px-3 py-1 text-xs text-tinta-100 transition-colors hover:border-ocre-75';
const CHIP_ON =
  'inline-flex items-center gap-1.5 rounded-full border border-ocre-100 bg-ocre-10 px-3 py-1 text-xs font-medium text-tinta-100';
const CHIP_DOT =
  'inline-block h-1.5 w-1.5 rounded-full border border-current';
const FIG = 'my-6 rounded-lg border border-pizarra-15 bg-lienzo-100 p-4';
const CAPTION = 'mb-2 text-sm font-semibold text-tinta-100';
const NOTE = 'mt-2 border-t border-pizarra-15 pt-2 text-xs text-pizarra-100';
const SLIDER = 'w-full accent-ocre-100';
/* Campo numérico: superficie lienzo + texto tinta para que el tema
 * oscuro lo resuelva; sin ellos el navegador pinta fondo claro con
 * el texto claro heredado (contraste ilegible). */
const INPUT =
  'rounded border border-pizarra-30 bg-lienzo-100 px-1.5 py-0.5 text-center text-tinta-100 focus:border-ocre-75 focus:outline-none disabled:opacity-60';

const ACCENT = OCRE;
const DANGER = tokens.status.danger;
const GOLD = ARENA;
const GRAY = PIZARRA;
const GOOD = tokens.status.ok;

const fmt = (x: number, d = 2) => (Number.isFinite(x) ? x.toFixed(d) : '—');
const rnd = (v: number) => Math.round(v * 100) / 100;

/** RNG determinista (mulberry32): las simulaciones masivas son
 *  reproducibles entre SSR y cliente, y entre ejecuciones del test. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ================================================================== */
/* 1. MontyHallGame: la puerta que la intuición no quiere cambiar      */
/* ================================================================== */

type MHPhase = 'pick' | 'reveal' | 'done';

interface MHTally {
  stayN: number;
  stayWins: number;
  switchN: number;
  switchWins: number;
}

/**
 * Monty Hall en dos capas. Capa interactiva: el estudiante elige una
 * puerta, el presentador abre otra con una cabra, y decide si cambia.
 * Capa masiva: miles de rondas simuladas con semilla fija muestran que
 * cambiar gana ~2/3 y quedarse ~1/3.
 */
export function MontyHallGame({ title }: { title?: ReactNode }) {
  const [round, setRound] = useState(0);
  const [car, setCar] = useState(() => Math.floor(Math.random() * 3));
  const [picked, setPicked] = useState<number | null>(null);
  const [hostOpened, setHostOpened] = useState<number | null>(null);
  const [phase, setPhase] = useState<MHPhase>('pick');
  const [switched, setSwitched] = useState(false);
  const [tally, setTally] = useState<MHTally>({
    stayN: 0,
    stayWins: 0,
    switchN: 0,
    switchWins: 0,
  });
  const [simN, setSimN] = useState<number | null>(null);

  const pick = (i: number) => {
    if (phase !== 'pick') return;
    setPicked(i);
    // El presentador abre una puerta que no es la elegida y no tiene el premio.
    const options = [0, 1, 2].filter((d) => d !== i && d !== car);
    setHostOpened(options[Math.floor(Math.random() * options.length)]);
    setPhase('reveal');
  };

  const decide = (doSwitch: boolean) => {
    if (phase !== 'reveal' || picked === null || hostOpened === null) return;
    const final = doSwitch ? [0, 1, 2].find((d) => d !== picked && d !== hostOpened)! : picked;
    const won = final === car;
    setSwitched(doSwitch);
    setTally((t) => ({
      stayN: t.stayN + (doSwitch ? 0 : 1),
      stayWins: t.stayWins + (doSwitch || !won ? 0 : 1),
      switchN: t.switchN + (doSwitch ? 1 : 0),
      switchWins: t.switchWins + (doSwitch && won ? 1 : 0),
    }));
    setPhase('done');
  };

  const nextRound = () => {
    setRound((r) => r + 1);
    setCar(Math.floor(Math.random() * 3));
    setPicked(null);
    setHostOpened(null);
    setPhase('pick');
    setSwitched(false);
  };

  // Simulación masiva determinista: en cada ronda el premio y la elección
  // inicial son uniformes; quedarse gana 1/3, cambiar gana 2/3.
  const mass = useMemo(() => {
    if (!simN) return null;
    const rng = mulberry32(20240917 + simN);
    let stay = 0;
    let sw = 0;
    for (let i = 0; i < simN; i++) {
      const prize = Math.floor(rng() * 3);
      const first = Math.floor(rng() * 3);
      if (first === prize) stay += 1;
      else sw += 1;
    }
    return { stay, sw, n: simN };
  }, [simN]);

  const doorLabel = (i: number) => {
    if (phase === 'done') return i === car ? '🚗' : '🐐';
    if (i === hostOpened) return '🐐';
    return '?';
  };

  return (
    <div className={FIG}>
      <div className={CAPTION}>{title ?? 'Monty Hall: tres puertas, un coche, dos cabras'}</div>

      <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
        <div>
          <p className="mb-2 text-xs text-pizarra-100">
            {phase === 'pick' && 'Elige una puerta.'}
            {phase === 'reveal' &&
              `El presentador abrió la puerta ${(hostOpened ?? 0) + 1} y hay una cabra. ¿Te quedas o cambias?`}
            {phase === 'done' &&
              (switched ? 'Cambiaste.' : 'Te quedaste.') +
                (picked !== null && hostOpened !== null &&
                (switched
                  ? [0, 1, 2].find((d) => d !== picked && d !== hostOpened) === car
                  : picked === car)
                  ? ' Ganaste el coche.'
                  : ' Una cabra.')}
          </p>
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => {
              const isPicked = picked === i;
              const isOpen = hostOpened === i || phase === 'done';
              return (
                <button
                  key={`${round}-${i}`}
                  type="button"
                  onClick={() => pick(i)}
                  disabled={phase !== 'pick'}
                  className={`flex h-24 w-20 flex-col items-center justify-center rounded border-2 text-2xl transition-colors ${
                    isOpen
                      ? 'border-pizarra-30 bg-pizarra-10'
                      : isPicked
                        ? 'border-ocre-100 bg-ocre-10'
                        : 'border-pizarra-30 bg-lienzo-100 hover:border-ocre-75'
                  } ${phase === 'pick' ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <span aria-hidden>{doorLabel(i)}</span>
                  <span className="mt-1 text-[10px] font-medium text-pizarra-100">Puerta {i + 1}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {phase === 'reveal' && (
              <>
                <button type="button" className={BTN_MAIN} onClick={() => decide(false)}>
                  Quedarme
                </button>
                <button type="button" className={BTN_MAIN} onClick={() => decide(true)}>
                  Cambiar
                </button>
              </>
            )}
            {phase === 'done' && (
              <button type="button" className={BTN_MAIN} onClick={nextRound}>
                Otra ronda
              </button>
            )}
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold text-tinta-100">Tu historial</p>
          <WinBars
            stayRate={tally.stayN ? tally.stayWins / tally.stayN : NaN}
            switchRate={tally.switchN ? tally.switchWins / tally.switchN : NaN}
            stayN={tally.stayN}
            switchN={tally.switchN}
          />
          <p className="mb-1 mt-4 text-xs font-semibold text-tinta-100">Simulación masiva</p>
          <div className="mb-2 flex gap-2">
            {[100, 1000, 10000].map((n) => (
              <button key={n} type="button" className={BTN_GHOST} onClick={() => setSimN(n)}>
                {n.toLocaleString('es')} rondas
              </button>
            ))}
          </div>
          {mass && (
            <>
              <p className="font-mono text-[11px] text-pizarra-100" aria-live="polite">
                {mass.n.toLocaleString('es')} rondas simuladas
              </p>
              <WinBars
                stayRate={mass.stay / mass.n}
                switchRate={mass.sw / mass.n}
                stayN={mass.stay}
                switchN={mass.sw}
              />
            </>
          )}
        </div>
      </div>

      <SimLegend
        className="mt-3"
        items={[
          { color: GRAY, label: 'ganancia quedándose (teoría 1/3)', mark: 'bar' },
          { color: ACCENT, label: 'ganancia cambiando (teoría 2/3)', mark: 'bar' },
        ]}
      />
      <p className={NOTE}>
        La primera elección acierta una de tres. El presentador siempre abre una cabra, así que la
        probabilidad que tenía tu puerta no se mueve: el otro tercio que faltaba se concentra en la
        única puerta cerrada que queda. Cambiar no reparte la suerte, la hereda.
      </p>
      <SimGuide>
        Juega unas rondas con tu intuición y luego corre la simulación masiva: compara tu tasa de
        victorias con las líneas de 1/3 y 2/3. ¿Qué le costaría al azar mentirte diez mil veces?
      </SimGuide>
    </div>
  );
}

function WinBars({
  stayRate,
  switchRate,
  stayN,
  switchN,
}: {
  stayRate: number;
  switchRate: number;
  stayN: number;
  switchN: number;
}) {
  const W = 260;
  const LBL = 56;
  const bar = (rate: number) => (Number.isFinite(rate) ? rnd(rate * W) : 0);
  return (
    <svg viewBox={`0 0 ${LBL + W + 60} 62`} className="w-full max-w-sm" role="img" aria-label="Tasas de victoria por estrategia">
      {/* líneas teóricas */}
      <line x1={LBL + rnd(W / 3)} x2={LBL + rnd(W / 3)} y1={0} y2={52} stroke={DANGER} strokeDasharray="3 3" />
      <line x1={LBL + rnd((2 * W) / 3)} x2={LBL + rnd((2 * W) / 3)} y1={0} y2={52} stroke={DANGER} strokeDasharray="3 3" />
      <text x={LBL - 5} y={17} fontSize={9} textAnchor="end" fill={tokens.chart.text}>
        quedarse
      </text>
      <rect x={LBL} y={6} width={bar(stayRate)} height={16} fill={GRAY} rx={2} />
      <text x={LBL + W + 4} y={18} fontSize={10} fill={tokens.chart.text}>
        {Number.isFinite(stayRate) ? `${fmt(stayRate * 100, 0)}% (${stayN})` : `0 (${stayN})`}
      </text>
      <text x={LBL - 5} y={45} fontSize={9} textAnchor="end" fill={tokens.chart.text}>
        cambiar
      </text>
      <rect x={LBL} y={34} width={bar(switchRate)} height={16} fill={ACCENT} rx={2} />
      <text x={LBL + W + 4} y={46} fontSize={10} fill={tokens.chart.text}>
        {Number.isFinite(switchRate) ? `${fmt(switchRate * 100, 0)}% (${switchN})` : `0 (${switchN})`}
      </text>
      <text x={LBL} y={60} fontSize={9} fill={tokens.chart.text}>
        líneas punteadas: las tasas teóricas 1/3 y 2/3
      </text>
    </svg>
  );
}

/* ================================================================== */
/* 2. LindaVenn: la falacia de conjunción hecha geometría              */
/* ================================================================== */

const LINDA_OPTIONS = [
  'Linda es cajera de banco',
  'Linda es cajera de banco y es feminista',
  'Linda es feminista',
];

/**
 * El problema de Linda (Tversky y Kahneman, 1983). El estudiante elige la
 * afirmación más probable; el diagrama de Venn muestra después que la
 * conjunción vive dentro del conjunto y no puede superarlo.
 */
export function LindaVenn({ title }: { title?: ReactNode }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const fell = revealed && choice === 1; // eligió la conjunción como la más probable

  return (
    <div className={FIG}>
      <div className={CAPTION}>{title ?? 'El problema de Linda'}</div>

      <div className="rounded border border-pizarra-15 bg-pizarra-10 p-3 text-sm leading-relaxed text-tinta-100">
        Linda tiene 31 años, es soltera, extrovertida y muy brillante. Estudió filosofía y, de
        estudiante, le preocupaban la discriminación y la justicia social; participó en marchas
        contra la energía nuclear.
      </div>

      <p className="mt-3 text-xs font-semibold text-tinta-100">¿Cuál afirmación es más probable?</p>
      <div className="mt-1 space-y-1.5">
        {LINDA_OPTIONS.map((opt, i) => (
          <button
            key={opt}
            type="button"
            disabled={revealed}
            onClick={() => setChoice(i)}
            className={`block w-full rounded border px-3 py-2 text-left text-sm transition-colors ${
              choice === i
                ? 'border-ocre-100 bg-ocre-10 text-tinta-100'
                : 'border-pizarra-30 bg-lienzo-100 text-tinta-100 hover:border-ocre-50'
            } ${revealed ? 'cursor-default' : 'cursor-pointer'}`}
          >
            {opt}
            {revealed && i === 1 && (
              <span className="ml-2 text-[11px] font-medium text-danger-600">⊂ de la primera</span>
            )}
          </button>
        ))}
      </div>

      {!revealed && (
        <button
          type="button"
          className={`${BTN_REVEAL} mt-3`}
          disabled={choice === null}
          onClick={() => setRevealed(true)}
        >
          Verificar mi respuesta
        </button>
      )}

      {revealed && (
        <div className="mt-4 grid gap-4 md:grid-cols-[auto_1fr]">
          <svg viewBox="0 0 260 150" className="w-64" role="img" aria-label="Diagrama de Venn de cajeras y feministas">
            <rect x={4} y={4} width={252} height={142} fill="none" stroke={GRAY} rx={6} />
            <text x={14} y={20} fontSize={9} fill={tokens.chart.text}>personas que ejercen oficios</text>
            {/* A: cajeras */}
            <circle cx={105} cy={80} r={58} fill={`${GRAY}30`} stroke={GRAY} strokeWidth={1.5} />
            <text x={58} y={58} fontSize={10} fill={tokens.chart.text} fontWeight={600}>cajeras</text>
            {/* B: feministas */}
            <circle cx={168} cy={80} r={46} fill={`${ACCENT}25`} stroke={ACCENT} strokeWidth={1.5} />
            <text x={185} y={120} fontSize={10} fill={ACCENT} fontWeight={600}>feministas</text>
            {/* A ∩ B */}
            <path
              d="M 138 42 A 46 46 0 0 1 138 118 A 58 58 0 0 1 138 42 Z"
              fill={`${DANGER}40`}
              stroke={DANGER}
              strokeWidth={1.2}
            />
            <text x={131} y={82} fontSize={9} fill={DANGER} fontWeight={700}>A∩B</text>
          </svg>
          <div className="text-sm leading-relaxed text-tinta-100">
            <p>
              {fell
                ? 'Te pasó lo que le pasa a casi todo el mundo, incluidos los autores de este curso la primera vez.'
                : 'Bien: no ordenaste la conjunción por encima del conjunto, algo que la mayoría hace.'}
            </p>
            <p className="mt-2">
              La región roja, «cajera y feminista», está <em>dentro</em> del círculo «cajera». Un
              subconjunto nunca puede contener más elementos que el conjunto que lo contiene:
              P(cajera y feminista) ≤ P(cajera). La descripción de Linda se parece al estereotipo
              «feminista» y ese parecido empuja a juzgar la conjunción más probable. El parecido
              mide representatividad, no probabilidad.
            </p>
          </div>
        </div>
      )}

      <p className={NOTE}>
        Tversky y Kahneman (1983): entre el 85% y el 90% de los participantes ordenó la conjunción
        como más probable, incluyendo estudiantes de posgrado con formación estadística.
      </p>
    </div>
  );
}

/* ================================================================== */
/* 3. SmallNumbersLab: la ley de los números pequeños                  */
/* ================================================================== */

/**
 * La ley de los números pequeños. Mil experimentos de lanzar una moneda
 * justa n veces: con n = 10 las proporciones de caras saltan por todas
 * partes; con n = 1000 se apiñan en 0.5. La intuición espera lo segundo
 * a cualquier n.
 */
export function SmallNumbersLab({ title }: { title?: ReactNode }) {
  const [n, setN] = useState(10);
  const [guess, setGuess] = useState('');

  const REP = 1000;
  const { hist, within, sd } = useMemo(() => {
    const rng = mulberry32(777 + n * 13);
    const bins = new Array(21).fill(0);
    let inside = 0;
    for (let r = 0; r < REP; r++) {
      let heads = 0;
      for (let i = 0; i < n; i++) if (rng() < 0.5) heads += 1;
      const p = heads / n;
      bins[Math.min(20, Math.floor(p * 21))] += 1;
      if (p >= 0.45 && p <= 0.55) inside += 1;
    }
    return { hist: bins, within: inside / REP, sd: Math.sqrt(0.25 / n) };
  }, [n]);

  const W = 420;
  const H = 120;
  const maxBin = Math.max(...hist);
  const bw = W / 21;
  const guessN = Number(guess);

  return (
    <div className={FIG}>
      <div className={CAPTION}>{title ?? 'La ley de los números pequeños'}</div>

      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-tinta-100">
        <span className="font-semibold">Lanzamientos por experimento:</span>
        {[10, 100, 1000].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setN(v)}
            className={v === n ? CHIP_ON : CHIP}
          >
            <span className={CHIP_DOT} aria-hidden style={v === n ? { background: OCRE, borderColor: OCRE } : undefined} />
            n = {v}
          </button>
        ))}
        <span className="ml-auto inline-flex items-center gap-2">
          Tu predicción de caras en 10 lanzamientos:{' '}
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={guess === '' ? 5 : Number(guess)}
            onChange={(e) => setGuess(e.target.value)}
            className="w-32 accent-ocre-100"
            aria-label="Deslizador: caras esperadas en 10 lanzamientos"
          />
          <input
            type="number"
            min={0}
            max={10}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className={`${INPUT} w-14 text-xs`}
            aria-label="Caras esperadas en 10 lanzamientos"
          />
          {Number.isFinite(guessN) && guess !== '' && (
            <span className="ml-1 text-pizarra-100">
              (proporción {fmt(guessN / 10, 2)})
            </span>
          )}
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" role="img" aria-label="Distribución de la proporción de caras">
        {hist.map((b, i) => (
          <rect
            key={i}
            x={rnd(i * bw) + 0.5}
            y={rnd(H - (b / maxBin) * (H - 20))}
            width={rnd(bw) - 1}
            height={rnd((b / maxBin) * (H - 20))}
            fill={i >= 9 && i <= 11 ? ACCENT : `${GRAY}90`}
            rx={1}
          />
        ))}
        <line x1={0} x2={W} y1={H} y2={H} stroke={tokens.chart.axis} />
        <line x1={rnd(W / 2)} x2={rnd(W / 2)} y1={0} y2={H} stroke={DANGER} strokeDasharray="4 3" />
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <text key={v} x={rnd(v * W)} y={H + 14} fontSize={9} textAnchor="middle" fill={tokens.chart.text}>
            {fmt(v, 2)}
          </text>
        ))}
        <text x={rnd(W / 2)} y={H + 23} fontSize={9} textAnchor="middle" fill={tokens.chart.text}>
          proporción de caras en cada experimento (1000 repeticiones)
        </text>
      </svg>

      <div className="mt-2 grid gap-2 text-xs text-tinta-100 sm:grid-cols-3">
        <div className="rounded border border-pizarra-15 bg-pizarra-10 p-2">
          Experimentos dentro de [0.45, 0.55]: <strong>{fmt(within * 100, 1)}%</strong>
        </div>
        <div className="rounded border border-pizarra-15 bg-pizarra-10 p-2">
          Desviación teórica σ/√n: <strong>{fmt(sd, 3)}</strong>
        </div>
        <div className="rounded border border-pizarra-15 bg-pizarra-10 p-2">
          Con n = {n}, una proporción de 0.70 queda a{' '}
          <strong>{fmt(0.2 / sd, 1)} σ</strong>
        </div>
      </div>

      <SimLegend
        className="mt-3"
        items={[
          { color: ACCENT, label: 'proporciones en [0.45, 0.55]', mark: 'bar' },
          { color: `${GRAY}90`, label: 'fuera de esa banda', mark: 'bar' },
          { color: DANGER, label: 'valor esperado 0.50', mark: 'line', dash: true },
        ]}
      />
      <p className={NOTE}>
        La varianza de la proporción es p(1−p)/n: con n = 10 una muestra de 7 caras es moneda
        corriente, con n = 1000 sería un escándalo estadístico. Tversky y Kahneman (1971) mostraron
        que incluso investigadores entrenados interpretan muestras de 10 como si fueran de 1000: la
        intuición espera que el azar se corrija rápido, y el azar no tiene prisa.
      </p>
      <SimGuide>
        Cambia n y mira cómo se estrecha la distribución. Luego vuelve a n = 10: cada barra es un
        experimento honesto, y aun así hay quienes obtienen 8 caras de 10 y concluyen que la moneda
        está cargada.
      </SimGuide>
    </div>
  );
}

/* ================================================================== */
/* 4. DiagnosticTestExplorer: la tasa base que el test no puede vencer */
/* ================================================================== */

const DT_KEY = 'dtexp.v1';

const pctFmt = (p: number) => {
  const x = p * 100;
  if (x >= 10) return `${x.toFixed(1)}%`;
  if (x >= 1) return `${x.toFixed(1)}%`;
  if (x >= 0.1) return `${x.toFixed(2)}%`;
  return `${x.toFixed(3)}%`;
};

/**
 * El ejemplo ancla del Módulo II (laboratorio.md §2.1), rediseñado
 * como «el recuento»: el CommitReveal anterior ya registró la
 * estimación del estudiante, así que este explorador no repite la
 * pregunta — muestra la respuesta.
 *
 *  1. Icon array de 1000 personas donde cada positivo lleva un
 *     anillo: el denominador del VPP hecho visible.
 *  2. Lupa sobre los positivos solos: ocre entre arena, la fracción
 *     se puede contar a ojo.
 *  3. Sliders de sensibilidad, especificidad y prevalencia (escala
 *     log) mueven todo en vivo, incluida la curva VPP(prev) con ejes
 *     nombrados.
 *
 * Color (diseno.md §6.2): ocre = verdaderos positivos (la señal),
 * arena = falsos positivos (el ruido basal), tinta = falsos negativos,
 * pizarra tenue = la mayoría sana. El anillo de «test positivo» es
 * doble codificación: color de verdad + marca de quien fue marcado.
 */
export function DiagnosticTestExplorer({ title }: { title?: ReactNode }) {
  const [se, setSe] = useState(0.99);
  const [sp, setSp] = useState(0.95);
  const [prev, setPrev] = useState(0.001);

  /* Persistencia (§8.3): los parámetros sobreviven a la sesión. */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(DT_KEY) ?? 'null');
      if (saved) {
        if (typeof saved.se === 'number') setSe(saved.se);
        if (typeof saved.sp === 'number') setSp(saved.sp);
        if (typeof saved.prev === 'number') setPrev(saved.prev);
      }
    } catch {
      /* almacenamiento no disponible: se continúa sin persistir */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(DT_KEY, JSON.stringify({ se, sp, prev }));
    } catch {
      /* idem */
    }
  }, [se, sp, prev]);

  const N = 1000;
  const nSick = Math.round(prev * N);
  const nVP = Math.round(prev * N * se);
  const nFN = nSick - nVP;
  const nFP = Math.round((N - prev * N) * (1 - sp));
  const nVN = N - nSick - nFP;
  const nPos = nVP + nFP;
  const vpp = nPos > 0 ? nVP / nPos : NaN;
  const vpn = nVN + nFN > 0 ? nVN / (nVN + nFN) : NaN;

  /* --- Icon array: 1000 personas, 40 x 25. Orden: enfermos
   * atrapados (ocre), enfermos que el test no vio (tinta), falsos
   * positivos (arena) y la mayoría sana (pizarra). Todo quien dio
   * positivo lleva un anillo tinta: es el conjunto «test +» cuyo
   * tamaño la intuición olvida. --- */
  const COLS = 40;
  const GAP = 9;
  const R = 3.4;
  const dotColor = (i: number) => {
    if (i < nVP) return OCRE;
    if (i < nVP + nFN) return TINTA;
    if (i < nVP + nFN + nFP) return ARENA;
    return PIZARRA;
  };
  const isPositive = (i: number) => i < nVP || (i >= nVP + nFN && i < nVP + nFN + nFP);

  /* --- Curva VPP(prev) en escala logarítmica (anunciada, §6.1) --- */
  const CW = 360;
  const CH = 168;
  const PAD = { l: 46, r: 8, t: 10, b: 30 };
  const LOG_MIN = -4;
  const LOG_MAX = Math.log10(0.5);
  const xOf = (p: number) =>
    PAD.l + ((Math.log10(p) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (CW - PAD.l - PAD.r);
  const yOf = (v: number) => PAD.t + (1 - v) * (CH - PAD.t - PAD.b);
  const vppAt = (p: number) => (se * p) / (se * p + (1 - sp) * (1 - p));
  const curve = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const lp = LOG_MIN + (i / 60) * (LOG_MAX - LOG_MIN);
      const p = Math.pow(10, lp);
      pts.push(`${i === 0 ? 'M' : 'L'}${rnd(xOf(p))},${rnd(yOf(vppAt(p)))}`);
    }
    return pts.join(' ');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [se, sp]);
  const ticks = [0.0001, 0.001, 0.01, 0.1, 0.5];

  /* Slider de prevalencia en escala logarítmica (§2.1 del lab: la tasa
   * base abarca órdenes de magnitud, no porcentajes lineales). */
  const tOfPrev = (Math.log10(prev) - LOG_MIN) / (LOG_MAX - LOG_MIN);
  const setPrevT = (t: number) => setPrev(Math.pow(10, LOG_MIN + t * (LOG_MAX - LOG_MIN)));

  return (
    <div className={FIG}>
      <div className={CAPTION}>{title ?? 'El recuento: mil personas, una por una'}</div>
      <p className="mb-3 text-xs text-tinta-100">
        De cada 1.000 personas testadas, ¿cuántos de los positivos están enfermos de verdad?
        En el array de la izquierda, todo quien da positivo lleva un anillo: ese anillo es el
        denominador que la intuición olvida. A la derecha, ese mismo conjunto ampliado. Mueve los
        tres parámetros del test y mira quién entra al anillo.
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        <label className="block font-mono text-[11px] text-tinta-100">
          sensibilidad = {(se * 100).toFixed(1)}%
          <input
            type="range"
            min={0.5}
            max={0.999}
            step={0.001}
            value={se}
            onChange={(e) => setSe(Number(e.target.value))}
            className={SLIDER}
            aria-label="Sensibilidad del test"
          />
        </label>
        <label className="block font-mono text-[11px] text-tinta-100">
          especificidad = {(sp * 100).toFixed(1)}%
          <input
            type="range"
            min={0.5}
            max={0.999}
            step={0.001}
            value={sp}
            onChange={(e) => setSp(Number(e.target.value))}
            className={SLIDER}
            aria-label="Especificidad del test"
          />
        </label>
        <label className="block font-mono text-[11px] text-tinta-100">
          prevalencia = {pctFmt(prev)} (escala log)
          <input
            type="range"
            min={0}
            max={1}
            step={0.002}
            value={tOfPrev}
            onChange={(e) => setPrevT(Number(e.target.value))}
            className={SLIDER}
            aria-label="Prevalencia en escala logarítmica"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[auto_1fr]">
        <div>
          <svg
            viewBox={`0 0 ${COLS * GAP} ${25 * GAP}`}
            className="w-full max-w-md"
            role="img"
            aria-label={`De cada 1000 personas: ${nVP} verdaderos positivos, ${nFN} falsos negativos, ${nFP} falsos positivos y ${nVN} verdaderos negativos. Los ${nPos} positivos llevan un anillo.`}
          >
            <title>Icon array de mil personas; los positivos van con anillo</title>
            {Array.from({ length: N }, (_, i) => {
              const pos = isPositive(i);
              const faint = !pos && i >= nVP + nFN + nFP;
              return (
                <g key={i}>
                  {pos && (
                    <circle
                      cx={(i % COLS) * GAP + GAP / 2}
                      cy={Math.floor(i / COLS) * GAP + GAP / 2}
                      r={R + 1.6}
                      fill="none"
                      stroke={TINTA}
                      strokeWidth={1}
                    />
                  )}
                  <circle
                    cx={(i % COLS) * GAP + GAP / 2}
                    cy={Math.floor(i / COLS) * GAP + GAP / 2}
                    r={R}
                    fill={dotColor(i)}
                    fillOpacity={faint ? 0.28 : 1}
                  />
                </g>
              );
            })}
          </svg>
          <div className="mt-1 font-mono text-[11px] text-tinta-100">
            test positivo: {nPos} de 1.000 personas
          </div>
        </div>

        <div>
          <p className="mb-1 font-mono text-[11px] text-tinta-100">
            los {nPos} positivos, de cerca:
          </p>
          <svg
            viewBox={`0 0 ${COLS * GAP} ${Math.max(1, Math.ceil(nPos / COLS)) * GAP}`}
            className="w-full max-w-md"
            role="img"
            aria-label={`Los ${nPos} positivos ampliados: ${nVP} son enfermos de verdad y ${nFP} son falsas alarmas`}
          >
            <title>El conjunto de positivos ampliado</title>
            {Array.from({ length: nPos }, (_, i) => (
              <circle
                key={i}
                cx={(i % COLS) * GAP + GAP / 2}
                cy={Math.floor(i / COLS) * GAP + GAP / 2}
                r={R}
                fill={i < nVP ? OCRE : ARENA}
              />
            ))}
          </svg>
          <div className="mt-1 grid grid-cols-2 gap-x-4 font-mono text-[11px] text-tinta-100">
            <span>positivos verdaderos: {nVP}</span>
            <span>positivos falsos: {nFP}</span>
            <span aria-live="polite" className="col-span-2 mt-1 font-semibold">
              VPP = {nVP}/{nPos} ≈ {Number.isFinite(vpp) ? pctFmt(vpp) : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <svg
          viewBox={`0 0 ${CW} ${CH}`}
          className="w-full max-w-md"
          role="img"
          aria-label="Curva del valor predictivo positivo (eje vertical) en función de la prevalencia (eje horizontal, escala logarítmica)"
        >
          <title>VPP según prevalencia</title>
          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <g key={v}>
              <line x1={PAD.l} x2={CW - PAD.r} y1={yOf(v)} y2={yOf(v)} stroke={tokens.chart.grid} />
              <text x={PAD.l - 4} y={yOf(v) + 3} fontSize={8} textAnchor="end" fill={tokens.chart.text} className="font-mono">
                {v * 100}%
              </text>
            </g>
          ))}
          <text
            x={10}
            y={PAD.t + (CH - PAD.t - PAD.b) / 2}
            fontSize={9}
            textAnchor="middle"
            fill={tokens.chart.text}
            className="font-mono"
            transform={`rotate(-90 10 ${PAD.t + (CH - PAD.t - PAD.b) / 2})`}
          >
            VPP
          </text>
          {ticks.map((p) => (
            <text key={p} x={xOf(p)} y={CH - 16} fontSize={8} textAnchor="middle" fill={tokens.chart.text} className="font-mono">
              {pctFmt(p)}
            </text>
          ))}
          <text x={PAD.l + (CW - PAD.l - PAD.r) / 2} y={CH - 4} fontSize={9} textAnchor="middle" fill={tokens.chart.text} className="font-mono">
            prevalencia (escala logarítmica)
          </text>
          <path d={curve} fill="none" stroke={TINTA} strokeWidth={2} />
          <circle cx={xOf(prev)} cy={yOf(vpp)} r={4.5} fill={OCRE} stroke={LIENZO} strokeWidth={1.5} />
        </svg>
        <p className="font-mono text-[11px] text-pizarra-100">
          VPN = {pctFmt(vpn)} · el punto ocre es el caso actual
        </p>
      </div>

      <SimLegend
        className="mt-3"
        items={[
          { color: OCRE, label: 'enfermos, test positivo', mark: 'dot' },
          { color: ARENA, label: 'sanos, test positivo (falsas alarmas)', mark: 'dot' },
          { color: TINTA, label: 'enfermos que el test no vio', mark: 'dot' },
          { color: PIZARRA, label: 'sanos, test negativo', mark: 'dot' },
          { color: TINTA, label: 'VPP según prevalencia', mark: 'line' },
        ]}
      />
      <SimGuide>
        Baja la prevalencia hasta 0.01% y mira el anillo y la curva: ni con sensibilidad y
        especificidad del 99% el VPP despega. La tasa base manda porque los sanos son tantos que
        su pequeña tasa de error supera al grupo enfermo entero. Vuelve a subir la prevalencia y
        observa cómo el mismo test, sin cambiar nada, se vuelve útil.
      </SimGuide>
      <p className={NOTE}>
        Gigerenzer y Hoffrage (1995): el mismo problema en frecuencias naturales eleva las
        respuestas correctas sin instrucción formal. El obstáculo no era Bayes sino el formato
        porcentual. VPP = Se·prev / [Se·prev + (1−Sp)(1−prev)].
      </p>
    </div>
  );
}

/* ================================================================== */
/* 5. CalibrationGame: tus intervalos del 90% contra la realidad       */
/* ================================================================== */

const CAL_KEY = 'calgame.v1';

const QUESTIONS: { q: string; unit: string; answer: number }[] = [
  { q: 'Año de fundación de la Universidad Nacional de Colombia', unit: 'año', answer: 1867 },
  { q: 'Longitud aproximada del río Amazonas', unit: 'km', answer: 6400 },
  { q: 'Altura del monte Everest', unit: 'm', answer: 8849 },
  { q: 'Año de la llegada del ser humano a la Luna', unit: 'año', answer: 1969 },
  { q: 'Huesos del cuerpo humano adulto', unit: 'huesos', answer: 206 },
  { q: 'Elementos de la tabla periódica actual', unit: 'elementos', answer: 118 },
  { q: 'Velocidad de crucero típica de un avión comercial', unit: 'km/h', answer: 900 },
  { q: 'Año de la caída del muro de Berlín', unit: 'año', answer: 1989 },
  { q: 'Población mundial estimada en 2024', unit: 'miles de millones', answer: 8.1 },
  { q: 'Población del área metropolitana de Medellín', unit: 'millones', answer: 4 },
];

interface CalResult {
  lo: number;
  hi: number;
  answer: number;
  covered: boolean;
}

/**
 * El protocolo de Alpert y Raiffa en versión jugable. El estudiante da
 * un intervalo del 90% para diez cantidades que no conoce con exactitud;
 * al final ve cuántos intervalos cubrieron la verdad. La mayoría cubre
 * entre 4 y 7 de 10: la sobreconfianza no es un defecto de carácter,
 * es el anclaje aplicado a la incertidumbre.
 *
 * Color (diseno.md §6.2): intervalo que cubre en pizarra con la verdad
 * en tinta; intervalo que falla en ocre, que es el color de la
 * revelación: cada falla es el momento que el ejercicio existe para.
 */
export function CalibrationGame({ title }: { title?: ReactNode }) {
  const [idx, setIdx] = useState(0);
  const [bounds, setBounds] = useState<{ lo: string; hi: string }[]>(
    QUESTIONS.map(() => ({ lo: '', hi: '' })),
  );
  const [done, setDone] = useState<CalResult[] | null>(null);
  const [previous, setPrevious] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CAL_KEY) ?? 'null');
      if (saved && typeof saved.covered === 'number') setPrevious(saved.covered);
    } catch {
      /* sin almacenamiento: se juega sin historial */
    }
  }, []);

  const q = QUESTIONS[idx];
  const lo = Number(bounds[idx].lo);
  const hi = Number(bounds[idx].hi);
  const valid =
    bounds[idx].lo.trim() !== '' &&
    bounds[idx].hi.trim() !== '' &&
    Number.isFinite(lo) &&
    Number.isFinite(hi) &&
    lo < hi;

  const setBound = (k: 'lo' | 'hi', v: string) =>
    setBounds((b) => b.map((x, i) => (i === idx ? { ...x, [k]: v } : x)));

  const finish = () => {
    const results = QUESTIONS.map((question, i) => {
      const l = Number(bounds[i].lo);
      const h = Number(bounds[i].hi);
      return {
        lo: l,
        hi: h,
        answer: question.answer,
        covered: l <= question.answer && question.answer <= h,
      };
    });
    setDone(results);
    try {
      localStorage.setItem(
        CAL_KEY,
        JSON.stringify({ covered: results.filter((r) => r.covered).length, at: Date.now() }),
      );
    } catch {
      /* idem */
    }
  };

  const covered = done?.filter((r) => r.covered).length ?? 0;

  /* Escala común para el gráfico de intervalos: todos los rangos y
   * respuestas en el mismo eje (valores dispares → eje logarítmico). */
  const W = 430;
  const rowH = 30;
  const PADX = 30;
  const logOf = (v: number) => Math.log10(Math.max(v, 1e-6));
  const allVals = done ? done.flatMap((r) => [r.lo, r.hi, r.answer]) : [1];
  const loAll = Math.min(...allVals);
  const hiAll = Math.max(...allVals);
  const xOf = (v: number) =>
    PADX + ((logOf(v) - logOf(loAll)) / Math.max(logOf(hiAll) - logOf(loAll), 1e-9)) * (W - 2 * PADX);

  return (
    <div className={FIG}>
      <div className={CAPTION}>
        {title ?? 'Calibración: diez intervalos del 90%'}
      </div>

      {done === null ? (
        <>
          <p className="mb-3 text-xs text-pizarra-100">
            Para cada pregunta da un rango en el que estés 90% seguro de que cae la respuesta.
            No se vale mirar nada: el juego mide tu incertidumbre, no tu memoria.
            {previous !== null && (
              <span className="ml-1 font-mono text-tinta-100">
                (la vez anterior cubriste {previous}/10)
              </span>
            )}
          </p>
          <div className="rounded border border-pizarra-15 bg-pizarra-10 p-3">
            <p className="text-sm text-tinta-100">
              <span className="font-mono text-pizarra-100">
                {idx + 1}/{QUESTIONS.length}
              </span>{' '}
              {q.q} <span className="text-pizarra-100">({q.unit})</span>
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-xs">
              <label className="inline-flex items-center gap-1">
                entre
                <input
                  type="number"
                  value={bounds[idx].lo}
                  onChange={(e) => setBound('lo', e.target.value)}
                  className={`${INPUT} w-24 py-1`}
                  aria-label="Límite inferior del intervalo"
                />
              </label>
              <label className="inline-flex items-center gap-1">
                y
                <input
                  type="number"
                  value={bounds[idx].hi}
                  onChange={(e) => setBound('hi', e.target.value)}
                  className={`${INPUT} w-24 py-1`}
                  aria-label="Límite superior del intervalo"
                />
              </label>
              <span className="text-pizarra-100">{q.unit}</span>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {idx < QUESTIONS.length - 1 ? (
              <button
                type="button"
                className={BTN_MAIN}
                disabled={!valid}
                onClick={() => setIdx((i) => i + 1)}
              >
                Siguiente
              </button>
            ) : (
              <button type="button" className={BTN_REVEAL} disabled={!valid} onClick={finish}>
                Ver mi calibración
              </button>
            )}
            {idx > 0 && (
              <button type="button" className={BTN_GHOST} onClick={() => setIdx((i) => i - 1)}>
                Atrás
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <p aria-live="polite" className="mb-2 text-sm text-tinta-100">
            Declaraste 90% de confianza. Cubriste{' '}
            <strong className="font-mono">{covered}/10</strong> respuestas.
            {covered < 9 && (
              <span className="text-pizarra-100">
                {' '}
                La brecha entre lo declarado y lo cubierto se llama sobreconfianza.
              </span>
            )}
          </p>
          <svg
            viewBox={`0 0 ${W} ${done.length * rowH + 10}`}
            className="w-full max-w-lg"
            role="img"
            aria-label={`Intervalos declarados contra respuestas reales: ${covered} de ${done.length} cubren`}
          >
            <title>Cobertura de los intervalos del 90%</title>
            {done.map((r, i) => {
              const y = i * rowH + 16;
              return (
                <g key={i}>
                  <line
                    x1={xOf(r.lo)}
                    x2={xOf(r.hi)}
                    y1={y}
                    y2={y}
                    stroke={r.covered ? PIZARRA : OCRE}
                    strokeWidth={r.covered ? 3 : 4}
                    strokeLinecap="round"
                  />
                  <circle cx={xOf(r.answer)} cy={y} r={4} fill={r.covered ? TINTA : OCRE} />
                  <text x={4} y={y + 3} fontSize={8} fill={tokens.chart.text} className="font-mono">
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>
          <SimLegend
            className="mt-2"
            items={[
              { color: PIZARRA, label: 'intervalo que cubrió', mark: 'line' },
              { color: OCRE, label: 'intervalo que falló', mark: 'line' },
              { color: TINTA, label: 'respuesta real', mark: 'dot' },
            ]}
          />
          {previous !== null && (
            <p className="mt-2 font-mono text-[11px] text-pizarra-100">
              intento anterior: {previous}/10 · este intento: {covered}/10
            </p>
          )}
          <SimGuide>
            Alpert y Raiffa obtuvieron este patrón con evaluadores entrenados: intervalos del 98%
            que cubrían mucho menos del 98%. El remedio no es «pensar más» sino ensanchar: la
            próxima vez que des un rango, duplica la distancia entre tu estimación y tus extremos.
          </SimGuide>
          <p className={NOTE}>
            El eje del gráfico es logarítmico porque las preguntas mezclan años, kilómetros y
            millones; lo que importa no es la escala sino la posición de la verdad respecto de tu
            rango.
          </p>
        </>
      )}
    </div>
  );
}

/* ================================================================== */
/* 6. QualityControlSim: intervenir las peores unidades es perseguir   */
/*    el ruido (regresión a la media)                                   */
/* ================================================================== */

/**
 * El descubrimiento de Kahneman con los pilotos israelíes, llevado al
 * control de calidad (laboratorio.md §2.4). Un proceso estable produce
 * unidades ~N(100, 5). En cada ronda se «intervienen» las 10 peores, y
 * en la siguiente ronda esas mismas unidades mejoran. La intervención
 * es un placebo: el proceso nunca cambió. Lo que cambió es la selección
 * de los extremos, y los extremos vuelven a la media.
 */
/** N(0,1) por Box-Muller sobre un RNG determinista. */
const gauss = (rng: () => number) => {
  const u = Math.max(rng(), 1e-9);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

export function QualityControlSim({ title }: { title?: ReactNode }) {
  const NU = 40;
  const MU = 100;
  const SD = 5;
  const WORST = 10;
  const SEED = 20241011;

  const [round, setRound] = useState(0);
  const [target, setTarget] = useState<'worst' | 'best'>('worst');
  const [history, setHistory] = useState<
    { dir: 'worst' | 'best'; before: number; after: number; from: number[]; to: number[]; sel: number[] }[]
  >([]);

  /* Valores por unidad y ronda ~N(100,5): independientes entre rondas
   * porque el proceso no tiene efectos fijos. La misma semilla hace
   * la simulación reproducible entre SSR y cliente. */
  const values = useMemo(() => {
    const rng = mulberry32(SEED + round * 7919);
    return Array.from({ length: NU }, () => MU + SD * gauss(rng));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const nextValues = useMemo(() => {
    const rng = mulberry32(SEED + (round + 1) * 7919);
    return Array.from({ length: NU }, () => MU + SD * gauss(rng));
  }, [round]);

  const selIdx = useMemo(() => {
    const sorted = values.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
    return new Set(
      (target === 'worst' ? sorted.slice(0, WORST) : sorted.slice(-WORST)).map((x) => x.i),
    );
  }, [values, target]);

  const selNow = [...selIdx].reduce((s, i) => s + values[i], 0) / WORST;
  const selNext = [...selIdx].reduce((s, i) => s + nextValues[i], 0) / WORST;

  const intervene = () => {
    /* Snapshot de la transición: al intervenir, la ronda avanza y los
     * arrays se regeneran; el slope chart dibuja la última transición
     * registrada, no el estado nuevo. */
    setHistory((h) => [
      ...h,
      { dir: target, before: selNow, after: selNext, from: values, to: nextValues, sel: [...selIdx] },
    ]);
    setRound((r) => r + 1);
  };

  /* Escalas compartidas entre el strip y el slope chart. */
  const XMIN = 82;
  const XMAX = 118;
  const W = 430;
  const xOf = (v: number) => ((v - XMIN) / (XMAX - XMIN)) * W;
  const ucl = MU + 3 * SD;
  const lcl = MU - 3 * SD;

  /* Strip de la ronda actual. */
  const H1 = 110;
  /* Slope chart: ronda N → ronda N+1, una línea por unidad. */
  const H2 = 230;
  const PAD = { l: 40, r: 46, t: 18, b: 8 };
  const yOf = (v: number) => PAD.t + (1 - (v - XMIN) / (XMAX - XMIN)) * (H2 - PAD.t - PAD.b);
  const XL = PAD.l + 8;
  const XR = W - PAD.r - 8;

  const gainOf = (dir: 'worst' | 'best') => {
    const rows = history.filter((h) => h.dir === dir);
    if (!rows.length) return null;
    return rows.reduce((s, h) => s + (h.after - h.before), 0) / rows.length;
  };
  const gainWorst = gainOf('worst');
  const gainBest = gainOf('best');

  return (
    <div className={FIG}>
      <div className={CAPTION}>
        {title ?? 'Control de calidad: la intervención que no hace nada'}
      </div>

      <p className="mb-2 text-xs text-pizarra-100">
        Un proceso estable produce {NU} unidades por ronda ~N(100, 5). Tu trabajo: escoger un
        extremo, aplicarle «reentrenamiento» y medir la ronda siguiente.
      </p>

      <svg
        viewBox={`0 0 ${W} ${H1 + 26}`}
        className="w-full max-w-lg"
        role="img"
        aria-label={`Ronda ${round + 1}: las ${WORST} unidades del extremo seleccionado están marcadas`}
      >
        <title>Unidades del proceso en la ronda actual</title>
        <rect x={xOf(lcl)} y={0} width={xOf(ucl) - xOf(lcl)} height={H1 - 22} fill={PIZARRA} fillOpacity={0.08} />
        {[lcl, ucl].map((v) => (
          <line key={v} x1={xOf(v)} x2={xOf(v)} y1={0} y2={H1 - 22} stroke={PIZARRA} strokeDasharray="4 3" />
        ))}
        <line x1={xOf(MU)} x2={xOf(MU)} y1={0} y2={H1 - 22} stroke={TINTA} strokeWidth={1.5} />
        {values.map((v, i) => (
          <circle
            key={i}
            cx={xOf(v)}
            cy={8 + (i % 5) * ((H1 - 32) / 5)}
            r={4}
            fill={selIdx.has(i) ? OCRE : PIZARRA}
            fillOpacity={selIdx.has(i) ? 1 : VIZ.puntoDispersion}
          />
        ))}
        {[85, 95, 100, 105, 115].map((v) => (
          <text key={v} x={xOf(v)} y={H1 - 8} fontSize={9} textAnchor="middle" fill={tokens.chart.text} className="font-mono">
            {v}
          </text>
        ))}
        <text x={W / 2} y={H1 + 20} fontSize={9} textAnchor="middle" fill={tokens.chart.text}>
          valor de cada unidad · banda: ±3σ del proceso
        </text>
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
        <span className="text-pizarra-100">intervenir:</span>
        {(['worst', 'best'] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={target === t}
            onClick={() => setTarget(t)}
            className={target === t ? CHIP_ON : CHIP}
          >
            <span
              className={CHIP_DOT}
              aria-hidden
              style={target === t ? { background: OCRE, borderColor: OCRE } : undefined}
            />
            {t === 'worst' ? `las ${WORST} peores` : `las ${WORST} mejores`}
          </button>
        ))}
        <button type="button" className={BTN_MAIN} onClick={intervene}>
          Intervenir y medir la ronda siguiente
        </button>
        <span className="font-mono text-[11px] text-pizarra-100">
          media de las elegidas ahora: {fmt(selNow, 1)}
        </span>
      </div>

      {history.length > 0 && (
        <div className="mt-4">
          {(() => {
            const last = history[history.length - 1];
            const selSet = new Set(last.sel);
            return (
              <>
                <p className="mb-1 text-xs font-semibold text-tinta-100">
                  Las {NU} unidades, de la ronda {round} a la {round + 1}
                </p>
                <svg
                  viewBox={`0 0 ${W} ${H2}`}
                  className="w-full max-w-lg"
                  role="img"
                  aria-label="Slope chart: cada unidad conecta su valor de la ronda anterior con el de la siguiente; las intervenidas convergen a la media"
                >
                  <title>Trayectoria de cada unidad entre rondas</title>
                  {[85, 95, 100, 105, 115].map((v) => (
                    <g key={v}>
                      <line x1={PAD.l} x2={W - PAD.r} y1={yOf(v)} y2={yOf(v)} stroke={tokens.chart.grid} strokeOpacity={v === 100 ? 1 : 0.5} />
                      <text x={PAD.l - 5} y={yOf(v) + 3} fontSize={8} textAnchor="end" fill={tokens.chart.text} className="font-mono">
                        {v}
                      </text>
                    </g>
                  ))}
                  {/* el resto primero, en pizarra tenue */}
                  {last.from.map((v, i) =>
                    selSet.has(i) ? null : (
                      <line
                        key={i}
                        x1={XL}
                        x2={XR}
                        y1={yOf(v)}
                        y2={yOf(last.to[i])}
                        stroke={PIZARRA}
                        strokeOpacity={0.18}
                      />
                    ),
                  )}
                  {/* las intervenidas encima, en ocre */}
                  {last.from.map((v, i) =>
                    selSet.has(i) ? (
                      <g key={i}>
                        <line x1={XL} x2={XR} y1={yOf(v)} y2={yOf(last.to[i])} stroke={OCRE} strokeWidth={1.6} strokeOpacity={0.85} />
                        <circle cx={XL} cy={yOf(v)} r={3} fill={OCRE} />
                        <circle cx={XR} cy={yOf(last.to[i])} r={3} fill={OCRE} />
                      </g>
                    ) : null,
                  )}
                  {/* la media del grupo intervenido, en tinta */}
                  <line x1={XL} x2={XR} y1={yOf(last.before)} y2={yOf(last.after)} stroke={TINTA} strokeWidth={2.4} strokeDasharray="6 3" />
                  <text x={XL} y={PAD.t - 8} fontSize={9} textAnchor="middle" fill={tokens.chart.text} className="font-mono">
                    ronda {round}
                  </text>
                  <text x={XR} y={PAD.t - 8} fontSize={9} textAnchor="middle" fill={tokens.chart.text} className="font-mono">
                    ronda {round + 1}
                  </text>
                  <text x={XR + 6} y={yOf(last.after) + 3} fontSize={8} fill={tokens.chart.text} className="font-mono">
                    {fmt(last.after, 1)}
                  </text>
                </svg>
              </>
            );
          })()}

          <div className="mt-2 font-mono text-[11px] text-tinta-100" aria-live="polite">
            {history.map((h, i) => (
              <p key={i}>
                intervención {i + 1} · {h.dir === 'worst' ? 'las peores' : 'las mejores'}: {fmt(h.before, 1)} → {fmt(h.after, 1)} (Δ {h.after - h.before > 0 ? '+' : ''}{fmt(h.after - h.before, 1)})
              </p>
            ))}
            <p className="mt-1 text-pizarra-100">
              {gainWorst !== null && `peores: «mejora» media ${gainWorst > 0 ? '+' : ''}${fmt(gainWorst, 1)} · `}
              {gainBest !== null && `mejores: «mejora» media ${gainBest > 0 ? '+' : ''}${fmt(gainBest, 1)} · `}
              el proceso nunca cambió
            </p>
          </div>
        </div>
      )}

      <SimLegend
        className="mt-3"
        items={[
          { color: OCRE, label: 'unidades intervenidas y su trayectoria', mark: 'line' },
          { color: PIZARRA, label: 'resto de unidades · banda ±3σ', mark: 'line' },
          { color: TINTA, label: 'media del grupo intervenido / media del proceso', mark: 'line', dash: true },
        ]}
      />
      <SimGuide>
        Interviene las peores tres o cuatro rondas: «mejoran» siempre y el slope chart muestra el
        abanico cerrándose hacia la media. Después cambia a las mejores: «empeoran» con la misma
        regularidad. El mismo placebo, el efecto espejo, porque el proceso nunca cambió: solo
        cambió a quién mirabas. Eso es regresión a la media.
      </SimGuide>
      <p className={NOTE}>
        Kahneman llegó a este efecto cuando los instructores de vuelo israelíes juraban que el
        regaño mejoraba y el elogio empeoraba: los pilotos excepcionalmente malos volaban mejor la
        siguiente vez, elogiaran o no. Intervenir por el dato extremo es confundir el ruido con la
        señal.
      </p>
    </div>
  );
}

/* ================================================================== */
/* 7. SimpsonExplorer: la asociación que se invierte al desagregar     */
/* ================================================================== */

/** Interpola un vector hacia su destino en `ms` con easeOutCubic.
 *  Con prefers-reduced-motion salta directo (diseno.md §7.1, §9.4). */
function useAnimatedValues(target: number[], ms: number): number[] {
  const [vals, setVals] = useState(target);
  const prevRef = useRef(target);
  const key = target.join(',');
  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || ms <= 0) {
      prevRef.current = target;
      setVals(target);
      return;
    }
    const from = prevRef.current;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      setVals(from.map((f, i) => f + (target[i] - f) * e));
      if (k < 1) raf = requestAnimationFrame(step);
      else prevRef.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ms]);
  return vals;
}

const SIMPSON_DEPTS = [
  { name: 'A · selectivo', menApp: 90, menRate: 0.2, womenRate: 0.18 },
  { name: 'B', menApp: 300, menRate: 0.35, womenRate: 0.34 },
  { name: 'C', menApp: 400, menRate: 0.6, womenRate: 0.62 },
  { name: 'D · fácil', menApp: 200, menRate: 0.75, womenRate: 0.78 },
];
/* El patrón «real» de aplicantes mujeres: se concentran en el
 * departamento selectivo. Es la cuña que produce la paradoja. */
const WOMEN_REAL = [400, 200, 100, 100];
const WOMEN_TOTAL = WOMEN_REAL.reduce((s, v) => s + v, 0);
const MEN_TOTAL = SIMPSON_DEPTS.reduce((s, d) => s + d.menApp, 0);

/**
 * La paradoja de Berkeley, simplificada a cuatro departamentos. El
 * estudiante alterna entre la vista agregada (los hombres ganan por
 * goleada) y la desagregada (las mujeres ganan o empatan en cada
 * departamento), con morphing de las barras de 500 ms (§7.2). Las
 * barras apiladas muestran el mecanismo — dónde aplica cada grupo — y
 * el slider interpola el patrón de aplicación femenino hacia el
 * masculino: a igual mezcla, la brecha agregada se disuelve.
 */
export function SimpsonExplorer({ title }: { title?: ReactNode }) {
  const [strat, setStrat] = useState(false);
  const [mix, setMix] = useState(0); // 0: patrón real · 1: mujeres aplican como hombres

  /* Distribución de aplicantes mujeres: interpola entre el patrón
   * real (concentrado en A) y el patrón masculino (proporcional a sus
   * volúmenes). Las tasas por departamento nunca se tocan. */
  const womenApps = SIMPSON_DEPTS.map(
    (d, i) => WOMEN_REAL[i] + mix * ((WOMEN_TOTAL * d.menApp) / MEN_TOTAL - WOMEN_REAL[i]),
  );

  const groups = SIMPSON_DEPTS.map((d, i) => {
    const menAdm = d.menApp * d.menRate;
    const womenAdm = womenApps[i] * d.womenRate;
    return {
      name: d.name,
      menRate: d.menRate,
      womenRate: d.womenRate,
      menAdm,
      womenAdm,
      menApp: d.menApp,
      womenApp: womenApps[i],
    };
  });
  const menAgg =
    groups.reduce((s, g) => s + g.menAdm, 0) / groups.reduce((s, g) => s + g.menApp, 0);
  const womenAgg =
    groups.reduce((s, g) => s + g.womenAdm, 0) / groups.reduce((s, g) => s + g.womenApp, 0);

  /* Ocho barras siempre (hombre/mujer por departamento): en vista
   * agregada todas las de un grupo muestran la tasa agregada, y al
   * desagregar cada una vuela a su tasa por estrato. El morphing deja
   * ver que el agregado escondía la dispersión. */
  const target = groups.flatMap((g) => (strat ? [g.menRate, g.womenRate] : [menAgg, womenAgg]));
  const rates = useAnimatedValues(target, MOTION.morphing);

  const W = 440;
  const H = 170;
  const slot = W / groups.length;
  const barW = 26;
  const yOf = (r: number) => H - (r / 1) * (H - 24);

  return (
    <div className={FIG}>
      <div className={CAPTION}>{title ?? 'La paradoja de Simpson: Berkeley en cuatro departamentos'}</div>

      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs">
        <div className="inline-flex rounded border border-pizarra-30" role="group" aria-label="Vista">
          <button
            type="button"
            onClick={() => setStrat(false)}
            className={`px-3 py-1 ${!strat ? 'bg-tinta-100 text-lienzo-100' : 'text-tinta-100'}`}
          >
            Agregada
          </button>
          <button
            type="button"
            onClick={() => setStrat(true)}
            className={`px-3 py-1 ${strat ? 'bg-tinta-100 text-lienzo-100' : 'text-tinta-100'}`}
          >
            Por departamento
          </button>
        </div>
        <label className="font-mono text-[11px] text-tinta-100">
          las mujeres aplican como los hombres: {Math.round(mix * 100)}%
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={mix}
            onChange={(e) => setMix(Number(e.target.value))}
            className={SLIDER}
            aria-label="Interpolación del patrón de aplicación femenino hacia el masculino"
          />
        </label>
      </div>

      {/* El mecanismo hecho visible: en qué departamento aplica cada
       * grupo. Mismos tramos de dificultad, pesos distintos. */}
      <svg
        viewBox="0 0 440 74"
        className="mb-1 w-full max-w-lg"
        role="img"
        aria-label={`Composición de aplicantes por departamento: ${groups
          .map((g, i) => `${['A', 'B', 'C', 'D'][i]} hombres ${fmt((g.menApp / MEN_TOTAL) * 100, 0)}%, mujeres ${fmt((g.womenApp / WOMEN_TOTAL) * 100, 0)}%`)
          .join('; ')}`}
      >
        <title>Mezcla de aplicantes por departamento</title>
        {([
          { label: 'H aplican', apps: groups.map((g) => g.menApp), total: MEN_TOTAL, y: 6 },
          { label: 'M aplican', apps: groups.map((g) => g.womenApp), total: WOMEN_TOTAL, y: 44 },
        ] as const).map((row) => {
          let x = 62;
          return (
            <g key={row.label}>
              <text x={58} y={row.y + 15} fontSize={9} textAnchor="end" fill={tokens.chart.text}>
                {row.label}
              </text>
              {row.apps.map((a, i) => {
                const w = (a / row.total) * 372;
                const seg = (
                  <g key={i}>
                    <rect x={x} y={row.y} width={w} height={18} fill={PIZARRA} fillOpacity={0.85 - i * 0.2} stroke={LIENZO} strokeWidth={0.75} />
                    {w > 26 && (
                      <text x={x + w / 2} y={row.y + 12.5} fontSize={8} textAnchor="middle" fill={LIENZO} className="font-mono">
                        {['A', 'B', 'C', 'D'][i]} {fmt((a / row.total) * 100, 0)}%
                      </text>
                    )}
                  </g>
                );
                x += w;
                return seg;
              })}
            </g>
          );
        })}
        <text x={62} y={72} fontSize={8} fill={tokens.chart.text}>
          composición de las aplicaciones por departamento · A es el selectivo, D el fácil
        </text>
      </svg>

      <svg
        viewBox={`0 0 ${W} ${H + 30}`}
        className="w-full max-w-lg"
        role="img"
        aria-label={`Tasas de admisión: ${strat ? 'por departamento' : 'agregadas'}, hombres ${(menAgg * 100).toFixed(0)}%, mujeres ${(womenAgg * 100).toFixed(0)}%`}
      >
        <title>Tasas de admisión por género y departamento</title>
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <line x1={0} x2={W} y1={yOf(v)} y2={yOf(v)} stroke={tokens.chart.grid} />
            <text x={0} y={yOf(v) - 2} fontSize={8} fill={tokens.chart.text} className="font-mono">
              {v * 100}%
            </text>
          </g>
        ))}
        {groups.map((g, i) =>
          [0, 1].map((j) => {
            const idx = i * 2 + j;
            const r = rates[idx] ?? 0;
            return (
              <rect
                key={idx}
                x={i * slot + slot / 2 - barW - 2 + j * (barW + 4)}
                y={yOf(Math.max(r, 0))}
                width={barW}
                height={Math.max(r, 0) * (H - 24)}
                fill={j === 0 ? ARENA : OCRE}
              />
            );
          }),
        )}
        {groups.map((g, i) => (
          <text
            key={g.name}
            x={i * slot + slot / 2}
            y={H + 14}
            fontSize={9}
            textAnchor="middle"
            fill={tokens.chart.text}
          >
            {g.name}
          </text>
        ))}
      </svg>
      <p className="font-mono text-[11px] text-pizarra-100">
        agregado: hombres {fmt(menAgg * 100, 1)}% · mujeres {fmt(womenAgg * 100, 1)}%
        {strat &&
          ` · por departamento, mujeres: ${groups
            .map((g) => fmt(g.womenRate * 100, 0) + '%')
            .join(' / ')}`}
      </p>

      <div className="mt-2 overflow-x-auto">
        <table className="w-full border-t border-pizarra-15 font-mono text-[11px] text-tinta-100">
          <thead>
            <tr className="text-left text-pizarra-100">
              <th className="py-1 pr-2 font-normal">depto</th>
              <th className="py-1 pr-2 font-normal">H aplican → admiten</th>
              <th className="py-1 pr-2 font-normal">M aplican → admiten</th>
              <th className="py-1 font-normal">tasa H / tasa M</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => (
              <tr key={g.name} className="border-t border-pizarra-10">
                <td className="py-1 pr-2">{g.name}</td>
                <td className="py-1 pr-2">
                  {g.menApp} → {Math.round(g.menAdm)} ({fmt(g.menRate * 100, 0)}%)
                </td>
                <td className="py-1 pr-2">
                  {g.womenApp} → {Math.round(g.womenAdm)} ({fmt(g.womenRate * 100, 0)}%)
                </td>
                <td className="py-1">{fmt(g.womenRate / g.menRate, 2)}</td>
              </tr>
            ))}
            <tr className="border-t border-pizarra-30 font-semibold">
              <td className="py-1 pr-2">TOTAL</td>
              <td className="py-1 pr-2">
                {groups.reduce((s, g) => s + g.menApp, 0)} →{' '}
                {Math.round(groups.reduce((s, g) => s + g.menAdm, 0))} ({fmt(menAgg * 100, 1)}%)
              </td>
              <td className="py-1 pr-2">
                {groups.reduce((s, g) => s + g.womenApp, 0)} →{' '}
                {Math.round(groups.reduce((s, g) => s + g.womenAdm, 0))} ({fmt(womenAgg * 100, 1)}%)
              </td>
              <td className="py-1">{fmt(womenAgg / menAgg, 2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <SimLegend
        className="mt-3"
        items={[
          { color: ARENA, label: 'hombres (comparación)', mark: 'bar' },
          { color: OCRE, label: 'mujeres (foco)', mark: 'bar' },
        ]}
      />
      <SimGuide>
        Mira primero las barras apiladas: las mujeres cargan la mitad de sus aplicaciones en el
        selectivo A, los hombres en los fáciles C y D. Esa mezcla es el confusor. Alterna las dos
        vistas: en agregada ganan los hombres, por departamento ganan o empatan las mujeres. Ahora
        desliza «las mujeres aplican como los hombres» hasta el 100%: con la misma mezcla, la
        brecha agregada se disuelve sin tocar una sola tasa.
      </SimGuide>
      <p className={NOTE}>
        Berkeley 1973: 44% de admisión en hombres contra 35% en mujeres, y al desagregar la
        diferencia se desvanecía o invertía. El agregado y el estrato responden preguntas distintas;
        la paradoja es solo la sombra de mezclar las dos.
      </p>
    </div>
  );
}

/* ================================================================== */
/* 8. SpuriousCorrelationExplorer: el azar fabrica asociaciones        */
/* ================================================================== */

const SPURIOUS_PAIRS = [
  ['queso per cápita', 'doctorados en ingeniería civil'],
  ['ahogamientos en piscinas', 'películas de Nicolas Cage'],
  ['margarina per cápita', 'divorcios en Maine'],
  ['consumo de mozzarella', 'doctorados en ingeniería'],
  ['edad de Miss América', 'asesinatos con vapor'],
  ['gasto en ciencia espacial', 'suicidios por asfixia'],
  ['importaciones de pollo', 'exportaciones de crudo'],
  ['ganador de la Superbowl', 'producción de azúcar'],
];

/**
 * Correlaciones espurias fabricadas en vivo (laboratorio.md §1.4). Dos
 * caminatas aleatorias independientes correlacionan con frecuencia
 * alarmante: el estudiante genera parejas y acumula cuántas superan
 * |r| > 0.7 sin tener nada que ver. Nombres prestados del archivo de
 * Tyler Vigen.
 */
export function SpuriousCorrelationExplorer({ title }: { title?: ReactNode }) {
  const [pair, setPair] = useState(0);
  const [seed, setSeed] = useState(1);
  const [tries, setTries] = useState(0);
  const [hits, setHits] = useState(0);

  const NPTS = 30;
  const series = useMemo(() => {
    const rng = mulberry32(4242 + seed * 977 + pair * 131);
    let a = 0;
    let b = 0;
    const xs: number[] = [];
    const ys: number[] = [];
    for (let i = 0; i < NPTS; i++) {
      a += rng() - 0.5;
      b += rng() - 0.5;
      xs.push(a);
      ys.push(b);
    }
    return { xs, ys };
  }, [seed, pair]);

  const r = useMemo(() => {
    const { xs, ys } = series;
    const mx = xs.reduce((s, v) => s + v, 0) / NPTS;
    const my = ys.reduce((s, v) => s + v, 0) / NPTS;
    let cov = 0;
    let vx = 0;
    let vy = 0;
    for (let i = 0; i < NPTS; i++) {
      cov += (xs[i] - mx) * (ys[i] - my);
      vx += (xs[i] - mx) ** 2;
      vy += (ys[i] - my) ** 2;
    }
    return cov / Math.sqrt(vx * vy || 1);
  }, [series]);

  const next = () => {
    setTries((t) => t + 1);
    if (Math.abs(r) >= 0.7) setHits((h) => h + 1);
    setSeed((s) => s + 1);
    setPair((p) => (p + 1) % SPURIOUS_PAIRS.length);
  };

  /* Scatter: puntos en tinta tenue, recta de ajuste en tinta (§6.4). */
  const W = 300;
  const H = 170;
  const PAD = 26;
  const [nameA, nameB] = SPURIOUS_PAIRS[pair];
  const xsAll = series.xs;
  const ysAll = series.ys;
  const xMin = Math.min(...xsAll);
  const xMax = Math.max(...xsAll);
  const yMin = Math.min(...ysAll);
  const yMax = Math.max(...ysAll);
  const xOf = (v: number) => PAD + ((v - xMin) / (xMax - xMin || 1)) * (W - 2 * PAD);
  const yOf = (v: number) => H - PAD - ((v - yMin) / (yMax - yMin || 1)) * (H - 2 * PAD);
  const mx = xsAll.reduce((s, v) => s + v, 0) / NPTS;
  const my = ysAll.reduce((s, v) => s + v, 0) / NPTS;
  const slope =
    xsAll.reduce((s, v, i) => s + (v - mx) * (ysAll[i] - my), 0) /
    (xsAll.reduce((s, v) => s + (v - mx) ** 2, 0) || 1);
  const fitY = (x: number) => my + slope * (x - mx);

  return (
    <div className={FIG}>
      <div className={CAPTION}>{title ?? 'Correlaciones espurias: fábrica de asociaciones'}</div>

      <div className="grid gap-4 md:grid-cols-[auto_1fr]">
        <div>
          <p className="mb-2 font-mono text-[11px] text-tinta-100">
            {nameA}
            <span className="text-pizarra-100"> vs </span>
            {nameB}
          </p>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full max-w-xs"
            role="img"
            aria-label={`Dispersión entre dos series independientes, correlación ${fmt(r, 2)}`}
          >
            <title>Dos caminatas aleatorias independientes</title>
            <line x1={PAD} x2={W - PAD} y1={yOf(fitY(xMin))} y2={yOf(fitY(xMax))} stroke={TINTA} strokeWidth={1.5} />
            {xsAll.map((x, i) => (
              <circle key={i} cx={xOf(x)} cy={yOf(ysAll[i])} r={3} fill={TINTA} fillOpacity={VIZ.puntoDispersion} />
            ))}
          </svg>
          <p aria-live="polite" className="mt-1 font-mono text-sm text-tinta-100">
            r = {fmt(r, 2)}
            {Math.abs(r) >= 0.7 && <span className="ml-2 rounded bg-ocre-10 px-1.5 py-0.5">«fuerte»</span>}
          </p>
        </div>
        <div className="space-y-2 text-xs text-tinta-100">
          <p>
            Estas dos series no se conocen. Son caminatas aleatorias generadas con semillas
            independientes, y sin embargo su correlación puede salir altísima. Cada clic produce una
            pareja nueva con nombre de la vida real.
          </p>
          <button type="button" className={BTN_REVEAL} onClick={next}>
            Otra pareja del azar
          </button>
          <p className="font-mono text-[11px] text-pizarra-100">
            parejas generadas: {tries} · con |r| ≥ 0.7: {hits}
            {tries > 0 && ` (${fmt((hits / tries) * 100, 0)}%)`}
          </p>
        </div>
      </div>

      <SimLegend
        className="mt-3"
        items={[
          { color: TINTA, label: 'pares (año i de cada serie)', mark: 'dot' },
          { color: TINTA, label: 'ajuste lineal', mark: 'line' },
        ]}
      />
      <SimGuide>
        Corre veinte parejas y cuenta cuántas salen con |r| ≥ 0.7. Las caminatas aleatorias
        correlacionan porque ambas acumulan deriva: la forma parecida no necesita causa común, le
        basta azar compartido en la estructura temporal. *Cum hoc* no implica *propter hoc*.
      </SimGuide>
      <p className={NOTE}>
        El archivo de Tyler Vigen (tylervigen.com) documenta miles de estos emparejamientos reales.
        La lección no es que la correlación mienta: describe bien. Lo que miente es la historia que
        el Sistema 1 le cose encima.
      </p>
    </div>
  );
}

/* ================================================================== */
/* 9. RandomWalkChallenge: predice el final de una serie sin proceso   */
/* ================================================================== */

const RW_STEPS = 150;
const RW_SHOWN = 110;

/**
 * El reto de predicción sobre caminatas aleatorias (M5). El estudiante
 * ve los primeros 110 pasos de una caminata sin tendencia y predice el
 * valor final. Al revelar, aparecen el resto de la trayectoria real y
 * un abanico de 30 futuros alternativos con la misma semilla de paso:
 * la dispersión del cono es la verdadera respuesta, no el punto.
 *
 * Color (§6.5): trayectorias alternativas en pizarra transparente para
 * mostrar la acumulación; el futuro real en tinta; la predicción del
 * estudiante en ocre.
 */
export function RandomWalkChallenge({ title }: { title?: ReactNode }) {
  const [seed, setSeed] = useState(5);
  const [guess, setGuess] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const walk = useMemo(() => {
    const rng = mulberry32(9001 + seed * 3571);
    let v = 0;
    const pts = [0];
    for (let i = 0; i < RW_STEPS; i++) {
      v += rng() * 2 - 1;
      pts.push(v);
    }
    return pts;
  }, [seed]);

  /* 30 futuros alternativos desde el punto de corte: misma mecánica,
   * otra suerte. */
  const fan = useMemo(() => {
    const out: number[][] = [];
    for (let k = 0; k < 30; k++) {
      const rng = mulberry32(9001 + seed * 3571 + 1000 + k * 613);
      let v = walk[RW_SHOWN];
      const pts = [v];
      for (let i = RW_SHOWN + 1; i <= RW_STEPS; i++) {
        v += rng() * 2 - 1;
        pts.push(v);
      }
      out.push(pts);
    }
    return out;
  }, [walk, seed]);

  const W = 430;
  const H = 200;
  const remaining = RW_STEPS - RW_SHOWN;
  const sigma = Math.sqrt(remaining / 3); // var de U(-1,1) acumulada: n·(1/3)
  const corte = walk[RW_SHOWN];

  /* La escala se fija antes de revelar: el tramo visible más un cono
   * de ±3σ desde el corte. Con eso la zona gris cubre las predicciones
   * plausibles sin delatar hacia dónde fue el futuro real, y al
   * revelar nada se reescala: el abanico que se sale queda recortado,
   * que es justo lo que el proceso promete. */
  const yMin = Math.min(...walk.slice(0, RW_SHOWN + 1), corte - 3 * sigma);
  const yMax = Math.max(...walk.slice(0, RW_SHOWN + 1), corte + 3 * sigma);
  const PAD = { l: 40, r: 12, t: 8, b: 20 };
  const xOf = (i: number) => PAD.l + (i / RW_STEPS) * (W - PAD.l - PAD.r);
  const yOf = (v: number) => PAD.t + ((yMax - v) / (yMax - yMin || 1)) * (H - PAD.t - PAD.b);
  const vOf = (y: number) => yMax - ((y - PAD.t) / (H - PAD.t - PAD.b)) * (yMax - yMin);

  const path = (pts: number[], from = 0) =>
    pts
      .map((v, i) => `${i === 0 ? 'M' : 'L'}${rnd(xOf(from + i))},${rnd(yOf(v))}`)
      .join(' ');

  /* Ticks del eje Y: ahora sí hay escala, porque la predicción se
   * coloca sobre el gráfico, no se dicta a ciegas. */
  const ticks = useMemo(() => {
    const span = yMax - yMin;
    const step = Math.max(1, Math.round(span / 4));
    const t0 = Math.ceil(yMin / step) * step;
    const out: number[] = [];
    for (let t = t0; t <= yMax; t += step) out.push(t);
    return out;
  }, [yMin, yMax]);

  const finalReal = walk[RW_STEPS];
  const errorSig = revealed && guess !== null ? Math.abs(guess - finalReal) / sigma : null;

  /* Clic o arrastre sobre la zona gris fija la predicción: el puntero
   * se convierte en valor con la misma escala del eje. */
  const guessFromPointer = (clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.height === 0) return;
    const y = ((clientY - rect.top) / rect.height) * H;
    setGuess(Math.min(yMax, Math.max(yMin, vOf(y))));
  };

  return (
    <div className={FIG}>
      <div className={CAPTION}>{title ?? 'La caminata aleatoria: predice lo impredecible'}</div>

      <p className="mb-2 text-xs text-pizarra-100">
        Ves los primeros {RW_SHOWN} pasos de una serie. Te digo el proceso: cada paso es un sorteo
        independiente uniforme en (−1, +1). Sin tendencia, sin memoria. ¿Dónde terminará en el paso{' '}
        {RW_STEPS}?
      </p>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-lg select-none"
        role="img"
        aria-label={
          revealed
            ? `Caminata completa y abanico de futuros alternativos; el final real fue ${fmt(finalReal, 1)}`
            : `Primeros ${RW_SHOWN} pasos de una caminata aleatoria; la zona gris es clicable para colocar tu predicción`
        }
      >
        <title>Caminata aleatoria con predicción</title>
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={yOf(t)}
              y2={yOf(t)}
              stroke={tokens.chart.grid}
              strokeOpacity={t === 0 ? 1 : 0.5}
            />
            <text x={PAD.l - 5} y={yOf(t) + 3} fontSize={8} textAnchor="end" fill={tokens.chart.text} className="font-mono">
              {t}
            </text>
          </g>
        ))}
        {revealed &&
          fan.map((f, k) => (
            <path key={k} d={path(f, RW_SHOWN)} fill="none" stroke={PIZARRA} strokeOpacity={0.25} />
          ))}
        <path d={path(walk.slice(0, RW_SHOWN + 1))} fill="none" stroke={TINTA} strokeWidth={2} />
        {!revealed ? (
          <>
            <rect
              x={xOf(RW_SHOWN)}
              y={PAD.t}
              width={xOf(RW_STEPS) - xOf(RW_SHOWN)}
              height={H - PAD.t - PAD.b}
              fill={PIZARRA}
              fillOpacity={0.12}
            />
            {/* Zona interactiva: clic o arrastre coloca la predicción */}
            <rect
              x={xOf(RW_SHOWN)}
              y={PAD.t}
              width={xOf(RW_STEPS) - xOf(RW_SHOWN)}
              height={H - PAD.t - PAD.b}
              fill="transparent"
              className="cursor-crosshair"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setDragging(true);
                guessFromPointer(e.clientY);
              }}
              onPointerMove={(e) => {
                if (dragging) guessFromPointer(e.clientY);
              }}
              onPointerUp={() => setDragging(false)}
            />
            {guess !== null && (
              <>
                <line
                  x1={xOf(RW_SHOWN)}
                  x2={xOf(RW_STEPS)}
                  y1={yOf(guess)}
                  y2={yOf(guess)}
                  stroke={OCRE}
                  strokeDasharray="3 3"
                />
                <circle cx={xOf(RW_STEPS)} cy={yOf(guess)} r={5} fill={OCRE} stroke={LIENZO} strokeWidth={1.5} />
              </>
            )}
          </>
        ) : (
          <>
            <path
              d={path(walk.slice(RW_SHOWN), RW_SHOWN)}
              fill="none"
              stroke={TINTA}
              strokeWidth={2}
              strokeDasharray="1 0"
            />
            <circle cx={xOf(RW_STEPS)} cy={yOf(finalReal)} r={4.5} fill={TINTA} />
            {guess !== null && (
              <circle cx={xOf(RW_STEPS)} cy={yOf(guess)} r={4.5} fill={OCRE} />
            )}
          </>
        )}
        <text x={xOf(RW_SHOWN)} y={H - 4} fontSize={8} textAnchor="middle" fill={tokens.chart.text} className="font-mono">
          corte
        </text>
        <text x={xOf(RW_STEPS)} y={H - 4} fontSize={8} textAnchor="middle" fill={tokens.chart.text} className="font-mono">
          fin
        </text>
      </svg>

      <div className="mb-2 mt-2 flex flex-wrap items-center gap-3 font-mono text-xs">
        <label className="flex min-w-56 flex-1 items-center gap-2">
          <span className="whitespace-nowrap">tu predicción:</span>
          <input
            type="range"
            min={yMin}
            max={yMax}
            step={0.25}
            value={guess ?? corte}
            disabled={revealed}
            onChange={(e) => setGuess(Number(e.target.value))}
            className={SLIDER}
            aria-label="Tu predicción del valor final en el paso 150"
          />
          <output aria-live="polite" className="w-12 text-right">
            {guess === null ? '—' : fmt(guess, 1)}
          </output>
        </label>
        {!revealed ? (
          <button
            type="button"
            className={BTN_REVEAL}
            disabled={guess === null}
            onClick={() => setRevealed(true)}
          >
            Revelar el futuro
          </button>
        ) : (
          <button
            type="button"
            className={BTN_MAIN}
            onClick={() => {
              setSeed((s) => s + 1);
              setGuess(null);
              setRevealed(false);
            }}
          >
            Otra caminata
          </button>
        )}
        {revealed && errorSig !== null && (
          <span aria-live="polite" className="rounded bg-ocre-10 px-2 py-0.5">
            tu error: {fmt(Math.abs(guess! - finalReal), 1)} ≈ {fmt(errorSig, 1)}σ del proceso
          </span>
        )}
      </div>

      <SimLegend
        className="mt-2"
        items={[
          { color: TINTA, label: 'la caminata (pasado y futuro real)', mark: 'line' },
          { color: `${PIZARRA}`, label: 'futuros alternativos, mismo proceso', mark: 'line', dash: true },
          { color: OCRE, label: 'tu predicción', mark: 'dot' },
        ]}
      />
      <SimGuide>
        Haz clic en la zona gris o mueve el deslizador para colocar tu predicción sobre el gráfico.
        Repite el reto varias veces y mira tu error en sigmas: acertar de cerca es suerte, no
        calibración. El abanico de futuros es la única predicción honesta: un cono que se ensancha
        con la raíz del tiempo, no una línea que el ojo prolonga.
      </SimGuide>
      <p className={NOTE}>
        La varianza de una caminata crece con el número de pasos: por eso las «tendencias» largas son
        gratis. Lo que el gráfico muestra como canal, soporte o ruptura es la geometría del ruido
        acumulado, y el cono gris es todo lo que el proceso puede prometer.
      </p>
    </div>
  );
}

/* ================================================================== */
/* 10. AvailabilityLab: lo que mata de verdad contra lo que sale en    */
/*     las noticias                                                     */
/* ================================================================== */

const AVAIL_PAIRS: { a: string; b: string; aDeaths: number; bDeaths: number }[] = [
  { a: 'ataques de tiburón', b: 'enfermedades por mosquitos', aDeaths: 10, bDeaths: 725000 },
  { a: 'accidentes aéreos', b: 'caídas en el hogar', aDeaths: 400, bDeaths: 684000 },
  { a: 'terrorismo', b: 'diabetes', aDeaths: 26000, bDeaths: 1600000 },
  { a: 'homicidios', b: 'suicidios', aDeaths: 405000, bDeaths: 740000 },
  { a: 'rayos', b: 'meningitis', aDeaths: 24000, bDeaths: 250000 },
];

const fmtDeaths = (n: number) =>
  n >= 1000000 ? `${(n / 1000000).toFixed(1)} M` : n >= 1000 ? `${Math.round(n / 1000)} mil` : `${n}`;

/**
 * La heurística de disponibilidad medida (M5). Cinco parejas de causas
 * de muerte; el estudiante dice cuál mata más y luego ve las tasas
 * reales en escala logarítmica (anunciada, §6.1). El patrón que sale es
 * siempre el mismo: lo que tiene corresponsalías se sobreestima, lo
 * que no tiene prensa se subestima.
 */
export function AvailabilityLab({ title }: { title?: ReactNode }) {
  const [choices, setChoices] = useState<(0 | 1 | null)[]>(AVAIL_PAIRS.map(() => null));
  const [revealed, setRevealed] = useState(false);

  const answered = choices.filter((c) => c !== null).length;
  const score = revealed
    ? AVAIL_PAIRS.filter((p, i) => p.aDeaths > p.bDeaths ? choices[i] === 0 : choices[i] === 1).length
    : 0;

  const W = 430;
  const rowH = 34;
  const PAD = { l: 150, r: 60 };
  const maxDeaths = Math.max(...AVAIL_PAIRS.flatMap((p) => [p.aDeaths, p.bDeaths]));
  const minDeaths = 1;
  const xOf = (d: number) =>
    PAD.l +
    ((Math.log10(Math.max(d, minDeaths)) - Math.log10(minDeaths)) /
      (Math.log10(maxDeaths) - Math.log10(minDeaths))) *
      (W - PAD.l - PAD.r);

  return (
    <div className={FIG}>
      <div className={CAPTION}>{title ?? 'Disponibilidad: ¿qué mata más?'}</div>

      <p className="mb-3 text-xs text-pizarra-100">
        De cada pareja, ¿cuál causa más muertes al año en el mundo? Responde las cinco antes de ver
        las cifras.
      </p>

      <div className="space-y-2">
        {AVAIL_PAIRS.map((p, i) => (
          <div key={i} className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="w-5 font-mono text-pizarra-100" aria-hidden>
              {i + 1}.
            </span>
            {[p.a, p.b].map((label, j) => {
              const picked = choices[i] === j;
              const correct = revealed && (j === 0 ? p.aDeaths > p.bDeaths : p.bDeaths > p.aDeaths);
              return (
                <Fragment key={j}>
                  {j === 1 && <span className="px-0.5 text-pizarra-100">vs</span>}
                  <button
                    type="button"
                    disabled={revealed}
                    aria-pressed={picked}
                    onClick={() =>
                      setChoices((c) => c.map((x, k) => (k === i ? (j as 0 | 1) : x)))
                    }
                    className={
                      revealed
                        ? correct
                          ? CHIP_ON
                          : 'inline-flex items-center gap-1.5 rounded-full border border-pizarra-15 px-3 py-1 text-xs text-pizarra-100'
                        : picked
                          ? CHIP_ON
                          : CHIP
                    }
                  >
                    <span
                      className={CHIP_DOT}
                      aria-hidden
                      style={picked || (revealed && correct) ? { background: OCRE, borderColor: OCRE } : undefined}
                    />
                    {label}
                    {revealed && (
                      <span className="ml-1 font-mono text-[10px]">
                        {fmtDeaths(j === 0 ? p.aDeaths : p.bDeaths)}
                      </span>
                    )}
                  </button>
                </Fragment>
              );
            })}
          </div>
        ))}
      </div>

      {!revealed ? (
        <button
          type="button"
          className={`${BTN_REVEAL} mt-3`}
          disabled={answered < AVAIL_PAIRS.length}
          onClick={() => setRevealed(true)}
        >
          Ver las cifras reales
        </button>
      ) : (
        <>
          <p aria-live="polite" className="mt-3 text-sm text-tinta-100">
            Acertaste <strong className="font-mono">{score}/5</strong>.
            {score < 5 && (
              <span className="text-pizarra-100">
                {' '}
                Las fallas siguen el patrón de la disponibilidad: lo mediático se infla, lo silencioso
                se encoge.
              </span>
            )}
          </p>
          <svg
            viewBox={`0 0 ${W} ${AVAIL_PAIRS.length * rowH + 20}`}
            className="mt-2 w-full max-w-lg"
            role="img"
            aria-label="Muertes anuales estimadas por causa, escala logarítmica"
          >
            <title>Muertes anuales por causa (escala log)</title>
            {AVAIL_PAIRS.map((p, i) => {
              const winner = p.aDeaths > p.bDeaths ? 0 : 1;
              return (
                <g key={i}>
                  <text x={PAD.l - 6} y={i * rowH + 12} fontSize={9} textAnchor="end" fill={tokens.chart.text}>
                    {p.a}
                  </text>
                  <rect x={xOf(1)} y={i * rowH + 2} width={Math.max(xOf(p.aDeaths) - xOf(1), 1)} height={9} fill={winner === 0 ? OCRE : ARENA} />
                  <text x={PAD.l - 6} y={i * rowH + 28} fontSize={9} textAnchor="end" fill={tokens.chart.text}>
                    {p.b}
                  </text>
                  <rect x={xOf(1)} y={i * rowH + 18} width={Math.max(xOf(p.bDeaths) - xOf(1), 1)} height={9} fill={winner === 1 ? OCRE : ARENA} />
                </g>
              );
            })}
            <text x={PAD.l} y={AVAIL_PAIRS.length * rowH + 14} fontSize={8} fill={tokens.chart.text} className="font-mono">
              muertes/año, escala logarítmica: 10 → 1 M
            </text>
          </svg>
          <SimLegend
            className="mt-2"
            items={[
              { color: OCRE, label: 'la que mata más de la pareja', mark: 'bar' },
              { color: ARENA, label: 'la otra', mark: 'bar' },
            ]}
          />
          <SimGuide>
            Los mosquitos matan setenta mil veces más que los tiburones, y sin embargo el miedo al
            mar tiene película y el de la ventana abierta no. La disponibilidad no mide frecuencia:
            mide facilidad de recuerdo, y los medios deciden qué es fácil de recordar.
          </SimGuide>
          <p className={NOTE}>
            Tversky y Kahneman (1973): la gente juzga la frecuencia de una causa por lo rápido que
            vienen ejemplos a la mente. Cifras aproximadas de mortalidad global anual (OMS y
            registros de aviación), redondeadas para el ejercicio.
          </p>
        </>
      )}
    </div>
  );
}

/* ================================================================== */
/* 11. OutlierDragLab: arrastra el punto y mira quién resiste          */
/* ================================================================== */

/**
 * El outlier que arrastra a la media, literalmente (M6). Veinte tiempos
 * de entrega honestos y un paquete perdido que el estudiante puede
 * arrastrar hacia arriba. La media (línea tinta) lo sigue dócilmente;
 * la mediana (línea arena discontinua) apenas se entera. El punto es
 * accesible por teclado como slider vertical (§9.2).
 */
export function OutlierDragLab({ title }: { title?: ReactNode }) {
  const base = useMemo(() => {
    const rng = mulberry32(603);
    return Array.from({ length: 20 }, () => 48 + (rng() * 2 - 1) * 8);
  }, []);
  const [outY, setOutY] = useState(60);
  const [dragging, setDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const values = useMemo(() => [...base, outY], [base, outY]);
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  const W = 430;
  const H = 200;
  const PAD = { l: 40, r: 14, t: 10, b: 24 };
  const YMIN = 30;
  const YMAX = 220;
  const yOf = (v: number) => PAD.t + ((YMAX - v) / (YMAX - YMIN)) * (H - PAD.t - PAD.b);
  const vOf = (y: number) => YMAX - ((y - PAD.t) / (H - PAD.t - PAD.b)) * (YMAX - YMIN);
  const xAt = (i: number) => PAD.l + (i / (base.length - 1)) * (W - PAD.l - PAD.r - 46);
  const OUT_X = W - PAD.r - 30;

  const onMove = (e: React.PointerEvent) => {
    if (!dragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * H;
    setOutY(Math.min(YMAX, Math.max(YMIN, vOf(y))));
  };

  return (
    <div className={FIG}>
      <div className={CAPTION}>{title ?? 'Arrastra el paquete perdido'}</div>

      <p className="mb-2 text-xs text-pizarra-100">
        Veinte entregas normales alrededor de 48 horas y un paquete problemático que puedes subir
        con el dedo, el ratón o las flechas del teclado. Mira quién se inmuta y quién no.
      </p>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-lg touch-none"
        role="img"
        aria-label={`Dispersión de tiempos de entrega. Media ${fmt(mean, 1)} horas, mediana ${fmt(median, 1)} horas`}
        onPointerMove={onMove}
        onPointerUp={() => setDragging(false)}
        onPointerLeave={() => setDragging(false)}
      >
        <title>Media vs mediana con un outlier arrastrable</title>
        {[40, 60, 80, 100, 120, 140, 160, 180, 200].map((v) => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={yOf(v)} y2={yOf(v)} stroke={tokens.chart.grid} />
            <text x={PAD.l - 4} y={yOf(v) + 3} fontSize={8} textAnchor="end" fill={tokens.chart.text} className="font-mono">
              {v}
            </text>
          </g>
        ))}
        {/* media: línea tinta sólida; mediana: arena discontinua */}
        <line x1={PAD.l} x2={W - PAD.r} y1={yOf(mean)} y2={yOf(mean)} stroke={TINTA} strokeWidth={2} />
        <line x1={PAD.l} x2={W - PAD.r} y1={yOf(median)} y2={yOf(median)} stroke={ARENA} strokeWidth={2} strokeDasharray="6 3" />
        {base.map((v, i) => (
          <circle key={i} cx={xAt(i)} cy={yOf(v)} r={4} fill={PIZARRA} fillOpacity={0.8} />
        ))}
        {/* El paquete perdido: foco ocre, arrastrable y accesible por teclado */}
        <circle
          cx={OUT_X}
          cy={yOf(outY)}
          r={7}
          fill={OCRE}
          stroke={TINTA}
          strokeWidth={dragging ? 2 : 0.8}
          style={{ cursor: 'ns-resize' }}
          tabIndex={0}
          role="slider"
          aria-label="Tiempo del paquete perdido, en horas"
          aria-valuemin={YMIN}
          aria-valuemax={YMAX}
          aria-valuenow={Math.round(outY)}
          aria-valuetext={`${Math.round(outY)} horas`}
          onPointerDown={(e) => {
            setDragging(true);
            (e.target as Element).setPointerCapture?.(e.pointerId);
          }}
          onKeyDown={(e) => {
            const d = e.key === 'ArrowUp' ? 5 : e.key === 'ArrowDown' ? -5 : 0;
            if (d) {
              e.preventDefault();
              setOutY((v) => Math.min(YMAX, Math.max(YMIN, v + d)));
            }
          }}
        />
      </svg>

      <div className="mt-1 flex flex-wrap gap-x-5 font-mono text-[11px] text-tinta-100" aria-live="polite">
        <span>paquete: {fmt(outY, 0)} h</span>
        <span>
          media: {fmt(mean, 1)} h
          <span className="text-pizarra-100"> (+{fmt(mean - 48, 1)})</span>
        </span>
        <span>
          mediana: {fmt(median, 1)} h<span className="text-pizarra-100"> (+{fmt(median - 48, 1)})</span>
        </span>
      </div>

      <SimLegend
        className="mt-2"
        items={[
          { color: OCRE, label: 'el paquete perdido (arrástralo)', mark: 'dot' },
          { color: PIZARRA, label: 'entregas normales', mark: 'dot' },
          { color: TINTA, label: 'media', mark: 'line' },
          { color: ARENA, label: 'mediana', mark: 'line', dash: true },
        ]}
      />
      <SimGuide>
        Lleva el punto a 200 horas: la media sube más de siete y la mediana se mueve menos de una.
        La media tiene punto de quiebre cero: un dato basta para llevarla a cualquier parte. La
        mediana necesita que la mitad de los datos esté corrupta antes de rendirse.
      </SimGuide>
      <p className={NOTE}>
        En colas pesadas, el outlier no es un error a depurar: es la observación con más decisión
        encima. Borrarlo para que la media «se vea bien» es destruir justo el dato que importaba.
      </p>
    </div>
  );
}

/* ================================================================== */
/* 12. RankVsTExplorer: la prueba t contra los rangos con cola pesada  */
/* ================================================================== */

/**
 * La comparación prometida: potencia de la prueba t de Welch contra el
 * test de rangos de Wilcoxon (Mann-Whitney) cuando la distribución se
 * ensucia. El slider de cola aumenta la fracción de observaciones
 * extremas; con datos limpios la t gana por poco, con cola pesada se
 * desploma mientras los rangos aguantan. 400 réplicas deterministas.
 */
export function RankVsTExplorer({ title }: { title?: ReactNode }) {
  const [tail, setTail] = useState(0);

  const REPS = 400;
  const N = 12;
  const SHIFT = 0.9;

  const gauss = (rng: () => number) => {
    const u = Math.max(rng(), 1e-9);
    const v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const { powerT, powerW } = useMemo(() => {
    let hitT = 0;
    let hitW = 0;
    const rng = mulberry32(808 + Math.round(tail * 1000) * 77);
    for (let rep = 0; rep < REPS; rep++) {
      const a = Array.from({ length: N }, () => gauss(rng));
      const b = Array.from({ length: N }, () =>
        rng() < tail ? SHIFT + 9 * (0.5 + gauss(rng)) : SHIFT + gauss(rng),
      );
      /* Welch t */
      const ma = a.reduce((s, v) => s + v, 0) / N;
      const mb = b.reduce((s, v) => s + v, 0) / N;
      const va = a.reduce((s, v) => s + (v - ma) ** 2, 0) / (N - 1);
      const vb = b.reduce((s, v) => s + (v - mb) ** 2, 0) / (N - 1);
      const t = (mb - ma) / Math.sqrt(va / N + vb / N || 1e-9);
      if (Math.abs(t) > 1.96) hitT++;
      /* Wilcoxon rank-sum sobre B */
      const pooled = [...a.map((v) => ({ v, g: 0 })), ...b.map((v) => ({ v, g: 1 }))].sort(
        (x, y) => x.v - y.v,
      );
      let rb = 0;
      pooled.forEach((p, i) => {
        if (p.g === 1) rb += i + 1;
      });
      const u = N * N + (N * (N + 1)) / 2 - rb;
      const z = Math.abs(u - (N * N) / 2 - 0.5) / Math.sqrt((N * N * (2 * N + 1)) / 12);
      if (z > 1.96) hitW++;
    }
    return { powerT: hitT / REPS, powerW: hitW / REPS };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tail]);

  const W = 300;
  const BAR = 130;
  const power = [
    { label: 't de Welch', v: powerT, color: TINTA },
    { label: 'rangos (Wilcoxon)', v: powerW, color: OCRE },
  ];

  return (
    <div className={FIG}>
      <div className={CAPTION}>{title ?? 'Prueba t contra rangos: el slider de la cola'}</div>

      <div className="grid gap-4 md:grid-cols-[auto_1fr]">
        <div className="space-y-2 text-xs">
          <label className="block font-mono text-tinta-100">
            cola pesada: {Math.round(tail * 100)}% de datos extremos
            <input
              type="range"
              min={0}
              max={0.4}
              step={0.02}
              value={tail}
              onChange={(e) => setTail(Number(e.target.value))}
              className={SLIDER}
              aria-label="Fracción de datos contaminados con valores extremos"
            />
          </label>
          <p className="text-pizarra-100">
            {REPS} réplicas por nivel · dos grupos de {N}, B corre +{fmt(SHIFT, 1)}
          </p>
          <svg viewBox={`0 0 ${W} 110`} className="w-full max-w-xs" role="img" aria-label={`Potencia: t ${fmt(powerT * 100, 0)}%, rangos ${fmt(powerW * 100, 0)}%`}>
            <title>Potencia de cada prueba</title>
            {power.map((p, i) => (
              <g key={p.label}>
                <text x={0} y={i * 44 + 10} fontSize={9} fill={tokens.chart.text}>
                  {p.label}
                </text>
                <rect x={0} y={i * 44 + 15} width={p.v * BAR} height={16} fill={p.color} rx={2} />
                <text x={p.v * BAR + 6} y={i * 44 + 27} fontSize={10} fill={tokens.chart.text} className="font-mono">
                  {fmt(p.v * 100, 0)}%
                </text>
              </g>
            ))}
            <text x={0} y={104} fontSize={8} fill={tokens.chart.text}>
              % de réplicas que detectan la diferencia (p &lt; 0.05)
            </text>
          </svg>
        </div>
        <div className="space-y-2 text-xs text-tinta-100">
          <p>
            Con datos limpios (cola 0%), la prueba t es la herramienta correcta y gana por poco. Sube
            el slider: a medida que entran observaciones extremas, la t deja de ver la diferencia
            real porque la varianza se infla. Los rangos no miran magnitudes, solo el orden, y el
            orden sobrevive a la contaminación.
          </p>
        </div>
      </div>

      <SimLegend
        className="mt-2"
        items={[
          { color: TINTA, label: 'prueba t (paramétrica)', mark: 'bar' },
          { color: OCRE, label: 'rangos (robusta)', mark: 'bar' },
        ]}
      />
      <SimGuide>
        Empuja la cola hasta 40%: la potencia de la t cae hacia el azar mientras la de rangos se
        mantiene. La lección no es que la t sea mala sino que sus supuestos son frágiles; cuando la
        cola pesa, el orden de los datos dice más que su distancia a la media.
      </SimGuide>
      <p className={NOTE}>
        Wilcoxon/Mann-Whitney reemplaza cada valor por su rango en el conjunto: un outlier enorme
        solo cuenta como «el más grande», no como «el más grande por mil». La robustez es eso:
        pagar un poco de potencia en el mundo limpio para no quebrar en el mundo real.
      </p>
    </div>
  );
}

/* ================================================================== */
/* 13. BayesianUpdater: la creencia que se mueve con cada dato        */
/* ================================================================== */

/** Log-gamma por Lanczos (g = 7): basta para densidades Beta del lab. */
function lgamma(z: number): number {
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
  z -= 1;
  let x = c[0];
  for (let i = 1; i < 9; i++) x += c[i] / (z + i);
  const t = z + 7.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

const dbeta = (x: number, a: number, b: number) =>
  x <= 0 || x >= 1 ? 0 : Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - (lgamma(a) + lgamma(b) - lgamma(a + b)));

const PRIORS = [
  { key: 'esceptica', label: 'escéptica Beta(2, 8)', a: 2, b: 8 },
  { key: 'uniforme', label: 'uniforme Beta(1, 1)', a: 1, b: 1 },
  { key: 'entusiasta', label: 'entusiasta Beta(8, 2)', a: 8, b: 2 },
] as const;
type PriorKey = (typeof PRIORS)[number]['key'];

/**
 * El actualizador bayesiano en vivo (M7). Prior Beta a elegir — la
 * escéptica cree la moneda cargada a cruz, la entusiasta a cara — y
 * lanzamientos de una moneda con p real oculta. Cada observación suma
 * al conteo y la posterior entera se desplaza y se estrecha.
 *
 * Color (§6.3): prior en arena discontinua, posterior en ocre sólida;
 * el intervalo creíble del 90% es la banda ocre al 10%.
 */
export function BayesianUpdater({ title }: { title?: ReactNode }) {
  const [priorKey, setPriorKey] = useState<PriorKey>('uniforme');
  const [seen, setSeen] = useState(0); // lanzamientos observados
  const TRUE_P = 0.62;
  const MAXN = 120;

  /* Secuencia de lanzamientos determinista con p real fija. */
  const flips = useMemo<number[]>(() => {
    const rng = mulberry32(777001);
    return Array.from({ length: MAXN }, () => (rng() < TRUE_P ? 1 : 0));
  }, []);

  const prior = PRIORS.find((p) => p.key === priorKey)!;
  const heads = flips.slice(0, seen).reduce((s, v) => s + v, 0);
  const tails = seen - heads;
  const a = prior.a + heads;
  const b = prior.b + tails;
  const postMean = a / (a + b);

  /* IC 90% por cuadratura sobre la cuadrícula de densidad. */
  const XS = Array.from({ length: 121 }, (_, i) => i / 120);
  const dens = XS.map((x) => dbeta(x, a, b));
  const total = dens.reduce((s, v) => s + v, 0);
  let acc = 0;
  let q05 = 0;
  let q95 = 1;
  for (let i = 0; i < XS.length; i++) {
    acc += dens[i];
    if (acc / total >= 0.05 && q05 === 0) q05 = XS[i];
    if (acc / total >= 0.95) {
      q95 = XS[i];
      break;
    }
  }

  const W = 430;
  const H = 170;
  const PAD = { l: 30, r: 10, t: 8, b: 20 };
  const DMAX = 12;
  const xOf = (v: number) => PAD.l + v * (W - PAD.l - PAD.r);
  const yOf = (d: number) => PAD.t + (1 - Math.min(d / DMAX, 1)) * (H - PAD.t - PAD.b);
  const curveOf = (aa: number, bb: number) =>
    XS.map((x, i) => `${i === 0 ? 'M' : 'L'}${rnd(xOf(x))},${rnd(yOf(dbeta(x, aa, bb)))}`).join(' ');
  const bandPath = (() => {
    const i0 = Math.round(q05 * 120);
    const i1 = Math.round(q95 * 120);
    const top = XS.slice(i0, i1 + 1).map((x, i) => `${i === 0 ? 'M' : 'L'}${rnd(xOf(x))},${rnd(yOf(dbeta(x, a, b)))}`).join(' ');
    return `${top} L${rnd(xOf(XS[i1]))},${rnd(yOf(0))} L${rnd(xOf(XS[i0]))},${rnd(yOf(0))} Z`;
  })();

  const add = (k: number) => setSeen((s) => Math.min(MAXN, s + k));

  return (
    <div className={FIG}>
      <div className={CAPTION}>{title ?? 'El actualizador: prior + datos = posterior'}</div>

      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-pizarra-100">tu prior:</span>
        {PRIORS.map((p) => (
          <button
            key={p.key}
            type="button"
            aria-pressed={priorKey === p.key}
            onClick={() => {
              setPriorKey(p.key);
              setSeen(0);
            }}
            className={priorKey === p.key ? CHIP_ON : CHIP}
          >
            <span
              className={CHIP_DOT}
              aria-hidden
              style={priorKey === p.key ? { background: OCRE, borderColor: OCRE } : undefined}
            />
            {p.label}
          </button>
        ))}
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <button type="button" className={BTN_MAIN} onClick={() => add(1)} disabled={seen >= MAXN}>
          +1 lanzamiento
        </button>
        <button type="button" className={BTN_MAIN} onClick={() => add(10)} disabled={seen >= MAXN}>
          +10
        </button>
        <button type="button" className={BTN_MAIN} onClick={() => add(40)} disabled={seen >= MAXN}>
          +40
        </button>
        <span className="font-mono text-[11px] text-tinta-100" aria-live="polite">
          n = {seen} · caras {heads} / cruces {tails} · Beta({a}, {b}) · media {fmt(postMean, 3)}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full max-w-lg"
          role="img"
          aria-label={`Posterior Beta(${a}, ${b}) con media ${fmt(postMean, 2)}; la prior era ${prior.label}`}
        >
          <title>Prior y posterior sobre p</title>
          <path d={bandPath} fill={OCRE} fillOpacity={0.1} />
          <path d={curveOf(prior.a, prior.b)} fill="none" stroke={ARENA} strokeWidth={1.8} strokeDasharray="6 3" />
          <path d={curveOf(a, b)} fill="none" stroke={OCRE} strokeWidth={2.4} />
          <line x1={xOf(TRUE_P)} x2={xOf(TRUE_P)} y1={PAD.t} y2={H - PAD.b} stroke={PIZARRA} strokeDasharray="3 3" />
          <text x={xOf(TRUE_P) + 4} y={PAD.t + 9} fontSize={8} textAnchor="start" fill={tokens.chart.text} className="font-mono">
            p real
          </text>
          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <text key={v} x={xOf(v)} y={H - 6} fontSize={8} textAnchor="middle" fill={tokens.chart.text} className="font-mono">
              {v}
            </text>
          ))}
        </svg>
        <div className="space-y-1 font-mono text-[11px] text-tinta-100">
          <p>intervalo de credibilidad 90%: [{fmt(q05, 2)}, {fmt(q95, 2)}]</p>
          <p className="text-pizarra-100">
            últimos lanzamientos:{' '}
            {flips.slice(Math.max(0, seen - 15), seen).map((f, i) => (
              <span key={i} className={f ? 'font-semibold text-tinta-100' : 'text-pizarra-100'}>
                {f ? 'C' : '·'}
              </span>
            ))}
          </p>
        </div>
      </div>

      <SimLegend
        className="mt-2"
        items={[
          { color: ARENA, label: `prior ${prior.label}`, mark: 'line', dash: true },
          { color: OCRE, label: `posterior Beta(${a}, ${b})`, mark: 'line' },
          { color: PIZARRA, label: 'p real (oculta para el modelo)', mark: 'line', dash: true },
        ]}
      />
      <SimGuide>
        Empieza con la prior escéptica y dale datos de a poco: la posterior cruza el país entero
        hasta el p real. Ahora prueba la entusiasta con la misma secuencia: llega al mismo lugar por
        otro camino. Los datos ganan a las priors cuando hay suficientes, y el intervalo de credibilidad
        se estrecha al ritmo de √n.
      </SimGuide>
      <p className={NOTE}>
        Conjugación Beta-Binomial: cada cara suma a α, cada cruz a β. La posterior no es un número
        sino una distribución completa que se desplaza y se afila; la creencia honesta tiene forma,
        no solo veredicto.
      </p>
    </div>
  );
}

/* ================================================================== */
/* 14. LindleyExplorer: el dato que los dos paradigmas leen distinto   */
/* ================================================================== */

/**
 * La paradoja de Lindley (1957) hecha slider. Se fija la evidencia en
 * el borde del rechazo frecuentista (z ajustable, n deslizable en log)
 * y se compara lo que dice cada paradigma: el valor p contra la
 * probabilidad posterior de H0 con una previa N(0, τ).
 *
 * A z = 1.96 fijo, el p-valor no se mueve con n. La posterior de H0
 * crece hasta el 99%: el mismo dato, dos lecturas honestas opuestas.
 */
export function LindleyExplorer({ title }: { title?: ReactNode }) {
  const [logN, setLogN] = useState(3); // n = 10^logN
  const [z, setZ] = useState(1.96);
  const [tau, setTau] = useState(1);

  const n = Math.round(Math.pow(10, logN));
  const pval = 2 * (1 - Phi(z));

  /* Factor de Bayes B01 para H0: θ=0 vs θ~N(0,τ²), observado z. */
  const w = (n * tau * tau) / (1 + n * tau * tau);
  const bf01 = Math.sqrt(1 + n * tau * tau) * Math.exp((-z * z * w) / 2);
  const postH0 = bf01 / (1 + bf01); // con odds previas 1:1

  const W = 300;
  const gauges = [
    { label: 'p-valor (frecuentista)', v: pval, color: TINTA, note: pval < 0.05 ? 'rechaza H0' : 'no rechaza' },
    { label: 'P(H0 | datos) (bayesiano)', v: postH0, color: OCRE, note: postH0 > 0.5 ? 'a favor de H0' : 'en contra' },
  ];

  return (
    <div className={FIG}>
      <div className={CAPTION}>{title ?? 'La paradoja de Lindley: un dato, dos veredictos'}</div>

      <div className="grid gap-4 md:grid-cols-[auto_1fr]">
        <div className="space-y-2 text-[11px]">
          <label className="block font-mono text-tinta-100">
            n = {n.toLocaleString('es')} (escala log)
            <input
              type="range"
              min={2}
              max={6}
              step={0.1}
              value={logN}
              onChange={(e) => setLogN(Number(e.target.value))}
              className={SLIDER}
              aria-label="Tamaño muestral en escala logarítmica"
            />
          </label>
          <label className="block font-mono text-tinta-100">
            evidencia z = {fmt(z, 2)}
            <input
              type="range"
              min={1}
              max={3.5}
              step={0.01}
              value={z}
              onChange={(e) => setZ(Number(e.target.value))}
              className={SLIDER}
              aria-label="Estadístico z observado"
            />
          </label>
          <label className="block font-mono text-tinta-100">
            dispersión de la prior τ = {fmt(tau, 1)}
            <input
              type="range"
              min={0.2}
              max={5}
              step={0.1}
              value={tau}
              onChange={(e) => setTau(Number(e.target.value))}
              className={SLIDER}
              aria-label="Desviación de la previa sobre theta"
            />
          </label>
          <svg viewBox={`0 0 ${W} 90`} className="w-full max-w-xs" role="img" aria-label={`p-valor ${fmt(pval, 3)} y posterior de H0 ${fmt(postH0 * 100, 0)}%`}>
            <title>Los dos paradigmas sobre el mismo dato</title>
            {gauges.map((g, i) => (
              <g key={g.label}>
                <rect x={0} y={i * 36 + 10} width={g.v * 220} height={18} fill={g.color} rx={2} />
                <text x={g.v * 220 + 6} y={i * 36 + 23} fontSize={9} fill={tokens.chart.text} className="font-mono">
                  {fmt(g.v * 100, g.v < 0.1 ? 1 : 0)}% · {g.note}
                </text>
                <text x={0} y={i * 36 + 4} fontSize={9} fill={tokens.chart.text}>
                  {g.label}
                </text>
              </g>
            ))}
            <line x1={0.05 * 220} x2={0.05 * 220} y1={8} y2={30} stroke={PIZARRA} strokeDasharray="3 3" />
          </svg>
        </div>
        <div className="space-y-2 text-xs text-tinta-100">
          <p>
            Fija z en 1.96 y desliza n hacia un millón. El p-valor se queda clavado en 0.05 y el
            frecuentista sigue rechazando. La posterior de H0, con una previa honesta, sube hasta
            regalarte la nula. Mismo experimento, misma evidencia, veredictos opuestos.
          </p>
          <p className="text-pizarra-100">
            El p-valor pregunta «¿qué tan raro es el dato si H0 es cierta?». Bayes pregunta «¿qué
            hipótesis explica mejor el dato?». Con n enorme, una desviación de 2σ es más compatible
            con fluctuación de una nula cierta que con una alternativa difusa.
          </p>
        </div>
      </div>

      <SimLegend
        className="mt-2"
        items={[
          { color: TINTA, label: 'veredicto frecuentista', mark: 'bar' },
          { color: OCRE, label: 'veredicto bayesiano', mark: 'bar' },
          { color: PIZARRA, label: 'umbral p = 0.05', mark: 'line', dash: true },
        ]}
      />
      <SimGuide>
        Lleva n al máximo con z = 1.96 y τ amplia: la contradicción es total. Sube z a 3 y los dos
        vuelven a coincidir. La paradoja vive exactamente en la franja «significativo pero débil»,
        que es donde trabajan la mayoría de los papers.
      </SimGuide>
      <p className={NOTE}>
        Lindley (1957). El choque no es defecto de ninguno de los dos: el valor p evalúa el dato
        contra una sola hipótesis y la posterior compara dos. Son preguntas distintas con el mismo
        experimento.
      </p>
    </div>
  );
}

/** Φ de la normal estándar (aprox. de Abramowitz–Stegun). */
function Phi(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

const dnorm = (x: number, mu: number, sd: number) =>
  Math.exp(-((x - mu) * (x - mu)) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI));

/* ================================================================== */
/* 15. AlgorithmicBiasLab: el umbral común que no es común            */
/* ================================================================== */

/**
 * La falacia de tasa base con nómina de servidores (M8). Dos grupos
 * comparten el mismo clasificador — mismas distribuciones de score,
 * mismo umbral — pero difieren en la prevalencia del desenlace. Las
 * métricas de error divergen sin que ninguna línea de código mire la
 * variable protegida.
 *
 * Las curvas se dibujan escaladas por la prevalencia de cada grupo:
 * el umbral común en tinta, los negativos en pizarra y los positivos
 * en ocre (la población marcada como «riesgo»).
 */
export function AlgorithmicBiasLab({ title }: { title?: ReactNode }) {
  const [prevB, setPrevB] = useState(0.1);
  const [thr, setThr] = useState(1);
  const PREV_A = 0.5;
  const D = 1.6; // separación entre distribuciones (capacidad del modelo)

  const metrics = (prev: number) => {
    const fpr = 1 - Phi(thr); // FP entre los que no tienen el desenlace
    const tpr = 1 - Phi(thr - D);
    const ppv = (tpr * prev) / (tpr * prev + fpr * (1 - prev));
    return { prev, fpr, fnr: 1 - tpr, ppv };
  };
  const A = metrics(PREV_A);
  const B = metrics(prevB);

  const W = 280;
  const H = 130;
  const PAD = { l: 24, r: 8, t: 8, b: 16 };
  const X0 = -1.2;
  const X1 = 4.2;
  const xOf = (v: number) => PAD.l + ((v - X0) / (X1 - X0)) * (W - PAD.l - PAD.r);
  const XS = Array.from({ length: 101 }, (_, i) => X0 + (i / 100) * (X1 - X0));

  const panel = (prev: number, label: string) => {
    const dmax = Math.max(dnorm(0, 0, 1) * (1 - prev), dnorm(D, D, 1) * prev);
    const yOf = (d: number) => PAD.t + (1 - d / dmax) * (H - PAD.t - PAD.b);
    const neg = XS.map((x, i) => `${i === 0 ? 'M' : 'L'}${rnd(xOf(x))},${rnd(yOf(dnorm(x, 0, 1) * (1 - prev)))}`).join(' ');
    const pos = XS.map((x, i) => `${i === 0 ? 'M' : 'L'}${rnd(xOf(x))},${rnd(yOf(dnorm(x, D, 1) * prev))}`).join(' ');
    const posFill = `${pos} L${rnd(xOf(X1))},${rnd(yOf(0))} L${rnd(xOf(X0))},${rnd(yOf(0))} Z`;
    return (
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`${label}: prevalencia ${fmt(prev * 100, 0)}%, score de positivos y negativos con umbral en ${fmt(thr, 2)}`}
      >
        <title>{label}</title>
        <path d={posFill} fill={OCRE} fillOpacity={0.18} />
        <path d={neg} fill="none" stroke={PIZARRA} strokeWidth={1.6} />
        <path d={pos} fill="none" stroke={OCRE} strokeWidth={1.8} />
        <line x1={xOf(thr)} x2={xOf(thr)} y1={PAD.t} y2={H - PAD.b} stroke={TINTA} strokeWidth={1.4} />
        <text x={xOf(thr) + 3} y={H - PAD.b + 11} fontSize={8} textAnchor="start" fill={tokens.chart.text} className="font-mono">
          umbral
        </text>
      </svg>
    );
  };

  const rows = [
    { label: 'prevalencia', a: fmt(A.prev * 100, 0) + '%', b: fmt(B.prev * 100, 0) + '%' },
    { label: 'tasa de falsos positivos', a: fmt(A.fpr * 100, 1) + '%', b: fmt(B.fpr * 100, 1) + '%' },
    { label: 'tasa de falsos negativos', a: fmt(A.fnr * 100, 1) + '%', b: fmt(B.fnr * 100, 1) + '%' },
    { label: 'valor predictivo positivo', a: fmt(A.ppv * 100, 0) + '%', b: fmt(B.ppv * 100, 0) + '%', warn: true },
  ];

  return (
    <div className={FIG}>
      <div className={CAPTION}>{title ?? 'El mismo modelo, dos grupos, errores distintos'}</div>

      <div className="mb-2 flex flex-wrap items-center gap-4 text-[11px]">
        <label className="font-mono text-tinta-100">
          prevalencia grupo B = {fmt(prevB * 100, 0)}%
          <input
            type="range"
            min={0.05}
            max={0.5}
            step={0.01}
            value={prevB}
            onChange={(e) => setPrevB(Number(e.target.value))}
            className={SLIDER}
            aria-label="Prevalencia del desenlace en el grupo B"
          />
        </label>
        <label className="font-mono text-tinta-100">
          umbral de decisión = {fmt(thr, 2)}
          <input
            type="range"
            min={-0.5}
            max={3.5}
            step={0.05}
            value={thr}
            onChange={(e) => setThr(Number(e.target.value))}
            className={SLIDER}
            aria-label="Umbral del clasificador"
          />
        </label>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {[
          { prev: PREV_A, label: 'grupo A · prevalencia 50%' },
          { prev: prevB, label: `grupo B · prevalencia ${fmt(prevB * 100, 0)}%` },
        ].map(({ prev, label }) => (
          <figure key={label} className="m-0">
            <figcaption className="mb-0.5 text-[11px] font-medium text-tinta-100">{label}</figcaption>
            {panel(prev, label)}
          </figure>
        ))}
      </div>

      <table className="mt-3 w-full max-w-md font-mono text-[11px] text-tinta-100">
        <thead>
          <tr className="border-b border-pizarra-30 text-left text-pizarra-100">
            <th className="py-0.5 pr-2 font-normal">métrica</th>
            <th className="pr-2 font-normal">grupo A</th>
            <th className="font-normal">grupo B</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-pizarra-15">
              <td className="py-0.5 pr-2 text-pizarra-100">{r.label}</td>
              <td className="pr-2">{r.a}</td>
              <td className={r.warn ? 'font-semibold text-tinta-100 underline decoration-ocre-100 decoration-2 underline-offset-2' : ''}>{r.b}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SimLegend
        className="mt-2"
        items={[
          { color: PIZARRA, label: 'score de quienes NO tienen el desenlace', mark: 'line' },
          { color: OCRE, label: 'score de quienes SÍ lo tienen', mark: 'line' },
          { color: TINTA, label: 'umbral único de decisión', mark: 'line' },
        ]}
      />
      <SimGuide>
        Baja la prevalencia de B al 5% y mira el VPP: con el mismo umbral, un marcado del grupo A
        tiene riesgo real alto y uno del B, bajo. Ahora intenta «arreglarlo» moviendo el umbral:
        puedes igualar una métrica, nunca todas. La imposibilidad de Barocas–Hardt–Narayanan, en
        primera persona.
      </SimGuide>
      <p className={NOTE}>
        El clasificador no usa la variable protegida; no le hace falta. Las FPR son iguales porque
        los negativos se distribuyen igual, pero el VPP y el costo por persona marcada divergen con
        la tasa base. Es la falacia de tasa base de M2, ejecutada millones de veces por segundo.
      </p>
    </div>
  );
}

/* ================================================================== */
/* 16. NoisyJudgeSim: diez jueces y diez versiones del algoritmo      */
/* ================================================================== */

/**
 * El ruido de *Noise* en comparación directa. Diez jueces humanos
 * puntúan el mismo caso con dispersión σ_h; diez versiones del «mismo»
 * modelo — distinta semilla, distinto pipeline, mismo paper — lo
 * puntúan con dispersión σ_a. La promesa algorítmica es σ_a = 0; la
 * realidad auditable es un ruido distinto, peor documentado.
 *
 * Jueces en pizarra (el contexto que se audita), versiones del modelo
 * en ocre (el foco de la revelación: también se dispersan).
 */
export function NoisyJudgeSim({ title }: { title?: ReactNode }) {
  const [sh, setSh] = useState(15);
  const [sa, setSa] = useState(4);
  const MERIT = 70;
  const VERDICT = 60;

  const draws = useMemo(() => {
    const rh = mulberry32(808001);
    const ra = mulberry32(808002);
    const g = (r: () => number) => (r() + r() + r() - 1.5) * 4; // ~N(0,1) tosca
    return {
      judges: Array.from({ length: 10 }, () => g(rh)),
      algos: Array.from({ length: 10 }, () => g(ra)),
    };
  }, []);

  const judges = draws.judges.map((z) => MERIT + z * sh);
  const algos = draws.algos.map((z) => MERIT + z * sa);
  const spread = (v: number[]) => Math.max(...v) - Math.min(...v);
  const disagree = (v: number[]) => new Set(v.map((x) => (x >= VERDICT ? 1 : 0))).size > 1;

  const W = 420;
  const H = 110;
  const PAD = { l: 58, r: 10, t: 14, b: 18 };
  const xOf = (v: number) => PAD.l + ((v - 20) / 100) * (W - PAD.l - PAD.r);
  const lane = (vals: number[], y: number, color: string, label: string) => (
    <g>
      {vals.map((v, i) => (
        <circle key={i} cx={rnd(xOf(v))} cy={y} r={4.5} fill={color} fillOpacity={0.75} />
      ))}
      <text x={PAD.l - 4} y={y + 3} fontSize={9} textAnchor="end" fill={tokens.chart.text}>
        {label}
      </text>
    </g>
  );

  return (
    <div className={FIG}>
      <div className={CAPTION}>{title ?? 'Diez jueces y diez versiones del mismo modelo'}</div>

      <div className="mb-2 flex flex-wrap items-center gap-4 text-[11px]">
        <label className="font-mono text-tinta-100">
          ruido humano σ_h = {fmt(sh, 0)}
          <input
            type="range"
            min={2}
            max={25}
            step={1}
            value={sh}
            onChange={(e) => setSh(Number(e.target.value))}
            className={SLIDER}
            aria-label="Dispersión entre jueces humanos"
          />
        </label>
        <label className="font-mono text-tinta-100">
          ruido del pipeline σ_a = {fmt(sa, 0)}
          <input
            type="range"
            min={0}
            max={15}
            step={0.5}
            value={sa}
            onChange={(e) => setSa(Number(e.target.value))}
            className={SLIDER}
            aria-label="Dispersión entre versiones del algoritmo"
          />
        </label>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-lg"
        role="img"
        aria-label={`Diez jueces se dispersan ${fmt(spread(judges), 0)} puntos; diez versiones del modelo, ${fmt(spread(algos), 0)}`}
      >
        <title>El mismo caso, veinte puntajes</title>
        <line x1={xOf(VERDICT)} x2={xOf(VERDICT)} y1={PAD.t - 6} y2={H - PAD.b} stroke={TINTA} strokeDasharray="4 3" />
        <text x={xOf(VERDICT)} y={PAD.t - 1} fontSize={8} textAnchor="middle" fill={tokens.chart.text} className="font-mono">
          umbral de decisión
        </text>
        <line x1={xOf(MERIT)} x2={xOf(MERIT)} y1={PAD.t} y2={H - PAD.b} stroke={PIZARRA} strokeOpacity={0.4} />
        {lane(judges, 42, PIZARRA, 'jueces')}
        {lane(algos, 76, OCRE, 'modelo')}
        {[40, 60, 80, 100].map((v) => (
          <text key={v} x={xOf(v)} y={H - 4} fontSize={8} textAnchor="middle" fill={tokens.chart.text} className="font-mono">
            {v}
          </text>
        ))}
      </svg>

      <div className="mt-1 font-mono text-[11px] text-tinta-100" aria-live="polite">
        rango entre jueces: {fmt(spread(judges), 0)} pts {disagree(judges) ? '· discrepan en el veredicto' : '· mismo veredicto'}
        {'  |  '}
        rango entre versiones del modelo: {fmt(spread(algos), 0)} pts {disagree(algos) ? '· discrepan en el veredicto' : '· mismo veredicto'}
      </div>

      <SimLegend
        className="mt-2"
        items={[
          { color: PIZARRA, label: '10 jueces humanos, mismo caso', mark: 'dot' },
          { color: OCRE, label: '10 versiones del modelo (semilla/pipeline distintos)', mark: 'dot' },
          { color: TINTA, label: 'umbral que convierte puntaje en decisión', mark: 'line', dash: true },
        ]}
      />
      <SimGuide>
        Lleva σ_a a cero: la promesa algorítmica cumplida, una sola respuesta, siempre. Ahora súbelo
        a 6 — lo que observan los estudios de replicación de pipelines — y aparecen puntos a ambos
        lados del umbral: el mismo caso, condenado o absuelto según la semilla de entrenamiento.
      </SimGuide>
      <p className={NOTE}>
        Kahneman, Sibony y Sunstein midieron el ruido humano; la literatura de replicación mide el
        algorítmico. El modelo no elimina la dispersión del juicio: la traslada a decisiones que
        nadie audita — semilla, limpieza, versión de la librería.
      </p>
    </div>
  );
}
