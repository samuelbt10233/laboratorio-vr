import { resultFor } from '../labs/cinco-reglas/result';
import { getLearningContent } from '../learning-content';
import { subjectEntries } from '../subjects';
import { evaluationPassed } from './evaluaciones';
import { currentClient } from './cliente';
/** Demo assignments for each client's trainee (`cliente.ts`): which modules are theirs, what is done and when each class is reviewed. Shown as «Datos de demostración». */
/** Days from today until each assigned class is reviewed; `done` marks demo classes already completed. */
const PLAN:Record<string,{days:number;done?:boolean}>={
  'distribucion-cinco-reglas':{days:2},
  'distribucion-epp':{days:4},
  'distribucion-distancias':{days:7},
  'distribucion-ats':{days:11},
  'distribucion-alturas':{days:14},
  'operacion-cortacircuitos':{days:6},
  'operacion-transformador':{days:10},
  'operacion-puesta-tierra':{days:13},
  'operacion-inspeccion':{days:16},
  'ley-de-ohm':{days:-6,done:true},
  'circuitos-en-paralelo':{days:-2,done:true},
  'encuentra-el-fallo':{days:5},
  'enciende-un-led':{days:9},
  'fundamentos-potencia':{days:8},
  'fundamentos-alterna':{days:12},
  'fundamentos-multimetro':{days:15},
  'finanzas-presupuesto':{days:2},
  'finanzas-credito':{days:6},
  'finanzas-fraudes':{days:9},
  'complementaria-digital':{days:4},
  'complementaria-empleabilidad':{days:8},
  'complementaria-emprendimiento':{days:12},
};
/** A class is completed when its lab saved a passed result or, without a lab, when its evaluation was passed. */
export function classCompleted(classId:string){return getLearningContent(classId).labId?!!resultFor(classId)?.aprobado:evaluationPassed(classId);}
export interface AssignedClass {classId:string;subjectId:string;title:string;moduleTitle:string;done:boolean;review:Date}
export const isMyModule=(subjectId:string)=>currentClient().assigned.includes(subjectId);
export const myModules=()=>subjectEntries(null).filter(s=>isMyModule(s.subjectId));
export const openModules=()=>subjectEntries(null).filter(s=>!isMyModule(s.subjectId));
function assignedClasses(subjectId:string,today:Date,completed:(classId:string)=>boolean):AssignedClass[]{
  const moduleTitle=subjectEntries(null).find(s=>s.subjectId===subjectId)?.title??'';
  return subjectEntries(subjectId).filter(e=>e.kind==='class'&&!e.planned&&e.classId&&PLAN[e.classId]).map(e=>{
    const plan=PLAN[e.classId!],review=new Date(today.getFullYear(),today.getMonth(),today.getDate()+plan.days);
    return {classId:e.classId!,subjectId,title:e.title,moduleTitle,done:!!plan.done||completed(e.classId!),review};
  });
}
export function moduleProgress(subjectId:string,today:Date,completed=classCompleted){
  const classes=assignedClasses(subjectId,today,completed);
  return {done:classes.filter(c=>c.done).length,total:classes.length,classes};
}
export function pendingActivities(today:Date,completed=classCompleted){
  return currentClient().assigned.flatMap(id=>assignedClasses(id,today,completed)).filter(c=>!c.done).sort((a,b)=>a.review.getTime()-b.review.getTime());
}
