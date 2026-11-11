import { classes } from './lessons';

export interface Laboratory { id:string; title:string; description:string; freeTitle:string }
// Only register laboratories with a working runtime. Classes reference this ID.
export const laboratories:readonly Laboratory[]=[{
  id:'electronics',title:'Electrónica básica',
  description:'Descubre los circuitos, conecta componentes y observa cómo circula la corriente.',
  freeTitle:'Banco de electrónica',
}];
export const welcomeClassId='primeros-pasos';
export function getLaboratory(id:string){
  const lab=laboratories.find(l=>l.id===id);
  if(!lab)throw new Error(`Laboratorio desconocido: ${id}`);
  return lab;
}
export function laboratoryClasses(id:string){getLaboratory(id);return classes.filter(c=>c.laboratoryId===id);}
export interface CatalogueEntry {id:string;kind:'welcome'|'laboratory'|'class'|'free';title:string;description:string;meta:string[];laboratoryId:string|null;classId?:string}
export function catalogueEntries(laboratoryId:string|null):CatalogueEntry[]{
  if(laboratoryId===null){
    const welcome=classes.find(c=>c.id===welcomeClassId)!;
    return [{id:'welcome',kind:'welcome',title:'Bienvenida · Primeros pasos',description:welcome.description,meta:[welcome.duration,'Conoce la plataforma'],laboratoryId:null,classId:welcome.id},
      ...laboratories.map(l=>({id:`lab:${l.id}`,kind:'laboratory' as const,title:l.title,description:l.description,meta:[`${laboratoryClasses(l.id).length} clases guiadas`,'Modo libre'],laboratoryId:l.id}))];
  }
  const lab=getLaboratory(laboratoryId);
  return [...laboratoryClasses(lab.id).map(c=>({id:`class:${c.id}`,kind:'class' as const,title:c.title,description:c.description,meta:[`${c.steps.length} pasos`,c.duration,c.level],laboratoryId:lab.id,classId:c.id})),
    {id:`free:${lab.id}`,kind:'free',title:lab.freeTitle,description:'Montajes libres con mediciones y gráficas, sin actividad evaluada.',meta:['Exploración abierta','A tu ritmo'],laboratoryId:lab.id}];
}
