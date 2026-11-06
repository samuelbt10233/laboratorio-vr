import type { LearningContent } from '../learning-content';
// Didactic safety content: it must be reviewed by a technical person before a real training.
export const industrial:readonly LearningContent[]=[
  {
    id:'industrial-loto',runtimeClassId:null,labId:'industrial',subjectId:'industrial',
    title:'Bloqueo y etiquetado antes de un mantenimiento',
    description:'Aprende a dejar una máquina sin energía antes de intervenirla y practica el procedimiento en una cinta transportadora.',
    duration:'10 min',laboratoryTitle:'Bloquea y etiqueta una cinta transportadora',
    sections:[
      {title:'Por qué una máquina apagada no es una máquina segura',text:'Un botón de paro detiene el movimiento, pero la máquina sigue conectada. Si otra persona la arranca mientras alguien trabaja dentro, el accidente ocurre en segundos. El bloqueo y etiquetado (LOTO, por «lockout/tagout») garantiza que la energía no vuelva hasta que quien intervino lo decida.',example:'Un operario limpia una cinta que alguien creía apagada, y un compañero pulsa el arranque sin saberlo.'},
      {title:'La secuencia: avisar, apagar, aislar',text:'Primero se avisa al equipo, después se detiene la máquina desde su control y por último se abre el seccionador que corta la fuente de energía. El orden importa: abrir el seccionador con la máquina en carga puede dañar el equipo y a la persona.',example:'En la práctica verás tres pasos con tres elementos distintos: intercomunicador, botón de paro y seccionador.'},
      {title:'Bloquear y etiquetar',text:'Cada persona coloca su propio candado en el seccionador abierto y una etiqueta con su nombre. Mientras su candado esté puesto, nadie puede reconectar. Solo quien lo colocó lo retira.',example:'Si dos personas trabajan en la misma máquina, cada una coloca su candado: la máquina vuelve a energizarse cuando se retiran todos.'},
      {title:'Energía almacenada y verificación',text:'Aislar la electricidad no basta si la máquina guarda aire a presión, resortes comprimidos o piezas elevadas. Esa energía se libera antes de intervenir. Después se prueba el arranque: si no responde, la máquina está sin energía.',example:'En la cinta del laboratorio, el tanque de aire se purga y la prueba de arranque no debe mover nada.'},
      {title:'Antes de practicar',text:'Esta práctica es didáctica y simplifica el procedimiento. En una empresa real se sigue el procedimiento aprobado de la planta y la formación la imparte personal competente.',example:'Cada error en la práctica te explica qué riesgo habría en una máquina real.'},
    ],
  },
  {
    id:'industrial-torno',runtimeClassId:null,subjectId:'industrial',
    title:'Puesta en marcha segura de un torno',
    description:'Repasa la inspección, la protección personal y el arranque de una máquina herramienta antes de empezar a trabajar.',
    duration:'6 min de lectura',laboratoryTitle:'Inspección y arranque de un torno',
    sections:[
      {title:'Inspección antes de encender',text:'Una puesta en marcha segura empieza con la máquina apagada: se revisan las guardas, el área de trabajo, el estado de las herramientas y que no haya nada suelto sobre el torno. Si algo está dañado, la máquina no se usa y se avisa al responsable.',example:'Una guarda retirada o un cable pelado se reportan antes de arrancar; no se «arreglan» sobre la marcha.'},
      {title:'Protección personal',text:'Se trabaja con gafas de seguridad, ropa ajustada, el pelo recogido y sin anillos, cadenas ni pulseras. Cerca de piezas que giran no se usan guantes holgados: pueden engancharse y arrastrar la mano.',example:'Una manga suelta o una cadena colgando pueden enredarse en una pieza que gira.'},
      {title:'Sujeción de la pieza y de la herramienta',text:'La pieza se aprieta con firmeza en el plato y la herramienta de corte se fija bien y a la altura correcta. La llave del plato se retira siempre antes de arrancar: si queda puesta, saldrá despedida cuando el torno gire.',example:'Antes de pulsar el arranque, la pregunta es: ¿tengo todavía la llave en la mano?'},
      {title:'Arranque y primeras pasadas',text:'El primer arranque se hace a baja velocidad y con las manos lejos de la pieza, observando que gire sin vibrar. Se sube la velocidad poco a poco y la persona se queda en su puesto, sin apartar la vista de la máquina.',example:'Una vibración al arrancar es una señal para parar y revisar la sujeción, no para seguir.'},
      {title:'Concepto: qué falta para un laboratorio',text:'Medir, limpiar o ajustar se hace siempre con el torno completamente parado, y para un mantenimiento se aplica el bloqueo y etiquetado. Una práctica futura podría recorrer la inspección y el arranque en un torno virtual, con errores que expliquen el riesgo.',example:'Este contenido es un concepto: todavía no hay un laboratorio asociado. Es didáctico y debe revisarlo una persona con criterio técnico antes de usarse en una formación real.'},
    ],
  },
];
