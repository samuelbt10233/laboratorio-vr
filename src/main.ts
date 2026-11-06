import { platformArtwork } from './platform-art';
import { enterPresentation } from './start-presentation';
import { welcomeClassId } from './laboratories';
import { getSubject, subjectEntries, subjectForLaboratory, type SubjectEntry } from './subjects';
import { getLearningContent } from './learning-content';
import { subjectArtwork } from './subject-art';
import { routeWire } from './wire-routing';
import { LED_MODEL, ledState } from './led-solver';
import { Engine, Scene, Camera, ArcRotateCamera, Vector3, MeshBuilder, Color3, PointerEventTypes, PointerDragBehavior, Mesh, TransformNode } from '@babylonjs/core';
import { createLabArt } from './lab-art';
import { LabHost } from './labs/host';
import { labModules } from './labs/registry';
import './labs/labs.css';
import { preset, solve, validate, terminal, connect, type Circuit, type Part } from './circuit';
import './style.css';
import './atlas-theme.css';
import { Narrator, type NarrationState } from './narration';
import { classes, getClass } from './lessons';
import { createStepCircuit, diagnoseHint, recordAppAction, pendingGoal, SessionStore, classSessionKey } from './class-engine';
import { layout } from './template';
import { CircuitCharts } from './circuit-charts';
import { SpatialControls } from './spatial-controls';
import './spatial-layout.css';
import './subjects-theme.css';
import { moveWithinLab, movementKeys } from './navigation';
import { wireCurrents } from './wire-flow';
import { CurrentAnimation } from './current-animation';
import { SpatialGuide } from './spatial-guide';
import { StepConfirmation } from './step-confirmation';
import { QuestRuntime } from './quest-runtime';
import { movePartOnTable, questLayout } from './quest-layout';

