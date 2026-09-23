import type {SourceItem} from '../types/content.js';
import {safe,safeUrl} from '../utils/html.js';
export function sourceGrid(ids:string[],sources:Record<string,SourceItem>){
  return `<div class="sourcegrid">${(ids||[]).map(id=>{
    const s=sources[id];if(!s)return '';
    return `<div class="source"><div class="stype">${safe(id)} · ${safe(s.type)}</div><b>${safe(s.title)}</b><p class="small">${safe(s.note)}</p><a href="${safeUrl(s.url)}" target="_blank" rel="noopener noreferrer">פתח מקור ↗</a></div>`;
  }).join('')}</div>`;
}
