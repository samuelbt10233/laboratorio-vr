// Prepare neural recordings before deployment. Install edge-tts==7.3.1 in Python.
// node --import tsx scripts/generate-narration.mjs
import { writeFileSync, readFileSync, existsSync, mkdirSync, mkdtempSync, copyFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { classes } from '../src/lessons.ts';
import { spokenText } from '../src/narration.ts';
const voice=process.env.TTS_VOICE??'es-CO-SalomeNeural',rate=process.env.TTS_RATE??'-5%';
const folder=fileURLToPath(new URL('../public/audio/',import.meta.url));
const manifestPath=join(folder,'narration-manifest.json');
const previous=existsSync(manifestPath)?JSON.parse(readFileSync(manifestPath,'utf8')):null;
const staging=mkdtempSync(join(tmpdir(),'umbral-narration-'));
const recordings=[],confirmations=[],changed=[];
const probe=path=>{
  const result=spawnSync('ffprobe',['-v','error','-show_entries','format=duration','-of','json',path],{encoding:'utf8'});
  if(result.status!==0)throw Error(`Audio inválido: ${path}`);
  const duration=Number(JSON.parse(result.stdout).format.duration);
  if(!Number.isFinite(duration)||duration<1)throw Error(`Audio vacío: ${path}`);
  return duration;
};
try{
  for(const definition of classes)for(const step of definition.steps){
    const variants=[{role:'lesson',audio:step.audio,text:`${step.title} ${step.text} ${step.task}`},{role:'confirmation',...step.success}];
    for(const variant of variants){
      if(!/^\/audio\/[a-zA-Z0-9_-]+\.mp3$/.test(variant.audio))throw Error(`Ruta de audio no válida: ${variant.audio}`);
      const text=spokenText(variant.text),textSha256=createHash('sha256').update(text).digest('hex');
      const name=basename(variant.audio),output=join(staging,name),target=join(folder,name);
      const collection=variant.role==='lesson'?recordings:confirmations;
      const cached=[...(previous?.recordings??[]),...(previous?.confirmations??[])].find(r=>r.audio===variant.audio&&r.textSha256===textSha256);
      let duration;
      if(previous?.voice===voice&&previous?.rate===rate&&cached&&existsSync(target)){
        duration=probe(target);console.log(`Sin cambios: ${name}`);
      }else{
        const input=join(staging,`${name}.txt`);writeFileSync(input,text);
        const generated=spawnSync(process.env.TTS_PYTHON??'python',['-m','edge_tts','--voice',voice,`--rate=${rate}`,'--file',input,'--write-media',output],{encoding:'utf8',timeout:90000});
        if(generated.status!==0)throw Error(`No se generó ${name}: ${generated.stderr||generated.error}`);
        duration=probe(output);changed.push(name);console.log(`Generado ${name}: ${duration.toFixed(1)} s`);
      }
      collection.push({classId:definition.id,stepId:step.id,audio:variant.audio,durationSeconds:duration,textSha256});
    }
  }
  mkdirSync(folder,{recursive:true});
  for(const name of changed)copyFileSync(join(staging,name),join(folder,name));
  writeFileSync(manifestPath,JSON.stringify({voice,rate,generator:'edge-tts 7.3.1',recordings,confirmations},null,2)+'\n');
}finally{rmSync(staging,{recursive:true,force:true});}
