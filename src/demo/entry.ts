import './entry.css';
import { POLE } from './pole';
/** Role selection is a presentation aid, never authentication. */
export function mountDemoEntry(app:HTMLElement,onEnter:()=>void){
  const entry=document.createElement('section');entry.className='demo-entry';entry.setAttribute('aria-label','Acceso de demostración');
  entry.innerHTML=`<div class="demo-entry-card"><div class="demo-entry-head"><span class="demo-entry-brand">umbral<span>labs</span></span><span class="demo-entry-client">Preparado para<strong>ESSA</strong></span><div class="demo-entry-art" aria-hidden="true">${POLE}</div></div><div class="demo-entry-body"><h1>Iniciar sesión</h1><p>Selecciona tu perfil de acceso.</p><button data-role="tecnico"><span class="demo-avatar">AR</span><span><strong>Andrés Rojas</strong><small>Técnico liniero</small></span><svg class="demo-entry-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg></button><button data-role="supervisora"><span class="demo-avatar">LG</span><span><strong>Laura Gómez</strong><small>Supervisora, jefa de cuadrilla</small></span><svg class="demo-entry-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg></button><span class="demo-entry-badge">Datos de demostración</span></div></div>`;
  document.body.append(entry);
  const switcher=document.createElement('button');switcher.className='demo-profile';switcher.type='button';
  document.querySelector('.header-right')?.prepend(switcher);
  function show(){app.inert=true;entry.hidden=false;entry.querySelector<HTMLButtonElement>('button')?.focus();}
  switcher.onclick=show;
  entry.querySelectorAll<HTMLButtonElement>('[data-role]').forEach(button=>button.onclick=()=>{
    const supervisor=button.dataset.role==='supervisora';
    switcher.textContent=supervisor?'Laura Gómez':'Andrés Rojas';switcher.title='Cambiar perfil';switcher.setAttribute('aria-label',`${switcher.textContent}: cambiar perfil`);
    app.dataset.demoRole=button.dataset.role;app.inert=false;entry.hidden=true;onEnter();switcher.focus();
  });
  show();
}
