import test from 'node:test';
import assert from 'node:assert/strict';
import { subjects, subjectEntries } from './subjects';
import { getLearningContent } from './learning-content';
import { labModules } from './labs/registry';
import { RESULT_KEY, readResult, saveResult } from './labs/cinco-reglas/result';

// The shared contract of docs/plan-demo-energia.md (section 3): both agents build against these ids.
test('the distribution route comes first and opens the five golden rules practice',()=>{
  assert.equal(subjects[0].id,'distribucion');
  assert.equal(subjects[0].status,'available');
  const content=getLearningContent('distribucion-cinco-reglas');
  assert.equal(content.subjectId,'distribucion');assert.equal(content.labId,'cinco-reglas');
  assert.ok(content.sections.length&&content.sections.every(s=>s.title&&s.text&&s.example));
  assert.ok(labModules['cinco-reglas']);
  const [entry]=subjectEntries('distribucion');
  assert.equal(entry.classId,'distribucion-cinco-reglas');assert.equal(entry.planned,false);
});
test('the practice result round-trips through its storage key and ignores bad data',()=>{
  const store=new Map<string,string>();
  const storage={getItem:(k:string)=>store.get(k)??null,setItem:(k:string,v:string)=>{store.set(k,v);}};
  assert.equal(readResult(storage),null);
  const result={contentId:'distribucion-cinco-reglas',aprobado:true,errores:1,segundos:94,fecha:'2026-11-10T20:00:00.000Z'};
  saveResult(result,storage);
  assert.equal(RESULT_KEY,'umbral-demo-resultado');
  assert.deepEqual(readResult(storage),result);
  store.set(RESULT_KEY,'{roto');assert.equal(readResult(storage),null);
});
