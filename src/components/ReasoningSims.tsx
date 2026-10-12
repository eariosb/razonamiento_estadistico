'use client';

import { type ReactNode, useMemo, useState } from 'react';
import { tokens } from '@/lib/tokens';
import { SimGuide, SimLegend } from '@/components/SimBits';

const BTN_MAIN =
  'rounded bg-brand-600 px-3 py-1 text-xs font-medium text-white hover:bg-brand-700';
const BTN_GHOST =
  'rounded border border-ink-200 px-3 py-1 text-xs text-ink-600 hover:bg-ink-100';
const FIG = 'my-6 rounded border border-ink-200 bg-white p-4 shadow-sm';
const CAPTION = 'mb-2 text-sm font-semibold text-ink-800';
const NOTE = 'mt-2 border-t border-ink-100 pt-2 text-xs text-ink-600';

const ACCENT = tokens.status.info;
const DANGER = tokens.status.danger;
const GOLD = tokens.status.warning;
const GRAY = tokens.chart.tick;
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
          <p className="mb-2 text-xs text-ink-600">
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
                      ? 'border-ink-200 bg-ink-50'
                      : isPicked
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-ink-300 bg-white hover:border-brand-400'
                  } ${phase === 'pick' ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <span aria-hidden>{doorLabel(i)}</span>
                  <span className="mt-1 text-[10px] font-medium text-ink-500">Puerta {i + 1}</span>
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
          <p className="mb-1 text-xs font-semibold text-ink-700">Tu historial</p>
          <WinBars
            stayRate={tally.stayN ? tally.stayWins / tally.stayN : NaN}
            switchRate={tally.switchN ? tally.switchWins / tally.switchN : NaN}
            stayN={tally.stayN}
            switchN={tally.switchN}
          />
          <p className="mb-1 mt-4 text-xs font-semibold text-ink-700">Simulación masiva</p>
          <div className="mb-2 flex gap-2">
            {[100, 1000, 10000].map((n) => (
              <button key={n} type="button" className={BTN_GHOST} onClick={() => setSimN(n)}>
                {n.toLocaleString('es')} rondas
              </button>
            ))}
          </div>
          {mass && (
            <WinBars
              stayRate={mass.stay / mass.n}
              switchRate={mass.sw / mass.n}
              stayN={mass.stay}
              switchN={mass.sw}
            />
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
  const bar = (rate: number) => (Number.isFinite(rate) ? rnd(rate * W) : 0);
  return (
    <svg viewBox={`0 0 ${W + 60} 66`} className="w-full max-w-sm" role="img" aria-label="Tasas de victoria">
      {/* líneas teóricas */}
      <line x1={rnd(W / 3)} x2={rnd(W / 3)} y1={0} y2={56} stroke={DANGER} strokeDasharray="3 3" />
      <line x1={rnd((2 * W) / 3)} x2={rnd((2 * W) / 3)} y1={0} y2={56} stroke={DANGER} strokeDasharray="3 3" />
      <rect x={0} y={6} width={bar(stayRate)} height={16} fill={GRAY} rx={2} />
      <rect x={0} y={34} width={bar(switchRate)} height={16} fill={ACCENT} rx={2} />
      <text x={W + 4} y={18} fontSize={10} fill={tokens.chart.text}>
        {Number.isFinite(stayRate) ? `${fmt(stayRate * 100, 0)}% (${stayN})` : `0 (${stayN})`}
      </text>
      <text x={W + 4} y={46} fontSize={10} fill={tokens.chart.text}>
        {Number.isFinite(switchRate) ? `${fmt(switchRate * 100, 0)}% (${switchN})` : `0 (${switchN})`}
      </text>
      <text x={0} y={64} fontSize={9} fill={tokens.chart.text}>
        quedarse arriba · cambiar abajo · líneas punteadas: 1/3 y 2/3
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

      <div className="rounded border border-ink-100 bg-ink-50 p-3 text-sm leading-relaxed text-ink-700">
        Linda tiene 31 años, es soltera, extrovertida y muy brillante. Estudió filosofía y, de
        estudiante, le preocupaban la discriminación y la justicia social; participó en marchas
        contra la energía nuclear.
      </div>

      <p className="mt-3 text-xs font-semibold text-ink-700">¿Cuál afirmación es más probable?</p>
      <div className="mt-1 space-y-1.5">
        {LINDA_OPTIONS.map((opt, i) => (
          <button
            key={opt}
            type="button"
            disabled={revealed}
            onClick={() => setChoice(i)}
            className={`block w-full rounded border px-3 py-2 text-left text-sm transition-colors ${
              choice === i
                ? 'border-brand-500 bg-brand-50 text-ink-900'
                : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300'
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
          className={`${BTN_MAIN} mt-3`}
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
          <div className="text-sm leading-relaxed text-ink-700">
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

      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-ink-700">
        <span className="font-semibold">Lanzamientos por experimento:</span>
        {[10, 100, 1000].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setN(v)}
            className={v === n ? BTN_MAIN : BTN_GHOST}
          >
            n = {v}
          </button>
        ))}
        <span className="ml-auto">
          Tu predicción de caras en 10 lanzamientos:{' '}
          <input
            type="number"
            min={0}
            max={10}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="w-14 rounded border border-ink-200 px-1.5 py-0.5 text-center text-xs focus:border-brand-400 focus:outline-none"
            aria-label="Caras esperadas en 10 lanzamientos"
          />
          {Number.isFinite(guessN) && guess !== '' && (
            <span className="ml-1 text-ink-500">
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

      <div className="mt-2 grid gap-2 text-xs text-ink-700 sm:grid-cols-3">
        <div className="rounded border border-ink-100 bg-ink-50 p-2">
          Experimentos dentro de [0.45, 0.55]: <strong>{fmt(within * 100, 1)}%</strong>
        </div>
        <div className="rounded border border-ink-100 bg-ink-50 p-2">
          Desviación teórica σ/√n: <strong>{fmt(sd, 3)}</strong>
        </div>
        <div className="rounded border border-ink-100 bg-ink-50 p-2">
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
