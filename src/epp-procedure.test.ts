import test from 'node:test';
import assert from 'node:assert/strict';
import { decide, eppItems, inflate, inspect, startInspection, type EppState } from './labs/epp/procedure';

function solve(){let s=startInspection();for(const item of eppItems){s=inspect(s,item.id).state;if(item.inflate)s=inflate(s,item.id).state;s=decide(s,item.id,item.defect?'retirar':'apto').state;}return s;}

test('six items, three of them defective, and every glove is inflated',()=>{
  assert.equal(eppItems.length,6);
  assert.equal(eppItems.filter(i=>i.defect).length,3);
  assert.ok(eppItems.filter(i=>i.id.startsWith('guante')).every(i=>i.inflate));
});
test('inspecting, inflating and deciding correctly finishes with no errors',()=>{
  const s=solve();
  assert.equal(s.finished,true);assert.equal(s.errors,0);
});
test('a decision before inspecting is refused and counted',()=>{
  const r=decide(startInspection(),'casco','retirar');
  assert.equal(r.ok,false);assert.equal(r.state.errors,1);assert.equal(r.state.decided.casco,undefined);assert.match(r.message,/inspecci/i);
});
test('a glove cannot be declared fit before inflating it',()=>{
  const s=inspect(startInspection(),'guante-a').state,r=decide(s,'guante-a','apto');
  assert.equal(r.ok,false);assert.equal(r.state.errors,1);assert.match(r.message,/infla/i);
});
test('inflating reveals a hole that a visual check misses',()=>{
  const s=inspect(startInspection(),'guante-b').state;
  assert.ok(!s.findings['guante-b']!.some(f=>/aire/.test(f)));
  const r=inflate(s,'guante-b');
  assert.ok(r.state.findings['guante-b']!.some(f=>/pierde aire/.test(f)));
});
test('keeping a defective item in service is an error that names the risk',()=>{
  let s:EppState=inspect(startInspection(),'casco').state;
  const r=decide(s,'casco','apto');
  assert.equal(r.ok,false);assert.equal(r.state.errors,1);assert.equal(r.state.decided.casco,undefined);assert.match(r.message,/fisura/i);
  s=decide(r.state,'casco','retirar').state;assert.equal(s.decided.casco,'retirar');assert.equal(s.errors,1);
});
test('withdrawing a fit item is also an error',()=>{
  const s=inspect(startInspection(),'careta').state;
  assert.equal(decide(s,'careta','retirar').state.errors,1);
});
test('a finished inspection accepts nothing more',()=>{
  const r=decide(solve(),'casco','apto');
  assert.equal(r.ok,false);assert.equal(r.state.errors,0);assert.match(r.message,/reinicia/i);
});
