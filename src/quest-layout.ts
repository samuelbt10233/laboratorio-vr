export const questLayout={scale:.15,tableTilt:40*Math.PI/180,tableHeight:.9,start:{x:0,z:-1.8},floorSize:4.8};
export function movePartOnTable(x:number,z:number,dx:number,dz:number){return {x:Math.max(-4.35,Math.min(4.35,x+dx)),z:Math.max(-2.35,Math.min(2.35,z+dz))};}
export function xrAvailability(secure:boolean,api:boolean,supported:boolean){
  if(!secure)return {enabled:false,message:'Para entrar en VR, abre esta página mediante HTTPS en las Quest.'};
  if(!api||!supported)return {enabled:false,message:'VR no disponible aquí. Puedes revisar la distribución con «Vista Quest en PC».'};
  return {enabled:true,message:'VR disponible. Elige una clase y pulsa «Entrar en VR».'};
}
