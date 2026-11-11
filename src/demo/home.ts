import { readResult } from '../labs/cinco-reglas/result';
import { moduleProgress, myModules, pendingActivities } from './asignaciones';
import { POLE } from './pole';
/** Start page of the ESSA demo: active modules, pending activities with review dates, and the trainee's progress. */
export interface HomeActions {openSubject(id:string):void;openReading(id:string):void;openModules():void}
const chevron='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg>';
const el=<K extends keyof HTMLElementTagNameMap>(tag:K,cls?:string,text?:string)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
const minutes=(s:number)=>`${Math.floor(s/60)} min ${String(s%60).padStart(2,'0')} s`;
const longDate=(d:Date)=>d.toLocaleDateString('es-CO',{day:'numeric',month:'long'});
const shortDate=(d:Date)=>d.toLocaleDateString('es-CO',{day:'numeric',month:'short'}).replace('.','');
function dueIn(review:Date,today:Date){const days=Math.round((review.getTime()-today.getTime())/864e5);return days<=0?'Hoy':days===1?'Mañana':`En ${days} días`;}
/** Greeting for the demo profile and a one-line summary of what is pending. */
function renderBanner(banner:HTMLElement,actions:HomeActions,role:string|undefined,pending:number,next:Date|undefined){
  const supervisor=role==='supervisora';
  const summary=!pending?'Estás al día con tus módulos.':`${supervisor?'Tu cuadrilla tiene':'Tienes'} ${pending} ${pending===1?'actividad pendiente':'actividades pendientes'}. Próxima revisión: ${longDate(next!)}.`;
  const copy=el('div','home-banner-copy');
  copy.append(el('span','home-banner-role',supervisor?'Supervisora, jefa de cuadrilla':'Técnico liniero'),el('h2','',supervisor?'Hola, Laura':'Hola, Andrés'),el('p','',summary));
  const go=el('button','home-go-modules','Ir a mis módulos');go.type='button';go.onclick=actions.openModules;copy.append(go);
  const art=el('div','home-banner-art');art.setAttribute('aria-hidden','true');art.innerHTML=POLE;
  banner.replaceChildren(copy,art);
}
function section(title:string,count:number){const col=el('section','home-col'),head=el('h2','home-col-title',title);head.append(el('span','home-count',String(count)));col.append(head);return col;}
export function renderHome(host:HTMLElement,actions:HomeActions,role?:string){
  document.querySelector('.home-banner')?.classList.remove('supervisor-banner');
  host.replaceChildren();
  const today=new Date();today.setHours(0,0,0,0);
  const result=readResult(),practiceDone=!!result?.aprobado;
  const pending=pendingActivities(today,practiceDone);
  const banner=document.querySelector<HTMLElement>('.home-banner');
  if(banner)renderBanner(banner,actions,role,pending.length,pending[0]?.review);

  const modules=section('Módulos activos',myModules().length);const moduleList=el('ul','home-list home-modules');
  let done=0,total=0;
  for(const m of myModules()){
    const p=moduleProgress(m.subjectId,today,practiceDone);done+=p.done;total+=p.total;
    const li=el('li'),b=el('button','home-module');b.type='button';b.onclick=()=>actions.openSubject(m.subjectId);
    const top=el('span','home-module-top');top.append(el('strong','',m.title),el('span','home-module-count',`${p.done} de ${p.total} ${p.total===1?'clase':'clases'}`));
    const bar=el('span','home-bar');bar.setAttribute('role','progressbar');bar.setAttribute('aria-label',`Clases completadas de ${m.title}`);bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax',String(p.total));bar.setAttribute('aria-valuenow',String(p.done));
    const fill=el('span');fill.style.width=`${p.total?Math.round(p.done/p.total*100):0}%`;bar.append(fill);
    const next=p.classes.find(c=>!c.done);
    b.append(top,bar,el('small','',next?`Siguiente: ${next.title} · revisión ${shortDate(next.review)}`:'Módulo completado'));
    li.append(b);moduleList.append(li);
  }
  modules.append(moduleList);

  const activities=section('Actividades pendientes',pending.length);const list=el('ul','home-list');
  pending.forEach((a,i)=>{
    const li=el('li'),b=el('button','home-row home-activity');b.type='button';if(i===0)b.classList.add('is-next');b.onclick=()=>actions.openReading(a.classId);
    const text=el('span');text.append(el('strong','',a.title),el('small','',a.moduleTitle));
    const when=el('span','home-due');when.append(el('strong','',`Revisión ${shortDate(a.review)}`),el('small','',dueIn(a.review,today)));
    b.innerHTML=chevron;b.prepend(text,when);li.append(b);list.append(li);
  });
  if(!pending.length)list.append(el('li','home-empty','No tienes actividades pendientes.'));
  activities.append(list);

  const grid=el('div','home-grid');grid.append(modules,activities);
  const progress=el('section','home-progress');const head=el('div','home-progress-head');head.append(el('h2','','Tu avance'),el('span','home-demo-note','Datos de demostración'));
  const stats=el('div','home-stats');
  for(const [label,value,note] of [
    ['Clases completadas',String(done),`de ${total} asignadas`],
    ['Errores en el último intento',result?String(result.errores):'—',result?'Cada error explica el riesgo':'Aún sin intentos'],
    ['Tiempo del último intento',result?minutes(result.segundos):'—',result?longDate(new Date(result.fecha)):'Aún sin intentos'],
  ] as const){const card=el('div','home-stat');card.append(el('span','home-stat-label',label),el('strong','',value),el('small','',note));stats.append(card);}
  progress.append(head,stats);
  host.append(grid,progress);
}
