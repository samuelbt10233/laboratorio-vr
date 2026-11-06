import type { LabModule, LabRegistry } from './types';
/** Opens one laboratory module at a time and guarantees it is released. */
export class LabHost {
  private active:LabModule|null=null;
  private version=0;
  constructor(private host:HTMLElement,private modules:LabRegistry,private onExit:()=>void){}
  isOpen(){return this.active!==null;}
  async open(id:string,contentId:string){
    this.close();
    const load=this.modules[id];
    if(!load)throw new Error(`Laboratorio desconocido: ${id}`);
    const version=this.version,lab=await load();
    // The user may have left while the module was loading.
    if(version!==this.version)return;
    this.active=lab;
    await lab.mount({host:this.host,contentId,exit:()=>this.exit()});
  }
  close(){
    this.version++;
    if(!this.active)return;
    this.active.unmount();this.active=null;this.host.replaceChildren();
  }
  exit(){this.close();this.onExit();}
}
