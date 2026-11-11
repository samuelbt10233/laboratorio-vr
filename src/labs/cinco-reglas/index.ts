import { ArcRotateCamera, DynamicTexture, Engine, HemisphericLight, PointerEventTypes, Scene, Vector3 } from '@babylonjs/core';
import type { LabModule } from '../types';
import { enableXR } from '../industrial/xr';
import { attempt, nextStep, ruleSteps, startProcedure, type RuleAction, type RuleState } from './procedure';
import { saveResult } from './result';
import { buildPoleScene, type Target } from './scene';
import { createSound } from './sound';
import './cinco-reglas.css';
const START_MESSAGE='Seleccionar cada elemento en el orden del procedimiento. «Pista» muestra el paso siguiente.';
const clockText=(seconds:number)=>`${Math.floor(seconds/60)} min ${String(Math.round(seconds%60)).padStart(2,'0')} s`;
let session:{dispose:()=>void}|null=null;
/** Five golden rules on a pole-mounted transformer: its own canvas and engine inside the host, optional WebXR. */
export const lab:LabModule={
  mount({host,contentId}){
    session?.dispose();
    const canvas=document.createElement('canvas');canvas.id='cinco-reglas-canvas';canvas.setAttribute('aria-label','Práctica de las cinco reglas de oro en un poste con transformador, en 3D');canvas.tabIndex=0;
    const controls=document.createElement('div');controls.className='cinco-reglas-controls';
    const button=(label:string)=>{const b=document.createElement('button');b.textContent=label;controls.append(b);return b;};
    const vr=button('Entrar en VR'),hintButton=button('Pista'),resetButton=button('Reiniciar');
    const status=document.createElement('span');status.className='cinco-reglas-status';status.setAttribute('role','status');controls.append(status);
    const flash=document.createElement('div');flash.className='cinco-reglas-flash';
    const card=document.createElement('section');card.className='cinco-reglas-card';card.hidden=true;card.setAttribute('aria-live','polite');
    // On a projected screen the 3D board is too small to read: this panel mirrors it. The board stays for VR.
    const panel=document.createElement('aside');panel.className='cinco-reglas-panel';panel.setAttribute('aria-live','polite');
    host.append(canvas,controls,panel,flash,card);
    const drawPanel=()=>{
      const next=nextStep(state);panel.replaceChildren();panel.classList.toggle('arc',state.arc);
      const add=(tag:string,text:string,cls?:string,parent:HTMLElement=panel)=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;parent.append(e);return e;};
      add('p','Las cinco reglas de oro','cinco-reglas-kicker');
      const list=add('ol','');for(const step of ruleSteps){const li=add('li',step.title,state.done.includes(step.id)?'done':!state.arc&&next?.id===step.id?'current':'',list);li.dataset.step=step.id;}
      add('h3',state.arc?'⚡ Arco eléctrico':state.finished?'Práctica completa':next?.id==='epp'?'Antes de empezar':`Regla ${state.done.length}`);
      add('p',state.arc?message.replace('¡Arco eléctrico! ',''):state.finished?(summary??message):hint&&next?next.task:message,'cinco-reglas-message');
      add('p',`Errores: ${state.errors}`,'cinco-reglas-errors');
    };
    const engine=new Engine(canvas,true,{preserveDrawingBuffer:true,stencil:true}),scene=new Scene(engine);
    new HemisphericLight('sky',new Vector3(0,1,-.2),scene).intensity=.55;
    const camera=new ArcRotateCamera('street camera',-Math.PI/2,1.4,9.8,new Vector3(-1.5,4.7,5),scene);camera.fov=1.12;
    camera.lowerRadiusLimit=4;camera.upperRadiusLimit=14;camera.lowerBetaLimit=.75;camera.upperBetaLimit=1.55;camera.lowerAlphaLimit=-Math.PI/2-1;camera.upperAlphaLimit=-Math.PI/2+1;camera.minZ=.05;camera.maxZ=200;camera.attachControl(canvas,true);
    const view=buildPoleScene(scene),sound=createSound();
    let state:RuleState=startProcedure(),message=START_MESSAGE,hint=false,disposed=false,started=performance.now(),summary:string|null=null;
    const refresh=()=>{view.update(state,message,hint,summary);drawPanel();sound.setLive(!state.done.includes('abrir'));};
    const certificate=(seconds:number)=>{
      card.innerHTML='';
      const add=(tag:string,text:string,cls?:string)=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;card.append(e);return e;};
      add('p','Constancia de práctica · Datos de demostración','cinco-reglas-kicker');add('h2','Las cinco reglas de oro');add('p','Poste con transformador · Red de distribución');
      const list=document.createElement('dl');for(const [k,v] of [['Errores',String(state.errors)],['Tiempo',clockText(seconds)],['Fecha',new Date().toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'})]]){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;list.append(dt,dd);}card.append(list);
      add('p','Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA.','cinco-reglas-note');
      const close=add('button','Cerrar');close.onclick=()=>{card.hidden=true;};card.hidden=false;
    };
    const handle=(target:Target)=>{
      sound.start();
      if(target==='hint'){hint=!hint;message=hint?(nextStep(state)?.task??message):START_MESSAGE;refresh();return;}
      if(target==='reset'){state=startProcedure();message=START_MESSAGE;hint=false;summary=null;started=performance.now();card.hidden=true;refresh();return;}
      const result=attempt(state,target as RuleAction);state=result.state;message=result.message;
      if(result.arc){view.arc();sound.arc();flash.classList.remove('on');void flash.offsetWidth;flash.classList.add('on');}
      if(result.ok&&state.finished){
        const seconds=(performance.now()-started)/1000;summary=`${message} Tiempo: ${clockText(seconds)}.`;
        saveResult({contentId,aprobado:true,errores:state.errors,segundos:Math.round(seconds),fecha:new Date().toISOString()});certificate(seconds);
      }
      refresh();
    };
    scene.onPointerObservable.add(info=>{if(info.type!==PointerEventTypes.POINTERPICK)return;const target=info.pickInfo?.pickedMesh?.metadata?.rule as Target|undefined;if(target)handle(target);});
    hintButton.onclick=()=>handle('hint');resetButton.onclick=()=>handle('reset');
    refresh();
    // A new engine drops the first upload of dynamic textures: send them again once the first frame is out.
    scene.onAfterRenderObservable.addOnce(()=>{for(const texture of scene.textures)if(texture instanceof DynamicTexture)texture.update();});
    engine.runRenderLoop(()=>{view.tick(engine.getDeltaTime()/1000);scene.render();});
    const resize=()=>engine.resize();window.addEventListener('resize',resize);
    let disposeXR=()=>{};
    void enableXR(scene,view.floor,vr,status,()=>disposed).then(dispose=>{if(disposed)dispose();else disposeXR=dispose;});
    session={dispose:()=>{disposed=true;window.removeEventListener('resize',resize);disposeXR();sound.dispose();engine.stopRenderLoop();scene.dispose();engine.dispose();session=null;}};
  },
  unmount(){session?.dispose();},
};
