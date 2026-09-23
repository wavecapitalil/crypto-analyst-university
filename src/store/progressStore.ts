import type {ProgressState} from '../types/state.js';
import {loadProgress,saveProgress,resetProgress as resetStorage,importProgress as parseProgress} from './storage.js';
class ProgressStore{
 state:ProgressState=loadProgress();
 save(){saveProgress(this.state)}
 setCheck(l:number,t:number,c:number,v:boolean){this.state.topicChecks[`${l}:${t}:${c}`]=v;this.save()}
 setTopicScore(l:number,t:number,v:number){this.state.topicScores[`${l}:${t}`]=Math.max(0,Math.min(100,Number(v)||0));this.save()}
 setNote(key:string,v:string){this.state.notes[key]=v;this.save()}
 setCase(i:number,v:string){this.state.cases[String(i)]=v;this.save()}
 setChapter(n:number,value:any){this.state.chapterExams[String(n)]=value;this.save()}
 reset(){resetStorage();this.state=loadProgress()}
 import(json:string){this.state=parseProgress(json);this.save()}
}
export const progressStore=new ProgressStore();
