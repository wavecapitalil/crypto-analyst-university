const cache = new Map();
let manifestPromise = null;
let sourcesPromise = null;
let casesPromise = null;
let canonPromise = null;
let criticalPromise = null;
let domainsPromise = null;
async function getJson(url) {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok)
        throw new Error(`Failed to load ${url}: ${r.status}`);
    return r.json();
}
export function getManifest() { return manifestPromise ??= getJson('./content/manifest.json'); }
export function getSources() { return sourcesPromise ??= getJson('./content/sources.json'); }
export function getCases() { return casesPromise ??= getJson('./content/cases.json'); }
export function getCanon() { return canonPromise ??= getJson('./content/canon.json'); }
export function getCritical() { return criticalPromise ??= getJson('./content/critical.json'); }
export function getDomainLectures() { return domainsPromise ??= getJson('./content/domain-lectures.json'); }
export async function getLevel(n) {
    const existing = cache.get(n);
    if (existing)
        return existing;
    const level = await getJson(`./content/curriculum/level-${String(n).padStart(2, '0')}.json`);
    cache.set(n, level);
    return level;
}
export async function getAllLevels() {
    const m = await getManifest();
    return Promise.all(m.levels.map(x => getLevel(x.n)));
}
