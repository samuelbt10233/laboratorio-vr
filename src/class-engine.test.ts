import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spokenText } from './narration';
import { classes, getClass } from './lessons';
import { preset, validate } from './circuit';
import { recordAppAction, pendingGoal, SessionStore, classSessionKey } from './class-engine';

test('all registered classes have unique ids, valid setups, steps and local audio',()=>{
  assert.equal(new Set(classes.map(c=>c.id)).size,classes.length);
  for(const c of classes){
    assert.ok(c.steps.length>0);assert.ok(validate(preset(c.initialPreset)));
    assert.equal(new Set(c.steps.map(s=>s.id)).size,c.steps.length);
    for(const step of c.steps)assert.ok(existsSync(`public${step.audio}`),step.audio);
  }
});
test('Ohm class validates the circuit and requires inspecting both series resistors',()=>{
  const circuit=preset('simple'),seen=new Set<string>();
  const context={circuit,selected:'S1',seen};
  assert.deepEqual(pendingGoal(getClass('ley-de-ohm').steps[0],context),{kind:'closed',part:'S1'});
  circuit.parts.find(p=>p.id==='S1')!.closed=true;
  assert.equal(pendingGoal(getClass('ley-de-ohm').steps[0],context),null);
  assert.equal(pendingGoal(getClass('ley-de-ohm').steps[1],context)?.kind,'value');
  circuit.parts.find(p=>p.id==='R1')!.value=200;
  assert.equal(pendingGoal(getClass('ley-de-ohm').steps[1],context),null);
  context.circuit=preset('series');context.selected='R1';
  assert.deepEqual(pendingGoal(getClass('ley-de-ohm').steps[2],context),{kind:'inspect',part:'R2'});
  context.selected='R2';assert.equal(pendingGoal(getClass('ley-de-ohm').steps[2],context),null);
  context.circuit.wires=[];
  assert.equal(pendingGoal(getClass('ley-de-ohm').steps[2],context)?.kind,'repair');assert.equal(seen.size,0);
});
test('parallel class can be completed independently with its own measurements',()=>{
  const context={circuit:preset('parallel'),selected:'R1',seen:new Set<string>()};
  assert.equal(pendingGoal(getClass('circuitos-en-paralelo').steps[0],context)?.kind,'inspect');
  context.selected='R2';assert.equal(pendingGoal(getClass('circuitos-en-paralelo').steps[0],context),null);
  context.seen.clear();assert.equal(pendingGoal(getClass('circuitos-en-paralelo').steps[1],context)?.kind,'value');
  context.circuit.parts.find(p=>p.id==='R2')!.value=200;
  assert.equal(pendingGoal(getClass('circuitos-en-paralelo').steps[1],context),null);
  context.seen.clear();assert.equal(pendingGoal(getClass('circuitos-en-paralelo').steps[2],context)?.kind,'inspect');
  context.selected='R1';assert.equal(pendingGoal(getClass('circuitos-en-paralelo').steps[2],context),null);
});
test('sessions preserve separate circuits and inspection progress without shared references',()=>{
  const store=new SessionStore(),key=classSessionKey(getClass('ley-de-ohm').id);
  const initial={circuit:preset('simple'),selected:'S1',step:1,seen:['R1'],completed:false};
  store.save(key,initial);store.save(classSessionKey(getClass('circuitos-en-paralelo').id),{...initial,step:0,circuit:preset('parallel')});store.save('free',{...initial,circuit:preset('empty')});
  initial.seen.push('R2');initial.circuit.parts[0].value=12;
  const saved=store.get(key)!;assert.equal(saved.step,1);assert.deepEqual(saved.seen,['R1']);assert.equal(saved.circuit.parts[0].value,6);
  saved.step=9;assert.equal(store.get(key)!.step,1);assert.equal(store.get('free')!.circuit.parts.length,1);assert.equal(store.get(classSessionKey(getClass('circuitos-en-paralelo').id))!.step,0);
});

