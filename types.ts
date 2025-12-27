
export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER'
}

export interface Option {
  id: string;
  text: string;
}

export interface TrueFalsePart {
  id: string;
  label: string;
  statement: string;
  correct: boolean;
}

export interface Question {
  id: number;
  type: QuestionType;
  content: string;
  options?: Option[];
  correctOption?: string;
  trueFalseParts?: TrueFalsePart[];
  shortAnswerCorrect?: string;
  imageHint?: string;
  bbtData?: any;
}

export interface ExamSet {
  id: number;
  name: string;
  questions: Question[];
}

export interface StudentInfo {
  name: string;
  className: string;
  examId: number;
}

export interface LeaderboardEntry {
  name: string;
  className: string;
  score: number;
  timeSpent: number; // in seconds
  timestamp: string;
}

export interface UserAnswer {
  questionId: number;
  answer: string | Record<string, boolean>; // Option ID for MCQ, Map for TF, string for Short
}
