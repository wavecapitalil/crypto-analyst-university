import { authStore } from './authStore.js';
import { fetchRemoteProgress, upsertRemoteProgress } from '../../services/supabase.js';
import { progressStore } from '../../store/progressStore.js';
import { migrateProgress } from '../../store/migrations.js';
export const syncState = { busy: false, lastSync: '', error: '' };
let timer;
let enabled = false;
function ts(x) { const n = x ? Date.parse(x) : 0; return Number.isFinite(n) ? n : 0; }
export async function syncProgressNow() {
    const session = await authStore.ensureSession();
    if (!session)
        return false;
    syncState.busy = true;
    syncState.error = '';
    try {
        const remote = await fetchRemoteProgress(session);
        const local = progressStore.state;
        if (!remote) {
            await upsertRemoteProgress(session, local);
        }
        else if (ts(remote.updatedAt) > ts(local.updatedAt)) {
            progressStore.replace(migrateProgress(remote.progress), false);
        }
        else {
            await upsertRemoteProgress(session, local);
        }
        syncState.lastSync = new Date().toISOString();
        return true;
    }
    catch (e) {
        syncState.error = e instanceof Error ? e.message : 'Sync failed';
        return false;
    }
    finally {
        syncState.busy = false;
    }
}
export function scheduleProgressSync() {
    if (!authStore.session)
        return;
    if (timer)
        clearTimeout(timer);
    timer = window.setTimeout(() => void syncProgressNow(), 900);
}
export function enableProgressAutoSync() {
    if (enabled)
        return;
    enabled = true;
    progressStore.subscribe(() => scheduleProgressSync());
}
