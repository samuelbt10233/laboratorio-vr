/** What the practice leaves for the supervisor panel (docs/plan-demo-energia.md, section 3). Demo data only. */
export interface PracticeResult {contentId:string;aprobado:boolean;errores:number;segundos:number;fecha:string}
export const RESULT_KEY='umbral-demo-resultado';
type Storage={getItem(key:string):string|null;setItem(key:string,value:string):void};
const browser=():Storage|null=>{try{return globalThis.localStorage??null;}catch{return null;}};
export function saveResult(result:PracticeResult,storage=browser()){try{storage?.setItem(RESULT_KEY,JSON.stringify(result));}catch{/* private mode: the panel keeps its sample data */}}
/** The last practice result, or null when there is none or it cannot be read. */
export function readResult(storage=browser()):PracticeResult|null{
  try{
    const value=JSON.parse(storage?.getItem(RESULT_KEY)??'null');
    return value&&typeof value.contentId==='string'&&typeof value.aprobado==='boolean'&&typeof value.errores==='number'&&typeof value.segundos==='number'&&typeof value.fecha==='string'?value:null;
  }catch{return null;}
}
