import { emptyProgress } from './schema.js';
import { migrateProgress } from './migrations.js';
const KEY = 'wave_crypto_uni_v10';
const LEGACY = ['wave_crypto_uni_v7'];
const MAX_IMPORT_BYTES = 5000000;
let memory = null;
function get(k) { try {
    return localStorage.getItem(k);
}
catch {
    return memory;
} }
function set(k, v) { try {
    localStorage.setItem(k, v);
}
catch {
    memory = v;
} }
function remove(k) { try {
    localStorage.removeItem(k);
}
catch {
    memory = null;
} }
export function loadProgress() {
    for (const key of [KEY, ...LEGACY]) {
        const raw = get(key);
        if (raw) {
            try {
                const state = migrateProgress(JSON.parse(raw));
                saveProgress(state);
                return state;
            }
            catch { }
        }
    }
    return emptyProgress();
}
export function saveProgress(s) { set(KEY, JSON.stringify(s)); }
export function resetProgress() { remove(KEY); for (const k of LEGACY)
    remove(k); }
export function exportProgress(s) { return JSON.stringify(s, null, 2); }
export function importProgress(json) {
    if (typeof json !== 'string' || json.length > MAX_IMPORT_BYTES)
        throw new Error('Progress file is invalid or too large');
    return migrateProgress(JSON.parse(json));
}
