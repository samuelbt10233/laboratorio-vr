/** Announce a valid result once per step, without praising restored or initial state. */
export class StepConfirmation {
  private key:string|null=null;
  private ready=false;
  private announced=new Set<string>();
  enter(){this.key=null;this.ready=false;}
  observe(key:string,ready:boolean,hasActivity:boolean){
    if(this.key!==key){this.key=key;this.ready=ready;return false;}
    const celebrate=hasActivity&&ready&&!this.ready&&!this.announced.has(key);
    this.ready=ready;if(celebrate)this.announced.add(key);return celebrate;
  }
}
