import type { Question } from './evaluaciones';
// Claude's file (docs/plan-clases.md). Didactic only: to be validated against the RETIE and ESSA's procedures.
export const evaluacionesDistribucion:Record<string,Question[]>={
  'distribucion-cinco-reglas':[
    {prompt:'¿Por qué no basta con abrir un tramo de red para trabajar en él?',options:['Puede volver a tener tensión por una maniobra, un generador, inducción o una descarga','Porque abrirlo daña el transformador','Porque la cuadrilla necesita más tiempo para subir al poste'],answer:0,why:'Un tramo abierto puede reenergizarse por varias causas; las cinco reglas mantienen el trabajo sin tensión mientras dure.'},
    {prompt:'¿Qué se hace justo antes de poner a tierra y en cortocircuito?',options:['Señalizar la zona de trabajo','Verificar la ausencia de tensión en cada fase','Retirar el bloqueo del punto de corte'],answer:1,why:'Poner a tierra sin verificar es el error que provoca el arco en la práctica: primero se comprueba que no hay tensión.'},
    {prompt:'Un detector que no se probó no indica tensión. ¿Qué significa?',options:['Que la red está sin tensión','Nada: el detector puede estar dañado y debe probarse antes y después','Que ya se puede poner a tierra'],answer:1,why:'El detector se prueba antes y después de la medida; si no, su lectura no demuestra nada.'},
  ],
};
