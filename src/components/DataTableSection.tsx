import React from 'react';
import { DataPoint } from '../types';
import { Database, Sparkles, RotateCcw } from 'lucide-react';

interface DataTableProps {
  dataPoints: DataPoint[];
  setDataPoints: React.Dispatch<React.SetStateAction<DataPoint[]>>;
  selectedSpeed: number;
  onGoToGraphs?: () => void;
}

export const DataTableSection: React.FC<DataTableProps> = ({
  dataPoints,
  setDataPoints,
}) => {
  // Handle student manual entry for distance s
  const handleUserDistanceChange = (index: number, val: string) => {
    setDataPoints((prev) => {
      const copy = [...prev];
      const clean = val.replace(',', '.');
      const parsed = parseFloat(clean);
      copy[index] = {
        ...copy[index],
        userDistanceInput: val,
        distance: !isNaN(parsed) && parsed > 0 ? parsed : 0,
      };
      return copy;
    });
  };

  // Handle student manual entry for time t
  const handleUserTimeChange = (index: number, val: string) => {
    setDataPoints((prev) => {
      const copy = [...prev];
      const clean = val.replace(',', '.');
      const parsed = parseFloat(clean);
      copy[index] = {
        ...copy[index],
        userTimeInput: val,
        time: !isNaN(parsed) && parsed > 0 ? parsed : null,
      };
      return copy;
    });
  };

  // Handle student manual entry for speed v = s / t
  const handleUserSpeedChange = (index: number, val: string) => {
    setDataPoints((prev) => {
      const copy = [...prev];
      const clean = val.replace(',', '.');
      const parsed = parseFloat(clean);
      copy[index] = {
        ...copy[index],
        userSpeedInput: val,
        calculatedSpeed: !isNaN(parsed) && parsed > 0 ? parsed : null,
      };
      return copy;
    });
  };

  // Helper to clear all table inputs back to completely empty
  const handleClearTable = () => {
    setDataPoints((prev) =>
      prev.map((dp) => ({
        ...dp,
        distance: 0,
        userDistanceInput: '',
        isDistanceCorrect: undefined,
        time: null,
        userTimeInput: '',
        isTimeCorrect: undefined,
        calculatedSpeed: null,
        userSpeedInput: '',
        isCorrect: undefined,
      }))
    );
  };

  const hasAnyData = dataPoints.some(
    (p) =>
      (p.userDistanceInput && p.userDistanceInput.trim() !== '') ||
      p.distance > 0 ||
      (p.userTimeInput && p.userTimeInput.trim() !== '') ||
      (p.time !== null && p.time > 0) ||
      (p.userSpeedInput && p.userSpeedInput.trim() !== '')
  );

  return (
    <div className="space-y-4">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Tabel Pengamatan & Perhitungan Kecepatan
            </h3>
            <p className="text-xs text-slate-500">
              Kolom jarak, waktu, dan kecepatan dikosongkan untuk diisi manual oleh siswa
            </p>
          </div>
        </div>

        {/* Action helper buttons */}
        {hasAnyData && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearTable}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
              title="Kosongkan kembali semua kolom tabel"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Kosongkan Tabel</span>
            </button>
          </div>
        )}
      </div>

      {/* Brief Instruction Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Isikan data <span className="font-bold text-slate-900 font-mono">jarak s (m)</span> dari pos lintasan, catat waktu tempuh <span className="font-bold text-amber-900 font-mono">t (s)</span> dari stopwatch simulasi, lalu hitung kecepatan <span className="font-bold text-blue-900 font-mono">v = s / t</span> sesuai data simulasi.
        </p>
      </div>

      {/* Requested Table: Jarak (m) | Waktu (s) | Kecepatan (m/s) */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
              <th className="py-3 px-4 border-r border-slate-200 w-1/3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold">Jarak (m)</span>
                  <span className="text-[10px] uppercase font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                    s
                  </span>
                </div>
              </th>
              <th className="py-3 px-4 border-r border-slate-200 w-1/3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold">Waktu (s)</span>
                  <span className="text-[10px] uppercase font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                    t
                  </span>
                </div>
              </th>
              <th className="py-3 px-4 w-1/3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-800 font-extrabold">Kecepatan (m/s)</span>
                  <span className="text-[10px] uppercase font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    v = s / t
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {dataPoints.map((dp, idx) => {
              const currentInputDistance = dp.userDistanceInput ?? (dp.distance > 0 ? dp.distance.toString() : '');
              const currentInputTime = dp.userTimeInput ?? (dp.time !== null && dp.time > 0 ? dp.time.toString() : '');
              const currentInputSpeed = dp.userSpeedInput ?? (dp.calculatedSpeed !== null && dp.calculatedSpeed > 0 ? dp.calculatedSpeed.toString() : '');

              return (
                <tr key={dp.id} className="hover:bg-slate-50/80 transition">
                  {/* Kolom 1: Jarak (m) - Siswa mengisi manual */}
                  <td className="py-3 px-4 border-r border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-bold shrink-0">
                        Pos {idx + 1}
                      </span>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={currentInputDistance}
                          onChange={(e) => handleUserDistanceChange(idx, e.target.value)}
                          placeholder=""
                          className="w-full px-3 py-2 text-xs sm:text-sm font-mono font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <span className="text-xs text-slate-500 font-mono font-bold">m</span>
                    </div>
                  </td>

                  {/* Kolom 2: Waktu (s) - Siswa mengisi manual hasil pengamatan stopwatch */}
                  <td className="py-3 px-4 border-r border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={currentInputTime}
                          onChange={(e) => handleUserTimeChange(idx, e.target.value)}
                          placeholder="Waktu..."
                          className="w-full px-3 py-2 text-xs sm:text-sm font-mono font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <span className="text-xs text-slate-500 font-mono font-bold">s</span>
                    </div>
                  </td>

                  {/* Kolom 3: Kecepatan (m/s) - Siswa menghitung dan mengisi manual v = s/t */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={currentInputSpeed}
                          onChange={(e) => handleUserSpeedChange(idx, e.target.value)}
                          placeholder="v = s/t..."
                          className="w-full px-3 py-2 text-xs sm:text-sm font-mono font-bold rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <span className="text-xs text-slate-500 font-mono font-bold">m/s</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
