export const CURRENT_SCHEMA_VERSION = 1;
function isRecord(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
function boolRecord(v) { const out = {}; if (!isRecord(v))
    return out; for (const [k, x] of Object.entries(v))
    if (typeof x === 'boolean')
        out[k] = x; return out; }
function numberRecord(v) { const out = {}; if (!isRecord(v))
    return out; for (const [k, x] of Object.entries(v)) {
    const n = Number(x);
    if (Number.isFinite(n))
        out[k] = Math.max(0, Math.min(100, n));
} return out; }
function stringRecord(v) { const out = {}; if (!isRecord(v))
    return out; for (const [k, x] of Object.entries(v))
    if (typeof x === 'string')
        out[k] = x; return out; }
function examRecord(v) {
    const out = {};
    if (!isRecord(v))
        return out;
    for (const [k, x] of Object.entries(v)) {
        if (!isRecord(x))
            continue;
        const exam = {};
        if (typeof x.attempted === 'boolean')
            exam.attempted = x.attempted;
        if (typeof x.passed === 'boolean')
            exam.passed = x.passed;
        if (Number.isFinite(Number(x.avg)))
            exam.avg = Math.max(0, Math.min(100, Number(x.avg)));
        if (Array.isArray(x.scores))
            exam.scores = x.scores.map(Number).filter(Number.isFinite).map(n => Math.max(0, Math.min(100, n)));
        if (Array.isArray(x.answers))
            exam.answers = x.answers.filter((a) => typeof a === 'string');
        if (typeof x.oral === 'string')
            exam.oral = x.oral;
        if (typeof x.date === 'string')
            exam.date = x.date;
        out[k] = exam;
    }
    return out;
}
export function emptyProgress() { return { schemaVersion: CURRENT_SCHEMA_VERSION, topicChecks: {}, topicScores: {}, chapterExams: {}, notes: {}, cases: {}, gates: {} }; }
export function normalizeProgress(raw) {
    const base = emptyProgress();
    if (!isRecord(raw))
        return base;
    const state = {
        schemaVersion: CURRENT_SCHEMA_VERSION,
        topicChecks: boolRecord(raw.topicChecks),
        topicScores: numberRecord(raw.topicScores),
        chapterExams: examRecord(raw.chapterExams),
        notes: stringRecord(raw.notes),
        cases: stringRecord(raw.cases),
        gates: isRecord(raw.gates) ? { ...raw.gates } : {}
    };
    if (typeof raw.lastVisited === 'string' && raw.lastVisited.startsWith('/'))
        state.lastVisited = raw.lastVisited;
    return state;
}
