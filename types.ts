
export enum Domain {
  Philosophy = "Philosophy & Features",
  CRUD = "CRUD Operations",
  Indexes = "Indexes",
  ServerAdmin = "Server Administration",
  Monitoring = "Monitoring",
  Security = "Security",
  Replication = "Replication",
  Backup = "Backup & Recovery",
  Final = "MongoDBA Final Exam"
}

export interface Question {
  id: string;
  domain: Domain;
  objectiveId: string;
  scenario: string;
  code?: string;
  questionText: string;
  options: string[];
  correctAnswers: number[]; 
  type: 'single' | 'multiple';
  selectCount: number; // e.g., 1, 2, 3
  explanation: string;
  difficulty: 'Medium' | 'High' | 'Expert';
  isUnscored?: boolean;
}

export interface ExamSet {
  setNumber: number;
  questions: Question[];
}

export interface Cart {
  domain: Domain;
  sets: ExamSet[];
}

export interface ExamSession {
  id: string;
  domain: Domain;
  setNumber?: number;
  questions: Question[];
  userAnswers: (number[] | null)[];
  startTime: number;
  completed: boolean;
}

export interface DomainScore {
  domain: Domain;
  score: number;
  total: number;
  percentage: number;
}

export interface Analytics {
  overallPercentage: number;
  domainScores: DomainScore[];
  weakObjectives: string[];
  passProbability: number;
  timePerQuestion: number;
}
