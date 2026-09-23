export const safe=(x:unknown)=>x==null?'':String(x);
export const list=(items:unknown[],limit=99)=>`<ul>${(Array.isArray(items)?items:[]).slice(0,limit).map(x=>`<li>${safe(x)}</li>`).join('')}</ul>`;
export function progressBar(pct:number){return `<div class="progress"><i style="width:${Math.max(0,Math.min(100,pct))}%"></i></div>`}
