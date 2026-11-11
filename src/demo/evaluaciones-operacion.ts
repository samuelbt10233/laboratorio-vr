import type { Question } from './evaluaciones';
// Claude's file (docs/plan-clases.md). A class appears in the portal once its questions are here.
export const evaluacionesOperacion:Record<string,Question[]>={
  'operacion-cortacircuitos':[
    {prompt:'¿Dónde se sitúa el operador al abrir un cortacircuitos con pértiga?',options:['A un lado del eje del cortacircuitos, nunca debajo','Justo debajo, para tener mejor visión','Sobre la canasta, junto al transformador'],answer:0,why:'Al abrir con carga puede caer material fundido; el operador se aparta del eje.'},
    {prompt:'¿Qué fase se abre primero?',options:['Cualquiera de las laterales','La más cercana al operador','La central'],answer:2,why:'Se abre primero la central y después las laterales, para reducir el riesgo de que el arco alcance otra fase.'},
    {prompt:'¿Cómo se realiza el cierre?',options:['Lentamente, para controlar el arco','Con un movimiento firme y sin detenerse a mitad del recorrido','Cerrando las tres fases a la vez'],answer:1,why:'Un cierre vacilante prolonga el arco entre los contactos.'},
  ],
  'operacion-transformador':[
    {prompt:'¿Qué función cumple el aceite del transformador?',options:['Solo lubrica las piezas','Mide la carga','Aísla y refrigera'],answer:2,why:'El aceite aísla las partes internas y disipa el calor.'},
    {prompt:'¿Qué datos de la placa se comprueban al reemplazar un transformador?',options:['La potencia, las tensiones del primario y del secundario y el grupo de conexión','Solo la potencia en kVA','El color del tanque'],answer:0,why:'Un transformador de igual potencia con otras tensiones o conexión no sirve para el circuito.'},
    {prompt:'¿Qué debe incluir el reporte de una anomalía en un transformador?',options:['Solo una descripción general','La anomalía, el código del transformador y una fotografía','El nombre del usuario afectado'],answer:1,why:'Con el código y la foto la cuadrilla ubica el equipo y prepara el material.'},
  ],
  'operacion-puesta-tierra':[
    {prompt:'¿Para qué sirve la puesta a tierra en la red?',options:['Para reducir el consumo','Para que actúen las protecciones y limitar tensiones peligrosas en las estructuras','Para aumentar la tensión del secundario'],answer:1,why:'Ofrece un camino a la corriente de falla y limita las tensiones de contacto.'},
    {prompt:'En la medición por caída de potencial, ¿dónde va el electrodo de potencial?',options:['Entre el electrodo bajo prueba y el de corriente','Más allá del electrodo de corriente','Junto al electrodo bajo prueba'],answer:0,why:'Los electrodos se colocan en línea, con el de potencial entre el electrodo bajo prueba y el de corriente.'},
    {prompt:'¿Qué ocurre si los electrodos auxiliares quedan demasiado cerca?',options:['La lectura es correcta igualmente','El medidor no enciende','La lectura resulta menor que la real'],answer:2,why:'Demasiado cerca, las zonas de influencia se superponen y el valor medido es menor que el real.'},
  ],
  'operacion-inspeccion':[
    {prompt:'¿Cómo se organiza el recorrido de inspección?',options:['Poste a poste, en un sentido y con el plano del circuito','Solo en los postes con transformador','Al azar, según el tiempo disponible'],answer:0,why:'Un recorrido ordenado evita omitir estructuras, incluidos los postes de paso.'},
    {prompt:'¿En qué orden se observa cada estructura?',options:['Solo los conductores','De arriba hacia abajo, empezando por la vegetación','De abajo hacia arriba: base, poste, herrajes, aisladores, conductores y equipos'],answer:2,why:'Seguir siempre el mismo orden ayuda a no pasar por alto ninguna parte de la estructura.'},
    {prompt:'Una anomalía representa riesgo inmediato para las personas. ¿Qué se hace?',options:['Se anota para el próximo recorrido','Se asegura la zona y se informa de inmediato al centro de control','Se intenta reparar sin aviso'],answer:1,why:'Un riesgo inmediato exige proteger a las personas y avisar sin esperar al reporte programado.'},
  ],
};
