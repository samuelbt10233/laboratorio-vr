import { Color3, Color4, DirectionalLight, DynamicTexture, GlowLayer, Mesh, MeshBuilder, ParticleSystem, PointLight, Scene, ShadowGenerator, StandardMaterial, TransformNode, Vector3 } from '@babylonjs/core';
import { fuseOpen, nextStep, type SwitchAction, type SwitchState } from './procedure';
export interface CutoutScene {update(state:SwitchState,hint:boolean):void;spark(phase:number):void;tick(seconds:number):void}
const hex=(value:string)=>Color3.FromHexString(value);
const POLE_Z=6.2,LINE_Y=9.47,LINE_Z=6.05,PHASES=[-1,0,1],CUT=[-.7,0,.7],FUSE_Y=7.82,FUSE_Z=5.79;
/** Seeded so the street looks the same on every load. */
function random(seed:number){return ()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};}
/** Street, pole and transformer for the cutout maneuver; the user looks towards +z. Decoration and animation only: the order lives in procedure.ts. */
export function buildCutoutScene(scene:Scene):CutoutScene{
  const root=new TransformNode('street',scene),rand=random(11);
  scene.clearColor=new Color4(.72,.82,.9,1);scene.fogMode=Scene.FOGMODE_EXP2;scene.fogDensity=.012;scene.fogColor=new Color3(.72,.82,.9);
  const sun=new DirectionalLight('sun',new Vector3(-.45,-1,.55),scene);sun.position=new Vector3(12,30,-10);sun.intensity=1.15;sun.diffuse=hex('#fff4e0');
  const shadows=new ShadowGenerator(1024,sun);shadows.usePercentageCloserFiltering=true;shadows.bias=.002;
  const cast=<T extends Mesh>(mesh:T)=>{shadows.addShadowCaster(mesh);return mesh;};
  const mat=(name:string,color:string,shine=0)=>{const m=new StandardMaterial(name,scene);m.diffuseColor=hex(color);m.specularColor=new Color3(shine,shine,shine);return m;};
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
  const label=(name:string,value:string,x:number,y:number,z:number,w=.9)=>{const p=plane(name,printed(name,256,64,ctx=>{ctx.fillStyle='rgba(16,37,45,.88)';ctx.beginPath();ctx.roundRect(0,0,256,64,14);ctx.fill();ctx.fillStyle='#f6f8f4';ctx.textAlign='center';let size=28;do ctx.font=`bold ${size--}px sans-serif`;while(ctx.measureText(value).width>232&&size>10);ctx.fillText(value,128,42);},.95),w,w/4,x,y,z);p.billboardMode=Mesh.BILLBOARDMODE_Y;return p;};
  const m={concrete:rough('pole concrete','#a3a39b',['#8a8a82','#bdbdb4','#77776f'],1),steel:mat('galvanized','#9aa4a6',.35),porcelain:mat('porcelain','#d9d6cc',.5),brown:mat('glazed','#6b3a26',.4),line:mat('aluminium line','#5f6668',.4),dark:mat('dark','#2a3236'),stick:mat('hot stick','#e2b13c',.3)};

  // Ground: grass verge, sidewalk with the pole, street and houses beyond.
  const floor=MeshBuilder.CreateGround('grass',{width:140,height:40},scene);floor.parent=root;floor.position.set(0,0,-12);floor.material=rough('grass','#6f8a4a',['#5b7639','#86a05c','#4e6a31'],30);floor.receiveShadows=true;
  const walk=MeshBuilder.CreateGround('sidewalk',{width:140,height:4},scene);walk.parent=root;walk.position.set(0,.02,6);walk.material=rough('sidewalk','#b8b4a8',['#a19d92','#cbc7bb'],35);walk.receiveShadows=true;
  box('kerb',m.concrete,140,.16,.25,0,.08,8.1);
  const road=MeshBuilder.CreateGround('street',{width:140,height:8},scene);road.parent=root;road.position.set(0,.01,12.2);road.material=rough('asphalt','#45474a',['#3a3c3f','#55585b','#2f3133'],40);road.receiveShadows=true;
  const paint=mat('road paint','#e9e3c8');for(let x=-66;x<70;x+=6)box('lane dash',paint,3,.01,.14,x,.02,12.2);
  const facades=['#e8d9b5','#d98c5f','#9fb7a5','#e6e1d6','#c7a27c','#b9c4cf'];
  for(let i=0;i<9;i++){
    const x=-36+i*9,w=7.5+rand()*1.2,h=5.2+rand()*2.4,house=new TransformNode('house',scene);house.parent=root;house.position.set(x,0,22);
    cast(box('house body',mat('facade '+i,facades[i%facades.length]),w,h,6,0,h/2,0,house));
    box('house roof',mat('roof '+i,i%2?'#8c4a32':'#6d6a66'),w+.4,.3,6.6,0,h+.15,0,house);box('house door',mat('door '+i,'#5a3d2b'),1.1,2.1,.1,w*.3,1.05,-3.02,house);
  }

  // Pole, line and three cutouts feeding the transformer.
  cast(cyl('pole',m.concrete,.36,9.6,0,4.8,POLE_Z,root,.22));cast(box('crossarm',m.steel,2.5,.1,.1,0,9.2,LINE_Z));
  for(const x of PHASES){cyl('insulator',m.porcelain,.12,.2,x,9.35,LINE_Z);for(const y of [9.3,9.37])cyl('insulator skirt',m.porcelain,.18,.025,x,y,LINE_Z);}
  for(const x of PHASES)wire('line conductor',m.line,[new Vector3(x,LINE_Y,-26),new Vector3(x,LINE_Y-.45,-10),new Vector3(x,LINE_Y,LINE_Z),new Vector3(x,LINE_Y-.2,12.8),new Vector3(x,LINE_Y,19.5)],.014);
  box('cutout arm',m.steel,1.9,.08,.08,0,8.3,5.98);
  const fuses:TransformNode[]=[],fuseMats:StandardMaterial[]=[];
  CUT.forEach((x,i)=>{
    const body=cyl('cutout body',m.porcelain,.07,.42,x,8.03,5.84);body.rotation.x=.22;
    const hinge=new TransformNode('fuse hinge',scene);hinge.parent=root;hinge.position.set(x,FUSE_Y,FUSE_Z);hinge.rotation.x=.22;
    const fm=mat('fuse tube '+i,'#5d3b2a',.3);fuseMats.push(fm);cyl('fuse tube',fm,.05,.44,0,.22,-.06,hinge);fuses.push(hinge);
    wire('drop to cutout',m.line,[new Vector3(PHASES[i],LINE_Y,LINE_Z),new Vector3(x,8.7,5.9),new Vector3(x,8.28,5.86)],.008);
    wire('cutout to bushing',m.line,[new Vector3(x,7.8,5.8),new Vector3(x*.4,7.6,5.6),new Vector3(x*.36,7.4,5.55)],.008);
    // Thin fuse tubes are hard to hit: an invisible volume around each cutout takes the pick.
    const grab=new StandardMaterial('grab fuse '+i,scene);grab.alpha=.001;grab.disableLighting=true;
    const g=box('grab fuse',grab,.5,.8,.4,x,8,5.8);g.isPickable=true;g.metadata={cutout:`fase-${i+1}`};
    label('phase label',`L${i+1}`,x,8.75,5.6,.42);
  });
  const tank=new TransformNode('transformer',scene);tank.parent=root;tank.position.set(0,6.7,5.55);
  const tankMat=mat('transformer','#7f8f8c',.25);cast(cyl('transformer tank',tankMat,.88,1.15,0,0,0,tank));cyl('transformer lid',tankMat,.94,.06,0,.6,0,tank);
  for(const x of [-.25,0,.25])cyl('hv bushing',m.brown,.07,.14,x,.69,0,tank);
  for(const y of [-.35,.35])box('transformer bracket',m.steel,.12,.1,.5,0,y,.32,tank);

  // Windsock on a mast to the right: the wind blows from L3 towards L1.
  cyl('wind mast',m.steel,.06,5.2,3.4,2.6,6.4);
  const sock=cyl('windsock',printed('windsock',256,64,ctx=>{for(let x=0;x<256;x+=64){ctx.fillStyle='#ef6a1f';ctx.fillRect(x,0,32,64);ctx.fillStyle='#f4f4ee';ctx.fillRect(x+32,0,32,64);}},.4),.34,1.1,2.85,5.05,6.4,root,.16);sock.rotation.z=Math.PI/2+.12;
  label('wind label','VIENTO',3.4,5.6,6.3,.8);

  // Kit on a tarp and two places to stand: under the cutouts or beside them.
  const tarp=MeshBuilder.CreateGround('tarp',{width:4.6,height:1.5},scene);tarp.parent=root;tarp.position.set(-2.2,.03,3.7);tarp.material=mat('tarp','#2f5d8a');tarp.receiveShadows=true;
  const hot:Partial<Record<SwitchAction,StandardMaterial[]>>={};
  const target=<T extends Mesh>(action:SwitchAction,mesh:T,color:string)=>{const m2=mat('target '+action,color,.2);mesh.material=m2;mesh.isPickable=true;mesh.metadata={cutout:action};(hot[action]??=[]).push(m2);return cast(mesh);};
  const kit=(name:string,action:SwitchAction,x:number,w:number)=>{const n=new TransformNode(name,scene);n.parent=root;n.position.set(x,.03,3.7);const m2=new StandardMaterial('grab '+name,scene);m2.alpha=.001;m2.disableLighting=true;const g=box('grab '+name,m2,w,.5,.9,0,.25,0,n);g.isPickable=true;g.metadata={cutout:action};return n;};
  const order=kit('order','orden',-3.8,.8);target('orden',box('clipboard',m.dark,.34,.04,.46,0,.03,0,order),'#f4f1e6');
  plane('order sheet',printed('order sheet',128,176,ctx=>{ctx.fillStyle='#fff';ctx.fillRect(0,0,128,176);ctx.fillStyle='#17262e';ctx.font='bold 18px sans-serif';ctx.fillText('ORDEN DE',10,30);ctx.fillText('MANIOBRA',10,52);ctx.fillStyle='#8a979b';for(let y=78;y<170;y+=18)ctx.fillRect(10,y,104,5);}),.3,.42,0,.055,0,order).rotation.x=Math.PI/2;
  const ppe=kit('ppe','epp',-2.6,.9);
  const helmet=target('epp',MeshBuilder.CreateSphere('helmet',{diameter:.32,slice:.5,segments:16},scene),'#f2f2ec');helmet.parent=ppe;helmet.position.set(-.15,0,0);
  target('epp',box('face shield',m.dark,.26,.02,.2,.25,.04,-.18,ppe),'#9fc4d8');target('epp',box('glove',m.dark,.13,.05,.3,.3,.03,.14,ppe),'#d4562a');
  const stickKit=kit('stick kit','pertiga',-1.1,1.6);
  const looseStick=target('pertiga',MeshBuilder.CreateCylinder('hot stick',{diameter:.05,height:3,tessellation:10},scene),'#e2b13c');looseStick.parent=stickKit;looseStick.rotation.z=Math.PI/2;looseStick.rotation.y=-.2;looseStick.position.set(0,.06,0);
  label('label order','ORDEN',-3.8,.9,3.7,.9);label('label ppe','EPP',-2.6,.9,3.7,.9);label('label stick','PÉRTIGA',-1.1,.9,3.7,1.1);
  const spot=(action:SwitchAction,name:string,x:number,z:number,color:string)=>{const d=MeshBuilder.CreateDisc(name,{radius:.45,tessellation:32},scene);d.rotation.x=Math.PI/2;target(action,add(d,m.dark,x,.05,z),color);label('label '+name,name==='under'?'BAJO EL EJE':'A UN LADO',x,.75,z,1.1);};
  spot('debajo','under',0,5.25,'#c9a227');spot('posicion','side',2.1,4.5,'#c9a227');

  // Lineman who appears at the safe spot, and the hot stick he raises to the fuse being operated.
  const worker=new TransformNode('lineman',scene);worker.parent=root;worker.position.set(2.1,0,4.5);
  const suit=mat('coverall','#2c4e7a');cast(cyl('body',suit,.42,1.1,0,1.05,0,worker,.36));cast(cyl('legs',suit,.38,.6,0,.3,0,worker,.38));
  add(MeshBuilder.CreateSphere('head',{diameter:.26,segments:12},scene),mat('skin','#c58c64'),0,1.75,0,worker);
  add(MeshBuilder.CreateSphere('helmet on',{diameter:.3,slice:.5,segments:12},scene),mat('helmet on','#f2f2ec'),0,1.82,0,worker);
  const reach=new TransformNode('stick pivot',scene);reach.parent=root;reach.position.set(1.9,1.3,4.4);
  const raised=cyl('raised stick',m.stick,.09,1,0,0,.5,reach);m.stick.emissiveColor=hex('#6b5214');raised.rotation.x=Math.PI/2;
  const showWorker=(on:boolean)=>{for(const mesh of worker.getChildMeshes())mesh.isVisible=on;raised.isVisible=on;};

  // Arc flash at a fuse: light, glowing core and sparks.
  const glow=new GlowLayer('arc glow',scene,{mainTextureSamples:2});glow.intensity=1.3;
  const flashMat=new StandardMaterial('arc core',scene);flashMat.emissiveColor=hex('#cfe6ff');flashMat.disableLighting=true;
  const flash=add(MeshBuilder.CreateSphere('arc core',{diameter:.35,segments:12},scene),flashMat,0,8.1,5.8);flash.isVisible=false;glow.addIncludedOnlyMesh(flash);
  const arcLight=new PointLight('arc light',new Vector3(0,8,5.4),scene);arcLight.diffuse=hex('#d8ecff');arcLight.intensity=0;arcLight.range=30;
  const sparkTexture=new DynamicTexture('spark',{width:64,height:64},scene,true);{const ctx=sparkTexture.getContext() as CanvasRenderingContext2D,g=ctx.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,214,140,.9)');g.addColorStop(1,'rgba(255,140,40,0)');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);sparkTexture.hasAlpha=true;sparkTexture.update();}
  const emitter=new Vector3(0,8.1,5.8),sparks=new ParticleSystem('arc sparks',300,scene);sparks.particleTexture=sparkTexture;sparks.emitter=emitter;
  sparks.minEmitBox=new Vector3(-.04,-.04,-.04);sparks.maxEmitBox=new Vector3(.04,.04,.04);sparks.color1=new Color4(1,.95,.8,1);sparks.color2=new Color4(1,.6,.2,1);sparks.colorDead=new Color4(.4,.1,0,0);
  sparks.minSize=.03;sparks.maxSize=.08;sparks.minLifeTime=.4;sparks.maxLifeTime=1.2;sparks.emitRate=0;sparks.manualEmitCount=0;sparks.gravity=new Vector3(0,-9.8,0);
  sparks.direction1=new Vector3(-2,1,-3);sparks.direction2=new Vector3(2,3,1);sparks.minEmitPower=1;sparks.maxEmitPower=3.5;sparks.blendMode=ParticleSystem.BLENDMODE_ADD;sparks.start();

  const open=[0,0,0],openGoal=[0,0,0];let aim=1,hintOn=false,hintAction:SwitchAction|null=null,clock=0,arcTime=-1;
  const pointAt=(phase:number)=>{reach.lookAt(new Vector3(CUT[phase],FUSE_Y+.2,FUSE_Z-.1));raised.scaling.y=Vector3.Distance(reach.position,new Vector3(CUT[phase],FUSE_Y+.2,FUSE_Z-.1));raised.position.z=raised.scaling.y/2;};
  const actionFor=(state:SwitchState):SwitchAction|null=>{const id=nextStep(state)?.id;return !id?null:id.includes('-')?`fase-${id.slice(-1)}` as SwitchAction:id as SwitchAction;};
  return {
    update(state,hint){
      const has=(id:string)=>state.done.includes(id as never);
      [1,2,3].forEach((p,i)=>{openGoal[i]=fuseOpen(state,p)?1:0;});
      for(const mesh of ppe.getChildMeshes())mesh.isVisible=!has('epp');looseStick.isVisible=!has('posicion');
      showWorker(has('posicion'));
      const next=nextStep(state)?.id;if(next?.includes('-'))aim=Number(next.slice(-1))-1;pointAt(aim);
      hintOn=hint;hintAction=actionFor(state);
    },
    spark(phase){emitter.set(CUT[phase-1],8.1,5.8);flash.position.set(CUT[phase-1],8.1,5.75);arcLight.position.set(CUT[phase-1],8,5.4);arcTime=0;sparks.manualEmitCount=220;},
    tick(seconds){
      clock+=seconds;
      fuses.forEach((fuse,i)=>{open[i]+=(openGoal[i]-open[i])*Math.min(1,4*seconds);fuse.rotation.x=.22-open[i]*2.2;});
      if(arcTime>=0){arcTime+=seconds;const live=arcTime<.8,flicker=live?.55+.45*Math.random():0;flash.isVisible=live;flash.scaling.setAll(1+flicker*1.4);arcLight.intensity=live?45*flicker:0;if(!live)arcTime=-1;}
      const pulse=(action:SwitchAction)=>hintOn&&hintAction===action?.35+.35*Math.sin(clock*6):0;
      for(const id of Object.keys(hot) as SwitchAction[]){const p=pulse(id);for(const m2 of hot[id]!)m2.emissiveColor=p?new Color3(p,p*.8,0):Color3.Black();}
      fuseMats.forEach((fm,i)=>{const p=pulse(`fase-${i+1}` as SwitchAction);fm.emissiveColor=p?new Color3(p,p*.8,0):Color3.Black();});
    },
  };
}
