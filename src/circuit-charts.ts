import { Color3, DynamicTexture, MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3 } from '@babylonjs/core';
import type { Circuit, Result } from './circuit';

/** A real scene object: graph data is redrawn only when the circuit changes. */
export class CircuitCharts {
  readonly position=new Vector3(0,2.8,3.9);
  private root:TransformNode;
  private texture:DynamicTexture;
  private ctx:CanvasRenderingContext2D;
  private visible=true;
  constructor(scene:Scene,parent?:TransformNode){
    this.root=new TransformNode('circuit analysis monitor',scene);this.root.parent=parent??null;this.root.position.copyFrom(this.position);
    const frame=MeshBuilder.CreateBox('graph monitor frame',{width:9.1,height:4.95,depth:.16},scene);frame.parent=this.root;
    const frameMaterial=new StandardMaterial('graph frame',scene);frameMaterial.diffuseColor=Color3.FromHexString('#24404a');frameMaterial.specularColor=Color3.Black();frame.material=frameMaterial;frame.metadata={chartPanel:true};
    this.texture=new DynamicTexture('live circuit graphs',{width:1600,height:860},scene,true);
    this.ctx=this.texture.getContext() as CanvasRenderingContext2D;
    const screen=MeshBuilder.CreatePlane('live circuit graphs screen',{width:8.8,height:4.73},scene);screen.parent=this.root;screen.position.z=-.09;
    const material=new StandardMaterial('unlit graph screen',scene);material.diffuseTexture=this.texture;material.emissiveTexture=this.texture;material.emissiveColor=Color3.White();material.disableLighting=true;material.specularColor=Color3.Black();material.backFaceCulling=false;screen.material=material;screen.metadata={chartPanel:true,chartScreen:true};
  }
  setVisible(value:boolean){this.visible=value;this.root.setEnabled(value);}
  isVisible(){return this.visible;}
  update(circuit:Circuit,result:Result){
    const ctx=this.ctx;
    const text=(value:string,x:number,y:number,size=24,color='#b1c7c2',weight='400')=>{ctx.font=`${weight} ${size}px sans-serif`;ctx.fillStyle=color;ctx.fillText(value,x,y);};
    const line=(x1:number,y1:number,x2:number,y2:number,color='#35515a',width=2)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();};
    ctx.fillStyle='#10252d';ctx.fillRect(0,0,1600,860);
    text('ANÁLISIS DEL CIRCUITO',64,64,25,'#91bca9','600');
    text('Pulsa una gráfica para acercarte.',64,105,23);
    const state=result.status==='ok'?'CIRCUITO CERRADO':result.status==='open'?'CIRCUITO ABIERTO':'CORTOCIRCUITO';
    text(state,1135,66,22,result.status==='short'?'#efac87':'#a9d4b5','600');
    line(64,137,1536,137,'#2c4751');
    text('01   Corriente vs. tensión',64,191,31,'#e5f0e8','600');
    text('Barrido teórico de la fuente · misma red',64,230,22);
    text('02   Tensión en resistencias',866,191,31,'#e5f0e8','600');
    text('Lecturas actuales · magnitudes en voltios',866,230,22);
    line(811,170,811,738,'#2c4751');
    const source=circuit.parts.find(p=>p.kind==='source')!;
    if(result.status==='short'){
      text('Mediciones bloqueadas',117,410,36,'#efac87','600');
      text('La fuente ideal está en cortocircuito.',117,460,24);
      text('La corriente no tiene un valor finito',117,507,24);
      text('en este modelo. Revisa los cables.',117,544,24);
      text('Sin lecturas válidas',915,442,34,'#efac87','600');
    }else{
      const x=143,y=300,w=586,h=327;
      const maxCurrent=result.status==='open'?0:12/result.resistance*1000;
      const scale=maxCurrent>0?10**Math.floor(Math.log10(maxCurrent)):1;
      const maxY=maxCurrent>0?Math.ceil(maxCurrent/scale)*scale:1;
      const format=(n:number)=>Number(n.toPrecision(4)).toLocaleString('es-CO',{maximumFractionDigits:3});
      for(let i=0;i<=4;i++){
        const py=y+h-h*i/4;line(x,py,x+w,py);text(format(maxY*i/4),x-77,py+8,22);
        const px=x+w*i/4;line(px,y,px,y+h);text(String(i*3),px-9,y+h+35,22);
      }
      text('I (mA)',x-65,y-26,23,'#d8e7dd');text('V (V)',x+w-20,y+h+77,23,'#d8e7dd');
      line(x,y+h,x+w,y+h,'#73988c',3);line(x,y,x,y+h,'#73988c',3);
      const endY=y+h-(maxCurrent/maxY)*h;
      line(x,y+h,x+w,endY,'#78d5bd',5);
      const px=x+w*source.value/12,py=y+h-result.current*1000/maxY*h;
      ctx.setLineDash([9,8]);line(px,y+h,px,py,'#d9bd7b',2);line(x,py,px,py,'#d9bd7b',2);ctx.setLineDash([]);
      ctx.fillStyle='#f0ca7e';ctx.beginPath();ctx.arc(px,py,9,0,Math.PI*2);ctx.fill();
      text(`●  Ahora: ${format(source.value)} V / ${format(result.current*1000)} mA`,75,746,25,'#f0ca7e');
      const resistors=circuit.parts.filter(p=>p.kind==='resistor');
      const bx=946,by=300,bw=558,bh=327;
      for(let i=0;i<=4;i++){const py=by+bh-bh*i/4;line(bx,py,bx+bw,py);text(String(i*3),bx-47,py+8,22);}
      text('V',bx-39,by-26,23,'#d8e7dd');
      line(bx,by+bh,bx+bw,by+bh,'#73988c',3);
      if(!resistors.length)text('Añade una resistencia a la mesa.',925,469,26);
      const colors=['#7dd5bd','#e1c389','#92b9db','#c6a8d6'];
      resistors.slice(0,4).forEach((part,i)=>{
        const voltage=Math.abs(result.readings[part.id]?.voltage??0);
        const gap=bw/resistors.slice(0,4).length;
        const barWidth=Math.min(96,gap*.53),left=bx+gap*(i+.5)-barWidth/2;
        const barHeight=bh*voltage/12;
        ctx.fillStyle=colors[i];ctx.fillRect(left,by+bh-Math.max(3,barHeight),barWidth,Math.max(3,barHeight));
        text(format(voltage)+' V',left-5,by+bh-barHeight-20,23,colors[i],'600');
        text(part.id,left+barWidth/2-17,by+bh+35,25,'#d8e7dd');
      });
      text(result.status==='open'?'Sin corriente · I = 0':'Cada barra muestra una caída de tensión.',875,746,24);
    }
    line(64,782,1536,782,'#2c4751');
    text('Modelo DC ideal · los gráficos se actualizan al modificar el montaje.',64,825,22,'#93b0a6');
    this.texture.update();
  }
}
