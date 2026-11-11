/** Didactic inspection of personal protective equipment before a maneuver. It must be validated against RETIE and ESSA's procedures. */
export type EppId='guante-a'|'guante-b'|'guante-c'|'protector'|'casco'|'careta';
export type Verdict='apto'|'retirar';
export interface EppItem {id:EppId;name:string;visual:string[];inflate?:string;defect:string|null}
export const eppItems:readonly EppItem[]=[
  {id:'guante-a',name:'Guantes dieléctricos · par 1',visual:['Marcación legible: clase adecuada y ensayo vigente.','Sin cortes, poros visibles ni zonas resecas.'],inflate:'Inflado: el guante conserva el aire.',defect:null},
  {id:'guante-b',name:'Guantes dieléctricos · par 2',visual:['Marcación legible: clase adecuada y ensayo vigente.','Sin daños visibles a simple vista.'],inflate:'Inflado: el guante pierde aire por un poro en un dedo.',defect:'El poro deja pasar la corriente aunque no se vea a simple vista.'},
  {id:'guante-c',name:'Guantes dieléctricos · par 3',visual:['Marcación legible: el último ensayo dieléctrico está vencido.','Sin daños visibles.'],inflate:'Inflado: el guante conserva el aire.',defect:'Sin ensayo vigente no se puede confirmar que el aislamiento resista la tensión.'},
  {id:'protector',name:'Guantes protectores de cuero',visual:['Cuero completo, sin cortes ni perforaciones.','Sin aceite ni humedad.'],defect:null},
  {id:'casco',name:'Casco dieléctrico',visual:['Fisura en la parte superior del casquete.','Barbuquejo y suspensión completos.'],defect:'Un casco con fisura no protege del impacto ni aísla.'},
  {id:'careta',name:'Careta de protección facial',visual:['Visor transparente, sin rayas profundas.','Soporte firme.'],defect:null},
];
export interface EppState {inspected:EppId[];inflated:EppId[];findings:Partial<Record<EppId,string[]>>;decided:Partial<Record<EppId,Verdict>>;errors:number;finished:boolean}
export interface EppResult {state:EppState;ok:boolean;message:string}
export const startInspection=():EppState=>({inspected:[],inflated:[],findings:{},decided:{},errors:0,finished:false});
const item=(id:EppId)=>eppItems.find(i=>i.id===id)!;
const DONE='La inspección ya está completa. Pulsar «Reiniciar» para repetirla.';
const remaining=(state:EppState)=>eppItems.length-Object.keys(state.decided).length;
const left=(state:EppState)=>{const n=remaining(state);return n?`Quedan ${n} ${n===1?'elemento':'elementos'} por revisar.`:'';};
export function inspect(state:EppState,id:EppId):EppResult{
  if(state.finished)return {state,ok:false,message:DONE};
  const it=item(id);if(state.inspected.includes(id))return {state,ok:true,message:`${it.name}: ${it.inflate&&!state.inflated.includes(id)?'falta inflarlo antes de decidir.':'decidir si está apto o se retira.'}`};
  return {state:{...state,inspected:[...state.inspected,id],findings:{...state.findings,[id]:[...it.visual]}},ok:true,message:`${it.name}: revisión visual hecha. ${it.inflate?'Inflar el guante antes de decidir.':'Decidir si está apto o se retira.'}`};
}
export function inflate(state:EppState,id:EppId):EppResult{
  if(state.finished)return {state,ok:false,message:DONE};
  const it=item(id);
  if(!it.inflate)return {state,ok:false,message:`${it.name} no se infla: la prueba de inflado es para los guantes dieléctricos.`};
  if(!state.inspected.includes(id))return {state:{...state,errors:state.errors+1},ok:false,message:'Error de inspección. Primero se hace la revisión visual y se lee la marcación del guante.'};
  if(state.inflated.includes(id))return {state,ok:true,message:it.inflate};
  return {state:{...state,inflated:[...state.inflated,id],findings:{...state.findings,[id]:[...state.findings[id]!,it.inflate]}},ok:true,message:`${it.inflate} Decidir si está apto o se retira.`};
}
export function decide(state:EppState,id:EppId,verdict:Verdict):EppResult{
  if(state.finished)return {state,ok:false,message:DONE};
  const it=item(id),fail=(message:string):EppResult=>({state:{...state,errors:state.errors+1},ok:false,message});
  if(state.decided[id])return {state,ok:false,message:`${it.name} ya está revisado. ${left(state)}`};
  if(!state.inspected.includes(id))return fail('Error de inspección. Ningún elemento se declara apto o se retira sin revisarlo.');
  if(it.inflate&&!state.inflated.includes(id))return fail('Error de inspección. Los guantes dieléctricos se inflan antes de decidir: un poro no siempre se ve.');
  const right:Verdict=it.defect?'retirar':'apto';
  if(verdict!==right)return fail(it.defect?`Error: elemento defectuoso en servicio. ${it.defect}`:`Error: ${it.name} está en buen estado. Retirarlo deja a la cuadrilla sin el equipo necesario.`);
  const decided={...state.decided,[id]:verdict},finished=Object.keys(decided).length===eppItems.length,next={...state,decided,finished};
  return {state:next,ok:true,message:finished?'Inspección completa: los elementos defectuosos quedaron retirados y reportados.':`Correcto. ${it.defect?`Retirado y reportado. ${it.defect}`:'Apto para el uso.'} ${left(next)}`};
}
