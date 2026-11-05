export interface NavigationPoint {x:number;y:number;z:number}
// Bounds apply to the orbit centre; the existing camera radius also stays bounded.
export const navigationBounds={minX:-6,maxX:6,minY:0,maxY:5,minZ:-5,maxZ:7};
export const movementKeys=new Set(['w','a','s','d']);
export function moveWithinLab(target:NavigationPoint,alpha:number,keys:ReadonlySet<string>,seconds:number):NavigationPoint {
  let forward=Number(keys.has('w'))-Number(keys.has('s'));
  let sideways=Number(keys.has('d'))-Number(keys.has('a'));
  const length=Math.hypot(forward,sideways);
  if(length){forward/=length;sideways/=length;}
  // Cap long frames so returning to a suspended tab cannot cause a jump.
  const distance=4*Math.max(0,Math.min(.05,seconds));
  const x=target.x+(-Math.cos(alpha)*forward-Math.sin(alpha)*sideways)*distance;
  const z=target.z+(-Math.sin(alpha)*forward+Math.cos(alpha)*sideways)*distance;
  const b=navigationBounds,clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
  return {x:clamp(x,b.minX,b.maxX),y:clamp(target.y,b.minY,b.maxY),z:clamp(z,b.minZ,b.maxZ)};
}
