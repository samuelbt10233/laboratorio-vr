import { Color3, DynamicTexture, Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode } from '@babylonjs/core';
import type { LabClass } from './class-engine';
interface Surface {mesh:Mesh;texture:DynamicTexture;ctx:CanvasRenderingContext2D;hits:{id:string;x:number;y:number;w:number;h:number}[];height:number}
/** World-space navigation and catalogue remain available without the web page. */
export class QuestInterface {
  readonly root:TransformNode;
  private bar:Surface;
  private catalogue:Surface;
  private summary='Apunta con un mando y pulsa el gatillo para seleccionar.';
  private note='Palanca izquierda: teletransporte a las zonas marcadas.';
  private open=false;
  constructor(scene:Scene,private classes:readonly LabClass[],private action:(id:string)=>void){
    this.root=new TransformNode('quest interface',scene);
    const surface=(name:string,width:number,height:number,textureHeight:number)=>{
      const texture=new DynamicTexture(name,{width:1200,height:textureHeight},scene,false);
      const material=new StandardMaterial(name,scene);material.diffuseTexture=texture;material.emissiveTexture=texture;material.emissiveColor=Color3.White();material.disableLighting=true;material.specularColor=Color3.Black();
      const mesh=MeshBuilder.CreatePlane(name,{width,height},scene);mesh.parent=this.root;mesh.material=material;mesh.metadata={questInterface:name};
      return {mesh,texture,ctx:texture.getContext() as CanvasRenderingContext2D,hits:[],height:textureHeight};
    };
    this.bar=surface('quest actions',1.7,.34,240);this.bar.mesh.position.set(0,1.97,.35);
    this.catalogue=surface('quest catalogue',1.4,.92,790);this.catalogue.mesh.position.set(0,1.45,-.8);this.catalogue.mesh.setEnabled(false);
    this.draw();this.root.setEnabled(false);
  }
  setEnabled(value:boolean){this.root.setEnabled(value);if(!value)this.showCatalogue(false);}
  showCatalogue(value:boolean){this.open=value;this.catalogue.mesh.setEnabled(value);this.draw();}
  isCatalogueOpen(){return this.open;}
  setSummary(text:string){if(this.summary===text)return;this.summary=text;this.draw();}
  message(text:string){this.note=text;this.draw();}
  pick(name:string,u:number,v:number){const panel=name==='quest actions'?this.bar:this.catalogue,x=u*1200,y=(1-v)*panel.height;const hit=panel.hits.find(h=>x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h);if(hit)this.action(hit.id);}
  private draw(){
    for(const panel of [this.bar,this.catalogue]){
      const ctx=panel.ctx;panel.hits=[];ctx.fillStyle='#122e34';ctx.fillRect(0,0,1200,panel.height);
      const text=(value:string,x:number,y:number,size=32)=>{ctx.fillStyle='#e6f3e9';ctx.font=`500 ${size}px sans-serif`;ctx.textAlign='left';ctx.fillText(value,x,y);};
      const button=(id:string,label:string,x:number,y:number,w:number,h:number)=>{ctx.fillStyle='#e3eee5';ctx.fillRect(x,y,w,h);ctx.fillStyle='#244d3b';ctx.font='500 32px sans-serif';ctx.textAlign='center';ctx.fillText(label,x+w/2,y+h/2+11);panel.hits.push({id,x,y,w,h});};
      if(panel===this.bar){text(this.summary,28,49,30);text(this.note.length>93?this.note.slice(0,90)+'…':this.note,28,91,24);button('catalogue','Clases y modo libre',28,126,450,78);button('recenter','Volver al inicio',495,126,340,78);button('exit','Salir de VR',852,126,320,78);}
      else{
        text('¿Qué quieres explorar?',40,73,45);text('Apunta a una experiencia y pulsa el gatillo.',40,123,28);
        let y=169;for(const definition of this.classes){button(`class:${definition.id}`,definition.title,40,y,1120,102);y+=126;}
        button('free','Modo libre · Banco de electrónica',40,y,1120,102);y+=126;button('resume','Volver a mi circuito',40,y,1120,90);
      }
      panel.texture.update();
    }
  }
}
