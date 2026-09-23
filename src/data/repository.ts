import type {CaseItem, Level, Manifest, SourceItem} from '../types/content.js';

const cache = new Map<number, Level>();
let manifestPromise: Promise<Manifest> | null = null;
let sourcesPromise: Promise<Record<string, SourceItem>> | null = null;
let casesPromise: Promise<CaseItem[]> | null = null;
let canonPromise: Promise<Record<string,string[]>> | null = null;
let criticalPromise: Promise<string[]> | null = null;
let domainsPromise: Promise<Record<string,string>> | null = null;

async function getJson<T>(url:string): Promise<T> {
  const r = await fetch(url, {cache:'no-store'});
  if(!r.ok) throw new Error(`Failed to load ${url}: ${r.status}`);
  return r.json() as Promise<T>;
}
export function getManifest(){ return manifestPromise ??= getJson<Manifest>('./content/manifest.json') }
export function getSources(){ return sourcesPromise ??= getJson<Record<string, SourceItem>>('./content/sources.json') }
export function getCases(){ return casesPromise ??= getJson<CaseItem[]>('./content/cases.json') }
export function getCanon(){ return canonPromise ??= getJson<Record<string,string[]>>('./content/canon.json') }
export function getCritical(){ return criticalPromise ??= getJson<string[]>('./content/critical.json') }
export function getDomainLectures(){ return domainsPromise ??= getJson<Record<string,string>>('./content/domain-lectures.json') }
export async function getLevel(n:number): Promise<Level> {
  const existing=cache.get(n); if(existing) return existing;
  const [level,m]=await Promise.all([getJson<Level>(`./content/curriculum/level-${String(n).padStart(2,'0')}.json`),getManifest()]);
  const summary=m.levels.find(x=>x.n===n);
  level.topics.forEach((topic,i)=>{topic.id=topic.id||summary?.topicIds?.[i]||`L${String(n).padStart(2,'0')}.T${String(i).padStart(2,'0')}`});
  cache.set(n,level); return level;
}
export async function getAllLevels(): Promise<Level[]> {
  const m=await getManifest(); return Promise.all(m.levels.map(x=>getLevel(x.n)));
}
