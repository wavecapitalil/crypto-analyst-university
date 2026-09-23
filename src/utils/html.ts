export function safe(x:unknown){
  const s=x==null?'':String(x);
  return s.replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch] as string));
}
export const safeAttr=safe;
export function safeUrl(x:unknown){
  const s=x==null?'':String(x).trim();
  try{
    const u=new URL(s,'https://wave.local');
    return u.protocol==='https:'||u.protocol==='http:'?safeAttr(s):'#';
  }catch{return '#'}
}
export const list=(items:unknown[],limit=99)=>`<ul>${(Array.isArray(items)?items:[]).slice(0,limit).map(x=>`<li>${safe(x)}</li>`).join('')}</ul>`;
export function progressBar(pct:number){return `<div class="progress"><i style="width:${Math.max(0,Math.min(100,pct))}%"></i></div>`}
