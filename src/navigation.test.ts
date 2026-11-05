import { test } from 'node:test';
import assert from 'node:assert/strict';
import { moveWithinLab, navigationBounds as bounds } from './navigation';
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-9,`${a} ≠ ${b}`);
test('WASD follows the viewing direction on the horizontal plane',()=>{
  const point={x:0,y:1.6,z:0};
  const forward=moveWithinLab(point,-Math.PI/2,new Set(['w']),.05);
  near(forward.x,0);near(forward.z,.2);near(forward.y,1.6);
  const right=moveWithinLab(point,-Math.PI/2,new Set(['d']),.05);near(right.x,.2);near(right.z,0);
  const rotated=moveWithinLab(point,0,new Set(['w']),.05);near(rotated.x,-.2);near(rotated.z,0);
});
test('diagonal speed is normalized and opposite keys cancel',()=>{
  const point={x:0,y:1,z:0};
  const diagonal=moveWithinLab(point,-Math.PI/2,new Set(['w','d']),.05);
  near(Math.hypot(diagonal.x,diagonal.z),.2);
  assert.deepEqual(moveWithinLab(point,0,new Set(['w','s','a','d']),.05),point);
});
test('sustained movement stays within the lab and can return from the boundary',()=>{
  let point={x:0,y:1.6,z:0};
  for(let i=0;i<10000;i++)point=moveWithinLab(point,-Math.PI/2,new Set(['w','d']),.05);
  near(point.x,bounds.maxX);near(point.z,bounds.maxZ);
  const back=moveWithinLab(point,-Math.PI/2,new Set(['s','a']),.05);
  assert.ok(back.x<point.x&&back.z<point.z);
  const clamped=moveWithinLab({x:-100,y:100,z:-100},0,new Set(),.05);
  assert.deepEqual(clamped,{x:bounds.minX,y:bounds.maxY,z:bounds.minZ});
});
test('movement is frame independent and stalled frames cannot teleport',()=>{
  let point={x:0,y:1,z:0};
  for(let i=0;i<60;i++)point=moveWithinLab(point,-Math.PI/2,new Set(['w']),1/60);
  near(point.z,4);
  const stalled=moveWithinLab({x:0,y:1,z:0},-Math.PI/2,new Set(['w']),1000);near(stalled.z,.2);
});
