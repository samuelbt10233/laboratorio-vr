import { preset, solve, terminal, type Circuit } from './circuit';
export type PresetName='simple'|'series'|'parallel'|'empty';
export type AppAction='move'|'disconnect'|'connect'|'charts'|'save';
export type Goal=
  | {kind:'diagnose';expected:Circuit;hint:string}
  | {kind:'action';action:AppAction;hint:string;target?:string}
  | {kind:'value';part:string;value:number;unit:string}
  | {kind:'closed';part:string}
  | {kind:'measurement';quantity:'current'|'resistance';value:number}
  | {kind:'inspect';parts:string[]};
export interface LessonStep {id:string;title:string;text:string;task:string;hint?:string;setup?:Circuit;audio:string;success:{text:string;audio:string};repairPreset:PresetName;goals:Goal[]}
export interface LabClass {laboratoryId:string|null;id:string;title:string;description:string;duration:string;level:string;initialPreset:PresetName;initialSelection:string;steps:LessonStep[]}
export interface ClassContext {circuit:Circuit;selected:string;seen:Set<string>}
export type PendingGoal=Exclude<Goal,{kind:'inspect'|'measurement'}>|{kind:'inspect';part:string}|{kind:'repair';preset:PresetName};
// Ordered goals keep instructions and advancement governed by the same rules.
export function pendingGoal(step:LessonStep,context:ClassContext):PendingGoal|null {
  const {circuit,selected,seen}=context;
  const result=solve(circuit);
  for(const goal of step.goals){
    if(goal.kind==='diagnose'){
      if(!matchesCircuit(circuit,goal.expected))return goal;
    }else if(goal.kind==='action'){
      if(!seen.has(`action:${goal.action}`))return goal;
    }else if(goal.kind==='inspect'){
      if(goal.parts.includes(selected))seen.add(selected);
      const missing=goal.parts.find(id=>!seen.has(id));
      if(missing)return circuit.parts.some(p=>p.id===missing)?{kind:'inspect',part:missing}:{kind:'repair',preset:step.repairPreset};
    }else if(goal.kind==='measurement'){
      if(result.status!=='ok'||Math.abs(result[goal.quantity]-goal.value)>1e-8){seen.clear();return {kind:'repair',preset:step.repairPreset};}
    }else{
      const part=circuit.parts.find(p=>p.id===goal.part);
      if(!part){seen.clear();return {kind:'repair',preset:step.repairPreset};}
      if(goal.kind==='value'?part.value!==goal.value:!part.closed){seen.clear();return goal;}
    }
  }
  return null;
}
/** Terminals joined by wires, in a canonical form. A closed switch stays a component, so bypassing it changes the result. */
function netlist(circuit:Circuit,reversed:string[]=[]){
  const pin=(id:string)=>{const [part,side]=id.split(':');return reversed.includes(part)?terminal(part,side==='0'?1:0):id;};
  const parent=new Map<string,string>();
  const find=(id:string):string=>{const p=parent.get(id)??id;if(p===id)return id;const root=find(p);parent.set(id,root);return root;};
  for(const w of circuit.wires)parent.set(find(pin(w.a)),find(pin(w.b)));
  const groups=new Map<string,string[]>();
  for(const p of circuit.parts)for(const side of [0,1]){const id=terminal(p.id,side),root=find(id);groups.set(root,[...(groups.get(root)??[]),id]);}
  return [...groups.values()].map(group=>group.sort().join('|')).sort().join(' ');
}
/** Compare the electrical mounting, allowing different wires and positions. Resistors and switches have no polarity. */
export function matchesCircuit(actual:Circuit,expected:Circuit){
  if(actual.parts.length!==expected.parts.length||!expected.parts.every(p=>actual.parts.some(a=>a.id===p.id&&a.kind===p.kind&&a.value===p.value&&(p.kind!=='switch'||a.closed===p.closed))))return false;
  const target=netlist(expected),reversible=expected.parts.filter(p=>p.kind==='resistor'||p.kind==='switch').map(p=>p.id);
  // At most seven reversible parts (128 orientations).
  for(let mask=0;mask<2**reversible.length;mask++)if(netlist(actual,reversible.filter((_,i)=>mask&(1<<i)))===target)return true;
  return false;
}
/** A correct reading on another mounting needs its own explanation: the step will not advance. */
export function diagnoseHint(goal:Extract<Goal,{kind:'diagnose'}>,circuit:Circuit){
  const result=solve(circuit);
  return result.status==='ok'&&Math.abs(result.current-solve(goal.expected).current)<1e-9?'La corriente ya es correcta, pero el recorrido todavía no coincide con el del reto. Sigue los cables y comprueba que pase por cada componente en orden.':goal.hint;
}
export function createStepCircuit(definition:LabClass,index:number){return structuredClone(definition.steps[index].setup??preset(definition.initialPreset));}
/** Register only the current action; reconnecting must restore the removed endpoints. */
export function recordAppAction(step:LessonStep,context:ClassContext,action:AppAction,wire?:{a:string;b:string}){
  const goal=pendingGoal(step,context);
  if(goal?.kind!=='action'||goal.action!==action)return false;
  const key=wire?`wire:${[wire.a,wire.b].sort().join('|')}`:null;
  if(action==='disconnect'){
    if(!key)return false;
    context.seen.add(key);
  }
  if(action==='connect'&&(!key||!context.seen.has(key)))return false;
  context.seen.add(`action:${action}`);return true;
}
export interface LabSession {circuit:Circuit;selected:string;step:number;seen:string[];completed:boolean}
export class SessionStore {
  private sessions=new Map<string,LabSession>();
  save(key:string,session:LabSession){this.sessions.set(key,structuredClone(session));}
  get(key:string){const session=this.sessions.get(key);return session?structuredClone(session):undefined;}
  has(key:string){return this.sessions.has(key);}
  delete(key:string){this.sessions.delete(key);}
}
export const classSessionKey=(id:string)=>`class:${id}`;
