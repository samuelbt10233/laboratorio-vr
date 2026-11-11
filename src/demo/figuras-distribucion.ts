import { schemeFigure, type Scheme } from './figura';
/** Schematics for the five-rules reading, generated with Schemdraw by scripts/esquemas.py; didactic only, to be validated against the RETIE and ESSA's procedures. */
const FIGURES:Record<string,Record<number,Scheme>>={'distribucion-cinco-reglas':{
  1:{file:'cinco-reglas-1-cortar',caption:'El seccionador abierto deja un corte visible; el bloqueo y la tarjeta impiden que alguien lo cierre.'},
  2:{file:'cinco-reglas-2-verificar',caption:'Se prueba el detector, se verifica fase por fase y se vuelve a probar el detector.'},
  3:{file:'cinco-reglas-3-tierra',caption:'Las tres fases se unen entre sí y a tierra a ambos lados de la zona de trabajo.'},
  4:{file:'cinco-reglas-4-senalizar',caption:'La zona queda delimitada y señalizada para que nadie ajeno entre en ella.'},
}};
export function distributionFigure(contentId:string,index:number):HTMLElement|null{
  const item=FIGURES[contentId]?.[index];return item?schemeFigure('esquemas',item):null;
}
