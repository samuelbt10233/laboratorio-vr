import { subjectEntries } from '../subjects';
/** Demo assignments for the ESSA profiles: which modules are theirs, what is done and when each class is reviewed. Shown as «Datos de demostración». */
const MY_MODULES=['distribucion','electronics'];
const PRACTICE='distribucion-cinco-reglas';
/** Days from today until each assigned class is reviewed; `done` marks demo classes already completed. */
const PLAN:Record<string,{days:number;done?:boolean}>={
  'distribucion-cinco-reglas':{days:2},
  'ley-de-ohm':{days:-6,done:true},
  'circuitos-en-paralelo':{days:-2,done:true},
  'encuentra-el-fallo':{days:5},
  'enciende-un-led':{days:9},
};
export interface AssignedClass {classId:string;subjectId:string;title:string;moduleTitle:string;done:boolean;review:Date}
export const isMyModule=(subjectId:string)=>MY_MODULES.includes(subjectId);
export const myModules=()=>subjectEntries(null).filter(s=>isMyModule(s.subjectId));
export const openModules=()=>subjectEntries(null).filter(s=>!isMyModule(s.subjectId));
function assignedClasses(subjectId:string,today:Date,practiceDone:boolean):AssignedClass[]{
  const moduleTitle=subjectEntries(null).find(s=>s.subjectId===subjectId)?.title??'';
  return subjectEntries(subjectId).filter(e=>e.kind==='class'&&e.classId&&PLAN[e.classId]).map(e=>{
    const plan=PLAN[e.classId!],review=new Date(today.getFullYear(),today.getMonth(),today.getDate()+plan.days);
    return {classId:e.classId!,subjectId,title:e.title,moduleTitle,done:e.classId===PRACTICE?practiceDone:!!plan.done,review};
  });
}
export function moduleProgress(subjectId:string,today:Date,practiceDone:boolean){
  const classes=assignedClasses(subjectId,today,practiceDone);
  return {done:classes.filter(c=>c.done).length,total:classes.length,classes};
}
export function pendingActivities(today:Date,practiceDone:boolean){
  return MY_MODULES.flatMap(id=>assignedClasses(id,today,practiceDone)).filter(c=>!c.done).sort((a,b)=>a.review.getTime()-b.review.getTime());
}
