import { preset } from '../circuit';
import type { LabClass, LessonStep } from '../class-engine';
const healthy=preset('simple');healthy.parts.find(p=>p.id==='S1')!.closed=true;
const openSwitch=structuredClone(healthy);openSwitch.parts.find(p=>p.id==='S1')!.closed=false;
const missingWire=structuredClone(healthy);missingWire.wires=missingWire.wires.filter(w=>w.id!=='w1');
const wrongWire=structuredClone(healthy);wrongWire.wires.find(w=>w.id==='w1')!.a='V1:0';
function challenge(id:string,title:string,text:string,task:string,hint:string,success:string,setup:LessonStep['setup']):LessonStep{
  return {id,title,text,task,setup,repairPreset:'simple',audio:`/audio/salome-fallo-${id}.mp3`,success:{text:success,audio:`/audio/salome-fallo-logro-${id}.mp3`},goals:[{kind:'diagnose',expected:structuredClone(healthy),hint}]};
}
export const findFaultClass:LabClass={
  laboratoryId:'electronics',id:'encuentra-el-fallo',title:'Diagnóstico de fallas en circuitos',description:'Diagnóstico y corrección de tres fallas: interruptor abierto, cable faltante y conexión incorrecta, con verificación del resultado.',duration:'6–10 min',level:'Diagnóstico inicial',initialPreset:'simple',initialSelection:'V1',
  steps:[
    challenge('interruptor','Reto 1 · Hay energía, pero no circula corriente.','Vas a investigar tres fallos. En este montaje la fuente marca 6 voltios, pero la corriente es cero. Para que circule, los cables y el interruptor deben formar un camino cerrado. Revisa la mesa antes de cambiar algo. «Ver pistas» ofrece ayuda y permite reiniciar solo este reto.','Encuentra qué interrumpe el camino y repáralo. Conserva la fuente en 6 V y R1 en 100 Ω. Al terminar deben circular 60 mA.','La fuente tiene energía. Sigue los cables y revisa si el interruptor deja pasar la corriente.', '¡Muy bien! El interruptor estaba abierto. Lo cerraste y la corriente llegó a 60 miliamperios.',openSwitch),
    challenge('cable','Reto 2 · El interruptor está cerrado.','Este es un montaje nuevo. El interruptor está cerrado y los valores son correctos, pero sigue sin circular corriente. Un camino también puede quedar abierto si falta un cable. Los puntos dorados son los terminales donde puedes conectar.','Encuentra la conexión que falta. Pulsa los dos terminales que deben unirse. Comprueba que vuelven a circular 60 mA.','Sigue el recorrido desde la fuente, pasando por R1 y S1, hasta volver a la fuente. Busca los dos extremos sin unir.','¡Bien hecho! Faltaba el cable entre R1 y S1. Cerraste el recorrido y recuperaste los 60 miliamperios.',missingWire),
    challenge('conexion','Reto 3 · Un cable tomó el camino equivocado.','La fuente indica un cortocircuito: hay un camino que une sus polos sin pasar por la resistencia. El simulador bloquea la medición y las esferas de corriente. Aquí usamos elementos ideales; no se simulan daños ni una corriente real de cortocircuito.','Localiza el cable incorrecto. Quítalo en «Cables» y conecta sus extremos correctamente para que el recorrido pase por R1 y S1.','Sigue el camino de la fuente al interruptor: debe pasar por R1. Revisa «Cables» y conserva los valores originales.','¡Felicidades! Corregiste la conexión que saltaba la resistencia. El circuito vuelve a 60 miliamperios. Completaste los tres retos.',wrongWire)
  ]
};
