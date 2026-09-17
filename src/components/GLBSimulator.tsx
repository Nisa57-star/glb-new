import React, { useState, useEffect, useRef } from 'react';
import { DataPoint } from '../types';
import { Play, Pause, RotateCcw, BookmarkPlus, Gauge, Clock, Ruler, Zap, CheckCircle } from 'lucide-react';

interface GLBSimulatorProps {
  selectedSpeed: number;
  setSelectedSpeed: (speed: number) => void;
  dataPoints: DataPoint[];
  setDataPoints: React.Dispatch<React.SetStateAction<DataPoint[]>>;
  onAutoCapture?: () => void;
  trackLength?: number; // default 25m
}

export const GLBSimulator: React.FC<GLBSimulatorProps> = ({
  selectedSpeed,
  setSelectedSpeed,
  dataPoints,
  setDataPoints,
  trackLength = 25,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [currentDistance, setCurrentDistance] = useState(0); // in meters
  const [lastRecordedPoint, setLastRecordedPoint] = useState<string | null>(null);

  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  const milestones = [5, 10, 15, 20, 25];

  // Animation Loop based on real physics: s = v * t
  useEffect(() => {
    if (!isRunning) {
      previousTimeRef.current = null;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const maxSimTime = trackLength / selectedSpeed;

    const animate = (time: number) => {
      if (previousTimeRef.current !== null) {
        const deltaSeconds = (time - previousTimeRef.current) / 1000;
        setCurrentTime((prevTime) => {
          const nextTime = prevTime + deltaSeconds;
          const nextDistance = nextTime * selectedSpeed; // s = v * t

          if (nextDistance >= trackLength || nextTime >= maxSimTime) {
            setIsRunning(false);
            setCurrentDistance(trackLength);
            return maxSimTime;
          }

          setCurrentDistance(nextDistance);
          return nextTime;
        });
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, selectedSpeed, trackLength]);

  const handleStart = () => {
    if (currentDistance >= trackLength) {
      handleReset();
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setCurrentDistance(0);
    setLastRecordedPoint(null);
  };

  // Student manual "CATAT WAKTU (t)" button: records exact mathematical time t = s / v for the passed milestone
  const handleCaptureData = () => {
    // Milestones: [5, 10, 15, 20, 25]
    // Check which milestones haven't been recorded yet
    const unrecorded = milestones.filter((m, idx) => {
      const dp = dataPoints[idx];
      const isMatch = dp && (dp.distance === m || Number(dp.userDistanceInput) === m) && dp.time !== null && dp.time > 0;
      return !isMatch;
    });

    if (unrecorded.length === 0) {
      setLastRecordedPoint('Seluruh 5 titik ukur sudah tercatat! Silakan hitung kecepatan (v = s/t) di tabel.');
      setTimeout(() => setLastRecordedPoint(null), 3000);
      return;
    }

    // Check which unrecorded milestones have been reached by the car (tolerance -0.3m for human response)
    const reachedUnrecorded = unrecorded.filter((m) => currentDistance >= m - 0.3);

    let targetMilestone: number;
    if (reachedUnrecorded.length > 0) {
      // Select the first reached unrecorded milestone
      targetMilestone = reachedUnrecorded[0];
    } else {
      const nextMilestone = unrecorded[0];
      if (currentDistance < nextMilestone - 0.8) {
        setLastRecordedPoint(`Mobil belum melintasi pos ${nextMilestone} m. Tunggu mobil melintas!`);
        setTimeout(() => setLastRecordedPoint(null), 2500);
        return;
      }
      targetMilestone = nextMilestone;
    }

    // Rigorous GLB mathematical time: t = s / v
    const exactTime = Number((targetMilestone / selectedSpeed).toFixed(2));
    const milestoneIdx = milestones.indexOf(targetMilestone);

    setDataPoints((prev) =>
      prev.map((pt, idx) => {
        if (pt.distance === targetMilestone || (idx === milestoneIdx && (pt.distance === 0 || !pt.userDistanceInput))) {
          return {
            ...pt,
            distance: targetMilestone,
            userDistanceInput: targetMilestone.toString(),
            isDistanceCorrect: true,
            time: exactTime,
            userTimeInput: exactTime.toFixed(2),
            isTimeCorrect: true,
            // Do NOT insert speed! Student must compute v = s / t
            calculatedSpeed: null,
            userSpeedInput: pt.userSpeedInput ?? '',
          };
        }
        return pt;
      })
    );

    setLastRecordedPoint(`Titik ${targetMilestone} m: Waktu t = ${exactTime.toFixed(2)} s dicatat! Silakan hitung v di tabel.`);
    setTimeout(() => setLastRecordedPoint(null), 3000);
  };

  // Auto-record times accurately from simulation photogate sensors (only records time, speed left for student)
  const handleAutoRecordAll = () => {
    setDataPoints((prev) =>
      prev.map((pt, idx) => {
        const targetDist = pt.distance > 0 ? pt.distance : milestones[idx];
        const exactTime = Number((targetDist / selectedSpeed).toFixed(2));
        return {
          ...pt,
          distance: targetDist,
          userDistanceInput: targetDist.toString(),
          isDistanceCorrect: true,
          time: exactTime,
          userTimeInput: exactTime.toFixed(2),
          isTimeCorrect: true,
          // Never insert speed automatically
          calculatedSpeed: null,
          userSpeedInput: pt.userSpeedInput ?? '',
        };
      })
    );
    setLastRecordedPoint('Waktu seluruh 5 titik ukur tercatat dari sensor! Silakan hitung kecepatan (v = s/t) di tabel.');
    setTimeout(() => setLastRecordedPoint(null), 3500);
  };

  // Check which milestones are passed
  const isMilestonePassed = (m: number) => currentDistance >= m;
  const isMilestoneClose = (m: number) => Math.abs(currentDistance - m) <= 1.0;

  // SVG coordinate transformation
  // Track goes from 0m to 25m
  // SVG viewbox 0 0 760 210
  const svgWidth = 760;
  const startX = 65;
  const endX = 700;
  const trackWidth = endX - startX;
  const carSvgX = startX + (currentDistance / trackLength) * trackWidth;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-5">
      {/* Top Controls & Telemetry */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Single Car (Mobil 1) Mode */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-blue-600" />
            <span>KENDARAAN SIMULASI (Eksperimen GLB):</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Mobil 1 (Gerak Lurus Beraturan)</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            *Nilai kecepatan tetap tersimpan di sistem dan dirahasiakan. Tugasmu: amati waktu pada tiap pos lalu hitung <em>v = s/t</em>!
          </div>
        </div>

        {/* Real-time Instruments Panel */}
        <div className="grid grid-cols-3 gap-2 bg-slate-900 text-white p-3.5 rounded-xl shadow-inner font-mono text-center">
          {/* Time */}
          <div className="px-2">
            <span className="text-[10px] text-amber-400 font-bold block tracking-wider uppercase">STOPWATCH (t)</span>
            <div className="text-base sm:text-lg font-extrabold text-amber-300">
              {currentTime.toFixed(2)} <span className="text-xs font-normal text-slate-300">s</span>
            </div>
            <span className="text-[9px] text-amber-300 block font-sans font-medium">Diisi Siswa</span>
          </div>

          <div className="w-px bg-slate-800" />

          {/* Distance */}
          <div className="px-2">
            <span className="text-[10px] text-cyan-400 font-bold block tracking-wider uppercase">JARAK (s)</span>
            <div className="text-base sm:text-lg font-extrabold text-cyan-300">
              {currentDistance.toFixed(2)} <span className="text-xs font-normal text-slate-300">m</span>
            </div>
            <span className="text-[9px] text-emerald-400 block font-sans font-bold">✓ Diketahui</span>
          </div>

          <div className="w-px bg-slate-800" />

          {/* Speed */}
          <div className="px-2">
            <span className="text-[10px] text-slate-400 font-bold block tracking-wider uppercase">KECEPATAN (v)</span>
            <div className="text-base sm:text-lg font-extrabold text-slate-200">
              ? <span className="text-xs font-normal text-slate-400">m/s</span>
            </div>
            <span className="text-[9px] text-amber-300 block font-sans font-semibold">“Kecepatan dihitung oleh siswa.”</span>
          </div>
        </div>
      </div>

      {/* Track Canvas (SVG) */}
      <div className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 p-2 sm:p-4 shadow-inner">
        {/* Distance Scale ruler at top */}
        <div className="text-[11px] text-slate-400 flex items-center justify-between px-4 mb-1">
          <span className="font-semibold text-slate-300">LINTASAN LURUS BERATURAN (Jarak Diketahui: 5 m, 10 m, 15 m, 20 m, 25 m)</span>
          <span className="text-amber-400 font-mono">Stopwatch Digital & Sensor Titik Jarak</span>
        </div>

        <svg viewBox="0 0 760 170" className="w-full h-auto select-none">
          <defs>
            {/* Road gradient */}
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            {/* Laser sensor glow */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Scenery: Distant poles */}
          <g opacity="0.3">
            {[0, 5, 10, 15, 20, 25].map((m) => {
              const xPos = startX + (m / trackLength) * trackWidth;
              return (
                <line key={`grid-${m}`} x1={xPos} y1="10" x2={xPos} y2="140" stroke="#334155" strokeDasharray="3 3" />
              );
            })}
          </g>

          {/* Asphalt Road */}
          <rect
            x="40"
            y="70"
            width="680"
            height="56"
            rx="8"
            fill="url(#roadGrad)"
            stroke="#334155"
            strokeWidth="2"
          />

          {/* Road dashed center line */}
          <line
            x1="50"
            y1="98"
            x2="710"
            y2="98"
            stroke="#94a3b8"
            strokeDasharray="14 10"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* Start Line (0 m) */}
          <g transform={`translate(${startX}, 0)`}>
            <rect x="-2" y="65" width="4" height="66" fill="#ef4444" />
            <text x="0" y="55" fill="#f87171" fontSize="11" fontWeight="bold" textAnchor="middle">
              0 m (Start)
            </text>
          </g>

          {/* Milestones: 5m, 10m, 15m, 20m, 25m */}
          {milestones.map((m) => {
            const xPos = startX + (m / trackLength) * trackWidth;
            const passed = isMilestonePassed(m);
            const near = isMilestoneClose(m);
            const recorded = dataPoints.some(
              (dp) => (dp.distance === m || Number(dp.userDistanceInput) === m) && dp.time !== null && dp.time > 0
            );

            return (
              <g key={`milestone-${m}`} transform={`translate(${xPos}, 0)`}>
                {/* Gate Sensor Post */}
                <line
                  x1="0"
                  y1="64"
                  x2="0"
                  y2="132"
                  stroke={near ? '#f59e0b' : passed ? '#10b981' : '#64748b'}
                  strokeWidth={near ? '3' : '2'}
                  filter={near ? 'url(#glow)' : undefined}
                />

                {/* Sensor Light Bulb */}
                <circle
                  cx="0"
                  cy="64"
                  r={near ? 6 : 4.5}
                  fill={near ? '#fbbf24' : passed ? '#34d399' : '#475569'}
                  stroke="#ffffff"
                  strokeWidth="1"
                />

                {/* Milestone Flag / Sign */}
                <rect
                  x="-18"
                  y="26"
                  width="36"
                  height="22"
                  rx="5"
                  fill={recorded ? '#065f46' : passed ? '#1e3a8a' : '#1e293b'}
                  stroke={recorded ? '#34d399' : '#3b82f6'}
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="41"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {m} m
                </text>

                {/* Time badge beneath road when car has passed milestone or recorded */}
                {passed && (
                  <g transform="translate(0, 146)">
                    <rect
                      x="-28"
                      y="0"
                      width="56"
                      height="19"
                      rx="4"
                      fill={recorded ? '#022c22' : '#0f172a'}
                      stroke={recorded ? '#10b981' : '#38bdf8'}
                      strokeWidth="1.2"
                    />
                    <text
                      x="0"
                      y="13"
                      fill={recorded ? '#6ee7b7' : '#7dd3fc'}
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      t = {(m / selectedSpeed).toFixed(2)} s
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Car Graphic */}
          <g transform={`translate(${carSvgX}, 98)`}>
            {/* Under-glow / shadow */}
            <ellipse cx="0" cy="12" rx="24" ry="7" fill="rgba(0,0,0,0.6)" />

            {/* Car Chassis (Sleek Red/Yellow Science Lab Van) */}
            <rect x="-26" y="-14" width="52" height="25" rx="6" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1.5" />
            
            {/* Windshield front & back */}
            <polygon points="12,-12 20,-5 20,4 12,4" fill="#93c5fd" opacity="0.9" />
            <polygon points="-12,-12 -22,-5 -22,4 -12,4" fill="#93c5fd" opacity="0.6" />
            <rect x="-8" y="-12" width="16" height="8" rx="2" fill="#bfdbfe" opacity="0.8" />

            {/* Mobile Lab Side Decal */}
            <text x="0" y="2" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">
              MOBILE LAB
            </text>

            {/* Headlights */}
            <circle cx="26" cy="-2" r="3" fill="#fef08a" />
            <circle cx="26" cy="6" r="3" fill="#fef08a" />

            {/* Light Cone beam when running */}
            {isRunning && (
              <polygon
                points="27,-2 60,-12 60,16 27,6"
                fill="rgba(254, 240, 138, 0.25)"
              />
            )}

            {/* Wheels */}
            <circle cx="-16" cy="11" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="-16" cy="11" r="2" fill="#e2e8f0" />
            <circle cx="16" cy="11" r="5.5" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="16" cy="11" r="2" fill="#e2e8f0" />

            {/* Speedometer Roof Fin / Sensor */}
            <path d="M -4 -14 L 4 -14 L 0 -19 Z" fill="#38bdf8" />
          </g>
        </svg>

        {/* Feedback message banner */}
        {lastRecordedPoint && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-emerald-600/90 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-md animate-fade-in">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-200" />
            <span>{lastRecordedPoint}</span>
          </div>
        )}
      </div>

      {/* Simulator Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-sm font-bold shadow-xs transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{currentTime > 0 && currentDistance < trackLength ? 'LANJUTKAN' : 'START SIMULASI'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white rounded-xl text-sm font-bold shadow-xs transition"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>PAUSE</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 rounded-xl text-sm font-semibold transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET</span>
          </button>
        </div>

        {/* Action: Ambil Data Waktu Stopwatch */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCaptureData}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-sm font-extrabold shadow-sm transition"
            title="Catat waktu stopwatch saat mobil melintasi titik 5m, 10m, 15m, 20m, 25m"
          >
            <Clock className="w-4 h-4" />
            <span>⏱️ CATAT WAKTU (t)</span>
          </button>

          <button
            onClick={handleAutoRecordAll}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-blue-50 text-blue-700 border border-slate-200 rounded-xl text-xs font-semibold transition"
            title="Bantuan sensor lab untuk mencatat otomatis waktu t di seluruh titik ukur"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Bantuan Sensor Waktu (t)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
