import test from 'node:test';
import assert from 'node:assert/strict';
import { budgetStages, choose, INCOME, libre, startMonth, type MonthState } from './labs/presupuesto/procedure';

const right=(stage:number)=>budgetStages[stage].choices.find(c=>c.ok)!.id;
const wrong=(stage:number)=>budgetStages[stage].choices.find(c=>!c.ok)!.id;
function solve(){let s=startMonth();while(!s.finished)s=choose(s,right(s.stage)).state;return s;}

test('every stage has exactly one right choice and at least two wrong ones',()=>{
  for(const stage of budgetStages){
    assert.equal(stage.choices.filter(c=>c.ok).length,1,stage.id);
    assert.ok(stage.choices.filter(c=>!c.ok).length>=2,stage.id);
  }
});
test('the month starts with the whole income available and the installment pending',()=>{
  const s=startMonth();
  assert.equal(libre(s.money),INCOME);assert.equal(s.money.cuota,'pendiente');assert.equal(s.money.fondo,0);
});
test('choosing well finishes the month with no errors, the installment paid and savings kept',()=>{
  const s=solve();
  assert.equal(s.finished,true);assert.equal(s.errors,0);
  assert.equal(s.money.cuota,'al-dia');
  assert.ok(s.money.fondo>0);
  assert.ok(libre(s.money)>=0);
});
test('the buckets always add up to the income',()=>{
  let s:MonthState=startMonth();
  while(!s.finished){
    s=choose(s,right(s.stage)).state;
    const {fijos,fondo,variables,imprevistos}=s.money;
    assert.equal(fijos+fondo+variables+imprevistos+libre(s.money),INCOME);
  }
});
test('a wrong choice is counted, explained and changes no money',()=>{
  const s=startMonth(),r=choose(s,wrong(0));
  assert.equal(r.ok,false);assert.equal(r.state.errors,1);assert.equal(r.state.stage,0);
  assert.deepEqual(r.state.money,s.money);assert.ok(r.message.length>20);
});
test('paying from a link in a message is a fraud error',()=>{
  let s=startMonth();
  while(budgetStages[s.stage].id!=='enlace')s=choose(s,right(s.stage)).state;
  const link=budgetStages[s.stage].choices.find(c=>/enlace/i.test(c.label)&&!c.ok)!;
  const r=choose(s,link.id);
  assert.equal(r.ok,false);assert.match(r.message,/estaf|fraude|suplant/i);
});
test('the emergency is paid from the emergency fund',()=>{
  let s=startMonth();
  while(budgetStages[s.stage].id!=='imprevisto')s=choose(s,right(s.stage)).state;
  const before=s.money.fondo,r=choose(s,right(s.stage));
  assert.ok(r.state.money.fondo<before);assert.ok(r.state.money.imprevistos>0);
});
test('a finished month accepts nothing more',()=>{
  const r=choose(solve(),'x');
  assert.equal(r.ok,false);assert.equal(r.state.errors,0);assert.match(r.message,/reinicia/i);
});
