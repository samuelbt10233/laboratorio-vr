import { Color3, Color4, DirectionalLight, DynamicTexture, Mesh, MeshBuilder, Scene, ShadowGenerator, StandardMaterial, TransformNode, Vector3 } from '@babylonjs/core';
import { eppItems, type EppId, type EppState } from './procedure';
export interface EppScene {update(state:EppState,selected:EppId|null,hint:EppId|null):void;inflate(id:EppId,leaks:boolean):void;tick(seconds:number):void}
const hex=(value:string)=>Color3.FromHexString(value);
const BENCH_Y=.9,BENCH_Z=1.2,SPACING=.72;
/** The crew's base: a bench with the equipment laid out to inspect. Decoration and animation only: the verdicts live in procedure.ts. */
export function buildEppScene(scene:Scene):EppScene{
  const root=new TransformNode('base',scene);
  scene.clearColor=new Color4(.86,.88,.86,1);
  const sun=new DirectionalLight('window light',new Vector3(-.3,-1,.6),scene);sun.position=new Vector3(3,6,-2);sun.intensity=.9;sun.diffuse=hex('#fff4e0');
  const shadows=new ShadowGenerator(1024,sun);shadows.usePercentageCloserFiltering=true;shadows.bias=.004;
  const mat=(name:string,color:string,shine=0)=>{const m=new StandardMaterial(name,scene);m.diffuseColor=hex(color);m.specularColor=new Color3(shine,shine,shine);return m;};
  const printed=(name:string,w:number,h:number,draw:(ctx:CanvasRenderingContext2D)=>void,glow=.6)=>{
    const t=new DynamicTexture(name,{width:w,height:h},scene,true);draw(t.getContext() as CanvasRenderingContext2D);t.update();t.hasAlpha=true;
    const m=new StandardMaterial(name,scene);m.diffuseTexture=t;m.emissiveTexture=t;m.emissiveColor=new Color3(glow,glow,glow);m.specularColor=Color3.Black();m.useAlphaFromDiffuseTexture=true;return m;
  };
  const add=<T extends Mesh>(mesh:T,m:StandardMaterial,x:number,y:number,z:number,parent:TransformNode=root)=>{mesh.parent=parent;mesh.position.set(x,y,z);mesh.material=m;mesh.isPickable=false;shadows.addShadowCaster(mesh);return mesh;};
  const box=(name:string,m:StandardMaterial,w:number,h:number,d:number,x:number,y:number,z:number,parent?:TransformNode)=>add(MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene),m,x,y,z,parent);
  const cyl=(name:string,m:StandardMaterial,diameter:number,height:number,x:number,y:number,z:number,parent?:TransformNode,top=diameter)=>add(MeshBuilder.CreateCylinder(name,{diameterBottom:diameter,diameterTop:top,height,tessellation:20},scene),m,x,y,z,parent);
  const tagMat=(name:string,text:string,bg:string,fg='#fff')=>printed(name,256,72,ctx=>{ctx.fillStyle=bg;ctx.beginPath();ctx.roundRect(0,0,256,72,14);ctx.fill();ctx.fillStyle=fg;ctx.textAlign='center';ctx.font='bold 34px sans-serif';ctx.fillText(text,128,48);},.95);

  // Room: floor, back wall with a notice board, bench.
  const floor=MeshBuilder.CreateGround('floor',{width:14,height:10},scene);floor.parent=root;floor.position.set(0,0,0);floor.material=mat('floor','#9a9c95');floor.receiveShadows=true;
  const wall=MeshBuilder.CreatePlane('wall',{width:14,height:5},scene);wall.parent=root;wall.position.set(0,2.5,2.2);wall.material=mat('wall','#dfe2dc');wall.receiveShadows=true;
  box('wall stripe',mat('stripe','#1d4f73'),14,.12,.02,0,1.1,2.18);
  const notice=MeshBuilder.CreatePlane('notice',{width:1.6,height:.9},scene);notice.parent=root;notice.position.set(0,1.95,2.17);notice.rotation.y=Math.PI;
  notice.material=printed('notice',512,288,ctx=>{ctx.fillStyle='#f7f3ea';ctx.fillRect(0,0,512,288);ctx.fillStyle='#1d4f73';ctx.fillRect(0,0,512,56);ctx.fillStyle='#fff';ctx.font='bold 30px sans-serif';ctx.fillText('INSPECCIÓN ANTES DE CADA USO',24,38);ctx.fillStyle='#17242b';ctx.font='24px sans-serif';['1. Revisión visual y marcación','2. Inflado de guantes dieléctricos','3. Apto o retirar y reportar'].forEach((t,i)=>ctx.fillText(t,28,110+i*56));},.5);
  notice.rotation.y=0;
  const wood=mat('bench top','#b98a5a',.1),legMat=mat('bench leg','#3c4448');
  box('bench top',wood,SPACING*6+.4,.06,.9,0,BENCH_Y,BENCH_Z).receiveShadows=true;
  for(const x of [-2.2,2.2])for(const z of [.85,1.55])box('bench leg',legMat,.06,BENCH_Y,.06,x,BENCH_Y/2,z);
  const felt=mat('mat','#2f5d8a');box('inspection mat',felt,SPACING*6+.2,.01,.7,0,BENCH_Y+.035,BENCH_Z).receiveShadows=true;

  // The six items, each on its own spot with a number, a pick volume and a verdict tag.
  const dielectric=mat('dielectric rubber','#d9762a',.25),leather=mat('leather','#8a5a34',.1),white=mat('helmet','#f2f2ec',.4),dark=mat('dark','#2a3236');
  const holders:Record<string,TransformNode>={},gloves:Record<string,TransformNode>={},hot:Record<string,StandardMaterial[]>={},tags:Record<string,{fit:Mesh;out:Mesh}>={};
  const glove=(parent:TransformNode,m:StandardMaterial,cuff=true)=>{
    const g=new TransformNode('glove shape',scene);g.parent=parent;
    box('palm',m,.15,.035,.18,0,.02,0,g);
    [-.05,-.017,.017,.05].forEach((x,i)=>{const f=cyl('finger',m,.032,.1+(i===1||i===2?.02:0),x,.02,.14,g);f.rotation.x=Math.PI/2;});
    const thumb=cyl('thumb',m,.034,.08,.1,.02,.03,g);thumb.rotation.x=Math.PI/2;thumb.rotation.y=.6;
    if(cuff){const c=cyl('cuff',m,.17,.16,0,.02,-.17,g,.15);c.rotation.x=Math.PI/2;c.scaling.z=.35;}
    return g;
  };
  eppItems.forEach((it,i)=>{
    const x=(i-2.5)*SPACING,h=new TransformNode('item '+it.id,scene);h.parent=root;h.position.set(x,BENCH_Y+.04,BENCH_Z-.05);holders[it.id]=h;
    const own=(m:StandardMaterial)=>{const c=m.clone(m.name+' '+it.id);(hot[it.id]??=[]).push(c);return c;};
    if(it.id.startsWith('guante')){
      const m=own(dielectric);const a=glove(h,m);a.position.set(-.1,0,0);const b=glove(h,m);b.position.set(.1,0,.02);b.rotation.y=.15;gloves[it.id]=a;
      const mark=MeshBuilder.CreatePlane('marking',{width:.09,height:.05},scene);mark.parent=a;mark.position.set(0,.06,-.17);mark.rotation.x=Math.PI/2;mark.isPickable=false;
      mark.material=printed('marking '+it.id,128,72,ctx=>{ctx.fillStyle='#f4f1e6';ctx.fillRect(0,0,128,72);ctx.fillStyle=it.id==='guante-c'?'#b3261e':'#17242b';ctx.font='bold 18px sans-serif';ctx.fillText('CLASE',12,26);ctx.fillText(it.id==='guante-c'?'VENCIDO':'VIGENTE',12,56);},.4);
    }else if(it.id==='protector'){const m=own(leather);glove(h,m,false).position.set(-.09,0,0);const g=glove(h,m,false);g.position.set(.09,0,.02);}
    else if(it.id==='casco'){
      const m=own(white);const shell=add(MeshBuilder.CreateSphere('helmet shell',{diameter:.3,slice:.5,segments:16},scene),m,0,0,0,h);shell.scaling.z=1.15;
      cyl('helmet brim',m,.36,.012,0,0,0,h).scaling.z=1.1;
      const crack=box('crack',dark,.012,.005,.11,.02,.148,.0,h);crack.rotation.y=.4;crack.scaling.x=.8;
    }else{
      const m=own(mat('visor','#9fc4d8',.6));m.alpha=.7;const v=box('visor',m,.28,.2,.01,0,.11,0,h);v.rotation.x=-.25;
      const band=own(mat('band','#2a3236'));box('headband',band,.3,.04,.03,0,.22,.03,h);
    }
    const grabMat=new StandardMaterial('grab '+it.id,scene);grabMat.alpha=.001;grabMat.disableLighting=true;
    const grab=MeshBuilder.CreateBox('grab '+it.id,{width:.6,height:.35,depth:.6},scene);grab.parent=h;grab.position.y=.12;grab.material=grabMat;grab.isPickable=true;grab.metadata={epp:it.id};
    const num=MeshBuilder.CreatePlane('number',{width:.12,height:.12},scene);num.parent=root;num.position.set(x,BENCH_Y+.04,BENCH_Z-.43);num.rotation.x=Math.PI/2.4;num.isPickable=false;
    num.material=printed('number '+i,64,64,ctx=>{ctx.fillStyle='#17242b';ctx.beginPath();ctx.arc(32,32,30,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 34px sans-serif';ctx.textAlign='center';ctx.fillText(String(i+1),32,44);},.8);
    const tag=(text:string,bg:string)=>{const p=MeshBuilder.CreatePlane('verdict',{width:.34,height:.095},scene);p.parent=root;p.position.set(x,BENCH_Y+.45,BENCH_Z-.05);p.billboardMode=Mesh.BILLBOARDMODE_Y;p.material=tagMat('tag '+text+i,text,bg);p.isPickable=false;p.isVisible=false;return p;};
    tags[it.id]={fit:tag('APTO','#2b7a45'),out:tag('RETIRADO','#b3261e')};
  });

  const inflating:Record<string,{t:number;leaks:boolean}>={};let selected:EppId|null=null,hinted:EppId|null=null,clock=0;
  return {
    update(state,sel,hint){
      selected=sel;hinted=hint;
      for(const it of eppItems){const v=state.decided[it.id];tags[it.id].fit.isVisible=v==='apto';tags[it.id].out.isVisible=v==='retirar';holders[it.id].position.z=BENCH_Z-.05+(v==='retirar'?.22:0);if(gloves[it.id]&&!state.inflated.includes(it.id)){delete inflating[it.id];gloves[it.id].scaling.setAll(1);}}
    },
    inflate(id,leaks){inflating[id]={t:0,leaks};},
    tick(seconds){
      clock+=seconds;
      for(const [id,a] of Object.entries(inflating)){
        a.t+=seconds;const g=gloves[id];const grow=Math.min(1,a.t/.8),shrink=a.leaks?Math.max(0,Math.min(1,(a.t-1.4)/1.6)):0,s=1+.35*grow*(1-shrink);
        g.scaling.set(s,1+.9*grow*(1-shrink),s);if(a.t>3.5&&!a.leaks)g.scaling.set(1.35,1.9,1.35);
      }
      for(const it of eppItems){const pulse=hinted===it.id?.3+.3*Math.sin(clock*6):0,sel=selected===it.id;for(const m of hot[it.id]??[])m.emissiveColor=sel?new Color3(.18,.3,.42):pulse?new Color3(pulse,pulse*.8,0):Color3.Black();}
    },
  };
}
