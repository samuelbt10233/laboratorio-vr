import type { LearningContent } from '../learning-content';
// Concept readings for fluids, kept apart from fluidos.ts so the hydraulic-press task can edit that file freely.
export const fluidosConceptos:readonly LearningContent[]=[
  {
    id:'fluidos-bernoulli',runtimeClassId:null,subjectId:'fluids',
    title:'Caudal y Bernoulli',
    description:'Por qué un fluido que acelera pierde presión: relaciona caudal, velocidad y presión con ejemplos numéricos sencillos.',
    duration:'6 min de lectura',laboratoryTitle:'Estrecha una tubería y mide la presión',
    sections:[
      {title:'Cuánto fluido pasa cada segundo',text:'El caudal Q es el volumen de fluido que atraviesa una sección de tubería en un segundo. Se calcula como el área de la sección por la velocidad del fluido: Q = A · v, y se mide en metros cúbicos por segundo.',example:'Por una tubería de 0.002 m² de sección, el agua que avanza a 2 m/s da un caudal de 0.004 m³/s, es decir, 4 litros por segundo.'},
      {title:'Si la tubería se estrecha, el fluido acelera',text:'Un líquido casi no se comprime: lo que entra por un extremo tiene que salir por el otro. Por eso el caudal es el mismo en todas las secciones, y la ecuación de continuidad dice A₁ · v₁ = A₂ · v₂. Donde la sección es menor, la velocidad es mayor.',example:'Si una tubería pasa de 4 cm² a 1 cm², la sección se reduce a la cuarta parte y el agua va cuatro veces más rápido.'},
      {title:'Más velocidad, menos presión',text:'La ecuación de Bernoulli expresa la conservación de la energía de un fluido que fluye: p + ½ρv² + ρgh = constante a lo largo de una línea de corriente. A la misma altura, si la velocidad aumenta, la presión disminuye.',example:'Con agua (ρ = 1000 kg/m³), al pasar de 1 m/s a 4 m/s la presión baja ½ · 1000 · (4² − 1²) = 7500 Pa, unos 7.5 kPa.'},
      {title:'Dónde se aprovecha',text:'El tubo de Venturi es un conducto con una garganta estrecha: ahí el fluido va más rápido y la presión es menor, y la diferencia de presiones permite medir el caudal. El atomizador de un perfume funciona con la misma idea: el aire rápido reduce la presión y deja subir el líquido.',example:'Un medidor Venturi compara la presión antes de la garganta con la de la garganta para calcular cuánto fluido pasa.'},
      {title:'Concepto: qué falta para un laboratorio',text:'El modelo supone un fluido sin viscosidad, incompresible y con flujo estacionario. En una tubería real hay fricción y, a velocidades altas, turbulencia, de modo que Bernoulli es una buena aproximación pero no el resultado exacto.',example:'Este contenido es un concepto: todavía no hay un laboratorio asociado. Podría ser una tubería de sección variable donde el estudiante cambie el caudal y observe la presión.'},
    ],
  },
];
