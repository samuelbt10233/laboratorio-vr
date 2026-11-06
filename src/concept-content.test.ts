import test from 'node:test';
import assert from 'node:assert/strict';
import { getLearningContent } from './learning-content';
import { subjectEntries } from './subjects';

const concepts=['industrial-torno','mecanica-pendulo','fluidos-bernoulli'];

test('each concept is a real reading, with its duration and no laboratory',()=>{
  for(const id of concepts){
    const c=getLearningContent(id);
    assert.equal(c.runtimeClassId,null,id);assert.equal(c.labId,undefined,id);
    assert.ok(c.sections.length>=5,`${id} needs at least five sections`);
    assert.match(c.duration,/^\d+ min/,`${id} duration`);
    assert.doesNotMatch(c.description,/Propuesta de contenido/,`${id} still reads as a placeholder`);
    for(const s of c.sections){assert.ok(s.title&&s.text.length>60&&s.example.length>30,`${id}: ${s.title}`);}
  }
});
test('a concept says so in its last section instead of pretending to be a laboratory',()=>{
  for(const id of concepts){
    const last=getLearningContent(id).sections.at(-1)!;
    assert.match(last.title,/^Concepto/,id);
    assert.match(`${last.text} ${last.example}`,/laboratorio/i,id);
  }
});
test('the pendulum and Bernoulli readings carry their governing relations',()=>{
  const pendulum=getLearningContent('mecanica-pendulo').sections.map(s=>s.text+s.example).join(' ');
  assert.match(pendulum,/T = 2π√\(L\/g\)/);
  const bernoulli=getLearningContent('fluidos-bernoulli').sections.map(s=>s.text+s.example).join(' ');
  assert.match(bernoulli,/A₁ · v₁ = A₂ · v₂/);assert.match(bernoulli,/Bernoulli/);
});
test('each concept shows as a planned card under its own subject',()=>{
  for(const [subject,id] of [['industrial','industrial-torno'],['mechanics','mecanica-pendulo'],['fluids','fluidos-bernoulli']]){
    const card=subjectEntries(subject).find(e=>e.classId===id);
    assert.ok(card,`${id} has no card in ${subject}`);assert.equal(card!.planned,true,id);assert.equal(card!.laboratoryId,null,id);
  }
});
