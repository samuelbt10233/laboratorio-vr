import type { LabRegistry } from './types';
// One line per laboratory, loaded only when opened. Example:
// prensa:()=>import('./fluidos/prensa').then(m=>m.lab),
export const labModules:LabRegistry={
  industrial:()=>import('./industrial').then(m=>m.lab),
  'cinco-reglas':()=>import('./cinco-reglas').then(m=>m.lab),
  cortacircuitos:()=>import('./cortacircuitos').then(m=>m.lab),
  epp:()=>import('./epp').then(m=>m.lab),
  distancias:()=>import('./distancias').then(m=>m.lab),
};
