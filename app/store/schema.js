export const CURRENT_SCHEMA_VERSION = 1;
export function emptyProgress() { return { schemaVersion: CURRENT_SCHEMA_VERSION, topicChecks: {}, topicScores: {}, chapterExams: {}, notes: {}, cases: {}, gates: {} }; }
export function normalizeProgress(raw) {
    const base = emptyProgress();
    if (!raw || typeof raw !== 'object')
        return base;
    return { ...base, ...raw, schemaVersion: CURRENT_SCHEMA_VERSION, topicChecks: raw.topicChecks || {}, topicScores: raw.topicScores || {}, chapterExams: raw.chapterExams || {}, notes: raw.notes || {}, cases: raw.cases || {}, gates: raw.gates || {} };
}
