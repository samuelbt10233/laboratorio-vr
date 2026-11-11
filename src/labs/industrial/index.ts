import { ArcRotateCamera, Color4, DynamicTexture, Engine, HemisphericLight, PointLight, PointerEventTypes, Scene, Vector3 } from '@babylonjs/core';
import type { LabModule } from '../types';
import { attempt, lotoSteps, nextStep, startProcedure, type LotoAction, type LotoState } from './procedure';
import { buildIndustrialScene, type Target } from './scene';
import { enableXR } from './xr';
import './industrial.css';
// The step panel and the certificate reuse the five-rules styles so both practices look the same on a projector.
import '../cinco-reglas/cinco-reglas.css';
const clockText=(seconds:number)=>`${Math.floor(seconds/60)} min ${String(Math.round(seconds%60)).padStart(2,'0')} s`;
const START_MESSAGE='Seleccionar cada elemento de la máquina en el orden del procedimiento. «Pista» muestra el paso siguiente.';
let session:{dispose:()=>void}|null=null;
/** Lockout/tagout practice on a conveyor: its own canvas and engine inside the host, optional WebXR. */
export const lab:LabModule={
  mount({host}){
    session?.dispose();
    const canvas=document.createElement('canvas');canvas.id='industrial-canvas';canvas.setAttribute('aria-label','Laboratorio de bloqueo y etiquetado en 3D');canvas.tabIndex=0;
    const controls=document.createElement('div');controls.className='industrial-controls';
    const button=(label:string)=>{const b=document.createElement('button');b.textContent=label;controls.append(b);return b;};
    const vr=button('Entrar en VR'),hintButton=button('Pista'),resetButton=button('Reiniciar');
    const status=document.createElement('span');status.className='industrial-status';status.setAttribute('role','status');controls.append(status);
    const card=document.createElement('section');card.className='cinco-reglas-card';card.hidden=true;card.setAttribute('aria-live','polite');
    const panel=document.createElement('aside');panel.className='cinco-reglas-panel';panel.setAttribute('aria-live','polite');
    host.append(canvas,controls,panel,card);
    const engine=new Engine(canvas,true,{preserveDrawingBuffer:true,stencil:true}),scene=new Scene(engine);
    scene.clearColor=new Color4(.06,.1,.12,1);
    new HemisphericLight('bay light',new Vector3(0,1,-.3),scene).intensity=.85;const lamp=new PointLight('bay lamp',new Vector3(0,3.6,2.5),scene);lamp.intensity=.5;
    // Framed slightly to the right so the step panel on the left does not cover the intercom.
    const camera=new ArcRotateCamera('industrial camera',-Math.PI/2,1.4,6.6,new Vector3(-.6,1.8,3.2),scene);camera.fov=1;
    camera.lowerRadiusLimit=2.5;camera.upperRadiusLimit=8.2;camera.lowerBetaLimit=.9;camera.upperBetaLimit=1.6;camera.lowerAlphaLimit=-Math.PI/2-1;camera.upperAlphaLimit=-Math.PI/2+1;camera.minZ=.05;camera.attachControl(canvas,true);
    const view=buildIndustrialScene(scene);
    let state:LotoState=startProcedure(),message=START_MESSAGE,hint=false,disposed=false,started=performance.now(),summary:string|null=null;
    const drawPanel=()=>{
      const next=nextStep(state);panel.replaceChildren();
      const add=(tag:string,text:string,cls?:string,parent:HTMLElement=panel)=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;parent.append(e);return e;};
      add('p','Bloqueo y etiquetado','cinco-reglas-kicker');
      const list=add('ol','');lotoSteps.forEach((step,i)=>add('li',`${i+1}. ${step.title}`,state.done.includes(step.id)?'done':next?.id===step.id?'current':'',list));
      add('h3',state.finished?'Práctica completa':next?`Paso ${state.done.length+1}: ${next.title}`:'');
      add('p',state.finished?(summary??message):hint&&next?next.task:message,'cinco-reglas-message');
      add('p',`Errores: ${state.errors}`,'cinco-reglas-errors');
    };
    const certificate=(seconds:number)=>{
      card.replaceChildren();
      const add=(tag:string,text:string,cls?:string)=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;card.append(e);return e;};
      add('p','Constancia de práctica · Datos de demostración','cinco-reglas-kicker');add('h2','Bloqueo y etiquetado');add('p','Cinta transportadora · Capacitación industrial');
      const list=document.createElement('dl');for(const [k,v] of [['Errores',String(state.errors)],['Tiempo',clockText(seconds)],['Fecha',new Date().toLocaleDateString('es-CO',{day:'numeric',month:'long',year:'numeric'})]]){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;list.append(dt,dd);}card.append(list);
      add('p','Práctica didáctica: no sustituye el procedimiento aprobado de la planta.','cinco-reglas-note');
      const close=add('button','Cerrar');close.onclick=()=>{card.hidden=true;};card.hidden=false;
    };
    const refresh=()=>{view.update(state,message,hint);drawPanel();};
    const handle=(target:Target)=>{
      if(target==='hint'){hint=!hint;message=hint?(nextStep(state)?.task??message):START_MESSAGE;refresh();return;}
      if(target==='reset'){state=startProcedure();message=START_MESSAGE;hint=false;summary=null;started=performance.now();card.hidden=true;refresh();return;}
      const result=attempt(state,target as LotoAction);state=result.state;message=result.message;
      // Shown only: the saved result belongs to the five-rules practice, which drives the assigned module and the supervisor panel.
      if(result.ok&&state.finished){const seconds=(performance.now()-started)/1000;summary=`${message} Tiempo: ${clockText(seconds)}.`;certificate(seconds);}
      refresh();
    };
    scene.onPointerObservable.add(info=>{if(info.type!==PointerEventTypes.POINTERPICK)return;const target=info.pickInfo?.pickedMesh?.metadata?.loto as Target|undefined;if(target)handle(target);});
    hintButton.onclick=()=>handle('hint');resetButton.onclick=()=>handle('reset');
    refresh();
    // A new engine drops the first upload of dynamic textures: send them again once the first frame is out.
    scene.onAfterRenderObservable.addOnce(()=>{for(const texture of scene.textures)if(texture instanceof DynamicTexture)texture.update();});
    engine.runRenderLoop(()=>{view.tick(engine.getDeltaTime()/1000);scene.render();});
    const resize=()=>engine.resize();window.addEventListener('resize',resize);
    let disposeXR=()=>{};
    void enableXR(scene,view.floor,vr,status,()=>disposed).then(dispose=>{if(disposed)dispose();else disposeXR=dispose;});
    session={dispose:()=>{disposed=true;window.removeEventListener('resize',resize);disposeXR();engine.stopRenderLoop();scene.dispose();engine.dispose();session=null;}};
  },
  unmount(){session?.dispose();},
};
