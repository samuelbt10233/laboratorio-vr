import type { LearningContent } from '../learning-content';
// Didactic safety content for the ESSA demo: it must be validated against RETIE and ESSA's own procedures.
export const distribucion:readonly LearningContent[]=[
  {
    id:'distribucion-cinco-reglas',runtimeClassId:null,labId:'cinco-reglas',subjectId:'distribucion',
    title:'Las cinco reglas de oro',
    description:'Procedimiento para dejar sin tensión un tramo de red antes de intervenirlo, con práctica de la maniobra en un poste con transformador.',
    duration:'10 min',laboratoryTitle:'Aplicación de las cinco reglas de oro en un poste',
    sections:[
      {title:'Objetivo y riesgo controlado',text:'Al finalizar la clase, el participante aplica en orden las cinco reglas de oro para trabajar sin tensión. Un tramo de red abierto puede reenergizarse por una maniobra errónea, por un generador particular conectado aguas abajo, por inducción de una línea cercana o por una descarga atmosférica. Las cinco reglas garantizan que el trabajo se realice sin tensión durante toda la intervención.',example:'Caso típico de accidente: un liniero asciende a un poste que se consideraba desenergizado y otra persona cierra el cortacircuitos desde un punto distinto sin conocer la intervención.'},
      {title:'1 y 2. Cortar y bloquear',text:'Se abren todas las fuentes que pueden alimentar el punto de trabajo, con corte visible. A continuación se bloquean y señalizan los equipos de maniobra, de modo que no puedan cerrarse mientras la cuadrilla permanezca en la zona.',example:'En la práctica: apertura de los cortacircuitos del transformador con pértiga e instalación de bloqueo y tarjeta en el punto de corte.'},
      {title:'3. Verificar la ausencia de tensión',text:'La apertura no es suficiente. La ausencia de tensión se comprueba en cada fase con un detector adecuado al nivel de tensión de la red. El detector se prueba antes y después de la medida para confirmar su funcionamiento.',example:'Error frecuente: dar por válida la lectura de un detector sin probar. Si el equipo está dañado, la ausencia de indicación no demuestra la ausencia de tensión.'},
      {title:'4. Poner a tierra y en cortocircuito',text:'Verificada la ausencia de tensión, se instala el equipo de puesta a tierra en todas las fases, lo más cerca posible del punto de trabajo. La conexión se realiza primero a tierra y después a los conductores. Ante una reenergización accidental, la protección actúa y la cuadrilla permanece protegida.',example:'Error crítico evaluado en la práctica: poner a tierra antes de verificar. Si la red conserva tensión, se produce un arco eléctrico.'},
      {title:'5. Señalizar la zona de trabajo',text:'Por último se delimita y señaliza la zona de trabajo para impedir el ingreso de personal no autorizado y de terceros a un área con riesgo. Solo entonces se autoriza el inicio del trabajo.',example:'Medios habituales: conos y cinta de demarcación alrededor del poste, visibles para peatones y vehículos.'},
      {title:'Alcance de la práctica',text:'Contenido didáctico de demostración. Simplifica el procedimiento y debe validarse con el RETIE y los procedimientos de ESSA antes de usarse en una formación real.',example:'Cada error registrado en la práctica indica el riesgo que tendría en una red real.'},
    ],
  },
  {
    id:'distribucion-epp',runtimeClassId:null,subjectId:'distribucion',
    title:'Equipo de protección personal y su inspección',
    description:'Selección, inspección y uso del equipo de protección para trabajos en la red.',
    duration:'10 min',laboratoryTitle:'Inspección del equipo de protección',
    sections:[{title:'En preparación',text:'Ficha provisional del contrato C0: la clase permanece oculta hasta tener evaluación o laboratorio.',example:'Sin ejemplo todavía.'}],
  },
  {
    id:'distribucion-distancias',runtimeClassId:null,subjectId:'distribucion',
    title:'Distancias mínimas de seguridad',
    description:'Distancias de aproximación a partes energizadas y cómo se controlan en campo.',
    duration:'10 min',laboratoryTitle:'Control de distancias de seguridad',
    sections:[{title:'En preparación',text:'Ficha provisional del contrato C0: la clase permanece oculta hasta tener evaluación o laboratorio.',example:'Sin ejemplo todavía.'}],
  },
  {
    id:'distribucion-ats',runtimeClassId:null,subjectId:'distribucion',
    title:'Análisis de trabajo seguro y permiso de trabajo',
    description:'Identificación de peligros y controles antes de iniciar una intervención.',
    duration:'10 min',laboratoryTitle:'Elaboración de un análisis de trabajo seguro',
    sections:[{title:'En preparación',text:'Ficha provisional del contrato C0: la clase permanece oculta hasta tener evaluación o laboratorio.',example:'Sin ejemplo todavía.'}],
  },
  {
    id:'distribucion-alturas',runtimeClassId:null,subjectId:'distribucion',
    title:'Trabajo en alturas en poste',
    description:'Ascenso, posicionamiento y rescate en postes de distribución.',
    duration:'10 min',laboratoryTitle:'Ascenso seguro a un poste',
    sections:[{title:'En preparación',text:'Ficha provisional del contrato C0: la clase permanece oculta hasta tener evaluación o laboratorio.',example:'Sin ejemplo todavía.'}],
  },
];
