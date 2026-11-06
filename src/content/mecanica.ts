import type { LearningContent } from '../learning-content';
export const mecanica:readonly LearningContent[]=[
  {
    id:'mecanica-pendulo',runtimeClassId:null,subjectId:'mechanics',
    title:'El péndulo simple',
    description:'De qué depende su período: por qué tarda más cuanto más largo es y por qué su masa no cambia el resultado.',
    duration:'6 min de lectura',laboratoryTitle:'Compara oscilaciones',
    sections:[
      {title:'Un movimiento que se repite',text:'Un péndulo simple es una masa pequeña colgada de un hilo de longitud L. Al soltarla desde un lado, oscila de un lado a otro alrededor de su posición de equilibrio. Una oscilación completa es el recorrido de ida y vuelta hasta el punto de partida, y el tiempo que tarda se llama período, T.',example:'Un columpio que se suelta sin empujar es un péndulo: cada vez que vuelve al punto de partida ha completado una oscilación.'},
      {title:'El período depende de la longitud',text:'Para oscilaciones pequeñas, el período vale T = 2π√(L/g), donde g es la aceleración de la gravedad (9.8 m/s² en la Tierra). Un hilo más largo da un período mayor; para duplicar el período hay que cuadruplicar la longitud.',example:'Con L = 1 m, T = 2π√(1/9.8) ≈ 2.0 s. Con L = 4 m, T ≈ 4.0 s: cuatro veces más largo, el doble de tiempo.'},
      {title:'La masa no cuenta',text:'En el modelo ideal, el período no depende de la masa que cuelga. Una bola ligera y una pesada, con el mismo hilo, oscilan al mismo ritmo, porque la gravedad acelera a ambas por igual.',example:'Dos péndulos de 1 m, uno con una bola de 50 g y otro con una de 500 g, tardan lo mismo en completar cada oscilación.'},
      {title:'Cuándo funciona el modelo',text:'La fórmula supone un hilo sin masa, sin fricción con el aire y oscilaciones pequeñas. Hasta unos 15° de amplitud el error es menor del 1 %; con ángulos mayores el período real crece. La gravedad también importa: cambia de un lugar a otro.',example:'El mismo péndulo de 1 m en la Luna (g ≈ 1.6 m/s²) tardaría unos 4.9 s en oscilar, más del doble que en la Tierra.'},
      {title:'Concepto: qué falta para un laboratorio',text:'La actividad natural sería variar la longitud del hilo y cronometrar varias oscilaciones para obtener el período con más precisión. Medir diez oscilaciones y dividir entre diez reduce el error de la medida.',example:'Este contenido es un concepto: todavía no hay un laboratorio asociado. Si se construye, comparar longitudes y planetas sería la práctica corta.'},
    ],
  },
];
