import type {ChapterExamState,ProgressState} from '../types/state.js';
import {loadProgress,saveProgress,resetProgress as resetStorage,importProgress as parseProgress} from './storage.js';
import {stableTopicId} from '../features/learning/topicIdentity.js';
type Listener=()=>void;
class ProgressStore{
 state:ProgressState=loadProgress();
 private listeners=new Set<Listener>();
 subscribe(fn:Listener){this.listeners.add(fn);return()=>this.listeners.delete(fn)}
 private emit(){for(const fn of this.listeners)fn()}
 save(touch=true,notify=true){if(touch)this.state.updatedAt=new Date().toISOString();saveProgress(this.state);if(notify)this.emit()}
 replace(value:ProgressState,notify=true){this.state=value;saveProgress(this.state);if(notify)this.emit()}
 setCheck(l:number,t:number,c:number,v:boolean,id?:string){this.state.topicChecks[`${id||stableTopicId(l,t)}:${c}`]=v;this.save()}
 setTopicScore(l:number,t:number,v:number,id?:string){this.state.topicScores[id||stableTopicId(l,t)]=Math.max(0,Math.min(100,Number(v)||0));this.save()}
 setNote(key:string,v:string){this.state.notes[key]=v;this.save()}
 setCase(id:string|number,v:string){this.state.cases[String(id)]=v;this.save()}
 setChapter(n:number,value:ChapterExamState){this.state.chapterExams[String(n)]=value;this.save()}
 reset(){resetStorage();this.state=loadProgress();this.save(true,true)}
 import(json:string){this.state=parseProgress(json);this.save(true,true)}
}
export const progressStore=new ProgressStore();
