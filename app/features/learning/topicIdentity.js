export function stableTopicId(levelId, topicIndex) {
    return `L${String(levelId).padStart(2, '0')}.T${String(topicIndex).padStart(2, '0')}`;
}
export function topicIdFromSummary(level, topicIndex) {
    return level.topicIds?.[topicIndex] || stableTopicId(level.n, topicIndex);
}
