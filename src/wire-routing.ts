import type { Circuit, Part, Wire } from './circuit';
export interface CablePoint{x:number;y:number;z:number}
interface Obstacle{minX:number;maxX:number;minZ:number;maxZ:number}
const epsilon=1e-7;
const footprint=(p:Part,padding:number):Obstacle=>({minX:p.x-(p.kind==='source'?.875:.825)-padding,maxX:p.x+(p.kind==='source'?.875:.825)+padding,minZ:p.z-(p.kind==='source'?.7:.55)-padding,maxZ:p.z+(p.kind==='source'?.7:.55)+padding});
/** Slab intersection works for diagonal segments as well as straight cable samples. */
function clear(a:CablePoint,b:CablePoint,o:Obstacle){
  let low=0,high=1;
  for(const [origin,delta,min,max] of [[a.x,b.x-a.x,o.minX+epsilon,o.maxX-epsilon],[a.z,b.z-a.z,o.minZ+epsilon,o.maxZ-epsilon]]){
    if(Math.abs(delta)<epsilon){if(origin<=min||origin>=max)return true;continue;}
    const t1=(min-origin)/delta,t2=(max-origin)/delta;low=Math.max(low,Math.min(t1,t2));high=Math.min(high,Math.max(t1,t2));if(low>=high)return true;
  }return high<=0||low>=1;
}
export function segmentClearsDevices(a:CablePoint,b:CablePoint,parts:Part[],padding=.12){return parts.every(p=>clear(a,b,footprint(p,padding)));}
const length=(a:CablePoint,b:CablePoint)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
const mix=(a:CablePoint,b:CablePoint,t:number):CablePoint=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,z:a.z+(b.z-a.z)*t});
const cubic=(a:CablePoint,b:CablePoint,c:CablePoint,d:CablePoint,t:number)=>mix(mix(mix(a,b,t),mix(b,c,t),t),mix(mix(b,c,t),mix(c,d,t),t),t);
function sampleLine(a:CablePoint,b:CablePoint){const n=Math.max(1,Math.ceil(length(a,b)/.12));return Array.from({length:n},(_,i)=>mix(a,b,(i+1)/n));}
function round(points:CablePoint[]){
  const clean=points.filter((p,i)=>i===0||length(p,points[i-1])>epsilon);if(clean.length<2)return clean;
  const out=[clean[0]];
  for(let i=1;i<clean.length-1;i++){
    const a=clean[i-1],b=clean[i],c=clean[i+1],radius=Math.min(.55,length(a,b)*.42,length(b,c)*.42),entry=mix(b,a,radius/length(a,b)),exit=mix(b,c,radius/length(b,c));
    out.push(...sampleLine(out.at(-1)!,entry));for(let j=1;j<=12;j++)out.push(mix(mix(entry,b,j/12),mix(b,exit,j/12),j/12));
  }out.push(...sampleLine(out.at(-1)!,clean.at(-1)!));return out;
}
function pathClear(path:CablePoint[],parts:Part[]){return path.slice(1).every((p,i)=>segmentClearsDevices(path[i],p,parts,.055));}
/** Flexible leads: prefer gentle curves; round a short visibility route around obstacles. */
export function routeWire(circuit:Circuit,wire:Wire,index=0):CablePoint[]{
  const pin=(id:string)=>{const [name,side]=id.split(':'),part=circuit.parts.find(p=>p.id===name);if(!part)return null;const sign=side==='0'?-1:1;return {point:{x:part.x+sign*.95,y:.22,z:part.z},sign};};
  const a=pin(wire.a),b=pin(wire.b);if(!a||!b)return [];
  const span=length(a.point,b.point),tangent=Math.min(1.45,Math.max(.55,span*.32)),bow=(index%2?1:-1)*Math.min(.28,span*.1);
  const controlA={x:a.point.x+a.sign*tangent,y:.12,z:a.point.z+bow},controlB={x:b.point.x+b.sign*tangent,y:.12,z:b.point.z+bow};
  const direct=Array.from({length:65},(_,i)=>cubic(a.point,controlA,controlB,b.point,i/64));if(pathClear(direct,circuit.parts))return direct;
  const height=.16+(index%3)*.035,padding=.40+(index%3)*.04,obstacles=circuit.parts.map(p=>footprint(p,padding));
  const start={x:a.point.x+a.sign*.7,y:height,z:a.point.z},end={x:b.point.x+b.sign*.7,y:height,z:b.point.z};
  const corners=obstacles.flatMap(o=>[{x:o.minX,y:height,z:o.minZ},{x:o.maxX,y:height,z:o.minZ},{x:o.minX,y:height,z:o.maxZ},{x:o.maxX,y:height,z:o.maxZ}]);
  const nodes=[start,end,...corners],cost=nodes.map(()=>Infinity),previous=nodes.map(()=>-1),visited=new Set<number>();cost[0]=0;
  for(let count=0;count<nodes.length;count++){
    let current=-1;for(let i=0;i<nodes.length;i++)if(!visited.has(i)&&(current===-1||cost[i]<cost[current]))current=i;
    if(current===-1||!Number.isFinite(cost[current]))break;
    if(current===1){
      const route=[end];while(current!==0){current=previous[current];route.push(nodes[current]);}route.reverse();
      const anchors=[a.point,...route,b.point],curved=round(anchors);if(pathClear(curved,circuit.parts))return curved;
      break;
    }
    visited.add(current);
    for(let next=0;next<nodes.length;next++){
      if(visited.has(next)||next===current||obstacles.some(o=>!clear(nodes[current],nodes[next],o)))continue;
      const candidate=cost[current]+length(nodes[current],nodes[next]);if(candidate<cost[next]){cost[next]=candidate;previous[next]=current;}
    }
  }
  const rise=1.7+(index%3)*.15,overA={x:a.point.x+a.sign*.55,y:rise,z:a.point.z},overB={x:b.point.x+b.sign*.55,y:rise,z:b.point.z};
  return Array.from({length:65},(_,i)=>cubic(a.point,overA,overB,b.point,i/64));
}
