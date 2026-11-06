import { Color3, Color4, DirectionalLight, DynamicTexture, HemisphericLight, Mesh, MeshBuilder, StandardMaterial, TransformNode, Vector3, type Scene } from '@babylonjs/core';
import type { Part } from './circuit';
import { createLabEnvironment } from './lab-environment';
/** Look of the electronics laboratory: lights, table and components. It holds no circuit logic or interaction. */
export function createLabArt(scene:Scene,tableRoot:TransformNode){
  scene.clearColor=new Color4(.055,.095,.115,1);
  // Soft illumination and matte surfaces preserve contrast when viewed from above.
  new HemisphericLight('sky',new Vector3(0,1,0),scene).intensity=.65;
  const light=new DirectionalLight('sun',new Vector3(-1,-3,1),scene);light.intensity=.55;
  function material(name:string,color:string,emissive=false){const m=new StandardMaterial(name,scene);m.diffuseColor=Color3.FromHexString(color);m.specularColor=Color3.Black();if(emissive)m.emissiveColor=Color3.FromHexString(color).scale(.45);return m;}
  const boardMat=material('board','#243c46'), bodyMat=material('instrument','#dce4df'), darkMat=material('dark','#17262e'), metal=material('terminal','#e3c477',true), red=material('positive','#ed916d'), teal=material('wire','#75d4bd',true), ink=material('ink','#5e8895');
  const board=MeshBuilder.CreateBox('board',{width:11.2,depth:6.5,height:.25},scene);board.parent=tableRoot;board.position.y=-.2;board.material=boardMat;board.isPickable=false;
  // One merged mesh: as separate spheres the grid alone costs 252 draw calls.
  const gridDots:Mesh[]=[];for(let x=-5;x<=5;x+=.5)for(let z=-2.75;z<=2.75;z+=.5){const dot=MeshBuilder.CreateSphere('grid',{diameter:.025,segments:4},scene);dot.position.set(x,-.061,z);gridDots.push(dot);}
  const grid=Mesh.MergeMeshes(gridDots,true,true)!;grid.name='grid';grid.parent=tableRoot;grid.material=ink;grid.isPickable=false;
  function label(text:string,parent:TransformNode,width=1.8,height=.44,y=.56,z=0,color='#18303c'){const texture=new DynamicTexture('label',{width:512,height:128},scene,true);texture.hasAlpha=true;texture.drawText(text,null,87,'bold 52px sans-serif',color,'transparent',true);const m=new StandardMaterial('text',scene);m.diffuseTexture=texture;m.emissiveTexture=texture;m.emissiveColor=Color3.White();m.disableLighting=true;m.specularColor=Color3.Black();m.useAlphaFromDiffuseTexture=true;m.backFaceCulling=false;const plane=MeshBuilder.CreatePlane('label',{width,height},scene);plane.parent=parent;plane.rotation.x=Math.PI/2;plane.position.set(0,y,z);plane.material=m;plane.isPickable=false;return plane;}
  // Shared matte materials keep the symbols legible from any camera angle.
  const leadMat=material('leads','#a6b8bb');
  const resistorShell=material('resistor shell','#d9c596');
  const bandColors=['#282b2a','#6f432b','#b94337','#d08039','#e2c758','#648449','#4d72a1','#846499','#8b9392','#efefe4'];
  const bandMaterials=bandColors.map((color,i)=>material(`band ${i}`,color));
  const goldBand=material('gold band','#ba9346');
  const silverBand=material('silver band','#a4afb3');
  function decorate(mesh:Mesh,parent:TransformNode,mat:StandardMaterial){mesh.parent=parent;mesh.material=mat;mesh.isPickable=false;return mesh;}
  function lead(parent:TransformNode,from:Vector3,to:Vector3){return decorate(MeshBuilder.CreateTube('metal lead',{path:[from,to],radius:.035,tessellation:10},scene),parent,leadMat);}
  function resistorVisual(root:TransformNode,p:Part){
    const profile=[new Vector3(0,-.59),new Vector3(.12,-.59),new Vector3(.19,-.5),new Vector3(.2,-.4),new Vector3(.17,-.29),new Vector3(.17,.29),new Vector3(.2,.4),new Vector3(.19,.5),new Vector3(.12,.59),new Vector3(0,.59)];
    const shell=decorate(MeshBuilder.CreateLathe('axial resistor',{shape:profile,tessellation:32},scene),root,resistorShell);
    shell.rotation.z=Math.PI/2;shell.position.set(0,.39,-.12);
    for(const side of [-1,1])lead(root,new Vector3(side*.95,.22,0),new Vector3(side*.59,.39,-.12));
    // Three significant digits plus multiplier. Values that cannot be represented
    // exactly use the numeric label alone, avoiding a misleading color code.
    const exponent=Math.floor(Math.log10(p.value))-2;
    const significant=p.value/10**exponent;
    if(Math.abs(significant-Math.round(significant))<1e-7){
      const digits=String(Math.round(significant)).padStart(3,'0').split('').map(Number);
      const multiplier=exponent===-1?goldBand:exponent===-2?silverBand:bandMaterials[exponent];
      const bands=[...digits.map(d=>bandMaterials[d]),multiplier,goldBand];
      bands.forEach((mat,i)=>{const band=decorate(MeshBuilder.CreateCylinder('resistor color band',{height:.055,diameter:.346,tessellation:32},scene),root,mat);band.rotation.z=Math.PI/2;band.position.set([-.24,-.1,.04,.18,.43][i],.39,-.12);if(i===4)band.scaling.set(1.13,1,1.13);});
    }
    label(`${p.id} · ${p.value} Ω`,root,1.45,.27,.195,.34);
  }
  function switchVisual(root:TransformNode,p:Part){
    const texture=new DynamicTexture('switch diagram',{width:512,height:320},scene,true);
    const ctx=texture.getContext() as CanvasRenderingContext2D;
    ctx.fillStyle='#f4f6ed';ctx.fillRect(0,0,512,320);
    ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=14;
    ctx.strokeStyle='#344f48';
    ctx.beginPath();ctx.moveTo(40,190);ctx.lineTo(150,190);ctx.moveTo(362,190);ctx.lineTo(472,190);ctx.stroke();
    const stateColor=p.closed?'#427a58':'#b27035';
    ctx.strokeStyle=stateColor;ctx.lineWidth=17;
    ctx.beginPath();ctx.moveTo(150,190);ctx.lineTo(p.closed?362:326,p.closed?190:85);ctx.stroke();
    for(const x of [150,362]){ctx.fillStyle='#f4f6ed';ctx.strokeStyle='#344f48';ctx.lineWidth=10;ctx.beginPath();ctx.arc(x,190,16,0,Math.PI*2);ctx.fill();ctx.stroke();}
    ctx.fillStyle='#53675b';ctx.font='bold 36px sans-serif';ctx.textAlign='center';ctx.fillText(p.id,256,43);
    ctx.fillStyle=stateColor;ctx.font='bold 33px sans-serif';ctx.fillText(p.closed?'CERRADO':'ABIERTO',256,287);
    texture.update();
    const mat=new StandardMaterial('text',scene);mat.diffuseTexture=texture;mat.emissiveTexture=texture;mat.emissiveColor=Color3.White();mat.disableLighting=true;mat.specularColor=Color3.Black();
    const diagram=decorate(MeshBuilder.CreatePlane('switch circuit symbol',{width:1.45,height:.88},scene),root,mat);
    diagram.rotation.x=Math.PI/2;diagram.position.y=.195;
    // Small feet give the switch the same physical language as the resistor base.
    for(const x of [-.62,.62]){const foot=decorate(MeshBuilder.CreateCylinder('switch screw',{height:.025,diameter:.09,tessellation:12},scene),root,leadMat);foot.position.set(x,.20,-.47);}
  }
  const ledLenses=new Map<string,StandardMaterial>();
  function ledVisual(root:TransformNode,p:Part){
    const lensMaterial=material('LED lens '+p.id,'#662825');ledLenses.set(p.id,lensMaterial);
    const rim=decorate(MeshBuilder.CreateCylinder('LED base',{diameter:.72,height:.14,tessellation:24},scene),root,lensMaterial);rim.position.y=.34;
    const lens=decorate(MeshBuilder.CreateSphere('LED dome',{diameter:.65,segments:24},scene),root,lensMaterial);lens.position.y=.62;
    lead(root,new Vector3(-.82,.2,0),new Vector3(-.22,.34,0));lead(root,new Vector3(.82,.2,0),new Vector3(.22,.34,0));
    label('A +',root,.48,.23,.20,.35,'#a34f35').position.x=-.57;label('K −',root,.48,.23,.20,.35).position.x=.57;
    label(p.id+' · LED',root,1.2,.22,.20,-.4);
  }
  function partVisual(root:TransformNode,p:Part){
    const source=p.kind==='source';
    const body=MeshBuilder.CreateBox(p.id,{width:source?1.75:1.65,depth:source?1.4:1.1,height:source?.7:.18},scene);
    body.parent=root;body.position.y=source?.3:.09;body.material=bodyMat;body.metadata={part:p.id};
    if(p.kind==='resistor')resistorVisual(root,p);
    else if(p.kind==='switch')switchVisual(root,p);
    else if(p.kind==='led')ledVisual(root,p);
    else{
      label(`${p.id} · FUENTE DC`,root,1.45,.25,.665,-.38);
      const panel=decorate(MeshBuilder.CreateBox('voltage display',{width:1.35,height:.025,depth:.48},scene),root,darkMat);panel.position.set(0,.66,.19);
      label(`${p.value.toFixed(1)} V`,root,1.13,.31,.68,.19,'#b8e3b2');
      label('+',root,.21,.22,.667,-.08,'#bc634a').position.x=-.73;
      label('−',root,.21,.22,.667,-.08).position.x=.73;
    }
    return body;
  }
  const environment=createLabEnvironment(scene,tableRoot.parent as TransformNode,tableRoot,material);
  return {material,label,decorate,partVisual,ledLenses,red,metal,teal,environment};
}
