import { schemeFigure, type Scheme } from './figura';
/** Claude's file (docs/plan-clases.md): schematics for each class, by section index, served from public/esquemas/. */
const FIGURES:Record<string,Record<number,Scheme>>={};
export function operationFigure(contentId:string,index:number):HTMLElement|null{const item=FIGURES[contentId]?.[index];return item?schemeFigure('esquemas',item):null;}
