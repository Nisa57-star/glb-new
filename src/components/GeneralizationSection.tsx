import React, { useState } from 'react';
import { GeneralizationAnswers } from '../types';
import { Lightbulb, Award, CheckCircle2, Sparkles, Unlock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GeneralizationProps {
  answers: GeneralizationAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<GeneralizationAnswers>>;
}

export const GeneralizationSection: React.FC<GeneralizationProps> = ({
  answers,
  setAnswers,
}) => {
  const [showValidationWarning, setShowValidationWarning] = useState(false);

  const handleRevealConcept = () => {
    // Check if at least basic answers are selected/typed
    if (
      !answers.trajectory ||
      !answers.speed ||
      !answers.acceleration ||
      !answers.stRelationship
    ) {
      setShowValidationWarning(true);
      return;
    }

    setShowValidationWarning(false);
    setAnswers((prev) => ({ ...prev, revealed: true }));

    // Celebration confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            TAHAP L: GENERALIZATION (MENARIK KESIMPULAN UMUM)
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            Temukan Konsep Gerak Lurus Beraturan (GLB)
          </h3>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-600">
        Berdasarkan seluruh hasil eksperimen, data tabel, dan analisis grafikmu, rangkumlah ciri-ciri gerak yang kamu temukan secara mandiri:
      </p>

      {/* Discovery Form */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
        <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <span>🔍 Ciri-ciri gerak yang saya temukan:</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          {/* Lintasan */}
          <div className="space-y-1.5 bg-white p-3.5 rounded-lg border border-slate-200">
            <label className="block font-bold text-slate-800">
              1. Bentuk Lintasan:
            </label>
            <select
              value={answers.trajectory}
              onChange={(e) => setAnswers((prev) => ({ ...prev, trajectory: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Pilih Bentuk Lintasan --</option>
              <option value="Lurus">Garis Lurus (Lintasan Lurus)</option>
              <option value="Melingkar">Melingkar</option>
              <option value="Parabola">Parabola (Melengkung)</option>
              <option value="Zig-zag">Zig-zag / Acak</option>
            </select>
          </div>

          {/* Kecepatan */}
          <div className="space-y-1.5 bg-white p-3.5 rounded-lg border border-slate-200">
            <label className="block font-bold text-slate-800">
              2. Karakteristik Kecepatan (v):
            </label>
            <select
              value={answers.speed}
              onChange={(e) => setAnswers((prev) => ({ ...prev, speed: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Pilih Sifat Kecepatan --</option>
              <option value="Tetap">Tetap / Konstan (Tidak Berubah)</option>
              <option value="Semakin Cepat">Semakin Cepat (Dipercepat)</option>
              <option value="Semakin Lambat">Semakin Lambat (Diperlambat)</option>
              <option value="Berubah Acak">Berubah-ubah Tidak Beraturan</option>
            </select>
          </div>

          {/* Percepatan */}
          <div className="space-y-1.5 bg-white p-3.5 rounded-lg border border-slate-200">
            <label className="block font-bold text-slate-800">
              3. Nilai Percepatan (a):
            </label>
            <select
              value={answers.acceleration}
              onChange={(e) => setAnswers((prev) => ({ ...prev, acceleration: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Pilih Nilai Percepatan --</option>
              <option value="Nol">Nol (a = 0 m/s², karena Δv = 0)</option>
              <option value="Positif Tetap">Positif dan Tetap (a &gt; 0)</option>
              <option value="Negatif">Negatif (a &lt; 0)</option>
              <option value="Tidak Terdefinisi">Tidak Terdefinisi</option>
            </select>
          </div>

          {/* Hubungan Jarak & Waktu */}
          <div className="space-y-1.5 bg-white p-3.5 rounded-lg border border-slate-200">
            <label className="block font-bold text-slate-800">
              4. Hubungan Jarak (s) dan Waktu (t):
            </label>
            <select
              value={answers.stRelationship}
              onChange={(e) => setAnswers((prev) => ({ ...prev, stRelationship: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Pilih Hubungan s dan t --</option>
              <option value="Sebanding">Sebanding Lurus / Linear (s = v × t)</option>
              <option value="Berbanding Terbalik">Berbanding Terbalik</option>
              <option value="Kuadratik">Kuadratik (Pangkat Dua)</option>
            </select>
          </div>

          {/* Bentuk Grafik s-t */}
          <div className="space-y-1.5 bg-white p-3.5 rounded-lg border border-slate-200">
            <label className="block font-bold text-slate-800">
              5. Bentuk Grafik s–t (Jarak–Waktu):
            </label>
            <input
              type="text"
              value={answers.stGraph}
              onChange={(e) => setAnswers((prev) => ({ ...prev, stGraph: e.target.value }))}
              placeholder="Contoh: Garis lurus miring ke atas (kemiringan = v)..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Bentuk Grafik v-t */}
          <div className="space-y-1.5 bg-white p-3.5 rounded-lg border border-slate-200">
            <label className="block font-bold text-slate-800">
              6. Bentuk Grafik v–t (Kecepatan–Waktu):
            </label>
            <input
              type="text"
              value={answers.vtGraph}
              onChange={(e) => setAnswers((prev) => ({ ...prev, vtGraph: e.target.value }))}
              placeholder="Contoh: Garis lurus mendatar / horizontal..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {showValidationWarning && (
          <p className="text-xs text-rose-600 font-semibold">
            *Silakan lengkapi pilihan ciri-ciri gerak di atas sebelum membuka konsep resmi.
          </p>
        )}

        <div className="pt-2 flex justify-center">
          <button
            onClick={handleRevealConcept}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-sm rounded-xl shadow-md active:scale-98 transition cursor-pointer"
          >
            <Unlock className="w-4 h-4" />
            <span>KUNCI JAWABAN: BUKA KONSEP ILMIAH GLB</span>
          </button>
        </div>
      </div>

      {/* Official Concept Banner (Revealed) */}
      {answers.revealed && (
        <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl border-2 border-amber-400/80 animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              KONSEP RESMI YANG KAMU TEMUKAN
            </span>
            <span className="text-xs text-slate-300">Fisika SMP Kelas 7</span>
          </div>

          <div className="py-2">
            <blockquote className="text-lg sm:text-2xl font-black text-amber-200 tracking-tight leading-relaxed">
              “Gerak Lurus Beraturan (GLB) adalah gerak benda pada lintasan lurus dengan kecepatan tetap sehingga percepatannya nol.”
            </blockquote>
          </div>

          {/* Mathematical Summary Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
              <span className="block text-slate-400 text-[10px] font-sans">PERSAMAAN JARAK</span>
              <strong className="text-cyan-300 text-sm">s = v × t</strong>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
              <span className="block text-slate-400 text-[10px] font-sans">PERSAMAAN KECEPATAN</span>
              <strong className="text-emerald-300 text-sm">v = s / t = Tetap</strong>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-center">
              <span className="block text-slate-400 text-[10px] font-sans">PERCEPATAN</span>
              <strong className="text-amber-300 text-sm">a = Δv/Δt = 0 m/s²</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
