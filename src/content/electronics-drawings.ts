/** Small local diagrams for the electronics readings; no external assets or simulation state. */
const ink='#426658',accent='#ad5132';
function label(x:number,y:number,text:string){return `<text x="${x}" y="${y}" fill="#65594d" font-family="Arial,sans-serif" font-size="15" text-anchor="middle">${text}</text>`;}
const resistor=(x:number,y:number)=>`<path d="M${x} ${y}h12l7-12 12 24 12-24 12 24 7-12h12"/>`;
function circuit(kind:'closed'|'open'|'missing'|'series'|'led'){
 let drawing=`<path d="M100 110V65h110m74 0h116v110H100v-45"/>${resistor(210,65)}<path d="M82 110h36m-28 20h20"/>`;
 if(kind==='series')drawing=`<path d="M100 110V65h50m74 0h76m74 0h26v110H100v-45"/>${resistor(150,65)}${resistor(300,65)}<path d="M82 110h36m-28 20h20"/>`;
 if(kind==='open')drawing=drawing.replace('h116v110H100','h116v110h-50m-50 0H100')+`<path d="m300 175 43-25" stroke="${accent}"/><circle cx="300" cy="175" r="4"/><circle cx="350" cy="175" r="4"/>`;
 if(kind==='missing')drawing=drawing.replace('h116v110H100','h116v35m0 38v37H100')+`<path d="M400 100v38" stroke="${accent}" stroke-dasharray="5 5"/><circle cx="400" cy="100" r="4"/><circle cx="400" cy="138" r="4"/>`;
 if(kind==='led')drawing=drawing.replace('h116v110H100','h116v110h-140m-40 0H100')+`<path d="m220 155 35 20-35 20ZM260 152v46" stroke="${accent}"/><path d="m265 145 20-20m-10 0h10v10m-5 14 20-20m-10 0h10v10" stroke="${accent}"/>`;
 if(kind==='led')drawing=drawing.replace('M82 110h36m-28 20h20','M90 110h20m-28 20h36');
 let text=label(72,119,'6 V')+label(247,37,kind==='led'?'R1 · 220 Ω':'R1 · 100 Ω');
 if(kind==='series')text=label(72,119,'6 V')+label(187,37,'100 Ω')+label(337,37,'100 Ω')+label(250,222,'Un camino · 30 mA por ambas');
 else if(kind==='led')text+=label(204,221,'Ánodo A +')+label(302,221,'Cátodo K −');
 else text+=label(250,222,kind==='open'?'Interruptor abierto · 0 mA':kind==='missing'?'Cable ausente · camino interrumpido':'Camino cerrado · 60 mA');
 return `<g fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${drawing}</g>${text}`;
}
function parallel(){return `<g fill="none" stroke="${ink}" stroke-width="3" stroke-linejoin="round"><path d="M90 111V55h125m74 0h121v140H90v-63M145 55v90h70m74 0h76V55M72 111h36m-28 21h20"/>${resistor(215,55)}${resistor(215,145)}<circle cx="145" cy="55" r="4" fill="${ink}"/><circle cx="365" cy="55" r="4" fill="${ink}"/></g>${label(56,126,'6 V')}${label(252,26,'100 Ω → 60 mA')}${label(252,116,'200 Ω → 30 mA')}${label(252,228,'Mismos dos puntos · total: 90 mA')}`;}
function ohm(){return `<rect x="30" y="35" width="210" height="175" rx="12" fill="#efe7da"/><rect x="260" y="35" width="210" height="175" rx="12" fill="#efe7da"/>${label(135,76,'Fuente: 6 V')}${label(365,76,'Fuente: 6 V')}<g stroke="${ink}" stroke-width="3" fill="none">${resistor(98,114)}${resistor(328,114)}</g>${label(135,153,'100 Ω → 60 mA')}${label(365,153,'200 Ω → 30 mA')}${label(250,240,'Mismo voltaje · doble resistencia · mitad de corriente')}`;}
const drawings:Record<string,Record<number,{kind:string;caption:string}>>={
 'ley-de-ohm':{1:{kind:'closed',caption:'La fuente y la resistencia forman un recorrido cerrado mediante los cables.'},2:{kind:'open',caption:'Al abrir el interruptor se corta el recorrido; la fuente conserva su voltaje.'},3:{kind:'ohm',caption:'Comparación con el circuito cerrado: aumentar la resistencia reduce la corriente.'},4:{kind:'series',caption:'En serie, la misma corriente recorre las dos resistencias.'}},
 'circuitos-en-paralelo':{1:{kind:'parallel',caption:'Cada resistencia conecta los mismos dos puntos. Ambas tienen 6 V.'}},
 'encuentra-el-fallo':{1:{kind:'open',caption:'Primer indicio: un interruptor abierto interrumpe el camino.'},2:{kind:'missing',caption:'El tramo discontinuo indica el cable que falta; no es una conexión existente.'}},
 'enciende-un-led':{1:{kind:'led',caption:'El LED conduce del ánodo al cátodo. La resistencia en serie limita la corriente.'}}
};
export function electronicsDrawing(contentId:string,index:number):HTMLElement|null{
 const item=drawings[contentId]?.[index];if(!item)return null;
 const figure=document.createElement('figure');figure.className='electronics-drawing';
 const art=item.kind==='parallel'?parallel():item.kind==='ohm'?ohm():circuit(item.kind as 'closed'|'open'|'missing'|'series'|'led');
 figure.innerHTML=`<svg viewBox="0 0 500 260" role="img" aria-label="${item.caption}">${art}</svg>`;
 const caption=document.createElement('figcaption');caption.textContent=item.caption;figure.append(caption);return figure;
}
