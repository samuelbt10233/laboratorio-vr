import { findFaultClass } from './classes/find-fault';
import { tutorialClass } from './classes/tutorial';
import { ohmClass } from './classes/ohm';
import { parallelClass } from './classes/parallel';
import type { LabClass } from './class-engine';
// Register a class here; the catalogue and player read this single registry.
export const classes:readonly LabClass[]=[tutorialClass,ohmClass,parallelClass,findFaultClass];
export function getClass(id:string):LabClass {
  const definition=classes.find(item=>item.id===id);
  if(!definition)throw new Error(`Clase desconocida: ${id}`);
  return definition;
}
