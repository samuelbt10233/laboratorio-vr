import { ArcRotateCamera, DynamicTexture, Engine, HemisphericLight, PointerEventTypes, Scene, Vector3 } from '@babylonjs/core';
import type { LabModule } from '../types';
import { saveResult } from '../cinco-reglas/result';
import { decide, eppItems, inflate, inspect, startInspection, type EppId, type EppResult, type EppState, type Verdict } from './procedure';
import { buildEppScene } from './scene';
import '../cinco-reglas/cinco-reglas.css';
import './epp.css';
const START_MESSAGE='Seleccionar cada elemento del banco para inspeccionarlo y decidir si está apto o se retira.';
const clockText=(seconds:number)=>`${Math.floor(seconds/60)} min ${String(Math.round(seconds%60)).padStart(2,'0')} s`;
let session:{dispose:()=>void}|null=null;
/** Inspection of protective equipment on a bench: its own canvas and engine; same panel and certificate styles as the five rules. */
export const lab:LabModule={
  mount({host,contentId}){
    session?.dispose();
    const canvas=document.createElement('canvas');canvas.id='epp-canvas';canvas.setAttribute('aria-label','Práctica de inspección del equipo de protección personal, en 3D');canvas.tabIndex=0;
    const controls=document.createElement('div');controls.className='cinco-reglas-controls';
    const button=(label:string,parent:HTMLElement=controls,cls?:string)=>{const b=document.createElement('button');b.type='button';b.textContent=label;if(cls)b.className=cls;parent.append(b);return b;};
    const hintButton=button('Pista'),resetButton=button('Reiniciar');
    const card=document.createElement('section');card.className='cinco-reglas-card';card.hidden=true;card.setAttribute('aria-live','polite');
    const panel=document.createElement('aside');panel.className='cinco-reglas-panel epp-panel';panel.setAttribute('aria-live','polite');
    host.append(canvas,controls,panel,card);
    const engine=new Engine(canvas,true,{preserveDrawingBuffer:true,stencil:true}),scene=new Scene(engine);
    new HemisphericLight('sky',new Vector3(0,1,-.3),scene).intensity=.6;
    const camera=new ArcRotateCamera('bench camera',-Math.PI/2,1.0,2.9,new Vector3(-.55,.95,1.15),scene);camera.fov=.95;
    camera.lowerRadiusLimit=1.6;camera.upperRadiusLimit=5;camera.lowerBetaLimit=.5;camera.upperBetaLimit=1.45;camera.lowerAlphaLimit=-Math.PI/2-.9;camera.upperAlphaLimit=-Math.PI/2+.9;camera.minZ=.02;camera.attachControl(canvas,true);
    const view=buildEppScene(scene);
    let state:EppState=startInspection(),message=START_MESSAGE,selected:EppId|null=null,hint=false,started=performance.now();
    const hintTarget=()=>eppItems.find(i=>!state.decided[i.id])?.id??null;
    const drawPanel=()=>{
      panel.replaceChildren();
      const add=(tag:string,text:string,cls?:string,parent:HTMLElement=panel)=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;parent.append(e);return e;};
      add('p','Inspección del equipo de protección','cinco-reglas-kicker');
      const list=add('ol','','epp-list');
      eppItems.forEach((it,i)=>{const v=state.decided[it.id],li=add('li','',v?'done':selected===it.id?'current':'',list),b=button(`${i+1}. ${it.name}`,li,'epp-item');b.onclick=()=>run(inspect(state,it.id),it.id);if(v)add('span',v==='apto'?'Apto':'Retirado',`epp-verdict ${v}`,li);});
      const it=selected&&eppItems.find(i=>i.id===selected);
      if(it&&!state.finished){
        const detail=add('div','','epp-detail');add('h3',it.name,'',detail);
        const findings=add('ul','','epp-findings',detail);for(const f of state.findings[it.id]??[])add('li',f,'',findings);
        if(!state.decided[it.id]){
          const actions=add('div','','epp-actions',detail);
          if(it.inflate&&!state.inflated.includes(it.id))button('Inflar',actions).onclick=()=>{const r=inflate(state,it.id);if(r.ok&&!state.inflated.includes(it.id))view.inflate(it.id,it.inflate!.includes('pierde aire'));run(r,it.id);};
          const verdict=(label:string,v:Verdict)=>{button(label,actions,`epp-${v}`).onclick=()=>run(decide(state,it.id,v),it.id);};
          verdict('Apto','apto');verdict('Retirar','retirar');
        }
      }
      add('p',state.finished?message:hint?`Siguiente elemento: ${eppItems.find(i=>i.id===hintTarget())?.name??''}.`:message,'cinco-reglas-message');
      add('p',`Errores: ${state.errors}`,'cinco-reglas-errors');
    };
    const certificate=(seconds:number)=>{
      card.replaceChildren();
      const add=(tag:string,text:string,cls?:string)=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;card.append(e);return e;};
      add('p','Constancia de práctica · Datos de demostración','cinco-reglas-kicker');add('h2','Inspección del equipo de protección');add('p',`${eppItems.filter(i=>i.defect).length} elementos retirados y reportados`);
      const list=document.createElement('dl');for(const [k,v] of [['Errores',String(state.errors)],['Tiempo',clockText(seconds)],['Fecha',new Date().toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'})]]){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;list.append(dt,dd);}card.append(list);
      add('p','Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA.','cinco-reglas-note');
      const close=add('button','Cerrar');close.onclick=()=>{card.hidden=true;};card.hidden=false;
    };
    const refresh=()=>{view.update(state,selected,hint?hintTarget():null);drawPanel();};
    function run(result:EppResult,id:EppId){
      const was=state.finished;state=result.state;message=result.message;selected=id;
      if(state.finished&&!was){const seconds=(performance.now()-started)/1000;message=`${message} Tiempo: ${clockText(seconds)}.`;saveResult({contentId,aprobado:true,errores:state.errors,segundos:Math.round(seconds),fecha:new Date().toISOString()});certificate(seconds);}
      refresh();
    }
    hintButton.onclick=()=>{hint=!hint;refresh();};
    resetButton.onclick=()=>{state=startInspection();message=START_MESSAGE;selected=null;hint=false;started=performance.now();card.hidden=true;refresh();};
    scene.onPointerObservable.add(info=>{if(info.type!==PointerEventTypes.POINTERPICK)return;const id=info.pickInfo?.pickedMesh?.metadata?.epp as EppId|undefined;if(id)run(inspect(state,id),id);});
    refresh();
    scene.onAfterRenderObservable.addOnce(()=>{for(const texture of scene.textures)if(texture instanceof DynamicTexture)texture.update();});
    engine.runRenderLoop(()=>{view.tick(engine.getDeltaTime()/1000);scene.render();});
    const resize=()=>engine.resize();window.addEventListener('resize',resize);
    session={dispose:()=>{window.removeEventListener('resize',resize);engine.stopRenderLoop();scene.dispose();engine.dispose();session=null;}};
  },
  unmount(){session?.dispose();},
};
