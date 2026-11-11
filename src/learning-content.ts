import { electronica } from './content/electronica';
import { fluidos } from './content/fluidos';
import { fluidosConceptos } from './content/fluidos-conceptos';
import { mecanica } from './content/mecanica';
import { industrial } from './content/industrial';
import { distribucion } from './content/distribucion';
import { operacion } from './content/operacion';
import { medida } from './content/medida';
import { fundamentos } from './content/fundamentos';
/** Reading material is independent of the simulation steps and their narration. */
export interface LearningSection {title:string;text:string;example:string}
/** `runtimeClassId` opens the electronics runtime; `labId` opens a module registered in `labs/registry.ts`. */
export interface LearningContent {id:string;runtimeClassId:string|null;labId?:string;subjectId:string;title:string;description:string;duration:string;laboratoryTitle:string;sections:LearningSection[]}
// Add one line per subject; each file in content/ has its own owner.
export const learningContents:readonly LearningContent[]=[...distribucion,...operacion,...medida,...fundamentos,...electronica,...industrial,...fluidos,...fluidosConceptos,...mecanica];
export function getLearningContent(id:string){const content=learningContents.find(c=>c.id===id);if(!content)throw new Error(`Contenido desconocido: ${id}`);return content;}
