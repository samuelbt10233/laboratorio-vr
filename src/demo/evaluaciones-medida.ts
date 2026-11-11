import type { Question } from './evaluaciones';
export const evaluacionesMedida:Record<string,Question[]>={
  "medida-acometida": [
    {
      "prompt": "¿Qué enlaza la acometida?",
      "options": [
        "La red con la instalación del usuario",
        "Dos evaluaciones",
        "Solo el alumbrado público"
      ],
      "answer": 0,
      "why": "La acometida forma parte del recorrido del suministro hacia el usuario."
    },
    {
      "prompt": "Ante aislamiento deteriorado corresponde…",
      "options": [
        "Tocarlo para comprobarlo",
        "Registrar y comunicar la anomalía",
        "Ocultarlo en el informe"
      ],
      "answer": 1,
      "why": "La anomalía se documenta y se remite al procedimiento autorizado."
    },
    {
      "prompt": "La inspección visual demuestra ausencia de tensión…",
      "options": [
        "Siempre",
        "Solo de día",
        "No"
      ],
      "answer": 2,
      "why": "La ausencia de tensión requiere una verificación específica por personal autorizado."
    }
  ],
  "medida-medidores": [
    {
      "prompt": "¿Qué registra la energía acumulada?",
      "options": [
        "kWh",
        "kW por segundo",
        "Solo amperios"
      ],
      "answer": 0,
      "why": "El kWh es una unidad de energía."
    },
    {
      "prompt": "De 1240 a 1270 kWh, sin factores, el consumo es…",
      "options": [
        "1270 kWh",
        "30 kWh",
        "2510 kWh"
      ],
      "answer": 1,
      "why": "Se resta la lectura anterior a la actual."
    },
    {
      "prompt": "Un sello dañado implica…",
      "options": [
        "Culpabilidad probada",
        "Permiso para retirarlo",
        "Una observación que requiere investigación"
      ],
      "answer": 2,
      "why": "El hallazgo debe documentarse sin sacar conclusiones no comprobadas."
    }
  ],
  "medida-irregulares": [
    {
      "prompt": "Una derivación desconocida es…",
      "options": [
        "Prueba definitiva de fraude",
        "Un indicio que debe verificarse",
        "Un cable seguro"
      ],
      "answer": 1,
      "why": "El indicio exige investigación y no acredita responsabilidades."
    },
    {
      "prompt": "Para revisar un cable sospechoso se debe…",
      "options": [
        "Tocarlo",
        "Cortarlo de inmediato",
        "Aplicar el procedimiento autorizado"
      ],
      "answer": 2,
      "why": "La investigación no elimina los riesgos eléctricos."
    },
    {
      "prompt": "Un reporte adecuado contiene…",
      "options": [
        "Hechos observables y evidencia autorizada",
        "Acusaciones personales",
        "Solo una conclusión"
      ],
      "answer": 0,
      "why": "Separar hechos de suposiciones hace verificable el reporte."
    }
  ],
  "medida-suspension": [
    {
      "prompt": "Antes de una maniobra se verifica…",
      "options": [
        "Solo la calle",
        "Orden y punto de suministro",
        "Solo el nombre del técnico"
      ],
      "answer": 1,
      "why": "La orden debe corresponder con el equipo y suministro correctos."
    },
    {
      "prompt": "La autorización administrativa sustituye la evaluación de riesgo…",
      "options": [
        "No",
        "Sí",
        "Solo en reconexión"
      ],
      "answer": 0,
      "why": "Los controles administrativos y técnicos cumplen funciones diferentes."
    },
    {
      "prompt": "La reconexión requiere…",
      "options": [
        "Una petición verbal únicamente",
        "Ignorar las condiciones del equipo",
        "Autorización y condiciones del procedimiento"
      ],
      "answer": 2,
      "why": "La reconexión debe cumplir los controles definidos y quedar registrada."
    }
  ]
};
