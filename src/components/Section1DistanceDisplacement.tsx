import React, { useState, useEffect, useRef } from 'react';
import { Section1Answers } from '../types';
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft, Check, Info } from 'lucide-react';

interface Section1Props {
  answers: Section1Answers;
  setAnswers: React.Dispatch<React.SetStateAction<Section1Answers>>;
  onGoToGLB: () => void;
}

export const Section1DistanceDisplacement: React.FC<Section1Props> = ({
  answers,
  setAnswers,
  onGoToGLB,
}) => {
  // Track parameters: AB = 12m, BC = 5m -> AC = 13m
  const AB = 12;
  const BC = 5;
  const totalTrack = AB + BC; // 17 m
  const theoreticalDisplacement = 13;

  // Animation State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Question wizard state (1 question at a time)
  const [activeQuestion, setActiveQuestion] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Speed in m/s for visualization
  const speed = 3.2;

  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaSec = (time - lastTimeRef.current) / 1000;
        setProgress((prev) => {
          const next = prev + speed * deltaSec;
          if (next >= totalTrack) {
            setIsPlaying(false);
            return totalTrack;
          }
          return next;
        });
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, totalTrack]);

  const handleStart = () => {
    if (progress >= totalTrack) {
      setProgress(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  // SVG Coordinates
  const originX = 80;
  const originY = 225;
  const scaleX = 38; // 12m * 38 = 456px => ptB.x = 536
  const scaleY = 28; // 5m * 28 = 140px => ptC.y = 85

  const ptA = { x: originX, y: originY };
  const ptB = { x: originX + AB * scaleX, y: originY };
  const ptC = { x: ptB.x, y: originY - BC * scaleY };

  const cornerRadiusMeters = 0.6;
  const cornerTurnStart = AB - cornerRadiusMeters;
  const cornerTurnEnd = AB + cornerRadiusMeters;
  const rx = cornerRadiusMeters * scaleX;
  const ry = cornerRadiusMeters * scaleY;

  let carX = ptA.x;
  let carY = ptA.y;
  let carAngle = 0;

  if (progress <= cornerTurnStart) {
    const frac = progress / AB;
    carX = ptA.x + frac * (ptB.x - ptA.x);
    carY = ptA.y;
    carAngle = 0;
  } else if (progress < cornerTurnEnd) {
    const t = (progress - cornerTurnStart) / (cornerTurnEnd - cornerTurnStart);
    carAngle = -90 * t;
    const angleRad = (t * Math.PI) / 2;
    carX = ptB.x - rx + rx * Math.sin(angleRad);
    carY = ptA.y - ry * (1 - Math.cos(angleRad));
  } else if (progress < totalTrack) {
    const remainingTrack = totalTrack - cornerTurnEnd;
    const traveledAfterCorner = progress - cornerTurnEnd;
    const frac = traveledAfterCorner / remainingTrack;
    carX = ptB.x;
    carY = ptA.y - ry - frac * (ptA.y - ry - ptC.y);
    carAngle = -90;
  } else {
    carX = ptC.x;
    carY = ptC.y;
    carAngle = -90;
  }

  // Answer validation
  const distClean = answers.q2TotalDistance.replace(',', '.').replace(/[^0-9.]/g, '').trim();
  const isDistanceCorrect = parseFloat(distClean) === 17;

  const dispClean = answers.q3Displacement.replace(',', '.').replace(/[^0-9.]/g, '').trim();
  const isDisplacementCorrect = parseFloat(dispClean) === 13;

  const isQ1Answered = answers.q1Direct !== '';
  const isQ2Answered = answers.q2TotalDistance.trim() !== '';
  const isQ3Answered = answers.q3Displacement.trim() !== '';
  const isQ4Answered = answers.q4SameAlways !== '';

  const allQuestionsAnswered = isQ1Answered && isQ2Answered && isQ3Answered && isQ4Answered;

  return (
    <section className="space-y-5">
      {/* 3. Header Bagian 1 - Ringkas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>📍</span> Jarak & Perpindahan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Amati lintasan A → B → C.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold font-mono">
            A → B → C
          </span>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
            Jarak ≠ Perpindahan
          </span>
        </div>
      </div>

      {/* 4. Area Simulasi - Besar dan Menonjol */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-md text-white space-y-4">
        {/* Telemetry Header: JARAK & PERPINDAHAN */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-center bg-slate-900/90 py-3 px-6 rounded-xl border border-slate-800 shadow-inner">
          <div className="border-r border-slate-800 pr-2">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider block uppercase">
              JARAK
            </span>
            <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
              17 m
            </span>
          </div>
          <div className="pl-2">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider block uppercase">
              PERPINDAHAN
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {isDisplacementCorrect ? '13 m' : '? m'}
            </span>
          </div>
        </div>

        {/* Big Interactive Track SVG */}
        <div className="relative rounded-xl overflow-hidden bg-slate-900/60 p-2 border border-slate-800/80">
          <svg
            viewBox="0 0 680 290"
            className="w-full h-auto select-none"
            style={{ minHeight: '230px' }}
          >
            <defs>
              <marker
                id="arrow-displacement"
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
              </marker>
            </defs>

            {/* Horizontal Road AB */}
            <rect
              x="56"
              y="207"
              width="508"
              height="36"
              rx="6"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Dashed center line AB */}
            <line
              x1="66"
              y1="225"
              x2="536"
              y2="225"
              stroke="#cbd5e1"
              strokeDasharray="10 8"
              strokeWidth="2"
              opacity="0.5"
            />

            {/* Vertical Road BC */}
            <rect
              x="518"
              y="67"
              width="36"
              height="175"
              rx="6"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Dashed center line BC */}
            <line
              x1="536"
              y1="77"
              x2="536"
              y2="225"
              stroke="#cbd5e1"
              strokeDasharray="8 6"
              strokeWidth="2"
              opacity="0.5"
            />

            {/* Actual Track A -> B -> C */}
            <path
              d={`M ${ptA.x} ${ptA.y} L ${ptB.x - rx} ${ptB.y} Q ${ptB.x} ${ptB.y} ${ptB.x} ${ptB.y - ry} L ${ptC.x} ${ptC.y}`}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              opacity="0.85"
            />

            {/* Reference Line AC (Displacement) */}
            <line
              x1={ptA.x}
              y1={ptA.y}
              x2={ptC.x}
              y2={ptC.y}
              stroke="#10b981"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              opacity="0.5"
            />

            {/* Real-time Displacement Arrow */}
            {progress > 0.2 && (
              <line
                x1={ptA.x}
                y1={ptA.y}
                x2={carX}
                y2={carY}
                stroke="#10b981"
                strokeWidth="3"
                markerEnd="url(#arrow-displacement)"
              />
            )}

            {/* Right Angle Symbol at B */}
            <path
              d={`M ${ptB.x - 16} ${ptB.y} L ${ptB.x - 16} ${ptB.y - 16} L ${ptB.x} ${ptB.y - 16}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
            />

            {/* Point Markers */}
            {/* Point A */}
            <circle cx={ptA.x} cy={ptA.y} r="8" fill="#3b82f6" stroke="#ffffff" strokeWidth="2.5" />
            <text x={ptA.x} y={ptA.y + 24} fill="#93c5fd" fontSize="13" fontWeight="bold" textAnchor="middle">
              A
            </text>

            {/* Point B */}
            <circle cx={ptB.x} cy={ptB.y} r="8" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
            <text x={ptB.x + 22} y={ptB.y + 18} fill="#fcd34d" fontSize="13" fontWeight="bold" textAnchor="middle">
              B
            </text>

            {/* Point C */}
            <circle cx={ptC.x} cy={ptC.y} r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
            <text x={ptC.x} y={ptC.y - 16} fill="#6ee7b7" fontSize="13" fontWeight="bold" textAnchor="middle">
              C
            </text>

            {/* Dimension Labels */}
            {/* AB = 12 m */}
            <rect x="270" y="188" width="84" height="22" rx="5" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
            <text x="312" y="203" fill="#93c5fd" fontSize="12" fontWeight="bold" textAnchor="middle">
              AB = 12 m
            </text>

            {/* BC = 5 m */}
            <rect x="560" y="135" width="70" height="22" rx="5" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="595" y="150" fill="#fcd34d" fontSize="12" fontWeight="bold" textAnchor="middle">
              BC = 5 m
            </text>

            {/* AC = ? m */}
            <rect x="245" y="112" width="165" height="24" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
            <text x="327" y="128" fill="#6ee7b7" fontSize="12" fontWeight="bold" textAnchor="middle">
              {isDisplacementCorrect ? 'Perpindahan AC = 13 m' : 'Perpindahan AC = ? m'}
            </text>

            {/* Animated Car */}
            <g transform={`translate(${carX}, ${carY}) rotate(${carAngle})`}>
              <ellipse cx="0" cy="2" rx="20" ry="11" fill="rgba(0,0,0,0.5)" />
              <rect x="-18" y="-9" width="36" height="18" rx="5" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
              <path d="M -2 -7 L 8 -7 L 12 -5 L 12 5 L 8 7 L -2 7 Z" fill="#38bdf8" />
              <rect x="-14" y="-6" width="6" height="12" rx="1.5" fill="#38bdf8" />
              <circle cx="17" cy="-6" r="2.5" fill="#fef08a" />
              <circle cx="17" cy="6" r="2.5" fill="#fef08a" />
              {isPlaying && (
                <polygon points="19,-6 40,-12 40,0" fill="rgba(254, 240, 138, 0.25)" />
              )}
              <rect x="-13" y="-11" width="8" height="3" rx="1" fill="#0f172a" />
              <rect x="7" y="-11" width="8" height="3" rx="1" fill="#0f172a" />
              <rect x="-13" y="8" width="8" height="3" rx="1" fill="#0f172a" />
              <rect x="7" y="8" width="8" height="3" rx="1" fill="#0f172a" />
            </g>
          </svg>
        </div>

        {/* 5. Kontrol Sederhana: MULAI & RESET */}
        <div className="flex items-center justify-center gap-3 pt-1">
          {!isPlaying ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl text-sm font-bold shadow-sm transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{progress >= totalTrack ? 'ULANGI' : '▶ MULAI'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-xl text-sm font-bold shadow-sm transition cursor-pointer"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>⏸ JEDA</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>↻ RESET</span>
          </button>
        </div>
      </div>

      {/* 6. Aktivitas: Mode "1 Pertanyaan pada Satu Waktu" */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        {/* Activity Header with Stepper */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>🧩</span> Buktikan Temuanmu
            </h3>
          </div>

          {/* Stepper Dots (1, 2, 3, 4) */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map((idx) => {
              const isDone =
                idx === 0
                  ? isQ1Answered
                  : idx === 1
                  ? isQ2Answered
                  : idx === 2
                  ? isQ3Answered
                  : isQ4Answered;

              return (
                <button
                  key={idx}
                  onClick={() => setActiveQuestion(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                    activeQuestion === idx
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                  title={`Pertanyaan ${idx + 1}`}
                >
                  {isDone && activeQuestion !== idx ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    idx + 1
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Single Question Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 min-h-[140px] flex flex-col justify-between">
          {/* Question 1 */}
          {activeQuestion === 0 && (
            <div className="space-y-3">
              <p className="text-sm sm:text-base font-bold text-slate-800">
                1. Apakah mobil bergerak langsung dari A ke C?
              </p>
              <div className="flex gap-3 max-w-sm">
                <button
                  type="button"
                  onClick={() => {
                    setAnswers((prev) => ({ ...prev, q1Direct: 'ya' }));
                  }}
                  className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-xl border transition cursor-pointer ${
                    answers.q1Direct === 'ya'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Ya
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAnswers((prev) => ({ ...prev, q1Direct: 'tidak' }));
                  }}
                  className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-xl border transition cursor-pointer ${
                    answers.q1Direct === 'tidak'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Tidak
                </button>
              </div>
              {answers.q1Direct === 'tidak' && (
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Tepat, mobil menempuh jalan A → B dahulu lalu belok ke C.
                </p>
              )}
            </div>
          )}

          {/* Question 2 */}
          {activeQuestion === 1 && (
            <div className="space-y-3">
              <p className="text-sm sm:text-base font-bold text-slate-800">
                2. Berapa panjang seluruh lintasan?
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={answers.q2TotalDistance}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, q2TotalDistance: e.target.value }))
                  }
                  placeholder="Ketik angka..."
                  className="w-36 px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                />
                <span className="text-sm text-slate-700 font-bold">m</span>
                {isDistanceCorrect && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Benar (12 + 5 = 17 m)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Question 3 */}
          {activeQuestion === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm sm:text-base font-bold text-slate-800">
                  3. Berapa perpindahan A ke C?
                </p>
                {/* 7. Rumus via tombol kecil ⓘ Petunjuk */}
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Tutup Petunjuk' : 'ⓘ Petunjuk'}</span>
                </button>
              </div>

              {/* Formula Hint Box (Only when toggled) */}
              {showHint && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                  <span className="font-bold block">Rumus Perpindahan Siku-siku:</span>
                  <div className="font-mono font-bold bg-white px-3 py-1.5 rounded border border-blue-200 inline-block text-sm text-blue-800">
                    AC = √(AB² + BC²)
                  </div>
                  <p className="text-[11px] text-blue-700 mt-1">
                    Hitung: √(12² + 5²) = √(144 + 25) = √169
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={answers.q3Displacement}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, q3Displacement: e.target.value }))
                  }
                  placeholder="Ketik angka..."
                  className="w-36 px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                />
                <span className="text-sm text-slate-700 font-bold">m</span>
                {isDisplacementCorrect && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Tepat (13 m)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Question 4 */}
          {activeQuestion === 3 && (
            <div className="space-y-3">
              <p className="text-sm sm:text-base font-bold text-slate-800">
                4. Apakah jarak dan perpindahan selalu sama?
              </p>
              <div className="flex gap-3 max-w-sm">
                <button
                  type="button"
                  onClick={() => {
                    setAnswers((prev) => ({ ...prev, q4SameAlways: 'ya' }));
                  }}
                  className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-xl border transition cursor-pointer ${
                    answers.q4SameAlways === 'ya'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Ya
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAnswers((prev) => ({ ...prev, q4SameAlways: 'tidak' }));
                  }}
                  className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-xl border transition cursor-pointer ${
                    answers.q4SameAlways === 'tidak'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Tidak
                </button>
              </div>
              {answers.q4SameAlways === 'tidak' && (
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Tepat, jarak dan perpindahan berbeda jika lintasannya berbelok.
                </p>
              )}
            </div>
          )}

          {/* Navigation Controls between questions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 mt-2">
            <button
              disabled={activeQuestion === 0}
              onClick={() => setActiveQuestion((prev) => Math.max(0, prev - 1))}
              className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Sebelumnya</span>
            </button>

            <span className="text-xs font-semibold text-slate-400">
              Pertanyaan {activeQuestion + 1} dari 4
            </span>

            {activeQuestion < 3 ? (
              <button
                onClick={() => setActiveQuestion((prev) => Math.min(3, prev + 1))}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                <span>Berikutnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-600">
                {allQuestionsAnswered ? 'Semua Terjawab ✓' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 8. Transisi ke Eksplorasi Utama GLB (Bagian 2) */}
      <div className="bg-slate-900 rounded-2xl p-5 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider">
            Langkah Selanjutnya
          </span>
          <h4 className="text-base sm:text-lg font-extrabold text-white">
            Eksplorasi Utama: Gerak Lurus Beraturan (GLB)
          </h4>
        </div>

        <button
          onClick={() => {
            setAnswers((prev) => ({ ...prev, completed: true }));
            onGoToGLB();
          }}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer shrink-0"
        >
          <span>MULAI PENYELIDIKAN GLB</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
