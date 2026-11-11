import test from 'node:test';
import assert from 'node:assert/strict';
import { attempt, distanceSteps, nextStep, startDistances, type DistanceAction } from './labs/distancias/procedure';

function run(actions:DistanceAction[]){let state=startDistances();const results=actions.map(a=>{const r=attempt(state,a);state=r.state;return r;});return {state,results};}
const ALL:DistanceAction[]=['linea','observador','pos-b','cubiertas','luminaria'];

test('identify, assign an observer, position the bucket, cover the phase and then work',()=>{
  assert.deepEqual(distanceSteps.map(s=>s.id),['linea','observador','pos-b','cubiertas','luminaria']);
});
test('the whole task in order finishes with no errors',()=>{
  const {state,results}=run(ALL);
  assert.ok(results.every(r=>r.ok&&!r.invasion));
  assert.equal(state.finished,true);assert.equal(state.errors,0);assert.equal(nextStep(state),null);
});
test('nothing moves before the energized parts are identified',()=>{
  const r=attempt(startDistances(),'observador');
  assert.equal(r.ok,false);assert.equal(r.state.errors,1);assert.match(r.message,/energizad/i);
});
test('raising the bucket into the danger zone is an invasion and is counted',()=>{
  const r=attempt(run(['linea','observador']).state,'pos-a');
  assert.equal(r.ok,false);assert.equal(r.invasion,true);assert.equal(r.state.errors,1);assert.match(r.message,/zona de peligro/i);
  assert.equal(nextStep(r.state)?.id,'pos-b');
});
test('a position that does not reach the work point is also an error',()=>{
  const r=attempt(run(['linea','observador']).state,'pos-c');
  assert.equal(r.ok,false);assert.equal(r.invasion,false);assert.match(r.message,/alcanza/i);
});
test('moving the bucket without an observer is a sequence error',()=>{
  const r=attempt(run(['linea']).state,'pos-b');
  assert.equal(r.ok,false);assert.equal(r.state.errors,1);assert.match(r.message,/observador/i);
});
test('working without the insulating cover is refused',()=>{
  const r=attempt(run(['linea','observador','pos-b']).state,'luminaria');
  assert.equal(r.ok,false);assert.equal(r.state.errors,1);assert.match(r.message,/cubierta/i);
});
test('repeating a finished step is not an error and a finished task accepts nothing more',()=>{
  assert.equal(attempt(run(['linea']).state,'linea').state.errors,0);
  const r=attempt(run(ALL).state,'pos-a');
  assert.equal(r.ok,false);assert.equal(r.state.errors,0);assert.match(r.message,/reinicia/i);
});
