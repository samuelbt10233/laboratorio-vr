import { Color3, Color4, DirectionalLight, DynamicTexture, GlowLayer, Mesh, MeshBuilder, ParticleSystem, PointLight, Scene, ShadowGenerator, StandardMaterial, TransformNode, Vector3 } from '@babylonjs/core';
import { ruleSteps, nextStep, type RuleAction, type RuleState } from './procedure';
export type Target=RuleAction|'hint'|'reset';
export interface PoleScene {floor:Mesh;update(state:RuleState,message:string,hint:boolean,summary:string|null):void;arc():void;tick(seconds:number):void}
interface Hotspot {mats:StandardMaterial[];done:boolean}
const BOARD={w:3.6,h:3.6*620/1024,pxW:1024,pxH:620};
const hex=(value:string)=>Color3.FromHexString(value);
const POLE_Z=6.2,LINE_Y=9.47,LINE_Z=6.05,PHASES=[-1,0,1];
/** Seeded so the street looks the same on every load. */
function random(seed:number){return ()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};}
/** A street with a distribution pole and transformer; the user looks towards +z. Decoration and animation only: the rules live in procedure.ts. */
export function buildPoleScene(scene:Scene):PoleScene{
  const root=new TransformNode('street',scene),rand=random(7);
  scene.clearColor=new Color4(.72,.82,.9,1);scene.fogMode=Scene.FOGMODE_EXP2;scene.fogDensity=.012;scene.fogColor=new Color3(.72,.82,.9);
  const sun=new DirectionalLight('sun',new Vector3(-.45,-1,.55),scene);sun.position=new Vector3(12,30,-10);sun.intensity=1.15;sun.diffuse=hex('#fff4e0');
  const shadows=new ShadowGenerator(1024,sun);shadows.usePercentageCloserFiltering=true;shadows.bias=.002;
  const cast=<T extends Mesh>(mesh:T)=>{shadows.addShadowCaster(mesh);return mesh;};
  const mat=(name:string,color:string,shine=0)=>{const m=new StandardMaterial(name,scene);m.diffuseColor=hex(color);m.specularColor=new Color3(shine,shine,shine);return m;};
  /** Lit material with a speckled texture: concrete, asphalt, grass. */
  const rough=(name:string,base:string,speck:string[],scale:number)=>{
    const t=new DynamicTexture(name,{width:256,height:256},scene,true),ctx=t.getContext() as CanvasRenderingContext2D;
    ctx.fillStyle=base;ctx.fillRect(0,0,256,256);for(let i=0;i<2600;i++){ctx.fillStyle=speck[i%speck.length];ctx.globalAlpha=.25+rand()*.35;ctx.fillRect(rand()*256,rand()*256,1+rand()*3,1+rand()*3);}
    ctx.globalAlpha=1;t.update();t.uScale=scale;t.vScale=scale;const m=new StandardMaterial(name,scene);m.diffuseTexture=t;m.specularColor=Color3.Black();return m;
  };
  const printed=(name:string,w:number,h:number,draw:(ctx:CanvasRenderingContext2D)=>void,glow=.55)=>{
    const t=new DynamicTexture(name,{width:w,height:h},scene,true);draw(t.getContext() as CanvasRenderingContext2D);t.update();t.hasAlpha=true;
    const m=new StandardMaterial(name,scene);m.diffuseTexture=t;m.emissiveTexture=t;m.emissiveColor=new Color3(glow,glow,glow);m.specularColor=Color3.Black();m.useAlphaFromDiffuseTexture=true;return m;
  };
  const add=<T extends Mesh>(mesh:T,m:StandardMaterial,x:number,y:number,z:number,parent:TransformNode=root)=>{mesh.parent=parent;mesh.position.set(x,y,z);mesh.material=m;mesh.isPickable=false;return mesh;};
  const box=(name:string,m:StandardMaterial,w:number,h:number,d:number,x:number,y:number,z:number,parent?:TransformNode)=>add(MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene),m,x,y,z,parent);
  const cyl=(name:string,m:StandardMaterial,diameter:number,height:number,x:number,y:number,z:number,parent?:TransformNode,top=diameter)=>add(MeshBuilder.CreateCylinder(name,{diameterBottom:diameter,diameterTop:top,height,tessellation:20},scene),m,x,y,z,parent);
  const plane=(name:string,m:StandardMaterial,w:number,h:number,x:number,y:number,z:number,parent?:TransformNode)=>add(MeshBuilder.CreatePlane(name,{width:w,height:h},scene),m,x,y,z,parent);
  const wire=(name:string,m:StandardMaterial,points:Vector3[],radius=.012)=>{const t=MeshBuilder.CreateTube(name,{path:points,radius,tessellation:8},scene);t.parent=root;t.material=m;t.isPickable=false;return t;};
  /** Billboard label above an element on the ground. */
  const label=(name:string,value:string,x:number,y:number,z:number,w=.9)=>{const p=plane(name,printed(name,256,64,ctx=>{ctx.fillStyle='rgba(16,37,45,.88)';ctx.beginPath();ctx.roundRect(0,0,256,64,14);ctx.fill();ctx.fillStyle='#f6f8f4';ctx.textAlign='center';let size=28;do ctx.font=`bold ${size--}px sans-serif`;while(ctx.measureText(value).width>232&&size>10);ctx.fillText(value,128,42);},.95),w,w/4,x,y,z);p.billboardMode=Mesh.BILLBOARDMODE_Y;return p;};
  const m={concrete:rough('pole concrete','#a3a39b',['#8a8a82','#bdbdb4','#77776f'],1),steel:mat('galvanized','#9aa4a6',.35),porcelain:mat('porcelain','#d9d6cc',.5),brown:mat('glazed','#6b3a26',.4),line:mat('aluminium line','#5f6668',.4),dark:mat('dark','#2a3236'),white:mat('truck white','#eceeec',.15),orange:mat('orange','#e0702a'),copper:mat('ground copper','#b8742f',.4),glass:mat('glass','#3b4b55',.6)};

  // Ground: grass verge where the user stands, sidewalk with the pole, kerb, street and houses beyond.
  const floor=MeshBuilder.CreateGround('grass',{width:140,height:40},scene);floor.parent=root;floor.position.set(0,0,-12);floor.material=rough('grass','#6f8a4a',['#5b7639','#86a05c','#4e6a31'],30);floor.receiveShadows=true;
  const walk=MeshBuilder.CreateGround('sidewalk',{width:140,height:4},scene);walk.parent=root;walk.position.set(0,.02,6);walk.material=rough('sidewalk','#b8b4a8',['#a19d92','#cbc7bb'],35);walk.receiveShadows=true;
  box('kerb',m.concrete,140,.16,.25,0,.08,8.1);
  const road=MeshBuilder.CreateGround('street',{width:140,height:8},scene);road.parent=root;road.position.set(0,.01,12.2);road.material=rough('asphalt','#45474a',['#3a3c3f','#55585b','#2f3133'],40);road.receiveShadows=true;
  const paint=mat('road paint','#e9e3c8');for(let x=-66;x<70;x+=6)box('lane dash',paint,3,.01,.14,x,.02,12.2);
  box('far sidewalk',m.concrete,140,.1,4,0,.05,18.2);
  const facades=['#e8d9b5','#d98c5f','#9fb7a5','#e6e1d6','#c7a27c','#b9c4cf'];
  const windows=printed('windows',256,256,ctx=>{ctx.fillStyle='#000';ctx.clearRect(0,0,256,256);for(const x of [30,150])for(const y of [30,150]){ctx.fillStyle='#e9eef0';ctx.fillRect(x-6,y-6,88,88);ctx.fillStyle='#3d5160';ctx.fillRect(x,y,76,76);ctx.fillStyle='#e9eef0';ctx.fillRect(x+36,y,4,76);}},.2);
  for(let i=0;i<9;i++){
    const x=-36+i*9,w=7.5+rand()*1.2,h=5.2+rand()*2.4,house=new TransformNode('house',scene);house.parent=root;house.position.set(x,0,22);
    cast(box('house body',mat('facade '+i,facades[i%facades.length]),w,h,6,0,h/2,0,house));
    box('house roof',mat('roof '+i,i%2?'#8c4a32':'#6d6a66'),w+.4,.3,6.6,0,h+.15,0,house);
    plane('house windows',windows,w*.7,h*.6,0,h*.55,-3.01,house);box('house door',mat('door '+i,'#5a3d2b'),1.1,2.1,.1,w*.3,1.05,-3.02,house);
  }

  // Distribution pole: concrete, crossarm, three insulators, the line, cutouts and a three-phase transformer.
  const pole=cast(cyl('pole',m.concrete,.36,9.6,0,4.8,POLE_Z,root,.22));
  cast(box('crossarm',m.steel,2.5,.1,.1,0,9.2,LINE_Z));
  for(const x of PHASES){cyl('insulator',m.porcelain,.12,.2,x,9.35,LINE_Z);for(const y of [9.3,9.37])cyl('insulator skirt',m.porcelain,.18,.025,x,y,LINE_Z);}
  // The line crosses the street: one span to the far sidewalk and one behind the user, each with its sag.
  for(const x of PHASES)wire('line conductor',m.line,[new Vector3(x,LINE_Y,-26),new Vector3(x,LINE_Y-.45,-10),new Vector3(x,LINE_Y,LINE_Z),new Vector3(x,LINE_Y-.2,12.8),new Vector3(x,LINE_Y,19.5)],.014);
  for(const z of [-26,19.5]){cyl('far pole',m.concrete,.36,9.6,0,4.8,z+.15,root,.22);box('far crossarm',m.steel,2.5,.1,.1,0,9.2,z);for(const x of PHASES)cyl('far insulator',m.porcelain,.12,.2,x,9.35,z);}
  box('cutout arm',m.steel,1.9,.08,.08,0,8.3,5.98);
  const fuses:TransformNode[]=[],CUT=[-.7,0,.7];
  for(const x of CUT){
    const body=cyl('cutout body',m.porcelain,.07,.42,x,8.03,5.84);body.rotation.x=.22;
    const hinge=new TransformNode('fuse hinge',scene);hinge.parent=root;hinge.position.set(x,7.82,5.79);hinge.rotation.x=.22;
    cyl('fuse tube',mat('fuse tube','#5d3b2a',.3),.045,.44,0,.22,-.06,hinge);fuses.push(hinge);
    wire('drop to cutout',m.line,[new Vector3(PHASES[CUT.indexOf(x)],LINE_Y,LINE_Z),new Vector3(x,8.7,5.9),new Vector3(x,8.28,5.86)],.008);
    wire('cutout to bushing',m.line,[new Vector3(x,7.8,5.8),new Vector3(x*.4,7.6,5.6),new Vector3(x*.36,7.4,5.55)],.008);
  }
  const tank=new TransformNode('transformer',scene);tank.parent=root;tank.position.set(0,6.7,5.55);
  const tankMat=mat('transformer','#7f8f8c',.25);cast(cyl('transformer tank',tankMat,.88,1.15,0,0,0,tank));cyl('transformer lid',tankMat,.94,.06,0,.6,0,tank);
  for(const x of [-.25,0,.25]){cyl('hv bushing',m.brown,.07,.14,x,.69,0,tank);cyl('hv bushing top',m.brown,.1,.02,x,.73,0,tank);}
  for(const z of [-.12,0,.12])cyl('lv bushing',m.brown,.05,.1,.47,.25,z,tank).rotation.z=Math.PI/2;
  for(const y of [-.35,.35])box('transformer bracket',m.steel,.12,.1,.5,0,y,.32,tank);
  plane('nameplate',printed('nameplate',256,128,ctx=>{ctx.fillStyle='#d8dcd8';ctx.fillRect(0,0,256,128);ctx.fillStyle='#1d2a2f';ctx.textAlign='center';ctx.font='bold 26px sans-serif';ctx.fillText('TRANSFORMADOR',128,46);ctx.font='22px sans-serif';ctx.fillText('Trifásico · Red de distribución',128,86);},.35),.36,.18,0,-.15,-.448,tank);
  plane('danger sign',printed('danger sign',256,256,ctx=>{ctx.fillStyle='#f2c230';ctx.beginPath();ctx.moveTo(128,8);ctx.lineTo(248,226);ctx.lineTo(8,226);ctx.closePath();ctx.fill();ctx.strokeStyle='#111';ctx.lineWidth=10;ctx.stroke();ctx.fillStyle='#111';ctx.beginPath();ctx.moveTo(140,70);ctx.lineTo(100,150);ctx.lineTo(132,150);ctx.lineTo(112,206);ctx.lineTo(160,128);ctx.lineTo(128,128);ctx.closePath();ctx.fill();}),.45,.45,0,3.3,POLE_Z-.17);
  plane('danger text',printed('danger text',256,64,ctx=>{ctx.fillStyle='#f2c230';ctx.fillRect(0,0,256,64);ctx.fillStyle='#111';ctx.textAlign='center';ctx.font='bold 24px sans-serif';ctx.fillText('PELIGRO',128,28);ctx.font='bold 18px sans-serif';ctx.fillText('RIESGO ELÉCTRICO',128,54);}),.45,.11,0,2.98,POLE_Z-.17);
  const rod=cyl('ground rod',m.copper,.03,.4,.32,.2,POLE_Z-.3);

  // Line truck parked on the street, with an amber beacon.
  const truck=new TransformNode('truck',scene);truck.parent=root;truck.position.set(6.5,0,11.2);
  cast(box('truck bed',m.white,4.4,1.5,2.2,-.9,1.35,0,truck));cast(box('truck cab',m.white,1.8,1.7,2.2,2.2,1.45,0,truck));
  box('truck windscreen',m.glass,.05,.7,1.9,3.11,1.85,0,truck);box('truck side window',m.glass,1,.6,2.21,2.3,1.9,0,truck);
  box('truck stripe',m.orange,6.25,.16,2.22,.2,1.0,0,truck);box('truck bumper',m.dark,.2,.3,2.2,3.15,.6,0,truck);
  for(const x of [-2.3,1.9])for(const z of [-1,1]){const w=cyl('truck wheel',m.dark,.95,.32,x,.48,z,truck);w.rotation.x=Math.PI/2;}
  cast(box('boom base',m.steel,.6,.5,.6,-2.4,2.35,0,truck));const boom=box('boom',m.steel,3.6,.25,.3,-.7,2.65,0,truck);boom.rotation.z=-.05;
  box('bucket',mat('bucket','#f0f0ea',.2),.8,.8,.8,1.3,2.85,0,truck);
  const beaconMat=mat('beacon','#e8941e',.3);cyl('beacon',beaconMat,.22,.16,2.2,2.38,0,truck);

  // Interactive elements on a tarp: each keeps its own materials so it can pulse as a hint or be marked as done.
  const hot:Partial<Record<RuleAction,Hotspot>>={};
  const target=<T extends Mesh>(action:RuleAction,mesh:T,color:string)=>{const m2=mat('target '+action,color,.2);mesh.material=m2;mesh.isPickable=true;mesh.metadata={rule:action};(hot[action]??=({mats:[],done:false})).mats.push(m2);return cast(mesh);};
  const tarp=MeshBuilder.CreateGround('tarp',{width:6.4,height:1.7},scene);tarp.parent=root;tarp.position.set(0,.03,3.7);tarp.material=mat('tarp','#2f5d8a');tarp.receiveShadows=true;tarp.isPickable=false;
  /** Invisible pick volume over a kit, so thin tools are easy to hit with a mouse or a controller laser. */
  const grab=(action:RuleAction,parent:TransformNode,w:number,d:number)=>{const m2=new StandardMaterial('grab '+action,scene);m2.alpha=.001;m2.disableLighting=true;const g=box('grab '+action,m2,w,.5,d,0,.25,0,parent);g.isPickable=true;g.metadata={rule:action};return g;};
  const kit=(name:string,x:number)=>{const n=new TransformNode(name,scene);n.parent=root;n.position.set(x,.03,3.7);return n;};
  const ppe=kit('ppe',-2.6);grab('epp',ppe,.9,.9);
  const helmet=target('epp',MeshBuilder.CreateSphere('helmet',{diameter:.32,slice:.5,segments:16},scene),'#f2f2ec');helmet.parent=ppe;helmet.position.set(-.15,0,0);
  target('epp',box('glove',m.dark,.13,.05,.3,.22,.03,-.08,ppe),'#d4562a');target('epp',box('glove',m.dark,.13,.05,.3,.38,.03,.05,ppe),'#d4562a');
  const stick=kit('hot stick',-1.3);grab('abrir',stick,1.1,.9);
  const pole3=target('abrir',MeshBuilder.CreateCylinder('hot stick',{diameter:.045,height:3,tessellation:10},scene),'#e2b13c');pole3.parent=stick;pole3.rotation.z=Math.PI/2;pole3.rotation.y=-.35;pole3.position.set(.1,.06,0);
  const tagKit=kit('tag kit',-.15);grab('bloquear',tagKit,.8,.9);target('bloquear',box('tag case',m.dark,.34,.12,.24,0,.06,0,tagKit),'#c4473a');
  plane('tag preview',printed('tag small',128,192,ctx=>{ctx.fillStyle='#c4473a';ctx.fillRect(0,0,128,192);ctx.fillStyle='#fff';ctx.fillRect(8,8,112,176);ctx.fillStyle='#c4473a';ctx.textAlign='center';ctx.font='bold 22px sans-serif';ctx.fillText('PELIGRO',64,60);ctx.fillText('NO',64,100);ctx.fillText('OPERAR',64,130);}),.16,.24,0,.13,0,tagKit).rotation.x=Math.PI/2;
  const det=kit('detector',.9);grab('verificar',det,.8,.9);target('verificar',box('detector body',m.dark,.12,.1,.36,0,.05,0,det),'#f0c419');cyl('detector tip',m.dark,.03,.16,0,.05,.26,det).rotation.x=Math.PI/2;
  const detLamp=add(MeshBuilder.CreateSphere('detector lamp',{diameter:.06,segments:10},scene),mat('detector lamp','#4b5a5e'),0,.12,-.08,det);
  const gnd=kit('grounding kit',2.0);grab('tierra',gnd,.9,1);target('tierra',MeshBuilder.CreateTorus('grounding reel',{diameter:.42,thickness:.09,tessellation:24},scene),'#b8742f').parent=gnd;
  for(const x of [-.3,0,.3])target('tierra',box('ground clamp',m.dark,.08,.06,.14,x,.04,.38,gnd),'#7d8d93');
  const cones=kit('cones',3.0);grab('senalizar',cones,.6,.9);
  for(let i=0;i<3;i++){const cone=target('senalizar',MeshBuilder.CreateCylinder('cone',{diameterTop:.04,diameterBottom:.3,height:.5,tessellation:16},scene),'#ef6a1f');cone.parent=cones;cone.position.set(0,.25+i*.09,0);}
  label('label ppe','EPP',-2.6,.9,3.7,.6*1.5);label('label stick','PÉRTIGA',-1.3,.9,3.7,.75*1.5);label('label tag','TARJETA',-.15,.9,3.7,.75*1.5);
  label('label detector','DETECTOR',.9,.9,3.7,.8*1.3);label('label ground','PUESTA A TIERRA',2.0,1.25,3.7,1.1*1.3);label('label cones','CONOS',3.0,1.15,3.7,.65*1.5);

  // What each finished step leaves on the pole: tag, grounding cables, cones and tape.
  const tag=plane('lockout tag',printed('tag',128,192,ctx=>{ctx.fillStyle='#c4473a';ctx.fillRect(0,0,128,192);ctx.fillStyle='#fff';ctx.fillRect(8,8,112,176);ctx.fillStyle='#c4473a';ctx.textAlign='center';ctx.font='bold 22px sans-serif';ctx.fillText('PELIGRO',64,42);ctx.fillText('NO OPERAR',64,70);ctx.fillStyle='#17262e';ctx.font='15px sans-serif';ctx.fillText('Cuadrilla',64,112);ctx.fillText('trabajando',64,134);ctx.fillText('en la red',64,156);}),.3,.45,0,1.9,POLE_Z-.19);tag.isVisible=false;
  const groundCables=PHASES.map(x=>wire('grounding cable',m.copper,[new Vector3(x,LINE_Y-.03,LINE_Z-.05),new Vector3(x*.55,8.6,5.85),new Vector3(.28,5,5.97),new Vector3(.32,.42,POLE_Z-.3)],.014));
  const clamps=PHASES.map(x=>box('line clamp',m.dark,.07,.1,.07,x,LINE_Y-.06,LINE_Z-.05));
  const placedCones:Mesh[]=[],tape:Mesh[]=[];const tapeMat=printed('tape',256,16,ctx=>{for(let x=0;x<256;x+=32){ctx.fillStyle='#d23c2c';ctx.fillRect(x,0,16,16);ctx.fillStyle='#f4f4ee';ctx.fillRect(x+16,0,16,16);}},.5);
  const ring=[0,1,2,3,4,5].map(i=>{const a=i/6*Math.PI*2+.3;return new Vector3(Math.cos(a)*1.45,0,POLE_Z-.2+Math.sin(a)*1.25);});
  ring.forEach((p,i)=>{placedCones.push(cast(cyl('placed cone',mat('placed cone','#ef6a1f'),.3,.5,p.x,.25,p.z,root,.04)));const q=ring[(i+1)%6],len=Vector3.Distance(p,q),t=plane('tape',tapeMat,len,.06,(p.x+q.x)/2,.45,(p.z+q.z)/2);t.rotation.y=-Math.atan2(q.z-p.z,q.x-p.x);tape.push(t);});
  const showAll=(meshes:Mesh[],visible:boolean)=>{for(const mesh of meshes)mesh.isVisible=visible;};
  showAll(groundCables,false);showAll(clamps,false);showAll(placedCones,false);showAll(tape,false);

  // Arc flash: a light, a glowing core, sparks and a scorch mark at the middle phase.
  const glow=new GlowLayer('arc glow',scene,{mainTextureSamples:2});glow.intensity=1.4;
  const flashMat=new StandardMaterial('arc core',scene);flashMat.emissiveColor=hex('#cfe6ff');flashMat.disableLighting=true;
  const flash=add(MeshBuilder.CreateSphere('arc core',{diameter:.5,segments:12},scene),flashMat,0,LINE_Y-.05,LINE_Z-.08);flash.isVisible=false;glow.addIncludedOnlyMesh(flash);
  const scorch=add(MeshBuilder.CreateSphere('scorch',{diameter:.09,segments:8},scene),mat('scorch','#111'),0,LINE_Y-.04,LINE_Z-.03);scorch.isVisible=false;
  const arcLight=new PointLight('arc light',new Vector3(0,LINE_Y-.1,LINE_Z-.3),scene);arcLight.diffuse=hex('#d8ecff');arcLight.intensity=0;arcLight.range=40;
  const spark=new DynamicTexture('spark',{width:64,height:64},scene,true);{const ctx=spark.getContext() as CanvasRenderingContext2D,g=ctx.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,214,140,.9)');g.addColorStop(1,'rgba(255,140,40,0)');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);spark.hasAlpha=true;spark.update();}
  const sparks=new ParticleSystem('arc sparks',400,scene);sparks.particleTexture=spark;sparks.emitter=new Vector3(0,LINE_Y-.05,LINE_Z-.08);
  sparks.minEmitBox=new Vector3(-.05,-.05,-.05);sparks.maxEmitBox=new Vector3(.05,.05,.05);sparks.color1=new Color4(1,.95,.8,1);sparks.color2=new Color4(1,.6,.2,1);sparks.colorDead=new Color4(.4,.1,0,0);
  sparks.minSize=.03;sparks.maxSize=.09;sparks.minLifeTime=.4;sparks.maxLifeTime=1.3;sparks.emitRate=0;sparks.manualEmitCount=0;sparks.gravity=new Vector3(0,-9.8,0);
  sparks.direction1=new Vector3(-3,2,-3);sparks.direction2=new Vector3(3,4,1);sparks.minEmitPower=1;sparks.maxEmitPower=4;sparks.blendMode=ParticleSystem.BLENDMODE_ADD;sparks.start();

  // Step board on a stand to the left, facing the user.
  const stand=new TransformNode('board stand',scene);stand.parent=root;stand.position.set(-7,0,3.2);stand.rotation.y=-.75;
  const boardY=2.4,boardTexture=new DynamicTexture('rules board',{width:BOARD.pxW,height:BOARD.pxH},scene,true);
  const boardMat=new StandardMaterial('rules board',scene);boardMat.diffuseTexture=boardTexture;boardMat.emissiveTexture=boardTexture;boardMat.emissiveColor=new Color3(.75,.75,.75);boardMat.specularColor=Color3.Black();
  for(const x of [-1.5,1.5])cast(box('board leg',m.steel,.08,boardY,.08,x,boardY/2,.06,stand));
  box('board frame',m.dark,BOARD.w+.1,BOARD.h+.1,.06,0,boardY,.04,stand);plane('rules board',boardMat,BOARD.w,BOARD.h,0,boardY,0,stand);
  const overlay=(action:Target,px:number,py:number,pw:number,ph:number)=>{
    const m2=new StandardMaterial('overlay '+action,scene);m2.alpha=.01;m2.disableLighting=true;
    const p=plane('board button '+action,m2,pw/BOARD.pxW*BOARD.w,ph/BOARD.pxH*BOARD.h,(px+pw/2-BOARD.pxW/2)/BOARD.pxW*BOARD.w,boardY+(BOARD.pxH/2-py-ph/2)/BOARD.pxH*BOARD.h,-.01,stand);p.metadata={rule:action};p.isPickable=true;
  };
  overlay('hint',40,538,230,64);overlay('reset',290,538,230,64);
  const wrap=(ctx:CanvasRenderingContext2D,value:string,x:number,y:number,width:number,line:number)=>{let row='';for(const word of value.split(' ')){const test=row?row+' '+word:word;if(ctx.measureText(test).width>width&&row){ctx.fillText(row,x,y);row=word;y+=line;}else row=test;}ctx.fillText(row,x,y);};
  const drawBoard=(state:RuleState,message:string,hint:boolean,summary:string|null)=>{
    const ctx=boardTexture.getContext() as CanvasRenderingContext2D,next=nextStep(state);
    ctx.fillStyle='#10252d';ctx.fillRect(0,0,BOARD.pxW,BOARD.pxH);ctx.textAlign='left';
    ctx.fillStyle='#edc76d';ctx.font='bold 32px sans-serif';ctx.fillText('LAS CINCO REGLAS DE ORO · POSTE CON TRANSFORMADOR',40,56);
    ctx.fillStyle='#8fb5a8';ctx.font='20px sans-serif';ctx.fillText('Contenido didáctico de demostración: validar con el RETIE y los procedimientos de ESSA.',40,90);
    ruleSteps.forEach((step,i)=>{
      const y=150+i*60,done=state.done.includes(step.id),current=!state.arc&&next?.id===step.id;
      if(current){ctx.fillStyle='#1f4a52';ctx.fillRect(30,y-36,530,54);}
      ctx.strokeStyle=done?'#7ed6a0':current?'#edc76d':'#5b7a80';ctx.lineWidth=4;ctx.beginPath();ctx.arc(62,y-9,16,0,7);ctx.stroke();
      ctx.fillStyle=done?'#7ed6a0':current?'#edc76d':'#9fb8b3';ctx.font='bold 24px sans-serif';ctx.fillText(done?'✓':i?String(i):'·',done?52:i?55:58,y);
      ctx.font=(current?'bold ':'')+'25px sans-serif';ctx.fillText(step.title,100,y);
    });
    ctx.fillStyle=state.arc?'#5a1c17':'#17333b';ctx.fillRect(580,120,404,380);
    ctx.fillStyle=state.arc?'#ffb4a6':'#dfe9e5';ctx.font='bold 26px sans-serif';ctx.fillText(state.arc?'⚡ ARCO ELÉCTRICO':state.finished?'¡Práctica completa!':next?(next.id==='epp'?'Antes de empezar':`Regla ${state.done.length}`):'',600,160);
    ctx.font=state.arc?'21px sans-serif':'24px sans-serif';ctx.fillStyle=state.arc?'#f6d6cf':'#c7d8d3';wrap(ctx,state.arc?message.replace('¡Arco eléctrico! ',''):state.finished?(summary??message):next?(hint?next.task:message):message,600,204,364,state.arc?29:34);
    ctx.fillStyle=state.errors?'#efac87':'#8fb5a8';ctx.font='bold 24px sans-serif';ctx.fillText(`Errores: ${state.errors}`,600,482);
    for(const [x,label,on] of [[40,'Pista',hint],[290,'Reiniciar',state.arc]] as const){ctx.fillStyle=on?'#edc76d':'#2c5a62';ctx.fillRect(x,538,230,64);ctx.fillStyle=on?'#17262e':'#dfe9e5';ctx.font='bold 28px sans-serif';ctx.textAlign='center';ctx.fillText(label,x+115,580);ctx.textAlign='left';}
    boardTexture.update();
  };

  // Animated state, eased in tick().
  let open=0,openGoal=0,hintOn=false,hintAction:RuleAction|null=null,clock=0,arcTime=-1,verified=false;
  const ppeItems=ppe.getChildMeshes() as Mesh[];
  return {
    floor,
    update(state,message,hint,summary){
      const has=(id:RuleAction)=>state.done.includes(id);
      openGoal=has('abrir')?1:0;tag.isVisible=has('bloquear');verified=has('verificar');showAll(ppeItems,!has('epp'));
      showAll(groundCables,has('tierra')||state.arc);showAll(clamps,has('tierra')||state.arc);showAll(placedCones,has('senalizar'));showAll(tape,has('senalizar'));
      scorch.isVisible=state.arc;if(!state.arc){arcTime=-1;flash.isVisible=false;arcLight.intensity=0;}
      hintOn=hint&&!state.arc;hintAction=nextStep(state)?.id??null;
      for(const id of Object.keys(hot) as RuleAction[])hot[id]!.done=has(id);
      drawBoard(state,message,hint,summary);
    },
    arc(){arcTime=0;sparks.manualEmitCount=320;},
    tick(seconds){
      clock+=seconds;open+=(openGoal-open)*Math.min(1,4*seconds);
      for(const fuse of fuses)fuse.rotation.x=.22-open*2.2;
      beaconMat.emissiveColor=Math.sin(clock*7)>.2?hex('#c46a10'):Color3.Black();
      (detLamp.material as StandardMaterial).emissiveColor=verified?hex('#2fae55'):Color3.Black();
      if(arcTime>=0){
        arcTime+=seconds;const live=arcTime<1.1,flicker=live?.55+.45*Math.random():0;
        flash.isVisible=live;flash.scaling.setAll(1+flicker*1.6);arcLight.intensity=live?60*flicker:Math.max(0,arcLight.intensity-seconds*80);
      }
      for(const id of Object.keys(hot) as RuleAction[]){const h=hot[id]!;
        const pulse=hintOn&&hintAction===id?.35+.35*Math.sin(clock*6):0;
        for(const m2 of h.mats)m2.emissiveColor=pulse?new Color3(pulse,pulse*.8,0):h.done?new Color3(0,.25,.12):Color3.Black();}
    },
  };
}
