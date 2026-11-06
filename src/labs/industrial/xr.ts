import { Color3, MeshBuilder, StandardMaterial, WebXRDefaultExperience, WebXRSessionManager, WebXRState, type AbstractMesh, type Scene } from '@babylonjs/core';
/** Optional WebXR for the laboratory: the same pointer picks work with the controller laser. Returns a dispose function. */
export async function enableXR(scene:Scene,floor:AbstractMesh,button:HTMLButtonElement,status:HTMLElement,isDisposed:()=>boolean){
  button.disabled=true;
  let supported=false;
  try{if(window.isSecureContext&&'xr' in navigator)supported=await WebXRSessionManager.IsSessionSupportedAsync('immersive-vr');}catch{}
  if(isDisposed())return ()=>{};
  if(!supported){status.textContent=window.isSecureContext?'VR no disponible aquí: puedes practicar en pantalla.':'Para entrar en VR, abre esta página mediante HTTPS en las Quest.';return ()=>{};}
  try{
    const helper=await WebXRDefaultExperience.CreateAsync(scene,{disableDefaultUI:true,disableNearInteraction:true,disableHandTracking:true,floorMeshes:[floor],inputOptions:{doNotLoadControllerMeshes:true,disableOnlineControllerRepository:true,disableControllerAnimation:true}});
    if(isDisposed()){helper.dispose();return ()=>{};}
    helper.baseExperience.camera.minZ=.03;helper.baseExperience.camera.maxZ=30;
    helper.input.onControllerAddedObservable.add(controller=>{
      const grip=MeshBuilder.CreateBox('controller handle',{width:.035,height:.09,depth:.045},scene);grip.parent=controller.grip??controller.pointer;grip.isPickable=false;
      const mat=new StandardMaterial('controller material',scene);mat.diffuseColor=Color3.FromHexString('#8dc5b2');grip.material=mat;
      controller.onDisposeObservable.addOnce(()=>{grip.dispose();mat.dispose();});
    });
    helper.baseExperience.onStateChangedObservable.add(state=>{if(state===WebXRState.IN_XR)button.textContent='Salir de VR';if(state===WebXRState.NOT_IN_XR)button.textContent='Entrar en VR';});
    button.onclick=()=>{void(helper.baseExperience.state===WebXRState.IN_XR?helper.baseExperience.exitXRAsync():helper.baseExperience.enterXRAsync('immersive-vr','local-floor',helper.renderTarget)).catch(()=>{status.textContent='No se pudo cambiar el modo VR. Comprueba las gafas.';});};
    button.disabled=false;status.textContent='VR disponible. Apunta con el mando y pulsa el gatillo sobre cada elemento.';
    return ()=>{helper.dispose();};
  }catch{status.textContent='No se pudo iniciar WebXR. Revisa el acceso HTTPS y vuelve a cargar la página.';return ()=>{};}
}
