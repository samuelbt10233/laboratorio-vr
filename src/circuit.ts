export type Kind = 'source' | 'resistor' | 'switch';
export interface Part { id: string; kind: Kind; value: number; closed?: boolean; x: number; z: number }
export interface Wire { id: string; a: string; b: string }
export interface Circuit { parts: Part[]; wires: Wire[] }
export interface Reading { voltage: number; current: number; power: number }
export interface Result { status: 'ok'|'open'|'short'; current: number; resistance: number; readings: Record<string,Reading> }
export const terminal = (id: string, side: number) => `${id}:${side}`;
export function validate(c: Circuit): boolean {
  if (!c || !Array.isArray(c.parts) || !Array.isArray(c.wires) || c.parts.length > 8 || c.wires.length > 32) return false;
  const ids = new Set<string>();
  for (const p of c.parts) {
    if (!p || typeof p.id !== 'string' || !/^[A-Za-z0-9_-]{1,24}$/.test(p.id) || ids.has(p.id) || !['source','resistor','switch'].includes(p.kind) || !Number.isFinite(p.x) || !Number.isFinite(p.z) || Math.abs(p.x)>5 || Math.abs(p.z)>3 || !Number.isFinite(p.value)) return false;
    if (p.kind==='source' && (p.value<1 || p.value>12) || p.kind==='resistor' && (p.value<10 || p.value>1000) || p.kind==='switch' && typeof p.closed!=='boolean') return false;
    ids.add(p.id);
  }
  if(c.parts.filter(p=>p.kind==='source').length!==1) return false;
  const terminals = new Set(c.parts.flatMap(p=>[terminal(p.id,0),terminal(p.id,1)]));
  const wireIds = new Set<string>();
  for(const w of c.wires) { if(!w || typeof w.id!=='string' || wireIds.has(w.id) || !terminals.has(w.a) || !terminals.has(w.b) || w.a===w.b) return false; wireIds.add(w.id); }
  return true;
}
export function solve(c: Circuit): Result {
  if(!validate(c)) throw new Error('Circuito inválido');
  const parent = new Map<string,string>();
  const find = (a:string):string => { const p=parent.get(a); if(!p) {parent.set(a,a);return a;} if(p===a)return a; const r=find(p);parent.set(a,r);return r; };
  const join = (a:string,b:string) => parent.set(find(a),find(b));
  c.parts.forEach(p=>[0,1].forEach(s=>find(terminal(p.id,s))));
  c.wires.forEach(w=>join(w.a,w.b));
  c.parts.filter(p=>p.kind==='switch' && p.closed).forEach(p=>join(terminal(p.id,0),terminal(p.id,1)));
  const source=c.parts.find(p=>p.kind==='source')!;
  const pos=find(terminal(source.id,0)), neg=find(terminal(source.id,1));
  if(pos===neg) return {status:'short',current:0,resistance:0,readings:{}};
  const resistors=c.parts.filter(p=>p.kind==='resistor');
  const graph=new Map<string,Set<string>>();
  resistors.forEach(p=>{const a=find(terminal(p.id,0)),b=find(terminal(p.id,1));for(const [u,v] of [[a,b],[b,a]]){if(!graph.has(u))graph.set(u,new Set());graph.get(u)!.add(v);}});
  const visit=(seeds:string[])=>{const seen=new Set(seeds), queue=[...seeds]; for(let i=0;i<queue.length;i++) for(const n of graph.get(queue[i])??[]) if(!seen.has(n)){seen.add(n);queue.push(n);} return seen;};
  const connected=visit([pos]).has(neg), anchored=visit([pos,neg]);
  const unknown=[...anchored].filter(n=>n!==pos && n!==neg);
  const index=new Map(unknown.map((n,i)=>[n,i]));
  const m=unknown.map(()=>Array(unknown.length+1).fill(0) as number[]);
  const fixed=(n:string)=>n===pos?source.value:0;
  resistors.forEach(p=>{const a=find(terminal(p.id,0)),b=find(terminal(p.id,1));if(a===b)return; for(const [u,v] of [[a,b],[b,a]]){const i=index.get(u); if(i===undefined)continue; const g=1/p.value;m[i][i]+=g; const j=index.get(v);if(j===undefined)m[i][unknown.length]+=g*fixed(v);else m[i][j]-=g;}});
  for(let k=0;k<unknown.length;k++){let pivot=k;for(let i=k+1;i<unknown.length;i++)if(Math.abs(m[i][k])>Math.abs(m[pivot][k]))pivot=i;[m[k],m[pivot]]=[m[pivot],m[k]];const d=m[k][k];if(Math.abs(d)<1e-14)throw new Error('Red singular');for(let j=k;j<=unknown.length;j++)m[k][j]/=d;for(let i=0;i<unknown.length;i++)if(i!==k){const f=m[i][k];for(let j=k;j<=unknown.length;j++)m[i][j]-=f*m[k][j];}}
  const voltage=(n:string)=>index.has(n)?m[index.get(n)!][unknown.length]:fixed(n);
  const readings:Record<string,Reading>={};let current=0;
  resistors.forEach(p=>{const a=find(terminal(p.id,0)),b=find(terminal(p.id,1));const v=anchored.has(a)?voltage(a)-voltage(b):0;const i=v/p.value;readings[p.id]={voltage:v,current:i,power:v*i};if(a===pos)current+=i;if(b===pos)current-=i;});
  current=Math.max(0,current);
  readings[source.id]={voltage:source.value,current,power:source.value*current};
  return {status:connected?'ok':'open',current,resistance:current>1e-12?source.value/current:Infinity,readings};
}
export function preset(type:'simple'|'series'|'parallel'|'empty'):Circuit {
  const source:Part={id:'V1',kind:'source',value:6,x:-3.2,z:0};
  if(type==='empty')return {parts:[source],wires:[]};
  let parts:Part[];
  let links:string[][];
  if(type==='series'){
    // One continuous chain across the back, with the supply below it.
    // Both return paths stay outside the component bodies.
    parts=[
      {...source,x:0,z:-1.7},
      {id:'R1',kind:'resistor',value:100,x:-3.4,z:1.4},
      {id:'R2',kind:'resistor',value:100,x:0,z:1.4},
      {id:'S1',kind:'switch',value:0,closed:true,x:3.4,z:1.4},
    ];
    links=[['V1:0','R1:0'],['R1:1','R2:0'],['R2:1','S1:0'],['S1:1','V1:1']];
  }else if(type==='parallel'){
    // Separate upper and lower branches. Use the outer switch terminal for
    // the branches, leaving the inner terminal for a clear central return.
    parts=[
      {...source,x:-3.4},
      {id:'R1',kind:'resistor',value:100,x:0,z:1.7},
      {id:'R2',kind:'resistor',value:100,x:0,z:-1.7},
      {id:'S1',kind:'switch',value:0,closed:true,x:3.4,z:0},
    ];
    links=[['V1:0','R1:0'],['V1:0','R2:0'],['R1:1','S1:1'],['R2:1','S1:1'],['S1:0','V1:1']];
  }else{
    parts=[source,{id:'R1',kind:'resistor',value:100,x:0,z:-1.2},{id:'S1',kind:'switch',value:0,closed:false,x:3,z:0}];
    links=[['V1:0','R1:0'],['R1:1','S1:0'],['S1:1','V1:1']];
  }
  return {parts,wires:links.map(([a,b],i)=>({id:`w${i}`,a,b}))};
}

/** Validate an editing action without changing the existing circuit. */
export function connect(circuit:Circuit,a:string,b:string):Circuit|string {
  const terminals=new Set(circuit.parts.flatMap(p=>[terminal(p.id,0),terminal(p.id,1)]));
  if(!terminals.has(a)||!terminals.has(b))return 'Selecciona terminales de componentes presentes en la mesa.';
  if(a===b)return 'Elige dos terminales diferentes.';
  if(circuit.wires.some(w=>w.a===a&&w.b===b||w.a===b&&w.b===a))return 'Estos terminales ya están conectados.';
  if(circuit.wires.length>=32)return 'Límite de 32 cables. Elimina alguna conexión.';
  return {...circuit,wires:[...circuit.wires,{id:`w${crypto.randomUUID()}`,a,b}]};
}
