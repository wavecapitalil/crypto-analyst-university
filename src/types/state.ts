export interface ChapterExamState {
  attempted?: boolean; passed?: boolean; avg?: number; scores?: number[]; answers?: string[]; oral?: string; date?: string;
}
export interface ProgressState {
  schemaVersion: number;
  topicChecks: Record<string, boolean>;
  topicScores: Record<string, number>;
  chapterExams: Record<string, ChapterExamState>;
  notes: Record<string, string>;
  cases: Record<string, string>;
  gates: Record<string, unknown>;
  lastVisited?: string;
  updatedAt?: string;
}
