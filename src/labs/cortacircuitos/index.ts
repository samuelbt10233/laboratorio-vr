import { ArcRotateCamera, DynamicTexture, Engine, HemisphericLight, PointerEventTypes, Scene, Vector3 } from '@babylonjs/core';
import type { LabModule } from '../types';
import { createSound } from '../cinco-reglas/sound';
import { saveResult } from '../cinco-reglas/result';
import { attempt, nextStep, startManeuver, switchSteps, type SwitchAction, type SwitchState } from './procedure';
import { buildCutoutScene } from './scene';
import '../cinco-reglas/cinco-reglas.css';
const START_MESSAGE='Seleccionar cada elemento en el orden de la maniobra. «Pista» muestra el paso siguiente.';
const clockText=(seconds:number)=>`${Math.floor(seconds/60)} min ${String(Math.round(seconds%60)).padStart(2,'0')} s`;
let session:{dispose:()=>void}|null=null;
/** Cutout maneuver with a hot stick: its own canvas and engine inside the host; same panel and certificate as the five rules. */
export const lab:LabModule={
  mount({host,contentId}){
    session?.dispose();
    const canvas=document.createElement('canvas');canvas.id='cortacircuitos-canvas';canvas.setAttribute('aria-label','Práctica de maniobra de cortacircuitos con pértiga, en 3D');canvas.tabIndex=0;
    const controls=document.createElement('div');controls.className='cinco-reglas-controls';
    const button=(label:string)=>{const b=document.createElement('button');b.textContent=label;controls.append(b);return b;};
    const hintButton=button('Pista'),resetButton=button('Reiniciar');
    const flash=document.createElement('div');flash.className='cinco-reglas-flash';
    const card=document.createElement('section');card.className='cinco-reglas-card';card.hidden=true;card.setAttribute('aria-live','polite');
    const panel=document.createElement('aside');panel.className='cinco-reglas-panel';panel.setAttribute('aria-live','polite');
    host.append(canvas,controls,panel,flash,card);
    const drawPanel=()=>{
      const next=nextStep(state);panel.replaceChildren();
      const add=(tag:string,text:string,cls?:string,parent:HTMLElement=panel)=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;parent.append(e);return e;};
      add('p','Maniobra de cortacircuitos','cinco-reglas-kicker');
      const list=add('ol','');for(const step of switchSteps){const li=add('li',step.title,state.done.includes(step.id)?'done':next?.id===step.id?'current':'',list);li.dataset.step=step.id;}
      add('h3',state.finished?'Maniobra completa':next?.group??'');
      add('p',state.finished?(summary??message):hint&&next?next.task:message,'cinco-reglas-message');
      add('p',`Errores: ${state.errors}`,'cinco-reglas-errors');
    };
    const engine=new Engine(canvas,true,{preserveDrawingBuffer:true,stencil:true}),scene=new Scene(engine);
    new HemisphericLight('sky',new Vector3(0,1,-.2),scene).intensity=.55;
    const camera=new ArcRotateCamera('cutout camera',-Math.PI/2,1.32,10.6,new Vector3(-1.9,4.4,4.8),scene);camera.fov=1.05;
    camera.lowerRadiusLimit=4;camera.upperRadiusLimit=14;camera.lowerBetaLimit=.75;camera.upperBetaLimit=1.55;camera.lowerAlphaLimit=-Math.PI/2-1;camera.upperAlphaLimit=-Math.PI/2+1;camera.minZ=.05;camera.maxZ=200;camera.attachControl(canvas,true);
    const view=buildCutoutScene(scene),sound=createSound();
    let state:SwitchState=startManeuver(),message=START_MESSAGE,hint=false,started=performance.now(),summary:string|null=null;
    const refresh=()=>{view.update(state,hint);drawPanel();sound.setLive(true);};
    const certificate=(seconds:number)=>{
      card.innerHTML='';
      const add=(tag:string,text:string,cls?:string)=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;card.append(e);return e;};
      add('p','Constancia de práctica · Datos de demostración','cinco-reglas-kicker');add('h2','Maniobra de cortacircuitos');add('p','Apertura y cierre con pértiga · Red de distribución');
      const list=document.createElement('dl');for(const [k,v] of [['Errores',String(state.errors)],['Tiempo',clockText(seconds)],['Fecha',new Date().toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'})]]){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;list.append(dt,dd);}card.append(list);
      add('p','Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA.','cinco-reglas-note');
      const close=add('button','Cerrar');close.onclick=()=>{card.hidden=true;};card.hidden=false;
    };
    const handle=(target:SwitchAction|'hint'|'reset')=>{
      sound.start();
      if(target==='hint'){hint=!hint;message=hint?(nextStep(state)?.task??message):START_MESSAGE;refresh();return;}
      if(target==='reset'){state=startManeuver();message=START_MESSAGE;hint=false;summary=null;started=performance.now();card.hidden=true;refresh();return;}
      const result=attempt(state,target);state=result.state;message=result.message;
      if(result.spark){view.spark(Number(target.slice(-1)));sound.arc();flash.classList.remove('on');void flash.offsetWidth;flash.classList.add('on');}
      if(result.ok&&state.finished){
        const seconds=(performance.now()-started)/1000;summary=`${message} Tiempo: ${clockText(seconds)}.`;
        saveResult({contentId,aprobado:true,errores:state.errors,segundos:Math.round(seconds),fecha:new Date().toISOString()});certificate(seconds);
      }
      refresh();
    };
    scene.onPointerObservable.add(info=>{if(info.type!==PointerEventTypes.POINTERPICK)return;const target=info.pickInfo?.pickedMesh?.metadata?.cutout as SwitchAction|undefined;if(target)handle(target);});
    hintButton.onclick=()=>handle('hint');resetButton.onclick=()=>handle('reset');
    refresh();
    // A new engine drops the first upload of dynamic textures: send them again once the first frame is out.
    scene.onAfterRenderObservable.addOnce(()=>{for(const texture of scene.textures)if(texture instanceof DynamicTexture)texture.update();});
    engine.runRenderLoop(()=>{view.tick(engine.getDeltaTime()/1000);scene.render();});
    const resize=()=>engine.resize();window.addEventListener('resize',resize);
    session={dispose:()=>{window.removeEventListener('resize',resize);sound.dispose();engine.stopRenderLoop();scene.dispose();engine.dispose();session=null;}};
  },
  unmount(){session?.dispose();},
};
