import type {ProgressState} from '../types/state.js';
export const CURRENT_SCHEMA_VERSION=1;
export function emptyProgress():ProgressState{return {schemaVersion:CURRENT_SCHEMA_VERSION,topicChecks:{},topicScores:{},chapterExams:{},notes:{},cases:{},gates:{}}}
export function normalizeProgress(raw:any):ProgressState{
 const base=emptyProgress(); if(!raw||typeof raw!=='object')return base;
 return {...base,...raw,schemaVersion:CURRENT_SCHEMA_VERSION,topicChecks:raw.topicChecks||{},topicScores:raw.topicScores||{},chapterExams:raw.chapterExams||{},notes:raw.notes||{},cases:raw.cases||{},gates:raw.gates||{}};
}
