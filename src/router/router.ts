export interface Route{parts:string[];path:string}
export function currentRoute():Route{const raw=(location.hash||'#/home').replace(/^#\/?/,'');const parts=raw.split('/').filter(Boolean);return{parts:parts.length?parts:['home'],path:'/'+(parts.length?parts.join('/'):'home')}}
export function go(path:string){location.hash='#/'+path.replace(/^\//,'')}
export function onRouteChange(fn:()=>void){addEventListener('hashchange',fn)}
