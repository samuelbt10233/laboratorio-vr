import test from 'node:test';
import assert from 'node:assert/strict';
import { createStepCircuit, diagnoseHint, matchesCircuit, pendingGoal, SessionStore, classSessionKey, type Goal } from './class-engine';
import { getClass } from './lessons';
import { ledCircuit } from './classes/led';
import { connect, solve, validate, type Circuit } from './circuit';
type DiagnoseGoal=Extract<Goal,{kind:'diagnose'}>;
const lesson=getClass('encuentra-el-fallo');
const ready=(index:number,circuit:Circuit)=>pendingGoal(lesson.steps[index],{circuit,selected:'V1',seen:new Set()})===null;
function addWire(circuit:Circuit,a:string,b:string){const next=connect(circuit,a,b);assert.notEqual(typeof next,'string');return next as Circuit;}
test('diagnostic challenges start with distinct faults and require their actual repairs',()=>{
  const first=createStepCircuit(lesson,0);assert.ok(validate(first));assert.equal(solve(first).status,'open');assert.equal(ready(0,first),false);
  first.parts.find(p=>p.id==='S1')!.closed=true;assert.equal(ready(0,first),true);assert.equal(solve(first).current,.06);
  let second=createStepCircuit(lesson,1);assert.ok(validate(second));assert.equal(solve(second).status,'open');assert.equal(ready(1,second),false);
  second=addWire(second,'S1:0','R1:1');assert.equal(ready(1,second),true);assert.equal(solve(second).current,.06);
  let third=createStepCircuit(lesson,2);assert.ok(validate(third));assert.equal(solve(third).status,'short');assert.equal(ready(2,third),false);
  third.wires=third.wires.filter(w=>w.id!=='w1');assert.equal(solve(third).status,'open');assert.equal(ready(2,third),false);
  third=addWire(third,'R1:1','S1:0');assert.equal(ready(2,third),true);assert.equal(solve(third).current,.06);
});
test('diagnosis allows movement and reversed wires but rejects bypasses and altered values',()=>{
  const expected=lesson.steps[0].goals[0];assert.equal(expected.kind,'diagnose');if(expected.kind!=='diagnose')return;
  const repaired=structuredClone(expected.expected);
  repaired.parts[0].x+=.5;repaired.wires.reverse().forEach((w,i)=>{[w.a,w.b]=[w.b,w.a];w.id=`new${i}`;});
  assert.equal(matchesCircuit(repaired,expected.expected),true);
  repaired.parts.find(p=>p.id==='R1')!.value=200;repaired.parts.find(p=>p.id==='V1')!.value=12;
  assert.equal(solve(repaired).current,.06);assert.equal(ready(0,repaired),false);
  const extra=addWire(structuredClone(expected.expected),'R1:0','R1:1');assert.equal(ready(0,extra),false);
  const missing=structuredClone(expected.expected);missing.parts=missing.parts.filter(p=>p.id!=='R1');assert.equal(matchesCircuit(missing,expected.expected),false);
});
const repaired=()=>{const goal=lesson.steps[1].goals[0];assert.equal(goal.kind,'diagnose');return goal as DiagnoseGoal;};
const flip=(part:string,circuit:Circuit)=>{const swap=(t:string)=>t.startsWith(`${part}:`)?`${part}:${t.endsWith('0')?1:0}`:t;circuit.wires.forEach(w=>{w.a=swap(w.a);w.b=swap(w.b);});return circuit;};
test('diagnosis accepts resistors and switches mounted the other way round',()=>{
  const goal=repaired();
  assert.equal(matchesCircuit(flip('R1',structuredClone(goal.expected)),goal.expected),true);
  assert.equal(matchesCircuit(flip('S1',structuredClone(goal.expected)),goal.expected),true);
  assert.equal(matchesCircuit(flip('R1',flip('S1',structuredClone(goal.expected))),goal.expected),true);
});
test('diagnosis still rejects a reversed source and a reversed LED',()=>{
  const goal=repaired();
  assert.equal(matchesCircuit(flip('V1',structuredClone(goal.expected)),goal.expected),false);
  const led=ledCircuit();
  assert.equal(matchesCircuit(flip('L1',structuredClone(led)),led),false);
});
test('diagnosis rejects a repair that reaches 60 mA but bypasses the switch',()=>{
  const goal=repaired();
  const bypass=addWire(createStepCircuit(lesson,1),'R1:1','S1:1');
  assert.equal(solve(bypass).current,.06);
  assert.equal(matchesCircuit(bypass,goal.expected),false);
});
test('the hint explains a correct current on a mounting that does not match',()=>{
  const goal=repaired();
  assert.equal(diagnoseHint(goal,createStepCircuit(lesson,1)),goal.hint);
  const bypass=addWire(createStepCircuit(lesson,1),'R1:1','S1:1');
  assert.notEqual(diagnoseHint(goal,bypass),goal.hint);
});
test('challenge reset and navigation never mutate definitions or overwrite saved sessions',()=>{
  const circuit=createStepCircuit(lesson,0);circuit.parts.find(p=>p.id==='S1')!.closed=true;
  assert.equal(ready(0,circuit),true);assert.equal(ready(0,createStepCircuit(lesson,0)),false);
  const store=new SessionStore();store.save(classSessionKey(lesson.id),{circuit,selected:'S1',step:0,seen:[],completed:false});
  const next=createStepCircuit(lesson,1);next.wires=[];
  assert.equal(store.get(classSessionKey(lesson.id))!.circuit.wires.length,3);
  assert.equal(createStepCircuit(lesson,1).wires.length,2);
  assert.equal(ready(0,store.get(classSessionKey(lesson.id))!.circuit),true);
});
