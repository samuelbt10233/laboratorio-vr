import type { LearningContent } from '../learning-content';
export const fluidos:readonly LearningContent[]=[
  {
    "id": "fluidos-presion",
    "runtimeClassId": null,
    "subjectId": "fluids",
    "title": "Presión en un depósito",
    "description": "Propuesta de contenido para introducir un futuro laboratorio de fluidos.",
    "duration": "Por definir",
    "laboratoryTitle": "Explora la presión con la profundidad",
    "sections": [
      {
        "title": "Un fluido también ejerce presión",
        "text": "El agua en reposo ejerce presión sobre las paredes y el fondo de un depósito. A mayor profundidad, mayor es el peso de agua que queda por encima.",
        "example": "La presión cambia con la profundidad, incluso cuando el agua no está circulando."
      },
      {
        "title": "Identifica las variables",
        "text": "La presión hidrostática relativa depende de la densidad del fluido, la gravedad y la profundidad: p = ρ × g × h. Se mide en pascales (Pa).",
        "example": "Si el fluido y la gravedad se mantienen, duplicar la profundidad duplica la presión relativa."
      },
      {
        "title": "Imagina la comprobación",
        "text": "En un futuro laboratorio se podría variar el nivel del depósito y comparar la presión en puntos situados a distintas profundidades.",
        "example": "Concepto ilustrativo: el alcance, las actividades y el simulador están por definir."
      }
    ]
  }
];
