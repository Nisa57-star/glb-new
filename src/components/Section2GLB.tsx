import React, { useState } from 'react';
import {
  GLBStage,
  DataPoint,
  ProblemStatementAnswers,
  DataProcessingAnswers,
  GraphAnalysisAnswers,
  VerificationAnswers,
  CERAnswers,
  GeneralizationAnswers,
  ChallengeAnswers,
  ReflectionAnswers,
  PatternAnalysisAnswers,
} from '../types';
import { GLBSimulator } from './GLBSimulator';
import { DataTableSection } from './DataTableSection';
import { GraphsSection } from './GraphsSection';
import {
  Car,
  Database,
  LineChart,
} from 'lucide-react';

interface Section2Props {
  glbStage: GLBStage;
  setGlbStage: (stage: GLBStage) => void;
  selectedSpeed: number;
  setSelectedSpeed: (speed: number) => void;
  dataPoints: DataPoint[];
  setDataPoints: React.Dispatch<React.SetStateAction<DataPoint[]>>;
  patternAnswers?: PatternAnalysisAnswers;
  setPatternAnswers?: React.Dispatch<React.SetStateAction<PatternAnalysisAnswers>>;
  problemAnswers?: ProblemStatementAnswers;
  setProblemAnswers?: React.Dispatch<React.SetStateAction<ProblemStatementAnswers>>;
  processingAnswers?: DataProcessingAnswers;
  setProcessingAnswers?: React.Dispatch<React.SetStateAction<DataProcessingAnswers>>;
  graphAnswers?: GraphAnalysisAnswers;
  setGraphAnswers?: React.Dispatch<React.SetStateAction<GraphAnalysisAnswers>>;
  verificationAnswers?: VerificationAnswers;
  setVerificationAnswers?: React.Dispatch<React.SetStateAction<VerificationAnswers>>;
  cerAnswers?: CERAnswers;
  setCerAnswers?: React.Dispatch<React.SetStateAction<CERAnswers>>;
  generalizationAnswers?: GeneralizationAnswers;
  setGeneralizationAnswers?: React.Dispatch<React.SetStateAction<GeneralizationAnswers>>;
  challengeAnswers?: ChallengeAnswers;
  setChallengeAnswers?: React.Dispatch<React.SetStateAction<ChallengeAnswers>>;
  reflectionAnswers?: ReflectionAnswers;
  setReflectionAnswers?: React.Dispatch<React.SetStateAction<ReflectionAnswers>>;
}

