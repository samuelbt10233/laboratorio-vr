import test from 'node:test';
import assert from 'node:assert/strict';
import { enterPresentation } from './start-presentation';

test('PC requests fullscreen immediately and waits for it before becoming ready',async()=>{
  let complete!:()=>void;let entered=false;
  const request=enterPresentation({inXR:false,supportsXR:false,enterXR:async()=>{throw Error('unexpected VR');},enterFullscreen:()=>{entered=true;return new Promise<void>(resolve=>{complete=resolve;});}});
  assert.equal(entered,true);
  let ready=false;void request.then(()=>{ready=true;});await Promise.resolve();assert.equal(ready,false);
  complete();assert.equal(await request,'ready');
});
test('supported VR requests a headset session instead of desktop fullscreen',async()=>{
  const calls:string[]=[];
  assert.equal(await enterPresentation({inXR:false,supportsXR:true,enterXR:async()=>{calls.push('vr');return true;},enterFullscreen:async()=>{calls.push('fullscreen');}}),'ready');
  assert.deepEqual(calls,['vr']);
});
test('denied VR stays pending instead of silently starting a desktop class',async()=>{
  assert.equal(await enterPresentation({inXR:false,supportsXR:true,enterXR:async()=>false,enterFullscreen:async()=>{assert.fail('unexpected desktop fallback');}}),'vr-denied');
});
test('denied desktop fullscreen requires an explicit fallback',async()=>{
  assert.equal(await enterPresentation({inXR:false,supportsXR:false,enterXR:async()=>false,enterFullscreen:async()=>{throw Error('denied');}}),'fullscreen-denied');
});
test('starting another class inside VR keeps the existing immersive session',async()=>{
  assert.equal(await enterPresentation({inXR:true,supportsXR:true,enterXR:async()=>{assert.fail('duplicate session');},enterFullscreen:async()=>{assert.fail('desktop fullscreen inside VR');}}),'ready');
});
