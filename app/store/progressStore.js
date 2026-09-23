import { loadProgress, saveProgress, resetProgress as resetStorage, importProgress as parseProgress } from './storage.js';
import { stableTopicId } from '../features/learning/topicIdentity.js';
class ProgressStore {
    state = loadProgress();
    listeners = new Set();
    subscribe(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
    emit() { for (const fn of this.listeners)
        fn(); }
    save(touch = true, notify = true) { if (touch)
        this.state.updatedAt = new Date().toISOString(); saveProgress(this.state); if (notify)
        this.emit(); }
    replace(value, notify = true) { this.state = value; saveProgress(this.state); if (notify)
        this.emit(); }
    setCheck(l, t, c, v, id) { this.state.topicChecks[`${id || stableTopicId(l, t)}:${c}`] = v; this.save(); }
    setTopicScore(l, t, v, id) { this.state.topicScores[id || stableTopicId(l, t)] = Math.max(0, Math.min(100, Number(v) || 0)); this.save(); }
    setNote(key, v) { this.state.notes[key] = v; this.save(); }
    setCase(id, v) { this.state.cases[String(id)] = v; this.save(); }
    setChapter(n, value) { this.state.chapterExams[String(n)] = value; this.save(); }
    reset() { resetStorage(); this.state = loadProgress(); this.save(true, true); }
    import(json) { this.state = parseProgress(json); this.save(true, true); }
}
export const progressStore = new ProgressStore();