export const Section2GLB: React.FC<Section2Props> = ({
  selectedSpeed,
  setSelectedSpeed,
  dataPoints,
  setDataPoints,
}) => {
  // Step state: SIMULASI → UKUR → HITUNG → GRAFIK
  const [activeStep, setActiveStep] = useState<'data' | 'grafik'>('data');

  // Track completion states for indicators
  const hasRecordedDistances = dataPoints.some(
    (dp) => (dp.userDistanceInput && dp.userDistanceInput.trim() !== '') || dp.distance > 0
  );

  const hasRecordedPoints = dataPoints.some(
    (dp) => (dp.userTimeInput && dp.userTimeInput.trim() !== '') || (dp.time !== null && dp.time > 0)
  );

  const hasCalculatedSpeed = dataPoints.some(
    (dp) => (dp.userSpeedInput && dp.userSpeedInput.trim() !== '') || (dp.calculatedSpeed !== null && dp.calculatedSpeed > 0)
  );

  const isDataFilled = dataPoints.every(
    (dp) =>
      ((dp.userDistanceInput && dp.userDistanceInput.trim() !== '') || dp.distance > 0) &&
      ((dp.userTimeInput && dp.userTimeInput.trim() !== '') || (dp.time !== null && dp.time > 0)) &&
      ((dp.userSpeedInput && dp.userSpeedInput.trim() !== '') || (dp.calculatedSpeed !== null && dp.calculatedSpeed > 0))
  );

  const steps = [
    {
      id: 'data' as const,
      label: '1. Data & Hitung Kecepatan',
      short: 'Tabel Data',
      icon: <Database className="w-4 h-4" />,
      done: isDataFilled,
    },
    {
      id: 'grafik' as const,
      label: '2. Grafik Hasil Pengamatan',
      short: 'Grafik',
      icon: <LineChart className="w-4 h-4" />,
      done: isDataFilled,
    },
  ];

  const handleGoToStep = (stepId: 'data' | 'grafik') => {
    setActiveStep(stepId);
    const el = document.getElementById('step-content-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Concise Mobile Lab Overview */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-[11px] font-black bg-amber-400 text-slate-900 rounded-md uppercase tracking-wide">
              BAGIAN 2: PENYELIDIKAN GLB
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Penyelidikan Gerak Mobil (Lintasan 0 m – 25 m)
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 font-medium">
            Amati gerak mobil, catat waktu, hitung kecepatan, lalu temukan polanya.
          </p>
        </div>

        {/* Visual Praktikum Flow Steps / Pills */}
        <div className="mt-4 pt-3.5 border-t border-white/15 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-blue-200 font-semibold mr-1">Alur Penyelidikan:</span>
          <span className="px-3 py-1 rounded-lg bg-blue-500/30 text-blue-200 font-bold border border-blue-400/20 shadow-xs">
            SIMULASI
          </span>
          <span className="text-slate-400 font-bold">→</span>
          <span
            className={`px-3 py-1 rounded-lg font-bold border transition ${
              hasRecordedPoints
                ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400/30'
                : 'bg-white/10 text-slate-200 border-white/10'
            }`}
          >
            UKUR
          </span>
          <span className="text-slate-400 font-bold">→</span>
          <span
            className={`px-3 py-1 rounded-lg font-bold border transition ${
              hasCalculatedSpeed
                ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400/30'
                : 'bg-white/10 text-slate-200 border-white/10'
            }`}
          >
            HITUNG
          </span>
          <span className="text-slate-400 font-bold">→</span>
          <span
            className={`px-3 py-1 rounded-lg font-bold border transition ${
              isDataFilled
                ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400/30'
                : 'bg-white/10 text-slate-200 border-white/10'
            }`}
          >
            GRAFIK
          </span>
        </div>
      </div>

      {/* 1. SIMULATOR GLB (SIMULASI & UKUR) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">
              SIMULASI & ALAT UKUR VIRTUAL
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Gunakan tombol <strong>Start</strong> lalu tekan <strong>Catat Waktu (t)</strong>
          </span>
        </div>

        <GLBSimulator
          selectedSpeed={selectedSpeed}
          setSelectedSpeed={setSelectedSpeed}
          dataPoints={dataPoints}
          setDataPoints={setDataPoints}
          trackLength={25}
        />
      </div>

      {/* Step Anchor & Navigation Pills */}
      <div id="step-content-anchor" className="scroll-mt-6">
        <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex flex-wrap gap-1.5 shadow-2xs">
          {steps.map((s) => {
            const isActive = activeStep === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleGoToStep(s.id)}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white hover:text-slate-900'
                }`}
              >
                {s.icon}
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{s.short}</span>
                {s.done && (
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-300' : 'bg-emerald-500'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT: DATA TABLE & GRAPHS */}

      {/* STEP 1: DATA HASIL PENGAMATAN & PERHITUNGAN KECEPATAN */}
      {activeStep === 'data' && (
        <DataTableSection
          dataPoints={dataPoints}
          setDataPoints={setDataPoints}
          selectedSpeed={selectedSpeed}
          onGoToGraphs={() => handleGoToStep('grafik')}
        />
      )}

      {/* STEP 2: GRAFIK HASIL PENGAMATAN */}
      {activeStep === 'grafik' && (
        <GraphsSection
          dataPoints={dataPoints}
          speedExp1={selectedSpeed}
        />
      )}
    </div>
  );
};
