import assert from 'node:assert/strict';
import test from 'node:test';
import { subjects, subjectEntries } from './subjects';
import { getLearningContent } from './learning-content';
import { clientId, clients } from './demo/cliente';
import { isMyModule } from './demo/asignaciones';

// The shared contract of docs/plan-icetex.md (section 3): both agents build against these ids.
const PLAN:Record<string,string[]>={
  finanzas:['finanzas-presupuesto','finanzas-credito','finanzas-fraudes'],
  complementaria:['complementaria-digital','complementaria-empleabilidad','complementaria-emprendimiento'],
};
function asClient<T>(search:string,run:()=>T):T{
  const g=globalThis as {location?:unknown};const before=g.location;g.location={search};
  try{return run();}finally{g.location=before;}
}

test('the client comes from the address and defaults to ESSA',()=>{
  assert.equal(clientId(''),'essa');
  assert.equal(clientId('?cliente=icetex'),'icetex');
  assert.equal(clientId('?cliente=otro'),'essa');
});
test('every ICETEX class is registered once in its module with its own content',()=>{
  for(const [subjectId,ids] of Object.entries(PLAN)){
    const subject=subjects.find(s=>s.id===subjectId)!;
    assert.deepEqual(subject.previewContentIds,ids);
    for(const id of ids)assert.equal(getLearningContent(id).subjectId,subjectId,id);
  }
});
test('each client only lists its own modules',()=>{
  const listed=()=>subjectEntries(null).map(e=>e.subjectId);
  for(const id of listed())assert.ok(clients.essa.subjects.includes(id),id);
  assert.ok(!listed().includes('finanzas')&&!listed().includes('complementaria'));
  asClient('?cliente=icetex',()=>{for(const id of listed())assert.ok(clients.icetex.subjects.includes(id),id);});
});
test('the ICETEX trainee is assigned both modules and none of ESSA',()=>{
  asClient('?cliente=icetex',()=>{
    assert.ok(isMyModule('finanzas')&&isMyModule('complementaria'));
    assert.ok(!isMyModule('distribucion'));
  });
  assert.ok(isMyModule('distribucion')&&!isMyModule('finanzas'));
});
test('every client has a profile and a note for its evaluations',()=>{
  for(const client of Object.values(clients)){
    assert.ok(client.profiles.length>0,client.id);
    assert.ok(client.assigned.every(id=>client.subjects.includes(id)),client.id);
    assert.ok(client.evaluationNote.text.length>0,client.id);
  }
});
