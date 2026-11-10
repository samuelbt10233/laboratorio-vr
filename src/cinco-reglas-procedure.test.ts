import test from 'node:test';
import assert from 'node:assert/strict';
import { ruleSteps, startProcedure, attempt, nextStep, type RuleAction } from './labs/cinco-reglas/procedure';

const order=ruleSteps.map(s=>s.id);
function run(actions:RuleAction[]){let state=startProcedure();const results=actions.map(a=>{const r=attempt(state,a);state=r.state;return r;});return {state,results};}

test('PPE first, then the five golden rules in their safe order',()=>{
  assert.deepEqual(order,['epp','abrir','bloquear','verificar','tierra','senalizar']);
});
test('doing every step in order finishes with no errors and no arc',()=>{
  const {state,results}=run(order);
  assert.ok(results.every(r=>r.ok&&!r.arc));
  assert.equal(state.finished,true);assert.equal(state.errors,0);assert.equal(state.arc,false);assert.equal(nextStep(state),null);
});
test('a harmless step out of order is refused, counted and changes nothing else',()=>{
  const r=attempt(startProcedure(),'bloquear');
  assert.equal(r.ok,false);assert.equal(r.arc,false);assert.equal(r.state.errors,1);assert.deepEqual(r.state.done,[]);
});
test('grounding before verifying the absence of voltage causes an arc and stops the practice',()=>{
  const {state,results}=run(['epp','abrir','bloquear','tierra']);
  const last=results.at(-1)!;
  assert.equal(last.ok,false);assert.equal(last.arc,true);assert.match(last.message,/arco/i);assert.match(last.message,/verific/i);
  assert.equal(state.arc,true);assert.equal(state.errors,1);assert.deepEqual(state.done,['epp','abrir','bloquear']);
  const after=attempt(state,'verificar');
  assert.equal(after.ok,false);assert.equal(after.state.errors,1);assert.match(after.message,/reinicia/i);
});
test('grounding with the line still closed also causes an arc',()=>{
  assert.equal(attempt(startProcedure(),'tierra').arc,true);
});
test('repeating a finished step is not an error',()=>{
  const first=attempt(startProcedure(),'epp'),again=attempt(first.state,'epp');
  assert.equal(again.ok,false);assert.equal(again.state.errors,0);assert.deepEqual(again.state.done,['epp']);
});
test('the hint always names the next pending step',()=>{
  let state=startProcedure();
  for(const id of order){assert.equal(nextStep(state)?.id,id);state=attempt(state,id).state;}
});
test('a finished practice accepts nothing more',()=>{
  const {state}=run(['abrir',...order]);
  assert.equal(state.errors,1);assert.equal(state.finished,true);
  assert.equal(attempt(state,'tierra').arc,false);
});