const app=document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML=layout;
const $=<T extends HTMLElement=HTMLElement>(s:string)=>document.querySelector<T>(s)!;
let currentView:'menu'|'study'|'ready'|'lab'|'external'='menu';
let presentationReady=false,launchBusy=false,launchVersion=0;
let xrRuntime:QuestRuntime|null=null;
let preferredControlsVisible=true;
let circuit:Circuit=preset('simple'), selected='S1', pending:string|null=null, mode:'class'|'free'='class', step=0;
let activeClass=classes[0];
let completed=false;
let narrationState:NarrationState='ready';
let guideReady=false;
let narrationPurpose:'lesson'|'confirmation'='lesson';
let freeCompletion:{text:string;audio:string}|null=null;
const stepConfirmation=new StepConfirmation();
const canvas=$<HTMLCanvasElement>('#scene');
canvas.addEventListener('pointerdown',()=>canvas.focus({preventScroll:true}),{capture:true});
const engine=new Engine(canvas,true,{preserveDrawingBuffer:true,stencil:true});
const scene=new Scene(engine);
const labRoot=new TransformNode('laboratory coordinate space',scene);
const tableRoot=new TransformNode('inclined tabletop coordinate space',scene);tableRoot.parent=labRoot;tableRoot.rotation.x=-questLayout.tableTilt;
const navigationKeys=new Set<string>();
const camera=new ArcRotateCamera('camera',-Math.PI/2,0.95,19,new Vector3(0,1.2,.8),scene);camera.fov=.95;camera.fovMode=Camera.FOVMODE_HORIZONTAL_FIXED;camera.attachControl(canvas,false);camera.inputs.attached.pointers && ((camera.inputs.attached.pointers as any).buttons=[2]);camera.lowerRadiusLimit=7;camera.upperRadiusLimit=26;camera.upperBetaLimit=1.35;
const {material,label,decorate,partVisual,ledLenses,red,metal,teal,environment}=createLabArt(scene,tableRoot);
const circuitCharts=new CircuitCharts(scene,labRoot);
const currentAnimation=new CurrentAnimation(scene,tableRoot);
const spatialGuide=new SpatialGuide(scene,camera,id=>{
  const selectors:Record<string,string>={speak:'#speak-lesson',stop:'#stop-lesson',mute:'#mute-lesson',next:'#next',reset:'#reset-challenge'};
  if(id==='classes'){if(xrRuntime?.isImmersive())xrRuntime.openCatalogue();else openLaboratory(activeClass.laboratoryId??'electronics');return;}
  if(selectors[id])$(selectors[id]).click();
});
function syncSpatialGuide(){
  if(!$('#lesson-title').textContent)return;
  spatialGuide.update({canReset:mode==='class'&&!!activeClass.steps[step].setup,confirmation:mode==='class'&&guideReady&&activeClass.steps[step].goals.length?activeClass.steps[step].success.text:mode==='free'?freeCompletion?.text:undefined,title:$('#lesson-title').textContent??'',text:$('#lesson-text').textContent??'',task:$('#lesson-task').textContent??'',hint:mode==='class'?$('#guide-cue').textContent??'':'',tag:$('#guide-tag').textContent??'',progress:mode==='class'?(step+1)/activeClass.steps.length:1,classMode:mode==='class',lastStep:step===activeClass.steps.length-1,ready:guideReady,voice:narrationState,status:$('#voice-status').textContent??''});
}
const overview=()=>{if(xrRuntime?.isImmersive())return;navigationKeys.clear();camera.inertialPanningX=0;camera.inertialPanningY=0;camera.target=new Vector3(0,1.6,-1.2);camera.alpha=-Math.PI/2;camera.beta=1.05;camera.radius=22;};
function focusCharts(section?:'iv'|'voltage'){recordTutorialAction('charts');if(xrRuntime?.isImmersive()){xrRuntime.message('Las gráficas están detrás de la mesa. Apunta con el mando para seleccionar.');return;}circuitCharts.setVisible(true);$('#toggle-charts').setAttribute('aria-pressed','true');$('#toggle-charts').textContent='Ocultar gráficas';const target=circuitCharts.position.clone();if(section)target.x+=section==='iv'?-2.2:2.2;camera.target=target;camera.alpha=-Math.PI/2;camera.beta=1.35;camera.radius=section?7:12;}
$('#focus-charts').onclick=()=>focusCharts();
$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('.viewport').requestFullscreen();}catch{toast('No se pudo activar la pantalla completa en este navegador.');}};
document.addEventListener('fullscreenchange',()=>{$('#fullscreen').textContent=document.fullscreenElement?'Salir de pantalla completa':'Pantalla completa';});
$('#toggle-charts').onclick=()=>{const visible=!circuitCharts.isVisible();circuitCharts.setVisible(visible);$('#toggle-charts').setAttribute('aria-pressed',String(visible));$('#toggle-charts').textContent=visible?'Ocultar gráficas':'Mostrar gráficas';if(!visible)overview();};
const pendingMat=material('terminal seleccionado','#f3b75e',true);
let nodes:TransformNode[]=[],wireMeshes:Mesh[]=[];const terminalMeshes=new Map<string,Mesh>();
const selectionMaterial=material('selected component','#ff63d8',true);
selectionMaterial.disableLighting=true;selectionMaterial.emissiveColor=Color3.FromHexString('#ff63d8');
let selectionMarker:TransformNode|null=null;
function updateSelection(){
  const root=nodes.find(n=>n.name===selected);
  const part=circuit.parts.find(p=>p.id===selected);
  $('#selection-status').textContent=part?`Seleccionado: ${part.id}`:'Selecciona un componente';
  if(selectionMarker && !selectionMarker.isDisposed() && selectionMarker.parent===root)return;
  if(selectionMarker && !selectionMarker.isDisposed()){
    selectionMarker.getChildMeshes().forEach(m=>{if(m.material?.name==='text')m.material.dispose(false,true);});
    selectionMarker.dispose();
  }
  selectionMarker=null;if(!root||!part)return;
  selectionMarker=new TransformNode('selection marker',scene);selectionMarker.parent=root;
  const width=part.kind==='source'?2.04:1.94,depth=part.kind==='source'?1.66:1.36;
  const x=width/2,z=depth/2,y=.025;
  const path=[new Vector3(-x,y,-z),new Vector3(x,y,-z),new Vector3(x,y,z),new Vector3(-x,y,z),new Vector3(-x,y,-z)];
  decorate(MeshBuilder.CreateTube('selected component outline',{path,radius:.035,tessellation:8},scene),selectionMarker,selectionMaterial);
  // Four raised corners are visible in perspective as well as from above.
  for(const sx of [-1,1])for(const sz of [-1,1]){
    const corner=[new Vector3(sx*x,y,sz*z),new Vector3(sx*x,.17,sz*z)];
    decorate(MeshBuilder.CreateTube('selection corner',{path:corner,radius:.035,tessellation:8},scene),selectionMarker,selectionMaterial);
  }
  label(`${part.id} · SELECCIONADO`,selectionMarker,1.9,.24,.035,-z-.2,'#ffc3ef');
}
function rebuild(){ledLenses.forEach(m=>m.dispose());ledLenses.clear();pending=null;updateHint();nodes.forEach(n=>{n.getChildMeshes().forEach(m=>{if(m.material?.name==='text')m.material.dispose(false,true);});n.dispose();});nodes=[];terminalMeshes.clear();
for(const p of circuit.parts){const root=new TransformNode(p.id,scene);root.parent=tableRoot;root.position.set(p.x,0,p.z);nodes.push(root);const body=partVisual(root,p);
for(const side of [0,1]){const pin=MeshBuilder.CreateSphere('pin',{diameter:.38,segments:16},scene);pin.parent=root;pin.position.set(side===0?-.95:.95,.22,0);pin.material=p.kind==='source'&&side===0?red:metal;pin.metadata={terminal:terminal(p.id,side),part:p.id,baseMaterial:pin.material};terminalMeshes.set(terminal(p.id,side),pin);}
const drag=new PointerDragBehavior({dragPlaneNormal:new Vector3(0,1,0)});drag.moveAttached=false;body.addBehavior(drag);drag.onDragStartObservable.add(()=>{if(selected!==p.id){selected=p.id;update();}});drag.onDragObservable.add(e=>{tableRoot.computeWorldMatrix(true);const localDelta=Vector3.TransformNormal(e.delta,tableRoot.getWorldMatrix().clone().invert());const moved=movePartOnTable(root.position.x,root.position.z,localDelta.x,localDelta.z);root.position.x=moved.x;root.position.z=moved.z;p.x=root.position.x;p.z=root.position.z;drawWires();if(e.delta.lengthSquared()>0)recordTutorialAction('move');});}
drawWires();update();}
function drawWires(){
  const paths=new Map<string,Vector3[]>();wireMeshes.forEach(m=>m.dispose());wireMeshes=[];
  circuit.wires.forEach((wire,index)=>{const path=routeWire(circuit,wire,index).map(p=>new Vector3(p.x,p.y,p.z));if(path.length<2)return;
    const mesh=MeshBuilder.CreateTube('cable',{path,radius:.045,tessellation:10,cap:Mesh.CAP_ALL},scene);mesh.parent=tableRoot;mesh.material=teal;mesh.isPickable=false;wireMeshes.push(mesh);paths.set(wire.id,path);
  });currentAnimation.setPaths(paths);
}
function terminalName(id:string){const [part,side]=id.split(':');const kind=circuit.parts.find(p=>p.id===part)?.kind;const source=kind==='source';return `${part} · ${source?(side==='0'?'+':'−'):kind==='led'?(side==='0'?'A +':'K −'):(side==='0'?'A':'B')}`;}
function connectTerminals(a:string,b:string){
  const next=connect(circuit,a,b);
  if(typeof next==='string'){toast(next);return false;}
  circuit=next;pending=null;recordTutorialAction('connect',{a,b});drawWires();updateHint();update();toast(`Conectado: ${terminalName(a)} ↔ ${terminalName(b)}`);return true;
}
function pickTerminal(id:string){if(!pending){pending=id;updateHint();return;}if(pending===id){pending=null;updateHint();return;}connectTerminals(pending,id);}
const spatialControls=new SpatialControls(scene,camera,id=>{
  if(id.startsWith('move:')){const part=circuit.parts.find(p=>p.id===selected);if(part){const moved=movePartOnTable(part.x,part.z,id==='move:left'?-.4:id==='move:right'?.4:0,id==='move:away'?.4:id==='move:near'?-.4:0);const changed=part.x!==moved.x||part.z!==moved.z;Object.assign(part,moved);rebuild();if(changed)recordTutorialAction('move');}return;}
  if(id.startsWith('part:')){selected=id.slice(5);update();return;}
  if(id.startsWith('pin:')){pickTerminal(id.slice(4));return;}
  if(id.startsWith('wire:')){const removed=circuit.wires.find(w=>w.id===id.slice(5));circuit.wires=circuit.wires.filter(w=>w.id!==id.slice(5));recordTutorialAction('disconnect',removed);drawWires();update();return;}
  if(id==='increase'||id==='decrease'){
    const part=circuit.parts.find(p=>p.id===selected);const input=document.querySelector<HTMLInputElement>('#inspector input');
    if(part&&input){input.value=String(Math.max(Number(input.min),Math.min(Number(input.max),part.value+(id==='increase'?1:-1)*(part.kind==='source'?1:10))));$('#inspector .apply-value').click();}return;
  }
  const selectors:Record<string,string>={'add-l':'#add-l','add-r':'#add-r','add-s':'#add-s',save:'#save',load:'#load',empty:'#empty',switch:'#inspector .switch-button',apply:'#inspector .apply-value',remove:'#inspector .text-button','cancel-wire':'#cancel-wire'};
  const selector=id.startsWith('preset:')?`[data-preset="${id.slice(7)}"]`:selectors[id];
  if(selector)document.querySelector<HTMLElement>(selector)?.click();
},value=>{const input=document.querySelector<HTMLInputElement>('#inspector input');if(input){input.value=value;refreshGuidance();}});
function resizeSpatialControls(){spatialControls.resize(canvas.clientWidth,canvas.clientHeight);spatialGuide.resize(canvas.clientWidth,canvas.clientHeight,camera);}
$('#toggle-controls').onclick=()=>{const visible=!spatialControls.isVisible();preferredControlsVisible=visible;spatialControls.setVisible(visible);$('#toggle-controls').textContent=visible?'Ocultar paneles':'Mostrar paneles';$('#toggle-controls').setAttribute('aria-pressed',String(visible));};
canvas.addEventListener('keydown',event=>{
  if(spatialControls.key(event.key)){event.preventDefault();event.stopPropagation();return;}
  const key=event.key.toLowerCase();
  if(currentView==='lab'&&!xrRuntime?.isImmersive()&&!spatialControls.isEditing()&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&movementKeys.has(key)){
    event.preventDefault();navigationKeys.add(key);
  }
});
window.addEventListener('keyup',event=>navigationKeys.delete(event.key.toLowerCase()));
canvas.addEventListener('blur',()=>navigationKeys.clear());
window.addEventListener('blur',()=>navigationKeys.clear());
document.addEventListener('visibilitychange',()=>navigationKeys.clear());
scene.onPointerObservable.add(info=>{
  if(info.type===PointerEventTypes.POINTERMOVE){
    if(info.pickInfo?.pickedMesh?.metadata?.questInterface){canvas.style.cursor='pointer';return;}
    if(info.pickInfo?.pickedMesh?.metadata?.guidePanel){const uv=info.pickInfo.getTextureCoordinates();if(uv)canvas.style.cursor=spatialGuide.hover(uv.x,uv.y)?'pointer':'default';spatialControls.clearHover();return;}
    spatialGuide.clearHover();
    const panel=info.pickInfo?.pickedMesh?.metadata?.spatialPanel,uv=info.pickInfo?.getTextureCoordinates();
    if(panel!==undefined&&uv){canvas.style.cursor=spatialControls.hover(panel,uv.x,uv.y)?'pointer':'default';return;}
    spatialControls.clearHover();canvas.style.cursor=info.pickInfo?.pickedMesh?.metadata?.chartPanel?'zoom-in':info.pickInfo?.pickedMesh?.metadata?.terminal?'crosshair':info.pickInfo?.pickedMesh?.metadata?.part?'grab':'default';return;}
  // Count the second tap on a panel as another key press, including repeated digits.
  if(![PointerEventTypes.POINTERPICK,PointerEventTypes.POINTERDOUBLETAP].includes(info.type) || (!xrRuntime?.isXR()&&(info.event as PointerEvent).button!==0))return;
  const data=info.pickInfo?.pickedMesh?.metadata;if(!data)return;
  if(data.questInterface){const uv=info.pickInfo?.getTextureCoordinates();if(uv)xrRuntime?.pick(data.questInterface,uv.x,uv.y);return;}
  if(data.guidePanel){const uv=info.pickInfo?.getTextureCoordinates();if(uv)spatialGuide.pick(uv.x,uv.y);return;}
  if(data.spatialPanel!==undefined){const uv=info.pickInfo?.getTextureCoordinates();if(uv)spatialControls.pick(data.spatialPanel,uv.x,uv.y);return;}
  if(info.type===PointerEventTypes.POINTERDOUBLETAP)return;
  if(data.chartPanel){const uv=info.pickInfo?.getTextureCoordinates();focusCharts(data.chartScreen&&uv?(uv.x<.5?'iv':'voltage'):undefined);return;}
  if(data.terminal)pickTerminal(data.terminal);
  else if(data.part){selected=data.part;update();}
});
function updateHint(){
  $('#connection-hint').textContent=pending?`Desde ${terminalName(pending)} · selecciona otro terminal`:'Conectar: pulsa dos terminales';$('#cancel-wire').hidden=!pending;
  spatialControls.update(circuit,solve(circuit),selected,pending);
  for(const [id,pin] of terminalMeshes){pin.material=id===pending?pendingMat:pin.metadata.baseMaterial;pin.scaling.setAll(id===pending?1.35:1);}
}
let toastTimer=0;
function toast(message:string){if(xrRuntime?.isImmersive())xrRuntime.message(message);window.clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('visible');toastTimer=window.setTimeout(()=>$('#toast').classList.remove('visible'),3500);}
function update(){if(mode==='free')freeCompletion=null;updateSelection();const result=solve(circuit),source=circuit.parts.find(p=>p.kind==='source')!;
for(const [id,mat] of ledLenses){const current=result.readings[id]?.current??0;const brightness=Math.min(1,Math.max(0,current/LED_MODEL.maxCurrent));mat.diffuseColor=current>LED_MODEL.maxCurrent?Color3.FromHexString('#ff9a23'):Color3.Lerp(Color3.FromHexString('#662825'),Color3.FromHexString('#ff392e'),Math.sqrt(brightness));mat.emissiveColor=Color3.FromHexString(current>LED_MODEL.maxCurrent?'#ff9a23':'#ff3020').scale(brightness*.9);}
xrRuntime?.setSummary(`${source.value} V · ${(result.current*1000).toFixed(1)} mA · ${result.status==='ok'?'Circuito cerrado':result.status==='open'?'Circuito abierto':'Cortocircuito'}`);currentAnimation.setCurrents(wireCurrents(circuit,result));circuitCharts.update(circuit,result);$('#charts-summary').textContent=result.status==='short'?'Gráficas sin lectura: cortocircuito de la fuente ideal.':`Gráficas del circuito: tensión de fuente ${source.value} V, corriente total ${(result.current*1000).toFixed(1)} mA. `+circuit.parts.filter(p=>p.kind==='resistor'||p.kind==='led').map(p=>`${p.id}: ${Math.abs(result.readings[p.id]?.voltage??0).toFixed(2)} V`).join('; ');
$('#current').textContent=result.status==='short'?'—':(result.current*1000).toFixed(1);$('#voltage').textContent=`${source.value.toFixed(1)} V`;$('#resistance').textContent=result.status==='short'?'0 Ω':Number.isFinite(result.resistance)?`${result.resistance.toFixed(1)} Ω`:'∞ Ω';$('#status').textContent=result.status==='ok'?'● Circuito cerrado · corriente estable':result.status==='open'?'○ Circuito abierto · sin corriente':'⚠ Cortocircuito · medición bloqueada';$('#status').className=`status ${result.status}`;if(circuit.parts.some(p=>p.kind==='led'&&(result.readings[p.id]?.current??0)>LED_MODEL.maxCurrent)){$('#status').textContent='⚠ LED con sobrecorriente · aumenta la resistencia';xrRuntime?.setSummary(`${source.value} V · ${(result.current*1000).toFixed(1)} mA · LED con sobrecorriente`);}
const p=circuit.parts.find(p=>p.id===selected);const inspector=$('#inspector');inspector.replaceChildren();if(p){const title=document.createElement('h3');title.textContent=`${p.id} · ${p.kind==='source'?'Fuente':p.kind==='resistor'?'Resistencia':p.kind==='led'?'LED rojo':'Interruptor'}`;inspector.append(title);const pins=document.createElement('div');pins.className='inspector-terminals';for(const side of [0,1]){const id=terminal(p.id,side);const button=document.createElement('button');button.textContent=`◉ ${terminalName(id)}`;button.setAttribute('aria-label',`Seleccionar terminal ${terminalName(id)}`);button.onclick=()=>pickTerminal(id);pins.append(button);}inspector.append(pins);
if(p.kind==='source'||p.kind==='resistor'){const lab=document.createElement('label');lab.textContent=p.kind==='source'?'Tensión (V)':'Resistencia (Ω)';const input=document.createElement('input');input.type='number';input.min=p.kind==='source'?'1':'10';input.max=p.kind==='source'?'12':'1000';input.step=p.kind==='source'?'1':'10';input.value=String(p.value);input.setAttribute('aria-label',lab.textContent);const applyValue=()=>{const v=Number(input.value);if(!Number.isFinite(v)||v<Number(input.min)||v>Number(input.max)){toast(`Usa un valor entre ${input.min} y ${input.max}.`);input.value=String(p.value);return;}p.value=v;rebuild();};input.onkeydown=e=>{if(e.key==='Enter')applyValue();};input.oninput=()=>refreshGuidance();lab.append(input);inspector.append(lab);const apply=document.createElement('button');apply.textContent='Aplicar valor';apply.className='apply-value';apply.onclick=applyValue;inspector.append(apply);}
else if(p.kind==='switch'){const button=document.createElement('button');button.className='switch-button';button.textContent=p.closed?'● Cerrado · pulsar para abrir':'○ Abierto · pulsar para cerrar';button.onclick=()=>{p.closed=!p.closed;rebuild();};inspector.append(button);}
if(p.kind==='led'){const info=document.createElement('p');info.textContent=`${ledState(result.readings[p.id]?.current??0)} · A + → K − · Límite del modelo: 20 mA`;inspector.append(info);}
const reading=result.readings[p.id];if(reading){const text=document.createElement('p');text.className='reading';text.textContent=`${Math.abs(reading.voltage).toFixed(2)} V · ${(Math.abs(reading.current)*1000).toFixed(1)} mA · ${reading.power.toFixed(3)} W`;inspector.append(text);}if(p.kind!=='source'){const remove=document.createElement('button');remove.className='text-button';remove.textContent='Eliminar componente';remove.onclick=()=>{circuit.parts=circuit.parts.filter(x=>x.id!==p.id);circuit.wires=circuit.wires.filter(w=>!w.a.startsWith(`${p.id}:`)&&!w.b.startsWith(`${p.id}:`));selected='V1';rebuild();};inspector.append(remove);}}
else inspector.textContent='Selecciona un componente en la mesa.';
$('#wire-count').textContent=`(${circuit.wires.length})`;const list=$('#wire-list');list.replaceChildren();for(const w of circuit.wires){const row=document.createElement('div');row.className='wire-row';const text=document.createElement('span');text.textContent=`${terminalName(w.a)} ↔ ${terminalName(w.b)}`;const button=document.createElement('button');button.textContent='×';button.setAttribute('aria-label',`Eliminar cable ${w.a} a ${w.b}`);button.onclick=()=>{circuit.wires=circuit.wires.filter(x=>x.id!==w.id);recordTutorialAction('disconnect',w);drawWires();update();};row.append(text,button);list.append(row);}updateConnectionOptions();renderLesson();}
function updateConnectionOptions(){
  for(const selector of ['#wire-from','#wire-to']){const select=$<HTMLSelectElement>(selector);const previous=select.value;select.replaceChildren();const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='Selecciona un terminal';select.append(placeholder);for(const p of circuit.parts)for(const side of [0,1]){const option=document.createElement('option');option.value=terminal(p.id,side);option.textContent=terminalName(option.value);select.append(option);}if(Array.from(select.options).some(o=>o.value===previous))select.value=previous;}
}
$('#connect-terminals').onclick=()=>{const a=$<HTMLSelectElement>('#wire-from').value,b=$<HTMLSelectElement>('#wire-to').value;if(!a||!b){toast('Selecciona los dos terminales que quieres unir.');return;}connectTerminals(a,b);};
$('#top-view').onclick=()=>{camera.target=Vector3.Zero();camera.alpha=-Math.PI/2;camera.beta=.01;camera.radius=16;};
// Lesson cues highlight only the action that is relevant to the current state.
const cueMaterial=material('lesson cue','#edc76d',true);cueMaterial.disableLighting=true;cueMaterial.emissiveColor=Color3.FromHexString('#edc76d');
let cueMeshes:Mesh[]=[];
let cueStep=-1;
const inspectedParts=new Set<string>();
function clearGuidance(){
  guideReady=false;
  spatialControls.highlight('');
  document.querySelectorAll<HTMLElement>('.guide-target').forEach(el=>{el.classList.remove('guide-target');delete el.dataset.guideLabel;el.removeAttribute('aria-describedby');if(el.dataset.guideAddedLabel){el.removeAttribute('aria-label');delete el.dataset.guideAddedLabel;}});
  cueMeshes.forEach(m=>{if(!m.isDisposed())m.dispose();});cueMeshes=[];
  $('#guide-cue').hidden=true;
}
function cueElement(selector:string,text:string){
  const ids:Record<string,string>={'#inspector .switch-button':'switch','#inspector label':'value','#inspector .apply-value':'apply'};
  const presetName=selector.match(/data-preset="([a-z]+)"/u)?.[1];
  if(ids[selector]||presetName)spatialControls.highlight(ids[selector]??`preset:${presetName}`);
  const el=document.querySelector<HTMLElement>(selector);if(!el)return;if(el.tagName==='BUTTON'&&!el.hasAttribute('aria-label')){el.setAttribute('aria-label',el.textContent?.trim()??'');el.dataset.guideAddedLabel='true';}el.classList.add('guide-target');el.dataset.guideLabel=text;el.setAttribute('aria-describedby','guide-cue');}
