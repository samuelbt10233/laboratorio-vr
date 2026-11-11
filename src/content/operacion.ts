import type { LearningContent } from '../learning-content';
// Claude's file (docs/plan-clases.md). Didactic content for the ESSA demo: it must be validated against RETIE and ESSA's own procedures.
export const operacion:readonly LearningContent[]=[
  {
    id:'operacion-cortacircuitos',runtimeClassId:null,subjectId:'operacion',
    title:'Maniobra de cortacircuitos con pértiga',
    description:'Apertura y cierre de cortacircuitos con pértiga, con el orden, la posición y las verificaciones correctas.',
    duration:'10 min',laboratoryTitle:'Maniobra de cortacircuitos',
    sections:[
      {title:'Objetivo de la clase',text:'Al finalizar la clase, el participante abre y cierra los cortacircuitos de un transformador con pértiga, en el orden correcto y desde una posición segura. El cortacircuitos protege el transformador con un fusible y permite separarlo de la red; abrirlo con carga produce un arco que debe controlarse.',example:'Caso típico de accidente: el operador se sitúa justo debajo del cortacircuitos y recibe material fundido al abrirlo con carga.'},
      {title:'Partes del cortacircuitos',text:'El cortacircuitos tiene un aislador, una base con contactos superior e inferior y un portafusible que contiene el fusible. Al fundirse el fusible, el portafusible cae y queda colgando: el corte es visible desde el suelo. La pértiga se engancha en el ojal del portafusible para abrirlo o cerrarlo.',example:'Resultado esperado: el operador reconoce desde el suelo un portafusible caído y lo distingue de uno cerrado.'},
      {title:'Preparación de la maniobra',text:'Se verifica la orden de maniobra, se inspecciona la pértiga limpia y seca, se usan guantes dieléctricos y protección facial, y el operador se coloca a un lado del eje del cortacircuitos, nunca debajo. Si el equipo lo permite, se reduce la carga del transformador antes de abrir.',example:'Error frecuente: usar una pértiga húmeda o sucia. La humedad reduce su aislamiento.'},
      {title:'Orden de apertura y cierre',text:'Se abre primero la fase central y después las laterales, comenzando por la más alejada del viento, para reducir el riesgo de que el arco alcance otra fase. El cierre se hace en orden inverso, con un movimiento firme y sin dudar a mitad de recorrido.',example:'Error frecuente: cerrar lentamente. Un cierre vacilante prolonga el arco entre contactos.'},
      {title:'Alcance de la clase',text:'Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA. El orden de maniobra, el uso de dispositivos de apertura con carga y el equipo requerido los define el procedimiento de la empresa.',example:'La práctica en 3D de esta clase está en preparación: el participante abrirá y cerrará los cortacircuitos en el orden indicado.'},
    ],
  },
  {
    id:'operacion-transformador',runtimeClassId:null,subjectId:'operacion',
    title:'Transformador de distribución',
    description:'Función, partes, placa de características y revisión visual de un transformador de poste.',
    duration:'8 min',laboratoryTitle:'Revisión de un transformador de poste',
    sections:[
      {title:'Objetivo de la clase',text:'Al finalizar la clase, el participante identifica las partes de un transformador de poste, interpreta su placa de características y reconoce las anomalías que debe reportar. El transformador reduce la tensión de la red de media tensión a la de baja tensión que llega a los usuarios.',example:'Caso típico: un transformador con fuga de aceite sigue operando hasta que falla y deja sin servicio a todo un sector.'},
      {title:'Partes principales',text:'El transformador se compone de un tanque con aceite aislante y refrigerante, los bujes de media tensión en la parte superior, los bujes de baja tensión en el costado, la conexión a tierra del tanque y el pararrayos que lo protege de sobretensiones. Se conecta a la red a través de los cortacircuitos.',example:'Resultado esperado: el participante señala en el poste los bujes de media y de baja tensión y el pararrayos.'},
      {title:'Placa de características',text:'La placa indica la potencia nominal en kVA, las tensiones del primario y del secundario, el grupo de conexión, la impedancia y el número de serie. Con estos datos se comprueba que el transformador corresponde al circuito y se calcula su carga admisible.',example:'Error frecuente: reemplazar un transformador por otro de igual potencia sin comprobar las tensiones del secundario.'},
      {title:'Revisión visual',text:'Desde el suelo o desde la canasta se revisan fugas de aceite, corrosión del tanque, bujes fisurados o flameados, conexiones recalentadas, el estado del pararrayos y la continuidad de la puesta a tierra. Cada anomalía se registra con foto y ubicación.',example:'Resultado esperado: el reporte indica la anomalía, el código del transformador y una fotografía.'},
      {title:'Alcance de la clase',text:'Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA. Los criterios de cargabilidad y de retiro de un transformador los define la empresa.',example:'La evaluación verifica la identificación de partes y anomalías.'},
    ],
  },
  {
    id:'operacion-puesta-tierra',runtimeClassId:null,subjectId:'operacion',
    title:'Puesta a tierra y medición de su resistencia',
    description:'Función de la puesta a tierra en la red, sus componentes y la medición de su resistencia.',
    duration:'10 min',laboratoryTitle:'Medición de una puesta a tierra',
    sections:[
      {title:'Objetivo de la clase',text:'Al finalizar la clase, el participante explica la función de la puesta a tierra, reconoce sus componentes y conoce el método de medición de su resistencia. Una puesta a tierra en buen estado permite que actúen las protecciones y limita las tensiones peligrosas en las estructuras.',example:'Caso típico de accidente: el conductor de tierra de un poste fue hurtado y una persona recibe una descarga al tocar el templete durante una falla.'},
      {title:'Componentes',text:'La puesta a tierra se compone de uno o varios electrodos enterrados, el conductor que los une al equipo y las conexiones, que pueden ser soldadas o con conectores. El conductor baja por el poste protegido y se conecta al tanque del transformador, al pararrayos y al neutro.',example:'Resultado esperado: el participante sigue el recorrido del conductor de tierra desde el pararrayos hasta el electrodo.'},
      {title:'Medición por caída de potencial',text:'El medidor de resistencia de tierra inyecta corriente entre el electrodo bajo prueba y un electrodo auxiliar de corriente, y mide la tensión con un electrodo auxiliar de potencial situado entre ambos. Los electrodos auxiliares se colocan en línea y a la distancia que indique el procedimiento.',example:'Error frecuente: clavar los electrodos auxiliares demasiado cerca del electrodo bajo prueba. La lectura resulta menor que la real.'},
      {title:'Condiciones de la medición',text:'Antes de medir se verifica que el sistema esté en las condiciones que exige el procedimiento y se registran la fecha y el estado del suelo, porque la humedad modifica el resultado. Una lectura fuera de los valores aceptados se reporta para mejorar la puesta a tierra.',example:'Resultado esperado: el registro incluye el valor medido, la disposición de los electrodos y el estado del terreno.'},
      {title:'Alcance de la clase',text:'Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA. Los valores máximos de resistencia y el método aplicable los establecen la norma vigente y la empresa.',example:'La evaluación verifica la función, los componentes y la disposición de la medición.'},
    ],
  },
  {
    id:'operacion-inspeccion',runtimeClassId:null,subjectId:'operacion',
    title:'Inspección de redes y reporte de anomalías',
    description:'Recorrido de inspección de un tramo de red, anomalías frecuentes y cómo reportarlas.',
    duration:'8 min',laboratoryTitle:'Inspección de un tramo de red',
    sections:[
      {title:'Objetivo de la clase',text:'Al finalizar la clase, el participante recorre un tramo de red de forma ordenada, identifica las anomalías más frecuentes y las reporta con la información necesaria para su atención. La inspección preventiva evita fallas y accidentes antes de que ocurran.',example:'Caso típico: un aislador fisurado que nadie reportó provoca una falla a tierra durante una lluvia.'},
      {title:'Método del recorrido',text:'El recorrido se hace poste a poste, en un solo sentido y con el plano del circuito. En cada estructura se observan de abajo hacia arriba la base, el poste, los herrajes, los aisladores, los conductores y los equipos instalados.',example:'Error frecuente: inspeccionar solo los postes con transformador y omitir los de paso.'},
      {title:'Anomalías frecuentes',text:'Las anomalías más comunes son postes inclinados o deteriorados, aisladores rotos, conductores con hilos cortados o distancias reducidas, vegetación cerca de la red, conexiones recalentadas, templetes flojos y construcciones cercanas a los conductores.',example:'Resultado esperado: el participante distingue una anomalía que requiere atención inmediata de una que puede programarse.'},
      {title:'Reporte',text:'Cada anomalía se reporta con la ubicación o el código de la estructura, la descripción, una fotografía y una prioridad. Si representa un riesgo inmediato para las personas, se asegura la zona y se informa de inmediato al centro de control.',example:'Error frecuente: reportar «poste en mal estado» sin código ni foto. La cuadrilla que lo atiende no puede ubicarlo ni preparar el material.'},
      {title:'Alcance de la clase',text:'Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA. Las prioridades y el formato del reporte los define la empresa.',example:'La evaluación verifica el método del recorrido y los datos mínimos de un reporte.'},
    ],
  },
];
