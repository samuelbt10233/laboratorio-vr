import { test } from 'node:test';
import assert from 'node:assert/strict';
import { StepConfirmation } from './step-confirmation';
import { getClass } from './lessons';
import { pendingGoal } from './class-engine';
import { preset } from './circuit';

test('confirms a completed action immediately and only once despite redraws or repeated selections',()=>{
  const feedback=new StepConfirmation();assert.equal(feedback.observe('step',false,true),false);
  assert.equal(feedback.observe('step',true,true),true);
  assert.equal(feedback.observe('step',true,true),false);
  assert.equal(feedback.observe('step',false,true),false);
  assert.equal(feedback.observe('step',true,true),false);
});
test('does not congratulate initial or restored results or informational steps',()=>{
  const feedback=new StepConfirmation();assert.equal(feedback.observe('restored',true,true),false);
  feedback.enter();assert.equal(feedback.observe('restored',true,true),false);
  assert.equal(feedback.observe('reading',false,false),false);assert.equal(feedback.observe('reading',true,false),false);
});
test('keeps confirmations independent across steps and classes',()=>{
  const feedback=new StepConfirmation();
  for(const key of ['ohm:one','ohm:two','parallel:one']){assert.equal(feedback.observe(key,false,true),false);assert.equal(feedback.observe(key,true,true),true);}
  feedback.enter();assert.equal(feedback.observe('ohm:one',false,true),false);assert.equal(feedback.observe('ohm:one',true,true),false);
});
test('a real activity only triggers praise after the solver validates the closed circuit',()=>{
  const feedback=new StepConfirmation(),context={circuit:preset('simple'),selected:'S1',seen:new Set<string>()},step=getClass('ley-de-ohm').steps[0];
  const ready=()=>pendingGoal(step,context)===null;
  assert.equal(ready(),false);assert.equal(feedback.observe(step.id,ready(),true),false);
  context.circuit.parts.find(p=>p.id==='S1')!.closed=true;
  assert.equal(ready(),true);assert.equal(feedback.observe(step.id,ready(),true),true);
  context.circuit.wires=[];assert.equal(ready(),false);assert.equal(feedback.observe(step.id,ready(),true),false);
});
