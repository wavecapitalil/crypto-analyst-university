import type {ProgressState} from '../types/state.js';
import {normalizeProgress,CURRENT_SCHEMA_VERSION} from './schema.js';
import {stableTopicId} from '../features/learning/topicIdentity.js';
function mapObject(v:unknown,kind:'score'|'check'|'note'){
  if(!v||typeof v!=='object'||Array.isArray(v))return v;
  const out:Record<string,unknown>={};
  for(const [k,x] of Object.entries(v as Record<string,unknown>)){
    let target=k;
    if(kind==='check'){
      const m=/^(\d+):(\d+):(\d+)$/.exec(k);
      if(m)target=`${stableTopicId(Number(m[1]),Number(m[2]))}:${m[3]}`;
    }else{
      const m=/^(\d+):(\d+)$/.exec(k);
      if(m)target=stableTopicId(Number(m[1]),Number(m[2]));
    }
    out[target]=x;
  }
  return out;
}
export function migrateProgress(raw:any):ProgressState{
  const version=Number(raw?.schemaVersion||0);
  if(version>=CURRENT_SCHEMA_VERSION)return normalizeProgress(raw);
  return normalizeProgress({...raw,topicScores:mapObject(raw?.topicScores,'score'),topicChecks:mapObject(raw?.topicChecks,'check'),notes:mapObject(raw?.notes,'note'),schemaVersion:CURRENT_SCHEMA_VERSION});
}
