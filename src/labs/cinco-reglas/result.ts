/** What the practice leaves for the supervisor panel (docs/plan-demo-energia.md, section 3). Demo data only. */
export interface PracticeResult {contentId:string;aprobado:boolean;errores:number;segundos:number;fecha:string}
export const RESULT_KEY='umbral-demo-resultado';
type Storage={getItem(key:string):string|null;setItem(key:string,value:string):void};
const browser=():Storage|null=>{try{return globalThis.localStorage??null;}catch{return null;}};
/** Every lab's last result, by class (docs/plan-clases.md); RESULT_KEY keeps only the five rules for the supervisor panel. */
export const RESULTS_KEY='umbral-demo-resultados';
const valid=(value:any):value is PracticeResult=>!!value&&typeof value.contentId==='string'&&typeof value.aprobado==='boolean'&&typeof value.errores==='number'&&typeof value.segundos==='number'&&typeof value.fecha==='string';
function allResults(storage:Storage|null):Record<string,unknown>{try{const value=JSON.parse(storage?.getItem(RESULTS_KEY)??'{}');return value&&typeof value==='object'?value:{};}catch{return {};}}
export function saveResult(result:PracticeResult,storage=browser()){
  try{
    storage?.setItem(RESULTS_KEY,JSON.stringify({...allResults(storage),[result.contentId]:result}));
    if(result.contentId==='distribucion-cinco-reglas')storage?.setItem(RESULT_KEY,JSON.stringify(result));
  }catch{/* private mode: the panel keeps its sample data */}
}
/** The last five-rules result, or null when there is none or it cannot be read. */
export function readResult(storage=browser()):PracticeResult|null{try{const value=JSON.parse(storage?.getItem(RESULT_KEY)??'null');return valid(value)?value:null;}catch{return null;}}
/** The last result of one class's lab, or null; five-rules results saved before the per-class map still count. */
export function resultFor(contentId:string,storage=browser()):PracticeResult|null{const value=allResults(storage)[contentId];if(valid(value))return value;const legacy=readResult(storage);return legacy?.contentId===contentId?legacy:null;}
