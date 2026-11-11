import assert from 'node:assert/strict';
import test from 'node:test';
import { subjects, subjectEntries } from './subjects';
import { getLearningContent } from './learning-content';
import { evaluationFor, evaluationPassed, saveEvaluation } from './demo/evaluaciones';
import { readResult, resultFor, saveResult } from './labs/cinco-reglas/result';

// The shared contract of docs/plan-clases.md (section 3): both agents build against these ids.
const PLAN:Record<string,string[]>={
  distribucion:['distribucion-epp','distribucion-distancias','distribucion-ats','distribucion-alturas'],
  operacion:['operacion-cortacircuitos','operacion-transformador','operacion-puesta-tierra','operacion-inspeccion'],
  medida:['medida-acometida','medida-medidores','medida-irregulares','medida-suspension'],
  electronics:['fundamentos-potencia','fundamentos-alterna','fundamentos-multimetro'],
};
const memory=()=>{const store=new Map<string,string>();return {store,getItem:(k:string)=>store.get(k)??null,setItem:(k:string,v:string)=>{store.set(k,v);}};};

test('operation and metering modules follow distribution',()=>{
  assert.deepEqual(subjects.slice(0,3).map(s=>s.id),['distribucion','operacion','medida']);
});
test('every planned class is registered once in its module with its own content',()=>{
  for(const [subjectId,ids] of Object.entries(PLAN)){
    const subject=subjects.find(s=>s.id===subjectId)!;
    for(const id of ids){
      assert.equal(subject.previewContentIds.filter(c=>c===id).length,1,id);
      assert.equal(getLearningContent(id).subjectId,subjectId,id);
    }
  }
});
test('a class stays hidden until it has an evaluation or a laboratory',()=>{
  for(const subject of subjects.filter(s=>s.status==='available'))for(const entry of subjectEntries(subject.id).filter(e=>e.kind==='class'&&!e.laboratoryId)){
    const content=getLearningContent(entry.classId!);
    assert.equal(entry.planned,!content.labId&&!evaluationFor(content.id),entry.classId!);
  }
  assert.equal(subjectEntries('industrial').find(e=>e.classId==='industrial-torno')?.planned,true);
});
test('a module without visible classes is not listed',()=>{
  for(const entry of subjectEntries(null).filter(e=>!e.planned))assert.ok(subjectEntries(entry.subjectId).some(e=>!e.planned),entry.subjectId);
});
test('practice results are kept per class and only the five rules feed the supervisor panel',()=>{
  const storage=memory();
  const loto={contentId:'industrial-loto',aprobado:true,errores:0,segundos:60,fecha:'2026-11-11T10:00:00.000Z'};
  saveResult(loto,storage);
  assert.deepEqual(resultFor('industrial-loto',storage),loto);
  assert.equal(readResult(storage),null);
  const rules={...loto,contentId:'distribucion-cinco-reglas',errores:2};
  saveResult(rules,storage);
  assert.deepEqual(readResult(storage),rules);
  assert.deepEqual(resultFor('industrial-loto',storage),loto);
  assert.equal(resultFor('operacion-cortacircuitos',storage),null);
});
test('a five-rules result saved before the per-class map still counts',()=>{
  const storage=memory();
  const rules={contentId:'distribucion-cinco-reglas',aprobado:true,errores:0,segundos:6,fecha:'2026-11-10T10:00:00.000Z'};
  storage.setItem('umbral-demo-resultado',JSON.stringify(rules));
  assert.deepEqual(resultFor('distribucion-cinco-reglas',storage),rules);
  assert.equal(resultFor('industrial-loto',storage),null);
});
test('an evaluation counts as passed only with every answer right',()=>{
  const storage=memory();
  assert.equal(evaluationPassed('ley-de-ohm',storage),false);
  saveEvaluation('ley-de-ohm',2,3,storage);assert.equal(evaluationPassed('ley-de-ohm',storage),false);
  saveEvaluation('ley-de-ohm',3,3,storage);assert.equal(evaluationPassed('ley-de-ohm',storage),true);
});
