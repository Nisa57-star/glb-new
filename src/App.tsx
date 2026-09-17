import React, { useState } from 'react';
import {
  ActiveSection,
  GLBStage,
  StudentInfo,
  DataPoint,
  Section1Answers,
  ProblemStatementAnswers,
  DataProcessingAnswers,
  GraphAnalysisAnswers,
  VerificationAnswers,
  CERAnswers,
  GeneralizationAnswers,
  ChallengeAnswers,
  ReflectionAnswers,
  PatternAnalysisAnswers,
} from './types';
import { Header } from './components/Header';
import { Section1DistanceDisplacement } from './components/Section1DistanceDisplacement';
import { Section2GLB } from './components/Section2GLB';

export default function App() {
  // Navigation
  const [activeSection, setActiveSection] = useState<ActiveSection>('section1');
  const [glbStage, setGlbStage] = useState<GLBStage>('stimulation');

  // Student Profile
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: 'Detektif Muda',
    className: '7-A',
    group: 'Kelompok 1',
    school: 'SMP Negeri',
  });

  // Section 1 State
  const [section1Answers, setSection1Answers] = useState<Section1Answers>({
    q1Direct: '',
    q2TotalDistance: '',
    q3Displacement: '',
    q4SameAlways: '',
    studentNotes: '',
    completed: false,
  });

  // Section 2: GLB Simulator Parameters
  const [selectedSpeed, setSelectedSpeed] = useState<number>(4); // default 4 m/s for Mobil 1

  // GLB Data Points (Pos 1 - Pos 5) - kolom jarak, waktu, kecepatan dikosongkan untuk diisi manual
  const initialDataPoints: DataPoint[] = [
    { id: 1, pointName: 'Pos 1', distance: 0, userDistanceInput: '', time: null, userTimeInput: '', calculatedSpeed: null, userSpeedInput: '' },
    { id: 2, pointName: 'Pos 2', distance: 0, userDistanceInput: '', time: null, userTimeInput: '', calculatedSpeed: null, userSpeedInput: '' },
    { id: 3, pointName: 'Pos 3', distance: 0, userDistanceInput: '', time: null, userTimeInput: '', calculatedSpeed: null, userSpeedInput: '' },
    { id: 4, pointName: 'Pos 4', distance: 0, userDistanceInput: '', time: null, userTimeInput: '', calculatedSpeed: null, userSpeedInput: '' },
    { id: 5, pointName: 'Pos 5', distance: 0, userDistanceInput: '', time: null, userTimeInput: '', calculatedSpeed: null, userSpeedInput: '' },
  ];
  const [dataPoints, setDataPoints] = useState<DataPoint[]>(initialDataPoints);

  // When selectedSpeed changes, if data was recorded with another speed, we can reset or update
  const handleSetSpeed1 = (speed: number) => {
    setSelectedSpeed(speed);
    // Reset data points for new speed run
    setDataPoints(initialDataPoints);
  };

  // Section 2 Answers
  const [problemAnswers, setProblemAnswers] = useState<ProblemStatementAnswers>({
    hypothesis: '',
    whatToMeasure: '',
    relationshipIdea: '',
  });

  const [processingAnswers, setProcessingAnswers] = useState<DataProcessingAnswers>({
    q1AreSpeedsEqual: '',
    q2MeasurementErrors: '',
    q3OutlierData: '',
  });

  const [graphAnswers, setGraphAnswers] = useState<GraphAnalysisAnswers>({
    stShape: '',
    stSlopeMeaning: '',
    vtShape: '',
    vtParallelReason: '',
    atValue: '',
    atPhysicsMeaning: '',
  });

  const [verificationAnswers, setVerificationAnswers] = useState<VerificationAnswers>({
    q1IsConstant: '',
    q2TableEvidence: '',
    q3StEvidence: '',
    q4VtEvidence: '',
    q5AccValue: '',
  });

  const [cerAnswers, setCerAnswers] = useState<CERAnswers>({
    claim: '',
    evidence: '',
    reasoning: '',
  });

  const [generalizationAnswers, setGeneralizationAnswers] = useState<GeneralizationAnswers>({
    trajectory: '',
    speed: '',
    acceleration: '',
    stRelationship: '',
    stGraph: '',
    vtGraph: '',
    revealed: false,
  });

  const [challengeAnswers, setChallengeAnswers] = useState<ChallengeAnswers>({
    challenge1Distance: '',
    challenge2DoubleSpeed: '',
    challenge3Hots: '',
  });

  const [reflectionAnswers, setReflectionAnswers] = useState<ReflectionAnswers>({
    q1NewThings: '',
    q2ConvincingData: '',
    q3FormulaRelationship: '',
    q4SteeperSlopeMeaning: '',
    q5HorizontalVtMeaning: '',
    q6ZeroAccMeaning: '',
    exitTicket: '',
  });

  const [patternAnswers, setPatternAnswers] = useState<PatternAnalysisAnswers>({
    q1SpeedEqual: '',
    q2GraphShape: '',
    q3Conclusion: '',
    revealedConcept: false,
  });

  const handleGoToGLB = () => {
    setActiveSection('section2');
    setGlbStage('stimulation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Header */}
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        glbStage={glbStage}
        setGlbStage={setGlbStage}
        studentInfo={studentInfo}
        setStudentInfo={setStudentInfo}
        section1Done={section1Answers.completed || section1Answers.q2TotalDistance === '17'}
        conceptRevealed={generalizationAnswers.revealed}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Section Sub-bar */}
        <div className="flex items-center justify-between text-xs text-slate-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              {activeSection === 'section1'
                ? 'Kenali jarak dan perpindahan sebelum menyelidiki GLB.'
                : 'Eksplorasi Utama: Penyelidikan Gerak Lurus Beraturan (GLB)'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activeSection === 'section1' ? (
              <button
                onClick={handleGoToGLB}
                className="text-blue-600 hover:text-blue-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Lanjut ke Penyelidikan GLB</span> →
              </button>
            ) : (
              <button
                onClick={() => setActiveSection('section1')}
                className="text-slate-500 hover:text-slate-800 hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← <span>Kembali ke Jarak & Perpindahan</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 1 or Section 2 Rendering */}
        {activeSection === 'section1' ? (
          <Section1DistanceDisplacement
            answers={section1Answers}
            setAnswers={setSection1Answers}
            onGoToGLB={handleGoToGLB}
          />
        ) : (
          <Section2GLB
            glbStage={glbStage}
            setGlbStage={setGlbStage}
            selectedSpeed={selectedSpeed}
            setSelectedSpeed={handleSetSpeed1}
            dataPoints={dataPoints}
            setDataPoints={setDataPoints}
            patternAnswers={patternAnswers}
            setPatternAnswers={setPatternAnswers}
            problemAnswers={problemAnswers}
            setProblemAnswers={setProblemAnswers}
            processingAnswers={processingAnswers}
            setProcessingAnswers={setProcessingAnswers}
            graphAnswers={graphAnswers}
            setGraphAnswers={setGraphAnswers}
            verificationAnswers={verificationAnswers}
            setVerificationAnswers={setVerificationAnswers}
            cerAnswers={cerAnswers}
            setCerAnswers={setCerAnswers}
            generalizationAnswers={generalizationAnswers}
            setGeneralizationAnswers={setGeneralizationAnswers}
            challengeAnswers={challengeAnswers}
            setChallengeAnswers={setChallengeAnswers}
            reflectionAnswers={reflectionAnswers}
            setReflectionAnswers={setReflectionAnswers}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 mt-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <p className="font-extrabold text-slate-800">
              MOBILE LAB – DETEKTIF GERAK • Laboratorium Virtual IPA Fisika SMP Kelas 7
            </p>
            <p className="text-slate-500">
              Pertemuan 1: Konsep Jarak, Perpindahan, & Penyelidikan Gerak Lurus Beraturan (GLB)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-mono font-bold text-[11px] border border-blue-100">
              s = v × t • a = 0
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
