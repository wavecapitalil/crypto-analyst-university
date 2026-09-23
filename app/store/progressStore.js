import { loadProgress, saveProgress, resetProgress as resetStorage, importProgress as parseProgress } from './storage.js';
import { stableTopicId } from '../features/learning/topicIdentity.js';
class ProgressStore {
    state = loadProgress();
    save() { saveProgress(this.state); }
    setCheck(l, t, c, v, id) { this.state.topicChecks[`${id || stableTopicId(l, t)}:${c}`] = v; this.save(); }
    setTopicScore(l, t, v, id) { this.state.topicScores[id || stableTopicId(l, t)] = Math.max(0, Math.min(100, Number(v) || 0)); this.save(); }
    setNote(key, v) { this.state.notes[key] = v; this.save(); }
    setCase(id, v) { this.state.cases[String(id)] = v; this.save(); }
    setChapter(n, value) { this.state.chapterExams[String(n)] = value; this.save(); }
    reset() { resetStorage(); this.state = loadProgress(); }
    import(json) { this.state = parseProgress(json); this.save(); }
}
export const progressStore = new ProgressStore();
