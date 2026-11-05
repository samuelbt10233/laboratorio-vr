import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('./dist/', import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.glb':'model/gltf-binary','.wasm':'application/wasm','.mp3':'audio/mpeg'};
createServer(async (request,response)=>{
  if(request.method!=='GET' && request.method!=='HEAD'){response.writeHead(405);response.end();return;}
  try {
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const file=resolve(root,pathname==='/'?'index.html':`.${pathname}`);
    if(!file.startsWith(root.endsWith(sep)?root:root+sep)){response.writeHead(403);response.end();return;}
    const info=await stat(file);
    if(!info.isFile())throw new Error('Not a file');
    response.writeHead(200,{'Content-Type':types[extname(file)]??'application/octet-stream','Content-Length':info.size,'X-Content-Type-Options':'nosniff','Cache-Control':file.includes(`${sep}assets${sep}`)?'public, max-age=31536000, immutable':'no-cache'});
    if(request.method==='HEAD')response.end();else createReadStream(file).pipe(response);
  } catch {response.writeHead(404);response.end('No encontrado');}
}).listen(Number(process.env.PORT)||4173,'0.0.0.0',()=>console.log(`Demo disponible en http://localhost:${Number(process.env.PORT)||4173}`));
