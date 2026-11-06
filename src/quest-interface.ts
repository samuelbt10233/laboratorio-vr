import { Color3, DynamicTexture, Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode } from '@babylonjs/core';
import { catalogueEntries, getLaboratory, laboratories } from './laboratories';
interface Surface {mesh:Mesh;texture:DynamicTexture;ctx:CanvasRenderingContext2D;hits:{id:string;x:number;y:number;w:number;h:number}[];height:number}
/** World-space navigation and catalogue remain available without the web page. */
export class QuestInterface {
  readonly root:TransformNode;
  private bar:Surface;
  private catalogue:Surface;
  private summary='Apunta con un mando y pulsa el gatillo para seleccionar.';
  private note='Palanca izquierda: teletransporte a las zonas marcadas.';
  private open=false;
  private launch:{title:string;classMode:boolean;canRestart:boolean}|null=null;
  private laboratoryId:string|null=null;
  constructor(scene:Scene,private action:(id:string)=>void){
    this.root=new TransformNode('quest interface',scene);
    const surface=(name:string,width:number,height:number,textureHeight:number)=>{
      const texture=new DynamicTexture(name,{width:1200,height:textureHeight},scene,false);
      const material=new StandardMaterial(name,scene);material.diffuseTexture=texture;material.emissiveTexture=texture;material.emissiveColor=Color3.White();material.disableLighting=true;material.specularColor=Color3.Black();
      const mesh=MeshBuilder.CreatePlane(name,{width,height},scene);mesh.parent=this.root;mesh.material=material;mesh.metadata={questInterface:name};
      return {mesh,texture,ctx:texture.getContext() as CanvasRenderingContext2D,hits:[],height:textureHeight};
    };
    this.bar=surface('quest actions',1.7,.34,240);this.bar.mesh.position.set(0,2.25,.35);
    const rows=Math.max(catalogueEntries(null).length+1,...laboratories.map(l=>catalogueEntries(l.id).length+2));
    const catalogueHeight=209+rows*112;
    this.catalogue=surface('quest catalogue',1.4,1.4*catalogueHeight/1200,catalogueHeight);this.catalogue.mesh.position.set(0,1.45,-.8);this.catalogue.mesh.setEnabled(false);
    this.draw();this.root.setEnabled(false);
  }
  setEnabled(value:boolean){this.root.setEnabled(value);if(!value)this.showCatalogue(false);}
  showLaunch(title:string,classMode:boolean,canRestart:boolean){this.launch={title,classMode,canRestart};this.open=true;this.catalogue.mesh.setEnabled(true);this.draw();}
  showCatalogue(value:boolean){this.launch=null;if(value&&!this.open)this.laboratoryId=null;this.open=value;this.catalogue.mesh.setEnabled(value);this.draw();}
  isCatalogueOpen(){return this.open;}
  setSummary(text:string){if(this.summary===text)return;this.summary=text;this.draw();}
  message(text:string){this.note=text;this.draw();}
  pick(name:string,u:number,v:number){const panel=name==='quest actions'?this.bar:this.catalogue,x=u*1200,y=(1-v)*panel.height;const hit=panel.hits.find(h=>x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h);if(hit){if(hit.id.startsWith('lab:')){this.laboratoryId=hit.id.slice(4);this.draw();}else if(hit.id==='home'){this.laboratoryId=null;this.draw();}else this.action(hit.id);}}
  private draw(){
    for(const panel of [this.bar,this.catalogue]){
      const ctx=panel.ctx;panel.hits=[];ctx.fillStyle='#122e34';ctx.fillRect(0,0,1200,panel.height);
      const text=(value:string,x:number,y:number,size=32)=>{ctx.fillStyle='#e6f3e9';ctx.font=`500 ${size}px sans-serif`;ctx.textAlign='left';ctx.fillText(value,x,y);};
      const button=(id:string,label:string,x:number,y:number,w:number,h:number)=>{ctx.fillStyle='#e3eee5';ctx.fillRect(x,y,w,h);ctx.fillStyle='#244d3b';ctx.font='500 32px sans-serif';ctx.textAlign='center';ctx.fillText(label,x+w/2,y+h/2+11);panel.hits.push({id,x,y,w,h});};
      if(panel===this.bar){text(this.summary,28,49,30);text(this.note.length>93?this.note.slice(0,90)+'…':this.note,28,91,24);button('catalogue','Bienvenida y laboratorios',28,126,450,78);button('recenter','Volver al inicio',495,126,340,78);button('exit','Salir de VR',852,126,320,78);}
      else if(this.launch){
        text('Cuando estés listo',40,73,45);
        text(this.launch.title,40,155,34);
        text('La guía comenzará después de pulsar iniciar.',40,225,30);
        text('Ya estás en el entorno 3D. Acomódate antes de empezar.',40,285,28);
        button('start',this.launch.classMode?'Iniciar clase':'Iniciar simulación',40,350,1120,102);
        button('catalogue','← Volver al catálogo',40,480,1120,90);
        if(this.launch.canRestart)button('restart','Empezar desde el principio',40,590,1120,90);
      }else{
        text(this.laboratoryId?getLaboratory(this.laboratoryId).title:'Bienvenida y laboratorios',40,73,45);
        text(this.laboratoryId?'Elige una clase o el modo libre.':'Empieza por la bienvenida o elige un laboratorio.',40,123,28);
        let y=169;
        for(const entry of catalogueEntries(this.laboratoryId)){
          const id=entry.kind==='laboratory'?`lab:${entry.laboratoryId}`:entry.kind==='free'?'free':`class:${entry.classId}`;
          button(id,entry.kind==='free'?`Modo libre · ${entry.title}`:entry.title,40,y,1120,90);y+=112;
        }
        if(this.laboratoryId){button('home','← Bienvenida y laboratorios',40,y,1120,90);y+=112;}
        button('resume','Volver a mi práctica',40,y,1120,90);
      }
      panel.texture.update();
    }
  }
}
