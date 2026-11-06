export interface PresentationOptions {
  inXR:boolean;
  supportsXR:boolean;
  enterXR:()=>Promise<boolean>;
  enterFullscreen:()=>Promise<void>;
}
/** Called directly from the start gesture; never await detection before requesting XR/fullscreen. */
export async function enterPresentation(options:PresentationOptions):Promise<'ready'|'vr-denied'|'fullscreen-denied'>{
  if(options.inXR)return 'ready';
  if(options.supportsXR){try{return await options.enterXR()?'ready':'vr-denied';}catch{return 'vr-denied';}}
  try{await options.enterFullscreen();return 'ready';}catch{return 'fullscreen-denied';}
}
