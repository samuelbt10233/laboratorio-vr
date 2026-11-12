import type { LearningContent } from '../learning-content';
// Claude's file (docs/plan-icetex.md). Didactic content for the ICETEX demo: no real credit conditions, rates or financial advice.
export const finanzas:readonly LearningContent[]=[
  {
    id:'finanzas-presupuesto',runtimeClassId:null,subjectId:'finanzas',
    title:'Presupuesto y ahorro durante los estudios',
    description:'Organizar los ingresos del semestre, separar gastos fijos y variables y crear un fondo de ahorro.',
    duration:'10 min',laboratoryTitle:'Simulador: un mes con presupuesto',
    sections:[{title:'En preparación',text:'Ficha provisional del contrato I0: la clase permanece oculta hasta tener evaluación o laboratorio.',example:'Sin ejemplo todavía.'}],
  },
  {
    id:'finanzas-credito',runtimeClassId:null,subjectId:'finanzas',
    title:'Crédito educativo responsable',
    description:'Entender cuota, plazo e intereses, y por qué estar al día protege el historial crediticio.',
    duration:'10 min',laboratoryTitle:'Lectura de un plan de pagos',
    sections:[{title:'En preparación',text:'Ficha provisional del contrato I0: la clase permanece oculta hasta tener evaluación o laboratorio.',example:'Sin ejemplo todavía.'}],
  },
  {
    id:'finanzas-fraudes',runtimeClassId:null,subjectId:'finanzas',
    title:'Prevención de fraudes y estafas',
    description:'Reconocer ofertas de inversión falsas, suplantaciones y estafas digitales antes de entregar dinero o datos.',
    duration:'10 min',laboratoryTitle:'Revisión de mensajes sospechosos',
    sections:[{title:'En preparación',text:'Ficha provisional del contrato I0: la clase permanece oculta hasta tener evaluación o laboratorio.',example:'Sin ejemplo todavía.'}],
  },
];
