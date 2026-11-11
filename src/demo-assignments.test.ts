import assert from 'node:assert/strict';
import test from 'node:test';
import { isMyModule, moduleProgress, pendingActivities } from './demo/asignaciones';

const today=new Date(2026,10,11);

test('the trainee is assigned distribution and electrical fundamentals; industrial stays open', () => {
  assert.equal(isMyModule('distribucion'),true);
  assert.equal(isMyModule('electronics'),true);
  assert.equal(isMyModule('industrial'),false);
});

test('module progress counts the real five-rules result', () => {
  assert.deepEqual([moduleProgress('distribucion',today,false).done,moduleProgress('distribucion',today,false).total],[0,1]);
  assert.equal(moduleProgress('distribucion',today,true).done,1);
});

test('electrical fundamentals starts half done with demo data', () => {
  const p=moduleProgress('electronics',today,false);
  assert.deepEqual([p.done,p.total],[2,4]);
});

test('pending activities are the unfinished assigned classes, soonest review first', () => {
  const pending=pendingActivities(today,false);
  assert.deepEqual(pending.map(a=>a.classId),['distribucion-cinco-reglas','encuentra-el-fallo','enciende-un-led']);
  assert.ok(pending.every(a=>a.review>=today));
  assert.equal(pendingActivities(today,true).some(a=>a.classId==='distribucion-cinco-reglas'),false);
});
