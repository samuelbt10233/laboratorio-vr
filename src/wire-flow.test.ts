import { test } from 'node:test';
import assert from 'node:assert/strict';
import { preset, solve } from './circuit';
import { wireCurrents } from './wire-flow';
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-8,`${a} ≠ ${b}`);
test('series animation follows conventional current from positive to negative',()=>{
  const c=preset('series'),flows=wireCurrents(c,solve(c));
  for(const w of c.wires)near(flows[w.id],.03);
});
test('parallel animation splits current and respects reversed wire orientation',()=>{
  const c=preset('parallel');c.parts.find(p=>p.id==='R2')!.value=200;
  let flows=wireCurrents(c,solve(c));near(flows.w0,.06);near(flows.w1,.03);near(flows.w2,.06);near(flows.w3,.03);near(flows.w4,.09);
  [c.wires[1].a,c.wires[1].b]=[c.wires[1].b,c.wires[1].a];flows=wireCurrents(c,solve(c));near(flows.w1,-.03);
});
test('open circuits, short circuits and disconnected branches have no particles',()=>{
  const open=preset('simple');assert.ok(Object.values(wireCurrents(open,solve(open))).every(i=>i===0));
  const short=preset('series');short.wires.push({id:'short',a:'V1:0',b:'V1:1'});assert.ok(Object.values(wireCurrents(short,solve(short))).every(i=>i===0));
  const branch=preset('parallel');branch.wires=branch.wires.filter(w=>w.id!=='w2');
  const flows=wireCurrents(branch,solve(branch));near(flows.w0,0);near(flows.w1,.06);near(flows.w4,.06);
});
test('redundant ideal-wire loops stay finite and conserve terminal current',()=>{
  const c=preset('parallel');c.wires.push({id:'bridge',a:'R1:0',b:'R2:0'});
  const result=solve(c),flows=wireCurrents(c,result);
  assert.ok(Object.values(flows).every(Number.isFinite));near(flows.w0+flows.w1,result.current);
  near(flows.w0-flows.bridge,result.readings.R1.current);
  near(flows.w1+flows.bridge,result.readings.R2.current);
});
