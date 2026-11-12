import { evaluacionesDistribucion } from './evaluaciones-distribucion';
import { evaluacionesFundamentos } from './evaluaciones-fundamentos';
import { evaluacionesMedida } from './evaluaciones-medida';
import { evaluacionesOperacion } from './evaluaciones-operacion';
import { evaluacionesFinanzas } from './evaluaciones-finanzas';
import { evaluacionesComplementaria } from './evaluaciones-complementaria';
/** Demo knowledge checks, one per class shown to ESSA. Questions come from each class's own reading; distribution content still needs validation against the RETIE and ESSA's procedures. */
export interface Question {prompt:string;options:string[];answer:number;why:string}
const EVALUATIONS:Record<string,Question[]>={
  ...evaluacionesDistribucion,...evaluacionesOperacion,...evaluacionesMedida,...evaluacionesFundamentos,...evaluacionesFinanzas,...evaluacionesComplementaria,
  'ley-de-ohm':[
    {prompt:'Con 6 V y una resistencia de 100 Ω, ¿cuánta corriente circula?',options:['6 mA','60 mA','600 mA'],answer:1,why:'I = V / R = 6 / 100 = 0,06 A, es decir, 60 mA.'},
    {prompt:'Si se duplica la resistencia y se mantiene el voltaje, la corriente…',options:['se duplica','se reduce a la mitad','no cambia'],answer:1,why:'Con el mismo voltaje, el doble de resistencia deja pasar la mitad de corriente: de 60 a 30 mA.'},
    {prompt:'Dos resistencias de 100 Ω en serie con 6 V. ¿Qué corriente pasa por cada una?',options:['30 mA por ambas','60 mA por la primera y 0 por la segunda','30 mA por la primera y 15 mA por la segunda'],answer:0,why:'En serie la corriente no se divide ni se consume: 6 V / 200 Ω = 30 mA en las dos.'},
  ],
  'circuitos-en-paralelo':[
    {prompt:'Dos resistencias de 100 Ω en paralelo con una fuente de 6 V. ¿Qué voltaje tiene cada rama?',options:['3 V','6 V','12 V'],answer:1,why:'Cada rama queda conectada entre los mismos polos de la fuente: las dos tienen 6 V.'},
    {prompt:'Si una rama conduce 60 mA y la otra 30 mA, ¿cuánto entrega la fuente?',options:['30 mA','60 mA','90 mA'],answer:2,why:'La corriente total es la suma de las ramas: 60 + 30 = 90 mA.'},
    {prompt:'Si R2 sube a 200 Ω, ¿qué pasa con la corriente por R1?',options:['Baja','Sigue en 60 mA','Sube'],answer:1,why:'R1 conserva sus 6 V y sus 100 Ω, así que sigue conduciendo 60 mA.'},
  ],
  'encuentra-el-fallo':[
    {prompt:'La fuente indica 6 V y la corriente total es cero. ¿Qué se verifica primero?',options:['Que la fuente esté encendida','Que el camino de ida y vuelta esté cerrado','Cambiar todas las piezas a la vez'],answer:1,why:'La fuente puede tener voltaje sin corriente: lo primero es seguir el recorrido hasta el otro polo.'},
    {prompt:'¿Cómo se repara una conexión eléctrica en la mesa?',options:['Moviendo la pieza a otro lugar','Cambiando los extremos que une el cable','Cruzando los cables en la imagen'],answer:1,why:'Lo que determina la conexión son los terminales que une cada cable, no la posición ni el cruce visual.'},
    {prompt:'¿Qué orden de diagnóstico propone la clase?',options:['Cambiar varias cosas a la vez y ver qué pasa','Observar, proponer una causa, cambiar una cosa y comprobar','Reemplazar primero la fuente'],answer:1,why:'Cambiar una sola cosa cada vez permite saber qué resolvió el problema.'},
  ],
  'enciende-un-led':[
    {prompt:'En la orientación que conduce, la corriente convencional entra por…',options:['el cátodo (K −)','el ánodo (A +)','cualquiera de los dos'],answer:1,why:'La corriente entra por el ánodo y sale por el cátodo; en un LED la orientación importa.'},
    {prompt:'¿Para qué sirve la resistencia en serie con el LED?',options:['Para aumentar el brillo','Para limitar la corriente del recorrido','Para invertir la polaridad'],answer:1,why:'Sin ella la corriente sería excesiva; la resistencia la limita en todo el recorrido.'},
    {prompt:'Si R1 pasa de 220 a 470 Ω, el LED…',options:['brilla más','brilla menos','se apaga siempre'],answer:1,why:'Más resistencia, menos corriente: de unos 16,7 a 8,2 mA, y la luz se vuelve más tenue.'},
  ],
  'industrial-loto':[
    {prompt:'¿Por qué una máquina detenida con el botón de paro no es segura para intervenirla?',options:['Sigue conectada y alguien puede arrancarla','Porque el botón de paro se desgasta','Porque la máquina tarda en enfriarse'],answer:0,why:'El paro detiene el movimiento, pero la energía sigue disponible hasta que se aísla y se bloquea.'},
    {prompt:'¿Cuál es el orden correcto antes de bloquear?',options:['Aislar, avisar y apagar','Avisar, apagar y aislar','Apagar, aislar y avisar'],answer:1,why:'Primero se avisa al equipo, después se detiene la máquina y por último se abre el seccionador.'},
    {prompt:'¿Quién retira un candado de bloqueo?',options:['La supervisora del turno','Quien lo colocó','Cualquier persona del equipo'],answer:1,why:'Cada persona pone su propio candado y solo ella lo retira; así nadie reconecta mientras trabaja.'},
  ],
};
export const evaluationFor=(classId:string):Question[]|undefined=>EVALUATIONS[classId];
export function grade(questions:Question[],answers:(number|null)[]){
  const results=questions.map((q,i)=>answers[i]===q.answer);
  const correct=results.filter(Boolean).length;
  return {correct,total:questions.length,passed:correct===questions.length,results};
}
const EVALUATION_KEY='umbral-demo-evaluaciones';
type Storage={getItem(key:string):string|null;setItem(key:string,value:string):void};
const browser=():Storage|null=>{try{return globalThis.localStorage??null;}catch{return null;}};
function savedEvaluations(storage:Storage|null):Record<string,{correct:number;total:number;fecha?:string}>{try{return JSON.parse(storage?.getItem(EVALUATION_KEY)??'{}')??{};}catch{return {};}}
export function saveEvaluation(classId:string,correct:number,total:number,storage=browser()){
  try{const all=savedEvaluations(storage);all[classId]={correct,total,fecha:new Date().toISOString()};storage?.setItem(EVALUATION_KEY,JSON.stringify(all));}catch{/* storage is optional in the demo */}
}
/** Whether the last attempt at this class's evaluation had every answer right. */
export function evaluationPassed(classId:string,storage=browser()){const last=savedEvaluations(storage)[classId];return !!last&&last.total>0&&last.correct===last.total;}
