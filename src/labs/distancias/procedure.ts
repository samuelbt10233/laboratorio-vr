/** Didactic safety distances while installing a streetlight under an energized line. Zones are illustrative: real distances come from the RETIE and ESSA's procedures. */
export type DistanceStepId='linea'|'observador'|'pos-b'|'cubiertas'|'luminaria';
/** What can be picked in the scene: the line, the observer, one of three bucket positions, the covers kit or the streetlight. */
export type DistanceAction=DistanceStepId|'pos-a'|'pos-c';
export interface DistanceStep {id:DistanceStepId;title:string;task:string;why:string;early:string}
export const distanceSteps:readonly DistanceStep[]=[
  {id:'linea',title:'Identificar las partes energizadas',task:'Señalar la red energizada que pasa sobre el punto de trabajo.',why:'Ahora se ven las zonas alrededor de cada conductor: peligro en rojo y proximidad en amarillo.',early:'Primero se identifican las partes energizadas y sus zonas.'},
  {id:'observador',title:'Designar un observador',task:'Designar al auxiliar como observador dedicado.',why:'El observador vigila la aproximación de la canasta y detiene la maniobra si la distancia se reduce.',early:'Antes de mover la canasta se designa un observador dedicado.'},
  {id:'pos-b',title:'Posicionar la canasta',task:'Llevar la canasta a la posición que alcanza la luminaria sin entrar en la zona de peligro.',why:'La canasta queda a la altura del trabajo, dentro de la zona de proximidad pero fuera de la de peligro.',early:'La canasta se posiciona con el observador designado.'},
  {id:'cubiertas',title:'Cubrir la fase más próxima',task:'Instalar las cubiertas aislantes en la fase más próxima.',why:'La cubierta evita un contacto accidental si una herramienta o un movimiento se acercan a la fase.',early:'Las cubiertas se instalan desde la canasta ya posicionada.'},
  {id:'luminaria',title:'Instalar la luminaria',task:'Instalar la luminaria en el poste.',why:'',early:'El trabajo empieza con la fase más próxima cubierta.'},
];
export interface DistanceState {done:DistanceStepId[];errors:number;finished:boolean}
export interface DistanceResult {state:DistanceState;ok:boolean;invasion:boolean;message:string}
export const startDistances=():DistanceState=>({done:[],errors:0,finished:false});
export function nextStep(state:DistanceState){return distanceSteps[state.done.length]??null;}
const FAR='Desde esa posición la canasta no alcanza la luminaria: el operario tendría que estirarse y acercar el cuerpo o las herramientas a la red sin control.';
const DANGER='Invasión de la zona de peligro: la canasta quedó junto a los conductores. Solo se entra en esa zona con técnicas y equipos de trabajo en tensión.';
const NO_COVER='Error: la fase más próxima sigue sin cubierta aislante y queda al alcance de las herramientas.';
/** Wrong choices are counted once and change nothing; entering the danger zone also flashes in the scene, but the practice goes on. */
export function attempt(state:DistanceState,action:DistanceAction):DistanceResult{
  if(state.finished)return {state,ok:false,invasion:false,message:'La práctica ya está completa. Pulsar «Reiniciar» para repetirla.'};
  const next=nextStep(state)!,fail=(message:string,invasion=false):DistanceResult=>({state:{...state,errors:state.errors+1},ok:false,invasion,message:`${message} Paso siguiente: ${next.task}`});
  if(action!=='linea'&&!state.done.includes('linea'))return fail(`Error de secuencia. ${distanceSteps[0].early}`);
  if(action==='pos-a')return fail(DANGER,true);
  if(action==='pos-c')return fail(FAR);
  const step=distanceSteps.find(s=>s.id===action)!;
  if(state.done.includes(action))return {state,ok:false,invasion:false,message:`«${step.title}» ya está completado. Paso siguiente: ${next.task}`};
  if(action==='luminaria'&&!state.done.includes('cubiertas'))return fail(NO_COVER);
  if(action!==next.id)return fail(`Error de secuencia. ${next.early}`);
  const done=[...state.done,action],finished=done.length===distanceSteps.length;
  return {state:{...state,done,finished},ok:true,invasion:false,message:finished?'Práctica completa: la luminaria quedó instalada sin invadir la zona de peligro, con la fase cubierta y un observador dedicado.':`Correcto. ${step.why} Paso siguiente: ${distanceSteps[done.length].task}`};
}
