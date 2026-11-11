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
    id:'distribucion-epp',runtimeClassId:null,labId:'epp',subjectId:'distribucion',
    title:'Equipo de protección personal y su inspección',
    description:'Selección, inspección y uso del equipo de protección personal y de los elementos dieléctricos antes de intervenir la red.',
    duration:'8 min',laboratoryTitle:'Inspección del equipo de protección antes de una maniobra',
    sections:[
      {title:'Objetivo de la clase',text:'Al finalizar la clase, el participante selecciona el equipo de protección adecuado para la tarea, lo inspecciona antes de usarlo y retira de servicio cualquier elemento defectuoso. El equipo de protección es la última barrera: no reemplaza las cinco reglas de oro, pero limita las consecuencias si algo falla.',example:'Caso típico de accidente: un guante dieléctrico con un poro no detectado permite el paso de corriente durante una maniobra que se consideraba controlada.'},
      {title:'Equipo básico y equipo dieléctrico',text:'El equipo básico incluye casco con barbuquejo, gafas o careta, ropa ignífuga, botas dieléctricas y protección auditiva cuando corresponde. Para trabajos cerca de partes energizadas se suman guantes dieléctricos de la clase adecuada a la tensión, con su guante protector de cuero, mangas y elementos aislantes.',example:'Error frecuente: usar guantes dieléctricos sin el guante protector exterior. El cuero evita cortes y abrasiones que dañan el aislamiento.'},
      {title:'Inspección antes de cada uso',text:'Cada guante se revisa visualmente y se infla para detectar poros, cortes o zonas resecas. Se comprueba la fecha del último ensayo dieléctrico en su marcación. El casco, el arnés y la pértiga se revisan en busca de fisuras, deformaciones o suciedad conductora.',example:'Resultado esperado: el guante inflado conserva el aire, la marcación indica un ensayo vigente y no presenta daños visibles.'},
      {title:'Retiro de servicio y almacenamiento',text:'Un elemento con daños, sin marcación legible o con el ensayo vencido se retira de servicio de inmediato y se reporta. El equipo dieléctrico se guarda limpio, seco y en su bolsa, lejos del sol, de aceites y de herramientas con filo.',example:'Error frecuente: guardar los guantes doblados dentro de la caja de herramientas. Los pliegues y los objetos cortantes deterioran el aislamiento.'},
      {title:'Alcance de la clase',text:'Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA. Las clases de guantes, los intervalos de ensayo y el equipo exigido para cada tarea los define el procedimiento de la empresa.',example:'En la práctica: inspeccionar seis elementos en el banco, inflar los guantes dieléctricos y retirar los defectuosos. Cada error registra el riesgo asociado.'},
    ],
  },
  {
    id:'distribucion-distancias',runtimeClassId:null,labId:'distancias',subjectId:'distribucion',
    title:'Distancias mínimas de seguridad',
    description:'Zonas de aproximación a partes energizadas y medidas para mantener la distancia durante todo el trabajo.',
    duration:'8 min',laboratoryTitle:'Control de distancias de seguridad en un poste',
    sections:[
      {title:'Objetivo de la clase',text:'Al finalizar la clase, el participante identifica las zonas de aproximación alrededor de una parte energizada y aplica medidas para no invadirlas con el cuerpo, las herramientas ni los equipos. La electricidad puede saltar a través del aire sin contacto directo: la distancia es una protección en sí misma.',example:'Caso típico de accidente: un operario levanta una escalera metálica junto a una red energizada y la acerca a los conductores sin advertirlo.'},
      {title:'Zonas alrededor de una parte energizada',text:'Alrededor de cada conductor energizado se distinguen tres zonas. La zona de peligro solo admite trabajos con técnicas y equipos de trabajo en tensión. La zona de proximidad exige personal calificado y medidas de control. Fuera de ellas se trabaja sin restricciones eléctricas. El tamaño de cada zona crece con la tensión de la red.',example:'Resultado esperado: antes de subir, la cuadrilla identifica qué conductores siguen energizados y qué zona alcanza cada tarea.'},
      {title:'Herramientas, cargas y vehículos',text:'La distancia se mide desde el punto más cercano de cualquier objeto que se manipula, no solo desde el cuerpo. Escaleras, varillas, cables de izado y brazos de grúa o canasta pueden invadir la zona aunque la persona esté lejos.',example:'Error frecuente: controlar la posición del liniero y olvidar el extremo de la pértiga o el brazo de la canasta.'},
      {title:'Medidas de control',text:'Cuando no se puede garantizar la distancia, se desenergiza la red o se instalan barreras y cubiertas aislantes. Un observador dedicado vigila la aproximación durante las maniobras con equipos y detiene el trabajo si la distancia se reduce.',example:'En campo: cubiertas aislantes sobre la fase más próxima y un auxiliar en tierra que observa sin otras tareas.'},
      {title:'Alcance de la clase',text:'Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA. Los valores de distancia para cada nivel de tensión se toman de la norma vigente y no se reproducen en esta demo.',example:'En la práctica: instalar una luminaria desde la canasta bajo una red energizada, con observador, posición segura y cubiertas aislantes. Las zonas se muestran a escala ilustrativa.'},
    ],
  },
  {
    id:'distribucion-ats',runtimeClassId:null,subjectId:'distribucion',
    title:'Análisis de trabajo seguro y permiso de trabajo',
    description:'Identificación de peligros y controles antes de iniciar una intervención, y uso del permiso de trabajo.',
    duration:'8 min',laboratoryTitle:'Elaboración de un análisis de trabajo seguro',
    sections:[
      {title:'Objetivo de la clase',text:'Al finalizar la clase, el participante divide una tarea en pasos, identifica los peligros de cada paso y define los controles antes de empezar. El análisis de trabajo seguro (ATS) se hace en el sitio, con toda la cuadrilla, porque las condiciones reales pueden diferir de lo planeado.',example:'Caso típico de accidente: la cuadrilla repite el análisis del día anterior sin revisar el sitio y no advierte una red de telecomunicaciones cruzada.'},
      {title:'Pasos, peligros y controles',text:'El ATS se organiza en tres columnas: paso de la tarea, peligro asociado y control. Los controles se eligen en orden de eficacia: eliminar el peligro, aislarlo, aplicar procedimientos y, por último, usar equipo de protección.',example:'Ejemplo de fila: «Ascenso al poste» · caída de altura · inspección del poste, línea de vida y arnés con doble eslinga.'},
      {title:'Permiso de trabajo',text:'El permiso autoriza la tarea en un lugar, un horario y unas condiciones concretas. Lo firman quien lo emite y quien lo ejecuta, y se mantiene en el sitio durante el trabajo. Si las condiciones cambian, el trabajo se detiene y el permiso se revisa.',example:'Error frecuente: firmar el permiso en la base y llegar a un sitio con condiciones distintas, como lluvia o un tramo adicional energizado.'},
      {title:'Derecho a detener el trabajo',text:'Cualquier integrante de la cuadrilla puede detener la tarea si identifica un peligro no controlado. La tarea se reanuda solo cuando el peligro está controlado y el ATS se actualiza.',example:'Resultado esperado: el auxiliar detiene la maniobra al ver un vehículo estacionado dentro de la zona demarcada; se retira el vehículo y se reanuda.'},
      {title:'Alcance de la clase',text:'Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA. El formato del ATS y del permiso de trabajo es el que defina la empresa.',example:'La evaluación verifica la secuencia y el criterio de los controles, no un formato concreto.'},
    ],
  },
  {
    id:'distribucion-alturas',runtimeClassId:null,subjectId:'distribucion',
    title:'Trabajo en alturas en poste',
    description:'Inspección del poste, sistemas de protección contra caídas, ascenso y posicionamiento, y plan de rescate.',
    duration:'10 min',laboratoryTitle:'Ascenso seguro a un poste',
    sections:[
      {title:'Objetivo de la clase',text:'Al finalizar la clase, el participante inspecciona el poste antes de subir, usa el sistema de protección contra caídas durante todo el ascenso y conoce el plan de rescate. En redes de distribución, una caída puede ocurrir por el estado del poste, por un fallo del equipo o como consecuencia de un choque eléctrico.',example:'Caso típico de accidente: un poste de madera con la base deteriorada cede cuando el liniero se posiciona en la parte superior.'},
      {title:'Inspección del poste y del entorno',text:'Antes de subir se revisan la base, la verticalidad, las fisuras y el estado de los herrajes y templetes. Se identifican las redes energizadas cercanas y los obstáculos del ascenso. Un poste dudoso se asegura o se interviene desde una canasta.',example:'Error frecuente: subir sin revisar la base porque el poste parece en buen estado desde la calle.'},
      {title:'Sistema de protección contra caídas',text:'El sistema se compone de un punto de anclaje, un arnés de cuerpo completo y un conector, como eslinga o línea de vida. Durante el ascenso el liniero permanece conectado en todo momento, con el método de doble conexión cuando debe pasar un obstáculo.',example:'Resultado esperado: en ningún tramo del ascenso el liniero queda sin al menos un punto de conexión.'},
      {title:'Posicionamiento y plan de rescate',text:'En la posición de trabajo, la eslinga de posicionamiento sostiene el cuerpo y deja las manos libres, y el sistema contra caídas sigue conectado. Antes de empezar, la cuadrilla define quién rescata, con qué equipo y cómo se baja al trabajador en caso de accidente.',example:'Error frecuente: depender del servicio de emergencias para el rescate. La suspensión en el arnés exige bajar a la persona en pocos minutos.'},
      {title:'Alcance de la clase',text:'Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA. La certificación para trabajo en alturas, los equipos y el plan de rescate los establecen la normativa vigente y la empresa.',example:'La evaluación verifica el orden de las verificaciones y el criterio de conexión permanente.'},
    ],
  },
];
