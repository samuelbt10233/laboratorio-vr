import { readResult } from '../labs/cinco-reglas/result';
import { moduleProgress, myModules, pendingActivities } from './asignaciones';
/** Start page of the ESSA demo: active modules, pending activities with review dates, and the trainee's progress. */
export interface HomeActions {openSubject(id:string):void;openReading(id:string):void}
const chevron='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg>';
const el=<K extends keyof HTMLElementTagNameMap>(tag:K,cls?:string,text?:string)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
const minutes=(s:number)=>`${Math.floor(s/60)} min ${String(s%60).padStart(2,'0')} s`;
/** Line drawing of a distribution pole with a transformer; decoration only. */
const POLE=`<svg viewBox="0 0 340 170" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path d="M0 26 Q60 44 130 30M210 30Q280 44 340 26M0 16Q85 34 170 18Q255 34 340 16" stroke="#5f86a3" stroke-width="1.5"/>
<path d="M170 34V170M120 40H220M130 40V30M210 40V30M170 34V18" stroke="#9db8cc" stroke-width="3"/>
<circle cx="130" cy="29" r="3" fill="#123a56" stroke="#cfdde8" stroke-width="2"/><circle cx="210" cy="29" r="3" fill="#123a56" stroke="#cfdde8" stroke-width="2"/><circle cx="170" cy="17" r="3" fill="#123a56" stroke="#cfdde8" stroke-width="2"/>
<path d="M170 78H184M170 112H184" stroke="#9db8cc" stroke-width="2.5"/>
<rect x="184" y="68" width="40" height="54" rx="5" stroke="#cfdde8" stroke-width="2.5"/>
<path d="M194 76V114M204 76V114M214 76V114" stroke="#7fa3bf" stroke-width="1.5"/>
<path d="M196 68V58M212 68V58M212 58Q226 44 210 30" stroke="#cfdde8" stroke-width="2"/>
<path d="M170 128L180 145H160Z" stroke="#f2c230" stroke-width="2"/><path d="M170 134V139" stroke="#f2c230" stroke-width="2"/>
<path d="M40 169H300" stroke="#5f86a3" stroke-width="1.5"/>
</svg>`;
const longDate=(d:Date)=>d.toLocaleDateString('es-CO',{day:'numeric',month:'long'});
const shortDate=(d:Date)=>d.toLocaleDateString('es-CO',{day:'numeric',month:'short'}).replace('.','');
function dueIn(review:Date,today:Date){const days=Math.round((review.getTime()-today.getTime())/864e5);return days<=0?'Hoy':days===1?'Mañana':`En ${days} días`;}
/** Greeting for the demo profile and a one-line summary of what is pending. */
function renderBanner(banner:HTMLElement,role:string|undefined,pending:number,next:Date|undefined){
  const supervisor=role==='supervisora';
  const summary=!pending?'Estás al día con tus módulos.':`${supervisor?'Tu cuadrilla tiene':'Tienes'} ${pending} ${pending===1?'actividad pendiente':'actividades pendientes'}. Próxima revisión: ${longDate(next!)}.`;
  const copy=el('div','home-banner-copy');
  copy.append(el('span','home-banner-role',supervisor?'Supervisora, jefa de cuadrilla':'Técnico liniero'),el('h2','',supervisor?'Hola, Laura':'Hola, Andrés'),el('p','',summary));
  const art=el('div','home-banner-art');art.setAttribute('aria-hidden','true');art.innerHTML=POLE;
  banner.replaceChildren(copy,art);
}
function section(title:string){const col=el('section','home-col');col.append(el('h2','home-col-title',title));return col;}
export function renderHome(host:HTMLElement,actions:HomeActions,role?:string){
  host.replaceChildren();
  const today=new Date();today.setHours(0,0,0,0);
  const result=readResult(),practiceDone=!!result?.aprobado;
  const pending=pendingActivities(today,practiceDone);
  const banner=document.querySelector<HTMLElement>('.home-banner');
  if(banner)renderBanner(banner,role,pending.length,pending[0]?.review);

  const modules=section('Módulos activos');const moduleList=el('ul','home-list home-modules');
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

  const activities=section('Actividades pendientes');const list=el('ul','home-list');
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