function cuePart(id:string){
  const root=nodes.find(n=>n.name===id);if(!root)return;
  const ring=decorate(MeshBuilder.CreateTorus('lesson target ring',{diameter:2.35,thickness:.055,tessellation:40},scene),root,cueMaterial);ring.position.y=.025;
  const arrow=decorate(MeshBuilder.CreateCylinder('lesson target arrow',{diameterTop:0,diameterBottom:.22,height:.32,tessellation:12},scene),root,cueMaterial);arrow.rotation.z=Math.PI;arrow.position.set(0,1.08,0);
  cueMeshes.push(ring,arrow);
}
function recordTutorialAction(action:import('./class-engine').AppAction,wire?:{a:string;b:string}){
  if(mode!=='class'||currentView!=='lab')return;
  if(recordAppAction(activeClass.steps[step],{circuit,selected,seen:inspectedParts},action,wire))refreshGuidance();
}
function refreshGuidance(){
  clearGuidance();if(mode!=='class'){cueStep=-1;inspectedParts.clear();spatialControls.update(circuit,solve(circuit),selected,pending);syncSpatialGuide();return;}
  if(cueStep!==step){inspectedParts.clear();cueStep=step;}
  const goal=pendingGoal(activeClass.steps[step],{circuit,selected,seen:inspectedParts});
  guideReady=!goal;
  const lesson=activeClass.steps[step];
  const celebrate=stepConfirmation.observe(`${activeClass.id}:${lesson.id}`,guideReady,lesson.goals.length>0);
  if(goal&&narrationPurpose==='confirmation'){narrationPurpose='lesson';narrator.stop();}
  let hint='';
  if(!goal){hint=lesson.goals.length===0?(lesson.hint??lesson.task):step===activeClass.steps.length-1?'Has terminado. Pulsa «Finalizar y explorar» para hacer tus propias pruebas.':'Lo has conseguido. Pulsa «Comprobar y continuar» para seguir.';cueElement('#next','Continuar');}
  else if(goal.kind==='diagnose'){
    hint=diagnoseHint(goal,circuit);
  }else if(goal.kind==='action'){
    hint=goal.hint;if(goal.target)spatialControls.highlight(goal.target);
    if(goal.action==='move')cuePart(selected);
    if(goal.action==='charts')cueElement('#focus-charts','Consultar monitor');
    if(goal.action==='save')cueElement('#save','Guardar montaje');
  }else if(goal.kind==='repair'){
    if(lesson.setup){hint='Pulsa «Ver pistas» y «Reiniciar este reto» para recuperar el montaje de este paso.';}else{
    hint=`Pulsa «${goal.preset==='simple'?'Simple':goal.preset==='series'?'Serie':'Paralelo'}» en el panel izquierdo para volver al circuito de este paso.`;
    cueElement(`[data-preset="${goal.preset}"]`,'Retomar montaje');}
  }else{
    cuePart(goal.part);spatialControls.highlight(`part:${goal.part}`);
    hint=`Selecciona ${goal.part} en la lista y mira los valores que aparecen en «Propiedades».`;
    if(goal.kind==='closed'&&selected===goal.part){hint=`Pulsa el botón resaltado «Abierto · cerrar» para cerrar el camino.`;cueElement('#inspector .switch-button','Cerrar interruptor');}
    if(goal.kind==='value'){
      hint=`Selecciona ${goal.part} en la lista para cambiar su valor a ${goal.value} ${goal.unit}.`;
      if(selected===goal.part){const input=document.querySelector<HTMLInputElement>('#inspector input');
        if(input&&Number(input.value)===goal.value){hint=`Pulsa Aplicar valor para confirmar ${goal.value} ${goal.unit}.`;cueElement('#inspector .apply-value','Confirma el valor');}
        else{hint=`Pulsa el valor resaltado, escribe ${goal.value} y confirma con «Aplicar».`;cueElement('#inspector label',`Escribe ${goal.value} ${goal.unit}`);}
      }
    }
  }
  if(guideReady&&lesson.goals.length)hint=lesson.success.text;
  $('#next').textContent=step===activeClass.steps.length-1?'Finalizar y explorar →':guideReady?'Continuar →':'Comprobar y continuar →';
  $('#step-confirmation').textContent=guideReady&&lesson.goals.length?`Paso completado. ${lesson.success.text}`:'';
  spatialControls.update(circuit,solve(circuit),selected,pending);
  const cue=$('#guide-cue');cue.textContent=`${step+1}. ${hint}`;cue.hidden=false;syncSpatialGuide();
  if(celebrate&&currentView==='lab')narrateConfirmation(lesson.success);
}
let lastNarratedStep=-1;
const narrator=new Narrator(state=>{
  narrationState=state;
  const speaking=state==='speaking';
  $('.guide-avatar').classList.toggle('is-speaking',speaking);
  $('#dialogue').classList.toggle('is-speaking',speaking);
  $('#stop-lesson').hidden=!['loading','speaking'].includes(state);
  const statuses:Record<NarrationState,string>={ready:'Pulsa Escuchar para oír a tu guía.',loading:'Preparando la voz…',speaking:'Tu guía está hablando…',finished:'Tu turno: realiza la actividad.',muted:'Voz silenciada. Puedes seguir leyendo.',unavailable:'No se pudo cargar la narración. Puedes seguir leyendo.',error:'No se pudo reproducir la voz. Pulsa Escuchar para reintentar.'};
  $('#voice-status').textContent=statuses[state];
  $<HTMLButtonElement>('#speak-lesson').disabled=state==='muted';
  $('#speak-lesson').textContent=state==='finished'?'↻ Repetir':'▶ Escuchar';syncSpatialGuide();
});
function narrateLesson(){if(currentView!=='lab'||mode!=='class')return;narrationPurpose='lesson';const l=activeClass.steps[step];narrator.speak(`${l.title} ${l.text} ${l.task}`,l.audio);}
function narrateConfirmation(success:{text:string;audio:string}){if(currentView!=='lab')return;narrationPurpose='confirmation';narrator.speak(success.text,success.audio);}
function narrateCurrentGuide(){if(mode==='free'&&freeCompletion)narrateConfirmation(freeCompletion);else if(mode==='class'&&guideReady&&activeClass.steps[step].goals.length)narrateConfirmation(activeClass.steps[step].success);else narrateLesson();}
$('#speak-lesson').onclick=()=>narrateCurrentGuide();
$('#stop-lesson').onclick=()=>narrator.stop();
$('#mute-lesson').onclick=()=>{const enabled=!narrator.isEnabled();narrator.setEnabled(enabled);$('#mute-lesson').setAttribute('aria-pressed',String(!enabled));$('#mute-lesson').textContent=enabled?'Silenciar':'Activar voz';if(enabled)narrateCurrentGuide();};
window.addEventListener('pagehide',()=>narrator.stop());
if(import.meta.hot)import.meta.hot.dispose(()=>narrator.dispose());

