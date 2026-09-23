import type {Level} from '../../types/content.js';
function clampScore(v:unknown){const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.min(100,n)):0}
export function gradeChapter(level:Level,scores:number[]){
  const normalized=level.topics.map((_,i)=>clampScore(scores[i]));
  const avg=Math.round(normalized.reduce((a,b)=>a+b,0)/Math.max(normalized.length,1));
  const low=normalized.length?Math.min(...normalized):0;
  const criticalFailure=level.topics.some((t,i)=>!!t.deep?.critical&&normalized[i]<85);
  return{avg,low,criticalFailure,passed:avg>=85&&low>=70&&!criticalFailure,scores:normalized};
}
