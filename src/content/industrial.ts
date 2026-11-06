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
    description:'Propuesta de contenido para una futura práctica sobre inspección y arranque de una máquina herramienta.',
    duration:'Por definir',laboratoryTitle:'Inspección y arranque de un torno',
    sections:[
      {title:'Antes de encender',text:'Una puesta en marcha segura empieza con una inspección: la pieza bien sujeta, la llave del plato retirada, las guardas en su lugar y la zona despejada.',example:'Una llave olvidada en el plato puede salir despedida cuando el torno gira.'},
      {title:'Equipo de protección y arranque',text:'Se usan gafas de seguridad, ropa ajustada y el pelo recogido. El arranque se hace a baja velocidad y con la mano lejos del giro, observando que la pieza gire sin vibrar.',example:'Mangas sueltas y cadenas pueden enredarse en una pieza que gira.'},
      {title:'Concepto ilustrativo',text:'Este contenido muestra la estructura prevista de una futura práctica. Su alcance, las actividades y el simulador están por definir.',example:'Concepto propuesto: aún no hay laboratorio asociado.'},
    ],
  },
];
