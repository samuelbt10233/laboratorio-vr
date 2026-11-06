import { Color3, DynamicTexture, Mesh, MeshBuilder, StandardMaterial, TransformNode, Vector3, type Scene } from '@babylonjs/core';
import { lotoSteps, nextStep, type LotoAction, type LotoState } from './procedure';
export type Target=LotoAction|'hint'|'reset';
export interface IndustrialScene {floor:Mesh;update(state:LotoState,message:string,hint:boolean):void;tick(seconds:number):void}
interface Hotspot {mat:StandardMaterial;done:boolean}
const BOARD={w:3.2,h:3.2*620/1024,pxW:1024,pxH:620,y:3};
const hex=(value:string)=>Color3.FromHexString(value);
/** Everything is in metres and the user looks towards +z. Pure decoration plus animation: the rules live in procedure.ts. */
export function buildIndustrialScene(scene:Scene):IndustrialScene{
  const root=new TransformNode('industrial bay',scene);
  const mat=(name:string,color:string)=>{const m=new StandardMaterial(name,scene);m.diffuseColor=hex(color);m.specularColor=Color3.Black();return m;};
  const printed=(name:string,w:number,h:number,draw:(ctx:CanvasRenderingContext2D)=>void)=>{
    const texture=new DynamicTexture(name,{width:w,height:h},scene,true);draw(texture.getContext() as CanvasRenderingContext2D);texture.update();
    const m=new StandardMaterial(name,scene);m.diffuseTexture=texture;m.emissiveTexture=texture;m.emissiveColor=new Color3(.55,.55,.55);m.specularColor=Color3.Black();return m;
  };
  const add=<T extends Mesh>(mesh:T,m:StandardMaterial,x:number,y:number,z:number,parent:TransformNode=root)=>{mesh.parent=parent;mesh.position.set(x,y,z);mesh.material=m;mesh.isPickable=false;return mesh;};
  const box=(name:string,m:StandardMaterial,w:number,h:number,d:number,x:number,y:number,z:number,parent?:TransformNode)=>add(MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene),m,x,y,z,parent);
  const cyl=(name:string,m:StandardMaterial,diameter:number,height:number,x:number,y:number,z:number,parent?:TransformNode)=>add(MeshBuilder.CreateCylinder(name,{diameter,height,tessellation:24},scene),m,x,y,z,parent);
  const plane=(name:string,m:StandardMaterial,w:number,h:number,x:number,y:number,z:number,parent?:TransformNode)=>add(MeshBuilder.CreatePlane(name,{width:w,height:h},scene),m,x,y,z,parent);
  const text=(name:string,label:string,w:number,x:number,y:number,z:number,color='#17262e',bg='#f1d36b',parent?:TransformNode)=>plane(name,printed(name,256,64,ctx=>{ctx.fillStyle=bg;ctx.fillRect(0,0,256,64);ctx.fillStyle=color;ctx.textAlign='center';let size=25;do ctx.font=`bold ${size--}px sans-serif`;while(ctx.measureText(label).width>236&&size>10);ctx.fillText(label,128,42);}),w,w/4,x,y,z,parent);
  const m={concrete:mat('concrete','#8e989a'),wall:mat('wall','#d9dfdc'),wallLow:mat('wall low','#34545b'),steel:mat('steel','#7d8d93'),dark:mat('dark','#2a3a40'),blue:mat('motor blue','#3a6fa0'),yellow:mat('safety yellow','#e0b43a'),box:mat('cardboard','#b88b58'),rubber:mat('rubber','#252d30')};

  // Room: floor with painted walkway, walls with a dark skirt.
  const floorTexture=printed('floor',512,512,ctx=>{ctx.fillStyle='#8e989a';ctx.fillRect(0,0,512,512);ctx.strokeStyle='#e0b43a';ctx.lineWidth=14;ctx.strokeRect(70,40,372,300);ctx.setLineDash([26,22]);ctx.strokeStyle='#e8ecea';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(256,360);ctx.lineTo(256,512);ctx.stroke();});
  floorTexture.emissiveColor=new Color3(.1,.1,.1);
  const floor=MeshBuilder.CreateGround('bay floor',{width:9,height:10},scene);floor.parent=root;floor.position.set(0,0,2);floor.material=floorTexture;
  box('back wall',m.wall,9,4.2,.2,0,2.1,5.1);box('back skirt',m.wallLow,9,1,.22,0,.5,5.1);
  for(const x of [-4.55,4.55]){box('side wall',m.wall,.2,4.2,10,x,2.1,2);box('side skirt',m.wallLow,.22,1,10,x,.5,2);}

  // Conveyor with motor, a stamping arm that only moves while running and boxes on the belt.
  const belt=new TransformNode('conveyor',scene);belt.parent=root;belt.position.set(0,0,3.1);
  box('conveyor frame',m.steel,3.4,.14,.8,0,.74,0,belt);
  for(const x of [-1.5,1.5])for(const z of [-.32,.32])box('conveyor leg',m.steel,.08,.74,.08,x,.37,z,belt);
  const stripes=printed('belt',256,64,ctx=>{ctx.fillStyle='#252d30';ctx.fillRect(0,0,256,64);ctx.fillStyle='#3a474b';for(let x=0;x<256;x+=32)ctx.fillRect(x,0,10,64);});
  (stripes.diffuseTexture as DynamicTexture).uScale=4;(stripes.emissiveTexture as DynamicTexture).uScale=4;stripes.emissiveColor=new Color3(.25,.25,.25);
  box('belt',stripes,3.2,.05,.6,0,.84,0,belt);
  for(const z of [-.34,.34])box('belt guard',m.yellow,3.2,.1,.04,0,.92,z,belt);
  const cargo=[0,1,2].map(i=>box('cargo box',m.box,.4,.26,.36,-1.1+i*1.1,1.0,0,belt));
  const motor=cyl('motor',m.blue,.4,.55,-1.95,.62,0,belt);motor.rotation.z=Math.PI/2;box('motor foot',m.dark,.5,.1,.4,-1.95,.35,0,belt);
  for(const x of [-.55,.55])box('gantry post',m.steel,.1,1.2,.1,x,1.35,0,belt);
  box('gantry beam',m.steel,1.3,.12,.16,0,1.95,0,belt);
  const arm=new TransformNode('stamping arm',scene);arm.parent=belt;arm.position.set(0,1.5,0);
  box('arm rod',m.dark,.08,.9,.08,0,.2,0,arm);box('arm plate',m.yellow,.5,.06,.4,0,-.28,0,arm);

  // Air tank with gauge and bleed valve.
  const tank=cyl('air tank',mat('tank','#9bb0b6'),.55,1.1,2.9,.62,3.3);tank.rotation.z=Math.PI/2;
  for(const x of [2.5,3.3])box('tank foot',m.dark,.08,.34,.5,x,.17,3.3);
  const pipe=MeshBuilder.CreateTube('air line',{path:[new Vector3(2.9,.9,3.3),new Vector3(2.9,1.5,3.3),new Vector3(2.9,1.95,3.1),new Vector3(.6,1.95,3.1)],radius:.025,tessellation:10},scene);pipe.parent=root;pipe.material=m.dark;pipe.isPickable=false;
  cyl('gauge stub',m.dark,.05,.18,2.9,1.0,3.3);
  const gaugeTexture=new DynamicTexture('gauge',{width:256,height:256},scene,true);
  const gaugeMat=new StandardMaterial('gauge',scene);gaugeMat.diffuseTexture=gaugeTexture;gaugeMat.emissiveTexture=gaugeTexture;gaugeMat.emissiveColor=new Color3(.55,.55,.55);gaugeMat.specularColor=Color3.Black();
  add(MeshBuilder.CreateDisc('gauge face',{radius:.14,tessellation:32},scene),gaugeMat,2.9,1.14,3.27);
  let drawnPressure=-1;
  const drawGauge=(bar:number)=>{
    if(Math.abs(bar-drawnPressure)<.03)return;drawnPressure=bar;const ctx=gaugeTexture.getContext() as CanvasRenderingContext2D;
    ctx.fillStyle='#f4f6f2';ctx.fillRect(0,0,256,256);ctx.strokeStyle='#17262e';ctx.fillStyle='#17262e';ctx.lineWidth=5;ctx.textAlign='center';ctx.font='bold 22px sans-serif';
    for(let i=0;i<=8;i++){const a=(-225+i*33.75)*Math.PI/180;ctx.beginPath();ctx.moveTo(128+80*Math.cos(a),128+80*Math.sin(a));ctx.lineTo(128+104*Math.cos(a),128+104*Math.sin(a));ctx.stroke();ctx.fillText(String(i),128+64*Math.cos(a),136+64*Math.sin(a));}
    const needle=(-225+bar/8*270)*Math.PI/180;ctx.strokeStyle='#c4473a';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(128,128);ctx.lineTo(128+86*Math.cos(needle),128+86*Math.sin(needle));ctx.stroke();
    ctx.fillStyle='#17262e';ctx.beginPath();ctx.arc(128,128,10,0,7);ctx.fill();ctx.font='bold 20px sans-serif';ctx.fillText('bar',128,190);gaugeTexture.update();
  };

  // Interactive elements: each has its own material so it can pulse as a hint or be marked as done.
  const hot:Partial<Record<LotoAction,Hotspot>>={};
  const target=<T extends Mesh>(action:LotoAction,mesh:T,color:string)=>{const m2=mat('target '+action,color);mesh.material=m2;mesh.isPickable=true;mesh.metadata={loto:action};hot[action]=hot[action]??{mat:m2,done:false};return mesh;};

  // Control panel on a post: START (green), STOP (red) and a status lamp.
  const panel=new TransformNode('control panel',scene);panel.parent=root;panel.position.set(-1.45,0,2.0);
  box('panel post',m.dark,.1,1.1,.1,0,.55,.0,panel);box('panel box',m.steel,.5,.58,.16,0,1.25,0,panel);
  text('panel label','PANEL DE CONTROL',.7,0,1.68,-.1,'#17262e','#dfe7e3',panel);
  target('verificar',cyl('start button',m.dark,.12,.07,-.12,1.15,-.1,panel),'#3f9a5a').rotation.x=Math.PI/2;
  target('apagar',cyl('stop button',m.dark,.12,.07,.12,1.15,-.1,panel),'#c4473a').rotation.x=Math.PI/2;
  text('start label','ARRANQUE',.26,-.12,1.02,-.1,'#17262e','#dfe7e3',panel);text('stop label','PARO',.26,.12,1.02,-.1,'#17262e','#dfe7e3',panel);
  const lamp=add(MeshBuilder.CreateSphere('status lamp',{diameter:.1,segments:12},scene),mat('lamp','#3f9a5a'),0,1.42,-.1,panel);lamp.isPickable=false;

  // Main disconnect on the wall: the lever turns to OFF; the padlock and tag go on its hasp.
  const disc=new TransformNode('disconnect',scene);disc.parent=root;disc.position.set(-2.6,1.4,4.9);
  box('disconnect box',mat('disconnect','#a9482f'),.5,.75,.16,0,0,0,disc);box('hasp',m.steel,.12,.08,.03,.2,-.17,-.09,disc);
  const lever=new TransformNode('lever',scene);lever.parent=disc;lever.position.set(0,.02,-.1);
  target('aislar',box('lever',m.dark,.1,.42,.08,0,.2,0,lever),'#2a3a40');
  const indicator=printed('disconnect state',128,64,ctx=>{ctx.fillStyle='#f4f6f2';ctx.fillRect(0,0,128,64);ctx.fillStyle='#3f9a5a';ctx.font='bold 34px sans-serif';ctx.textAlign='center';ctx.fillText('ON',64,45);});
  const indicatorOff=printed('disconnect state off',128,64,ctx=>{ctx.fillStyle='#f4f6f2';ctx.fillRect(0,0,128,64);ctx.fillStyle='#c4473a';ctx.font='bold 34px sans-serif';ctx.textAlign='center';ctx.fillText('OFF',64,45);});
  const stateLabel=plane('disconnect indicator',indicator,.2,.1,0,-.28,-.09,disc);
  text('disconnect label','SECCIONADOR PRINCIPAL',.95,-2.6,2.0,4.82);

  // Padlock rack and the user's padlock.
  box('padlock rack',m.box,.55,.5,.05,-1.4,1.5,4.9);
  const lock=new TransformNode('padlock',scene);lock.parent=root;lock.position.set(-1.52,1.46,4.84);
  target('bloquear',box('padlock body',m.dark,.11,.1,.05,0,0,0,lock),'#c4473a');
  const shackle=add(MeshBuilder.CreateTorus('padlock shackle',{diameter:.07,thickness:.014,tessellation:16},scene),m.steel,0,.06,0,lock);shackle.rotation.x=Math.PI/2;
  box('other padlock',mat('other padlock','#d9a93b'),.11,.1,.05,-1.28,1.46,4.84);
  text('rack label','CANDADOS',.6,-1.4,1.9,4.82);
  const tag=plane('lockout tag',printed('tag',128,192,ctx=>{ctx.fillStyle='#c4473a';ctx.fillRect(0,0,128,192);ctx.fillStyle='#fff';ctx.fillRect(8,8,112,176);ctx.fillStyle='#c4473a';ctx.textAlign='center';ctx.font='bold 22px sans-serif';ctx.fillText('PELIGRO',64,42);ctx.fillText('NO OPERAR',64,70);ctx.fillStyle='#17262e';ctx.font='15px sans-serif';ctx.fillText('Mantenimiento',64,112);ctx.fillText('Operario: tú',64,138);}),.2,.3,-2.4,.95,4.76);tag.isVisible=false;

  // Intercom to warn the team.
  const inter=printed('intercom',128,160,ctx=>{ctx.fillStyle='#dfe7e3';ctx.fillRect(0,0,128,160);ctx.fillStyle='#8a9a9e';for(let y=20;y<80;y+=10)ctx.fillRect(20,y,88,5);ctx.fillStyle='#17262e';ctx.font='bold 18px sans-serif';ctx.textAlign='center';ctx.fillText('AVISO',64,148);});
  box('intercom base',m.steel,.3,.38,.08,-3.6,1.5,4.9);plane('intercom face',inter,.28,.35,-3.6,1.5,4.85);
  target('avisar',cyl('intercom button',m.dark,.1,.04,-3.6,1.38,4.84),'#e0b43a').rotation.x=Math.PI/2;
  text('intercom label','INTERCOMUNICADOR',.9,-3.6,1.85,4.82);

  // Bleed valve on the tank.
  const valve=new TransformNode('bleed valve',scene);valve.parent=root;valve.position.set(3.2,.5,2.99);
  cyl('valve stub',m.steel,.06,.1,0,0,.04,valve).rotation.x=Math.PI/2;
  const wheel=new TransformNode('valve wheel',scene);wheel.parent=valve;wheel.position.z=-.04;
  const ring=target('liberar',MeshBuilder.CreateTorus('valve ring',{diameter:.2,thickness:.025,tessellation:20},scene),'#c4473a');ring.parent=wheel;ring.rotation.x=Math.PI/2;
  for(const a of [0,Math.PI/2]){const spoke=box('valve spoke',m.dark,.2,.02,.02,0,0,0,wheel);spoke.rotation.z=a;}
  text('tank label','TANQUE DE AIRE',.75,2.9,1.5,3.27);

  // Wall details: protection poster and extinguisher.
  plane('ppe poster',printed('ppe',256,320,ctx=>{ctx.fillStyle='#2c6aa8';ctx.fillRect(0,0,256,320);ctx.fillStyle='#fff';ctx.fillRect(12,12,232,296);ctx.fillStyle='#2c6aa8';ctx.textAlign='center';ctx.font='bold 26px sans-serif';ctx.fillText('USO OBLIGATORIO',128,60);ctx.fillText('DE EQUIPO',128,92);ctx.fillText('DE PROTECCIÓN',128,124);ctx.font='70px sans-serif';ctx.fillText('👷',128,220);ctx.font='28px sans-serif';ctx.fillText('🥽 🧤 🥾',128,280);}),.7,.88,2.5,1.8,4.88);
  cyl('extinguisher',mat('extinguisher','#c4473a'),.2,.55,3.6,.85,4.7);

  // Step board: drawn as a texture so it works the same on a screen and in VR.
  const boardTexture=new DynamicTexture('procedure board',{width:BOARD.pxW,height:BOARD.pxH},scene,true);
  const boardMat=new StandardMaterial('procedure board',scene);boardMat.diffuseTexture=boardTexture;boardMat.emissiveTexture=boardTexture;boardMat.emissiveColor=new Color3(.7,.7,.7);boardMat.specularColor=Color3.Black();
  box('board frame',m.dark,BOARD.w+.1,BOARD.h+.1,.06,0,BOARD.y,4.93);
  plane('procedure board',boardMat,BOARD.w,BOARD.h,0,BOARD.y,4.88);
  const overlay=(action:Target,px:number,py:number,pw:number,ph:number)=>{
    const m2=new StandardMaterial('overlay '+action,scene);m2.alpha=.01;m2.disableLighting=true;
    const p=plane('board button '+action,m2,pw/BOARD.pxW*BOARD.w,ph/BOARD.pxH*BOARD.h,(px+pw/2-BOARD.pxW/2)/BOARD.pxW*BOARD.w,BOARD.y+(BOARD.pxH/2-py-ph/2)/BOARD.pxH*BOARD.h,4.87);p.metadata={loto:action};p.isPickable=true;
  };
  overlay('hint',40,538,230,64);overlay('reset',290,538,230,64);
  const wrap=(ctx:CanvasRenderingContext2D,value:string,x:number,y:number,width:number,line:number)=>{let row='';for(const word of value.split(' ')){const test=row?row+' '+word:word;if(ctx.measureText(test).width>width&&row){ctx.fillText(row,x,y);row=word;y+=line;}else row=test;}ctx.fillText(row,x,y);};
  const drawBoard=(state:LotoState,message:string,hint:boolean)=>{
    const ctx=boardTexture.getContext() as CanvasRenderingContext2D,next=nextStep(state);
    ctx.fillStyle='#10252d';ctx.fillRect(0,0,BOARD.pxW,BOARD.pxH);ctx.textAlign='left';
    ctx.fillStyle='#edc76d';ctx.font='bold 34px sans-serif';ctx.fillText('BLOQUEO Y ETIQUETADO · CINTA TRANSPORTADORA',40,56);
    ctx.fillStyle='#8fb5a8';ctx.font='22px sans-serif';ctx.fillText('Práctica didáctica: no sustituye el procedimiento de tu planta.',40,90);
    lotoSteps.forEach((step,i)=>{
      const y=150+i*58,done=state.done.includes(step.id),current=next?.id===step.id;
      if(current){ctx.fillStyle='#1f4a52';ctx.fillRect(30,y-34,520,52);}
      ctx.strokeStyle=done?'#7ed6a0':current?'#edc76d':'#5b7a80';ctx.lineWidth=4;ctx.beginPath();ctx.arc(62,y-8,16,0,7);ctx.stroke();
      ctx.fillStyle=done?'#7ed6a0':current?'#edc76d':'#9fb8b3';ctx.font='bold 26px sans-serif';ctx.fillText(done?'✓':String(i+1),done?52:55,y+1);
      ctx.font=(current?'bold ':'')+'28px sans-serif';ctx.fillText(step.title,100,y);
    });
    ctx.fillStyle='#17333b';ctx.fillRect(580,120,404,380);ctx.fillStyle='#dfe9e5';ctx.font='bold 26px sans-serif';ctx.fillText(state.finished?'¡Completado!':next?`Paso ${state.done.length+1}: ${next.title}`:'',600,160);
    ctx.font='26px sans-serif';ctx.fillStyle='#c7d8d3';wrap(ctx,state.finished?message:next?(hint?next.task:message):message,600,208,364,36);
    ctx.fillStyle=state.errors?'#efac87':'#8fb5a8';ctx.font='bold 24px sans-serif';ctx.fillText(`Errores: ${state.errors}`,600,470);
    for(const [x,label,on] of [[40,'Pista',hint],[290,'Reiniciar',false]] as const){ctx.fillStyle=on?'#edc76d':'#2c5a62';ctx.fillRect(x,538,230,64);ctx.fillStyle=on?'#17262e':'#dfe9e5';ctx.font='bold 28px sans-serif';ctx.textAlign='center';ctx.fillText(label,x+115,580);ctx.textAlign='left';}
    boardTexture.update();
  };

  // Animated state, eased in tick().
  let running=true,leverAngle=0,leverGoal=0,pressure=6,pressureGoal=6,hintOn=false,hintAction:LotoAction|null=null,clock=0,beltSpeed=1,lockProgress=0,lockGoal=0,wheelAngle=0;
  const rackPos=lock.position.clone(),lockedPos=new Vector3(-2.4,1.23,4.78);
  return {
    floor,
    update(state,message,hint){
      running=!state.done.includes('apagar');leverGoal=state.done.includes('aislar')?Math.PI:0;pressureGoal=state.done.includes('liberar')?0:6;lockGoal=state.done.includes('bloquear')?1:0;
      stateLabel.material=state.done.includes('aislar')?indicatorOff:indicator;tag.isVisible=state.done.includes('bloquear');
      hintOn=hint;hintAction=nextStep(state)?.id??null;
      for(const id of Object.keys(hot) as LotoAction[])hot[id]!.done=state.done.includes(id);
      (lamp.material as StandardMaterial).diffuseColor=hex(running?'#3f9a5a':'#c4473a');(lamp.material as StandardMaterial).emissiveColor=hex(running?'#1d5a31':'#7a241c');
      drawBoard(state,message,hint);
    },
    tick(seconds){
      clock+=seconds;const ease=(value:number,goal:number,rate:number)=>value+(goal-value)*Math.min(1,rate*seconds);
      beltSpeed=ease(beltSpeed,running?1:0,3);leverAngle=ease(leverAngle,leverGoal,8);pressure=ease(pressure,pressureGoal,1.4);lockProgress=ease(lockProgress,lockGoal,6);wheelAngle=ease(wheelAngle,pressureGoal===0?Math.PI*3:0,2);
      (stripes.diffuseTexture as DynamicTexture).uOffset+=seconds*beltSpeed*.6;(stripes.emissiveTexture as DynamicTexture).uOffset=(stripes.diffuseTexture as DynamicTexture).uOffset;
      for(const c of cargo){c.position.x+=seconds*beltSpeed*.5;if(c.position.x>1.35)c.position.x-=3.3;}
      arm.position.y=1.5-Math.max(0,Math.sin(clock*3))*.3*beltSpeed;
      lever.rotation.z=leverAngle;wheel.rotation.z=wheelAngle;
      lock.position=Vector3.Lerp(rackPos,lockedPos,lockProgress);drawGauge(pressure);
      for(const id of Object.keys(hot) as LotoAction[]){const h=hot[id]!;
        const pulse=hintOn&&hintAction===id?.35+.35*Math.sin(clock*6):0;
        h.mat.emissiveColor=pulse?new Color3(pulse,pulse*.8,0):h.done?new Color3(0,.3,.14):Color3.Black();}
    },
  };
}
