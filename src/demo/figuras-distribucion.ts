import { schemeFigure, type Scheme } from './figura';
/** Schematics for the five-rules reading, generated with Schemdraw by scripts/esquemas.py; didactic only, to be validated against the RETIE and ESSA's procedures. */
const FIGURES:Record<string,Record<number,Scheme>>={'distribucion-cinco-reglas':{
  1:{file:'cinco-reglas-1-cortar',caption:'El seccionador abierto deja un corte visible; el bloqueo y la tarjeta impiden que alguien lo cierre.'},
  2:{file:'cinco-reglas-2-verificar',caption:'Se prueba el detector, se verifica fase por fase y se vuelve a probar el detector.'},
  3:{file:'cinco-reglas-3-tierra',caption:'Las tres fases se unen entre sí y a tierra a ambos lados de la zona de trabajo.'},
  4:{file:'cinco-reglas-4-senalizar',caption:'La zona queda delimitada y señalizada para que nadie ajeno entre en ella.'},
},
  'distribucion-epp':{
    1:{file:'epp-1-equipo',caption:'El equipo dieléctrico se suma al básico cuando se trabaja cerca de partes energizadas.'},
    2:{file:'epp-2-inspeccion',caption:'Un elemento sin ensayo vigente o con daños se retira de servicio y se reporta.'},
  },
  'distribucion-distancias':{
    1:{file:'distancias-1-zonas',caption:'Zonas alrededor de un conductor energizado; su tamaño depende de la tensión de la red.'},
    3:{file:'distancias-2-controles',caption:'Si la distancia no se garantiza, se desenergiza o se aísla el conductor y se vigila la aproximación.'},
  },
  'distribucion-ats':{
    0:{file:'ats-1-columnas',caption:'Cada paso de la tarea se analiza con su peligro y su control.'},
    1:{file:'ats-2-jerarquia',caption:'Los controles se eligen de arriba hacia abajo: el equipo de protección es el último recurso.'},
  },
  'distribucion-alturas':{
    1:{file:'alturas-1-inspeccion',caption:'El poste y su entorno se revisan antes de subir.'},
    2:{file:'alturas-2-sistema',caption:'Componentes del sistema de protección contra caídas.'},
  },
};
export function distributionFigure(contentId:string,index:number):HTMLElement|null{
  const item=FIGURES[contentId]?.[index];return item?schemeFigure('esquemas',item):null;
}
