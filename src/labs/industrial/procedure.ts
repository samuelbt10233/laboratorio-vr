/** Didactic lockout/tagout sequence for a conveyor. It does not replace the company's own procedure. */
export type LotoAction='avisar'|'apagar'|'aislar'|'bloquear'|'liberar'|'verificar';
export interface LotoStep {id:LotoAction;title:string;task:string;why:string;early:string}
export const lotoSteps:readonly LotoStep[]=[
  {id:'avisar',title:'Avisar',task:'Avisar al equipo con el intercomunicador.',why:'Nadie debe operar la máquina mientras alguien trabaja en ella.',early:'Antes de intervenir la máquina, el equipo debe saber que va a detenerse.'},
  {id:'apagar',title:'Apagar',task:'Detener la cinta con el botón rojo del panel.',why:'Detener desde el control evita abrir el seccionador con la máquina en carga.',early:'Primero se detiene la máquina desde su panel de control.'},
  {id:'aislar',title:'Aislar',task:'Abrir el seccionador principal para cortar la energía.',why:'El seccionador corta la fuente eléctrica; el panel por sí solo no basta, alguien podría reactivarlo.',early:'Aún no se puede aislar la energía: antes se avisa al equipo y se detiene la máquina.'},
  {id:'bloquear',title:'Bloquear',task:'Colocar el candado personal y la etiqueta en el seccionador.',why:'El candado impide la reconexión; la etiqueta identifica a quien trabaja.',early:'El candado se coloca sobre el seccionador ya abierto: completar los pasos anteriores.'},
  {id:'liberar',title:'Liberar energía',task:'Abrir la purga del tanque para liberar el aire a presión.',why:'La energía almacenada puede mover la máquina aunque no haya electricidad.',early:'Primero la máquina queda aislada y bloqueada; después se libera la energía almacenada.'},
  {id:'verificar',title:'Verificar',task:'Pulsar «Arranque»: la máquina no debe moverse.',why:'Solo una prueba de arranque sin respuesta confirma la ausencia de energía.',early:'El arranque no se prueba antes de liberar la energía: sería peligroso.'},
];
export interface LotoState {done:LotoAction[];errors:number;finished:boolean}
export interface LotoResult {state:LotoState;ok:boolean;message:string}
export const startProcedure=():LotoState=>({done:[],errors:0,finished:false});
export function nextStep(state:LotoState){return lotoSteps[state.done.length]??null;}
/** A wrong order is counted once and changes nothing else; repeating a finished step is not an error. */
export function attempt(state:LotoState,action:LotoAction):LotoResult{
  if(state.finished)return {state,ok:false,message:'El procedimiento ya está completo. Pulsar «Reiniciar» para repetirlo.'};
  const step=lotoSteps.find(s=>s.id===action)!,next=nextStep(state)!;
  if(state.done.includes(action))return {state,ok:false,message:`«${step.title}» ya está completado. Paso siguiente: ${next.task}`};
  if(action!==next.id)return {state:{...state,errors:state.errors+1},ok:false,message:`Error de secuencia. ${step.early} Paso siguiente: ${next.title.toLowerCase()}.`};
  const done=[...state.done,action],finished=done.length===lotoSteps.length;
  return {state:{done,errors:state.errors,finished},ok:true,message:finished?'Procedimiento completo: la máquina está sin energía y en condiciones seguras para intervenir.':`Correcto. ${step.why} Paso siguiente: ${lotoSteps[done.length].task}`};
}
