import assert from 'node:assert/strict';
import test from 'node:test';
import { isMyModule, moduleProgress, pendingActivities } from './demo/asignaciones';

const today=new Date(2026,10,11);
const nothing=()=>false;
const rulesDone=(id:string)=>id==='distribucion-cinco-reglas';

test('the trainee is assigned distribution, operation and electrical fundamentals; the rest stays open', () => {
  for(const id of ['distribucion','operacion','electronics'])assert.equal(isMyModule(id),true,id);
  for(const id of ['medida','industrial'])assert.equal(isMyModule(id),false,id);
});

test('module progress counts the saved five-rules result', () => {
  assert.equal(moduleProgress('distribucion',today,nothing).done,0);
  assert.equal(moduleProgress('distribucion',today,rulesDone).done,1);
  assert.ok(moduleProgress('distribucion',today,nothing).classes.some(c=>c.classId==='distribucion-cinco-reglas'));
});

test('electrical fundamentals starts with two demo classes already done', () => {
  const p=moduleProgress('electronics',today,nothing);
  assert.equal(p.done,2);assert.ok(p.total>=4);
});

test('pending activities are the unfinished assigned classes, soonest review first', () => {
  const pending=pendingActivities(today,nothing);
  assert.equal(pending[0].classId,'distribucion-cinco-reglas');
  assert.ok(pending.some(a=>a.classId==='encuentra-el-fallo'));
  assert.ok(pending.every((a,i)=>a.review>=today&&(!i||pending[i-1].review<=a.review)));
  assert.equal(pendingActivities(today,rulesDone).some(a=>a.classId==='distribucion-cinco-reglas'),false);
});
