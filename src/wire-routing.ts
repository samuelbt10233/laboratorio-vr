import type { Circuit, Part, Wire } from './circuit';
export interface CablePoint{x:number;y:number;z:number}
interface Obstacle{minX:number;maxX:number;minZ:number;maxZ:number}
const epsilon=1e-7;
const footprint=(p:Part,padding:number):Obstacle=>({minX:p.x-(p.kind==='source'?.875:.825)-padding,maxX:p.x+(p.kind==='source'?.875:.825)+padding,minZ:p.z-(p.kind==='source'?.7:.55)-padding,maxZ:p.z+(p.kind==='source'?.7:.55)+padding});
const inside=(p:CablePoint,o:Obstacle)=>p.x>o.minX+epsilon&&p.x<o.maxX-epsilon&&p.z>o.minZ+epsilon&&p.z<o.maxZ-epsilon;
export function segmentClearsDevices(a:CablePoint,b:CablePoint,parts:Part[],padding=.12){
  return parts.every(p=>clear(a,b,footprint(p,padding)));
}
function clear(a:CablePoint,b:CablePoint,o:Obstacle){
  if(Math.abs(a.x-b.x)<epsilon)return !(a.x>o.minX+epsilon&&a.x<o.maxX-epsilon&&Math.max(a.z,b.z)>o.minZ+epsilon&&Math.min(a.z,b.z)<o.maxZ-epsilon);
  if(Math.abs(a.z-b.z)<epsilon)return !(a.z>o.minZ+epsilon&&a.z<o.maxZ-epsilon&&Math.max(a.x,b.x)>o.minX+epsilon&&Math.min(a.x,b.x)<o.maxX-epsilon);
  return false;
}
const distance=(a:CablePoint,b:CablePoint)=>Math.abs(a.x-b.x)+Math.abs(a.z-b.z);
function simplify(points:CablePoint[]){
  const result:CablePoint[]=[];
  for(const p of points){const last=result.at(-1);if(last&&Math.hypot(p.x-last.x,p.y-last.y,p.z-last.z)<epsilon)continue;
    if(result.length>1){const a=result[result.length-2],b=result[result.length-1],u=[b.x-a.x,b.y-a.y,b.z-a.z],v=[p.x-b.x,p.y-b.y,p.z-b.z];if(Math.hypot(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])<epsilon&&u.reduce((s,n,i)=>s+n*v[i],0)>0)result.pop();}
    result.push(p);
  }return result;
}
/** Route in tabletop coordinates, with lateral terminal exits and device clearance. */
export function routeWire(circuit:Circuit,wire:Wire,index=0):CablePoint[]{
  const pin=(id:string)=>{const [name,side]=id.split(':'),part=circuit.parts.find(p=>p.id===name);if(!part)return null;const sign=side==='0'?-1:1;return {partId:name,point:{x:part.x+sign*.95,y:.22,z:part.z},exit:{x:part.x+sign*1.22,y:.22,z:part.z}};};
  const a=pin(wire.a),b=pin(wire.b);if(!a||!b)return [];
  // Separate nearby wires horizontally and separate crossings vertically.
  const height=.18+(index%4)*.11,padding=.18+(index%5)*.025,obstacles=circuit.parts.map(p=>footprint(p,padding));
  const start={...a.exit,y:height},end={...b.exit,y:height};
  const unique=(values:number[])=>[...new Set(values)].sort((a,b)=>a-b);
  const xs=unique([-5.55,5.55,start.x,end.x,...obstacles.flatMap(o=>[o.minX,o.maxX])].filter(x=>x>=-5.6&&x<=5.6));
  const zs=unique([-3.2,3.2,start.z,end.z,...obstacles.flatMap(o=>[o.minZ,o.maxZ])].filter(z=>z>=-3.2&&z<=3.2));
  const nx=xs.length,points=zs.flatMap(z=>xs.map(x=>({x,y:height,z}))),valid=points.map(p=>!obstacles.some(o=>inside(p,o)));
  const from=zs.indexOf(start.z)*nx+xs.indexOf(start.x),to=zs.indexOf(end.z)*nx+xs.indexOf(end.x);
  const score=new Map<number,number>([[from,0]]),previous=new Map<number,number>(),open=new Set<number>([from]),visited=new Set<number>();
  const leadClear=(p:typeof a)=>circuit.parts.every(other=>other.id===p.partId||clear(p.point,p.exit,footprint(other,padding)));
  if(xs.includes(start.x)&&xs.includes(end.x)&&zs.includes(start.z)&&zs.includes(end.z)&&valid[from]&&valid[to]&&leadClear(a)&&leadClear(b))while(open.size){
    let current=-1,best=Infinity;for(const n of open){const f=score.get(n)!+distance(points[n],end);if(f<best){best=f;current=n;}}
    if(current===to){const route=[points[to]];while(current!==from){current=previous.get(current)!;route.push(points[current]);}route.reverse();return simplify([a.point,a.exit,start,...route,end,b.exit,b.point]);}
    open.delete(current);visited.add(current);const x=current%nx,z=Math.floor(current/nx);
    for(const n of [x>0?current-1:-1,x<nx-1?current+1:-1,z>0?current-nx:-1,z<zs.length-1?current+nx:-1]){
      if(n<0||!valid[n]||visited.has(n)||obstacles.some(o=>!clear(points[current],points[n],o)))continue;
      const cost=score.get(current)!+distance(points[current],points[n]);if(cost<(score.get(n)??Infinity)){score.set(n,cost);previous.set(n,current);open.add(n);}
    }
  }
  // Crowded or overlapping placements still get an overhead connection, never a hidden straight line.
  const bridge=1.22+(index%4)*.12;
  return simplify([a.point,{...a.point,y:bridge},{x:b.point.x,y:bridge,z:a.point.z},{...b.point,y:bridge},b.point]);
}
