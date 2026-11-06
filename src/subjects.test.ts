import test from 'node:test';
import assert from 'node:assert/strict';
import { subjects, subjectEntries, subjectForLaboratory, getSubject } from './subjects';
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
test('invalid subjects and reading links are rejected',()=>{
  assert.throws(()=>getSubject('missing'));assert.throws(()=>subjectForLaboratory('missing'));assert.throws(()=>getLearningContent('missing'));
});
