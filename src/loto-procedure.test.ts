import test from 'node:test';
import assert from 'node:assert/strict';
import { lotoSteps, startProcedure, attempt, nextStep, type LotoAction } from './labs/industrial/procedure';

const order=lotoSteps.map(s=>s.id);
function run(actions:LotoAction[]){let state=startProcedure();const results=actions.map(a=>{const r=attempt(state,a);state=r.state;return r;});return {state,results};}

test('the procedure has the six steps in the safe order',()=>{
  assert.deepEqual(order,['avisar','apagar','aislar','bloquear','liberar','verificar']);
});
test('doing every step in order finishes with no errors',()=>{
  const {state,results}=run(order);
  assert.ok(results.every(r=>r.ok));
  assert.equal(state.finished,true);assert.equal(state.errors,0);assert.equal(nextStep(state),null);
});
test('a step out of order is refused, counted and leaves the state unchanged',()=>{
  const before=startProcedure(),r=attempt(before,'aislar');
  assert.equal(r.ok,false);assert.equal(r.state.errors,1);assert.deepEqual(r.state.done,before.done);
  assert.match(r.message,/apagar|avis/i);
});
test('every step other than the next one is refused with its own reason',()=>{
  for(const action of order.slice(1)){
    const r=attempt(startProcedure(),action);
    assert.equal(r.ok,false,action);assert.ok(r.message.length>20,action);
  }
});
test('repeating a finished step is harmless and is not an error',()=>{
  const first=attempt(startProcedure(),'avisar'),again=attempt(first.state,'avisar');
  assert.equal(again.ok,false);assert.equal(again.state.errors,0);assert.deepEqual(again.state.done,['avisar']);
});
test('the hint always names the next pending step',()=>{
  let state=startProcedure();
  for(const id of order){assert.equal(nextStep(state)?.id,id);state=attempt(state,id).state;}
});
test('errors accumulate and a finished procedure accepts nothing more',()=>{
  const {state}=run(['bloquear','liberar',...order]);
  assert.equal(state.errors,2);assert.equal(state.finished,true);
  assert.equal(attempt(state,'verificar').state.errors,2);
});
