/** A generated schematic served from `public/<folder>/<file>.svg`, with its caption (docs/plan-clases.md, section 4). */
export interface Scheme {file:string;caption:string}
export function schemeFigure(folder:string,item:Scheme):HTMLElement{
  const figure=document.createElement('figure');figure.className='class-figure';
  const img=document.createElement('img');img.src=`${import.meta.env.BASE_URL}${folder}/${item.file}.svg`;img.alt=item.caption;img.loading='lazy';
  const caption=document.createElement('figcaption');caption.textContent=item.caption;figure.append(img,caption);return figure;
}
