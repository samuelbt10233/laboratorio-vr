export type NarrationState = 'ready' | 'loading' | 'speaking' | 'finished' | 'muted' | 'unavailable' | 'error';

// Scientific notation is written for reading; speech needs pronounceable units.
export function spokenText(text:string):string {
  return text.replace(/ohmios\s*\(Ω\)/gi,'ohmios').replace(/voltios\s*\(V\)/gi,'voltios').replace(/miliamperios\s*\(mA\)/gi,'miliamperios').replace(/\bmA,\s*miliamperios\b/g,'miliamperios')
    .replace(/I = V \/ R/g,'la corriente es igual a la tensión dividida entre la resistencia')
    .replace(/(\d+)\s*mA\b/g,'$1 miliamperios').replace(/(\d+)\s*V\b/g,'$1 voltios')
    .replace(/Ω/g,'ohmios').replace(/R1/g,'R uno').replace(/R2/g,'R dos').replace(/S1/g,'S uno');
}

export class Narrator {
  private synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  private audio:HTMLAudioElement|null=null;
  private utterance:SpeechSynthesisUtterance|null=null;
  private generation=0;
  private timeout=0;
  private enabled=true;
  private alive=true;
  private voicesChanged=()=>{if(!this.utterance && !this.audio && this.enabled)this.notify(this.available()?'ready':'unavailable');};
  constructor(private notify:(state:NarrationState)=>void){this.synth?.addEventListener('voiceschanged',this.voicesChanged);this.voicesChanged();}
  private voices(){return this.synth?.getVoices().filter(v=>/^es(?:-|_)/i.test(v.lang)||v.lang==='es')??[];}
  available(){return 'Audio' in window || !!this.synth && this.voices().length>0;}
  isEnabled(){return this.enabled;}
  setEnabled(enabled:boolean){this.enabled=enabled;this.stop();this.notify(enabled?(this.available()?'ready':'unavailable'):'muted');}
  stop(){this.generation++;window.clearTimeout(this.timeout);if(this.utterance){this.utterance.onstart=null;this.utterance.onend=null;this.utterance.onerror=null;}this.utterance=null;this.synth?.cancel();if(this.audio){this.audio.onplaying=null;this.audio.onended=null;this.audio.onerror=null;this.audio.pause();this.audio.remove();this.audio=null;}if(this.alive)this.notify(this.enabled?(this.available()?'ready':'unavailable'):'muted');}
  private playRecording(url:string,text:string,generation:number){
    const audio=new Audio(url);audio.hidden=true;audio.preload='auto';document.body.append(audio);this.audio=audio;
    const current=()=>this.alive&&generation===this.generation&&this.audio===audio;
    const fallback=()=>{if(!current())return;window.clearTimeout(this.timeout);audio.onplaying=null;audio.onended=null;audio.onerror=null;audio.pause();audio.remove();this.audio=null;this.speakWithBrowser(text,generation);};
    audio.onplaying=()=>{if(current()){window.clearTimeout(this.timeout);this.notify('speaking');}};
    audio.onended=()=>{if(current()){window.clearTimeout(this.timeout);audio.remove();this.audio=null;this.notify('finished');}};
    audio.onerror=fallback;
    this.notify('loading');this.timeout=window.setTimeout(fallback,7000);
    audio.play().catch(error=>{if(!current())return;if(error?.name==='NotAllowedError'){this.stop();this.notify('error');}else fallback();});
  }
  private speakWithBrowser(text:string,generation:number){
    const voices=this.voices();
    if(!this.synth||!voices.length){this.notify('error');return;}
    const utterance=new SpeechSynthesisUtterance(spokenText(text));utterance.lang='es-MX';utterance.rate=.94;utterance.pitch=1;
    utterance.voice=voices.find(v=>/Dalia/i.test(v.name))??voices.find(v=>v.lang==='es-MX')??voices.find(v=>v.lang==='es-CO')??voices[0];
    this.utterance=utterance;
    const current=()=>this.alive&&generation===this.generation&&this.utterance===utterance;
    const fail=()=>{if(current()){this.stop();this.notify('error');}};
    utterance.onstart=()=>{if(current()){window.clearTimeout(this.timeout);this.notify('speaking');}};
    utterance.onend=()=>{if(current()){window.clearTimeout(this.timeout);this.utterance=null;this.notify('finished');}};
    utterance.onerror=fail;
    this.notify('loading');this.timeout=window.setTimeout(fail,7000);
    try{this.synth.speak(utterance);}catch{fail();}
  }
  speak(text:string,recordingUrl:string){
    this.stop();if(!this.enabled)return;
    // The same curated recording is used on every device, ahead of system voices.
    this.playRecording(recordingUrl,text,this.generation);
  }
  dispose(){this.alive=false;this.stop();this.synth?.removeEventListener('voiceschanged',this.voicesChanged);}
}
