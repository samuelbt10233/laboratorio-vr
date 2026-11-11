import { schemeFigure, type Scheme } from './figura';
const FIGURES:Record<string,Record<number,Scheme>>={
  "medida-acometida": {
    "1": {
      "file": "acometida-recorrido",
      "caption": "Esquema conceptual del suministro: red, protección, medida e instalación del usuario. No representa un montaje operativo."
    },
    "3": {
      "file": "acometida-control",
      "caption": "Controles previos: confirmar la orden, inspeccionar y registrar."
    }
  },
  "medida-medidores": {
    "1": {
      "file": "medidores-registro",
      "caption": "La lectura se asocia al equipo y a su registro acumulado en kWh."
    },
    "3": {
      "file": "medidores-diferencia",
      "caption": "Diferencia simple: 1270 − 1240 = 30 kWh, sin factores adicionales."
    }
  },
  "medida-irregulares": {
    "1": {
      "file": "irregulares-indicio",
      "caption": "Una observación requiere verificación antes de formular una conclusión."
    },
    "3": {
      "file": "irregulares-reporte",
      "caption": "El reporte vincula identificación, evidencia autorizada y descripción objetiva."
    }
  },
  "medida-suspension": {
    "1": {
      "file": "suspension-control",
      "caption": "La orden debe corresponder al punto de suministro antes de una maniobra autorizada."
    },
    "3": {
      "file": "suspension-reconexion",
      "caption": "La autorización y el control técnico preceden a la reconexión. Esquema conceptual, no secuencia operativa."
    }
  }
};
export function meteringFigure(contentId:string,index:number):HTMLElement|null{const item=FIGURES[contentId]?.[index];return item?schemeFigure('esquemas-codex',item):null;}
