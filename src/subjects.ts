import { catalogueEntries, laboratories } from './laboratories';
import { getLearningContent, type LearningContent } from './learning-content';
import { evaluationFor } from './demo/evaluaciones';
export interface Subject {id:string;title:string;description:string;status:'available'|'planned';laboratoryIds:string[];previewContentIds:string[]}
export const subjects:readonly Subject[]=[
  {
    "id": "distribucion",
    "title": "Trabajo seguro en redes de distribución",
    "description": "Prepara a las cuadrillas para intervenir la red sin tensión y con los riesgos controlados.",
    "status": "available",
    "laboratoryIds": [],
    "previewContentIds": [
      "distribucion-cinco-reglas",
      "distribucion-epp",
      "distribucion-distancias",
      "distribucion-ats",
      "distribucion-alturas"
    ]
  },
  {
    "id": "operacion",
    "title": "Operación y mantenimiento de la red",
    "description": "Maniobras, revisión de equipos e inspección de la red de distribución.",
    "status": "available",
    "laboratoryIds": [],
    "previewContentIds": [
      "operacion-cortacircuitos",
      "operacion-transformador",
      "operacion-puesta-tierra",
      "operacion-inspeccion"
    ]
  },
  {
    "id": "medida",
    "title": "Atención al usuario y medida",
    "description": "Acometidas, medidores y gestión del servicio en el punto de conexión del usuario.",
    "status": "available",
    "laboratoryIds": [],
    "previewContentIds": [
      "medida-acometida",
      "medida-medidores",
      "medida-irregulares",
      "medida-suspension"
    ]
  },
  {
    "id": "electronics",
    "title": "Fundamentos eléctricos",
    "description": "Comprende los circuitos y la relación entre voltaje, resistencia y corriente.",
    "status": "available",
    "laboratoryIds": [
      "electronics"
    ],
    "previewContentIds": [
      "fundamentos-potencia",
      "fundamentos-alterna",
      "fundamentos-multimetro"
    ]
  },
  {
    "id": "industrial",
    "title": "Capacitación industrial",
    "description": "Prepara a las personas de una planta para trabajar con seguridad junto a la maquinaria.",
    "status": "available",
    "laboratoryIds": [],
    "previewContentIds": [
      "industrial-loto",
      "industrial-torno"
    ]
  },
  {
    "id": "fluids",
    "title": "Mecánica de fluidos",
    "description": "Explora cómo se comportan los fluidos y qué significa la presión.",
    "status": "planned",
    "laboratoryIds": [],
    "previewContentIds": [
      "fluidos-presion",
      "fluidos-bernoulli"
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
/** A reading registered in `previewContentIds`: hidden as planned until it has a laboratory module or an evaluation (docs/plan-clases.md). */
export function readingEntry(subjectId:string,c:LearningContent):SubjectEntry{
  const planned=!c.labId&&!evaluationFor(c.id);
  return {id:`preview:${c.id}`,kind:'class',subjectId,laboratoryId:null,classId:c.id,title:c.title,description:c.description,meta:c.labId?[c.duration,'Con laboratorio']:planned?['Contenido propuesto','Laboratorio en preparación']:[c.duration,'Lectura y evaluación'],planned};
}
function classCount(s:Subject){return s.laboratoryIds.flatMap(l=>catalogueEntries(l)).filter(c=>c.kind==='class').length+s.previewContentIds.filter(id=>!readingEntry(s.id,getLearningContent(id)).planned).length;}
export function subjectEntries(id:string|null):SubjectEntry[]{
  if(id===null)return subjects.filter(s=>s.id!=='fluids'&&s.id!=='mechanics'&&(s.status==='planned'||classCount(s)>0)).map(s=>({id:`subject:${s.id}`,kind:'subject',subjectId:s.id,laboratoryId:null,title:s.title,description:s.description,meta:[s.status==='planned'?'Contenido propuesto':`${classCount(s)} ${classCount(s)===1?'clase':'clases'}`,s.status==='planned'?'Materia en preparación':'Contenido de la demo'],planned:s.status==='planned'}));
  const s=getSubject(id);
  const readings=s.previewContentIds.map(id=>readingEntry(s.id,getLearningContent(id)));
  return [...s.laboratoryIds.flatMap(lab=>catalogueEntries(lab).filter(e=>e.kind==='class'||e.kind==='free').map(e=>({id:e.id,kind:e.kind as 'class'|'free',subjectId:s.id,laboratoryId:lab,classId:e.classId,title:e.title,description:e.description,meta:e.meta,planned:false}))),...readings];
}
