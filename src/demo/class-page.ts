import { evaluationFor, grade, saveEvaluation } from './evaluaciones';
/** Parts of a class page that the reading content does not provide: the video slot and the knowledge check. */
const el=<K extends keyof HTMLElementTagNameMap>(tag:K,cls?:string,text?:string)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
const PLAY='<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30"/><path d="M26 21v22l18-11z"/></svg>';
/** A placeholder that marks where the topic video will go; nothing plays. */
export function renderVideo(host:HTMLElement,title:string){
  const frame=el('div','class-video-frame');frame.setAttribute('role','img');frame.setAttribute('aria-label',`Espacio reservado para el video de «${title}»`);
  frame.innerHTML=PLAY;frame.append(el('strong','',title),el('span','','Video del tema · en producción'));
  host.replaceChildren(frame);
}
/** Multiple-choice check: every answer must be right to pass; each question explains itself after checking. */
export function renderEvaluation(host:HTMLElement,classId:string,note?:string){
  host.replaceChildren();
  const questions=evaluationFor(classId);
  if(!questions){host.append(el('p','class-eval-empty','La evaluación de esta clase está en preparación.'));return;}
  const form=el('form','class-eval');form.noValidate=true;
  questions.forEach((q,i)=>{
    const set=el('fieldset','class-question');set.append(el('legend','',`${i+1}. ${q.prompt}`));
    q.options.forEach((option,j)=>{
      const label=el('label','class-option'),input=el('input');input.type='radio';input.name=`q${i}`;input.value=String(j);
      label.append(input,el('span','',option));set.append(label);
    });
    set.append(el('p','class-feedback'));form.append(set);
  });
  const actions=el('div','class-eval-actions'),submit=el('button','class-eval-submit','Comprobar respuestas'),score=el('p','class-eval-score');
  submit.type='submit';score.setAttribute('role','status');actions.append(submit,score);form.append(actions);
  if(note)form.append(el('p','class-eval-note',note));
  form.onsubmit=event=>{
    event.preventDefault();
    if(form.classList.contains('is-checked')){form.reset();form.classList.remove('is-checked','is-passed');form.querySelectorAll('.class-question').forEach(q=>{q.classList.remove('is-right','is-wrong');q.querySelector('.class-feedback')!.textContent='';});score.textContent='';submit.textContent='Comprobar respuestas';form.querySelector<HTMLInputElement>('input')?.focus();return;}
    const answers=questions.map((_,i)=>{const picked=form.querySelector<HTMLInputElement>(`input[name="q${i}"]:checked`);return picked?Number(picked.value):null;});
    if(answers.includes(null)){score.textContent='Faltan preguntas por responder.';return;}
    const result=grade(questions,answers);
    form.querySelectorAll('.class-question').forEach((set,i)=>{set.classList.add(result.results[i]?'is-right':'is-wrong');set.querySelector('.class-feedback')!.textContent=`${result.results[i]?'Correcto.':'Incorrecto.'} ${questions[i].why}`;});
    form.classList.add('is-checked');form.classList.toggle('is-passed',result.passed);
    score.textContent=result.passed?`Aprobada: ${result.correct} de ${result.total} respuestas correctas.`:`No aprobada: ${result.correct} de ${result.total} respuestas correctas. Revise las explicaciones y repita la evaluación.`;
    submit.textContent='Repetir evaluación';saveEvaluation(classId,result.correct,result.total);
  };
  host.append(form);
}
