import test from 'node:test';
import assert from 'node:assert/strict';
import { preset, type Circuit } from './circuit';
import { ledCircuit } from './classes/led';
import { routeWire, segmentClearsDevices } from './wire-routing';
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-7);
function verify(c:Circuit){
  for(const [index,w] of c.wires.entries()){
    const path=routeWire(c,w,index);assert.ok(path.length>=2);
    for(const [id,p] of [[w.a,path[0]],[w.b,path.at(-1)!]] as const){const [name,side]=id.split(':'),part=c.parts.find(p=>p.id===name)!;near(p.x,part.x+(side==='0'?-.95:.95));near(p.y,.22);near(p.z,part.z);}
    for(let i=1;i<path.length;i++){
      const a=path[i-1],b=path[i];assert.ok([a.x-b.x,a.y-b.y,a.z-b.z].filter(v=>Math.abs(v)>1e-7).length===1);
      assert.ok(Number.isFinite(b.x)&&Number.isFinite(b.y)&&Number.isFinite(b.z));
      // Endpoints sit inside clearance margins; the connecting lead must exit outward.
      const endPart=i===1?w.a.split(':')[0]:i===path.length-1?w.b.split(':')[0]:null;
      const obstacles=c.parts.filter(p=>p.id!==endPart);
      if(a.y===b.y&&a.y<1)assert.ok(segmentClearsDevices(a,b,obstacles,.12),`${w.id} segment ${i}`);
    }
  }
}
test('all supplied layouts route around component footprints and retain exact terminal endpoints',()=>{
  for(const c of [preset('simple'),preset('series'),preset('parallel'),ledCircuit()]){verify(c);for(const w of c.wires)assert.ok(routeWire(c,w).every(p=>p.y<1),'normal layouts use surface routing');}
});
test('moving a third device into a cable route produces a collision-free detour',()=>{
  const c=preset('simple');c.parts=c.parts.filter(p=>p.id!=='S1');Object.assign(c.parts.find(p=>p.id==='R1')!,{x:3,z:0});c.wires=[{id:'test',a:'V1:1',b:'R1:0'}];c.parts.push({id:'R2',kind:'resistor',value:100,x:0,z:1.8});verify(c);
  const before=routeWire(c,c.wires[0]);c.parts.find(p=>p.id==='R2')!.z=0;verify(c);assert.notDeepEqual(routeWire(c,c.wires[0]),before);
});
test('crowded placements get a finite overhead route and are recomputed after movement',()=>{
  const c=preset('simple');c.parts.find(p=>p.id==='R1')!.x=-3.2;c.parts.find(p=>p.id==='R1')!.z=0;
  const path=routeWire(c,c.wires[0]);assert.ok(path.some(p=>p.y>1));assert.ok(path.every(p=>Number.isFinite(p.y)));
  c.parts.find(p=>p.id==='R1')!.x=0;assert.ok(routeWire(c,c.wires[0]).every(p=>p.y<1));
  assert.deepEqual(routeWire(c,{id:'bad',a:'missing:0',b:'V1:0'}),[]);
});
test('wire lanes separate shared routes and the routing never modifies the circuit',()=>{
  const c=preset('parallel'),saved=structuredClone(c);const a=routeWire(c,c.wires[0],0),b=routeWire(c,c.wires[0],1);
  assert.notDeepEqual(a,b);assert.deepEqual(c,saved);
});
