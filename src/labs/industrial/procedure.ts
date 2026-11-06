/** Didactic lockout/tagout sequence for a conveyor. It does not replace the company's own procedure. */
export type LotoAction='avisar'|'apagar'|'aislar'|'bloquear'|'liberar'|'verificar';
export interface LotoStep {id:LotoAction;title:string;task:string;why:string;early:string}
export const lotoSteps:readonly LotoStep[]=[
  {id:'avisar',title:'Avisar',task:'Avisa al equipo con el intercomunicador.',why:'Nadie debe operar la máquina mientras alguien trabaja en ella.',early:'Antes de tocar la máquina, el equipo debe saber que va a detenerse.'},
  {id:'apagar',title:'Apagar',task:'Detén la cinta con el botón rojo del panel.',why:'Parar con el control evita abrir el seccionador con la máquina en carga.',early:'Primero detén la máquina desde su panel de control.'},
  {id:'aislar',title:'Aislar',task:'Abre el seccionador principal para cortar la energía.',why:'Corta la fuente eléctrica: el panel por sí solo no basta, alguien podría reactivarlo.',early:'Aún no puedes aislar la energía: antes avisa y detén la máquina.'},
  {id:'bloquear',title:'Bloquear',task:'Coloca tu candado y la etiqueta en el seccionador.',why:'El candado impide que otra persona vuelva a conectarlo; la etiqueta dice quién trabaja.',early:'El candado va sobre el seccionador ya abierto: sigue los pasos anteriores.'},
  {id:'liberar',title:'Liberar energía',task:'Abre la purga del tanque para liberar el aire a presión.',why:'La energía almacenada puede mover la máquina aunque no haya electricidad.',early:'Primero deja la máquina aislada y bloqueada; después libera la energía almacenada.'},
  {id:'verificar',title:'Verificar',task:'Pulsa «Arranque»: la máquina no debe moverse.',why:'Solo una prueba de arranque sin respuesta confirma que está sin energía.',early:'No pruebes el arranque antes de liberar la energía: sería peligroso.'},
];
export interface LotoState {done:LotoAction[];errors:number;finished:boolean}
export interface LotoResult {state:LotoState;ok:boolean;message:string}
export const startProcedure=():LotoState=>({done:[],errors:0,finished:false});
export function nextStep(state:LotoState){return lotoSteps[state.done.length]??null;}
/** A wrong order is counted once and changes nothing else; repeating a finished step is not an error. */
export function attempt(state:LotoState,action:LotoAction):LotoResult{
  if(state.finished)return {state,ok:false,message:'El procedimiento ya está completo. Reinicia la práctica para repetirlo.'};
  const step=lotoSteps.find(s=>s.id===action)!,next=nextStep(state)!;
  if(state.done.includes(action))return {state,ok:false,message:`«${step.title}» ya está hecho. Ahora toca: ${next.task}`};
  if(action!==next.id)return {state:{...state,errors:state.errors+1},ok:false,message:`${step.early} Ahora toca: ${next.title.toLowerCase()}.`};
  const done=[...state.done,action],finished=done.length===lotoSteps.length;
  return {state:{done,errors:state.errors,finished},ok:true,message:finished?'Procedimiento completo: la máquina está sin energía y es seguro intervenir.':`Bien. ${step.why} Siguiente: ${lotoSteps[done.length].task}`};
}
