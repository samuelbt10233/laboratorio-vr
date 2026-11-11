import { subjectEntries } from '../subjects';
import { moduleProgress, myModules, openModules } from './asignaciones';
/** General modules page of the ESSA demo: the trainee's modules with progress, then the open ones. */
const chevron='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg>';
const el=<K extends keyof HTMLElementTagNameMap>(tag:K,cls?:string,text?:string)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
const shortDate=(d:Date)=>d.toLocaleDateString('es-CO',{day:'numeric',month:'short'}).replace('.','');
function section(title:string,count:number){
  const box=el('section','modules-section'),head=el('h2','home-col-title',title);head.append(el('span','home-count',String(count)));
  const grid=el('ul','modules-grid');box.append(head,grid);return {box,grid};
}
function card(grid:HTMLElement,title:string,description:string,onClick:()=>void){
  const li=el('li'),b=el('button','module-card');b.type='button';b.onclick=onClick;
  const top=el('span','module-card-top');top.append(el('strong','',title));top.insertAdjacentHTML('beforeend',chevron);
  b.append(top,el('span','module-card-text',description));li.append(b);grid.append(li);return b;
}
export function renderModules(host:HTMLElement,openSubject:(id:string)=>void){
  host.replaceChildren();
  const today=new Date();today.setHours(0,0,0,0);
  const mine=section('Mis módulos',myModules().length);
  for(const m of myModules()){
    const p=moduleProgress(m.subjectId,today),next=p.classes.find(c=>!c.done);
    const b=card(mine.grid,m.title,m.description,()=>openSubject(m.subjectId));
    const count=el('span','module-card-count',`${p.done} de ${p.total} ${p.total===1?'clase completada':'clases completadas'}`);
    const bar=el('span','home-bar');bar.setAttribute('role','progressbar');bar.setAttribute('aria-label',`Clases completadas de ${m.title}`);bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax',String(p.total));bar.setAttribute('aria-valuenow',String(p.done));
    const fill=el('span');fill.style.width=`${p.total?Math.round(p.done/p.total*100):0}%`;bar.append(fill);
    b.append(count,bar,el('small','module-card-next',next?`Siguiente: ${next.title} · revisión ${shortDate(next.review)}`:'Módulo completado'));
  }
  const open=section('Módulos abiertos',openModules().length);
  for(const m of openModules()){
    const classes=subjectEntries(m.subjectId).filter(e=>e.kind==='class'&&!e.planned).length;
    const b=card(open.grid,m.title,m.description,()=>openSubject(m.subjectId));
    b.append(el('small','module-card-next',`${classes} ${classes===1?'clase':'clases'} · acceso libre`));
  }
  host.append(mine.box,open.box);
}
