import { subjectEntries } from '../subjects';
import { isMyModule, moduleProgress } from './asignaciones';
/** One module of the demo: its progress and its classes in order, with what is done and when each is reviewed. */
export interface ModulePageActions {openReading(classId:string):void;openFree():void}
const chevron='<svg class="class-row-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg>';
const check='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7"/></svg>';
const el=<K extends keyof HTMLElementTagNameMap>(tag:K,cls?:string,text?:string)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
const shortDate=(d:Date)=>d.toLocaleDateString('es-CO',{day:'numeric',month:'short'}).replace('.','');
function dueIn(review:Date,today:Date){const days=Math.round((review.getTime()-today.getTime())/864e5);return days<0?'Vencida':days===0?'Hoy':days===1?'Mañana':`En ${days} días`;}
function heading(title:string,count?:number){const h=el('h2','home-col-title',title);if(count!==undefined)h.append(el('span','home-count',String(count)));return h;}
function row(list:HTMLElement,step:string,title:string,description:string,meta:string,status:[string,string],onClick:()=>void,state?:'done'|'next'){
  const li=el('li'),b=el('button','class-row');b.type='button';b.onclick=onClick;if(state)b.classList.add(`is-${state}`);
  const marker=el('span','class-step');if(state==='done')marker.innerHTML=check;else marker.textContent=step;
  const copy=el('span','class-copy');copy.append(el('strong','',title),el('span','class-text',description),el('small','',meta));
  const when=el('span','class-status');when.append(el('strong','',status[0]),el('small','',status[1]));
  b.append(marker,copy,when);b.insertAdjacentHTML('beforeend',chevron);li.append(b);list.append(li);
}
export function renderModulePage(host:HTMLElement,subjectId:string,actions:ModulePageActions){
  host.replaceChildren();
  const today=new Date();today.setHours(0,0,0,0);
  const mine=isMyModule(subjectId),entries=subjectEntries(subjectId).filter(e=>!e.planned);
  const classes=entries.filter(e=>e.kind==='class'),free=entries.filter(e=>e.kind==='free');
  const progress=moduleProgress(subjectId,today);
  const summary=el('div','module-summary');
  if(mine){
    const next=progress.classes.find(c=>!c.done);
    const bar=el('span','home-bar');bar.setAttribute('role','progressbar');bar.setAttribute('aria-label','Clases completadas del módulo');bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax',String(progress.total));bar.setAttribute('aria-valuenow',String(progress.done));
    const fill=el('span');fill.style.width=`${progress.total?Math.round(progress.done/progress.total*100):0}%`;bar.append(fill);
    summary.append(el('strong','',`${progress.done} de ${progress.total} ${progress.total===1?'clase completada':'clases completadas'}`),bar,el('span','',next?`Próxima revisión: ${shortDate(next.review)} · ${next.title}`:'Módulo completado'));
  }else summary.append(el('strong','',`${classes.length} ${classes.length===1?'clase':'clases'}`),el('span','','Módulo abierto: puedes tomarlo cuando quieras'));
  const section=el('section','module-classes');const list=el('ol','class-list');
  const nextId=progress.classes.find(c=>!c.done)?.classId;
  classes.forEach((c,i)=>{
    const assigned=progress.classes.find(a=>a.classId===c.classId);
    const status:[string,string]=assigned?.done?['Completada','Repasar']:assigned?[`Revisión ${shortDate(assigned.review)}`,dueIn(assigned.review,today)]:['Disponible','Sin fecha'];
    row(list,String(i+1),c.title,c.description,c.meta.join(' · '),status,()=>actions.openReading(c.classId!),assigned?.done?'done':c.classId===nextId?'next':undefined);
  });
  section.append(heading('Clases',classes.length),list);
  host.append(summary,section);
  if(free.length){
    const extra=el('section','module-classes');const freeList=el('ul','class-list');
    for(const f of free)row(freeList,'·',f.title,f.description,f.meta.join(' · '),['Práctica libre','Sin evaluación'],actions.openFree);
    extra.append(heading('Práctica libre'),freeList);host.append(extra);
  }
}
