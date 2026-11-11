import './entry.css';
/** Role selection is a presentation aid, never authentication. */
export function mountDemoEntry(app:HTMLElement,onEnter:()=>void){
  const entry=document.createElement('section');entry.className='demo-entry';entry.setAttribute('aria-label','Acceso de demostración');
  entry.innerHTML=`<div class="demo-entry-intro"><span class="demo-entry-brand">umbral / labs</span><p class="demo-entry-kicker">PREPARADO PARA ESSA</p><h1>Aprender hoy.<br>Trabajar con seguridad.</h1><p>Comprende los procedimientos y practica en un entorno virtual antes de salir a campo.</p><div class="demo-entry-route">01 · Comprende el procedimiento<br>02 · Practica en la red virtual<br>03 · Revisa lo aprendido</div></div><div class="demo-entry-card"><span class="demo-entry-badge">Datos de demostración</span><h2>Elige cómo entrar</h2><p>Explora la plataforma con un perfil de ejemplo. No necesitas contraseña.</p><button data-role="tecnico"><span class="demo-avatar">AR</span><span><strong>Andrés Rojas</strong><small>Técnico · Liniero</small></span><span aria-hidden="true">→</span></button><button data-role="supervisora"><span class="demo-avatar">LG</span><span><strong>Laura Gómez</strong><small>Supervisora · Jefa de cuadrilla</small></span><span aria-hidden="true">→</span></button><p class="demo-entry-note">Los perfiles son ficticios. Esta selección no crea una cuenta.</p></div>`;
  document.body.append(entry);
  const switcher=document.createElement('button');switcher.className='demo-profile';switcher.type='button';
  document.querySelector('.header-right')?.prepend(switcher);
  function show(){app.inert=true;entry.hidden=false;entry.querySelector<HTMLButtonElement>('button')?.focus();}
  switcher.onclick=show;
  entry.querySelectorAll<HTMLButtonElement>('[data-role]').forEach(button=>button.onclick=()=>{
    const supervisor=button.dataset.role==='supervisora';
    switcher.textContent=supervisor?'Laura Gómez · Cambiar perfil':'Andrés Rojas · Cambiar perfil';
    app.dataset.demoRole=button.dataset.role;app.inert=false;entry.hidden=true;onEnter();switcher.focus();
  });
  show();
}
