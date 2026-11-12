/** A month of a student's budget, decision by decision. Didactic only: fictitious round figures, not financial advice. */
export const INCOME=1_200_000;
export interface Money {fijos:number;fondo:number;variables:number;imprevistos:number;cuota:'pendiente'|'al-dia'}
type Effect=Partial<Omit<Money,'cuota'>>&{cuota?:'al-dia'};
export interface Choice {id:string;label:string;ok:boolean;feedback:string;effect?:Effect}
export interface Stage {id:string;day:number;title:string;situation:string;choices:Choice[]}
export const budgetStages:readonly Stage[]=[
  {id:'ingreso',day:1,title:'Llega el ingreso del mes',situation:'Valentina recibe $1.200.000 entre el apoyo de sostenimiento y su trabajo de medio tiempo. Tiene por pagar el arriendo ($450.000), el transporte ($120.000) y la cuota del crédito ($130.000).',choices:[
    {id:'audifonos',label:'Aprovechar una oferta de audífonos por $180.000 y pagar lo demás después',ok:false,feedback:'Los gastos variables van después de los fijos. Con la oferta primero, la cuota queda en riesgo si el dinero no alcanza.'},
    {id:'fijos',label:'Pagar el arriendo, el transporte y la cuota del crédito',ok:true,feedback:'Los gastos fijos y la cuota quedan cubiertos el primer día: $700.000.',effect:{fijos:700_000,cuota:'al-dia'}},
    {id:'esperar',label:'Dejar todo en la cuenta y pagar cada cosa cuando llegue el cobro',ok:false,feedback:'Sin separar los fijos, el dinero se gasta en el día a día y la cuota puede pagarse tarde, con intereses de mora.'},
  ]},
  {id:'ahorro',day:1,title:'Separar el ahorro',situation:'Quedan $500.000 para el resto del mes. Valentina quiere construir un fondo para imprevistos.',choices:[
    {id:'final',label:'Ahorrar lo que sobre al final del mes',ok:false,feedback:'Lo que sobra al final casi nunca alcanza. El ahorro se separa el día que llega el ingreso.'},
    {id:'nada',label:'No ahorrar este mes porque la cantidad es pequeña',ok:false,feedback:'Un ahorro pequeño y constante construye el fondo. Saltarse meses deja sin respaldo ante un imprevisto.'},
    {id:'separar',label:'Separar $120.000 en el fondo para imprevistos',ok:true,feedback:'«Págate primero»: el ahorro sale antes que los gastos variables.',effect:{fondo:120_000}},
  ]},
  {id:'variables',day:3,title:'Planear los gastos variables',situation:'Con $380.000 disponibles, Valentina organiza la alimentación y el ocio del mes.',choices:[
    {id:'plan',label:'Reservar $250.000 para alimentación y $80.000 para salidas',ok:true,feedback:'El plan deja un margen de $50.000 para lo que no se previó.',effect:{variables:330_000}},
    {id:'domicilios',label:'Pedir domicilios a diario, unos $420.000 al mes',ok:false,feedback:'Ese gasto supera lo disponible: tocaría usar el fondo o endeudarse para comer.'},
    {id:'sin-plan',label:'No planear: gastar según lo que vaya surgiendo',ok:false,feedback:'Sin un tope por categoría, los gastos pequeños suman y el dinero se acaba antes de fin de mes.'},
  ]},
  {id:'enlace',day:12,title:'Un mensaje con descuento',situation:'Llega un chat: «Descuento del 30 % en tu cuota si pagas hoy desde este enlace». El remitente no está entre sus contactos.',choices:[
    {id:'pagar-enlace',label:'Pagar la próxima cuota desde el enlace para aprovechar el descuento',ok:false,feedback:'Es una estafa por suplantación: el dinero llegaría a la cuenta del estafador. Se paga solo por los canales oficiales.'},
    {id:'reenviar',label:'Reenviar el enlace a sus compañeros para que también ahorren',ok:false,feedback:'Reenviar un enlace sin verificar extiende el fraude a otras personas.'},
    {id:'verificar',label:'No abrir el enlace y consultar en el canal oficial de la entidad',ok:true,feedback:'Ninguna entidad ofrece descuentos por enlaces de chat. Verificar en el canal oficial evita la estafa.'},
  ]},
  {id:'imprevisto',day:18,title:'Se daña el cargador del computador',situation:'Valentina necesita el computador para entregar un trabajo esta semana. El cargador nuevo cuesta $90.000.',choices:[
    {id:'gota',label:'Pedir un préstamo informal que se paga a diario',ok:false,feedback:'Los préstamos informales cobran intereses muy altos y pueden incluir cobros intimidatorios.'},
    {id:'fondo',label:'Pagarlo con el fondo para imprevistos',ok:true,feedback:'Para esto existe el fondo: el imprevisto se paga sin deudas.',effect:{fondo:-90_000,imprevistos:90_000}},
    {id:'cuotas',label:'Pagarlo con tarjeta de crédito a 36 cuotas',ok:false,feedback:'Diferir un gasto pequeño a muchas cuotas multiplica los intereses pagados.'},
  ]},
  {id:'concierto',day:24,title:'Una invitación a un concierto',situation:'Sus amigos van a un concierto de $150.000. Del presupuesto de salidas le quedan $40.000.',choices:[
    {id:'comida',label:'Comprar la entrada con lo reservado para alimentación',ok:false,feedback:'Tomar dinero de un gasto necesario deja la última semana sin presupuesto para comer.'},
    {id:'prestado',label:'Pedir prestado a un amigo y devolverlo el mes que viene',ok:false,feedback:'Endeudarse para un gasto de ocio compromete el presupuesto del mes siguiente.'},
    {id:'alternativa',label:'Proponer un plan que quepa en $40.000 y empezar a ahorrar para el próximo',ok:true,feedback:'Un gasto de ocio se ajusta al presupuesto o se planea como meta de ahorro.'},
  ]},
  {id:'cierre',day:30,title:'Cierre del mes',situation:'Al final del mes quedan $50.000 sin usar en la cuenta.',choices:[
    {id:'sin-destino',label:'Dejarlos en la cuenta, sin un destino definido',ok:false,feedback:'Sin un destino, el sobrante se diluye en gastos pequeños el mes siguiente.'},
    {id:'fondo-cierre',label:'Pasar el sobrante al fondo para imprevistos',ok:true,feedback:'El fondo se recupera del imprevisto y el mes cierra con la cuota al día.',effect:{fondo:50_000}},
    {id:'gastar',label:'Gastarlos en el fin de semana porque «sobraron»',ok:false,feedback:'Lo que sobra es una oportunidad de reponer el fondo, no un gasto extra.'},
  ]},
];
export interface MonthState {stage:number;errors:number;finished:boolean;money:Money}
export interface MonthResult {state:MonthState;ok:boolean;message:string}
export const startMonth=():MonthState=>({stage:0,errors:0,finished:false,money:{fijos:0,fondo:0,variables:0,imprevistos:0,cuota:'pendiente'}});
/** Money still available in the account. */
export const libre=(m:Money)=>INCOME-m.fijos-m.fondo-m.variables-m.imprevistos;
function apply(m:Money,e:Effect={}):Money{return {fijos:m.fijos+(e.fijos??0),fondo:m.fondo+(e.fondo??0),variables:m.variables+(e.variables??0),imprevistos:m.imprevistos+(e.imprevistos??0),cuota:e.cuota??m.cuota};}
/** A wrong choice is counted and explained and changes no money; the month only moves on with the right one. */
export function choose(state:MonthState,choiceId:string):MonthResult{
  if(state.finished)return {state,ok:false,message:'El mes ya terminó. Pulsar «Reiniciar» para repetirlo.'};
  const stage=budgetStages[state.stage],choice=stage.choices.find(c=>c.id===choiceId);
  if(!choice)return {state,ok:false,message:'Elegir una de las opciones.'};
  if(!choice.ok)return {state:{...state,errors:state.errors+1},ok:false,message:`Error: ${choice.feedback}`};
  const next=state.stage+1,finished=next===budgetStages.length;
  return {state:{...state,stage:finished?state.stage:next,finished,money:apply(state.money,choice.effect)},ok:true,message:finished?`Mes completo: la cuota quedó al día, los imprevistos se pagaron sin deudas y el fondo cierra con ahorro. ${choice.feedback}`:`Correcto. ${choice.feedback}`};
}
