import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crewRows } from './demo/datos-ejemplo';
test('supervisor reflects the latest practice without inventing attempt history',()=>{
 assert.equal(crewRows(null)[0].progress,0);
 const row=crewRows({contentId:'distribucion-cinco-reglas',aprobado:true,errores:2,segundos:93,fecha:'2026-11-11T10:00:00Z'})[0];
 assert.equal(row.progress,100);assert.equal(row.errors,'2');assert.equal(row.attempts,'Último registrado');assert.match(row.detail,/93 s/);
});
test('unrelated or invalid results do not mark the assigned practice complete',()=>{
 for(const r of [{contentId:'other',segundos:30},{contentId:'distribucion-cinco-reglas',segundos:NaN}])assert.equal(crewRows({...r,aprobado:true,errores:0,fecha:'2026-11-11'})[0].progress,0);
});
