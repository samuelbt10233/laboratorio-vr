/** Animated diagrams for the concept readings. Pure SVG strings: motion comes from concept-drawings.css and
 * every duration is derived from the physics it illustrates, so the picture and the text never disagree. */
const ink='#426658',accent='#ad5132',water='#cfe6ea',waterInk='#5f9fb0',faint='#b9a88f',muted='#65594d';
export const gravity={earth:9.8,moon:1.62};
export const period=(length:number,g:number)=>2*Math.PI*Math.sqrt(length/g);
export interface ConceptDrawing {svg:string;caption:string}
const t=(x:number,y:number,value:string,size=15,fill=muted,weight=400)=>`<text x="${x}" y="${y}" fill="${fill}" font-family="Arial,sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="middle">${value}</text>`;
const wrap=(height:number,caption:string,body:string)=>({svg:`<svg viewBox="0 0 500 ${height}" role="img" aria-label="${caption}">${body}</svg>`,caption});
const seconds=(value:number)=>value.toFixed(1);

/** A pendulum hanging from a bar at y = 28; `half` is the time of one swing, so the full period is twice that. */
function pendulum(x:number,length:number,radius:number,half:number,fill=accent){
  const pivot=28,bob=pivot+length;
  return `<line x1="${x}" y1="${pivot}" x2="${x}" y2="${bob+radius}" stroke="${faint}" stroke-dasharray="4 4"/>`
    +`<g class="cd-swing" style="--half:${half.toFixed(2)}s;--amp:20deg;transform-origin:${x}px ${pivot}px"><line x1="${x}" y1="${pivot}" x2="${x}" y2="${bob}" stroke="${ink}" stroke-width="2.5"/><circle cx="${x}" cy="${bob}" r="${radius}" fill="${fill}"/></g>`
    +`<rect x="${x-34}" y="${pivot-8}" width="68" height="8" rx="2" fill="${ink}"/>`;
}
const oneMetre={earth:period(1,gravity.earth),moon:period(1,gravity.moon)};

function swing():ConceptDrawing{
  const x=250,length=140,reach=length*Math.sin(Math.PI/9),drop=28+length*Math.cos(Math.PI/9);
  return wrap(250,'Un péndulo oscila alrededor de su posición de equilibrio; una oscilación completa es el recorrido de ida y vuelta.',
    `<circle cx="${x-reach}" cy="${drop}" r="16" fill="${accent}" opacity=".22"/><circle cx="${x+reach}" cy="${drop}" r="16" fill="${accent}" opacity=".22"/>`
    +pendulum(x,length,16,oneMetre.earth/2)+t(x-reach,drop+36,'extremo')+t(x+reach,drop+36,'extremo')+t(x,28+length+36,'equilibrio')
    +t(x,238,`Una oscilación = ida y vuelta · T ≈ ${seconds(oneMetre.earth)} s`,16,ink,600));
}
function lengths():ConceptDrawing{
  const scale=50;
  return wrap(280,'Con el mismo tiempo de reloj, el péndulo de 1 m completa dos oscilaciones mientras el de 4 m completa una: cuatro veces más largo, el doble de período.',
    pendulum(150,1*scale,10,period(1,gravity.earth)/2)+pendulum(350,4*scale,14,period(4,gravity.earth)/2)
    +t(150,262,`L = 1 m · T ≈ ${seconds(period(1,gravity.earth))} s`,16,ink,600)+t(350,270,`L = 4 m · T ≈ ${seconds(period(4,gravity.earth))} s`,16,ink,600));
}
function masses():ConceptDrawing{
  const half=oneMetre.earth/2;
  return wrap(260,'Dos péndulos del mismo largo con masas distintas oscilan al unísono: la masa no cambia el período.',
    pendulum(150,120,9,half)+pendulum(350,120,22,half,ink)
    +t(150,196,'Masa 50 g',16,ink,600)+t(350,208,'Masa 500 g',16,ink,600)+t(250,246,`Mismo largo, mismo período: T ≈ ${seconds(oneMetre.earth)} s`,16,accent,600));
}
function planets():ConceptDrawing{
  return wrap(250,'El mismo péndulo de 1 m oscila más despacio en la Luna que en la Tierra, porque la gravedad es menor.',
    pendulum(150,120,14,oneMetre.earth/2)+pendulum(350,120,14,oneMetre.moon/2,ink)
    +t(150,196,'Tierra · g = 9.8 m/s²',15,ink,600)+t(350,196,'Luna · g ≈ 1.6 m/s²',15,ink,600)
    +t(150,222,`T ≈ ${seconds(oneMetre.earth)} s`,18,accent,600)+t(350,222,`T ≈ ${seconds(oneMetre.moon)} s`,18,accent,600));
}

