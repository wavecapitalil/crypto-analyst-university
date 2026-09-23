import type {ChapterExamState,ProgressState} from '../types/state.js';

export const CURRENT_SCHEMA_VERSION=2;
function isRecord(v:unknown):v is Record<string,unknown>{return !!v&&typeof v==='object'&&!Array.isArray(v)}
function boolRecord(v:unknown){const out:Record<string,boolean>={};if(!isRecord(v))return out;for(const [k,x] of Object.entries(v))if(typeof x==='boolean')out[k]=x;return out}
function numberRecord(v:unknown){const out:Record<string,number>={};if(!isRecord(v))return out;for(const [k,x] of Object.entries(v)){const n=Number(x);if(Number.isFinite(n))out[k]=Math.max(0,Math.min(100,n))}return out}
function stringRecord(v:unknown){const out:Record<string,string>={};if(!isRecord(v))return out;for(const [k,x] of Object.entries(v))if(typeof x==='string')out[k]=x;return out}
function examRecord(v:unknown){
  const out:Record<string,ChapterExamState>={};if(!isRecord(v))return out;
  for(const [k,x] of Object.entries(v)){if(!isRecord(x))continue;const exam:ChapterExamState={};
    if(typeof x.attempted==='boolean')exam.attempted=x.attempted;
    if(typeof x.passed==='boolean')exam.passed=x.passed;
    if(Number.isFinite(Number(x.avg)))exam.avg=Math.max(0,Math.min(100,Number(x.avg)));
    if(Array.isArray(x.scores))exam.scores=x.scores.map(Number).filter(Number.isFinite).map(n=>Math.max(0,Math.min(100,n)));
    if(Array.isArray(x.answers))exam.answers=x.answers.filter((a):a is string=>typeof a==='string');
    if(typeof x.oral==='string')exam.oral=x.oral;
    if(typeof x.date==='string')exam.date=x.date;
    out[k]=exam;
  }return out;
}
export function emptyProgress():ProgressState{return {schemaVersion:CURRENT_SCHEMA_VERSION,topicChecks:{},topicScores:{},chapterExams:{},notes:{},cases:{},gates:{}}}
export function normalizeProgress(raw:unknown):ProgressState{
  const base=emptyProgress();if(!isRecord(raw))return base;
  const state:ProgressState={
    schemaVersion:CURRENT_SCHEMA_VERSION,
    topicChecks:boolRecord(raw.topicChecks),
    topicScores:numberRecord(raw.topicScores),
    chapterExams:examRecord(raw.chapterExams),
    notes:stringRecord(raw.notes),
    cases:stringRecord(raw.cases),
    gates:isRecord(raw.gates)?{...raw.gates}:{}
  };
  if(typeof raw.lastVisited==='string'&&raw.lastVisited.startsWith('/'))state.lastVisited=raw.lastVisited;
  return state;
}
