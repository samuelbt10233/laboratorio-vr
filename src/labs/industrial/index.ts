import { ArcRotateCamera, Color4, DynamicTexture, Engine, HemisphericLight, PointLight, PointerEventTypes, Scene, Vector3 } from '@babylonjs/core';
import type { LabModule } from '../types';
import { attempt, nextStep, startProcedure, type LotoAction, type LotoState } from './procedure';
import { buildIndustrialScene, type Target } from './scene';
import { enableXR } from './xr';
import './industrial.css';
const START_MESSAGE='Toca cada elemento de la máquina en el orden correcto. Usa «Pista» si no sabes por dónde seguir.';
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
    host.append(canvas,controls);
    const engine=new Engine(canvas,true,{preserveDrawingBuffer:true,stencil:true}),scene=new Scene(engine);
    scene.clearColor=new Color4(.06,.1,.12,1);
    new HemisphericLight('bay light',new Vector3(0,1,-.3),scene).intensity=.85;const lamp=new PointLight('bay lamp',new Vector3(0,3.6,2.5),scene);lamp.intensity=.5;
    const camera=new ArcRotateCamera('industrial camera',-Math.PI/2,1.4,5.9,new Vector3(0,1.8,3.2),scene);camera.fov=1;
    camera.lowerRadiusLimit=2.5;camera.upperRadiusLimit=8.2;camera.lowerBetaLimit=.9;camera.upperBetaLimit=1.6;camera.lowerAlphaLimit=-Math.PI/2-1;camera.upperAlphaLimit=-Math.PI/2+1;camera.minZ=.05;camera.attachControl(canvas,true);
    const view=buildIndustrialScene(scene);
    let state:LotoState=startProcedure(),message=START_MESSAGE,hint=false,disposed=false;
    const refresh=()=>view.update(state,message,hint);
    const handle=(target:Target)=>{
      if(target==='hint'){hint=!hint;message=hint?(nextStep(state)?.task??message):START_MESSAGE;refresh();return;}
      if(target==='reset'){state=startProcedure();message=START_MESSAGE;hint=false;refresh();return;}
      const result=attempt(state,target as LotoAction);state=result.state;message=result.message;refresh();
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
