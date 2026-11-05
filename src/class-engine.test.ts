import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spokenText } from './narration';
import { classes } from './lessons';
import { preset, validate } from './circuit';
import { pendingGoal, SessionStore, classSessionKey } from './class-engine';

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
  assert.deepEqual(pendingGoal(classes[0].steps[0],context),{kind:'closed',part:'S1'});
  circuit.parts.find(p=>p.id==='S1')!.closed=true;
  assert.equal(pendingGoal(classes[0].steps[0],context),null);
  assert.equal(pendingGoal(classes[0].steps[1],context)?.kind,'value');
  circuit.parts.find(p=>p.id==='R1')!.value=200;
  assert.equal(pendingGoal(classes[0].steps[1],context),null);
  context.circuit=preset('series');context.selected='R1';
  assert.deepEqual(pendingGoal(classes[0].steps[2],context),{kind:'inspect',part:'R2'});
  context.selected='R2';assert.equal(pendingGoal(classes[0].steps[2],context),null);
  context.circuit.wires=[];
  assert.equal(pendingGoal(classes[0].steps[2],context)?.kind,'repair');assert.equal(seen.size,0);
});
test('parallel class can be completed independently with its own measurements',()=>{
  const context={circuit:preset('parallel'),selected:'R1',seen:new Set<string>()};
  assert.equal(pendingGoal(classes[1].steps[0],context)?.kind,'inspect');
  context.selected='R2';assert.equal(pendingGoal(classes[1].steps[0],context),null);
  context.seen.clear();assert.equal(pendingGoal(classes[1].steps[1],context)?.kind,'value');
  context.circuit.parts.find(p=>p.id==='R2')!.value=200;
  assert.equal(pendingGoal(classes[1].steps[1],context),null);
  context.seen.clear();assert.equal(pendingGoal(classes[1].steps[2],context)?.kind,'inspect');
  context.selected='R1';assert.equal(pendingGoal(classes[1].steps[2],context),null);
});
test('sessions preserve separate circuits and inspection progress without shared references',()=>{
  const store=new SessionStore(),key=classSessionKey(classes[0].id);
  const initial={circuit:preset('simple'),selected:'S1',step:1,seen:['R1'],completed:false};
  store.save(key,initial);store.save(classSessionKey(classes[1].id),{...initial,step:0,circuit:preset('parallel')});store.save('free',{...initial,circuit:preset('empty')});
  initial.seen.push('R2');initial.circuit.parts[0].value=12;
  const saved=store.get(key)!;assert.equal(saved.step,1);assert.deepEqual(saved.seen,['R1']);assert.equal(saved.circuit.parts[0].value,6);
  saved.step=9;assert.equal(store.get(key)!.step,1);assert.equal(store.get('free')!.circuit.parts.length,1);assert.equal(store.get(classSessionKey(classes[1].id))!.step,0);
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
