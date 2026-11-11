import type { Question } from './evaluaciones';
// Claude's file (docs/plan-clases.md). Didactic only: to be validated against the RETIE and ESSA's procedures.
export const evaluacionesDistribucion:Record<string,Question[]>={
  'distribucion-cinco-reglas':[
    {prompt:'¿Por qué no basta con abrir un tramo de red para trabajar en él?',options:['Puede volver a tener tensión por una maniobra, un generador, inducción o una descarga','Porque abrirlo daña el transformador','Porque la cuadrilla necesita más tiempo para subir al poste'],answer:0,why:'Un tramo abierto puede reenergizarse por varias causas; las cinco reglas mantienen el trabajo sin tensión mientras dure.'},
    {prompt:'¿Qué se hace justo antes de poner a tierra y en cortocircuito?',options:['Señalizar la zona de trabajo','Verificar la ausencia de tensión en cada fase','Retirar el bloqueo del punto de corte'],answer:1,why:'Poner a tierra sin verificar es el error que provoca el arco en la práctica: primero se comprueba que no hay tensión.'},
    {prompt:'Un detector que no se probó no indica tensión. ¿Qué significa?',options:['Que la red está sin tensión','Nada: el detector puede estar dañado y debe probarse antes y después','Que ya se puede poner a tierra'],answer:1,why:'El detector se prueba antes y después de la medida; si no, su lectura no demuestra nada.'},
  ],
  'distribucion-epp':[
    {prompt:'¿Qué papel cumple el equipo de protección personal frente a las cinco reglas de oro?',options:['Es la última barrera: limita las consecuencias si algo falla','Las reemplaza cuando el trabajo es corto','Solo se usa cuando la red está energizada'],answer:0,why:'El equipo de protección no reemplaza el trabajo sin tensión; reduce el daño si los demás controles fallan.'},
    {prompt:'¿Cómo se inspecciona un guante dieléctrico antes de usarlo?',options:['Basta con revisar que esté limpio','Se prueba tocando un conductor de baja tensión','Se revisa, se infla para detectar poros y se comprueba la fecha de su último ensayo'],answer:2,why:'La inspección visual, el inflado y la marcación de ensayo vigente confirman que el aislamiento sigue íntegro.'},
    {prompt:'Un guante tiene la marcación ilegible pero no muestra daños. ¿Qué se hace?',options:['Se usa con un guante protector encima','Se retira de servicio y se reporta','Se usa solo en baja tensión'],answer:1,why:'Sin marcación no se puede confirmar el ensayo dieléctrico: el elemento sale de servicio.'},
  ],
  'distribucion-distancias':[
    {prompt:'¿Por qué no basta con evitar tocar un conductor energizado?',options:['Porque los conductores siempre están desnudos','Porque el contacto solo es peligroso con lluvia','Porque la electricidad puede saltar por el aire al acercarse'],answer:2,why:'Al invadir la zona de peligro puede formarse un arco sin contacto directo; la distancia es una protección.'},
    {prompt:'¿Desde dónde se mide la distancia de seguridad?',options:['Desde el punto más cercano de cualquier objeto que se manipula','Desde el cuerpo del liniero','Desde la base del poste'],answer:0,why:'Escaleras, pértigas, cables de izado o el brazo de una canasta también pueden invadir la zona.'},
    {prompt:'Si no se puede garantizar la distancia, ¿qué medida corresponde?',options:['Trabajar más rápido','Desenergizar o instalar barreras y cubiertas aislantes, con un observador dedicado','Usar guantes de cuero'],answer:1,why:'Cuando la distancia no se garantiza, se elimina el peligro o se aísla, y alguien vigila la aproximación.'},
  ],
  'distribucion-ats':[
    {prompt:'¿Dónde y con quién se elabora el análisis de trabajo seguro?',options:['En la oficina, por el supervisor','En el sitio, con toda la cuadrilla','Se reutiliza el del día anterior'],answer:1,why:'Las condiciones reales del sitio pueden diferir de lo planeado; el análisis se hace allí y con quienes ejecutan.'},
    {prompt:'¿Cuál es el orden de eficacia de los controles?',options:['Eliminar, aislar, procedimientos y por último equipo de protección','Equipo de protección, procedimientos, aislar, eliminar','Procedimientos, eliminar, equipo de protección, aislar'],answer:0,why:'Primero se intenta eliminar o aislar el peligro; el equipo de protección es el último recurso.'},
    {prompt:'Durante el trabajo cambian las condiciones del sitio. ¿Qué ocurre con el permiso?',options:['Sigue vigente hasta el final de la jornada','Se anota el cambio al terminar','Se detiene el trabajo y se revisa el permiso'],answer:2,why:'El permiso vale para unas condiciones concretas; si cambian, el trabajo se detiene y se revisa.'},
  ],
  'distribucion-alturas':[
    {prompt:'¿Qué se revisa antes de subir a un poste?',options:['La base, la verticalidad, las fisuras, los herrajes y las redes cercanas','Solo el arnés','Que el poste tenga numeración'],answer:0,why:'El estado del poste y su entorno puede provocar una caída aunque el equipo personal esté en buen estado.'},
    {prompt:'¿Cuándo debe estar conectado el liniero al sistema contra caídas?',options:['Solo en la posición de trabajo','Solo por encima de cierta altura','En todo momento, con doble conexión al pasar obstáculos'],answer:2,why:'La conexión permanente evita que haya un tramo del ascenso sin protección.'},
    {prompt:'¿Por qué se define el plan de rescate antes de empezar?',options:['Porque lo exige el formato','Porque la suspensión en el arnés obliga a bajar a la persona en pocos minutos','Porque los servicios de emergencia no atienden postes'],answer:1,why:'Una persona suspendida en el arnés corre riesgo en poco tiempo; el rescate lo hace la cuadrilla.'},
  ],
};
