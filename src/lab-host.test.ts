import test from 'node:test';
import assert from 'node:assert/strict';
import { LabHost } from './labs/host';
import type { LabContext, LabModule } from './labs/types';

function fakeLab(name:string,calls:string[],mounted?:(context:LabContext)=>void):()=>Promise<LabModule>{
  return async()=>({mount(context){calls.push(`mount ${name}`);mounted?.(context);},unmount(){calls.push(`unmount ${name}`);}});
}
const element=()=>{const log={cleared:0};return {log,host:{replaceChildren(){log.cleared++;}} as unknown as HTMLElement};};

test('opening a laboratory mounts it in the host with its reading',async()=>{
  const calls:string[]=[],{host}=element();let context:LabContext|undefined;
  const labs=new LabHost(host,{a:fakeLab('a',calls,value=>{context=value;})},()=>{});
  await labs.open('a','lectura-a');
  assert.deepEqual(calls,['mount a']);assert.equal(context?.host,host);assert.equal(context?.contentId,'lectura-a');assert.equal(labs.isOpen(),true);
});
test('opening another laboratory releases the previous one first',async()=>{
  const calls:string[]=[],{host}=element();
  const labs=new LabHost(host,{a:fakeLab('a',calls),b:fakeLab('b',calls)},()=>{});
  await labs.open('a','x');await labs.open('b','y');
  assert.deepEqual(calls,['mount a','unmount a','mount b']);
});
test('closing unmounts once, empties the host and tolerates repeated calls',async()=>{
  const calls:string[]=[],{host,log}=element();
  const labs=new LabHost(host,{a:fakeLab('a',calls)},()=>{});
  await labs.open('a','x');labs.close();labs.close();
  assert.deepEqual(calls,['mount a','unmount a']);assert.equal(log.cleared,1);assert.equal(labs.isOpen(),false);
});
test('closing while a laboratory loads prevents it from mounting',async()=>{
  const calls:string[]=[],{host}=element();
  const labs=new LabHost(host,{a:fakeLab('a',calls)},()=>{});
  const opening=labs.open('a','x');labs.close();await opening;
  assert.deepEqual(calls,[]);assert.equal(labs.isOpen(),false);
});
test('a laboratory can ask to exit, which closes it and notifies the application',async()=>{
  const calls:string[]=[],{host}=element();let exits=0,context:LabContext|undefined;
  const labs=new LabHost(host,{a:fakeLab('a',calls,value=>{context=value;})},()=>{exits++;});
  await labs.open('a','x');context!.exit();
  assert.deepEqual(calls,['mount a','unmount a']);assert.equal(exits,1);
});
test('an unknown laboratory is rejected',async()=>{
  const {host}=element();
  await assert.rejects(new LabHost(host,{},()=>{}).open('missing','x'));
});
