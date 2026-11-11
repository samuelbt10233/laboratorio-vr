import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluationFor, grade } from './demo/evaluaciones';
import { getLearningContent } from './learning-content';

const demoClasses=['distribucion-cinco-reglas','ley-de-ohm','circuitos-en-paralelo','encuentra-el-fallo','enciende-un-led','industrial-loto'];

test('every class shown in the demo has an evaluation of three questions', () => {
  for(const id of demoClasses){
    getLearningContent(id);
    const questions=evaluationFor(id);
    assert.equal(questions?.length,3,id);
    for(const q of questions!)assert.ok(q.answer>=0&&q.answer<q.options.length,`${id}: ${q.prompt}`);
  }
});

test('a class without questions has no evaluation', () => {
  assert.equal(evaluationFor('mecanica-pendulo'),undefined);
});

test('grading passes only when every answer is right', () => {
  const questions=evaluationFor('distribucion-cinco-reglas')!;
  const right=questions.map(q=>q.answer);
  assert.deepEqual(grade(questions,right),{correct:3,total:3,passed:true,results:[true,true,true]});
  const oneWrong=[...right];oneWrong[1]=(right[1]+1)%questions[1].options.length;
  assert.deepEqual(grade(questions,oneWrong),{correct:2,total:3,passed:false,results:[true,false,true]});
  assert.equal(grade(questions,[right[0],null,right[2]]).passed,false);
});
