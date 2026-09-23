import test from 'node:test';
import assert from 'node:assert/strict';
import {migrateProgress} from '../app/store/migrations.js';

test('legacy positional progress migrates to stable topic ids',()=>{
  const s=migrateProgress({
    schemaVersion:1,
    topicChecks:{'0:1:2':true},
    topicScores:{'0:1':88},
    notes:{'0:1':'memo'},
    chapterExams:{},cases:{},gates:{}
  });
  assert.equal(s.schemaVersion,2);
  assert.equal(s.topicChecks['L00.T01:2'],true);
  assert.equal(s.topicScores['L00.T01'],88);
  assert.equal(s.notes['L00.T01'],'memo');
});

test('already stable progress remains stable',()=>{
  const s=migrateProgress({
    schemaVersion:2,
    topicChecks:{'L00.T01:2':true},
    topicScores:{'L00.T01':90},
    notes:{'L00.T01':'memo'},
    chapterExams:{},cases:{},gates:{}
  });
  assert.equal(s.topicScores['L00.T01'],90);
});