function renderLesson(){const lesson=activeClass.steps[step];$('#class-mode').classList.toggle('active',mode==='class');$('#free-mode').classList.toggle('active',mode==='free');$('#class-mode').setAttribute('aria-pressed',String(mode==='class'));$('#free-mode').setAttribute('aria-pressed',String(mode==='free'));$('#guide-tag').textContent=mode==='class'?`CLASE GUIADA · ${step+1} / ${activeClass.steps.length}`:'EXPLORACIÓN LIBRE';$('#lesson-title').textContent=mode==='class'?lesson.title:'Prueba una idea tuya.';$('#lesson-text').textContent=mode==='class'?lesson.text:'Empieza con «Simple» si es tu primera vez. Cierra el interruptor para que circule corriente. Después cambia el valor de una resistencia y observa qué ocurre.';$('#lesson-task').textContent=mode==='class'?lesson.task:'Para crear un cable, pulsa un punto de conexión y después otro. Puedes añadir elementos desde el panel izquierdo y quitar cables en la pestaña «Cables».';$('#progress').style.width=mode==='class'?`${(step+1)/activeClass.steps.length*100}%`:'100%';const next=$<HTMLButtonElement>('#next');next.hidden=mode==='free';next.textContent=step===activeClass.steps.length-1?'Finalizar y explorar →':'Comprobar y continuar →';$('#narration-controls').hidden=mode==='free';$('#reset-challenge').hidden=mode!=='class'||!lesson.setup;$('.guide').classList.toggle('free-guide',mode==='free');if(mode==='free'){narrator.stop();lastNarratedStep=-1;}else if(lastNarratedStep!==step){const shouldSpeak=lastNarratedStep!==-1;lastNarratedStep=step;if(shouldSpeak)narrateLesson();}refreshGuidance();}
$('#next').onclick=()=>{
  const goal=pendingGoal(activeClass.steps[step],{circuit,selected,seen:inspectedParts});
  if(goal){toast('Completa la indicación resaltada antes de continuar.');refreshGuidance();return;}
  if(step===activeClass.steps.length-1){const success=activeClass.steps[step].success,announce=activeClass.steps[step].goals.length===0;completed=true;saveSession();openLab('free',activeClass.id,true);freeCompletion=success;$('#step-confirmation').textContent=success.text;syncSpatialGuide();if(announce)narrateConfirmation(success);}
  else{step++;inspectedParts.clear();if(activeClass.steps[step].setup){circuit=createStepCircuit(activeClass,step);selected=activeClass.initialSelection;rebuild();}else renderLesson();}
};
$('#reset-challenge').onclick=()=>{if(mode!=='class'||!activeClass.steps[step].setup)return;narrator.stop();narrationPurpose='lesson';stepConfirmation.enter();inspectedParts.clear();circuit=createStepCircuit(activeClass,step);selected=activeClass.initialSelection;rebuild();narrateLesson();};
$('#class-mode').onclick=()=>{if(xrRuntime?.isImmersive())xrRuntime.openCatalogue();else openLaboratory(activeClass.laboratoryId??'electronics');};
$('#free-mode').onclick=()=>{saveSession();openLab('free');};
document.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach(b=>b.onclick=()=>{circuit=preset(b.dataset.preset as 'simple'|'series'|'parallel');selected='R1';rebuild();});
function nextPosition(){for(const z of [-1.6,0,1.6])for(const x of [-3.2,0,3.2])if(!circuit.parts.some(p=>Math.abs(p.x-x)<2.2&&Math.abs(p.z-z)<1.1))return {x,z};return {x:0,z:0};}
function add(kind:'resistor'|'switch'|'led'){if(circuit.parts.length>=8 || (kind==='resistor'||kind==='led')&&circuit.parts.filter(p=>p.kind===kind).length>=4){toast('La demo admite hasta 4 resistencias, 4 LED y 8 componentes en total.');return;}let i=1;const prefix=kind==='resistor'?'R':kind==='led'?'L':'S';while(circuit.parts.some(p=>p.id===`${prefix}${i}`))i++;const id=`${prefix}${i}`;circuit.parts.push({id,kind,value:kind==='resistor'?100:kind==='led'?2:0,...(kind==='switch'?{closed:false}:{}),...nextPosition()});selected=id;rebuild();}
$('#add-l').onclick=()=>add('led');$('#add-r').onclick=()=>add('resistor');$('#add-s').onclick=()=>add('switch');$('#cancel-wire').onclick=()=>{pending=null;updateHint();};window.addEventListener('keydown',e=>{if(e.key==='Escape'){pending=null;updateHint();}});
$('#camera').onclick=overview;$('#empty').onclick=()=>{circuit=preset('empty');selected='V1';rebuild();};
$('#save').onclick=()=>{try{localStorage.setItem('umbral-circuit-v1',JSON.stringify(circuit));recordTutorialAction('save');toast('Montaje guardado en este navegador.');}catch{toast('No se pudo guardar en este navegador.');}};
$('#load').onclick=()=>{try{const raw=localStorage.getItem('umbral-circuit-v1');if(!raw){toast('Todavía no hay un montaje guardado.');return;}const loaded=JSON.parse(raw);if(!validate(loaded))throw Error();circuit=loaded;selected='V1';rebuild();toast('Montaje recuperado.');}catch{toast('El montaje guardado no es válido.');}};
const sessions=new SessionStore();
function sessionKey(){return mode==='class'?classSessionKey(activeClass.id):'free';}
function saveSession(){if(currentView==='lab')sessions.save(sessionKey(),{circuit,selected,step,seen:[...inspectedParts],completed});}
type CatalogueFilter='all'|'recent';
let catalogueFilter:CatalogueFilter='all';
let entryFilter:'all'|'class'|'free'='all';
let catalogueSubject:string|null=null;
const normalise=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function entryVisited(entry:SubjectEntry):boolean{
  if(entry.kind==='subject')return subjectEntries(entry.subjectId).some(entryVisited);
  return !entry.planned&&sessions.has(entry.classId?classSessionKey(entry.classId):'free');
}
function renderCatalogue(){
  const query=normalise($<HTMLInputElement>('#experience-search').value.trim());
  const subject=catalogueSubject?getSubject(catalogueSubject):null;
  const entries=subjectEntries(catalogueSubject).filter(entry=>(!subject||entryFilter==='all'||entry.kind===entryFilter)&&(catalogueFilter!=='recent'||entryVisited(entry))&&(!query||normalise(`${entry.title} ${entry.description} ${entry.meta.join(' ')}`).includes(query)));
  const list=$('.experience-list');list.replaceChildren();
  list.classList.toggle('subject-grid',!subject);
  $('#class-filters').hidden=!subject;
  document.querySelectorAll<HTMLButtonElement>('[data-entry-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.entryFilter===entryFilter)));
  for(const entry of entries){
    const item=document.createElement('li'),button=document.createElement('button');
    button.className=`experience-row experience-${entry.kind}`;button.dataset.catalogueEntry=entry.id;
    button.innerHTML='<span class="experience-icon" aria-hidden="true"></span><span class="experience-copy"><span class="experience-type"></span><strong></strong><span class="experience-description"></span><span class="experience-meta"></span></span><span class="experience-action"><span></span><span aria-hidden="true">↗</span></span>';
    button.querySelector('.experience-icon')!.innerHTML=(entry.kind==='subject'||entry.planned?subjectArtwork[entry.subjectId]:undefined)??platformArtwork(`card-${entry.id.replace(/[^a-z0-9]/gi,'-')}`);
    button.querySelector('.experience-type')!.textContent=entry.planned?'EN PREPARACIÓN':entry.kind==='subject'?'MATERIA':entry.kind==='free'?'EXPLORACIÓN LIBRE':'CLASE CON LABORATORIO';
    button.querySelector('strong')!.textContent=entry.title;
    button.querySelector('.experience-description')!.textContent=entry.description;
    const meta=button.querySelector('.experience-meta')!;
    for(const text of entry.meta){const span=document.createElement('span');span.textContent=text;meta.append(span);}
    button.querySelector('.experience-action span')!.textContent=entry.kind==='subject'?'Explorar materia':entry.kind==='free'?'Entrar al modo libre':entry.planned?'Ver contenido propuesto':'Comenzar por el contenido';
    button.onclick=()=>{if(entry.kind==='subject')openSubject(entry.subjectId);else if(entry.kind==='free')openLab('free');else openReading(entry.classId!);};
    item.append(button);list.append(item);
  }
  $('#catalogue-result-count').textContent=`${entries.length} ${entries.length===1?'opción':'opciones'}`;
  list.hidden=entries.length===0;$('#empty-catalogue').hidden=entries.length>0;
  $('#empty-catalogue-text').textContent=catalogueFilter==='recent'&&!query?'Todavía no has visitado estas experiencias.':'Prueba con otro término dentro de esta sección.';
  $('#main-menu').classList.toggle('subject-page',!!subject);
  $('#menu-title-lead').textContent=subject?subject.title:catalogueFilter==='recent'?'Retoma tus descubrimientos.':'Aprende la idea.';
  $('#menu-title-accent').textContent=subject||catalogueFilter==='recent'?'':'Llévala al laboratorio.';
  $('#menu-kicker').textContent=subject?'EXPLORA LA MATERIA':'APRENDIZAJE QUE PUEDES EXPLORAR';
  $('#browse-labs').firstChild!.textContent=subject?'Explorar las clases ':'Explorar materias ';
  $('#catalogue-art').hidden=!!subject||catalogueFilter==='recent';
  $('#hero-welcome').hidden=!!subject;
  $('#menu-subtitle').textContent=subject?subject.description:'Comprende los conceptos, descubre cómo se relacionan y ponlos a prueba en un laboratorio virtual. A tu ritmo, desde tu navegador.';
  $('#catalogue-title').textContent=subject?'Clases y laboratorios':'Encuentra tu próxima materia';
  $('#catalogue-path').hidden=!subject;$('#catalogue-lab-name').textContent=subject?.title??'';
  $('#getting-started').hidden=!!subject||catalogueFilter!=='all'||!!query;
  const search=$<HTMLInputElement>('#experience-search');search.placeholder=subject?'Buscar una clase…':'Buscar una materia…';search.setAttribute('aria-label',subject?'Buscar clases de la materia':'Buscar materias');
  document.querySelectorAll<HTMLButtonElement>('[data-nav-filter]').forEach(button=>{const active=!subject&&button.dataset.navFilter===catalogueFilter;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
}
function openSubject(id:string){getSubject(id);entryFilter='all';catalogueSubject=id;catalogueFilter='all';$<HTMLInputElement>('#experience-search').value='';showMenu();}
function openLaboratory(id:string){openSubject(subjectForLaboratory(id).id);}
function navigateCatalogue(filter:CatalogueFilter){if(xrRuntime?.isImmersive()){xrRuntime.openCatalogue();return;}catalogueSubject=null;catalogueFilter=filter;$<HTMLInputElement>('#experience-search').value='';showMenu();}
let readingId:string|null=null;
const labHost=new LabHost($('#external-lab-host'),labModules,()=>{$('#external-lab').hidden=true;currentView='study';$('#study-prepare').focus({preventScroll:true});});
function closeExternalLab(){labHost.close();$('#external-lab').hidden=true;}
function openExternalLab(labId:string,contentId:string){
  currentView='external';$('#external-lab').hidden=false;
  labHost.open(labId,contentId).catch(error=>{console.error(error);if(currentView!=='external')return;closeExternalLab();currentView='study';toast('No se pudo abrir el laboratorio.');});
}
$('#external-back').onclick=()=>labHost.exit();
function openReading(id:string){
  const content=getLearningContent(id);saveSession();showMenu();
  readingId=id;catalogueSubject=content.subjectId;currentView='study';
  $('#main-menu').hidden=true;$('#study-view').hidden=false;
  $('#header-context').textContent=content.title;document.title=`${content.title} · Umbral Labs`;
  $('#study-subject').textContent=getSubject(content.subjectId).title;
  $('#study-title').textContent=content.title;$('#study-description').textContent=content.description;
  $('#study-duration').textContent=content.duration;$('#study-lab-title').textContent=content.laboratoryTitle;
  $('#study-status').textContent=content.runtimeClassId||content.labId?'Contenido + práctica guiada':'Contenido propuesto · Laboratorio en preparación';
  const sections=$('#study-sections'),outline=$('#study-outline');sections.replaceChildren();outline.replaceChildren();
  content.sections.forEach((section,index)=>{
    const article=document.createElement('article');article.id=`reading-${index}`;article.className='reading-section';
    const number=document.createElement('span');number.className='reading-number';number.textContent=`0${index+1}`;
    const title=document.createElement('h2');title.textContent=section.title;
    const text=document.createElement('p');text.textContent=section.text;
    const example=document.createElement('aside');example.textContent=section.example;
    article.append(number,title,text,example);sections.append(article);
    const link=document.createElement('a');link.href=`#reading-${index}`;link.textContent=`0${index+1}  ${section.title}`;outline.append(link);
  });
  const button=$<HTMLButtonElement>('#study-prepare');button.disabled=!content.runtimeClassId&&!content.labId;
  button.textContent=content.runtimeClassId||content.labId?'Ir al laboratorio →':'Laboratorio en preparación';
  button.onclick=()=>{if(content.runtimeClassId)openLab('class',content.runtimeClassId);else if(content.labId)openExternalLab(content.labId,content.id);};
  $('#study-practice-description').textContent=content.runtimeClassId?'Ya conoces la idea. Ahora compruébala con ayuda de tu guía. En el siguiente paso podrás preparar tu espacio antes de iniciar.':content.labId?'Ya conoces la idea. Ahora compruébala en el laboratorio.':'Esta materia muestra la estructura prevista. Su simulación todavía está en preparación.';
  window.scrollTo({top:0,behavior:'auto'});const heading=$('#study-title');heading.tabIndex=-1;heading.focus({preventScroll:true});
}
$('#study-back').onclick=()=>{if(catalogueSubject)openSubject(catalogueSubject);else showMenu();};
function focusSearch(){showMenu();$<HTMLInputElement>('#experience-search').focus();}
$('#start-tutorial').onclick=$('#hero-welcome').onclick=$('#welcome-nav').onclick=()=>{saveSession();openLab('class',welcomeClassId);};
$('#experience-search').oninput=renderCatalogue;
document.querySelectorAll<HTMLButtonElement>('[data-entry-filter]').forEach(button=>button.onclick=()=>{entryFilter=button.dataset.entryFilter as typeof entryFilter;renderCatalogue();});
$('#browse-labs').onclick=()=>{const heading=$('#catalogue-title');heading.tabIndex=-1;heading.focus({preventScroll:true});heading.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});};
$('#quick-search').onclick=focusSearch;
$('#reset-catalogue').onclick=()=>{catalogueFilter='all';entryFilter='all';$<HTMLInputElement>('#experience-search').value='';renderCatalogue();};
$('#catalogue-home').onclick=()=>navigateCatalogue('all');
const subjectsButton=document.createElement('button');subjectsButton.className='nav-item';subjectsButton.textContent='Materias';subjectsButton.onclick=()=>{navigateCatalogue('all');$('#browse-labs').click();};$('#laboratory-nav').append(subjectsButton);
document.querySelectorAll<HTMLButtonElement>('[data-nav-filter]').forEach(button=>button.onclick=()=>navigateCatalogue(button.dataset.navFilter as CatalogueFilter));
window.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();focusSearch();}});

