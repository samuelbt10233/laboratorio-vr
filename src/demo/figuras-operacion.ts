import { schemeFigure, type Scheme } from './figura';
/** Claude's file (docs/plan-clases.md): schematics for each class, by section index, served from public/esquemas/. */
const FIGURES:Record<string,Record<number,Scheme>>={
  'operacion-cortacircuitos':{
    1:{file:'cortacircuitos-1-esquema',caption:'Los cortacircuitos separan el transformador de la red de media tensión.'},
    3:{file:'cortacircuitos-2-orden',caption:'Orden de apertura y cierre de las tres fases.'},
  },
  'operacion-transformador':{
    1:{file:'transformador-1-partes',caption:'Conexión del transformador de poste a la red y a tierra.'},
    2:{file:'transformador-2-placa',caption:'Datos de la placa que se comprueban antes de instalar o reemplazar un transformador.'},
  },
  'operacion-puesta-tierra':{
    1:{file:'puesta-tierra-1-componentes',caption:'Pararrayos, tanque y neutro se unen al electrodo de puesta a tierra.'},
    2:{file:'puesta-tierra-2-medicion',caption:'Medición por caída de potencial con dos electrodos auxiliares.'},
  },
  'operacion-inspeccion':{
    1:{file:'inspeccion-1-metodo',caption:'Orden de observación en cada estructura.'},
    3:{file:'inspeccion-2-reporte',caption:'Datos mínimos para que la cuadrilla ubique y atienda la anomalía.'},
  },
};
export function operationFigure(contentId:string,index:number):HTMLElement|null{const item=FIGURES[contentId]?.[index];return item?schemeFigure('esquemas',item):null;}
