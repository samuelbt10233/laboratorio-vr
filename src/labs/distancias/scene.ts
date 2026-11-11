import { Color3, Color4, DirectionalLight, DynamicTexture, GlowLayer, Mesh, MeshBuilder, ParticleSystem, PointLight, Scene, ShadowGenerator, StandardMaterial, TransformNode, Vector3 } from '@babylonjs/core';
import { nextStep, type DistanceAction, type DistanceState } from './procedure';
export interface DistanceScene {update(state:DistanceState,hint:boolean):void;preview(action:'pos-a'|'pos-c',invasion:boolean):void;tick(seconds:number):void}
const hex=(value:string)=>Color3.FromHexString(value);
const POLE_Z=6.2,LINE_Y=9.47,PHASES=[-1,0,1];
// Illustrative zone sizes for the demo, not RETIE values.
const DANGER_D=1.6,PROXIMITY_D=4.4;
const BOOM_BASE=new Vector3(3.4,2.5,11.2),HOME=new Vector3(4.6,3.1,11.2);
const POSITIONS={'pos-a':new Vector3(.45,8.95,6.6),'pos-b':new Vector3(1.0,6.3,6.7),'pos-c':new Vector3(3.4,4.6,9.0)};
function random(seed:number){return ()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};}
/** A street pole under an energized line, a bucket truck and the zones around the conductors. Decoration and animation only: the order lives in procedure.ts. */
export function buildDistanceScene(scene:Scene):DistanceScene{
  const root=new TransformNode('street',scene),rand=random(17);
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
  const wire=(name:string,m:StandardMaterial,points:Vector3[],radius=.012)=>{const t=MeshBuilder.CreateTube(name,{path:points,radius,tessellation:8},scene);t.parent=root;t.material=m;t.isPickable=false;return t;};
  const label=(name:string,value:string,x:number,y:number,z:number,w=.9,bg='rgba(16,37,45,.88)')=>{const p=add(MeshBuilder.CreatePlane(name,{width:w,height:w/4},scene),printed(name,256,64,ctx=>{ctx.fillStyle=bg;ctx.beginPath();ctx.roundRect(0,0,256,64,14);ctx.fill();ctx.fillStyle='#f6f8f4';ctx.textAlign='center';let size=28;do ctx.font=`bold ${size--}px sans-serif`;while(ctx.measureText(value).width>232&&size>10);ctx.fillText(value,128,42);},.95),x,y,z);p.billboardMode=Mesh.BILLBOARDMODE_ALL;return p;};
  const invisible=(name:string)=>{const m=new StandardMaterial(name,scene);m.alpha=.001;m.disableLighting=true;return m;};
  const pick=<T extends Mesh>(mesh:T,action:DistanceAction)=>{mesh.isPickable=true;mesh.metadata={distance:action};return mesh;};
  const m={concrete:rough('pole concrete','#a3a39b',['#8a8a82','#bdbdb4','#77776f'],1),steel:mat('galvanized','#9aa4a6',.35),porcelain:mat('porcelain','#d9d6cc',.5),line:mat('aluminium line','#5f6668',.4),dark:mat('dark','#2a3236'),white:mat('truck white','#eceeec',.15),orange:mat('orange','#e0702a'),glass:mat('glass','#3b4b55',.6)};

  // Ground, street and houses.
  const floor=MeshBuilder.CreateGround('grass',{width:140,height:40},scene);floor.parent=root;floor.position.set(0,0,-12);floor.material=rough('grass','#6f8a4a',['#5b7639','#86a05c','#4e6a31'],30);floor.receiveShadows=true;
  const walk=MeshBuilder.CreateGround('sidewalk',{width:140,height:4},scene);walk.parent=root;walk.position.set(0,.02,6);walk.material=rough('sidewalk','#b8b4a8',['#a19d92','#cbc7bb'],35);walk.receiveShadows=true;
  box('kerb',m.concrete,140,.16,.25,0,.08,8.1);
  const road=MeshBuilder.CreateGround('street',{width:140,height:8},scene);road.parent=root;road.position.set(0,.01,12.2);road.material=rough('asphalt','#45474a',['#3a3c3f','#55585b','#2f3133'],40);road.receiveShadows=true;
  const paint=mat('road paint','#e9e3c8');for(let x=-66;x<70;x+=6)box('lane dash',paint,3,.01,.14,x,.02,12.2);
  const facades=['#e8d9b5','#d98c5f','#9fb7a5','#e6e1d6','#c7a27c','#b9c4cf'];
  for(let i=0;i<9;i++){const x=-36+i*9,w=7.5+rand()*1.2,h=5.2+rand()*2.4,house=new TransformNode('house',scene);house.parent=root;house.position.set(x,0,22);cast(box('house body',mat('facade '+i,facades[i%facades.length]),w,h,6,0,h/2,0,house));box('house roof',mat('roof '+i,i%2?'#8c4a32':'#6d6a66'),w+.4,.3,6.6,0,h+.15,0,house);}

  // Pole, energized line and the streetlight bracket.
  cast(cyl('pole',m.concrete,.36,9.6,0,4.8,POLE_Z,root,.22));cast(box('crossarm',m.steel,2.5,.1,.1,0,9.2,POLE_Z-.15));
  for(const x of PHASES){cyl('insulator',m.porcelain,.12,.2,x,9.35,POLE_Z-.15);wire('line conductor',m.line,[new Vector3(x,LINE_Y,-26),new Vector3(x,LINE_Y-.45,-10),new Vector3(x,LINE_Y,POLE_Z-.15),new Vector3(x,LINE_Y-.2,12.8),new Vector3(x,LINE_Y,19.5)],.016);}
  const linePick=pick(box('line pick',invisible('line pick'),3,1,9,0,LINE_Y-.1,4.5),'linea');
  const lineLabel=label('line label','RED ENERGIZADA',-1.9,LINE_Y+.75,4.3,1.1,'rgba(179,38,30,.9)');
  const arm=box('lamp arm',m.steel,.08,.08,1,0,7.3,POLE_Z+.55);arm.rotation.x=-.15;
  const lampMat=mat('lamp','#cfd5d8',.4),lamp=cast(box('lamp head',lampMat,.28,.1,.5,0,7.35,POLE_Z+1.15));lamp.isVisible=false;
  const ghostMat=mat('lamp ghost','#edc76d');ghostMat.alpha=.35;const ghost=add(MeshBuilder.CreateBox('lamp ghost',{width:.3,height:.12,depth:.52},scene),ghostMat,0,7.35,POLE_Z+1.15);pick(ghost,'luminaria');
  pick(box('lamp pick',invisible('lamp pick'),.8,.6,1,0,7.35,POLE_Z+1.1),'luminaria');
  const lampLight=new PointLight('lamp light',new Vector3(0,7.1,POLE_Z+1.15),scene);lampLight.diffuse=hex('#fff1c4');lampLight.intensity=0;lampLight.range=8;

  // Zones around each conductor, shown once the line is identified. Illustrative scale.
  const zone=(name:string,color:string,alpha:number,d:number)=>{const zm=mat(name,color);zm.alpha=alpha;zm.emissiveColor=hex(color).scale(.5);zm.backFaceCulling=false;
    return PHASES.map(x=>{const t=add(MeshBuilder.CreateCylinder(name,{diameter:d,height:5,tessellation:32},scene),zm,x,LINE_Y,6.8);t.rotation.x=Math.PI/2;t.isVisible=false;return t;});};
  const proximity=zone('proximity zone','#f2c230',.09,PROXIMITY_D),danger=zone('danger zone','#d23c2c',.22,DANGER_D);
  const zoneLabels=[label('danger label','ZONA DE PELIGRO',-2.2,LINE_Y+.2,4.3,1.1,'rgba(179,38,30,.9)'),label('proximity label','ZONA DE PROXIMIDAD',-2.9,LINE_Y-1.6,4.3,1.2,'rgba(140,110,10,.92)'),label('scale label','Escala ilustrativa',-2.9,LINE_Y-1.95,4.3,.9)];
  for(const l of zoneLabels)l.isVisible=false;

  // Bucket truck, its boom and the bucket with the lineman.
  const truck=new TransformNode('truck',scene);truck.parent=root;truck.position.set(4.4,0,11.2);
  cast(box('truck bed',m.white,4.4,1.5,2.2,-.9,1.35,0,truck));cast(box('truck cab',m.white,1.8,1.7,2.2,2.2,1.45,0,truck));
  box('truck windscreen',m.glass,.05,.7,1.9,3.11,1.85,0,truck);box('truck stripe',m.orange,6.25,.16,2.22,.2,1.0,0,truck);
  for(const x of [-2.3,1.9])for(const z of [-1,1]){const w=cyl('truck wheel',m.dark,.95,.32,x,.48,z,truck);w.rotation.x=Math.PI/2;}
  cast(box('boom base',m.steel,.6,.5,.6,-1,2.25,0,truck));
  const boomPivot=new TransformNode('boom pivot',scene);boomPivot.parent=root;boomPivot.position.copyFrom(BOOM_BASE);
  const boom=cast(add(MeshBuilder.CreateBox('boom',{width:.26,height:.22,depth:1},scene),m.steel,0,0,.5,boomPivot));
  const bucket=new TransformNode('bucket',scene);bucket.parent=root;bucket.position.copyFrom(HOME);
  cast(box('bucket body',mat('bucket','#f0f0ea',.2),.7,.75,.7,0,0,0,bucket));
  const suit=mat('coverall','#2c4e7a');cast(cyl('lineman',suit,.34,.6,0,.62,0,bucket,.3));add(MeshBuilder.CreateSphere('head',{diameter:.24,segments:12},scene),mat('skin','#c58c64'),0,1.04,0,bucket);
  add(MeshBuilder.CreateSphere('helmet',{diameter:.28,slice:.5,segments:12},scene),mat('helmet','#f2f2ec'),0,1.1,0,bucket);
  const spots:Record<string,Mesh>={};
  for(const [id,p] of Object.entries(POSITIONS)){const gm=mat('spot '+id,'#7fb8e6');gm.alpha=.3;const s=pick(add(MeshBuilder.CreateBox('spot '+id,{width:.75,height:.8,depth:.75},scene),gm,p.x,p.y,p.z),id as DistanceAction);spots[id]=s;
    const l=label('spot label '+id,`Posición ${id.slice(-1).toUpperCase()}`,p.x+1.1,p.y+.55,p.z,1.5);spots[id+' label']=l;}

  // Ground crew: the auxiliary who becomes the observer, and the covers kit.
  const aux=new TransformNode('auxiliary',scene);aux.parent=root;aux.position.set(2.2,0,8.9);
  const vest=mat('vest','#5a6a70');cast(cyl('aux body',vest,.42,1.1,0,1.05,0,aux,.36));cast(cyl('aux legs',mat('trousers','#2c4e7a'),.38,.6,0,.3,0,aux,.38));
  add(MeshBuilder.CreateSphere('aux head',{diameter:.26,segments:12},scene),mat('skin aux','#b97d55'),0,1.75,0,aux);add(MeshBuilder.CreateSphere('aux helmet',{diameter:.3,slice:.5,segments:12},scene),mat('aux helmet','#f2f2ec'),0,1.82,0,aux);
  pick(box('aux pick',invisible('aux pick'),.8,2,.8,0,1,0,aux),'observador');
  const auxLabel=label('aux label','AUXILIAR',2.2,2.3,8.9,.9);const observerLabel=label('observer label','OBSERVADOR',2.2,2.3,8.9,1.1,'rgba(43,122,69,.92)');observerLabel.isVisible=false;
  const tarp=MeshBuilder.CreateGround('tarp',{width:1.4,height:1},scene);tarp.parent=root;tarp.position.set(-1.8,.03,4.4);tarp.material=mat('tarp','#2f5d8a');tarp.receiveShadows=true;
  const coverKit=new TransformNode('covers kit',scene);coverKit.parent=root;coverKit.position.set(-1.8,.03,4.4);
  const coverMat=mat('cover','#ef7a1a',.2),kitCovers:Mesh[]=[];
  for(const x of [-.35,0,.35]){const c=cyl('kit cover',coverMat,.16,.7,x,.08,0,coverKit);c.rotation.x=Math.PI/2;kitCovers.push(cast(c));}
  pick(box('covers pick',invisible('covers pick'),1.3,.6,1,0,.3,0,coverKit),'cubiertas');label('covers label','CUBIERTAS',-1.8,.9,4.4,.9);
  const sleeve=add(MeshBuilder.CreateCylinder('line cover',{diameter:.2,height:3,tessellation:16},scene),coverMat,0,LINE_Y-.04,7.2);sleeve.rotation.x=Math.PI/2;sleeve.isVisible=false;

  // Flash when the bucket enters the danger zone.
  const glow=new GlowLayer('arc glow',scene,{mainTextureSamples:2});glow.intensity=1.3;
  const flashMat=new StandardMaterial('arc core',scene);flashMat.emissiveColor=hex('#cfe6ff');flashMat.disableLighting=true;
  const flash=add(MeshBuilder.CreateSphere('arc core',{diameter:.4,segments:12},scene),flashMat,.15,9.15,6.6);flash.isVisible=false;glow.addIncludedOnlyMesh(flash);
  const arcLight=new PointLight('arc light',new Vector3(.15,9,6.4),scene);arcLight.diffuse=hex('#d8ecff');arcLight.intensity=0;arcLight.range=30;
  const sparkTexture=new DynamicTexture('spark',{width:64,height:64},scene,true);{const ctx=sparkTexture.getContext() as CanvasRenderingContext2D,g=ctx.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.35,'rgba(255,214,140,.9)');g.addColorStop(1,'rgba(255,140,40,0)');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);sparkTexture.hasAlpha=true;sparkTexture.update();}
  const sparks=new ParticleSystem('arc sparks',300,scene);sparks.particleTexture=sparkTexture;sparks.emitter=new Vector3(.15,9.15,6.6);
  sparks.minEmitBox=new Vector3(-.04,-.04,-.04);sparks.maxEmitBox=new Vector3(.04,.04,.04);sparks.color1=new Color4(1,.95,.8,1);sparks.color2=new Color4(1,.6,.2,1);sparks.colorDead=new Color4(.4,.1,0,0);
  sparks.minSize=.03;sparks.maxSize=.08;sparks.minLifeTime=.4;sparks.maxLifeTime=1.2;sparks.emitRate=0;sparks.manualEmitCount=0;sparks.gravity=new Vector3(0,-9.8,0);
  sparks.direction1=new Vector3(-2,1,-3);sparks.direction2=new Vector3(2,3,1);sparks.minEmitPower=1;sparks.maxEmitPower=3.5;sparks.blendMode=ParticleSystem.BLENDMODE_ADD;sparks.start();

  const hot:Partial<Record<DistanceAction,StandardMaterial[]>>={observador:[vest],cubiertas:[coverMat],luminaria:[ghostMat],linea:[m.line],'pos-b':[spots['pos-b'].material as StandardMaterial]};
  let goal=HOME.clone(),rest=HOME.clone(),previewTime=-1,invadeAt=-1,arcTime=-1,hintOn=false,hintAction:DistanceAction|null=null,clock=0;
  return {
    update(state,hint){
      const has=(id:string)=>state.done.includes(id as never);
      for(const t of [...proximity,...danger])t.isVisible=has('linea');lineLabel.isVisible=!has('linea');linePick.isPickable=!has('linea');for(const l of zoneLabels)l.isVisible=has('linea');
      auxLabel.isVisible=!has('observador');observerLabel.isVisible=has('observador');vest.diffuseColor=hex(has('observador')?'#d6e22b':'#5a6a70');
      rest=has('pos-b')?POSITIONS['pos-b'].clone():HOME.clone();if(previewTime<0)goal=rest.clone();
      for(const id of Object.keys(POSITIONS)){spots[id].isVisible=has('observador')&&!has('pos-b');spots[id].isPickable=spots[id].isVisible;spots[id+' label'].isVisible=spots[id].isVisible;}
      sleeve.isVisible=has('cubiertas');for(const c of kitCovers)c.isVisible=!has('cubiertas');
      lamp.isVisible=has('luminaria');ghost.isVisible=!has('luminaria');lampMat.emissiveColor=has('luminaria')?hex('#fff1c4'):Color3.Black();lampLight.intensity=has('luminaria')?1.2:0;
      hintOn=hint;hintAction=nextStep(state)?.id??null;
    },
    preview(action,invasion){goal=POSITIONS[action].clone();previewTime=0;invadeAt=invasion?.9:-1;},
    tick(seconds){
      clock+=seconds;
      if(previewTime>=0){previewTime+=seconds;if(invadeAt>=0&&previewTime>=invadeAt){invadeAt=-1;arcTime=0;sparks.manualEmitCount=220;}if(previewTime>2.2){previewTime=-1;goal=rest.clone();}}
      bucket.position.addInPlace(goal.subtract(bucket.position).scale(Math.min(1,2.5*seconds)));
      const top=bucket.position.add(new Vector3(0,-.3,0));boomPivot.lookAt(top);boom.scaling.z=Vector3.Distance(BOOM_BASE,top);boom.position.z=boom.scaling.z/2;
      if(arcTime>=0){arcTime+=seconds;const live=arcTime<.8,flicker=live?.55+.45*Math.random():0;flash.isVisible=live;flash.scaling.setAll(1+flicker*1.4);arcLight.intensity=live?45*flicker:0;if(!live)arcTime=-1;}
      for(const id of Object.keys(hot) as DistanceAction[]){const p=hintOn&&hintAction===id?.35+.35*Math.sin(clock*6):0;for(const m2 of hot[id]!)m2.emissiveColor=p?new Color3(p,p*.8,0):id==='luminaria'&&m2===ghostMat?hex('#6b5214'):Color3.Black();}
    },
  };
}
