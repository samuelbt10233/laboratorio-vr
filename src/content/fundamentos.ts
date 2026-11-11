import type { LearningContent } from '../learning-content';
// Codex's file (docs/plan-clases.md). Didactic content for the ESSA demo: it must be validated against RETIE and ESSA's own procedures.
export const fundamentos:readonly LearningContent[]=[
  {
    id:'fundamentos-potencia',runtimeClassId:null,subjectId:'electronics',
    title:'Potencia y energía eléctrica',
    description:'Relación entre potencia, energía y consumo facturado.',
    duration:'10 min',laboratoryTitle:'Cálculo de potencia y energía',
    sections:[{title:'En preparación',text:'Ficha provisional del contrato C0: la clase permanece oculta hasta tener evaluación o laboratorio.',example:'Sin ejemplo todavía.'}],
  },
  {
    id:'fundamentos-alterna',runtimeClassId:null,subjectId:'electronics',
    title:'Corriente alterna y sistema trifásico',
    description:'Valores eficaces, frecuencia y tensiones de un sistema trifásico.',
    duration:'10 min',laboratoryTitle:'Lectura de un sistema trifásico',
    sections:[{title:'En preparación',text:'Ficha provisional del contrato C0: la clase permanece oculta hasta tener evaluación o laboratorio.',example:'Sin ejemplo todavía.'}],
  },
  {
    id:'fundamentos-multimetro',runtimeClassId:null,subjectId:'electronics',
    title:'Uso seguro del multímetro y la pinza amperimétrica',
    description:'Selección de la función, categoría del instrumento y medición segura.',
    duration:'10 min',laboratoryTitle:'Medición con multímetro y pinza',
    sections:[{title:'En preparación',text:'Ficha provisional del contrato C0: la clase permanece oculta hasta tener evaluación o laboratorio.',example:'Sin ejemplo todavía.'}],
  },
];