/** Water particles crossing a region: each starts at its own phase so the stream looks continuous. */
function stream(cls:string,x0:number,run:number,dur:number,rows:number[],count=4){
  let out='';
  rows.forEach((y,row)=>{for(let k=0;k<count;k++){
    const from=run*(k+row*.37)/count;
    out+=`<circle class="cd-flow ${cls}" cx="${(x0+from).toFixed(1)}" cy="${y}" r="4" fill="${waterInk}" style="--run:${run}px;--dur:${dur.toFixed(2)}s;--from:${from.toFixed(1)}px;animation-delay:${(-(from/run)*dur).toFixed(2)}s"/>`;
  }});
  return out;
}
const SPEED=36;
function flowRate():ConceptDrawing{
  return wrap(250,'Caudal: el volumen que atraviesa una sección cada segundo es el área por la velocidad, Q = A · v.',
    `<path d="M40 90H460V170H40Z" fill="${water}"/><path d="M40 90H460M40 170H460" stroke="${ink}" stroke-width="3" fill="none"/>`
    +stream('cd-pipe',50,400,400/SPEED,[108,130,152],5)
    +`<path d="M250 78V182" stroke="${accent}" stroke-width="2.5" stroke-dasharray="5 5"/>`+t(250,68,'sección A',15,accent,600)
    +`<path d="M70 52h90m-12-8 12 8-12 8" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`+t(115,40,'velocidad v')
    +t(250,214,'Q = A · v',22,accent,700)+t(250,238,'Volumen que pasa cada segundo'));
}
const pipe=`<path d="M40 70H200L260 110H460V150H260L200 190H40Z" fill="${water}"/><path d="M40 70H200L260 110H460M40 190H200L260 150H460" stroke="${ink}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
const streams=stream('cd-wide',50,144,144/SPEED,[95,130,165])+stream('cd-narrow',270,180,180/(4*SPEED),[122,138]);
function continuity():ConceptDrawing{
  return wrap(250,'Donde la tubería se estrecha a la cuarta parte del área, el agua va cuatro veces más rápido (A₁ · v₁ = A₂ · v₂).',
    pipe+streams+t(120,214,'A₁ = 4 cm²',16,ink,600)+t(120,236,'velocidad v')+t(360,214,'A₂ = 1 cm²',16,ink,600)+t(360,236,'velocidad 4v',15,accent,600));
}
function venturi():ConceptDrawing{
  const tube=(x:number,top:number,level:number)=>`<rect x="${x+1}" y="${level}" width="18" height="${top-level}" fill="${waterInk}" opacity=".85"/><path d="M${x} ${top}V16M${x+20} ${top}V16" stroke="${ink}" stroke-width="2.5" fill="none"/><rect x="${x+1}" y="${top-4}" width="18" height="8" fill="${water}"/>`;
  return wrap(250,'En la garganta de un tubo de Venturi el agua va más rápido y la presión baja: la columna del tubo queda más baja.',
    pipe+streams+tube(110,70,34)+tube(350,110,84)
    +`<path d="M132 34H392" stroke="${accent}" stroke-width="1.5" stroke-dasharray="4 4"/><path d="M392 34V84m-6 0h12m-12-50h12" stroke="${accent}" stroke-width="2" fill="none"/>`+t(420,64,'Δp',17,accent,700)
    +t(120,214,'Sección ancha',16,ink,600)+t(120,236,'v menor · p mayor')+t(360,214,'Garganta',16,ink,600)+t(360,236,'v mayor · p menor'));
}

const drawings=new Map<string,(()=>ConceptDrawing)[]>([['mecanica-pendulo',[swing,lengths,masses,planets]],['fluidos-bernoulli',[flowRate,continuity,venturi]]]);
/** The drawing that goes under section `index` of a concept reading, or null when it has none. */
export function conceptDrawing(contentId:string,index:number):ConceptDrawing|null{return drawings.get(contentId)?.[index]?.()??null;}
