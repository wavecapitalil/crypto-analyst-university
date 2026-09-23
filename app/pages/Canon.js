import { getCanon, getSources } from '../data/repository.js';
import { sourceGrid } from '../components/SourceGrid.js';
export async function canonPage() { const [canon, sources] = await Promise.all([getCanon(), getSources()]); return `<div class="section"><h1>Research Canon</h1><div class="callout green"><b>איך לקרוא:</b> primary docs → data methodology → independent/academic research.</div>${Object.entries(canon).map(([group, ids]) => `<div class="academy"><div class="ahead"><h3>${group}</h3></div><div style="padding:12px">${sourceGrid(ids, sources)}</div></div>`).join('')}</div>`; }
