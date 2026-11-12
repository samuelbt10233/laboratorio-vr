import { schemeFigure, type Scheme } from './figura';
/** Claude's file (docs/plan-icetex.md): schematics for each class, by section index, served from public/esquemas/. */
const FIGURES:Record<string,Record<number,Scheme>>={
  'finanzas-presupuesto':{
    2:{file:'presupuesto-1-reparto',caption:'El ingreso se reparte en orden: primero los fijos y la cuota, luego el ahorro y al final lo variable.'},
    3:{file:'presupuesto-2-imprevisto',caption:'Un gasto que no puede esperar sale del fondo para imprevistos; si puede esperar, se planea.'},
  },
  'finanzas-credito':{
    1:{file:'credito-1-componentes',caption:'Capital, interés y plazo determinan la cuota.'},
    3:{file:'credito-2-dificultad',caption:'Si la cuota no alcanza, se contacta a la entidad antes del vencimiento.'},
  },
  'finanzas-fraudes':{
    1:{file:'fraudes-1-senales',caption:'Cuatro señales que delatan la mayoría de las estafas.'},
    3:{file:'fraudes-2-verificar',caption:'Antes de pagar o invertir, se verifica la entidad en su canal oficial.'},
  },
};
export function financeFigure(contentId:string,index:number):HTMLElement|null{const item=FIGURES[contentId]?.[index];return item?schemeFigure('esquemas',item):null;}
