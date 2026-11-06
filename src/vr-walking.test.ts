import test from 'node:test';
import assert from 'node:assert/strict';
import {walkInLab} from './vr-walking';
const start={x:0,z:-1.8},forward={x:0,z:1};
test('stick forward follows horizontal gaze and sideways strafes',()=>{
 assert.ok(walkInLab(start,{x:0,y:-1},forward,.02).z>start.z);
 assert.ok(walkInLab(start,{x:1,y:0},forward,.02).x>0);
 assert.ok(walkInLab(start,{x:0,y:-1},{x:1,z:0},.02).x>0);
});
test('dead zone prevents drift and diagonals have no speed advantage',()=>{
 assert.deepEqual(walkInLab(start,{x:.1,y:0},forward,.02),start);
 const a=walkInLab(start,{x:0,y:-1},forward,.02),b=walkInLab(start,{x:1,y:-1},forward,.02);
 assert.ok(Math.abs(Math.hypot(a.x,a.z-start.z)-Math.hypot(b.x,b.z-start.z))<1e-9);
});
test('walk stays within room and cannot enter the table',()=>{
 let p=start;for(let i=0;i<1000;i++)p=walkInLab(p,{x:0,y:-1},forward,.02);
 assert.ok(p.z<=-.75);
 for(let i=0;i<1000;i++)p=walkInLab(p,{x:1,y:0},forward,.02);
 assert.equal(p.x,2.1);
 for(let i=0;i<1000;i++)p=walkInLab(p,{x:0,y:-1},forward,.02);
 assert.equal(p.z,2.1);
});
test('time independence and long frame cap',()=>{
 let a=start,b=start;for(let i=0;i<60;i++)a=walkInLab(a,{x:1,y:0},forward,1/60);
 for(let i=0;i<90;i++)b=walkInLab(b,{x:1,y:0},forward,1/90);
 assert.ok(Math.abs(a.x-b.x)<1e-9);
 assert.ok(walkInLab(start,{x:1,y:0},forward,10).x<=.0375+1e-9);
 assert.deepEqual(walkInLab(start,{x:NaN,y:0},forward,.02),start);
});
