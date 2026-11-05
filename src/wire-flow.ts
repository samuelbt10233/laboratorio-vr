import { terminal, type Circuit, type Result } from './circuit';
/** Conventional current a→b. Redundant ideal-wire loops use an equal-weight flow. */
export function wireCurrents(circuit:Circuit,result:Result):Record<string,number>{
  const currents:Record<string,number>=Object.fromEntries(circuit.wires.map(w=>[w.id,0]));
  if(result.status!=='ok')return currents;
  const pins=circuit.parts.flatMap(p=>[terminal(p.id,0),terminal(p.id,1)]);
  const injection=new Map(pins.map(pin=>[pin,0]));
  for(const p of circuit.parts){
    const reading=result.readings[p.id];if(!reading)continue;
    const i=p.kind==='source'?reading.current:-reading.current;
    injection.set(terminal(p.id,0),i);injection.set(terminal(p.id,1),-i);
  }
  const edges=[...circuit.wires,...circuit.parts.filter(p=>p.kind==='switch'&&p.closed).map(p=>({id:`switch:${p.id}`,a:terminal(p.id,0),b:terminal(p.id,1)}))];
  const adjacency=new Map(pins.map(pin=>[pin,new Set<string>()]));
  for(const edge of edges){adjacency.get(edge.a)!.add(edge.b);adjacency.get(edge.b)!.add(edge.a);}
  const visited=new Set<string>(),potential=new Map<string,number>();
  for(const seed of pins){
    if(visited.has(seed))continue;
    const group=[seed];visited.add(seed);
    for(let k=0;k<group.length;k++)for(const next of adjacency.get(group[k])!)if(!visited.has(next)){visited.add(next);group.push(next);}
    potential.set(seed,0);const unknown=group.slice(1),index=new Map(unknown.map((pin,i)=>[pin,i]));
    const matrix=unknown.map(pin=>[...unknown.map(()=>0),injection.get(pin)!]);
    for(const edge of edges)for(const [a,b] of [[edge.a,edge.b],[edge.b,edge.a]]){
      const i=index.get(a);if(i===undefined)continue;matrix[i][i]++;const j=index.get(b);if(j!==undefined)matrix[i][j]--;
    }
    for(let k=0;k<unknown.length;k++){
      const divisor=matrix[k][k];
      for(let j=k;j<=unknown.length;j++)matrix[k][j]/=divisor;
      for(let i=0;i<unknown.length;i++)if(i!==k){const factor=matrix[i][k];for(let j=k;j<=unknown.length;j++)matrix[i][j]-=factor*matrix[k][j];}
    }
    unknown.forEach((pin,i)=>potential.set(pin,matrix[i][unknown.length]));
  }
  for(const wire of circuit.wires){const flow=potential.get(wire.a)!-potential.get(wire.b)!;currents[wire.id]=Math.abs(flow)<1e-10?0:flow;}
  return currents;
}
