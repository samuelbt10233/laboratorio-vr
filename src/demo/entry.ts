import './entry.css';
import { currentClient } from './cliente';
/** Role selection is a presentation aid, never authentication. */
export function mountDemoEntry(app:HTMLElement,onEnter:()=>void){
  const entry=document.createElement('section');entry.className='demo-entry';entry.setAttribute('aria-label','Acceso de demostración');
  const client=currentClient();
  const profiles=client.profiles.map(p=>`<button data-role="${p.role}"><span class="demo-avatar">${p.initials}</span><span><strong>${p.name}</strong><small>${p.title}</small></span><svg class="demo-entry-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg></button>`).join('');
  entry.innerHTML=`<div class="demo-entry-card"><div class="demo-entry-head"><span class="demo-entry-brand">umbral<span>labs</span></span><span class="demo-entry-client">Preparado para<strong>${client.name}</strong></span><div class="demo-entry-art" aria-hidden="true">${client.art}</div></div><div class="demo-entry-body"><h1>Iniciar sesión</h1><p>Selecciona tu perfil de acceso.</p>${profiles}<span class="demo-entry-badge">Datos de demostración</span></div></div>`;
  document.body.append(entry);
  const switcher=document.createElement('button');switcher.className='demo-profile';switcher.type='button';
  document.querySelector('.header-right')?.prepend(switcher);
  function show(){app.inert=true;entry.hidden=false;entry.querySelector<HTMLButtonElement>('button')?.focus();}
  switcher.onclick=show;
  entry.querySelectorAll<HTMLButtonElement>('[data-role]').forEach(button=>button.onclick=()=>{
    switcher.textContent=client.profiles.find(p=>p.role===button.dataset.role)!.name;switcher.title='Cambiar perfil';switcher.setAttribute('aria-label',`${switcher.textContent}: cambiar perfil`);
    app.dataset.demoRole=button.dataset.role;app.inert=false;entry.hidden=true;onEnter();switcher.focus();
  });
  show();
}
