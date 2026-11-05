import { preset, solve, type Circuit } from './circuit';
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
export interface LabClass {id:string;title:string;description:string;duration:string;level:string;initialPreset:PresetName;initialSelection:string;steps:LessonStep[]}
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
/** Compare the electrical mounting, allowing different wire IDs, directions and positions. */
export function matchesCircuit(actual:Circuit,expected:Circuit){
  const edges=(c:Circuit)=>c.wires.map(w=>[w.a,w.b].sort().join('|')).sort();
  return actual.parts.length===expected.parts.length&&actual.wires.length===expected.wires.length&&expected.parts.every(p=>actual.parts.some(a=>a.id===p.id&&a.kind===p.kind&&a.value===p.value&&(p.kind!=='switch'||a.closed===p.closed)))&&JSON.stringify(edges(actual))===JSON.stringify(edges(expected));
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
}
export const classSessionKey=(id:string)=>`class:${id}`;
