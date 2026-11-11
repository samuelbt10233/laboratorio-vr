import { readResult } from '../labs/cinco-reglas/result';
import { crewRows } from './datos-ejemplo';
import './supervisor.css';
const el=(tag:string,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;e.className=cls;return e;};
export function renderSupervisor(host:HTMLElement){
 const rows=crewRows(readResult());host.replaceChildren();
 const head=el('div','','supervisor-head');head.append(el('h2','Mi cuadrilla'));const refresh=el('button','Actualizar resultados');refresh.onclick=()=>renderSupervisor(host);head.append(refresh);host.append(head);
 const stats=el('div','','supervisor-stats');for(const [label,value] of [['Personas asignadas',rows.length],['Prácticas completadas',rows.filter(r=>r.progress===100).length],['Pendientes',rows.filter(r=>r.progress<100).length]]){const card=el('div');card.append(el('span',String(label)),el('strong',String(value)));stats.append(card);}host.append(stats);
 host.append(el('h3','Trabajo seguro en redes de distribución'),el('p','Datos de demostración. Las filas son ficticias; Andrés refleja el último resultado de práctica guardado en este navegador. Las constancias de ejemplo no acreditan competencias reales.','supervisor-note'));
 const wrap=el('div','','supervisor-table');const table=document.createElement('table');const header=document.createElement('thead');const hr=document.createElement('tr');for(const title of ['Integrante','Avance de la práctica','Intentos','Errores','Constancia'])hr.append(el('th',title));header.append(hr);table.append(header);const body=document.createElement('tbody');
 for(const row of rows){const tr=document.createElement('tr');const name=el('td');name.append(el('strong',row.name),el('small',row.role));const progress=el('td');progress.append(el('strong',`${row.progress}% · ${row.status}`),el('small',row.detail));const cert=el('td',row.certificate);tr.append(name,progress,el('td',row.attempts),el('td',row.errors),cert);body.append(tr);}table.append(body);wrap.append(table);host.append(wrap);
 host.append(el('p','Andrés muestra solo el último intento guardado; todavía no hay un historial de intentos ni sincronización entre dispositivos.','supervisor-note'));
}
