import type { LearningContent } from '../learning-content';
// Claude's file (docs/plan-clases.md). Didactic content for the ESSA demo: it must be validated against RETIE and ESSA's own procedures.
export const operacion:readonly LearningContent[]=[
  {
    id:'operacion-cortacircuitos',runtimeClassId:null,subjectId:'operacion',
    title:'Maniobra de cortacircuitos con pértiga',
    description:'Apertura y cierre de cortacircuitos con pértiga, con el orden y la posición correctos.',
    duration:'10 min',laboratoryTitle:'Maniobra de cortacircuitos',
    sections:[{title:'En preparación',text:'Ficha provisional del contrato C0: la clase permanece oculta hasta tener evaluación o laboratorio.',example:'Sin ejemplo todavía.'}],
  },
  {
    id:'operacion-transformador',runtimeClassId:null,subjectId:'operacion',
    title:'Transformador de distribución',
    description:'Partes, placa de características y revisión de un transformador de poste.',
    duration:'10 min',laboratoryTitle:'Revisión de un transformador de poste',
    sections:[{title:'En preparación',text:'Ficha provisional del contrato C0: la clase permanece oculta hasta tener evaluación o laboratorio.',example:'Sin ejemplo todavía.'}],
  },
  {
    id:'operacion-puesta-tierra',runtimeClassId:null,subjectId:'operacion',
    title:'Puesta a tierra y medición de su resistencia',
    description:'Función de la puesta a tierra y cómo se mide su resistencia.',
    duration:'10 min',laboratoryTitle:'Medición de una puesta a tierra',
    sections:[{title:'En preparación',text:'Ficha provisional del contrato C0: la clase permanece oculta hasta tener evaluación o laboratorio.',example:'Sin ejemplo todavía.'}],
  },
  {
    id:'operacion-inspeccion',runtimeClassId:null,subjectId:'operacion',
    title:'Inspección de redes y reporte de anomalías',
    description:'Recorrido de inspección, anomalías frecuentes y su reporte.',
    duration:'10 min',laboratoryTitle:'Inspección de un tramo de red',
    sections:[{title:'En preparación',text:'Ficha provisional del contrato C0: la clase permanece oculta hasta tener evaluación o laboratorio.',example:'Sin ejemplo todavía.'}],
  },
];
