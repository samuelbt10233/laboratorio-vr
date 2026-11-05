import test from 'node:test';
import assert from 'node:assert/strict';
import { solve, validate, connect, type Circuit } from './circuit';
import { ledCircuit } from './classes/led';
import { LED_MODEL, ledState } from './led-solver';
import { createStepCircuit, pendingGoal } from './class-engine';
import { getClass } from './lessons';
import { wireCurrents } from './wire-flow';
const on=()=>{const c=ledCircuit();c.parts.find(p=>p.id==='S1')!.closed=true;return c;};
const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
test('LED uses polarity, knee voltage and current-dependent brightness state',()=>{
  const c=on();assert.ok(validate(c));const result=solve(c);close(result.current,4/240);close(result.readings.L1.voltage,2+20*4/240);assert.equal(ledState(result.readings.L1.current),'Encendido');
  for(const i of Object.values(wireCurrents(c,result)))close(i,result.current);
  c.parts.find(p=>p.id==='R1')!.value=470;close(solve(c).current,4/490);
  c.parts.find(p=>p.id==='R1')!.value=10;assert.equal(ledState(solve(c).readings.L1.current),'Sobrecorriente');
  c.parts.find(p=>p.id==='V1')!.value=1;assert.equal(solve(c).current,0);assert.equal(solve(c).status,'open');
});
test('open switch and reversed LED block current and particles',()=>{
  for(const c of [ledCircuit(),createStepCircuit(getClass('enciende-un-led'),2)]){const r=solve(c);assert.equal(r.current,0);assert.equal(r.readings.L1.current,0);assert.equal(r.status,'open');assert.ok(Object.values(wireCurrents(c,r)).every(i=>i===0));}
});
test('LED networks handle parallel paths, floating parts, direct drive and shorts',()=>{
  const c=on();c.parts.push({id:'L2',kind:'led',value:2,x:0,z:-1.4});let next=connect(c,'L1:0','L2:0') as Circuit;next=connect(next,'L1:1','L2:1') as Circuit;
  const r=solve(next);close(r.readings.L1.current,r.readings.L2.current);close(r.current,r.readings.L1.current+r.readings.L2.current);
  c.parts.push({id:'L3',kind:'led',value:2,x:2,z:-1});assert.equal(solve(c).readings.L3.current,0);
  const direct: Circuit={parts:[c.parts[0],c.parts[2]],wires:[{id:'a',a:'V1:0',b:'L1:0'},{id:'b',a:'L1:1',b:'V1:1'}]};close(solve(direct).current,.2);assert.equal(ledState(solve(direct).current),'Sobrecorriente');
  direct.wires.push({id:'short',a:'V1:0',b:'V1:1'});assert.equal(solve(direct).status,'short');
  const second=on();second.parts.push({id:'L2',kind:'led',value:2,x:0,z:0});second.wires.find(w=>w.id==='w2')!.a='L2:1';second.wires.push({id:'series',a:'L1:1',b:'L2:0'});close(solve(second).current,2/260);
});
test('all LED lesson steps require the intended activity and reach their stated readings',()=>{
  const lesson=getClass('enciende-un-led');
  for(let i=0;i<lesson.steps.length;i++){
    const circuit=createStepCircuit(lesson,i),context={circuit,selected:'V1',seen:new Set<string>()};assert.notEqual(pendingGoal(lesson.steps[i],context),null);
    if(i===0)context.selected='L1';
    if(i===1){circuit.parts.find(p=>p.id==='S1')!.closed=true;context.selected='L1';}
    if(i===2){circuit.wires.find(w=>w.id==='w1')!.b='L1:0';circuit.wires.find(w=>w.id==='w2')!.a='L1:1';}
    if(i===3){circuit.parts.find(p=>p.id==='R1')!.value=470;context.selected='L1';}
    assert.equal(pendingGoal(lesson.steps[i],context),null);
  }
  assert.equal(LED_MODEL.voltage,2);
});