function clearReadingAnchor(){if(/^#(?:reading-\d+|study-practice)$/.test(location.hash))history.replaceState(null,'',location.pathname+location.search);}
function showMenu(){
  clearReadingAnchor();closeExternalLab();
  launchVersion++;launchBusy=false;$('#launch-view').hidden=true;$('#study-view').hidden=true;
  if(xrRuntime?.isImmersive())void xrRuntime.exit();
  if(document.fullscreenElement)void document.exitFullscreen().catch(()=>{});
  navigationKeys.clear();
  saveSession();
  narrator.stop();pending=null;updateHint();currentView='menu';document.body.classList.remove('in-lab');
  $('#lab-view').hidden=true;$('#main-menu').hidden=false;$('#back-menu').hidden=true;
  $('#header-context').textContent=catalogueSubject?getSubject(catalogueSubject).title:'Materias y laboratorios';document.title='Umbral Labs · Catálogo';
  renderCatalogue();window.scrollTo({top:0,behavior:'auto'});
  const heading=$('#main-menu h1');heading.tabIndex=-1;heading.focus({preventScroll:true});
}
function openLab(targetMode:'class'|'free',classId=activeClass.id,startImmediately=false){
  clearReadingAnchor();closeExternalLab();
  launchVersion++;launchBusy=false;
  stepConfirmation.enter();freeCompletion=null;narrationPurpose='lesson';$('#step-confirmation').textContent='';
  window.clearTimeout(toastTimer);$('#toast').classList.remove('visible');$('#toast').textContent='';
  narrator.stop();lastNarratedStep=-1;cueStep=-1;mode=targetMode;
  if(targetMode==='class')activeClass=getClass(classId);
  catalogueSubject=targetMode==='class'?(activeClass.laboratoryId?subjectForLaboratory(activeClass.laboratoryId).id:null):'electronics';
  $('#study-view').hidden=true;
  $('#back-menu').textContent=catalogueSubject?'← Clases del laboratorio':'← Inicio';
  const session=sessions.get(sessionKey());
  circuit=session?.circuit??(targetMode==='class'?createStepCircuit(activeClass,0):preset('empty'));
  selected=session?.selected??(targetMode==='class'?activeClass.initialSelection:'V1');step=session?.step??0;completed=session?.completed??false;
  inspectedParts.clear();session?.seen.forEach(id=>inspectedParts.add(id));cueStep=step;
  currentView='ready';document.body.classList.remove('in-lab');$('#main-menu').hidden=true;$('#lab-view').hidden=false;$('#back-menu').hidden=false;
  $('#header-context').textContent=mode==='class'?activeClass.title:'Banco de electrónica';document.title=`${mode==='class'?activeClass.title:'Banco de electrónica'} · Umbral Labs`;
  $('#lab-view h1').textContent=mode==='class'?activeClass.title:'Banco de electrónica';
  $('#lab-view').hidden=true;$('#back-menu').hidden=true;$('#launch-view').hidden=false;
  $('#launch-back').textContent=mode==='class'&&readingId===activeClass.id?'← Volver al contenido':'← Volver al catálogo';
  $('#launch-title').textContent=mode==='class'?activeClass.title:'Banco de electrónica';
  $('#launch-category').textContent=mode==='free'?'EXPLORACIÓN LIBRE':activeClass.laboratoryId?'CLASE GUIADA · NIVEL INTRODUCTORIO':'BIENVENIDA · CONOCE LA PLATAFORMA';
  $('#launch-outcomes').textContent=mode==='class'?activeClass.steps.slice(0,3).map(item=>item.title).join(' · '):'Construye un montaje, cambia sus valores y compara las mediciones y las gráficas a tu ritmo.';
  $('#launch-description').textContent=mode==='class'?activeClass.description:'Crea y explora tus propios circuitos sin una actividad obligatoria.';
  $('#launch-meta').textContent=mode==='class'?`${activeClass.duration} · ${activeClass.steps.length} pasos${session?` · Retomarás el paso ${step+1}`:''}`:'Modo libre · A tu ritmo';
  const canRestart=mode==='class'&&!!session;$('#launch-restart').hidden=!canRestart;
  $('#launch-error').hidden=true;$('#launch-window').hidden=true;updateLaunchButton();
  window.scrollTo({top:0,behavior:'auto'});
  if(startImmediately){activateSimulation();return;}
  if(xrRuntime?.isImmersive()){$('#launch-view').hidden=true;$('#lab-view').hidden=false;xrRuntime.showLaunch(mode==='class'?activeClass.title:'Banco de electrónica',mode==='class',canRestart);}
  else{const heading=$('#launch-title');heading.tabIndex=-1;heading.focus({preventScroll:true});}
}
function updateLaunchButton(){
  const button=$<HTMLButtonElement>('#start-simulation');button.disabled=!presentationReady||launchBusy;
  button.textContent=launchBusy?'Abriendo el entorno…':mode==='class'?'Iniciar clase':'Iniciar simulación';
  $('#launch-device').textContent=!presentationReady?'Comprobando el modo de inicio…':xrRuntime?.canEnterVR()?'VR disponible: al iniciar solicitaremos acceso a las gafas.':'Modo PC: al iniciar abriremos la simulación a pantalla completa.';
}
function activateSimulation(){
  currentView='lab';document.body.classList.add('in-lab');$('#launch-view').hidden=true;$('#lab-view').hidden=false;$('#back-menu').hidden=false;
  xrRuntime?.completeLaunch();rebuild();engine.resize();resizeSpatialControls();overview();
  canvas.focus({preventScroll:true});if(mode==='class')narrateLesson();
}
function abandonPresentation(){
  if(currentView==='lab')return;
  if(xrRuntime?.isXR())void xrRuntime.exit();
  if(document.fullscreenElement)void document.exitFullscreen().catch(()=>{});
}
async function startSimulation(){
  if(currentView!=='ready'||launchBusy||!presentationReady)return;
  const version=launchVersion;launchBusy=true;updateLaunchButton();$('#launch-error').hidden=true;$('#launch-window').hidden=true;
  // Reveal the render surface for the platform request, retaining the preparation screen on failure.
  $('#lab-view').hidden=false;
  const result=await enterPresentation({inXR:xrRuntime?.isXR()??false,supportsXR:xrRuntime?.canEnterVR()??false,
    enterXR:()=>xrRuntime!.enter($('#xr-status')),
    enterFullscreen:()=>document.fullscreenElement?Promise.resolve():$('.viewport').requestFullscreen()});
  if(version!==launchVersion||currentView!=='ready'){abandonPresentation();return;}
  launchBusy=false;updateLaunchButton();
  if(result==='ready'){activateSimulation();return;}
  $('#lab-view').hidden=true;$('#launch-view').hidden=false;
  $('#launch-error').textContent=result==='vr-denied'?'No se pudo abrir VR. Puedes pulsar iniciar para reintentar o continuar en esta ventana.':'El navegador no permitió la pantalla completa. Puedes reintentar o continuar en esta ventana.';
  $('#launch-error').hidden=false;$('#launch-window').hidden=false;
}
$('#start-simulation').onclick=()=>void startSimulation();
$('#launch-window').onclick=()=>{if(currentView==='ready'&&!launchBusy)activateSimulation();};
function restartClass(){if(currentView!=='ready'||mode!=='class'||launchBusy)return;sessions.delete(classSessionKey(activeClass.id));stepConfirmation.forgetClass(activeClass.id);openLab('class',activeClass.id);}
$('#launch-restart').onclick=restartClass;
$('#launch-back').onclick=()=>{if(mode==='class'&&readingId===activeClass.id)openReading(readingId);else showMenu();};
$('#back-menu').onclick=()=>{catalogueFilter='all';$<HTMLInputElement>('#experience-search').value='';showMenu();};
$('.brand').onclick=event=>{event.preventDefault();navigateCatalogue('all');};
xrRuntime=new QuestRuntime(scene,camera,{
  isLab:()=>currentView!=='menu',onStart:()=>{if(currentView==='ready')activateSimulation();},onRestart:restartClass,onStop:()=>{navigationKeys.clear();narrator.stop();},
  onMode:active=>{
    navigationKeys.clear();labRoot.scaling.setAll(active?questLayout.scale:1);environment.setEnabled(!active);labRoot.position.y=active?questLayout.tableHeight:0;labRoot.computeWorldMatrix(true);
    spatialControls.setImmersive(active);spatialGuide.setImmersive(active);spatialControls.setVisible(active?true:preferredControlsVisible);
    $('#quest-preview').textContent=active?'Volver a vista PC':'Vista Quest en PC';document.body.classList.toggle('quest-preview-active',active);
    if(!active){resizeSpatialControls();if(currentView==='ready'){$('#launch-view').hidden=false;$('#lab-view').hidden=true;if(document.fullscreenElement)void document.exitFullscreen().catch(()=>{});}}rebuild();
  },
  onCatalogue:open=>{labRoot.setEnabled(!open);spatialControls.setVisible(!open);spatialGuide.setVisible(!open);},
  onExperience:(target,id)=>{saveSession();openLab(target,id);}
});
$('#quest-preview').onclick=()=>xrRuntime?.togglePreview();
void xrRuntime.initialize($<HTMLButtonElement>('#enter-vr'),$('#xr-status')).finally(()=>{presentationReady=true;updateLaunchButton();});
rebuild();showMenu();engine.runRenderLoop(()=>{
  if(currentView!=='lab'){if(currentView==='ready'&&xrRuntime?.isImmersive())scene.render();return;}
  if(document.activeElement!==canvas||spatialControls.isEditing())navigationKeys.clear();
  if(!xrRuntime?.isImmersive()){const target=moveWithinLab(camera.target,camera.alpha,navigationKeys,engine.getDeltaTime()/1000);camera.target.set(target.x,target.y,target.z);}currentAnimation.tick(engine.getDeltaTime()/1000);spatialGuide.tick(engine.getDeltaTime()/1000);scene.render();
});
window.addEventListener('resize',()=>{engine.resize();resizeSpatialControls();});new ResizeObserver(()=>{engine.resize();resizeSpatialControls();}).observe(canvas);
