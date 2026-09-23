import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const m=JSON.parse(fs.readFileSync(new URL('../content/manifest.json',import.meta.url),'utf8'));
const cases=JSON.parse(fs.readFileSync(new URL('../content/cases.json',import.meta.url),'utf8'));

test('manifest metadata matches declared curriculum',()=>{
  assert.equal(m.meta.levels,m.levels.length);
  assert.equal(m.meta.topics,m.levels.reduce((a,l)=>a+l.topicCount,0));
});
test('level ids are unique and ordered',()=>{
  const ids=m.levels.map(l=>l.n);
  assert.equal(new Set(ids).size,ids.length);
  assert.deepEqual(ids,[...ids].sort((a,b)=>a-b));
});
test('practice cases have unique stable ids',()=>{
  const ids=cases.map(c=>c.id);
  assert.equal(ids.every(Boolean),true);
  assert.equal(new Set(ids).size,ids.length);
});
