import test from 'node:test';
import assert from 'node:assert/strict';
import { classes } from './lessons';
import { catalogueEntries, getLaboratory, laboratories, laboratoryClasses, welcomeClassId } from './laboratories';

test('home offers welcome and laboratories, without exposing their classes or free modes',()=>{
  const home=catalogueEntries(null);
  assert.equal(home.filter(e=>e.kind==='welcome').length,1);
  assert.equal(home[0].classId,welcomeClassId);
  assert.equal(home.filter(e=>e.kind==='laboratory').length,laboratories.length);
  assert.ok(home.every(e=>e.kind==='welcome'||e.kind==='laboratory'));
});
test('each laboratory exposes only its classes and one free mode',()=>{
  assert.equal(new Set(laboratories.map(l=>l.id)).size,laboratories.length);
  for(const lab of laboratories){
    const entries=catalogueEntries(lab.id);
    assert.deepEqual(entries.filter(e=>e.kind==='class').map(e=>e.classId),laboratoryClasses(lab.id).map(c=>c.id));
    assert.equal(entries.filter(e=>e.kind==='free').length,1);
    assert.ok(entries.every(e=>e.laboratoryId===lab.id));
    assert.ok(entries.every(e=>e.classId!==welcomeClassId));
    assert.equal(new Set(entries.map(e=>e.id)).size,entries.length);
  }
});
test('all classes have an explicit catalogue destination and unknown labs are rejected',()=>{
  for(const definition of classes){
    if(definition.id===welcomeClassId)assert.equal(definition.laboratoryId,null);
    else assert.ok(getLaboratory(definition.laboratoryId!));
  }
  assert.throws(()=>catalogueEntries('missing'));
});
