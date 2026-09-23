import { authStore } from './authStore.js';
import { fetchRemoteProgress, upsertRemoteProgress } from '../../services/supabase.js';
import { progressStore } from '../../store/progressStore.js';
import { migrateProgress } from '../../store/migrations.js';
export const syncState = { busy: false, lastSync: '', error: '' };
let timer;
let enabled = false;
function ts(x) { const n = x ? Date.parse(x) : 0; return Number.isFinite(n) ? n : 0; }
function hasLearningData(p) {
    return Object.keys(p.topicChecks).length > 0 ||
        Object.keys(p.topicScores).length > 0 ||
        Object.keys(p.chapterExams).length > 0 ||
        Object.keys(p.notes).length > 0 ||
        Object.keys(p.cases).length > 0;
}
export async function syncProgressNow() {
    const session = await authStore.ensureSession();
    if (!session)
        return false;
    syncState.busy = true;
    syncState.error = '';
    try {
        const remoteRaw = await fetchRemoteProgress(session);
        const local = progressStore.state;
        if (!remoteRaw) {
            await upsertRemoteProgress(session, local);
        }
        else {
            const remote = migrateProgress(remoteRaw.progress);
            const localTs = ts(local.updatedAt);
            const remoteTs = ts(remote.updatedAt);
            const localHas = hasLearningData(local);
            const remoteHas = hasLearningData(remote);
            if (remoteTs > localTs || (!localHas && remoteHas)) {
                progressStore.replace(remote, false);
            }
            else if (localTs > remoteTs || (localHas && !remoteHas)) {
                await upsertRemoteProgress(session, local);
            }
            else if (localHas && remoteHas) {
                await upsertRemoteProgress(session, local);
            }
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
