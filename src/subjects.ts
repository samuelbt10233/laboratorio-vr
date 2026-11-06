import { catalogueEntries, laboratories } from './laboratories';
import { getLearningContent, type LearningContent } from './learning-content';
export interface Subject {id:string;title:string;description:string;status:'available'|'planned';laboratoryIds:string[];previewContentIds:string[]}
export const subjects:readonly Subject[]=[
  {
    "id": "electronics",
    "title": "Electrónica",
    "description": "Comprende los circuitos y la relación entre voltaje, resistencia y corriente.",
    "status": "available",
    "laboratoryIds": [
      "electronics"
    ],
    "previewContentIds": []
  },
  {
    "id": "fluids",
    "title": "Mecánica de fluidos",
    "description": "Explora cómo se comportan los fluidos y qué significa la presión.",
    "status": "planned",
    "laboratoryIds": [],
    "previewContentIds": [
      "fluidos-presion"
    ]
  },
  {
    "id": "mechanics",
    "title": "Mecánica",
    "description": "Relaciona fuerzas y movimiento mediante experiencias sencillas.",
    "status": "planned",
    "laboratoryIds": [],
    "previewContentIds": [
      "mecanica-pendulo"
    ]
  }
];
export function getSubject(id:string){const subject=subjects.find(s=>s.id===id);if(!subject)throw new Error(`Materia desconocida: ${id}`);return subject;}
export function subjectForLaboratory(id:string){if(!laboratories.some(l=>l.id===id))throw new Error(`Laboratorio desconocido: ${id}`);const subject=subjects.find(s=>s.laboratoryIds.includes(id));if(!subject)throw new Error(`Laboratorio sin materia: ${id}`);return subject;}
export interface SubjectEntry {id:string;kind:'subject'|'class'|'free';subjectId:string;laboratoryId:string|null;classId?:string;title:string;description:string;meta:string[];planned:boolean}
/** A reading registered in `previewContentIds`: a concept until it has a laboratory module. */
export function readingEntry(subjectId:string,c:LearningContent):SubjectEntry{
  return {id:`preview:${c.id}`,kind:'class',subjectId,laboratoryId:null,classId:c.id,title:c.title,description:c.description,meta:c.labId?[c.duration,'Con laboratorio']:['Contenido propuesto','Laboratorio en preparación'],planned:!c.labId};
}
function practiceCount(s:Subject){return s.laboratoryIds.flatMap(l=>catalogueEntries(l)).filter(c=>c.kind==='class').length+s.previewContentIds.filter(id=>getLearningContent(id).labId).length;}
export function subjectEntries(id:string|null):SubjectEntry[]{
  if(id===null)return subjects.map(s=>({id:`subject:${s.id}`,kind:'subject',subjectId:s.id,laboratoryId:null,title:s.title,description:s.description,meta:[s.status==='planned'?'Contenido propuesto':`${practiceCount(s)} clases con laboratorio`,s.status==='planned'?'Materia en preparación':'Contenido de la demo'],planned:s.status==='planned'}));
  const s=getSubject(id);
  const readings=s.previewContentIds.map(id=>readingEntry(s.id,getLearningContent(id)));
  return [...s.laboratoryIds.flatMap(lab=>catalogueEntries(lab).filter(e=>e.kind==='class'||e.kind==='free').map(e=>({id:e.id,kind:e.kind as 'class'|'free',subjectId:s.id,laboratoryId:lab,classId:e.classId,title:e.title,description:e.description,meta:e.meta,planned:false}))),...readings];
}
