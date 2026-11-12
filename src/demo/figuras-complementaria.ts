import { schemeFigure, type Scheme } from './figura';
/** Codex's file (docs/plan-icetex.md): schematics for each class, by section index, served from public/esquemas-codex/. */
const FIGURES:Record<string,Record<number,Scheme>>={};
export function complementaryFigure(contentId:string,index:number):HTMLElement|null{const item=FIGURES[contentId]?.[index];return item?schemeFigure('esquemas-codex',item):null;}
