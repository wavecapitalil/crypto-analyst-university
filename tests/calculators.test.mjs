import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluateCalculator,TOOL_DEFINITIONS} from '../app/features/tools/calculators.js';

test('calculator registry has unique stable ids',()=>{
  assert.equal(new Set(TOOL_DEFINITIONS.map(x=>x.id)).size,TOOL_DEFINITIONS.length);
});

test('calculator math is explicit and deterministic',()=>{
  assert.equal(evaluateCalculator('vmc',{vol:20,mc:100})?.value,0.2);
  assert.equal(evaluateCalculator('dc',{bb:10,burn:5,dist:5,iss:20})?.value,1);
  assert.equal(evaluateCalculator('ftp',{fv:1000,fs:100})?.value,10);
});

test('calculator division by zero fails closed',()=>{
  assert.equal(Number.isNaN(evaluateCalculator('vmc',{vol:1,mc:0})?.value),true);
  assert.equal(evaluateCalculator('unknown',{}),null);
});
