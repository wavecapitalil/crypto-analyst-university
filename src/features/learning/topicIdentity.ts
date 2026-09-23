export function stableTopicId(levelId:number,topicIndex:number){
  return `L${String(levelId).padStart(2,'0')}.T${String(topicIndex).padStart(2,'0')}`;
}
export function topicIdFromSummary(level:{n:number;topicIds?:string[]},topicIndex:number){
  return level.topicIds?.[topicIndex]||stableTopicId(level.n,topicIndex);
}
