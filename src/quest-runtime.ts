import { ArcRotateCamera, Color3, MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3, WebXRDefaultExperience, WebXRSessionManager, WebXRState, type AbstractMesh } from '@babylonjs/core';
import { questLayout, xrAvailability } from './quest-layout';
import { QuestInterface } from './quest-interface';
import { classes as classesForUI } from './lessons';
interface Options {onMode:(active:boolean)=>void;onCatalogue:(open:boolean)=>void;onExperience:(mode:'class'|'free',id?:string)=>void;onStop:()=>void;isLab:()=>boolean}
export class QuestRuntime {
  private helper:WebXRDefaultExperience|null=null;
  private room:TransformNode;
  private floor:AbstractMesh;
  private ui:QuestInterface;
  private active=false;
  private preview=false;
  private busy=false;
  private savedCamera:{target:Vector3;alpha:number;beta:number;radius:number;fov:number;minZ:number}|null=null;
  constructor(private scene:Scene,private camera:ArcRotateCamera,private options:Options){
    this.room=new TransformNode('quest room',scene);
    const material=(name:string,color:string)=>{const m=new StandardMaterial(name,scene);m.diffuseColor=Color3.FromHexString(color);m.specularColor=Color3.Black();return m;};
    const floorMat=material('quest floor material','#263b41'),tableMat=material('quest table legs','#39545c');
    this.floor=MeshBuilder.CreateGround('quest bounded teleport floor',{width:questLayout.floorSize,height:questLayout.floorSize},scene);this.floor.parent=this.room;this.floor.material=floorMat;
    for(const x of [-.72,.72])for(const z of [-.35,.35]){const angle=questLayout.tableTilt,underside=.325*questLayout.scale,height=questLayout.tableHeight+z*Math.sin(angle)-underside*Math.cos(angle);const leg=MeshBuilder.CreateCylinder('quest table leg',{height,diameter:.06,tessellation:8},scene);leg.parent=this.room;leg.position.set(x,height/2,z*Math.cos(angle)+underside*Math.sin(angle));leg.material=tableMat;leg.isPickable=false;}
    for(const x of [-1.1,0,1.1]){const spot=MeshBuilder.CreateTorus('quest teleport zone',{diameter:.38,thickness:.015,tessellation:24},scene);spot.parent=this.room;spot.position.set(x,.012,-1.8);spot.material=material(`quest teleport ${x}`,'#78c3a5');spot.isPickable=false;}
    this.ui=new QuestInterface(scene,classesForUI,action=>this.handleAction(action));
    this.room.setEnabled(false);
  }
  isImmersive(){return this.active;}
  isXR(){return this.active&&!this.preview;}
  async initialize(button:HTMLButtonElement,status:HTMLElement){
    button.disabled=true;button.textContent='Comprobando VR…';
    let supported=false;
    try{if(window.isSecureContext&&'xr' in navigator)supported=await WebXRSessionManager.IsSessionSupportedAsync('immersive-vr');
      if(supported){
        this.helper=await WebXRDefaultExperience.CreateAsync(this.scene,{disableDefaultUI:true,disableNearInteraction:true,disableHandTracking:true,floorMeshes:[this.floor],inputOptions:{doNotLoadControllerMeshes:true,disableOnlineControllerRepository:true,disableControllerAnimation:true},pointerSelectionOptions:{enablePointerSelectionOnAllControllers:true,maxPointerDistance:5},teleportationOptions:{forceHandedness:'left',snapPointsOnly:true,snapPositions:[new Vector3(-1.1,0,-1.8),new Vector3(0,0,-1.8),new Vector3(1.1,0,-1.8)]},optionalFeatures:['local-floor'],outputCanvasOptions:{canvasOptions:{framebufferScaleFactor:1}}});
        this.helper.baseExperience.camera.minZ=.03;this.helper.baseExperience.camera.maxZ=15;
        this.helper.baseExperience.onInitialXRPoseSetObservable.add(xrCamera=>{xrCamera.position.x=questLayout.start.x;xrCamera.position.z=questLayout.start.z;});
        this.helper.baseExperience.onStateChangedObservable.add(state=>{if(state===WebXRState.IN_XR){this.helper!.baseExperience.sessionManager.fixedFoveation=.6;button.textContent='Salir de VR';}if(state===WebXRState.NOT_IN_XR){this.finish();button.textContent='Entrar en VR';}});
        this.helper.input.onControllerAddedObservable.add(controller=>{
          const grip=MeshBuilder.CreateBox('quest controller handle',{width:.035,height:.09,depth:.045},this.scene);grip.parent=controller.grip??controller.pointer;grip.isPickable=false;
          const mat=new StandardMaterial('quest controller material',this.scene);mat.diffuseColor=Color3.FromHexString('#8dc5b2');grip.material=mat;
          controller.onDisposeObservable.addOnce(()=>{grip.dispose();mat.dispose();});
        });
      }
      const result=xrAvailability(window.isSecureContext,'xr' in navigator,supported);status.textContent=result.message;button.disabled=!result.enabled;button.textContent='Entrar en VR';
    }catch{button.disabled=true;button.textContent='VR no disponible';status.textContent='No se pudo iniciar WebXR. Revisa el acceso HTTPS y vuelve a cargar la página.';}
    button.onclick=()=>{if(this.isXR())void this.exit();else void this.enter(status);};
  }
  private prepare(preview:boolean){
    this.savedCamera={target:this.camera.target.clone(),alpha:this.camera.alpha,beta:this.camera.beta,radius:this.camera.radius,fov:this.camera.fov,minZ:this.camera.minZ};
    this.active=true;this.preview=preview;this.room.setEnabled(true);this.ui.setEnabled(true);this.options.onStop();this.options.onMode(true);
    this.camera.fov=1.5;this.camera.minZ=.03;this.camera.lowerRadiusLimit=.7;this.camera.upperRadiusLimit=4.5;this.camera.target=new Vector3(0,1.22,0);this.camera.alpha=-Math.PI/2;this.camera.beta=1.35;this.camera.radius=2.45;
  }
  async enter(status:HTMLElement){
    if(this.busy||!this.helper||!this.options.isLab())return;this.busy=true;
    try{if(this.preview)this.finish();this.prepare(false);await this.helper.baseExperience.enterXRAsync('immersive-vr','local-floor',this.helper.renderTarget);}
    catch{this.finish();status.textContent='No se pudo entrar en VR. Comprueba las gafas y vuelve a intentarlo.';}
    finally{this.busy=false;}
  }
  togglePreview(){if(!this.options.isLab()||this.isXR())return;if(this.preview)this.finish();else this.prepare(true);}
  async exit(){this.options.onStop();if(this.isXR())try{await this.helper?.baseExperience.exitXRAsync();}finally{this.finish();}else this.finish();}
  private finish(){
    if(!this.active)return;this.active=false;this.preview=false;this.ui.showCatalogue(false);this.options.onCatalogue(false);this.ui.setEnabled(false);this.room.setEnabled(false);if(this.savedCamera){this.camera.fov=this.savedCamera.fov;this.camera.minZ=this.savedCamera.minZ;}this.options.onMode(false);
    this.scene.activeCamera=this.camera;this.camera.lowerRadiusLimit=7;this.camera.upperRadiusLimit=26;
    if(this.savedCamera){this.camera.target=this.savedCamera.target;this.camera.alpha=this.savedCamera.alpha;this.camera.beta=this.savedCamera.beta;this.camera.radius=this.savedCamera.radius;this.savedCamera=null;}
  }
  openCatalogue(){this.options.onStop();this.ui.showCatalogue(true);this.options.onCatalogue(true);}
  private handleAction(action:string){
    if(action==='exit'){void this.exit();return;}
    if(action==='catalogue'){this.openCatalogue();return;}
    if(action==='recenter'){
      if(this.isXR()&&this.helper){this.helper.baseExperience.camera.position.x=questLayout.start.x;this.helper.baseExperience.camera.position.z=questLayout.start.z;}
      else{this.camera.target=new Vector3(0,1.22,0);this.camera.alpha=-Math.PI/2;this.camera.beta=1.35;this.camera.radius=2.45;}return;
    }
    if(action==='resume'){this.ui.showCatalogue(false);this.options.onCatalogue(false);return;}
    if(action==='free'||action.startsWith('class:')){this.ui.showCatalogue(false);this.options.onCatalogue(false);this.options.onExperience(action==='free'?'free':'class',action.startsWith('class:')?action.slice(6):undefined);}
  }
  pick(name:string,u:number,v:number){this.ui.pick(name,u,v);}
  message(text:string){this.ui.message(text);}
  setSummary(text:string){this.ui.setSummary(text);}
}

