import type {Level} from '../../types/content.js';
export function gradeChapter(level:Level,scores:number[]){const avg=Math.round(scores.reduce((a,b)=>a+b,0)/Math.max(scores.length,1));const low=scores.length?Math.min(...scores):0;const criticalFailure=level.topics.some((t,i)=>!!t.deep?.critical && (scores[i]||0)<85);return{avg,low,criticalFailure,passed:avg>=85&&low>=70&&!criticalFailure}}
