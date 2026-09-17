import React from 'react';
import { VerificationAnswers, CERAnswers } from '../types';
import { ShieldCheck, Award, HelpCircle, Check, Sparkles } from 'lucide-react';

interface VerificationProps {
  verificationAnswers: VerificationAnswers;
  setVerificationAnswers: React.Dispatch<React.SetStateAction<VerificationAnswers>>;
  cerAnswers: CERAnswers;
  setCerAnswers: React.Dispatch<React.SetStateAction<CERAnswers>>;
}

export const VerificationAndCERSection: React.FC<VerificationProps> = ({
  verificationAnswers,
  setVerificationAnswers,
  cerAnswers,
  setCerAnswers,
}) => {
  return (
    <div className="space-y-6">
      {/* TAHAP J: VERIFICATION */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              TAHAP J: VERIFICATION (PEMBUKTIAN DUGAAN AWAL)
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Apakah Dugaan Awalmu Terbukti Secara Ilmiah?
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          Uji kembali hipotesismu dengan menjawab 5 pertanyaan verifikasi berdasarkan data tabel dan grafik yang telah kamu hasilkan:
        </p>

        <div className="space-y-4">
          {/* Q1 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-800">
              1. Apakah kecepatan mobil pada simulasi bernilai tetap (konstan)?
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setVerificationAnswers((prev) => ({ ...prev, q1IsConstant: 'tetap' }))}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border transition ${
                  verificationAnswers.q1IsConstant === 'tetap'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Ya, Kecepatan Mobil Selalu Tetap
              </button>
              <button
                type="button"
                onClick={() => setVerificationAnswers((prev) => ({ ...prev, q1IsConstant: 'berubah' }))}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border transition ${
                  verificationAnswers.q1IsConstant === 'berubah'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Tidak, Kecepatan Berubah
              </button>
            </div>
          </div>

          {/* Q2: Bukti Tabel */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-800">
              2. Apa bukti dari tabel pengamatan yang mendukung bahwa kecepatannya tetap?
            </label>
            <input
              type="text"
              value={verificationAnswers.q2TableEvidence}
              onChange={(e) => setVerificationAnswers((prev) => ({ ...prev, q2TableEvidence: e.target.value }))}
              placeholder="Contoh: Perhitungan v = s/t di titik 1 sampai 5 menghasilkan angka yang sama..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          {/* Q3: Bukti Grafik s-t */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-800">
              3. Apa bukti dari grafik jarak–waktu (s–t)?
            </label>
            <input
              type="text"
              value={verificationAnswers.q3StEvidence}
              onChange={(e) => setVerificationAnswers((prev) => ({ ...prev, q3StEvidence: e.target.value }))}
              placeholder="Contoh: Titik-titik membentuk garis lurus miring yang linear dan teratur..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          {/* Q4: Bukti Grafik v-t */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-800">
              4. Apa bukti dari grafik kecepatan–waktu (v–t)?
            </label>
            <input
              type="text"
              value={verificationAnswers.q4VtEvidence}
              onChange={(e) => setVerificationAnswers((prev) => ({ ...prev, q4VtEvidence: e.target.value }))}
              placeholder="Contoh: Grafiknya mendatar (sejajar sumbu waktu), tidak naik dan tidak turun..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          {/* Q5: Nilai Percepatan */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-800">
              5. Bagaimana nilai percepatannya (a)? Mengapa demikian?
            </label>
            <input
              type="text"
              value={verificationAnswers.q5AccValue}
              onChange={(e) => setVerificationAnswers((prev) => ({ ...prev, q5AccValue: e.target.value }))}
              placeholder="Contoh: a = 0 m/s², karena tidak ada perubahan kecepatan (Δv = 0)..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* TAHAP K: CLAIM - EVIDENCE - REASONING (CER) */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-7 shadow-md border border-indigo-800 space-y-5">
        <div className="flex items-center gap-3 border-b border-indigo-800/80 pb-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              TAHAP K: ARGUMENTASI ILMIAH
            </span>
            <h3 className="text-base sm:text-lg font-black text-white">
              BUKTIKAN PENEMUANMU (Claim – Evidence – Reasoning)
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          Sebagai Detektif Gerak, susunlah kesimpulan argumentatif ilmiah dengan format standar sains modern:
        </p>

        <div className="space-y-4 text-slate-800">
          {/* CLAIM */}
          <div className="p-4 bg-white/95 rounded-xl border border-indigo-200 space-y-2 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-black rounded-md">
                1. CLAIM (Klaim / Pernyataan)
              </span>
            </div>
            <p className="text-xs font-bold text-slate-700">
              “Mobil pada simulasi mengalami Gerak Lurus Beraturan (GLB) karena...”
            </p>
            <textarea
              rows={2}
              value={cerAnswers.claim}
              onChange={(e) => setCerAnswers((prev) => ({ ...prev, claim: e.target.value }))}
              placeholder="Lengkapi pernyataan klaimmu (bergerak pada lintasan lurus dan melaju dengan kecepatan tetap)..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          {/* EVIDENCE */}
          <div className="p-4 bg-white/95 rounded-xl border border-indigo-200 space-y-2 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-600 text-white text-xs font-black rounded-md">
                2. EVIDENCE (Bukti Nyata Data & Grafik)
              </span>
            </div>
            <p className="text-xs font-bold text-slate-700">
              “Bukti dari data dan grafik adalah...”
            </p>
            <textarea
              rows={3}
              value={cerAnswers.evidence}
              onChange={(e) => setCerAnswers((prev) => ({ ...prev, evidence: e.target.value }))}
              placeholder="Tuliskan bukti angka dari tabel (v = s/t konstan) dan bukti bentuk grafik s–t linear serta grafik v–t horizontal..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>

          {/* REASONING */}
          <div className="p-4 bg-white/95 rounded-xl border border-indigo-200 space-y-2 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-600 text-white text-xs font-black rounded-md">
                3. REASONING (Penalaran Ilmiah)
              </span>
            </div>
            <p className="text-xs font-bold text-slate-700">
              “Bukti tersebut menunjukkan GLB karena...”
            </p>
            <textarea
              rows={3}
              value={cerAnswers.reasoning}
              onChange={(e) => setCerAnswers((prev) => ({ ...prev, reasoning: e.target.value }))}
              placeholder="Hubungkan bukti dengan konsep fisika: karena rasio jarak dan waktu selalu tetap (s/t = konstan), maka kecepatan tidak berubah sehingga percepatannya nol..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
