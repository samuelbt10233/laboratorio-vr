import { schemeFigure, type Scheme } from './figura';
const FIGURES:Record<string,Record<number,Scheme>>={
  "fundamentos-potencia": {
    "1": {
      "file": "potencia-circuito",
      "caption": "Ejemplo ideal de corriente continua: 12 V × 2 A = 24 W."
    },
    "3": {
      "file": "potencia-energia",
      "caption": "Potencia constante durante un intervalo: 1 kW × 2 h = 2 kWh."
    }
  },
  "fundamentos-alterna": {
    "1": {
      "file": "alterna-circuito",
      "caption": "Una fuente alterna alimenta una carga; la señal varía con el tiempo."
    },
    "3": {
      "file": "alterna-fases",
      "caption": "Tres señales de un sistema equilibrado: desplazamiento de 120° entre fases."
    }
  },
  "fundamentos-multimetro": {
    "1": {
      "file": "multimetro-tension",
      "caption": "El voltímetro se conecta entre dos puntos. Esquema didáctico, sin instrucciones de intervención."
    },
    "3": {
      "file": "multimetro-pinza",
      "caption": "La medida con pinza corresponde a un conductor individual; esquema conceptual."
    }
  }
};
export function fundamentalsFigure(contentId:string,index:number):HTMLElement|null{const item=FIGURES[contentId]?.[index];return item?schemeFigure('esquemas-codex',item):null;}
