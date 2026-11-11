import test from 'node:test';
import assert from 'node:assert/strict';
import { attempt, fuseOpen, nextStep, startManeuver, switchSteps, type SwitchAction } from './labs/cortacircuitos/procedure';

function run(actions:SwitchAction[]){let state=startManeuver();const results=actions.map(a=>{const r=attempt(state,a);state=r.state;return r;});return {state,results};}
const PREP:SwitchAction[]=['orden','epp','pertiga','posicion'];
const ALL:SwitchAction[]=[...PREP,'fase-2','fase-1','fase-3','fase-3','fase-1','fase-2'];

test('preparation first, then open the central phase and the laterals, and close in reverse order',()=>{
  assert.deepEqual(switchSteps.map(s=>s.id),['orden','epp','pertiga','posicion','abrir-2','abrir-1','abrir-3','cerrar-3','cerrar-1','cerrar-2']);
});
test('the whole maneuver in order finishes with no errors',()=>{
  const {state,results}=run(ALL);
  assert.ok(results.every(r=>r.ok&&!r.spark));
  assert.equal(state.finished,true);assert.equal(state.errors,0);assert.equal(nextStep(state),null);
  assert.deepEqual([1,2,3].map(n=>fuseOpen(state,n)),[false,false,false]);
});
test('picking a fuse opens it the first time and closes it the second',()=>{
  const {state}=run([...PREP,'fase-2']);
  assert.equal(fuseOpen(state,2),true);assert.equal(fuseOpen(state,1),false);
});
test('standing under the cutouts is an error that explains the risk',()=>{
  const r=attempt(run(['orden','epp','pertiga']).state,'debajo');
  assert.equal(r.ok,false);assert.equal(r.state.errors,1);assert.match(r.message,/debajo/i);assert.equal(nextStep(r.state)?.id,'posicion');
});
test('operating a fuse before the preparation is a sequence error and moves nothing',()=>{
  const r=attempt(startManeuver(),'fase-2');
  assert.equal(r.ok,false);assert.equal(r.spark,false);assert.equal(r.state.errors,1);assert.equal(fuseOpen(r.state,2),false);
  assert.match(r.message,/orden de maniobra/i);
});
test('opening a lateral first draws an arc, is counted and leaves the fuse closed',()=>{
  const r=attempt(run(PREP).state,'fase-3');
  assert.equal(r.ok,false);assert.equal(r.spark,true);assert.equal(r.state.errors,1);assert.equal(fuseOpen(r.state,3),false);
  assert.match(r.message,/central/i);
});
test('closing out of reverse order is also an arc',()=>{
  const r=attempt(run([...PREP,'fase-2','fase-1','fase-3']).state,'fase-2');
  assert.equal(r.spark,true);assert.equal(r.state.errors,1);assert.equal(fuseOpen(r.state,2),true);
});
test('repeating a finished preparation step is not an error',()=>{
  const r=attempt(run(['orden']).state,'orden');
  assert.equal(r.ok,false);assert.equal(r.state.errors,0);
});
test('a finished maneuver accepts nothing more',()=>{
  const {state}=run(ALL);
  const r=attempt(state,'fase-2');
  assert.equal(r.ok,false);assert.equal(r.state.errors,0);assert.match(r.message,/reinicia/i);
});
