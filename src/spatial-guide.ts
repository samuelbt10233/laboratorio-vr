import { ArcRotateCamera, Color3, DynamicTexture, Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode } from '@babylonjs/core';
import type { NarrationState } from './narration';
export interface GuideContent {canReset?:boolean;confirmation?:string;title:string;text:string;task:string;hint:string;tag:string;progress:number;classMode:boolean;lastStep:boolean;ready:boolean;voice:NarrationState;status:string}
interface Hit {id:string;x:number;y:number;w:number;h:number}
/** The guide, dialogue and lesson actions are all pickable scene objects. */
export class SpatialGuide {
  private panel:Mesh;
  private texture:DynamicTexture;
  private ctx:CanvasRenderingContext2D;
  private avatar:TransformNode;
  private head:TransformNode;
  private mouth:Mesh;
  private hits:Hit[]=[];
  private content:GuideContent|null=null;
  private hovered='';
  private time=0;
  private expanded=false;
  private minimized=false;
  private textureHeight=420;
  private immersive=false;
  private viewport:{width:number;height:number;camera:ArcRotateCamera}|null=null;
  constructor(scene:Scene,camera:ArcRotateCamera,private action:(id:string)=>void){
    this.texture=new DynamicTexture('guide dialogue texture',{width:900,height:420},scene,false);this.ctx=this.texture.getContext() as CanvasRenderingContext2D;
    const material=new StandardMaterial('guide dialogue material',scene);material.diffuseTexture=this.texture;material.emissiveTexture=this.texture;material.emissiveColor=Color3.White();material.disableLighting=true;material.specularColor=Color3.Black();
    this.panel=MeshBuilder.CreatePlane('virtual guide dialogue in scene',{size:1},scene);this.panel.parent=camera;this.panel.material=material;this.panel.metadata={guidePanel:true};this.panel.renderingGroupId=3;
    this.avatar=new TransformNode('virtual guide 3D avatar',scene);this.avatar.parent=camera;
    const mat=(name:string,color:string)=>{const m=new StandardMaterial(name,scene);m.diffuseColor=Color3.FromHexString(color);m.emissiveColor=Color3.FromHexString(color);m.disableLighting=true;return m;};
    const shell=mat('guide robot shell','#afc9b4'),face=mat('guide robot face','#183a3c'),eyes=mat('guide robot lights','#8ff6d4');
    const box=(name:string,w:number,h:number,d:number,parent:TransformNode,m:StandardMaterial)=>{const mesh=MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene);mesh.parent=parent;mesh.material=m;mesh.isPickable=false;mesh.renderingGroupId=3;return mesh;};
    this.head=new TransformNode('guide head',scene);this.head.parent=this.avatar;
    box('guide head shell',.72,.55,.35,this.head,shell);
    box('guide face',.6,.36,.03,this.head,face).position.z=-.19;
    for(const x of [-.16,.16]){const eye=box('guide eye',.09,.09,.02,this.head,eyes);eye.position.set(x,.055,-.22);}
    this.mouth=box('guide animated mouth',.17,.035,.02,this.head,eyes);this.mouth.position.set(0,-.1,-.22);
    box('guide body',.46,.3,.28,this.avatar,shell).position.y=-.49;
    box('guide chest light',.13,.05,.02,this.avatar,eyes).position.set(0,-.46,-.15);
    box('guide antenna',.035,.18,.035,this.head,shell).position.y=.35;
    const tip=MeshBuilder.CreateSphere('guide antenna light',{diameter:.09,segments:10},scene);tip.parent=this.head;tip.position.y=.46;tip.material=eyes;tip.isPickable=false;tip.renderingGroupId=3;
  }
  setImmersive(value:boolean){
    this.immersive=value;this.panel.parent=value?null:this.viewport?.camera??this.panel.parent;this.avatar.parent=value?null:this.viewport?.camera??this.avatar.parent;
    this.panel.renderingGroupId=value?0:3;this.avatar.getChildMeshes().forEach(mesh=>mesh.renderingGroupId=value?0:3);
    this.panel.rotation.y=value?.5:0;this.avatar.rotation.y=value?.5:0;
    if(this.viewport){const {width,height,camera}=this.viewport;this.resize(width,height,camera);}
  }
  setVisible(value:boolean){this.panel.setEnabled(value);this.avatar.setEnabled(value);}
  resize(width:number,height:number,camera:ArcRotateCamera){
    this.viewport={width,height,camera};
    if(this.immersive){
      const w=this.minimized?.46:.78,h=w*this.textureHeight/900;
      this.panel.scaling.set(w,h,1);this.panel.position.set(1.0,.72+h/2,-.85);
      this.avatar.scaling.setAll(w*83/900);this.avatar.position.set(1.0-w*.36,.72+h-w*58/900,-.79);return;
    }
    const worldWidth=2*Math.tan(camera.fov/2)*6,unit=worldWidth/width;
    const panelWidth=Math.min(this.minimized?290:420,width-32);
    const panelHeight=Math.min(height-110,panelWidth*this.textureHeight/900);
    const left=width/2-16-panelWidth;
    this.panel.scaling.set(unit*panelWidth,unit*panelHeight,1);
    this.panel.position.set(unit*(left+panelWidth/2),unit*(-height/2+panelHeight/2+16),6);
    this.avatar.position.set(unit*(left+panelWidth*62/900),this.panel.position.y+unit*(panelHeight/2-panelWidth*58/900),5.85);
    this.avatar.scaling.setAll(unit*panelWidth*83/900);
  }
  update(content:GuideContent){
    if(content.confirmation&&!this.content?.confirmation&&this.minimized){
      this.minimized=false;this.expanded=false;this.textureHeight=420;this.texture.scaleTo(900,420);this.ctx=this.texture.getContext() as CanvasRenderingContext2D;
      if(this.viewport){const {width,height,camera}=this.viewport;this.resize(width,height,camera);}
    }
    this.content=content;this.draw();
  }
  private hit(u:number,v:number){const x=u*900,y=(1-v)*this.textureHeight;return this.hits.find(h=>x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h);}
  hover(u:number,v:number){const id=this.hit(u,v)?.id??'';if(id!==this.hovered){this.hovered=id;this.draw();}return !!id;}
  clearHover(){if(this.hovered){this.hovered='';this.draw();}}
  pick(u:number,v:number){
    const hit=this.hit(u,v);if(!hit)return;
    if(hit.id==='details'||hit.id==='minimize'){
      if(hit.id==='details'){this.expanded=!this.expanded;this.minimized=false;}
      else this.minimized=!this.minimized;
      this.textureHeight=this.minimized?140:this.expanded?760:420;
      this.texture.scaleTo(900,this.textureHeight);this.ctx=this.texture.getContext() as CanvasRenderingContext2D;
      if(this.viewport){const {width,height,camera}=this.viewport;this.resize(width,height,camera);}
      this.hovered='';this.draw();return;
    }
    this.action(hit.id);
  }
  tick(seconds:number){this.time+=Math.min(seconds,.05);const speaking=this.content?.voice==='speaking';this.mouth.scaling.y=speaking?1.2+Math.abs(Math.sin(this.time*18))*3:1;this.head.rotation.z=speaking?Math.sin(this.time*4)*.035:0;}
  private draw(){
    if(!this.content)return;const c=this.content,ctx=this.ctx;this.hits=[];
    ctx.fillStyle=c.confirmation?'#edf8ef':'#f6f8f4';ctx.fillRect(0,0,900,this.textureHeight);if(c.confirmation){ctx.strokeStyle='#4b9965';ctx.lineWidth=7;ctx.strokeRect(3,3,894,this.textureHeight-6);}ctx.fillStyle=c.confirmation?'#4b9965':'#bfd2c6';ctx.fillRect(0,0,900,5);
    const text=(value:string,x:number,y:number,size=29,color='#425b50',bold=false)=>{ctx.fillStyle=color;ctx.font=`${bold?'600':'400'} ${size}px sans-serif`;ctx.textAlign='left';ctx.fillText(value,x,y);};
    const wrap=(value:string,x:number,y:number,maxWidth:number,size:number,lineHeight:number,color:string)=>{
      ctx.font=`400 ${size}px sans-serif`;let line='';
      for(const word of value.split(/\s+/)){const next=line?`${line} ${word}`:word;if(ctx.measureText(next).width>maxWidth&&line){text(line,x,y,size,color);line=word;y+=lineHeight;}else line=next;}
      if(line)text(line,x,y,size,color);return y+lineHeight;
    };
    const button=(id:string,label:string,x:number,y:number,w:number,h:number,primary=false,disabled=false)=>{
      ctx.fillStyle=disabled?'#e5eae4':this.hovered===id?'#c9dfd1':primary?(c.ready?'#fff0b8':'#254b3c'):'#ffffff';ctx.fillRect(x,y,w,h);ctx.lineWidth=c.ready&&primary?5:2;ctx.strokeStyle=c.ready&&primary?'#bd8a16':'#c1d1c6';ctx.strokeRect(x,y,w,h);
      ctx.textAlign='center';ctx.fillStyle=disabled?'#8e9b92':primary&&!c.ready?'#ffffff':'#294d3d';ctx.font='500 29px sans-serif';ctx.fillText(label,x+w/2,y+h/2+10);ctx.textAlign='left';if(!disabled)this.hits.push({id,x,y,w,h});
    };
    if(this.minimized){
      text(c.confirmation?'¡Paso completado!':'Tu guía virtual',150,49,38,'#244435',true);
      text(c.tag,150,82,25,'#718678');button('minimize','Abrir',666,22,202,58);
      this.texture.update();return;
    }
    text(c.confirmation?(c.classMode?'✓ PASO COMPLETADO':'✓ CLASE COMPLETADA'):c.tag,150,40,23,c.confirmation?'#286240':'#718678',true);
    wrap(c.confirmation?'¡Lo has hecho bien!':c.title,150,81,620,31,36,'#244435');
    button('minimize','−',796,22,72,54);
    const contentBottom=this.expanded?574:244;
    if(this.expanded){
      if(c.canReset&&c.confirmation)wrap(c.confirmation,32,160,836,29,36,'#286240');
      else{
        let y=wrap(c.text,32,160,836,28,34,'#496151');
        y=wrap(c.task,32,y+14,836,27,33,'#2d5841');
        if(!c.canReset&&(c.confirmation||c.hint))wrap(c.confirmation||c.hint,32,y+16,836,25,30,c.confirmation?'#286240':'#8a651a');
      }
      if(c.canReset)button('reset','Reiniciar este reto',32,510,836,54);
    }else{
      // The next concrete action takes priority; explanations remain one click away.
      wrap(c.confirmation||c.hint||c.task,32,160,836,c.confirmation?27:29,c.confirmation?32:35,c.confirmation?'#286240':'#496151');
    }
    const rowY=contentBottom+18,nextY=contentBottom+94;
    button('details',this.expanded?'Menos detalle':c.canReset?'Ver pistas':'Ver explicación',32,rowY,314,55);
    if(c.classMode||c.confirmation){
      const playing=c.voice==='speaking'||c.voice==='loading';
      button(playing?'stop':'speak',playing?'Detener':c.voice==='finished'?'Repetir':'Escuchar',360,rowY,232,55,false,c.voice==='muted');
      button('mute',c.voice==='muted'?'Activar voz':'Silenciar',606,rowY,262,55);
      button(c.classMode?'next':'classes',!c.classMode?'Clases guiadas':c.lastStep?'Finalizar y explorar →':c.ready?'Continuar →':'Comprobar y continuar →',32,nextY,836,62,true);
    }else button('classes','Clases guiadas',32,nextY,836,62);
    ctx.fillStyle='#dce6dd';ctx.fillRect(32,this.textureHeight-10,836,4);ctx.fillStyle='#709a7c';ctx.fillRect(32,this.textureHeight-10,836*c.progress,4);
    this.texture.update();
  }
}
