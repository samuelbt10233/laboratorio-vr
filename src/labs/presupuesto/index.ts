import type { LabModule } from '../types';
import { saveResult } from '../cinco-reglas/result';
import { budgetStages, choose, INCOME, libre, startMonth, type MonthResult, type MonthState } from './procedure';
import '../cinco-reglas/cinco-reglas.css';
import './presupuesto.css';
const START_MESSAGE='Elegir en cada momento del mes la decisión que protege el presupuesto. «Pista» marca la opción correcta.';
const NOTE='Contenido didáctico de demostración. No constituye asesoría financiera. Cifras ficticias.';
const clockText=(seconds:number)=>`${Math.floor(seconds/60)} min ${String(Math.round(seconds%60)).padStart(2,'0')} s`;
const cop=(n:number)=>`$${Math.round(n).toLocaleString('es-CO')}`;
const BUCKETS=[['fijos','Fijos y cuota'],['fondo','Fondo para imprevistos'],['variables','Alimentación y salidas'],['imprevistos','Imprevistos'],['libre','Disponible']] as const;
let session:{dispose:()=>void}|null=null;
/** Budget simulator for the ICETEX demo: a month of decisions on a 2D desk; same panel and certificate styles as the 3D labs. */
export const lab:LabModule={
  mount({host,contentId}){
    session?.dispose();
    const el=<K extends keyof HTMLElementTagNameMap>(tag:K,cls?:string,text?:string,parent?:HTMLElement)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;parent?.append(e);return e;};
    const root=el('div','budget-root',undefined,host);
    const controls=el('div','cinco-reglas-controls',undefined,root);
    const hintButton=el('button','','Pista',controls),resetButton=el('button','','Reiniciar',controls);
    const panel=el('aside','cinco-reglas-panel budget-panel',undefined,root);panel.setAttribute('aria-live','polite');
    const stage=el('div','budget-stage',undefined,root);
    const card=el('section','cinco-reglas-card',undefined,root);card.hidden=true;card.setAttribute('aria-live','polite');
    let state:MonthState=startMonth(),message=START_MESSAGE,hint=false,wrong:string[]=[],started=performance.now();

    const head=el('div','budget-head',undefined,stage);
    const titles=el('div','budget-titles',undefined,head);el('h2','','Un mes de Valentina',titles);el('p','',`Ingreso del mes: ${cop(INCOME)}`,titles);
    const calendar=el('ol','budget-calendar',undefined,head);calendar.setAttribute('aria-label','Días del mes');
    const days=Array.from({length:30},(_,i)=>{const d=el('li','',String(i+1),calendar);if(budgetStages.some(s=>s.day===i+1))d.classList.add('event');return d;});
    const money=el('section','budget-money',undefined,stage);
    const stat=(label:string)=>{const box=el('div','budget-stat',undefined,money);el('span','',label,box);return el('strong','','',box);};
    const available=stat('Disponible en la cuenta'),fund=stat('Fondo para imprevistos'),installment=stat('Cuota del crédito');
    const split=el('section','budget-split',undefined,stage);el('h3','',`A dónde va el ingreso de ${cop(INCOME)}`,split);
    const bar=el('div','budget-bar',undefined,split);bar.setAttribute('role','img');
    const legend=el('ul','budget-legend',undefined,split);
    const segments=BUCKETS.map(([id,label])=>{const seg=el('span',`seg ${id}`,undefined,bar);const li=el('li',id,undefined,legend);el('i','',undefined,li);el('span','',label,li);return {id,seg,amount:el('strong','','',li)};});
    const event=el('section','budget-event',undefined,stage);

    const drawPanel=()=>{
      panel.replaceChildren();
      el('p','cinco-reglas-kicker','Simulador de presupuesto',panel);
      const list=el('ol','',undefined,panel);
      budgetStages.forEach((s,i)=>{const done=state.finished||i<state.stage;el('li',done?'done':i===state.stage?'current':'',`Día ${s.day} · ${s.title}`,list);});
      el('h3','',state.finished?'Mes completo':`Momento ${state.stage+1} de ${budgetStages.length}`,panel);
      el('p','cinco-reglas-message',message,panel);
      el('p','cinco-reglas-errors',`Errores: ${state.errors}`,panel);
      el('p','budget-note',NOTE,panel);
    };
    const drawStage=()=>{
      const m=state.money,free=libre(m),current=budgetStages[state.stage];
      days.forEach((d,i)=>{d.classList.toggle('today',!state.finished&&i+1===current.day);d.classList.toggle('past',state.finished||i+1<current.day);});
      available.textContent=cop(free);fund.textContent=cop(m.fondo);
      installment.textContent=m.cuota==='al-dia'?'Al día':'Pendiente';installment.className=m.cuota==='al-dia'?'ok':'due';
      const values:Record<string,number>={fijos:m.fijos,fondo:m.fondo,variables:m.variables,imprevistos:m.imprevistos,libre:free};
      for(const s of segments){const v=values[s.id];s.seg.style.width=`${v/INCOME*100}%`;s.amount.textContent=cop(v);s.amount.parentElement!.classList.toggle('zero',v===0);}
      bar.setAttribute('aria-label',segments.map(s=>`${s.amount.previousElementSibling!.textContent}: ${s.amount.textContent}`).join(', '));
      event.replaceChildren();
      if(state.finished){
        el('p','budget-day','Día 30 · Mes cerrado',event);el('h3','','La cuota quedó al día y el fondo terminó con ahorro',event);
        el('p','budget-situation',`Fondo para imprevistos: ${cop(m.fondo)}. Imprevistos pagados sin deudas: ${cop(m.imprevistos)}.`,event);
        return;
      }
      el('p','budget-day',`Día ${current.day}`,event);el('h3','',current.title,event);el('p','budget-situation',current.situation,event);
      const options=el('div','budget-options',undefined,event);
      current.choices.forEach((c,i)=>{
        const b=el('button','budget-option',undefined,options);b.type='button';
        el('span','budget-letter','ABC'[i],b);el('span','',c.label,b);
        if(wrong.includes(c.id))b.classList.add('wrong');
        if(hint&&c.ok)b.classList.add('hint');
        b.onclick=()=>run(choose(state,c.id),c.id);
      });
    };
    const certificate=(seconds:number)=>{
      card.replaceChildren();
      el('p','cinco-reglas-kicker','Constancia de práctica · Datos de demostración',card);el('h2','','Presupuesto y ahorro',card);el('p','','Un mes con la cuota al día y sin deudas por imprevistos',card);
      const list=el('dl','',undefined,card);for(const [k,v] of [['Errores',String(state.errors)],['Fondo al cierre',cop(state.money.fondo)],['Tiempo',clockText(seconds)],['Fecha',new Date().toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'})]]){el('dt','',k,list);el('dd','',v,list);}
      el('p','cinco-reglas-note',NOTE,card);
      const close=el('button','','Cerrar',card);close.onclick=()=>{card.hidden=true;};card.hidden=false;
    };
    const refresh=()=>{drawPanel();drawStage();};
    function run(result:MonthResult,id:string){
      const was=state.finished;state=result.state;message=result.message;
      if(result.ok){wrong=[];hint=false;stage.classList.remove('shake');}
      else if(!state.finished){wrong=[...wrong,id];stage.classList.remove('shake');void stage.offsetWidth;stage.classList.add('shake');}
      if(state.finished&&!was){const seconds=(performance.now()-started)/1000;message=`${message} Tiempo: ${clockText(seconds)}.`;saveResult({contentId,aprobado:true,errores:state.errors,segundos:Math.round(seconds),fecha:new Date().toISOString()});certificate(seconds);}
      refresh();
    }
    hintButton.onclick=()=>{hint=!hint;refresh();};
    resetButton.onclick=()=>{state=startMonth();message=START_MESSAGE;hint=false;wrong=[];started=performance.now();card.hidden=true;refresh();};
    refresh();
    session={dispose:()=>{root.remove();session=null;}};
  },
  unmount(){session?.dispose();},
};
