import { Color3, DynamicTexture, Mesh, MeshBuilder, StandardMaterial, TransformNode, type Scene } from '@babylonjs/core';
type MakeMaterial=(name:string,color:string,emissive?:boolean)=>StandardMaterial;
const FLOOR=-8,WALL=11,HALF=22,FRONT=-28;
/**
 * Room, workbench and instruments around the circuit table. Pure decoration:
 * solids are merged per material so the whole room costs a handful of draw calls.
 * `room` is switched off in WebXR, `bench` (the frame around the board) stays.
 */
export function createLabEnvironment(scene:Scene,labRoot:TransformNode,tableRoot:TransformNode,material:MakeMaterial){
  const room=new TransformNode('laboratory room',scene);room.parent=labRoot;
  const m={wood:material('bench wood','#b88b58'),woodDark:material('bench wood dark','#7d5a3c'),steel:material('bench steel','#6f8289'),dark:material('lab dark','#27363c'),white:material('lab white','#e7ede9'),
    wallTop:material('wall top','#dde5e0'),wallLow:material('wall low','#2f5d63'),trim:material('wall trim','#b6c4bf'),skirt:material('wall skirt','#1f3036'),
    red:material('lab red','#c4473a'),yellow:material('lab yellow','#d9a93b'),green:material('lab green','#4f9a68'),blue:material('lab blue','#3c6e8f')};
  const solids=new Map<StandardMaterial,Mesh[]>();
  function solid(mat:StandardMaterial,w:number,h:number,d:number,x:number,y:number,z:number,ry=0){
    const mesh=MeshBuilder.CreateBox('lab solid',{width:w,height:h,depth:d},scene);mesh.position.set(x,y,z);mesh.rotation.y=ry;
    solids.set(mat,[...(solids.get(mat)??[]),mesh]);return mesh;
  }
  function flush(parent:TransformNode){
    for(const [mat,meshes] of solids){const merged=Mesh.MergeMeshes(meshes,true,true)!;merged.name='lab solid';merged.parent=parent;merged.material=mat;merged.isPickable=false;}
    solids.clear();
  }
  function printed(name:string,w:number,h:number,draw:(ctx:CanvasRenderingContext2D)=>void){
    const texture=new DynamicTexture(name,{width:w,height:h},scene,true);draw(texture.getContext() as CanvasRenderingContext2D);texture.update();
    const mat=new StandardMaterial(name,scene);mat.diffuseTexture=texture;mat.emissiveTexture=texture;mat.emissiveColor=new Color3(.5,.5,.5);mat.specularColor=Color3.Black();return mat;
  }
  function plane(name:string,width:number,height:number,x:number,y:number,z:number,mat:StandardMaterial){
    const mesh=MeshBuilder.CreatePlane(name,{width,height},scene);mesh.parent=room;mesh.position.set(x,y,z);mesh.material=mat;mesh.isPickable=false;return mesh;
  }
  // Walls are boxes seen from inside: local -z points into the room.
  function wall(cx:number,cz:number,ry:number,length:number){
    const at=(h:number,d:number,y:number,lz:number,mat:StandardMaterial)=>solid(mat,length,h,d,cx+lz*Math.sin(ry),y,cz+lz*Math.cos(ry),ry);
    at(6,.3,FLOOR+3,0,m.wallLow);at(20,.3,-2+10,0,m.wallTop);at(.25,.5,-2,-.1,m.trim);at(.5,.45,FLOOR+.25,-.07,m.skirt);
  }
  wall(0,WALL,0,2*HALF);wall(-HALF,(WALL+FRONT)/2,-Math.PI/2,WALL-FRONT+1);wall(HALF,(WALL+FRONT)/2,Math.PI/2,WALL-FRONT+1);wall(0,FRONT,Math.PI,2*HALF);
  const tiles=printed('floor tiles',256,256,ctx=>{ctx.fillStyle='#9db0ab';ctx.fillRect(0,0,256,256);ctx.strokeStyle='#869a95';ctx.lineWidth=6;ctx.strokeRect(0,0,256,256);});
  tiles.emissiveColor=new Color3(.12,.12,.12);(tiles.diffuseTexture as DynamicTexture).uScale=11;(tiles.diffuseTexture as DynamicTexture).vScale=11;(tiles.emissiveTexture as DynamicTexture).uScale=11;(tiles.emissiveTexture as DynamicTexture).vScale=11;
  const floor=MeshBuilder.CreateGround('lab floor',{width:2*HALF,height:WALL-FRONT},scene);floor.parent=room;floor.position.set(0,FLOOR,(WALL+FRONT)/2);floor.material=tiles;floor.isPickable=false;

  // Workbench under the tilted board: legs, rails and a lower shelf with tools.
  const legTop=(z:number)=>z*Math.tan(Math.PI*40/180)*Math.cos(Math.PI*40/180)-.4;
  for(const x of [-5.9,5.9])for(const z of [-2.7,2.7]){const top=legTop(z);solid(m.steel,.5,top-FLOOR,.5,x,(top+FLOOR)/2,z);}
  for(const z of [-2.7,2.7])solid(m.steel,11.8,.3,.3,0,-5.4,z);
  for(const x of [-5.9,5.9])solid(m.steel,.3,.3,5.4,x,-5.4,0);
  solid(m.woodDark,11.4,.2,5.2,0,-5.2,0);
  solid(m.red,2.6,1.1,1.3,-3.3,-4.55,-.3);solid(m.dark,2.6,.12,1.3,-3.3,-3.95,-.3);solid(m.yellow,.9,.18,.5,-3.3,-3.95,-.95);
  solid(m.blue,1.8,.5,1.3,.4,-4.85,0);solid(m.green,1.8,.5,1.3,2.6,-4.85,0);solid(m.white,1.8,.5,1.3,4.6,-4.85,0);
  // Monitor pedestal behind the graphs screen.
  solid(m.dark,.7,10.3,.5,0,-2.85,4.45);solid(m.dark,4.2,.3,3,0,FLOOR+.15,4.45);

  // Back bench with instruments (left).
  const benchTop=FLOOR+4.5,bz=WALL-1.6;
  solid(m.steel,8,4.5,2.6,-10,FLOOR+2.25,bz);solid(m.wood,8.4,.3,3,-10,benchTop+.15,bz);
  for(const x of [-12.6,-10,-7.4])solid(m.dark,1.2,.14,.12,x,FLOOR+3.4,bz-1.35);
  const y0=benchTop+.3;
  solid(m.dark,3.2,2.4,2.1,-12.1,y0+1.2,bz);solid(m.steel,2.8,1.3,2,-8.7,y0+.65,bz);solid(m.yellow,1.3,1.9,.8,-6.5,y0+.95,bz+.2);
  const scope=printed('oscilloscope screen',256,192,ctx=>{ctx.fillStyle='#0d2a1e';ctx.fillRect(0,0,256,192);ctx.strokeStyle='#1f5a3e';ctx.lineWidth=1;for(let i=1;i<8;i++){ctx.beginPath();ctx.moveTo(i*32,0);ctx.lineTo(i*32,192);ctx.moveTo(0,i*24);ctx.lineTo(256,i*24);ctx.stroke();}
    ctx.strokeStyle='#7df0a8';ctx.lineWidth=4;ctx.beginPath();for(let x=0;x<=256;x+=4){const y=96-52*Math.sin(x/256*Math.PI*6);if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();});
  plane('oscilloscope screen',2.2,1.65,-12.4,y0+1.35,bz-1.07,scope);
  const supply=printed('bench supply',256,128,ctx=>{ctx.fillStyle='#2a3a40';ctx.fillRect(0,0,256,128);ctx.fillStyle='#0b1a14';ctx.fillRect(20,18,130,60);ctx.fillStyle='#ff9f6b';ctx.font='bold 44px monospace';ctx.fillText('12.0',34,64);
    ctx.fillStyle='#cfd8d4';for(const x of [185,225]){ctx.beginPath();ctx.arc(x,50,17,0,7);ctx.fill();}ctx.fillStyle='#ed916d';ctx.beginPath();ctx.arc(190,106,9,0,7);ctx.fill();ctx.fillStyle='#17262e';ctx.beginPath();ctx.arc(225,106,9,0,7);ctx.fill();});
  plane('bench supply panel',2.6,1.2,-8.7,y0+.7,bz-1.02,supply);
  const meter=printed('multimeter face',128,192,ctx=>{ctx.fillStyle='#d9a93b';ctx.fillRect(0,0,128,192);ctx.fillStyle='#9fb59f';ctx.fillRect(18,16,92,46);ctx.fillStyle='#223';ctx.font='bold 30px monospace';ctx.fillText('5.02',28,50);
    ctx.fillStyle='#2b2f31';ctx.beginPath();ctx.arc(64,118,34,0,7);ctx.fill();ctx.fillStyle='#d9a93b';ctx.fillRect(61,90,6,26);});
  plane('multimeter face',1.2,1.8,-6.5,y0+.95,bz-.22,meter);

  // Window above the bench.
  const sky=printed('window',256,160,ctx=>{const g=ctx.createLinearGradient(0,0,0,160);g.addColorStop(0,'#9fd2ee');g.addColorStop(1,'#e8f3f4');ctx.fillStyle=g;ctx.fillRect(0,0,256,160);ctx.fillStyle='#f4f7f5';ctx.fillRect(126,0,6,160);ctx.fillRect(0,76,256,6);});
  solid(m.white,5.6,3.7,.2,-10,3.4,WALL-.2);plane('window glass',5.2,3.3,-10,3.4,WALL-.32,sky);
  // Whiteboard with a hand-drawn circuit.
  const board=printed('whiteboard',512,256,ctx=>{ctx.fillStyle='#f7f9f6';ctx.fillRect(0,0,512,256);ctx.strokeStyle='#2c5d86';ctx.lineWidth=5;ctx.lineJoin='round';
    ctx.beginPath();ctx.moveTo(70,190);ctx.lineTo(70,90);ctx.lineTo(150,90);ctx.moveTo(250,90);ctx.lineTo(330,90);ctx.lineTo(330,190);ctx.lineTo(70,190);ctx.stroke();
    ctx.beginPath();ctx.moveTo(150,90);for(let i=0;i<5;i++){ctx.lineTo(165+i*17,i%2?72:108);}ctx.lineTo(250,90);ctx.stroke();
    ctx.fillStyle='#2c5d86';ctx.font='bold 26px sans-serif';ctx.fillText('R',190,60);ctx.fillText('V',30,145);ctx.fillStyle='#b34a3a';ctx.font='bold 38px sans-serif';ctx.fillText('V = I · R',340,70);
    ctx.font='bold 26px sans-serif';ctx.fillStyle='#3a6a4a';ctx.fillText('I = V / R',350,130);ctx.fillText('P = V · I',350,180);});
  solid(m.steel,7.4,3.9,.2,9.5,4,WALL-.2);plane('whiteboard',7.1,3.6,9.5,4,WALL-.32,board);
  solid(m.steel,7.4,.15,.5,9.5,2,WALL-.55);
  // Banner above the monitor and two safety signs.
  const banner=printed('lab banner',512,64,ctx=>{ctx.fillStyle='#1f3036';ctx.fillRect(0,0,512,64);ctx.fillStyle='#edc76d';ctx.font='bold 30px sans-serif';ctx.textAlign='center';ctx.fillText('LABORATORIO DE ELECTRÓNICA',256,43);});
  plane('lab banner',8,1,0,8,WALL-.4,banner);
  const sign=(text:string,icon:string,color:string)=>printed('sign '+text,128,128,ctx=>{ctx.fillStyle=color;ctx.fillRect(0,0,128,128);ctx.fillStyle='#fff';ctx.fillRect(8,8,112,112);ctx.fillStyle=color;ctx.font='bold 54px sans-serif';ctx.textAlign='center';ctx.fillText(icon,64,72);ctx.font='bold 17px sans-serif';ctx.fillText(text,64,104);});
  plane('safety sign goggles',1.6,1.6,-5.2,2,WALL-.4,sign('GAFAS','👓','#2c6aa8'));plane('safety sign voltage',1.6,1.6,5.2,2,WALL-.4,sign('ALTA TENSIÓN','⚡','#c9892b'));

  // Component shelving (right): uprights, boards and colour-coded bins.
  const sx=10.4,sz=WALL-1.1;
  for(const x of [sx-3.1,sx+3.1])solid(m.steel,.3,8.4,1.6,x,FLOOR+4.2,sz);
  [FLOOR+.3,FLOOR+2.4,FLOOR+4.5,FLOOR+6.6].forEach((y,row)=>{solid(m.steel,6.4,.2,1.6,sx,y,sz);const colors=[m.red,m.blue,m.green,m.yellow,m.white];for(let i=0;i<5;i++)solid(colors[(i+row)%5],.9+(i%2)*.15,1.1,1,sx-2.5+i*1.25,y+.65,sz-.1);});
  flush(room);
  // Wooden lip around the board, moved with the table so it also shows in VR.
  const bench=new TransformNode('bench frame',scene);bench.parent=tableRoot;
  solid(m.wood,12.4,.5,.55,0,-.2,-3.55);solid(m.wood,12.4,.5,.55,0,-.2,3.55);solid(m.wood,.55,.5,7.1,-5.9,-.2,0);solid(m.wood,.55,.5,7.1,5.9,-.2,0);
  flush(bench);
  return room;
}
