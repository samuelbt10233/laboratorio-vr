import type { Question } from './evaluaciones';
// Claude's file (docs/plan-icetex.md). Didactic only: not financial advice and no real credit conditions.
export const evaluacionesFinanzas:Record<string,Question[]>={
  'finanzas-presupuesto':[
    {prompt:'¿Cuál de estos es un gasto fijo?',options:['Las salidas con amigos','La cuota mensual del crédito','Las compras en línea'],answer:1,why:'Un gasto fijo se repite cada mes con un valor conocido; la cuota del crédito lo es, las salidas y las compras dependen de las decisiones.'},
    {prompt:'¿En qué momento conviene separar el ahorro del mes?',options:['Al final del mes, con lo que sobre','Solo cuando aparece un imprevisto','Al recibir el ingreso, después de cubrir los gastos fijos'],answer:2,why:'«Págate primero»: el ahorro se separa al recibir el ingreso. Lo que sobra al final del mes casi nunca alcanza.'},
    {prompt:'Se daña el computador a mitad de semestre. ¿Cuál es la mejor forma de pagar la reparación?',options:['Con el fondo para imprevistos y ajustando los gastos variables','Con un préstamo informal que se paga a diario','Dejando de pagar la cuota de ese mes'],answer:0,why:'El fondo para imprevistos existe para esto; los préstamos informales y la mora salen mucho más caros.'},
  ],
  'finanzas-credito':[
    {prompt:'Si se alarga el plazo de un crédito, ¿qué pasa normalmente?',options:['La cuota y el total pagado bajan','La cuota baja, pero el total pagado sube','La cuota sube y el total pagado baja'],answer:1,why:'Con más plazo se pagan intereses durante más tiempo: la cuota es menor, pero la suma de los pagos es mayor.'},
    {prompt:'¿Dónde se consultan las condiciones de un crédito educativo?',options:['En grupos de estudiantes en redes sociales','En los canales oficiales de la entidad','En un mensaje que llega con un enlace de pago'],answer:1,why:'Las condiciones de cada línea las define la entidad y solo sus canales oficiales las informan con certeza.'},
    {prompt:'Un mes no alcanza para pagar la cuota. ¿Qué conviene hacer?',options:['Esperar a que la entidad llame','Pagar solo una parte sin avisar','Contactar a la entidad antes del vencimiento para conocer las alternativas'],answer:2,why:'Buscar a la entidad a tiempo abre alternativas; la mora genera intereses y puede afectar el historial crediticio.'},
  ],
  'finanzas-fraudes':[
    {prompt:'¿Cuál es una señal de alerta en una oferta de inversión?',options:['Una rentabilidad alta y garantizada en poco tiempo','Un contrato escrito con las condiciones','Una entidad vigilada por la Superintendencia Financiera'],answer:0,why:'Nadie puede garantizar rentabilidades altas sin riesgo: es la señal más común de una estafa.'},
    {prompt:'Llega un mensaje con un enlace para pagar la cuota con descuento. ¿Qué se hace?',options:['Pagar rápido para no perder el descuento','Entrar escribiendo la dirección oficial o con la aplicación oficial','Responder el mensaje con los datos de la tarjeta para confirmar'],answer:1,why:'Los enlaces recibidos pueden llevar a páginas falsas; se paga solo por los canales oficiales.'},
    {prompt:'Alguien que dice ser del banco pide el código que llegó por mensaje de texto. ¿Qué indica?',options:['Que es un procedimiento normal de verificación','Que la cuenta ya está protegida','Que es un intento de suplantación: ninguna entidad pide ese código'],answer:2,why:'El código de verificación autoriza operaciones; quien lo pide intenta entrar a la cuenta.'},
  ],
};
