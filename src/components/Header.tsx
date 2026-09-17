import React, { useState } from 'react';
import { ActiveSection, GLBStage, StudentInfo } from '../types';
import { Compass, Car, UserCheck, CheckCircle2, Award } from 'lucide-react';

interface HeaderProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  glbStage: GLBStage;
  setGlbStage: (stage: GLBStage) => void;
  studentInfo: StudentInfo;
  setStudentInfo: React.Dispatch<React.SetStateAction<StudentInfo>>;
  section1Done: boolean;
  conceptRevealed: boolean;
}

// Flat modern illustration of a blue car moving forward on a straight track
const HeaderCarIllustration: React.FC = () => (
  <div className="w-56 sm:w-72 md:w-84 h-16 sm:h-20 shrink-0 select-none pointer-events-none flex items-center justify-end overflow-hidden">
    <svg
      viewBox="0 0 350 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="headlightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="carBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="speedWind" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Subtle Landscape Hills in Background */}
      <path
        d="M 0 58 Q 70 38 140 52 T 280 44 Q 315 40 350 48 L 350 85 L 0 85 Z"
        fill="#f1f5f9"
      />
      <path
        d="M 60 62 Q 130 46 210 56 T 350 52 L 350 85 L 60 85 Z"
        fill="#e2e8f0"
        opacity="0.6"
      />

      {/* Minimalist Flat Trees */}
      <rect x="38" y="48" width="3" height="12" fill="#94a3b8" rx="1" />
      <circle cx="39.5" cy="44" r="8" fill="#34d399" opacity="0.85" />

      <rect x="92" y="46" width="3" height="14" fill="#94a3b8" rx="1" />
      <circle cx="93.5" cy="41" r="7" fill="#10b981" opacity="0.75" />

      <rect x="152" y="50" width="2.5" height="10" fill="#94a3b8" rx="1" />
      <circle cx="153.25" cy="46" r="6" fill="#059669" opacity="0.7" />

      {/* Straight Roadway / Track */}
      <rect x="0" y="60" width="350" height="24" rx="4" fill="#1e293b" />
      {/* Road edge curb */}
      <line x1="0" y1="60" x2="350" y2="60" stroke="#cbd5e1" strokeWidth="2" />
      {/* Dashed Center Track Line */}
      <line
        x1="0"
        y1="72"
        x2="350"
        y2="72"
        stroke="#f8fafc"
        strokeWidth="2"
        strokeDasharray="16 12"
      />

      {/* Road Milestone / Distance Post */}
      <rect x="330" y="50" width="3.5" height="11" fill="#f59e0b" rx="1" />
      <circle cx="331.75" cy="48" r="3" fill="#f59e0b" />

      {/* Motion Lines (Wind / Speed Streaks behind moving car) */}
      <line
        x1="25"
        y1="44"
        x2="175"
        y2="44"
        stroke="url(#speedWind)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="24 14"
      />
      <line
        x1="65"
        y1="50"
        x2="185"
        y2="50"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="28 12"
        opacity="0.85"
      />
      <line
        x1="110"
        y1="56"
        x2="182"
        y2="56"
        stroke="#93c5fd"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="18 10"
        opacity="0.9"
      />

      {/* Moving Blue Car */}
      <g transform="translate(10, 0)">
        {/* Car Shadow */}
        <rect x="182" y="68" width="98" height="4" rx="2" fill="#0f172a" opacity="0.5" />

        {/* Main Blue Chassis */}
        <path
          d="M 182 66 L 184 54 Q 186 49 192 47 L 212 39 Q 218 37 228 37 L 254 37 Q 262 37 267 43 L 279 50 Q 284 53 285 58 L 285 66 Q 285 67.5 283 67.5 L 184 67.5 Q 182 67.5 182 66 Z"
          fill="url(#carBodyGrad)"
        />

        {/* Cabin Windows */}
        <path
          d="M 215 41 L 228 39 L 252 39 Q 256 39 260 44 L 268 50 L 215 50 Z"
          fill="#7dd3fc"
        />
        {/* Window Pillar */}
        <line x1="239" y1="39" x2="239" y2="50" stroke="#1d4ed8" strokeWidth="2.5" />
        {/* Glass Gleam */}
        <path
          d="M 221 42 L 232 40 L 229 48 L 218 48 Z"
          fill="#ffffff"
          opacity="0.5"
        />

        {/* Front Hood Highlight */}
        <path
          d="M 268 51 L 284 55 L 284 61 L 266 61 Z"
          fill="#1e40af"
          opacity="0.35"
        />

        {/* Headlight & Beam */}
        <rect x="282" y="55" width="3" height="5" rx="1.5" fill="#fde047" />
        <polygon points="285,54 326,47 326,68 285,61" fill="url(#headlightBeam)" />

        {/* Taillight */}
        <rect x="181" y="54" width="3" height="4.5" rx="1" fill="#ef4444" />

        {/* Yellow Racing Accent Stripe */}
        <line
          x1="185"
          y1="59"
          x2="280"
          y2="59"
          stroke="#facc15"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Back Wheel */}
        <circle cx="204" cy="67" r="10" fill="#0f172a" />
        <circle cx="204" cy="67" r="8" fill="#1e293b" />
        <circle cx="204" cy="67" r="4.5" fill="#facc15" />
        <circle cx="204" cy="67" r="2" fill="#0f172a" />

        {/* Front Wheel */}
        <circle cx="264" cy="67" r="10" fill="#0f172a" />
        <circle cx="264" cy="67" r="8" fill="#1e293b" />
        <circle cx="264" cy="67" r="4.5" fill="#facc15" />
        <circle cx="264" cy="67" r="2" fill="#0f172a" />

        {/* Motion Indicator Arrow Ahead */}
        <path
          d="M 292 45 L 316 45 M 311 41 L 317 45 L 311 49"
          stroke="#2563eb"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  </div>
);

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  setActiveSection,
  studentInfo,
  setStudentInfo,
  section1Done,
  conceptRevealed,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner with Brand & Moving Car Illustration */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shadow-md font-bold text-xl shrink-0">
            🔎
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight leading-tight">
                MOBILE LAB <span className="text-blue-600">DETEKTIF GERAK</span>
              </h1>
              <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                IPA SMP Kelas 7
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
              <span>Pertemuan 1 • GLB</span>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => setShowProfileModal(true)}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 font-medium hover:underline transition cursor-pointer"
                title="Ubah identitas profil siswa"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{studentInfo.name || 'Detektif Siswa'}</span>
                <span className="text-slate-400">({studentInfo.className || '7-A'})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Car Illustration (Visual centerpiece) */}
        <div className="flex items-center justify-end">
          <HeaderCarIllustration />
        </div>
      </div>

      {/* Main Section Navigation Bar */}
      <div className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto py-1.5 gap-2 scrollbar-none">
          <div className="flex items-center gap-2 shrink-0">
            {/* Bagian 1 Tab */}
            <button
              onClick={() => setActiveSection('section1')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeSection === 'section1'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>BAGIAN 1: Jarak & Perpindahan</span>
              {section1Done && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 ml-1" />
              )}
              <span className="text-[10px] opacity-75 ml-0.5">(~20%)</span>
            </button>

            {/* Bagian 2 Tab */}
            <button
              onClick={() => setActiveSection('section2')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeSection === 'section2'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>BAGIAN 2: Eksplorasi Utama GLB</span>
              {conceptRevealed && (
                <Award className="w-3.5 h-3.5 text-amber-300 ml-1" />
              )}
              <span className="text-[10px] bg-blue-500/30 text-white px-1.5 py-0.2 rounded-full ml-0.5">
                (~80%)
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-500 hidden md:flex items-center gap-1.5 font-medium">
            <span>Penyelidikan Virtual Laboratorium Gerak Siswa SMP</span>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Identitas Detektif Gerak</h3>
                  <p className="text-xs text-slate-500">Profil siswa untuk sesi penyelidikan virtual.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Siswa / Detektif:
                </label>
                <input
                  type="text"
                  value={studentInfo.name}
                  onChange={(e) => setStudentInfo((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Contoh: Muhammad Bintang / Detektif 1"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kelas:
                  </label>
                  <input
                    type="text"
                    value={studentInfo.className}
                    onChange={(e) => setStudentInfo((prev) => ({ ...prev, className: e.target.value }))}
                    placeholder="Contoh: 7A / 7B"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kelompok:
                  </label>
                  <input
                    type="text"
                    value={studentInfo.group}
                    onChange={(e) => setStudentInfo((prev) => ({ ...prev, group: e.target.value }))}
                    placeholder="Kelompok 3"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sekolah:
                </label>
                <input
                  type="text"
                  value={studentInfo.school}
                  onChange={(e) => setStudentInfo((prev) => ({ ...prev, school: e.target.value }))}
                  placeholder="SMP Negeri 1..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition cursor-pointer"
              >
                Simpan Profil
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
