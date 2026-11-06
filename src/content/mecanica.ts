import type { LearningContent } from '../learning-content';
export const mecanica:readonly LearningContent[]=[
  {
    "id": "mecanica-pendulo",
    "runtimeClassId": null,
    "subjectId": "mechanics",
    "title": "Explora un péndulo",
    "description": "Propuesta de contenido para introducir un futuro laboratorio de movimiento.",
    "duration": "Por definir",
    "laboratoryTitle": "Compara oscilaciones",
    "sections": [
      {
        "title": "Un movimiento que se repite",
        "text": "Un péndulo se mueve de un lado a otro alrededor de una posición de equilibrio. Una oscilación completa es el recorrido de ida y vuelta hasta la misma posición.",
        "example": "El período es el tiempo que tarda en completar esa oscilación."
      },
      {
        "title": "Compara la longitud",
        "text": "En el modelo ideal de péndulo simple, con oscilaciones pequeñas y gravedad constante, una mayor longitud produce un período mayor. La masa no modifica ese período.",
        "example": "Estas condiciones son importantes: un modelo ideal no describe todos los efectos de un péndulo real."
      },
      {
        "title": "Imagina la comprobación",
        "text": "En un futuro laboratorio se podría modificar la longitud y comparar cuánto tarda el péndulo en completar varias oscilaciones.",
        "example": "Concepto ilustrativo: el alcance, las actividades y el simulador están por definir."
      }
    ]
  }
];
