/** Simple schematics for the five-rules reading; didactic only, to be validated against the RETIE and ESSA's procedures. */
const ink='#17242b',blue='#1d4f73',yellow='#f2c230',muted='#5d6b72';
const text=(x:number,y:number,t:string,anchor='middle')=>`<text x="${x}" y="${y}" fill="${muted}" font-family="IBM Plex Sans,Arial,sans-serif" font-size="14" text-anchor="${anchor}">${t}</text>`;
/** Three phase conductors from x0 to x1, with phase labels at the left. */
const phases=(x0:number,x1:number,gap:[number,number]|null=null)=>[60,95,130].map((y,i)=>{
  const line=gap?`M${x0} ${y}H${gap[0]}M${gap[1]} ${y}H${x1}`:`M${x0} ${y}H${x1}`;
  return `<path d="${line}" stroke="${ink}" stroke-width="3"/>${text(x0-14,y+5,['L1','L2','L3'][i],'end')}`;
}).join('');
const FIGURES:Record<number,{svg:string;caption:string}>={
  1:{caption:'El seccionador abierto deja un corte visible; el bloqueo y la tarjeta impiden que alguien lo cierre.',svg:
    phases(60,460,[200,260])+[60,95,130].map(y=>`<path d="M200 ${y}l52-22" stroke="${ink}" stroke-width="3"/><circle cx="200" cy="${y}" r="4" fill="${ink}"/><circle cx="260" cy="${y}" r="4" fill="${ink}"/>`).join('')+
    `<rect x="300" y="160" width="44" height="34" rx="5" fill="${yellow}"/><path d="M309 160v-12a13 13 0 0 1 26 0v12" fill="none" stroke="${ink}" stroke-width="3"/><rect x="360" y="152" width="70" height="46" rx="4" fill="#fff" stroke="${blue}" stroke-width="2"/>${text(395,172,'NO')}${text(395,189,'OPERAR')}`+text(230,222,'Corte visible')},
  2:{caption:'Se prueba el detector, se verifica fase por fase y se vuelve a probar el detector.',svg:
    phases(60,460)+[60,95,130].map((y,i)=>`<path d="M${170+i*110} ${y}V185" stroke="${blue}" stroke-width="2" stroke-dasharray="5 5"/><rect x="${150+i*110}" y="185" width="40" height="22" rx="4" fill="${blue}"/>${text(170+i*110,226,'0 V')}`).join('')},
  3:{caption:'Las tres fases se unen entre sí y a tierra a ambos lados de la zona de trabajo.',svg:
    phases(60,460)+[110,410].map(x=>`<path d="M${x} 60V170M${x-20} 170h40M${x-13} 178h26M${x-6} 186h12" stroke="${blue}" stroke-width="3" fill="none"/>${[60,95,130].map(y=>`<circle cx="${x}" cy="${y}" r="6" fill="${yellow}" stroke="${ink}" stroke-width="2"/>`).join('')}`).join('')+
    `<rect x="170" y="40" width="180" height="110" rx="6" fill="none" stroke="${muted}" stroke-dasharray="6 6"/>`+text(260,176,'Zona de trabajo')+text(110,212,'Tierra')+text(410,212,'Tierra')},
  4:{caption:'La zona queda delimitada y señalizada para que nadie ajeno entre en ella.',svg:
    `<rect x="110" y="50" width="280" height="140" rx="4" fill="none" stroke="${yellow}" stroke-width="6" stroke-dasharray="18 10"/><path d="M250 70v100M230 80h40M226 100h48" stroke="${ink}" stroke-width="4"/>`+
    [[90,190],[410,190],[90,50],[410,50]].map(([x,y])=>`<path d="M${x} ${y+12}l10-24 10 24z" fill="${yellow}" stroke="${ink}" stroke-width="2" transform="translate(-10 -6)"/>`).join('')+text(250,222,'Zona delimitada y señalizada')},
};
export function distributionFigure(contentId:string,index:number):HTMLElement|null{
  const item=contentId==='distribucion-cinco-reglas'?FIGURES[index]:undefined;if(!item)return null;
  const figure=document.createElement('figure');figure.className='class-figure';
  figure.innerHTML=`<svg viewBox="0 0 500 240" role="img" aria-label="${item.caption}">${item.svg}</svg>`;
  const caption=document.createElement('figcaption');caption.textContent=item.caption;figure.append(caption);return figure;
}