test('recorded narration matches the current dialogue for every registered step',()=>{
  const manifest=JSON.parse(readFileSync('public/audio/narration-manifest.json','utf8'));
  for(const definition of classes)for(const step of definition.steps){
    const recording=manifest.recordings.find((entry:any)=>entry.classId===definition.id&&entry.stepId===step.id);
    assert.ok(recording,`${definition.id}/${step.id}`);assert.equal(recording.audio,step.audio);
    const text=spokenText(`${step.title} ${step.text} ${step.task}`);
    assert.equal(recording.textSha256,createHash('sha256').update(text).digest('hex'),step.id);
  }
});

test('every step has a matching recorded confirmation',()=>{
  const manifest=JSON.parse(readFileSync('public/audio/narration-manifest.json','utf8'));
  for(const definition of classes)for(const step of definition.steps){
    assert.ok(step.success.text.trim());assert.ok(existsSync(`public${step.success.audio}`));
    const recording=manifest.confirmations.find((entry:any)=>entry.classId===definition.id&&entry.stepId===step.id);
    assert.ok(recording);assert.equal(recording.audio,step.success.audio);
    assert.equal(recording.textSha256,createHash('sha256').update(spokenText(step.success.text)).digest('hex'));
  }
});


test('tutorial requires practiced actions and preserves progress separately from circuit classes',()=>{
  const tutorial=getClass('primeros-pasos'),context={circuit:preset(tutorial.initialPreset),selected:'V1',seen:new Set<string>()};
  assert.equal(pendingGoal(tutorial.steps[0],context),null);
  assert.equal(pendingGoal(tutorial.steps[1],context)?.kind,'inspect');
  context.selected='R1';assert.equal(pendingGoal(tutorial.steps[1],context),null);
  context.seen.clear();
  for(const [index,action] of [[2,'move'],[6,'charts'],[7,'save']] as const){
    assert.equal(pendingGoal(tutorial.steps[index],context)?.kind,'action');
    context.seen.add(`action:${action}`);assert.equal(pendingGoal(tutorial.steps[index],context),null);context.seen.clear();
  }
  assert.equal(pendingGoal(tutorial.steps[3],context)?.kind,'value');
  context.circuit.parts.find(p=>p.id==='R1')!.value=200;assert.equal(pendingGoal(tutorial.steps[3],context),null);
  assert.equal(pendingGoal(tutorial.steps[4],context)?.kind,'closed');
  context.circuit.parts.find(p=>p.id==='S1')!.closed=true;assert.equal(pendingGoal(tutorial.steps[4],context),null);
  assert.equal(pendingGoal(tutorial.steps[5],context)?.kind,'action');
  context.seen.add('action:disconnect');
  const next=pendingGoal(tutorial.steps[5],context);assert.ok(next?.kind==='action');assert.equal(next.action,'connect');
  const store=new SessionStore();store.save(classSessionKey(tutorial.id),{circuit:context.circuit,selected:'R1',step:5,seen:[...context.seen],completed:false});
  const restored=store.get(classSessionKey(tutorial.id))!;
  assert.equal(pendingGoal(tutorial.steps[5],{...restored,seen:new Set(restored.seen)})?.kind,'action');
  context.seen.add('action:connect');assert.equal(pendingGoal(tutorial.steps[5],context),null);
  context.seen.clear();assert.equal(pendingGoal(tutorial.steps[5],context)?.kind,'action');
  assert.equal(store.get(classSessionKey('ley-de-ohm')),undefined);
});


test('tutorial ignores actions outside the pending step and checks the reconnected endpoints',()=>{
  const tutorial=getClass('primeros-pasos'),context={circuit:preset('simple'),selected:'R1',seen:new Set<string>()};
  assert.equal(recordAppAction(tutorial.steps[2],context,'save'),false);
  assert.equal(context.seen.size,0);
  assert.equal(recordAppAction(tutorial.steps[2],context,'move'),true);
  context.seen.clear();const cableStep=tutorial.steps[5];
  assert.equal(recordAppAction(cableStep,context,'connect',{a:'V1:0',b:'R1:0'}),false);
  assert.equal(recordAppAction(cableStep,context,'disconnect',{a:'V1:0',b:'R1:0'}),true);
  assert.equal(recordAppAction(cableStep,context,'connect',{a:'V1:0',b:'R1:1'}),false);
  assert.equal(recordAppAction(cableStep,context,'connect',{a:'R1:0',b:'V1:0'}),true);
  assert.equal(pendingGoal(cableStep,context),null);
});
