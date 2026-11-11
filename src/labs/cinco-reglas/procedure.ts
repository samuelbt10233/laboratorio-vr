/** Didactic five golden rules on a pole-mounted transformer. It must be validated against RETIE and ESSA's procedures. */
export type RuleAction='epp'|'abrir'|'bloquear'|'verificar'|'tierra'|'senalizar';
export interface RuleStep {id:RuleAction;title:string;task:string;why:string;early:string}
export const ruleSteps:readonly RuleStep[]=[
  {id:'epp',title:'Equipo de protección',task:'Colocarse el EPP: casco, guantes dieléctricos, gafas y ropa ignífuga.',why:'El EPP es la última barrera de protección ante una falla.',early:'Antes de aproximarse a la red se debe portar el equipo de protección.'},
  {id:'abrir',title:'1. Cortar las fuentes',task:'Abrir los tres cortacircuitos con la pértiga.',why:'La apertura con corte visible separa el transformador de la red.',early:'Primero se cortan todas las fuentes: abrir los cortacircuitos con la pértiga.'},
  {id:'bloquear',title:'2. Bloquear y señalizar el corte',task:'Instalar la tarjeta «Peligro, no operar» en el punto de corte.',why:'El bloqueo impide cerrar los cortacircuitos mientras la cuadrilla trabaja.',early:'La tarjeta se instala sobre un punto de corte ya abierto: abrir antes los cortacircuitos.'},
  {id:'verificar',title:'3. Verificar ausencia de tensión',task:'Probar el detector y verificar cada fase.',why:'El detector confirma, fase por fase, la ausencia de tensión.',early:'El detector indica tensión: el tramo sigue energizado. Cortar y bloquear antes de verificar.'},
  {id:'tierra',title:'4. Poner a tierra y en cortocircuito',task:'Instalar el equipo de puesta a tierra en las tres fases.',why:'Ante una reenergización accidental, la protección actúa y la cuadrilla queda protegida.',early:''},
  {id:'senalizar',title:'5. Señalizar la zona de trabajo',task:'Delimitar la zona con conos y cinta.',why:'Peatones y vehículos quedan fuera del área de riesgo.',early:'La zona se delimita al final, con el tramo ya puesto a tierra.'},
];
export interface RuleState {done:RuleAction[];errors:number;finished:boolean;arc:boolean}
export interface RuleResult {state:RuleState;ok:boolean;arc:boolean;message:string}
export const startProcedure=():RuleState=>({done:[],errors:0,finished:false,arc:false});
export function nextStep(state:RuleState){return ruleSteps[state.done.length]??null;}
export const ARC_MESSAGE='¡Arco eléctrico! Se puso a tierra sin verificar la ausencia de tensión y el tramo seguía energizado. Un arco causa quemaduras graves, lesiones oculares y caídas desde altura. Sin verificación no es posible saber si hay tensión: una maniobra errónea, un generador particular o una inducción pueden mantenerla.';
/** A wrong order is counted once and changes nothing else, except grounding before verifying: that is an arc and the practice stops. */
export function attempt(state:RuleState,action:RuleAction):RuleResult{
  if(state.arc)return {state,ok:false,arc:false,message:'La práctica se detuvo por el arco eléctrico. Pulsar «Reiniciar» para repetirla.'};
  if(state.finished)return {state,ok:false,arc:false,message:'La práctica ya está completa. Pulsar «Reiniciar» para repetirla.'};
  const step=ruleSteps.find(s=>s.id===action)!,next=nextStep(state)!;
  if(state.done.includes(action))return {state,ok:false,arc:false,message:`«${step.title}» ya está completado. Paso siguiente: ${next.task}`};
  if(action==='tierra'&&!state.done.includes('verificar'))return {state:{...state,errors:state.errors+1,arc:true},ok:false,arc:true,message:ARC_MESSAGE};
  if(action!==next.id)return {state:{...state,errors:state.errors+1},ok:false,arc:false,message:`Error de secuencia. ${step.early} Paso siguiente: ${next.task}`};
  const done=[...state.done,action],finished=done.length===ruleSteps.length;
  return {state:{...state,done,finished},ok:true,arc:false,message:finished?'Práctica completa: el tramo está sin tensión, puesto a tierra y señalizado. Condiciones seguras para iniciar el trabajo.':`Correcto. ${step.why} Paso siguiente: ${ruleSteps[done.length].task}`};
}
