import type { LearningContent } from '../learning-content';
// Introductory reading only: simulation steps and recorded narration remain independent.
export const electronica:readonly LearningContent[]=[
  {
    "id": "ley-de-ohm",
    "runtimeClassId": "ley-de-ohm",
    "subjectId": "electronics",
    "title": "Ley de Ohm y circuitos básicos",
    "description": "Elementos de un circuito, relación entre voltaje, corriente y resistencia, y conexión en serie.",
    "duration": "Lectura 4–5 min · práctica 8–12 min",
    "laboratoryTitle": "Montaje y modificación de un circuito",
    "sections": [
      {
        "title": "Objetivo de la clase",
        "text": "Un circuito es un conjunto de elementos conectados por los que puede circular corriente. Al finalizar, el participante identifica la fuente, los cables, el interruptor y las resistencias, determina el efecto de aumentar una resistencia y compara un montaje con dos resistencias en serie. No se requiere experiencia previa en resolución de circuitos.",
        "example": "Pregunta previa: ¿qué ocurre con la corriente al abrir el interruptor? La respuesta se contrasta con las lecturas de la práctica."
      },
      {
        "title": "Elementos del montaje",
        "text": "La fuente V1 mantiene una diferencia de voltaje entre sus polos y aporta energía. Los cables unen los terminales de los elementos. El interruptor S1 permite abrir o cerrar el recorrido. La resistencia R1 limita la corriente. Los nombres V1, S1 y R1 identifican el mismo elemento en la mesa y en sus propiedades.",
        "example": "Un cable que cruza otro en la imagen no crea una unión. En la aplicación las conexiones se hacen entre terminales, los puntos situados a los lados de cada elemento."
      },
      {
        "title": "Un camino cerrado para la corriente",
        "text": "La corriente eléctrica describe el flujo de carga y se mide en amperios (A). Para mantener corriente en este montaje debe haber un camino conductor desde un polo de la fuente hasta el otro, pasando por la resistencia. Al abrir S1 se interrumpe ese recorrido. La fuente puede seguir teniendo voltaje aunque no circule corriente.",
        "example": "En la demo, las esferas amarillas ilustran la corriente convencional, del polo positivo al negativo por el circuito exterior. Su velocidad no representa la velocidad física de las cargas."
      },
      {
        "title": "Voltaje, corriente y resistencia",
        "text": "El voltaje V se mide en voltios y representa una diferencia de energía por unidad de carga. La resistencia R se mide en ohmios (Ω). Para una resistencia ideal, la corriente I se calcula con I = V / R. Un miliamperio (mA) equivale a una milésima de amperio: 0,06 A son 60 mA.",
        "example": "Con el camino cerrado, 6 V / 100 Ω = 0,06 A = 60 mA. Con 6 V y 200 Ω, la corriente es de 30 mA."
      },
      {
        "title": "Dos resistencias en un solo camino",
        "text": "En serie, la corriente pasa por una resistencia y después por la otra sin dividirse. Sus resistencias se suman. Dos resistencias de 100 Ω dan una resistencia total de 200 Ω. Con una fuente de 6 V, ambas conducen 30 mA; en cada resistencia cae un voltaje de 3 V. La corriente no se consume al pasar por la primera.",
        "example": "Error frecuente: confundir corriente y voltaje. En este ejemplo la corriente es igual en ambas resistencias, mientras que los 6 V de la fuente se reparten entre ellas."
      },
      {
        "title": "Actividades de la práctica",
        "text": "1. Cerrar S1 y registrar la corriente. 2. Cambiar R1 de 100 a 200 Ω con la fuente en 6 V. 3. Cargar el ejemplo Serie y comparar las lecturas de R1 y R2. El guía confirma cada actividad. En modo libre la comparación puede repetirse cambiando una sola variable cada vez.",
        "example": "Resultado esperado: al duplicar la resistencia con el mismo voltaje, la corriente se reduce a la mitad, de 60 a 30 mA."
      }
    ]
  },
  {
    "id": "circuitos-en-paralelo",
    "runtimeClassId": "circuitos-en-paralelo",
    "subjectId": "electronics",
    "title": "Circuitos en paralelo",
    "description": "Comportamiento de un circuito con más de un recorrido para la corriente.",
    "duration": "Lectura 4–5 min · práctica 5–8 min",
    "laboratoryTitle": "Comparación de dos ramas en paralelo",
    "sections": [
      {
        "title": "Objetivo de la clase",
        "text": "Al finalizar, el participante reconoce dos caminos conectados a la misma fuente y distingue la corriente de una rama de la corriente total. Una rama es uno de los recorridos posibles entre dos puntos de conexión. No hace falta que los componentes estén dibujados uno al lado del otro para que estén en paralelo.",
        "example": "Criterio de identificación: dos resistencias están en paralelo cuando cada una une el mismo par de puntos."
      },
      {
        "title": "El mismo voltaje, dos recorridos",
        "text": "Cada resistencia en paralelo queda conectada entre los mismos polos de la fuente. En este modelo de fuente ideal de 6 V, cada rama tiene 6 V. Las cargas pueden circular por cualquiera de los dos recorridos; no pasan primero por R1 y después por R2 como en una conexión en serie.",
        "example": "El voltaje no se divide entre las ramas: dos resistencias de 100 Ω en paralelo tienen 6 V cada una, no 3 V."
      },
      {
        "title": "Cálculo por rama",
        "text": "Se aplica I = V / R a cada resistencia. Con 6 V y 100 Ω, por R1 pasan 60 mA. Si R2 también vale 100 Ω, por ella pasan otros 60 mA. La corriente que entrega la fuente es la suma de las corrientes de las ramas: 120 mA.",
        "example": "La corriente se reparte por igual solo cuando las resistencias de las dos ramas son iguales. Tener dos caminos no garantiza un reparto idéntico."
      },
      {
        "title": "Efecto de modificar una rama",
        "text": "Si R2 aumenta a 200 Ω, su corriente baja a 30 mA. R1 conserva 100 Ω y sigue conduciendo 60 mA porque la fuente ideal mantiene los mismos 6 V. La corriente total pasa de 120 a 90 mA. La resistencia equivalente resume el conjunto visto desde la fuente: inicialmente es 50 Ω y después aproximadamente 66,7 Ω.",
        "example": "La corriente no toma únicamente el camino de menor resistencia. En este ejemplo circula por las dos ramas, con valores distintos."
      },
      {
        "title": "Actividades de la práctica",
        "text": "1. Seleccionar las dos resistencias y registrar sus lecturas. 2. Cambiar R2 a 200 Ω. 3. Comparar de nuevo las corrientes. R1 se mantiene en 100 Ω y la fuente en 6 V para que la comparación sea válida; el valor de cada rama se distingue siempre del total que aporta la fuente.",
        "example": "Resultado esperado: con una rama en 30 mA y la otra en 60 mA, la corriente total es de 90 mA. El guía verifica ese valor."
      }
    ]
  },
  {
    "id": "encuentra-el-fallo",
    "runtimeClassId": "encuentra-el-fallo",
    "subjectId": "electronics",
    "title": "Diagnóstico de fallas en circuitos",
    "description": "Método de diagnóstico para localizar y corregir fallas en un circuito.",
    "duration": "Lectura 4–5 min · práctica 6–10 min",
    "laboratoryTitle": "Corrección de tres montajes con falla",
    "sections": [
      {
        "title": "Objetivo y método",
        "text": "Esta clase propone tres montajes que no funcionan como se espera. El participante localiza la causa, aplica una corrección y verifica el resultado. El diagnóstico parte de la observación de conexiones y lecturas; cambiar varios elementos a la vez hace difícil saber qué resolvió el problema.",
        "example": "Secuencia de diagnóstico: observar, proponer una causa, cambiar un solo elemento y verificar. Si el resultado no coincide con la hipótesis, se vuelve a observar."
      },
      {
        "title": "Circuito abierto",
        "text": "Un interruptor abierto o un cable ausente puede interrumpir el camino de retorno a la fuente. En ese caso no circula corriente en el circuito simple, aunque la fuente conserve su voltaje. Se recorre cada conexión hasta regresar al otro polo.",
        "example": "Pregunta de diagnóstico: la fuente indica 6 V y la corriente total es cero. ¿Significa que la fuente está apagada? No necesariamente; primero se verifica si el camino está cerrado."
      },
      {
        "title": "Cable ausente y cable incorrecto",
        "text": "Un cable ausente deja dos terminales sin la conexión prevista. Un cable incorrecto puede unir puntos que no debían estar conectados o crear un atajo alrededor de un componente. Mover las piezas por la mesa no repara una conexión eléctrica: se cambian los extremos que une el cable.",
        "example": "En la aplicación, una conexión se crea pulsando un terminal y después el otro, y se retira desde Cables. La forma o el cruce visual de los cables no determina la conectividad."
      },
      {
        "title": "Aviso de cortocircuito",
        "text": "Un cortocircuito de la fuente aparece cuando un recorrido de resistencia nula conecta sus polos en el modelo ideal. No es lo mismo que un circuito abierto. Esta demo bloquea las mediciones porque una fuente ideal con cables ideales no permite calcular una corriente finita en esa situación.",
        "example": "Una lectura bloqueada o mostrada como cero en este estado no significa que un cortocircuito real tenga corriente cero. Aquí no se simulan calentamiento ni daños."
      },
      {
        "title": "Actividades de la práctica",
        "text": "La práctica presenta tres fallas: un interruptor abierto, un cable faltante y una conexión incorrecta. En cada reto se identifica el recorrido esperado, se corrige la falla y se espera la confirmación del guía. La circulación de corriente no basta: el montaje debe coincidir con el solicitado.",
        "example": "Si cerrar el interruptor no restablece la corriente, el siguiente paso es seguir los cables y verificar el camino de ida y vuelta. El resultado debe confirmar el diagnóstico."
      }
    ]
  },
  {
    "id": "enciende-un-led",
    "runtimeClassId": "enciende-un-led",
    "subjectId": "electronics",
    "title": "Polarización de un LED",
    "description": "Polaridad del LED y función de la resistencia limitadora.",
    "duration": "Lectura 4–5 min · práctica 6–10 min",
    "laboratoryTitle": "Conexión de un LED y control de su brillo",
    "sections": [
      {
        "title": "Objetivo de la clase",
        "text": "Un LED es un componente que emite luz cuando conduce corriente en el sentido adecuado. A diferencia de la resistencia ideal, su orientación importa. Al finalizar, el participante identifica sus terminales, lo conecta con una resistencia en serie, corrige una conexión invertida y compara el brillo al cambiar la resistencia.",
        "example": "El montaje inicial ya contiene un LED rojo didáctico. Antes de modificar conexiones se identifican L1, la resistencia R1 y el interruptor S1."
      },
      {
        "title": "Ánodo y cátodo",
        "text": "Los terminales del LED se llaman ánodo y cátodo. La base de L1 los identifica como A + y K −. En la orientación que permite conducir, la corriente convencional entra por el ánodo y sale por el cátodo. Los signos son una ayuda para conectar este montaje; el LED no es una fuente de energía.",
        "example": "En el reto de polaridad, la conexión prevista es R1 · B con L1 · A +, y L1 · K − con S1 · A. No basta con que el cuerpo del LED parezca orientado hacia un lado: importan sus conexiones."
      },
      {
        "title": "Resistencia limitadora",
        "text": "La resistencia en serie limita la corriente de todo el recorrido. El LED de esta demo tiene un umbral de 2 V y una resistencia interna de 20 Ω. Al conducir, su voltaje se aproxima mediante V_LED = 2 V + I × 20 Ω. Es un modelo para aprender, no la ficha de un componente comercial.",
        "example": "Con la fuente en 6 V y R1 en 220 Ω: I = (6 − 2) / (220 + 20) ≈ 0,0167 A = 16,7 mA. Los 20 Ω forman parte del modelo del LED, no son otra pieza de la mesa."
      },
      {
        "title": "Corriente y brillo",
        "text": "Con el camino cerrado y el LED bien conectado, aumentar R1 reduce la corriente. Si R1 pasa de 220 a 470 Ω, el modelo calcula I = 4 / 490 ≈ 8,2 mA. La luz se vuelve más tenue. Por encima de 20 mA se muestra un aviso de sobrecorriente: es un límite didáctico elegido para esta demo.",
        "example": "No se simulan daños ni ruptura por voltaje inverso. Que el LED virtual sobreviva a una conexión no demuestra que un LED real pueda soportarla."
      },
      {
        "title": "Actividades de la práctica",
        "text": "1. Identificar L1 y cerrar S1 para encenderlo. 2. Corregir un montaje con el LED invertido: retirar las dos conexiones incorrectas y unir los terminales que indica el guía. 3. Cambiar únicamente R1 a 470 Ω y seleccionar el LED para comparar corriente y brillo.",
        "example": "Ante un LED apagado con S1 cerrado, se revisan la polaridad y las conexiones. Tras corregirlas, se verifica la lectura y se espera la confirmación del guía."
      }
    ]
  }
];
