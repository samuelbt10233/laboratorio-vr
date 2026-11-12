import { electronica } from './content/electronica';
import { fluidos } from './content/fluidos';
import { fluidosConceptos } from './content/fluidos-conceptos';
import { mecanica } from './content/mecanica';
import { industrial } from './content/industrial';
import { distribucion } from './content/distribucion';
import { operacion } from './content/operacion';
import { medida } from './content/medida';
import { fundamentos } from './content/fundamentos';
import { finanzas } from './content/finanzas';
import { complementaria } from './content/complementaria';
/** Reading material is independent of the simulation steps and their narration. */
export interface LearningSection {title:string;text:string;example:string}
/** `runtimeClassId` opens the electronics runtime; `labId` opens a module registered in `labs/registry.ts`; `simulator` marks a 2D decision practice instead of a 3D one. */
export interface LearningContent {id:string;runtimeClassId:string|null;labId?:string;simulator?:boolean;subjectId:string;title:string;description:string;duration:string;laboratoryTitle:string;sections:LearningSection[]}
// Add one line per subject; each file in content/ has its own owner.
export const learningContents:readonly LearningContent[]=[...distribucion,...operacion,...medida,...fundamentos,...finanzas,...complementaria,...electronica,...industrial,...fluidos,...fluidosConceptos,...mecanica];
export function getLearningContent(id:string){const content=learningContents.find(c=>c.id===id);if(!content)throw new Error(`Contenido desconocido: ${id}`);return content;}
