import { conceptDrawing } from './concept-drawings';
import './concept-drawings.css';
/** The figure under a concept section, or null. It says plainly that it is an illustration, not a simulator. */
export function conceptFigure(contentId:string,index:number):HTMLElement|null{
  const drawing=conceptDrawing(contentId,index);if(!drawing)return null;
  const figure=document.createElement('figure');figure.className='concept-drawing';figure.innerHTML=drawing.svg;
  const caption=document.createElement('figcaption');caption.textContent=`${drawing.caption} Ilustración animada: no es un simulador.`;figure.append(caption);return figure;
}
