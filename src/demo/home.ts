import { readResult } from '../labs/cinco-reglas/result';
import { subjectEntries } from '../subjects';
/** Start page of the ESSA demo: routes, the assigned practice, classes and the trainee's progress. */
export interface HomeActions {openSubject(id:string):void;openReading(id:string):void}
const ASSIGNED='distribucion-cinco-reglas';
const chevron='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg>';
const el=<K extends keyof HTMLElementTagNameMap>(tag:K,cls?:string,text?:string)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;};
function column(title:string,onTitle?:()=>void){
  const col=el('section','home-col'),head=onTitle?el('button','home-col-title'):el('h2','home-col-title');
  head.innerHTML=`<span></span>${onTitle?chevron:''}`;head.querySelector('span')!.textContent=title;if(onTitle)(head as HTMLButtonElement).onclick=onTitle;
  const list=el('ul','home-list');col.append(head,list);return {col,list};
}
function row(list:HTMLElement,title:string,detail:string,onClick:()=>void){
  const li=el('li'),b=el('button','home-row');b.innerHTML=`<span><strong></strong><small></small></span>${chevron}`;
  b.querySelector('strong')!.textContent=title;b.querySelector('small')!.textContent=detail;b.onclick=onClick;li.append(b);list.append(li);
}
const minutes=(s:number)=>`${Math.floor(s/60)} min ${String(s%60).padStart(2,'0')} s`;
export function renderHome(host:HTMLElement,actions:HomeActions){
  host.replaceChildren();
  const subjects=subjectEntries(null);
  const routes=column('Rutas',()=>actions.openSubject(subjects[0].subjectId));
  for(const s of subjects)row(routes.list,s.title,s.meta[0],()=>actions.openSubject(s.subjectId));
  const classes=subjects.flatMap(s=>subjectEntries(s.subjectId)).filter(e=>e.kind==='class'&&!e.planned&&e.classId!=='industrial-torno');
  const assigned=column('Práctica asignada');const card=el('button','home-assigned');
  const result=readResult();
  card.innerHTML='<strong>Las cinco reglas de oro</strong><span>Poste con transformador · lectura y práctica en 3D</span><em></em>';
  card.querySelector('em')!.textContent=result?.aprobado?'Completada · repetir':'Empezar';card.onclick=()=>actions.openReading(ASSIGNED);assigned.col.append(card);
  const list=column('Clases');for(const c of classes.slice(0,5))row(list.list,c.title,(subjects.find(s=>s.subjectId===c.subjectId)?.title)??'',()=>actions.openReading(c.classId!));
  const grid=el('div','home-grid');grid.append(routes.col,assigned.col,list.col);
  const progress=el('section','home-progress');const head=el('div','home-progress-head');head.append(el('h2','','Tu avance'),el('span','home-demo-note','Datos de esta sesión de demostración'));
  const stats=el('div','home-stats');
  for(const [label,value,note] of [
    ['Prácticas completadas',result?.aprobado?'1':'0','de 1 asignada'],
    ['Errores en el último intento',result?String(result.errores):'—',result?'Cada error explica el riesgo':'Aún sin intentos'],
    ['Tiempo del último intento',result?minutes(result.segundos):'—',result?new Date(result.fecha).toLocaleDateString('es-CO',{day:'numeric',month:'long'}):'Aún sin intentos'],
  ] as const){const card=el('div','home-stat');card.append(el('span','home-stat-label',label),el('strong','',value),el('small','',note));stats.append(card);}
  progress.append(head,stats);
  host.append(grid,progress);
}
