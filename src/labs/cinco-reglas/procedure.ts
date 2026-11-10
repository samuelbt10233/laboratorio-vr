/** Didactic five golden rules on a pole-mounted transformer. It must be validated against RETIE and ESSA's procedures. */
export type RuleAction='epp'|'abrir'|'bloquear'|'verificar'|'tierra'|'senalizar';
export interface RuleStep {id:RuleAction;title:string;task:string;why:string;early:string}
export const ruleSteps:readonly RuleStep[]=[
  {id:'epp',title:'Equipo de protección',task:'Ponte el EPP: casco y guantes dieléctricos, gafas y ropa ignífuga.',why:'El EPP es la última barrera si algo falla.',early:'Antes de acercarte a la red, ponte el equipo de protección.'},
  {id:'abrir',title:'1. Cortar las fuentes',task:'Abre los tres cortacircuitos con la pértiga.',why:'Abrir con corte visible separa el transformador de la red.',early:'Primero corta todas las fuentes: abre los cortacircuitos con la pértiga.'},
  {id:'bloquear',title:'2. Bloquear y señalizar el corte',task:'Coloca la tarjeta «Peligro, no operar» en el punto de corte.',why:'Nadie volverá a cerrar los cortacircuitos mientras la cuadrilla trabaja.',early:'La tarjeta va sobre un punto de corte ya abierto: abre antes los cortacircuitos.'},
  {id:'verificar',title:'3. Verificar ausencia de tensión',task:'Prueba el detector y comprueba cada fase.',why:'El detector confirma, fase por fase, que el tramo está sin tensión.',early:'El detector indica tensión: el tramo sigue energizado. Corta y bloquea antes de verificar.'},
  {id:'tierra',title:'4. Poner a tierra y en cortocircuito',task:'Instala el equipo de puesta a tierra en las tres fases.',why:'Si alguien energiza el tramo por error, la protección actúa y la cuadrilla queda a salvo.',early:''},
  {id:'senalizar',title:'5. Señalizar la zona de trabajo',task:'Delimita la zona con conos y cinta.',why:'Peatones y vehículos quedan fuera del área de riesgo.',early:'La zona se delimita al final, con el tramo ya puesto a tierra.'},
];
export interface RuleState {done:RuleAction[];errors:number;finished:boolean;arc:boolean}
export interface RuleResult {state:RuleState;ok:boolean;arc:boolean;message:string}
export const startProcedure=():RuleState=>({done:[],errors:0,finished:false,arc:false});
export function nextStep(state:RuleState){return ruleSteps[state.done.length]??null;}
export const ARC_MESSAGE='¡Arco eléctrico! Pusiste a tierra sin verificar la ausencia de tensión, y el tramo seguía energizado. Un arco causa quemaduras graves, lesiones en los ojos y caídas desde la altura. Sin verificar no puedes saber si hay tensión: una maniobra equivocada, un generador particular o una inducción pueden mantenerla.';
/** A wrong order is counted once and changes nothing else, except grounding before verifying: that is an arc and the practice stops. */
export function attempt(state:RuleState,action:RuleAction):RuleResult{
  if(state.arc)return {state,ok:false,arc:false,message:'La práctica se detuvo por el arco eléctrico. Reinicia para repetirla.'};
  if(state.finished)return {state,ok:false,arc:false,message:'La práctica ya está completa. Reinicia para repetirla.'};
  const step=ruleSteps.find(s=>s.id===action)!,next=nextStep(state)!;
  if(state.done.includes(action))return {state,ok:false,arc:false,message:`«${step.title}» ya está hecho. Ahora toca: ${next.task}`};
  if(action==='tierra'&&!state.done.includes('verificar'))return {state:{...state,errors:state.errors+1,arc:true},ok:false,arc:true,message:ARC_MESSAGE};
  if(action!==next.id)return {state:{...state,errors:state.errors+1},ok:false,arc:false,message:`${step.early} Ahora toca: ${next.task}`};
  const done=[...state.done,action],finished=done.length===ruleSteps.length;
  return {state:{...state,done,finished},ok:true,arc:false,message:finished?'Práctica completa: el tramo está sin tensión, puesto a tierra y señalizado. Es seguro trabajar.':`Bien. ${step.why} Siguiente: ${ruleSteps[done.length].task}`};
}
