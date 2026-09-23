import { progressStore } from '../../store/progressStore.js';
import { stableTopicId, topicIdFromSummary } from './topicIdentity.js';
export function topicKey(l, t, id) { return id || stableTopicId(l, t); }
export function checkKey(l, t, c, id) { return `${topicKey(l, t, id)}:${c}`; }
export function checkDone(l, t, c, id) { return !!progressStore.state.topicChecks[checkKey(l, t, c, id)]; }
export function topicProgress(l, t, id) {
    const topicId = id || stableTopicId(l, t);
    const checks = [0, 1, 2, 3, 4].filter(c => checkDone(l, t, c, topicId)).length;
    const score = Number(progressStore.state.topicScores[topicId] || 0);
    return { checks, score, done: checks === 5 && score >= 80, pct: Math.round((checks / 5) * 70 + (Math.min(score, 100) / 100) * 30) };
}
export function levelProgress(level) {
    let done = 0;
    for (let i = 0; i < level.topicCount; i++)
        if (topicProgress(level.n, i, topicIdFromSummary(level, i)).done)
            done++;
    const ex = progressStore.state.chapterExams[String(level.n)];
    const passed = !!ex?.passed;
    return { done, total: level.topicCount, passed, pct: Math.round((done + (passed ? 1 : 0)) / (level.topicCount + 1) * 100) };
}
export function globalStats(m) {
    let done = 0, checks = 0, checkdone = 0, passed = 0;
    for (const l of m.levels) {
        for (let i = 0; i < l.topicCount; i++) {
            const id = topicIdFromSummary(l, i);
            checks += 5;
            const p = topicProgress(l.n, i, id);
            if (p.done)
                done++;
            for (let c = 0; c < 5; c++)
                if (checkDone(l.n, i, c, id))
                    checkdone++;
        }
        if (progressStore.state.chapterExams[String(l.n)]?.passed)
            passed++;
    }
    const topics = m.levels.reduce((a, l) => a + l.topicCount, 0), exams = m.levels.length;
    return { topics, done, checks, checkdone, exams, passed, pct: Math.round((done + passed) / (topics + exams) * 100) };
}
export function academyPct(m, ids) { if (!ids.length)
    return 0; return Math.round(ids.map(id => levelProgress(m.levels.find(l => l.n === id))).reduce((a, v) => a + v.pct, 0) / ids.length); }
export function firstIncompleteLevel(m) { return m.levels.find(l => { const p = levelProgress(l); return !(p.passed && p.done === p.total); })?.n ?? null; }
