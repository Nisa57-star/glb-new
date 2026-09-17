export type ActiveSection = 'section1' | 'section2';

export type GLBStage = 
  | 'stimulation'
  | 'problem'
  | 'data_collection'
  | 'data_processing'
  | 'repeat_experiment'
  | 'graphs'
  | 'kupas_grafik'
  | 'verification'
  | 'cer'
  | 'generalization'
  | 'challenge'
  | 'reflection'
  | 'exit_ticket';

export interface StudentInfo {
  name: string;
  className: string;
  group: string;
  school: string;
}

export interface DataPoint {
  id: number;
  pointName: string;
  distance: number; // in meters (e.g. 5, 10, 15, 20, 25)
  userDistanceInput?: string; // student typed distance
  isDistanceCorrect?: boolean;
  time: number | null; // in seconds
  userTimeInput?: string; // student typed time
  isTimeCorrect?: boolean;
  calculatedSpeed: number | null; // s / t
  userSpeedInput?: string;
  isCorrect?: boolean;
}

export interface ExperimentRun {
  speed: number;
  data: DataPoint[];
  completedAt?: string;
}

export interface Section1Answers {
  q1Direct: string; // 'ya' | 'tidak'
  q2TotalDistance: string; // 17 m
  q3Displacement: string; // 13 m
  q4SameAlways: string; // 'tidak'
  studentNotes: string;
  completed: boolean;
}

export interface ProblemStatementAnswers {
  hypothesis: 'ya' | 'tidak' | 'belum_tahu' | '';
  whatToMeasure: string;
  relationshipIdea: string;
}

export interface DataProcessingAnswers {
  q1AreSpeedsEqual: string;
  q2MeasurementErrors: string;
  q3OutlierData: string;
}

export interface PatternAnalysisAnswers {
  q1SpeedEqual: 'sama' | 'berubah' | '';
  q2GraphShape: 'lurus' | 'melengkung' | 'mendatar' | '';
  q3Conclusion: string;
  revealedConcept: boolean;
}

export interface RepeatExperimentAnswers {
  q1DistanceCompare: string;
  q2DistanceEffect: string;
  q3SlopeEffect: string;
}

export interface GraphAnalysisAnswers {
  stShape: string;
  stSlopeMeaning: string;
  vtShape: string;
  vtParallelReason: string;
  atValue: string;
  atPhysicsMeaning: string;
}

export interface VerificationAnswers {
  q1IsConstant: string;
  q2TableEvidence: string;
  q3StEvidence: string;
  q4VtEvidence: string;
  q5AccValue: string;
}

export interface CERAnswers {
  claim: string;
  evidence: string;
  reasoning: string;
}

export interface GeneralizationAnswers {
  trajectory: string;
  speed: string;
  acceleration: string;
  stRelationship: string;
  stGraph: string;
  vtGraph: string;
  revealed: boolean;
}

export interface ChallengeAnswers {
  challenge1Distance: string;
  challenge2DoubleSpeed: string;
  challenge3Hots: string;
}

export interface ReflectionAnswers {
  q1NewThings: string;
  q2ConvincingData: string;
  q3FormulaRelationship: string;
  q4SteeperSlopeMeaning: string;
  q5HorizontalVtMeaning: string;
  q6ZeroAccMeaning: string;
  exitTicket: string;
}
