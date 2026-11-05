import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NullEngine, Scene, TransformNode, Vector3 } from '@babylonjs/core';
import { questLayout, movePartOnTable, xrAvailability } from './quest-layout';

test('VR keeps a tabletop scale while cable endpoints round-trip to model coordinates',()=>{
  const engine=new NullEngine(),scene=new Scene(engine),root=new TransformNode('lab',scene),pin=new TransformNode('pin',scene);
  root.rotation.x=-questLayout.tableTilt;root.position.y=questLayout.tableHeight;root.scaling.setAll(questLayout.scale);pin.parent=root;pin.position.set(-3.2,.22,1.7);
  root.computeWorldMatrix(true);pin.computeWorldMatrix(true);
  const world=pin.getAbsolutePosition(),local=Vector3.TransformCoordinates(world,root.getWorldMatrix().clone().invert());
  assert.ok(Math.abs(world.y-(questLayout.tableHeight+questLayout.scale*(.22*Math.cos(questLayout.tableTilt)+1.7*Math.sin(questLayout.tableTilt))))<1e-6);assert.ok(Vector3.Distance(local,pin.position)<1e-5);
  const localDelta=new Vector3(.4,0,-.3),worldDelta=Vector3.TransformNormal(localDelta,root.getWorldMatrix()),recovered=Vector3.TransformNormal(worldDelta,root.getWorldMatrix().clone().invert());
  assert.ok(Vector3.Distance(localDelta,recovered)<1e-5);assert.ok(Math.abs(questLayout.tableTilt*180/Math.PI-40)<1e-8);
  assert.ok(11.2*questLayout.scale<2);assert.ok(questLayout.tableHeight>.7&&questLayout.tableHeight<1.2);scene.dispose();engine.dispose();
});
test('controller arrow movement stays within the same bounds as desktop dragging',()=>{
  assert.deepEqual(movePartOnTable(4.3,2.3,.4,.4),{x:4.35,z:2.35});
  assert.deepEqual(movePartOnTable(-4.3,-2.3,-.4,-.4),{x:-4.35,z:-2.35});
  assert.deepEqual(movePartOnTable(0,0,.4,-.4),{x:.4,z:-.4});
});
test('VR entry requires HTTPS and actual immersive session support',()=>{
  assert.equal(xrAvailability(false,true,true).enabled,false);
  assert.match(xrAvailability(false,true,true).message,/HTTPS/);
  assert.equal(xrAvailability(true,false,false).enabled,false);
  assert.match(xrAvailability(true,true,false).message,/Vista Quest en PC/);
  assert.equal(xrAvailability(true,true,true).enabled,true);
});
