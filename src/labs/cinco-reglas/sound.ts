/** Synthesised sound, no audio files: transformer hum while the line is live and the crack of an arc flash. */
export function createSound(){
  let ctx:AudioContext|null=null,hum:GainNode|null=null,live=true;
  // Browsers only allow audio after a user gesture: the first pick starts it.
  const start=()=>{
    if(ctx)return ctx;
    try{ctx=new AudioContext();}catch{return null;}
    hum=ctx.createGain();hum.gain.value=live?.025:0;hum.connect(ctx.destination);
    for(const [freq,level] of [[120,1],[240,.35],[360,.12]]){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=freq;g.gain.value=level;o.connect(g).connect(hum);o.start();}
    return ctx;
  };
  return {
    start,
    setLive(on:boolean){live=on;if(ctx&&hum)hum.gain.setTargetAtTime(on?.025:0,ctx.currentTime,.15);},
    arc(){
      const c=start();if(!c)return;
      const length=1.3,buffer=c.createBuffer(1,c.sampleRate*length,c.sampleRate),data=buffer.getChannelData(0);
      for(let i=0;i<data.length;i++){const t=i/c.sampleRate;data[i]=(Math.random()*2-1)*Math.exp(-t*2.6)*(Math.random()<.9?1:2.5);}
      const noise=c.createBufferSource(),band=c.createBiquadFilter(),gain=c.createGain();noise.buffer=buffer;band.type='bandpass';band.frequency.value=1800;band.Q.value=.6;gain.gain.value=.9;
      noise.connect(band).connect(gain).connect(c.destination);noise.start();
      const thump=c.createOscillator(),tg=c.createGain();thump.frequency.setValueAtTime(90,c.currentTime);thump.frequency.exponentialRampToValueAtTime(30,c.currentTime+.4);
      tg.gain.setValueAtTime(.8,c.currentTime);tg.gain.exponentialRampToValueAtTime(.001,c.currentTime+.5);thump.connect(tg).connect(c.destination);thump.start();thump.stop(c.currentTime+.5);
    },
    dispose(){void ctx?.close();ctx=null;},
  };
}
