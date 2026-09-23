export interface SourceItem {
  title: string; type: string; note: string; url: string; verification_status?: string;
}
export interface WorkedExample { prompt: string; solution: string; lesson: string }
export interface DeepTopic {
  definition: string; mental: string; why: string; analyst_output?: string;
  interpret: string[]; red: string[]; workflow: string[]; evidence: string[];
  data_pull?: string[]; ic_questions?: string[]; learning_outcomes: string[];
  worked_example: WorkedExample; exam: string[]; rubric: string[];
  critical?: boolean; sources?: string[]; [key:string]: unknown;
}
export interface Topic {
  id?: string; name: string; definition: string; method?: string; trap?: string; exercise?: string; formula?: string; deep: DeepTopic;
}
export interface Level {
  n: number; id?: string; title: string; domain: string; obj: string; topics: Topic[];
  academy?: {letter?: string}; prereq?: number[]; exam?: string; source_refs: string[]; [key:string]: unknown;
}
export interface LevelSummary {
  n:number; id?:string; title:string; domain:string; obj:string; topicCount:number; topicIds?:string[];
  academy?: {letter?: string}; prereq?: number[]; exam?: string; source_refs?: string[];
}
export interface AcademyDefinition { letter:string; title:string; levelIds:number[] }
export interface Manifest {
  meta: Record<string, unknown> & {as_of:string; levels:number; topics:number};
  levels:LevelSummary[];
  academies:any[];
}
export interface CaseItem {
  id:string;
  title?:string; t?:string;
  data?:string; d?:string;
  questions?:string[]; q?:string[];
  answer?:string; a?:string;
}
