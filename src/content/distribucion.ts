import type { LearningContent } from '../learning-content';
// Didactic safety content for the ESSA demo: it must be validated against RETIE and ESSA's own procedures.
export const distribucion:readonly LearningContent[]=[
  {
    id:'distribucion-cinco-reglas',runtimeClassId:null,labId:'cinco-reglas',subjectId:'distribucion',
    title:'Las cinco reglas de oro',
    description:'Deja sin tensión un tramo de red antes de intervenirlo y practica la maniobra en un poste con transformador.',
    duration:'10 min',laboratoryTitle:'Aplica las cinco reglas de oro en un poste',
    sections:[
      {title:'Una red desconectada no es una red segura',text:'Un tramo de red abierto puede volver a tener tensión por una maniobra equivocada, por un generador particular conectado aguas abajo, por inducción de una línea cercana o por una descarga atmosférica. Las cinco reglas de oro existen para que el trabajo se haga sin tensión y siga así mientras dure.',example:'Un liniero sube a un poste que creía desenergizado y un compañero cierra el cortacircuitos desde otro punto sin saberlo.'},
      {title:'1 y 2. Cortar y bloquear',text:'Primero se abren todas las fuentes que pueden alimentar el punto de trabajo, con corte visible. Después se bloquean los equipos de maniobra y se señalizan, para que nadie pueda cerrarlos mientras la cuadrilla trabaja.',example:'En la práctica abrirás los cortacircuitos del transformador con la pértiga y dejarás bloqueo y tarjeta en el punto de corte.'},
      {title:'3. Verificar la ausencia de tensión',text:'Abrir no basta: se comprueba en cada fase con un detector adecuado a la tensión de la red. El detector se prueba antes y después de la medida, para estar seguro de que funciona.',example:'Un detector sin probar que no indica tensión no demuestra nada: puede estar dañado.'},
      {title:'4. Poner a tierra y en cortocircuito',text:'Con la ausencia de tensión verificada, se instala el equipo de puesta a tierra en todas las fases, lo más cerca posible del punto de trabajo. Se conecta primero a tierra y después a los conductores. Si la red se energiza por error, la protección actúa y la cuadrilla queda protegida.',example:'Poner a tierra antes de verificar es el error que verás en la práctica: si la red tiene tensión, se produce un arco eléctrico.'},
      {title:'5. Señalizar la zona de trabajo',text:'Por último se delimita y señaliza la zona, para que ni la cuadrilla ni terceros entren en un área con riesgo. Solo entonces empieza el trabajo.',example:'Conos y cinta alrededor del poste avisan a peatones y vehículos.'},
      {title:'Antes de practicar',text:'Contenido didáctico de demostración. Simplifica el procedimiento y debe validarse con el RETIE y los procedimientos de ESSA antes de usarse en una formación real.',example:'Cada error en la práctica te explica qué riesgo habría en una red real.'},
    ],
  },
];
