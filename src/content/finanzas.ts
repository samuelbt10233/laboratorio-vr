import type { LearningContent } from '../learning-content';
// Claude's file (docs/plan-icetex.md). Didactic content for the ICETEX demo: no real credit conditions, rates or financial advice.
export const finanzas:readonly LearningContent[]=[
  {
    id:'finanzas-presupuesto',runtimeClassId:null,labId:'presupuesto',simulator:true,subjectId:'finanzas',
    title:'Presupuesto y ahorro durante los estudios',
    description:'Organizar los ingresos del mes, separar gastos fijos y variables y apartar ahorro desde el primer día.',
    duration:'8 min',laboratoryTitle:'Simulador: un mes con presupuesto',
    sections:[
      {title:'Objetivo de la clase',text:'Al finalizar la clase, el participante organiza sus ingresos del mes en un presupuesto, distingue gastos fijos y variables y aparta un ahorro antes de gastar. Un presupuesto no limita: muestra a dónde va el dinero y permite decidir con anticipación.',example:'Caso frecuente: el dinero del mes se acaba en la tercera semana porque nadie anotó los gastos pequeños del día a día.'},
      {title:'Ingresos y gastos del mes',text:'Primero se listan todos los ingresos: apoyo de sostenimiento, trabajo de medio tiempo o ayuda familiar. Después los gastos fijos, que se repiten cada mes con un valor conocido (arriendo, transporte, cuota del crédito), y los variables, que cambian según las decisiones (comidas fuera, salidas, compras, suscripciones).',example:'Ejemplo ficticio: ingresos de $1.000.000; fijos de $600.000 entre arriendo, transporte y cuota; quedan $400.000 para alimentación, ahorro y gastos variables.'},
      {title:'Págate primero',text:'El orden importa. Se cubren primero los gastos fijos y la cuota, después se separa el ahorro y solo con lo que queda se atienden los gastos variables. Una guía de referencia reparte el ingreso en necesidades, gustos y ahorro; cada persona ajusta los porcentajes a su situación.',example:'Error frecuente: ahorrar «lo que sobre» al final del mes. Casi nunca sobra; el ahorro se separa el día que llega el ingreso.'},
      {title:'Fondo para imprevistos',text:'Un fondo para imprevistos cubre gastos que no se pueden aplazar: un computador dañado, una cita médica o materiales de un curso. Se construye poco a poco y se usa solo para emergencias. Sin él, un imprevisto termina en deudas caras o en préstamos informales.',example:'Resultado esperado: ante un imprevisto, la estudiante lo paga con su fondo y ajusta los gastos variables del mes, sin pedir prestado.'},
      {title:'Alcance de la clase',text:'Contenido didáctico de demostración. No constituye asesoría financiera. Las cifras son ficticias y redondeadas para facilitar el cálculo.',example:'En la práctica: un mes de Valentina en el simulador. Cada decisión mueve el saldo, el ahorro y la cuota al día, y cada error explica su consecuencia.'},
    ],
  },
  {
    id:'finanzas-credito',runtimeClassId:null,subjectId:'finanzas',
    title:'Crédito educativo responsable',
    description:'Entender capital, intereses, plazo y cuota, y por qué pagar a tiempo protege el historial crediticio.',
    duration:'8 min',laboratoryTitle:'Lectura de un plan de pagos',
    sections:[
      {title:'Objetivo de la clase',text:'Al finalizar la clase, el participante reconoce los componentes de un crédito educativo, lee un plan de pagos y explica por qué pagar a tiempo protege su historial crediticio. Un crédito bien usado es una inversión en la formación; mal gestionado, se convierte en una carga.',example:'Caso frecuente: un estudiante deja de pagar dos cuotas pensando en ponerse al día después y termina con intereses de mora y un reporte negativo.'},
      {title:'Capital, interés, plazo y cuota',text:'El capital es el dinero prestado. El interés es el costo de usarlo. El plazo es el tiempo para devolverlo y la cuota, el pago periódico. Con un plazo más largo la cuota baja, pero el total pagado sube porque se pagan intereses durante más tiempo.',example:'Ejemplo ficticio: el mismo préstamo a 12 o a 24 cuotas. La cuota a 24 es menor, pero la suma de todos los pagos es mayor.'},
      {title:'El plan de pagos',text:'El plan de pagos indica cuánto se paga, en qué fechas y por qué canal. Muchos créditos educativos distinguen una etapa durante los estudios y otra de pago al terminar. Las condiciones de cada línea las define la entidad y se consultan solo en sus canales oficiales.',example:'Resultado esperado: conocer el valor de la próxima cuota, su fecha límite y el canal oficial para pagarla.'},
      {title:'Mora e historial crediticio',text:'Pagar tarde genera intereses de mora y puede producir un reporte negativo en las centrales de información, que dificulta créditos futuros para vivienda o emprendimiento. Si aparece una dificultad, se contacta a la entidad antes de dejar de pagar para conocer las alternativas disponibles.',example:'Error frecuente: ignorar los avisos de cobro. Buscar a la entidad a tiempo abre opciones que desaparecen cuando la deuda está vencida.'},
      {title:'Alcance de la clase',text:'Contenido didáctico de demostración. No constituye asesoría financiera ni describe las condiciones de ninguna línea de crédito real. Las cifras son ficticias.',example:'Cada pregunta de la evaluación explica el concepto que pone a prueba.'},
    ],
  },
  {
    id:'finanzas-fraudes',runtimeClassId:null,subjectId:'finanzas',
    title:'Prevención de fraudes y estafas',
    description:'Reconocer ofertas de inversión falsas, suplantaciones y estafas digitales antes de entregar dinero o datos.',
    duration:'8 min',laboratoryTitle:'Revisión de mensajes sospechosos',
    sections:[
      {title:'Objetivo de la clase',text:'Al finalizar la clase, el participante reconoce las señales de una estafa financiera, verifica a quién entrega su dinero o sus datos y sabe qué hacer si fue víctima. Los estudiantes son un blanco frecuente: manejan dinero propio por primera vez y están muy conectados.',example:'Caso frecuente: un mensaje promete duplicar el dinero en un mes si además se invita a otras personas.'},
      {title:'Señales de alerta',text:'Una oferta es sospechosa si promete rentabilidad alta y garantizada, presiona para decidir de inmediato, pide un pago anticipado para liberar un préstamo o un premio, o solicita contraseñas y códigos. También lo es si la entidad no está vigilada o no tiene canales verificables.',example:'Regla práctica: si promete mucho, rápido y sin riesgo, es una señal de alerta.'},
      {title:'Suplantación y enlaces falsos',text:'Los estafadores imitan a bancos y entidades educativas con mensajes, correos y páginas parecidas a las oficiales. Ninguna entidad pide contraseñas ni códigos de verificación por mensaje. Para pagar o consultar, se escribe la dirección oficial en el navegador o se usa la aplicación oficial.',example:'Error frecuente: pagar la cuota desde un enlace recibido por chat. El dinero llega a una cuenta del estafador.'},
      {title:'Verificar y reaccionar',text:'Antes de invertir se comprueba que la entidad esté vigilada por la Superintendencia Financiera de Colombia. Si se fue víctima: bloquear las cuentas y tarjetas, cambiar las claves, avisar de inmediato a la entidad y denunciar ante las autoridades.',example:'Resultado esperado: antes de pagar o invertir, saber quién recibe el dinero y por qué canal.'},
      {title:'Alcance de la clase',text:'Contenido didáctico de demostración. No constituye asesoría financiera. Los mensajes de ejemplo son ficticios.',example:'Cada pregunta de la evaluación explica la señal de alerta que pone a prueba.'},
    ],
  },
];
