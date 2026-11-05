import { ledState } from './led-solver';
import { ArcRotateCamera, Color3, DynamicTexture, Mesh, MeshBuilder, Scene, StandardMaterial } from '@babylonjs/core';
import type { Circuit, Result } from './circuit';
interface Hit {id:string;x:number;y:number;w:number;h:number}
interface Panel {mesh:Mesh;texture:DynamicTexture;ctx:CanvasRenderingContext2D;hits:Hit[]}
/** Pickable scene surfaces. Camera anchoring keeps controls readable while orbiting. */
export class SpatialControls {
  private panels:Panel[]=[];
  private model:{circuit:Circuit;result:Result;selected:string;pending:string|null}|null=null;
  private highlighted='';
  private hovered='';
  private visible=true;
  private editing=false;
  private draft='';
  private valueKey='';
  private tab:'properties'|'wires'='properties';
  private wirePage=0;
  private immersive=false;
  constructor(scene:Scene,private camera:ArcRotateCamera,private action:(id:string)=>void,private edit:(value:string)=>void){
    for(const side of ['tools','properties']){
      const texture=new DynamicTexture(`${side} controls texture`,{width:560,height:1420},scene,false);
      const material=new StandardMaterial(`${side} controls material`,scene);material.diffuseTexture=texture;material.emissiveTexture=texture;material.emissiveColor=Color3.White();material.disableLighting=true;material.specularColor=Color3.Black();material.backFaceCulling=false;
      const mesh=MeshBuilder.CreatePlane(`${side} controls in scene`,{size:1},scene);mesh.parent=camera;mesh.material=material;mesh.metadata={spatialPanel:this.panels.length};mesh.renderingGroupId=3;
      this.panels.push({mesh,texture,ctx:texture.getContext() as CanvasRenderingContext2D,hits:[]});
    }
  }
  resize(width:number,height:number){
    if(this.immersive)return;
    const distance=6,worldWidth=2*Math.tan(this.camera.fov/2)*distance;
    const guideHeight=Math.min(220,(width-32)*400/1800);
    const pxWidth=Math.min(224,width*.245,Math.max(260,height-guideHeight-118)*560/1420),pxHeight=pxWidth*1420/560;
    this.panels.forEach((p,i)=>{p.mesh.scaling.set(worldWidth*pxWidth/width,worldWidth*pxHeight/width,1);p.mesh.position.set((i===0?-1:1)*(worldWidth/2-worldWidth*(pxWidth/2+16)/width),worldWidth/width*(height/2-78-pxHeight/2),distance);});
  }
  setImmersive(value:boolean){
    this.immersive=value;this.editing=false;
    this.panels.forEach((p,i)=>{p.mesh.parent=value?null:this.camera;p.mesh.renderingGroupId=value?0:3;p.mesh.rotation.set(0,value?(i===0?-.35:.35):0,0);if(value){p.mesh.position.set(i===0?-1.18:1.18,1.55,.05);p.mesh.scaling.set(.5,.5*1420/560,1);}});
    this.draw();
  }
  setVisible(value:boolean){this.visible=value;this.panels.forEach(p=>p.mesh.setEnabled(value));}
  isVisible(){return this.visible;}
  isEditing(){return this.editing;}
  highlight(id:string){if(this.highlighted===id)return;this.highlighted=id;if(id==='value'||id==='apply'||id==='switch'||id.startsWith('move:'))this.tab='properties';if(id==='tab:wires')this.tab='wires';this.draw();}
  update(circuit:Circuit,result:Result,selected:string,pending:string|null){
    this.model={circuit,result,selected,pending};const p=circuit.parts.find(p=>p.id===selected),key=p?`${p.id}:${p.value}`:'';
    if(key!==this.valueKey){this.valueKey=key;this.draft=p?String(p.value):'';this.editing=false;}
    this.draw();
  }
  private hit(panel:number,u:number,v:number){return this.panels[panel]?.hits.find(h=>u*560>=h.x&&u*560<=h.x+h.w&&(1-v)*1420>=h.y&&(1-v)*1420<=h.y+h.h);}
  hover(panel:number,u:number,v:number){const id=this.hit(panel,u,v)?.id??'';if(id!==this.hovered){this.hovered=id;this.draw();}return !!id;}
  clearHover(){if(this.hovered){this.hovered='';this.draw();}}
  pick(panel:number,u:number,v:number){const hit=this.hit(panel,u,v);if(!hit)return;
    const id=hit.id;
    if(id==='value'){this.editing=true;this.draft='';this.edit('');this.draw();return;}
    if(id.startsWith('key:')){this.key(id.slice(4));return;}
    if(id.startsWith('tab:')){this.tab=id==='tab:wires'?'wires':'properties';this.editing=false;this.draw();return;}
    if(id==='wires:prev'||id==='wires:next'){this.wirePage+=id==='wires:next'?1:-1;this.draw();return;}
    if(id==='apply')this.editing=false;
    this.action(id);
  }
  key(key:string){
    if(!this.editing)return false;
    if(key==='Escape'){this.editing=false;this.draft=String(this.model?.circuit.parts.find(p=>p.id===this.model?.selected)?.value??'');this.edit(this.draft);}
    else if(key==='Enter'){this.editing=false;this.action('apply');}
    else if(key==='Backspace')this.draft=this.draft.slice(0,-1);
    else if(/^\d$/.test(key)&&this.draft.length<7)this.draft+=key;
    else if((key==='.'||key===',')&&!this.draft.includes('.'))this.draft+='.';
    else return false;
    if(this.editing)this.edit(this.draft);this.draw();return true;
  }
  private terminalLabel(id:string){const [part,side]=id.split(':');const kind=this.model?.circuit.parts.find(p=>p.id===part)?.kind,source=kind==='source';return `${part} ${source?(side==='0'?'+':'−'):kind==='led'?(side==='0'?'A +':'K −'):(side==='0'?'A':'B')}`;}
  private draw(){
    if(!this.model)return;const {circuit,result,selected,pending}=this.model;
    const p=circuit.parts.find(part=>part.id===selected);
    for(const [index,panel] of this.panels.entries()){
      const ctx=panel.ctx;panel.hits=[];ctx.fillStyle='#f5f7f5';ctx.fillRect(0,0,560,1420);ctx.strokeStyle='#8ba39c';ctx.lineWidth=3;ctx.strokeRect(2,2,556,1416);
      const text=(value:string,x:number,y:number,size=29,color='#49605c',bold=false)=>{ctx.fillStyle=color;ctx.font=`${bold?'600':'400'} ${size}px sans-serif`;ctx.textAlign='left';ctx.fillText(value,x,y);};
      const line=(y:number)=>{ctx.fillStyle='#d9e2dd';ctx.fillRect(32,y,496,2);};
      const button=(id:string,label:string,x:number,y:number,w=496,h=80,active=false)=>{
        const guide=this.highlighted===id;ctx.fillStyle=guide?'#fff0b8':this.hovered===id?'#dfeae4':active?'#d8e8e0':'#ffffff';ctx.fillRect(x,y,w,h);ctx.strokeStyle=guide?'#b77a00':active?'#789d89':'#cbd7d0';ctx.lineWidth=guide?6:2;ctx.strokeRect(x,y,w,h);ctx.fillStyle='#26483e';ctx.font='500 30px sans-serif';ctx.textAlign='center';ctx.fillText(label,x+w/2,y+h/2+10);ctx.textAlign='left';panel.hits.push({id,x,y,w,h});
      };
      text(index===0?'BANCO DE TRABAJO':'COMPONENTE ACTIVO',32,58,26,'#688175',true);line(85);
      if(index===0){
        text('Añadir a la mesa',32,135,32,'#203e34',true);
        button('add-r','+ Resistencia',32,164,496,64);button('add-s','+ Interruptor',32,236,496,64);button('add-l','+ LED rojo',32,308,496,64);
        text('Montajes de ejemplo',32,404,29,'#203e34',true);
        button('preset:simple','Simple',32,433,155);button('preset:series','Serie',202,433,155);button('preset:parallel','Paralelo',372,433,156);
        line(550);text('Elementos del circuito',32,602,29,'#203e34',true);
        circuit.parts.forEach((part,i)=>button(`part:${part.id}`,`${part.id}   ${part.kind==='source'?'Fuente':part.kind==='resistor'?`${part.value} Ω`:part.kind==='led'?ledState(result.readings[part.id]?.current??0):part.closed?'Cerrado':'Abierto'}`,32,634+i*65,496,54,part.id===selected));
        line(1182);button('save','Guardar',32,1208,240,70);button('load','Recuperar',288,1208,240,70);button('empty','Vaciar mesa',32,1297,496,70);
      }else{
        button('tab:properties','Propiedades',32,108,240,70,this.tab==='properties');button('tab:wires',`Cables (${circuit.wires.length})`,288,108,240,70,this.tab==='wires');
        if(this.tab==='wires'){
          text('Pulsa × para quitar un cable.',32,240,27);const maxPage=Math.max(0,Math.ceil(circuit.wires.length/9)-1);this.wirePage=Math.min(Math.max(0,this.wirePage),maxPage);
          circuit.wires.slice(this.wirePage*9,this.wirePage*9+9).forEach((w,i)=>{text(`${this.terminalLabel(w.a)} ↔ ${this.terminalLabel(w.b)}`,32,321+i*90,26);button(`wire:${w.id}`,'×',447,275+i*90,81,65);});
          if(this.wirePage>0)button('wires:prev','←',32,1140,100,65);
          if(this.wirePage<maxPage)button('wires:next','→',428,1140,100,65);
          text(`Página ${this.wirePage+1} / ${maxPage+1}`,170,1184,27);
        }else if(p){
          text(`${p.id} · ${p.kind==='source'?'Fuente DC':p.kind==='resistor'?'Resistencia':p.kind==='led'?'LED rojo':'Interruptor'}`,32,246,38,'#203e34',true);
          if(p.kind==='switch')button('switch',p.closed?'● Cerrado · abrir':'○ Abierto · cerrar',32,290,496,96);
          else if(p.kind!=='led'){
            text(p.kind==='source'?'Tensión · 1 a 12 V':'Resistencia · 10 a 1000 Ω',32,299,27);
            button('value',`${this.editing?(this.draft||'Escribe…'):p.value} ${p.kind==='source'?'V':'Ω'}`,32,327,496,100);
            button('decrease','−',32,446,112,72);button('apply','Aplicar',160,446,240,72);button('increase','+',416,446,112,72);
            text(this.editing?(this.immersive?'Pulsa los números y después Aplicar.':'Teclado: escribe y pulsa Enter.'):'Pulsa el valor para escribir.',32,561,26);
          }
          if(p.kind==='led'){text(ledState(result.readings[p.id]?.current??0),32,351,38,'#a3442c',true);text('A + → K − · LED rojo simplificado',32,420,25);text('Límite didáctico: 20 mA',32,475,27);}
          if(this.immersive&&this.editing){
            const keys=['1','2','3','4','5','6','7','8','9','Backspace','0','.'];
            keys.forEach((key,i)=>button(`key:${key}`,key==='Backspace'?'⌫':key,32+i%3*170,620+Math.floor(i/3)*125,156,106));
            button('key:Enter','Aplicar',32,1150,240,88);button('key:Escape','Cancelar',288,1150,240,88);
            text('El valor se guarda al pulsar Aplicar.',32,1323,25);panel.texture.update();continue;
          }
          const reading=result.readings[p.id];line(601);text('LECTURAS EN VIVO',32,650,25,'#688175',true);
          text(reading?`${Math.abs(reading.voltage).toFixed(2)} V   ·   ${(Math.abs(reading.current)*1000).toFixed(1)} mA`:p.kind==='switch'?(p.closed?'Contacto cerrado':'Contacto abierto'):'Sin lectura válida',32,710,34,'#203e34',true);
          text(reading?`${reading.power.toFixed(3)} W`:p.kind==='switch'?'Interruptor ideal · sin pérdidas':'Revisa las conexiones.',32,759,28);
          text('CONECTAR TERMINALES',32,842,25,'#688175',true);
          const pinLabel=(side:number)=>`${p.id} · ${p.kind==='source'?(side===0?'+':'−'):(p.kind==='led'?(side===0?'A +':'K −'):(side===0?'A':'B'))}`;
          button(`pin:${p.id}:0`,pinLabel(0),32,872,240,76,pending===`${p.id}:0`);button(`pin:${p.id}:1`,pinLabel(1),288,872,240,76,pending===`${p.id}:1`);
          text(pending?`Origen: ${pending}`:'Elige un terminal y luego otro.',32,998,27);
          if(pending)button('cancel-wire','Cancelar conexión',32,1031,496,70);
          if(p.kind!=='source')button('remove','Eliminar componente',32,1144,496,76);
          {for(const [i,label] of ['←','→','↑','↓'].entries())button(['move:left','move:right','move:away','move:near'][i],label,32+i*128,1240,112,60);text('Flechas: mover sobre la mesa.',32,1360,25);}
        }
      }
      panel.texture.update();
    }
  }
}
