import test from 'node:test';
import assert from 'node:assert/strict';
import { readingEntry, subjects, subjectEntries, subjectForLaboratory, getSubject } from './subjects';
import { learningContents, getLearningContent } from './learning-content';
import { classes, getClass } from './lessons';
import { laboratories } from './laboratories';

test('every available class has reading material that leads to its own simulation',()=>{
  for(const lesson of classes.filter(c=>c.laboratoryId)){
    const content=getLearningContent(lesson.id);
    assert.equal(content.runtimeClassId,lesson.id);
    assert.equal(content.subjectId,subjectForLaboratory(lesson.laboratoryId!).id);
    assert.ok(content.sections.length>0);
    assert.ok(content.sections.every(s=>s.title&&s.text&&s.example));
  }
  for(const content of learningContents.filter(c=>c.runtimeClassId))assert.ok(getClass(content.runtimeClassId!));
});
test('home exposes subjects and each subject keeps its own entries',()=>{
  assert.equal(new Set(subjects.map(s=>s.id)).size,subjects.length);
  assert.ok(subjectEntries(null).every(e=>e.kind==='subject'));
  for(const subject of subjects)assert.ok(subjectEntries(subject.id).every(e=>e.subjectId===subject.id));
  for(const lab of laboratories)assert.ok(subjectForLaboratory(lab.id));
});
test('planned subjects cannot launch a simulator or expose a free mode',()=>{
  for(const subject of subjects.filter(s=>s.status==='planned')){
    const entries=subjectEntries(subject.id);assert.ok(entries.length);
    for(const entry of entries){
      assert.equal(entry.kind,'class');assert.equal(entry.planned,true);assert.equal(entry.laboratoryId,null);
      assert.equal(getLearningContent(entry.classId!).runtimeClassId,null);
    }
  }
});
test('a reading is planned only until it has a laboratory module',()=>{
  const reading={id:'x',runtimeClassId:null,subjectId:'fluids',title:'T',description:'D',duration:'5 min',laboratoryTitle:'L',sections:[]};
  assert.equal(readingEntry('fluids',reading).planned,true);
  const practice=readingEntry('fluids',{...reading,labId:'prensa'});
  assert.equal(practice.planned,false);assert.equal(practice.classId,'x');assert.equal(practice.kind,'class');
  assert.ok(!practice.meta.includes('Laboratorio en preparación'));
});
test('invalid subjects and reading links are rejected',()=>{
  assert.throws(()=>getSubject('missing'));assert.throws(()=>subjectForLaboratory('missing'));assert.throws(()=>getLearningContent('missing'));
});
