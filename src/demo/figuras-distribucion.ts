/** Schematics for the five-rules reading, generated with Schemdraw by scripts/esquemas.py; didactic only, to be validated against the RETIE and ESSA's procedures. */
const FIGURES:Record<number,{file:string;caption:string}>={
  1:{file:'cinco-reglas-1-cortar',caption:'El seccionador abierto deja un corte visible; el bloqueo y la tarjeta impiden que alguien lo cierre.'},
  2:{file:'cinco-reglas-2-verificar',caption:'Se prueba el detector, se verifica fase por fase y se vuelve a probar el detector.'},
  3:{file:'cinco-reglas-3-tierra',caption:'Las tres fases se unen entre sí y a tierra a ambos lados de la zona de trabajo.'},
  4:{file:'cinco-reglas-4-senalizar',caption:'La zona queda delimitada y señalizada para que nadie ajeno entre en ella.'},
};
export function distributionFigure(contentId:string,index:number):HTMLElement|null{
  const item=contentId==='distribucion-cinco-reglas'?FIGURES[index]:undefined;if(!item)return null;
  const figure=document.createElement('figure');figure.className='class-figure';
  const img=document.createElement('img');img.src=`${import.meta.env.BASE_URL}esquemas/${item.file}.svg`;img.alt=item.caption;img.loading='lazy';
  const caption=document.createElement('figcaption');caption.textContent=item.caption;figure.append(img,caption);return figure;
}
