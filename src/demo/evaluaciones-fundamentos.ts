import type { Question } from './evaluaciones';
export const evaluacionesFundamentos:Record<string,Question[]>={
  "fundamentos-potencia": [
    {
      "prompt": "12 V por 2 A dan…",
      "options": [
        "24 W",
        "24 kWh",
        "6 W"
      ],
      "answer": 0,
      "why": "En el ejemplo de corriente continua, P = V · I."
    },
    {
      "prompt": "1 kW durante 2 horas equivale a…",
      "options": [
        "0,5 kWh",
        "2 kWh",
        "2 kW"
      ],
      "answer": 1,
      "why": "E = P · t y el resultado es energía."
    },
    {
      "prompt": "Dos equipos de igual potencia siempre consumen igual energía…",
      "options": [
        "Sí",
        "Solo de noche",
        "No: depende del tiempo"
      ],
      "answer": 2,
      "why": "La energía depende de la potencia y del tiempo de funcionamiento."
    }
  ],
  "fundamentos-alterna": [
    {
      "prompt": "La frecuencia expresa…",
      "options": [
        "Ciclos por segundo",
        "Energía acumulada",
        "Longitud del conductor"
      ],
      "answer": 0,
      "why": "La frecuencia describe la repetición temporal de la señal."
    },
    {
      "prompt": "El valor eficaz de una sinusoide es su máximo…",
      "options": [
        "Sí",
        "No",
        "Solo en trifásica"
      ],
      "answer": 1,
      "why": "Máximo y eficaz son valores distintos."
    },
    {
      "prompt": "En trifásica equilibrada las fases se desplazan…",
      "options": [
        "0 grados",
        "90 grados",
        "120 grados"
      ],
      "answer": 2,
      "why": "Las tres ondas se distribuyen uniformemente a lo largo de un ciclo."
    }
  ],
  "fundamentos-multimetro": [
    {
      "prompt": "Antes de medir se revisan…",
      "options": [
        "Solo las pilas",
        "Estado, categoría, límites y accesorios",
        "Solo el color"
      ],
      "answer": 1,
      "why": "La idoneidad del instrumento depende del entorno y sus límites."
    },
    {
      "prompt": "La entrada de corriente conectada entre puntos de tensión puede…",
      "options": [
        "Provocar un cortocircuito",
        "Medir mejor",
        "Eliminar el riesgo"
      ],
      "answer": 0,
      "why": "La configuración incorrecta puede crear un recorrido de baja impedancia."
    },
    {
      "prompt": "Para medir corriente de un conductor con pinza se rodea…",
      "options": [
        "Ida y retorno juntos",
        "Todo el cable siempre",
        "El conductor individual"
      ],
      "answer": 2,
      "why": "Rodear ida y retorno puede cancelar el efecto magnético medido."
    }
  ]
};
