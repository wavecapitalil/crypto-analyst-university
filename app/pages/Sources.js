import { getManifest, getSources } from '../data/repository.js';
import { safe, safeUrl } from '../utils/html.js';
export async function sourcesPage() {
    const [m, s] = await Promise.all([getManifest(), getSources()]);
    const rows = Object.entries(s).map(([id, x]) => `<tr><td>${safe(id)}</td><td><a href="${safeUrl(x.url)}" target="_blank" rel="noopener noreferrer">${safe(x.title)}</a></td><td>${safe(x.type)}<div class="small">${safe(x.verification_status || '')}</div></td><td>${safe(x.note)}</td></tr>`).join('');
    return `<div class="section"><h1>Source Library</h1><div class="callout green"><b>Verification date:</b> ${safe(m.meta.as_of)}</div><table class="tbl"><tr><th>ID</th><th>מקור</th><th>סוג</th><th>למה משתמשים בו</th></tr>${rows}</table></div>`;
}
