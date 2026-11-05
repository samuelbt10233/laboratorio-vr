import {test} from 'node:test';
import assert from 'node:assert/strict';
import { Narrator, spokenText, type NarrationState } from './narration';

class FakeAudio {
  static instances:FakeAudio[]=[];
  onplaying:(()=>void)|null=null;onended:(()=>void)|null=null;onerror:(()=>void)|null=null;
  hidden=false;preload='';paused=false;removed=false;
  constructor(public src:string){FakeAudio.instances.push(this);}
  play(){return Promise.resolve();}
  pause(){this.paused=true;}
  remove(){this.removed=true;}
}
Object.defineProperty(globalThis,'window',{configurable:true,value:{Audio:FakeAudio,setTimeout,clearTimeout}});
Object.defineProperty(globalThis,'Audio',{configurable:true,value:FakeAudio});
Object.defineProperty(globalThis,'document',{configurable:true,value:{body:{append:()=>{}}}});

test('normaliza las unidades y la fórmula para la voz',()=>{assert.equal(spokenText('6 V, 30 mA, 200 Ω; I = V / R.'),'6 voltios, 30 miliamperios, 200 ohmios; la corriente es igual a la tensión dividida entre la resistencia.');});
test('el avatar solo habla al comenzar el audio y termina con él',()=>{const states:NarrationState[]=[];const n=new Narrator(s=>states.push(s));n.speak('Clase','/audio/clase-1.mp3');const audio=FakeAudio.instances.at(-1)!;assert.equal(states.at(-1),'loading');audio.onplaying!();assert.equal(states.at(-1),'speaking');audio.onended!();assert.equal(states.at(-1),'finished');assert.equal(audio.removed,true);n.dispose();});
test('detener cancela el audio e ignora eventos tardíos',()=>{const states:NarrationState[]=[];const n=new Narrator(s=>states.push(s));n.speak('Clase','/audio/clase-1.mp3');const audio=FakeAudio.instances.at(-1)!,ended=audio.onended!;n.stop();ended();assert.equal(audio.paused,true);assert.equal(audio.removed,true);assert.equal(states.at(-1),'ready');n.dispose();});
test('silenciar evita nuevas reproducciones y cambiar de paso reemplaza el audio',()=>{const n=new Narrator(()=>{});n.speak('Uno','/audio/clase-1.mp3');const first=FakeAudio.instances.at(-1)!;n.speak('Dos','/audio/clase-2.mp3');assert.equal(first.paused,true);assert.equal(FakeAudio.instances.at(-1)!.src,'/audio/clase-2.mp3');n.setEnabled(false);const count=FakeAudio.instances.length;n.speak('Tres','/audio/clase-3.mp3');assert.equal(FakeAudio.instances.length,count);n.dispose();});

test('prioriza la grabación neural aunque el sistema tenga voz española',()=>{
  let spoken=0;const synth={getVoices:()=>[{name:'Voz del sistema',lang:'es-CO'}],addEventListener:()=>{},removeEventListener:()=>{},cancel:()=>{},speak:()=>{spoken++;}};
  Object.assign(window,{speechSynthesis:synth});
  const n=new Narrator(()=>{});n.speak('Texto','/audio/salome-clase-1.mp3');
  assert.equal(FakeAudio.instances.at(-1)!.src,'/audio/salome-clase-1.mp3');assert.equal(spoken,0);n.dispose();delete (window as any).speechSynthesis;
});
test('usa la voz del navegador si la grabación falla e ignora errores tardíos',()=>{
  let utterance:any;const synth={getVoices:()=>[{name:'Voz del sistema',lang:'es-CO'}],addEventListener:()=>{},removeEventListener:()=>{},cancel:()=>{},speak:(value:any)=>{utterance=value;}};
  Object.assign(window,{speechSynthesis:synth});Object.defineProperty(globalThis,'SpeechSynthesisUtterance',{configurable:true,value:class {constructor(public text:string){}}});
  const states:NarrationState[]=[],n=new Narrator(state=>states.push(state));n.speak('6 V','/audio/missing.mp3');
  const audio=FakeAudio.instances.at(-1)!,lateError=audio.onerror!;audio.onerror!();assert.equal(audio.paused,true);assert.equal(utterance.text,'6 voltios');
  utterance.onstart();assert.equal(states.at(-1),'speaking');lateError();assert.equal(states.at(-1),'speaking');
  n.stop();assert.equal(states.at(-1),'ready');n.dispose();delete (window as any).speechSynthesis;delete (globalThis as any).SpeechSynthesisUtterance;
});

 test('pronuncia las unidades explicadas sin repetir su nombre',()=>{assert.equal(spokenText('ohmios (Ω), voltios (V), miliamperios (mA); mA, miliamperios.'),'ohmios, voltios, miliamperios; miliamperios.');});
