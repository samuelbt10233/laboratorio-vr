import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { conceptDrawing, period, gravity } from './content/concept-drawings';
import { getLearningContent } from './learning-content';

const mapped:[string,number[]][]=[['mecanica-pendulo',[0,1,2,3]],['fluidos-bernoulli',[0,1,2]]];
const values=(svg:string,name:string)=>[...svg.matchAll(new RegExp(`--${name}:([\\d.]+)`,'g'))].map(m=>Number(m[1]));

test('every mapped section of the pendulum and Bernoulli readings has an accessible drawing',()=>{
  for(const [id,indices] of mapped){
    const sections=getLearningContent(id).sections.length;
    for(const i of indices){
      assert.ok(i<sections,`${id} has no section ${i}`);
      const d=conceptDrawing(id,i);assert.ok(d,`${id} ${i}`);
      assert.match(d!.svg,/^<svg viewBox="0 0 500 \d+" role="img" aria-label="[^"]{20,}"/);assert.ok(d!.caption.length>30);
    }
  }
});
test('sections without a drawing, and other readings, return nothing',()=>{
  assert.equal(conceptDrawing('mecanica-pendulo',4),null);assert.equal(conceptDrawing('fluidos-bernoulli',4),null);
  assert.equal(conceptDrawing('ley-de-ohm',1),null);assert.equal(conceptDrawing('no-existe',0),null);
});
test('the pendulum period follows T = 2π√(L/g)',()=>{
  assert.ok(Math.abs(period(1,gravity.earth)-2.007)<.01);assert.ok(Math.abs(period(4,gravity.earth)-4.014)<.01);assert.ok(Math.abs(period(1,gravity.moon)-4.94)<.02);
});
test('the length comparison swings at the real ratio: four times the length takes twice as long',()=>{
  const [short,long]=values(conceptDrawing('mecanica-pendulo',1)!.svg,'half');
  assert.ok(Math.abs(long/short-2)<.02,`ratio ${long/short}`);assert.ok(Math.abs(short*2-2.0)<.05);
});
test('the mass comparison swings in step: both pendulums share one half period',()=>{
  const [a,b]=values(conceptDrawing('mecanica-pendulo',2)!.svg,'half');assert.equal(a,b);
});
test('the Moon pendulum swings slower than the Earth one by the right factor',()=>{
  const [earth,moon]=values(conceptDrawing('mecanica-pendulo',3)!.svg,'half');
  assert.ok(Math.abs(moon/earth-Math.sqrt(gravity.earth/gravity.moon))<.03,`ratio ${moon/earth}`);
});
test('water moves four times faster where the pipe is four times narrower',()=>{
  const svg=conceptDrawing('fluidos-bernoulli',1)!.svg;
  const speed=(cls:string)=>{const tag=svg.match(new RegExp(`class="cd-flow ${cls}"[^>]*style="([^"]*)"`))![1];return Number(/--run:([\d.]+)/.exec(tag)![1])/Number(/--dur:([\d.]+)/.exec(tag)![1]);};
  assert.ok(Math.abs(speed('cd-narrow')/speed('cd-wide')-4)<.05);
});
test('the drawings are self-contained: no scripts, links or external references',()=>{
  for(const [id,indices] of mapped)for(const i of indices){
    const svg=conceptDrawing(id,i)!.svg;assert.doesNotMatch(svg,/<script|href=|url\(|on\w+=|https?:/i);
  }
});
test('motion is switched off for people who ask for reduced motion',()=>{
  const css=readFileSync(new URL('./content/concept-drawings.css',import.meta.url),'utf8');
  assert.match(css,/prefers-reduced-motion:\s*reduce/);assert.match(css,/animation:\s*none/);
});
