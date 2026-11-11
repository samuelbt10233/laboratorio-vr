/** Didactic cutout maneuver with a hot stick on a pole-mounted transformer. It must be validated against RETIE and ESSA's procedures. */
export type SwitchStepId='orden'|'epp'|'pertiga'|'posicion'|`abrir-${1|2|3}`|`cerrar-${1|2|3}`;
/** What can be picked in the scene: a kit item, a place to stand or one of the three fuses. */
export type SwitchAction='orden'|'epp'|'pertiga'|'posicion'|'debajo'|`fase-${1|2|3}`;
export interface SwitchStep {id:SwitchStepId;group:'Preparación'|'Apertura'|'Cierre';title:string;task:string;why:string;early:string}
const PREP_EARLY='Antes de operar los cortacircuitos se confirma la orden de maniobra y se completa la preparación.';
export const switchSteps:readonly SwitchStep[]=[
  {id:'orden',group:'Preparación',title:'Orden de maniobra',task:'Confirmar la orden de maniobra: equipo, circuito y secuencia.',why:'La orden confirma que se opera el equipo correcto y que el centro de control está informado.',early:'Primero se confirma la orden de maniobra.'},
  {id:'epp',group:'Preparación',title:'Equipo de protección',task:'Colocarse casco, careta, guantes dieléctricos con protector y ropa ignífuga.',why:'La careta y la ropa ignífuga protegen del arco y del material fundido.',early:'El equipo de protección se coloca antes de tomar la pértiga.'},
  {id:'pertiga',group:'Preparación',title:'Inspección de la pértiga',task:'Inspeccionar la pértiga: limpia, seca y sin fisuras.',why:'La humedad y la suciedad reducen el aislamiento de la pértiga.',early:'La pértiga se inspecciona antes de situarse bajo la red.'},
  {id:'posicion',group:'Preparación',title:'Posición del operador',task:'Situarse a un lado del eje de los cortacircuitos, nunca debajo.',why:'Fuera del eje, el material fundido de una apertura con carga no cae sobre el operador.',early:'La posición se elige con el equipo y la pértiga listos.'},
  {id:'abrir-2',group:'Apertura',title:'Abrir la fase central (L2)',task:'Abrir el cortacircuitos central (L2) con la pértiga.',why:'La fase central se abre primero: el arco no tiene otra fase al lado hacia la que extenderse.',early:'Se abre primero la fase central (L2).'},
  {id:'abrir-1',group:'Apertura',title:'Abrir la lateral L1',task:'Abrir la lateral hacia la que sopla el viento (L1).',why:'El viento lleva el arco de L1 lejos de las otras fases.',early:'Después de la central se abre la lateral hacia la que sopla el viento (L1).'},
  {id:'abrir-3',group:'Apertura',title:'Abrir la lateral L3',task:'Abrir el último cortacircuitos (L3).',why:'Si se forma un arco en L3, el viento lo lleva hacia fases ya abiertas. Las tres quedan con corte visible desde el suelo.',early:'L3 es la última fase en abrirse.'},
  {id:'cerrar-3',group:'Cierre',title:'Cerrar L3',task:'Cerrar el cortacircuitos L3 con un movimiento firme.',why:'El cierre sigue el orden inverso de la apertura.',early:'El cierre empieza por la última fase abierta (L3).'},
  {id:'cerrar-1',group:'Cierre',title:'Cerrar L1',task:'Cerrar el cortacircuitos L1 con un movimiento firme.',why:'Un cierre firme, sin detenerse a mitad del recorrido, evita prolongar el arco.',early:'Después de L3 se cierra L1.'},
  {id:'cerrar-2',group:'Cierre',title:'Cerrar la fase central (L2)',task:'Cerrar el cortacircuitos central (L2).',why:'La fase central se cierra al final, en orden inverso a la apertura.',early:'La fase central (L2) se cierra al final.'},
];
export interface SwitchState {done:SwitchStepId[];errors:number;finished:boolean}
export interface SwitchResult {state:SwitchState;ok:boolean;spark:boolean;message:string}
export const startManeuver=():SwitchState=>({done:[],errors:0,finished:false});
export function nextStep(state:SwitchState){return switchSteps[state.done.length]??null;}
export function fuseOpen(state:SwitchState,phase:number){return state.done.includes(`abrir-${phase}` as SwitchStepId)&&!state.done.includes(`cerrar-${phase}` as SwitchStepId);}
const UNDER='Error de posición. Debajo del eje de los cortacircuitos, el material fundido de una apertura con carga cae sobre el operador.';
/** Wrong orders are counted once and change nothing; operating the wrong fuse also draws an arc in the scene, but the practice goes on. */
export function attempt(state:SwitchState,action:SwitchAction):SwitchResult{
  if(state.finished)return {state,ok:false,spark:false,message:'La maniobra ya está completa. Pulsar «Reiniciar» para repetirla.'};
  const next=nextStep(state)!,fail=(message:string,spark=false):SwitchResult=>({state:{...state,errors:state.errors+1},ok:false,spark,message:`${message} Paso siguiente: ${next.task}`});
  if(action==='debajo')return fail(UNDER);
  let id:SwitchStepId=action as SwitchStepId;
  if(action.startsWith('fase-')){
    const phase=Number(action.slice(5));id=`${fuseOpen(state,phase)?'cerrar':'abrir'}-${phase}` as SwitchStepId;
    if(next.group==='Preparación')return fail(`Error de secuencia. ${PREP_EARLY}`);
    if(id!==next.id)return fail(`Arco en L${phase}: se operó la fase equivocada. ${next.early}`,true);
  }
  const step=switchSteps.find(s=>s.id===id)!;
  if(state.done.includes(id))return {state,ok:false,spark:false,message:`«${step.title}» ya está completado. Paso siguiente: ${next.task}`};
  if(id!==next.id)return fail(`Error de secuencia. ${step.group==='Preparación'?next.early:PREP_EARLY}`);
  const done=[...state.done,id],finished=done.length===switchSteps.length;
  return {state:{...state,done,finished},ok:true,spark:false,message:finished?'Maniobra completa: apertura y cierre en el orden correcto, desde una posición segura.':`Correcto. ${step.why} Paso siguiente: ${switchSteps[done.length].task}`};
}
