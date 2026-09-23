export function safe(x) {
    const s = x == null ? '' : String(x);
    return s.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}
export const safeAttr = safe;
export function safeUrl(x) {
    const s = x == null ? '' : String(x).trim();
    try {
        const u = new URL(s, 'https://wave.local');
        return u.protocol === 'https:' || u.protocol === 'http:' ? safeAttr(s) : '#';
    }
    catch {
        return '#';
    }
}
export const list = (items, limit = 99) => `<ul>${(Array.isArray(items) ? items : []).slice(0, limit).map(x => `<li>${safe(x)}</li>`).join('')}</ul>`;
export function progressBar(pct) { return `<div class="progress"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`; }
