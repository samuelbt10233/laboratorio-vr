/** Metres, seconds and headset-relative movement on the horizontal floor. */
export function walkInLab(position:{x:number;z:number},axes:{x:number;y:number},forward:{x:number;z:number},seconds:number){
 const magnitude=Math.hypot(axes.x,axes.y),length=Math.hypot(forward.x,forward.z);
 if(!Number.isFinite(magnitude+length+seconds)||magnitude<=.18||length<.001||seconds<=0)return {...position};
 const speed=Math.min(1,(magnitude-.18)/.82)*.75,dt=Math.min(seconds,.05);
 const side=axes.x/magnitude,ahead=-axes.y/magnitude,fx=forward.x/length,fz=forward.z/length;
 const dx=(fx*ahead+fz*side)*speed*dt,dz=(fz*ahead-fx*side)*speed*dt;
 const clamp=(n:number)=>Math.max(-2.1,Math.min(2.1,n));
 const insideTable=(x:number,z:number)=>Math.abs(x)<1.05&&Math.abs(z)<.75;
 let x=clamp(position.x+dx),z=position.z;
 if(insideTable(x,z))x=position.x;
 const nextZ=clamp(z+dz);if(!insideTable(x,nextZ))z=nextZ;
 return {x,z};
}
