import type { LearningContent } from '../learning-content';
export const medida:readonly LearningContent[]=[
  {
    "id": "medida-acometida",
    "runtimeClassId": null,
    "subjectId": "medida",
    "title": "Instalación y revisión de una acometida",
    "description": "Reconocer los componentes de una acometida y registrar anomalías para su revisión por personal autorizado.",
    "duration": "Lectura 6 min · evaluación 3 min",
    "laboratoryTitle": "Instalación y revisión de una acometida",
    "sections": [
      {
        "title": "Objetivo de la clase",
        "text": "Reconocer los componentes de una acometida y registrar anomalías para su revisión por personal autorizado. La actividad combina explicación, esquemas y verificación de conocimientos.",
        "example": "Resultado esperado: justificar las decisiones usando los conceptos de esta clase."
      },
      {
        "title": "Recorrido del suministro",
        "text": "La acometida enlaza la red con la instalación del usuario. Identificar el punto de conexión, los conductores, la protección y el equipo de medida permite describir el recorrido sin intervenir partes energizadas.",
        "example": "Resultado esperado: distinguir la red, la acometida y la instalación del usuario."
      },
      {
        "title": "Inspección previa",
        "text": "Antes de una intervención se revisan la orden de trabajo, las condiciones del entorno y los riesgos visibles. Un aislamiento deteriorado, una fijación suelta o señales de calentamiento requieren registrar y comunicar la anomalía.",
        "example": "Error frecuente: asumir que un conductor aislado se puede tocar sin evaluar su estado."
      },
      {
        "title": "Identificación y registro",
        "text": "El registro debe relacionar el punto de suministro con su identificación, fotografías autorizadas y observaciones objetivas. La condición del equipo se describe sin atribuir causas que no se hayan comprobado.",
        "example": "Resultado esperado: ubicación, componente afectado y descripción observable."
      },
      {
        "title": "Preparación de la intervención",
        "text": "La instalación o reparación corresponde a personal autorizado y a un procedimiento aprobado. La inspección visual no equivale a comprobar ausencia de tensión ni habilita a manipular la acometida.",
        "example": "Caso típico de accidente: intervenir una conexión por considerarla desconectada sin verificar las fuentes."
      },
      {
        "title": "Alcance y preparación",
        "text": "Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA.",
        "example": "Resultado esperado: revisar los esquemas y responder las tres preguntas. La práctica 3D está en preparación."
      }
    ]
  },
  {
    "id": "medida-medidores",
    "runtimeClassId": null,
    "subjectId": "medida",
    "title": "Medidores de energía: tipos, lectura y sellado",
    "description": "Identificar el registro de energía de un medidor y documentar su lectura y el estado de los sellos.",
    "duration": "Lectura 6 min · evaluación 3 min",
    "laboratoryTitle": "Medidores de energía: tipos, lectura y sellado",
    "sections": [
      {
        "title": "Objetivo de la clase",
        "text": "Identificar el registro de energía de un medidor y documentar su lectura y el estado de los sellos. La actividad combina explicación, esquemas y verificación de conocimientos.",
        "example": "Resultado esperado: justificar las decisiones usando los conceptos de esta clase."
      },
      {
        "title": "Energía y lectura",
        "text": "El medidor registra energía acumulada, normalmente expresada en kWh. La potencia representa un ritmo de consumo; una lectura acumulada no indica por sí sola la potencia instantánea de la instalación.",
        "example": "Error frecuente: confundir kWh con kW."
      },
      {
        "title": "Identificación del equipo",
        "text": "Los medidores pueden ser electromecánicos o electrónicos y disponer de varios registros. Antes de tomar un dato se confirma el identificador del equipo, la unidad y el registro que exige la orden de trabajo.",
        "example": "Resultado esperado: asociar la lectura al medidor correcto y a su unidad."
      },
      {
        "title": "Diferencia entre lecturas",
        "text": "Para un mismo registro acumulado, el consumo del intervalo se obtiene restando la lectura anterior a la actual. Factores de medida, cambios de equipo o reinicios requieren el tratamiento definido por la empresa.",
        "example": "Resultado esperado: de 1240 a 1270 kWh, la diferencia simple es 30 kWh, sin factores adicionales."
      },
      {
        "title": "Estado del sellado",
        "text": "Los sellos son elementos de control cuya identificación y estado se documentan. Un sello ausente o dañado es una observación que debe investigarse; no demuestra por sí sola una manipulación atribuible al usuario.",
        "example": "Error frecuente: retirar un sello sin autorización para facilitar la lectura."
      },
      {
        "title": "Alcance y preparación",
        "text": "Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA.",
        "example": "Resultado esperado: revisar los esquemas y responder las tres preguntas. La práctica 3D está en preparación."
      }
    ]
  },
  {
    "id": "medida-irregulares",
    "runtimeClassId": null,
    "subjectId": "medida",
    "title": "Detección de conexiones irregulares",
    "description": "Reconocer indicios observables y elaborar un reporte objetivo sin intervenir conexiones sospechosas.",
    "duration": "Lectura 6 min · evaluación 3 min",
    "laboratoryTitle": "Detección de conexiones irregulares",
    "sections": [
      {
        "title": "Objetivo de la clase",
        "text": "Reconocer indicios observables y elaborar un reporte objetivo sin intervenir conexiones sospechosas. La actividad combina explicación, esquemas y verificación de conocimientos.",
        "example": "Resultado esperado: justificar las decisiones usando los conceptos de esta clase."
      },
      {
        "title": "Indicios y evidencia",
        "text": "Una derivación no identificada, un sello alterado o daños visibles pueden motivar una revisión. Son indicios y no una conclusión definitiva sobre el origen, la legalidad o la responsabilidad de una persona.",
        "example": "Error frecuente: presentar una sospecha como una irregularidad ya demostrada."
      },
      {
        "title": "Seguridad de la inspección",
        "text": "La prioridad es reconocer peligros y mantener el control del área. No se abren cajas, se cortan cables ni se sigue físicamente una derivación si esas acciones no forman parte de un procedimiento autorizado.",
        "example": "Caso típico de accidente: tocar una derivación desconocida al intentar comprobar su recorrido."
      },
      {
        "title": "Reporte verificable",
        "text": "El informe separa lo observado de lo supuesto: identificación del suministro, componente, estado visible y evidencia obtenida con autorización. La información se conserva por los canales establecidos por la empresa.",
        "example": "Resultado esperado: describir «conductor adicional visible» en lugar de atribuir una intención."
      },
      {
        "title": "Escalamiento del hallazgo",
        "text": "La comprobación y las decisiones posteriores corresponden al personal y al proceso definidos por la empresa. La comunicación con el usuario debe ser respetuosa y describir el motivo de la revisión sin acusaciones.",
        "example": "Resultado esperado: remitir el reporte para evaluación técnica y administrativa."
      },
      {
        "title": "Alcance y preparación",
        "text": "Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA.",
        "example": "Resultado esperado: revisar los esquemas y responder las tres preguntas. La práctica 3D está en preparación."
      }
    ]
  },
  {
    "id": "medida-suspension",
    "runtimeClassId": null,
    "subjectId": "medida",
    "title": "Suspensión y reconexión del servicio",
    "description": "Reconocer los controles documentales y de seguridad previos a una suspensión o reconexión autorizada.",
    "duration": "Lectura 6 min · evaluación 3 min",
    "laboratoryTitle": "Suspensión y reconexión del servicio",
    "sections": [
      {
        "title": "Objetivo de la clase",
        "text": "Reconocer los controles documentales y de seguridad previos a una suspensión o reconexión autorizada. La actividad combina explicación, esquemas y verificación de conocimientos.",
        "example": "Resultado esperado: justificar las decisiones usando los conceptos de esta clase."
      },
      {
        "title": "Orden e identificación",
        "text": "La maniobra comienza verificando la autorización y la correspondencia entre la orden, el suministro y el equipo. Una dirección similar no basta para identificar el punto que se debe intervenir.",
        "example": "Error frecuente: actuar sobre el medidor vecino por una identificación incompleta."
      },
      {
        "title": "Evaluación del entorno",
        "text": "Antes de operar se identifican condiciones inseguras y posibles fuentes adicionales, incluida generación local. La autorización administrativa no sustituye los controles técnicos ni la evaluación del riesgo eléctrico.",
        "example": "Caso típico de accidente: considerar que una orden de suspensión garantiza que no habrá tensión."
      },
      {
        "title": "Ejecución autorizada",
        "text": "La maniobra corresponde a personal habilitado, con medios y procedimiento aprobados. Esta clase explica los controles generales y no establece una secuencia operativa para equipos específicos.",
        "example": "Resultado esperado: reconocer cuándo detener la actividad y solicitar apoyo."
      },
      {
        "title": "Cierre y reconexión",
        "text": "Antes de reconectar se verifican la autorización vigente y las condiciones exigidas por el procedimiento. Al cerrar la orden se registra el suministro, la actuación realizada, las condiciones encontradas y las comunicaciones previstas.",
        "example": "Error frecuente: reconectar únicamente por una solicitud verbal sin validar la orden."
      },
      {
        "title": "Alcance y preparación",
        "text": "Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA.",
        "example": "Resultado esperado: revisar los esquemas y responder las tres preguntas. La práctica 3D está en preparación."
      }
    ]
  }
];
