export const safe = (x) => x == null ? '' : String(x);
export const list = (items, limit = 99) => `<ul>${(Array.isArray(items) ? items : []).slice(0, limit).map(x => `<li>${safe(x)}</li>`).join('')}</ul>`;
export function progressBar(pct) { return `<div class="progress"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`; }
