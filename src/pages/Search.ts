import {getAllLevels} from '../data/repository.js';
import {searchLevels} from '../features/search/searchEngine.js';
import {safe} from '../utils/html.js';
function decodeTerm(term:string){try{return decodeURIComponent(term||'')}catch{return term||''}}
export async function searchPage(term:string){
  const decoded=decodeTerm(term);
  const levels=await getAllLevels();
  const results=searchLevels(levels,decoded);
  return `<div class="section"><h1>חיפוש: ${safe(decoded)}</h1>${results.length?results.slice(0,100).map(x=>`<div class="card"><h3><a href="#/${x.topic===undefined?`level/${x.level}`:`topic/${x.level}/${x.topic}`}">${safe(x.title)}</a></h3><div class="muted">${safe(x.subtitle)}</div></div>`).join(''):'<p>לא נמצאו תוצאות.</p>'}</div>`;
}
