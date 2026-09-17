import React from 'react';
import { DataPoint } from '../types';
import { LineChart, Sparkles } from 'lucide-react';

interface GraphsSectionProps {
  dataPoints: DataPoint[];
  speedExp1?: number;
}

export const GraphsSection: React.FC<GraphsSectionProps> = ({
  dataPoints,
}) => {
  // Extract strictly valid points entered by the student
  // Graph A (s-t): Needs valid time > 0 and distance > 0
  const stPoints = dataPoints
    .map((dp) => {
      const userTimeStr = dp.userTimeInput !== undefined ? dp.userTimeInput.trim() : '';
      const parsedUserT = userTimeStr !== '' ? parseFloat(userTimeStr.replace(',', '.')) : null;
      const validT =
        parsedUserT !== null && !isNaN(parsedUserT) && parsedUserT > 0
          ? parsedUserT
          : dp.time !== null && dp.time > 0
          ? dp.time
          : null;

      const userDistStr = dp.userDistanceInput !== undefined ? dp.userDistanceInput.trim() : '';
      const parsedUserS = userDistStr !== '' ? parseFloat(userDistStr.replace(',', '.')) : null;
      const validS =
        parsedUserS !== null && !isNaN(parsedUserS) && parsedUserS > 0
          ? parsedUserS
          : dp.distance > 0
          ? dp.distance
          : null;

      if (validT !== null && validS !== null) {
        return {
          id: dp.id,
          pointName: dp.pointName,
          distance: validS,
          time: validT,
        };
      }
      return null;
    })
    .filter((p): p is { id: number; pointName: string; distance: number; time: number } => p !== null)
    .sort((a, b) => a.time - b.time);

  // Graph B (v-t): Needs valid time > 0 AND valid calculated speed > 0
  const vtPoints = dataPoints
    .map((dp) => {
      const userTimeStr = dp.userTimeInput !== undefined ? dp.userTimeInput.trim() : '';
      const parsedUserT = userTimeStr !== '' ? parseFloat(userTimeStr.replace(',', '.')) : null;
      const validT =
        parsedUserT !== null && !isNaN(parsedUserT) && parsedUserT > 0
          ? parsedUserT
          : dp.time !== null && dp.time > 0
          ? dp.time
          : null;

      const userSpeedStr = dp.userSpeedInput !== undefined ? dp.userSpeedInput.trim() : '';
      const parsedUserV = userSpeedStr !== '' ? parseFloat(userSpeedStr.replace(',', '.')) : null;
      const validV =
        parsedUserV !== null && !isNaN(parsedUserV) && parsedUserV > 0
          ? parsedUserV
          : dp.calculatedSpeed !== null && dp.calculatedSpeed > 0
          ? dp.calculatedSpeed
          : null;

      const userDistStr = dp.userDistanceInput !== undefined ? dp.userDistanceInput.trim() : '';
      const parsedUserS = userDistStr !== '' ? parseFloat(userDistStr.replace(',', '.')) : null;
      const validS =
        parsedUserS !== null && !isNaN(parsedUserS) && parsedUserS > 0
          ? parsedUserS
          : dp.distance > 0
          ? dp.distance
          : 0;

      if (validT !== null && validV !== null) {
        return {
          id: dp.id,
          pointName: dp.pointName,
          distance: validS,
          time: validT,
          speed: validV,
        };
      }
      return null;
    })
    .filter(
      (p): p is { id: number; pointName: string; distance: number; time: number; speed: number } =>
        p !== null
    )
    .sort((a, b) => a.time - b.time);

  // Layout parameters for 380x240 SVG coordinate system
  const originX = 52;
  const originY = 190;
  const plotWidth = 285;
  const plotHeight = 150;

  // Graph A scaling: s-t
  const maxTimeA = Math.max(12, ...stPoints.map((p) => Math.ceil(p.time + 1)));
  const maxDistA = 30;
  const timeToX_A = (t: number) => originX + (t / maxTimeA) * plotWidth;
  const distToY = (d: number) => originY - (d / maxDistA) * plotHeight;

  // Generate X-ticks for Graph A (steps of 2)
  const xTicksA: number[] = [];
  for (let t = 0; t <= maxTimeA; t += 2) {
    xTicksA.push(t);
  }
  const yTicksA = [0, 5, 10, 15, 20, 25, 30];

  // Graph B scaling: v-t
  const maxTimeB = Math.max(12, ...vtPoints.map((p) => Math.ceil(p.time + 1)));
  const maxSpeedB = Math.max(8, ...vtPoints.map((p) => Math.ceil(p.speed + 1)));
  const timeToX_B = (t: number) => originX + (t / maxTimeB) * plotWidth;
  const speedToY = (v: number) => originY - (v / maxSpeedB) * plotHeight;

  // Generate X-ticks and Y-ticks for Graph B
  const xTicksB: number[] = [];
  for (let t = 0; t <= maxTimeB; t += 2) {
    xTicksB.push(t);
  }
  const yTicksB: number[] = [];
  for (let v = 0; v <= maxSpeedB; v += 2) {
    yTicksB.push(v);
  }

  const hasAnyData = stPoints.length > 0 || vtPoints.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2.5 bg-sky-600 text-white rounded-xl shadow-xs">
          <LineChart className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase">
            GRAFIK HASIL PENGAMATAN
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Masukkan data hasil pengamatan untuk melihat pola gerak.
          </p>
        </div>
      </div>

      {/* Real-time plot status indicator (no spoilers) */}
      {hasAnyData && (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold">
              Data terplot: {stPoints.length} titik pada grafik s–t, {vtPoints.length} titik pada grafik v–t
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Plot dibuat murni dari hasil pengukuran pada tabel
          </span>
        </div>
      )}

      {/* Two Graphs Grid: A. Grafik s-t and B. Grafik v-t */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* GRAPH A: Grafik Jarak–Waktu (s–t) */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                A. Grafik Jarak–Waktu (s–t)
              </h4>
              <div className="text-[11px] text-slate-500 mt-0.5 space-x-2">
                <span>Sumbu X: <strong>Waktu (s)</strong></span>
                <span>•</span>
                <span>Sumbu Y: <strong>Jarak (m)</strong></span>
              </div>
            </div>
            <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase">
              s vs t
            </span>
          </div>

          <div className="bg-slate-950 rounded-xl p-2 sm:p-3 shadow-inner">
            <svg viewBox="0 0 380 230" className="w-full h-auto select-none font-sans">
              {/* Grid Lines - X Axis (Time) */}
              {xTicksA.map((t) => {
                const x = timeToX_A(t);
                return (
                  <g key={`grid-x-a-${t}`}>
                    <line
                      x1={x}
                      y1={25}
                      x2={x}
                      y2={originY}
                      stroke="#334155"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={originY + 16}
                      fill="#94a3b8"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      {t}s
                    </text>
                  </g>
                );
              })}

              {/* Grid Lines - Y Axis (Distance) */}
              {yTicksA.map((s) => {
                const y = distToY(s);
                return (
                  <g key={`grid-y-a-${s}`}>
                    <line
                      x1={originX}
                      y1={y}
                      x2={originX + plotWidth}
                      y2={y}
                      stroke="#334155"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                    <text
                      x={originX - 7}
                      y={y + 3}
                      fill="#94a3b8"
                      fontSize="9"
                      textAnchor="end"
                    >
                      {s}m
                    </text>
                  </g>
                );
              })}

              {/* Coordinate Axes */}
              <line
                x1={originX}
                y1={20}
                x2={originX}
                y2={originY}
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
              <line
                x1={originX}
                y1={originY}
                x2={originX + plotWidth + 12}
                y2={originY}
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />

              {/* Axis Arrowheads */}
              <path
                d={`M ${originX - 3.5} 25 L ${originX} 18 L ${originX + 3.5} 25`}
                fill="#cbd5e1"
              />
              <path
                d={`M ${originX + plotWidth + 7} ${originY - 3.5} L ${originX + plotWidth + 14} ${originY} L ${originX + plotWidth + 7} ${originY + 3.5}`}
                fill="#cbd5e1"
              />

              {/* Axis Labels */}
              <text x={originX - 6} y={14} fill="#67e8f9" fontSize="10" fontWeight="bold">
                Jarak: s (m)
              </text>
              <text
                x={originX + plotWidth + 12}
                y={originY + 16}
                fill="#fde047"
                fontSize="10"
                fontWeight="bold"
                textAnchor="end"
              >
                Waktu: t (s)
              </text>

              {/* EMPTY STATE: Placeholder when no points */}
              {stPoints.length === 0 && (
                <g>
                  <rect
                    x={originX + 18}
                    y={originY - 95}
                    width={plotWidth - 36}
                    height={36}
                    rx="8"
                    fill="#1e293b"
                    stroke="#475569"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={originX + plotWidth / 2}
                    y={originY - 73}
                    fill="#94a3b8"
                    fontSize="10.5"
                    fontWeight="500"
                    textAnchor="middle"
                  >
                    Grafik akan muncul setelah data dimasukkan.
                  </text>
                </g>
              )}

              {/* FILLED STATE: Connect consecutive points entered by student (no auto-extrapolation) */}
              {stPoints.length >= 2 && (
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={stPoints.map((pt) => `${timeToX_A(pt.time)},${distToY(pt.distance)}`).join(' ')}
                />
              )}

              {/* Student Points */}
              {stPoints.map((pt) => {
                const px = timeToX_A(pt.time);
                const py = distToY(pt.distance);
                return (
                  <g key={`st-pt-${pt.id}`}>
                    <circle cx={px} cy={py} r="5" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
                    <text
                      x={px}
                      y={py - 9}
                      fill="#fef08a"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {pt.distance}m
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* GRAPH B: Grafik Kecepatan–Waktu (v–t) */}
        <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                B. Grafik Kecepatan–Waktu (v–t)
              </h4>
              <div className="text-[11px] text-slate-500 mt-0.5 space-x-2">
                <span>Sumbu X: <strong>Waktu (s)</strong></span>
                <span>•</span>
                <span>Sumbu Y: <strong>Kecepatan (m/s)</strong></span>
              </div>
            </div>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase">
              v vs t
            </span>
          </div>

          <div className="bg-slate-950 rounded-xl p-2 sm:p-3 shadow-inner">
            <svg viewBox="0 0 380 230" className="w-full h-auto select-none font-sans">
              {/* Grid Lines - X Axis (Time) */}
              {xTicksB.map((t) => {
                const x = timeToX_B(t);
                return (
                  <g key={`grid-x-b-${t}`}>
                    <line
                      x1={x}
                      y1={25}
                      x2={x}
                      y2={originY}
                      stroke="#334155"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={originY + 16}
                      fill="#94a3b8"
                      fontSize="9"
                      textAnchor="middle"
                    >
                      {t}s
                    </text>
                  </g>
                );
              })}

              {/* Grid Lines - Y Axis (Speed) */}
              {yTicksB.map((v) => {
                const y = speedToY(v);
                return (
                  <g key={`grid-y-b-${v}`}>
                    <line
                      x1={originX}
                      y1={y}
                      x2={originX + plotWidth}
                      y2={y}
                      stroke="#334155"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                    <text
                      x={originX - 7}
                      y={y + 3}
                      fill="#94a3b8"
                      fontSize="9"
                      textAnchor="end"
                    >
                      {v}
                    </text>
                  </g>
                );
              })}

              {/* Coordinate Axes */}
              <line
                x1={originX}
                y1={20}
                x2={originX}
                y2={originY}
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
              <line
                x1={originX}
                y1={originY}
                x2={originX + plotWidth + 12}
                y2={originY}
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />

              {/* Axis Arrowheads */}
              <path
                d={`M ${originX - 3.5} 25 L ${originX} 18 L ${originX + 3.5} 25`}
                fill="#cbd5e1"
              />
              <path
                d={`M ${originX + plotWidth + 7} ${originY - 3.5} L ${originX + plotWidth + 14} ${originY} L ${originX + plotWidth + 7} ${originY + 3.5}`}
                fill="#cbd5e1"
              />

              {/* Axis Labels */}
              <text x={originX - 6} y={14} fill="#4ade80" fontSize="10" fontWeight="bold">
                Kecepatan: v (m/s)
              </text>
              <text
                x={originX + plotWidth + 12}
                y={originY + 16}
                fill="#fde047"
                fontSize="10"
                fontWeight="bold"
                textAnchor="end"
              >
                Waktu: t (s)
              </text>

              {/* EMPTY STATE: Placeholder when no points */}
              {vtPoints.length === 0 && (
                <g>
                  <rect
                    x={originX + 18}
                    y={originY - 95}
                    width={plotWidth - 36}
                    height={36}
                    rx="8"
                    fill="#1e293b"
                    stroke="#475569"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={originX + plotWidth / 2}
                    y={originY - 73}
                    fill="#94a3b8"
                    fontSize="10.5"
                    fontWeight="500"
                    textAnchor="middle"
                  >
                    Grafik akan muncul setelah data dimasukkan.
                  </text>
                </g>
              )}

              {/* FILLED STATE: Connect consecutive points entered by student (no forced horizontal line) */}
              {vtPoints.length >= 2 && (
                <polyline
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={vtPoints.map((pt) => `${timeToX_B(pt.time)},${speedToY(pt.speed)}`).join(' ')}
                />
              )}

              {/* Student Points */}
              {vtPoints.map((pt) => {
                const px = timeToX_B(pt.time);
                const py = speedToY(pt.speed);
                return (
                  <g key={`vt-pt-${pt.id}`}>
                    <circle cx={px} cy={py} r="5" fill="#facc15" stroke="#ffffff" strokeWidth="2" />
                    <text
                      x={px}
                      y={py - 9}
                      fill="#bbf7d0"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {pt.speed} m/s
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
