import { Color3, MeshBuilder, StandardMaterial, type Scene, type Vector3, type InstancedMesh, type TransformNode } from '@babylonjs/core';
interface Track {path:Vector3[];distances:number[];length:number;particles:InstancedMesh[];phase:number;current:number}
/** Reuses a small pool of spheres per cable; nothing is allocated per frame. */
export class CurrentAnimation {
  private tracks=new Map<string,Track>();
  private prototype;
  constructor(scene:Scene,parent?:TransformNode){
    const material=new StandardMaterial('yellow conventional current',scene);material.diffuseColor=Color3.FromHexString('#ffdb28');material.emissiveColor=Color3.FromHexString('#ffdb28');material.specularColor=Color3.Black();material.disableLighting=true;
    this.prototype=MeshBuilder.CreateSphere('current particle prototype',{diameter:.18,segments:10},scene);this.prototype.parent=parent??null;this.prototype.material=material;this.prototype.isVisible=false;this.prototype.isPickable=false;
  }
  setPaths(paths:Map<string,Vector3[]>){
    for(const [id,track] of this.tracks)if(!paths.has(id)){track.particles.forEach(p=>p.dispose());this.tracks.delete(id);}
    for(const [id,path] of paths){
      const distances=[0];for(let i=1;i<path.length;i++)distances.push(distances[i-1]+path[i].subtract(path[i-1]).length());
      const length=distances.at(-1)??0;
      const track=this.tracks.get(id)??{path:[],distances:[],length:0,particles:[],phase:0,current:0};
      Object.assign(track,{path,distances,length});
      const count=length>1e-7?Math.min(16,Math.max(2,Math.ceil(length/.85))):0;
      while(track.particles.length>count)track.particles.pop()!.dispose();
      while(track.particles.length<count){const particle=this.prototype.createInstance(`current ${id} ${track.particles.length}`);particle.parent=this.prototype.parent;particle.isPickable=false;track.particles.push(particle);}
      this.tracks.set(id,track);
    }
    this.tick(0);
  }
  setCurrents(currents:Record<string,number>){for(const [id,track] of this.tracks)track.current=currents[id]??0;this.tick(0);}
  tick(seconds:number){
    for(const track of this.tracks.values()){
      const active=Math.abs(track.current)>1e-9&&track.length>1e-7;
      // Illustrative speed: larger currents travel faster, independent of frame rate.
      if(active)track.phase=(track.phase+Math.sign(track.current)*Math.min(5,Math.max(.7,2.2*Math.sqrt(Math.abs(track.current)/.06)))*Math.min(seconds,.05)/track.length+1)%1;
      track.particles.forEach((particle,i)=>{
        particle.setEnabled(active);if(!active)return;
        const distance=((track.phase+i/track.particles.length)%1)*track.length;
        let segment=1;while(segment<track.path.length-1&&track.distances[segment]<distance)segment++;
        const span=track.distances[segment]-track.distances[segment-1],fraction=span>1e-9?(distance-track.distances[segment-1])/span:0;
        const a=track.path[segment-1],b=track.path[segment];
        particle.position.set(a.x+(b.x-a.x)*fraction,a.y+(b.y-a.y)*fraction,a.z+(b.z-a.z)*fraction);
      });
    }
  }
}
