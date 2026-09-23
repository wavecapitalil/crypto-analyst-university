import test from 'node:test';import assert from 'node:assert/strict';
test('mastery standard is 5 checkpoints + score >=80',()=>{const calc=(checks,score)=>checks===5&&score>=80;assert.equal(calc(5,80),true);assert.equal(calc(4,100),false);assert.equal(calc(5,79),false)});
