import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeProgress,CURRENT_SCHEMA_VERSION} from '../app/store/schema.js';

test('progress normalization rejects malformed values and clamps scores',()=>{
  const s=normalizeProgress({
    topicChecks:{'1:1:1':true,bad:'yes'},
    topicScores:{'1:1':120,'2:1':-4,bad:'x'},
    notes:{a:'ok',b:3},
    cases:{'1':'answer'},
    gates:[],
    lastVisited:'javascript:bad'
  });
  assert.equal(s.schemaVersion,CURRENT_SCHEMA_VERSION);
  assert.deepEqual(s.topicChecks,{'1:1:1':true});
  assert.equal(s.topicScores['1:1'],100);
  assert.equal(s.topicScores['2:1'],0);
  assert.equal(s.topicScores.bad,undefined);
  assert.deepEqual(s.notes,{a:'ok'});
  assert.deepEqual(s.gates,{});
  assert.equal(s.lastVisited,undefined);
});
