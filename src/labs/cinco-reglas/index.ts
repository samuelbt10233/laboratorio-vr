import type { LabModule } from '../types';
import './cinco-reglas.css';
let card:HTMLElement|null=null;
/** Placeholder until D2 builds the pole scene: it opens and closes like a real laboratory. */
export const lab:LabModule={
  mount({host}){
    card?.remove();card=document.createElement('section');card.className='cinco-reglas-pending';
    card.innerHTML='<p class="cinco-reglas-kicker">Práctica en preparación</p><h2>Las cinco reglas de oro en un poste con transformador</h2><p>Cortar, bloquear, verificar ausencia de tensión, poner a tierra y en cortocircuito, y señalizar la zona de trabajo.</p>';
    host.append(card);
  },
  unmount(){card?.remove();card=null;},
};
