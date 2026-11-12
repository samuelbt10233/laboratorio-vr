import { POLE } from './pole';
import { GRADUATE } from './graduate';
/** Which client the demo is prepared for: `?cliente=icetex` opens the ICETEX demo, anything else the ESSA one (docs/plan-icetex.md). */
export type ClientId='essa'|'icetex';
export interface DemoProfile {role:string;name:string;initials:string;title:string;greeting:string}
export interface DemoClient {
  id:ClientId;name:string;
  /** Modules listed in the catalogue, in order; the rest of the catalogue stays hidden for this client. */
  subjects:string[];
  /** Modules assigned to the trainee, shown with progress and review dates. */
  assigned:string[];
  profiles:DemoProfile[];
  art:string;
  /** Class whose last practice result feeds the start page stats. */
  practiceClassId:string;
  subtitle:string;
  /** Shown under each evaluation of these modules. */
  evaluationNote:{subjects:string[];text:string};
}
export const clients:Record<ClientId,DemoClient>={
  essa:{
    id:'essa',name:'ESSA',
    subjects:['distribucion','operacion','medida','electronics','industrial'],
    assigned:['distribucion','operacion','electronics'],
    profiles:[
      {role:'tecnico',name:'Andrés Rojas',initials:'AR',title:'Técnico liniero',greeting:'Hola, Andrés'},
      {role:'supervisora',name:'Laura Gómez',initials:'LG',title:'Supervisora, jefa de cuadrilla',greeting:'Hola, Laura'},
    ],
    art:POLE,practiceClassId:'distribucion-cinco-reglas',
    subtitle:'Elige un módulo. Cada clase empieza con una lectura breve y termina con una práctica en 3D.',
    evaluationNote:{subjects:['distribucion','operacion','medida'],text:'Preguntas didácticas de demostración. Deben validarse con el RETIE y los procedimientos de ESSA.'},
  },
  icetex:{
    id:'icetex',name:'ICETEX',
    subjects:['finanzas','complementaria'],
    assigned:['finanzas','complementaria'],
    profiles:[
      {role:'beneficiaria',name:'Valentina Ríos',initials:'VR',title:'Beneficiaria de crédito educativo',greeting:'Hola, Valentina'},
    ],
    art:GRADUATE,practiceClassId:'finanzas-presupuesto',
    subtitle:'Elige un módulo. Cada clase empieza con una lectura breve y termina con una práctica o una evaluación.',
    evaluationNote:{subjects:['finanzas','complementaria'],text:'Preguntas didácticas de demostración. No constituyen asesoría financiera ni describen condiciones reales de crédito.'},
  },
};
export function clientId(search=typeof location==='undefined'?'':location.search):ClientId{
  return new URLSearchParams(search).get('cliente')==='icetex'?'icetex':'essa';
}
export const currentClient=()=>clients[clientId()];
