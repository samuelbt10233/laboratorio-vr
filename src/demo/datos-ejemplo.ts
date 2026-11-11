import type { PracticeResult } from '../labs/cinco-reglas/result';
export function crewRows(result:PracticeResult|null){
  const valid=result?.contentId==='distribucion-cinco-reglas'&&Number.isFinite(result.segundos)&&result.segundos>=0&&Number.isFinite(result.errores)&&result.errores>=0&&!Number.isNaN(Date.parse(result.fecha));
  return [
    {name:'Andrés Rojas',role:'Liniero',progress:valid&&result.aprobado?100:0,attempts:valid?'Último registrado':'Sin registro',errors:valid?String(result.errores):'—',status:valid?(result.aprobado?'Práctica completada':'Pendiente de completar'):'Pendiente',certificate:valid&&result.aprobado?'Constancia de práctica disponible':'Sin constancia',detail:valid?`${Math.round(result.segundos)} s · ${new Date(result.fecha).toLocaleDateString('es-CO')} · Resultado de este navegador`:'Realizar las cinco reglas de oro'},
    {name:'Camila Torres',role:'Liniera',progress:100,attempts:'2',errors:'0',status:'Completada',certificate:'Vigente · Ejemplo',detail:'Datos de ejemplo'},
    {name:'Julián Pérez',role:'Auxiliar de redes',progress:60,attempts:'1',errors:'2',status:'En curso',certificate:'Sin constancia',detail:'Datos de ejemplo'},
    {name:'Valentina Díaz',role:'Liniera',progress:100,attempts:'1',errors:'0',status:'Completada',certificate:'Por vencer · Ejemplo',detail:'Datos de ejemplo'},
    {name:'Miguel Castro',role:'Técnico de redes',progress:0,attempts:'0',errors:'—',status:'Pendiente',certificate:'Sin constancia',detail:'Datos de ejemplo'},
  ];
}
