import type { Circuit, Result } from './circuit';
// Teaching model, not a specific manufacturer's LED: knee voltage + series resistance.
export const LED_MODEL={voltage:2,resistance:20,maxCurrent:.02};
export function solveWithLeds(c:Circuit):Result{
  const parent=new Map<string,string>();
  const find=(n:string):string=>{const p=parent.get(n);if(!p){parent.set(n,n);return n;}if(p===n)return n;const r=find(p);parent.set(n,r);return r;};
  const join=(a:string,b:string)=>parent.set(find(a),find(b));
  c.parts.forEach(p=>{find(`${p.id}:0`);find(`${p.id}:1`);});c.wires.forEach(w=>join(w.a,w.b));
  c.parts.filter(p=>p.kind==='switch'&&p.closed).forEach(p=>join(`${p.id}:0`,`${p.id}:1`));
  const source=c.parts.find(p=>p.kind==='source')!,pos=find(`${source.id}:0`),neg=find(`${source.id}:1`);
  if(pos===neg)return {status:'short',current:0,resistance:0,readings:{}};
  const leds=c.parts.filter(p=>p.kind==='led'),parts=c.parts.filter(p=>p.kind==='resistor'||p.kind==='led');
  const graph=new Map<string,Set<string>>();
  for(const p of parts){const a=find(`${p.id}:0`),b=find(`${p.id}:1`);for(const [u,v] of [[a,b],[b,a]]){if(!graph.has(u))graph.set(u,new Set());graph.get(u)!.add(v);}}
  const anchored=new Set([pos,neg]),queue=[pos,neg];for(let i=0;i<queue.length;i++)for(const n of graph.get(queue[i])??[])if(!anchored.has(n)){anchored.add(n);queue.push(n);}
  const unknown=[...anchored].filter(n=>n!==pos&&n!==neg),index=new Map(unknown.map((n,i)=>[n,i])),fixed=(n:string)=>n===pos?source.value:0;
  // At most four LEDs (16 states). Tiny off conductance anchors otherwise floating nodes.
  for(let mask=0;mask<2**leds.length;mask++){
    const branches=parts.map(p=>{const on=p.kind==='led'&&!!(mask&(1<<leds.indexOf(p)));return {p,a:find(`${p.id}:0`),b:find(`${p.id}:1`),on,g:p.kind==='resistor'?1/p.value:on?1/LED_MODEL.resistance:1e-12,drop:on?LED_MODEL.voltage:0};});
    const m=unknown.map(()=>Array(unknown.length+1).fill(0) as number[]);
    for(const {a,b,g,drop} of branches){if(a===b)continue;for(const [u,v,sign] of [[a,b,1],[b,a,-1]] as const){const i=index.get(u);if(i===undefined)continue;m[i][i]+=g;m[i][unknown.length]+=sign*g*drop;const j=index.get(v);if(j===undefined)m[i][unknown.length]+=g*fixed(v);else m[i][j]-=g;}}
    let singular=false;
    for(let k=0;k<unknown.length;k++){let pivot=k;for(let i=k+1;i<unknown.length;i++)if(Math.abs(m[i][k])>Math.abs(m[pivot][k]))pivot=i;[m[k],m[pivot]]=[m[pivot],m[k]];const d=m[k][k];if(Math.abs(d)<1e-16){singular=true;break;}for(let j=k;j<=unknown.length;j++)m[k][j]/=d;for(let i=0;i<unknown.length;i++)if(i!==k){const f=m[i][k];for(let j=k;j<=unknown.length;j++)m[i][j]-=f*m[k][j];}}
    if(singular)continue;
    const voltage=(n:string)=>!anchored.has(n)?0:index.has(n)?m[index.get(n)!][unknown.length]:fixed(n);
    if(branches.some(b=>b.p.kind==='led'&&(b.on?voltage(b.a)-voltage(b.b)<LED_MODEL.voltage-1e-7:voltage(b.a)-voltage(b.b)>LED_MODEL.voltage+1e-7)))continue;
    const readings:Result['readings']={};let current=0;
    for(const b of branches){const v=voltage(b.a)-voltage(b.b),raw=b.p.kind==='led'&&!b.on?0:(v-b.drop)*b.g,i=Math.abs(raw)<1e-8?0:raw;readings[b.p.id]={voltage:v,current:i,power:v*i};if(b.a===pos)current+=i;if(b.b===pos)current-=i;}
    current=Math.max(0,current);if(current<1e-8)current=0;
    readings[source.id]={voltage:source.value,current,power:source.value*current};
    return {status:current>0?'ok':'open',current,resistance:current>0?source.value/current:Infinity,readings};
  }
  throw new Error('No se pudo resolver el estado de los LED');
}
export function ledState(current:number){return current>LED_MODEL.maxCurrent+1e-8?'Sobrecorriente':current>1e-8?'Encendido':'Apagado';}
