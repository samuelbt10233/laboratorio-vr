import type { LearningContent } from '../learning-content';
// Introductory reading only: simulation steps and recorded narration remain independent.
export const electronica:readonly LearningContent[]=[
  {
    "id": "ley-de-ohm",
    "runtimeClassId": "ley-de-ohm",
    "subjectId": "electronics",
    "title": "Ley de Ohm y circuitos básicos",
    "description": "Comprende qué necesita un circuito para funcionar antes de construir tu primer montaje.",
    "duration": "Lectura 4–5 min · práctica 8–12 min",
    "laboratoryTitle": "Construye y modifica un circuito",
    "sections": [
      {
        "title": "Qué vas a descubrir",
        "text": "Un circuito es un conjunto de elementos conectados por los que puede circular corriente. En esta clase reconocerás la fuente, los cables, el interruptor y las resistencias. Después comprobarás qué cambia al aumentar una resistencia y compararás un montaje con dos resistencias en serie. No necesitas saber resolver circuitos para empezar.",
        "example": "Antes de entrar: intenta explicar qué crees que ocurrirá al abrir el interruptor. Al terminar podrás contrastar tu idea con las lecturas."
      },
      {
        "title": "Reconoce los elementos de la mesa",
        "text": "La fuente V1 mantiene una diferencia de voltaje entre sus polos y aporta energía. Los cables unen los terminales de los elementos. El interruptor S1 permite abrir o cerrar el recorrido. La resistencia R1 limita la corriente. Los nombres V1, S1 y R1 te permiten encontrar el mismo elemento en la mesa y en sus propiedades.",
        "example": "Un cable que cruza otro en la imagen no crea una unión. En la aplicación las conexiones se hacen entre terminales, los puntos situados a los lados de cada elemento."
      },
      {
        "title": "Un camino cerrado para la corriente",
        "text": "La corriente eléctrica describe el flujo de carga y se mide en amperios (A). Para mantener corriente en este montaje debe haber un camino conductor desde un polo de la fuente hasta el otro, pasando por la resistencia. Al abrir S1 interrumpes ese recorrido. La fuente puede seguir teniendo voltaje aunque no circule corriente.",
        "example": "En la demo, las esferas amarillas ilustran la corriente convencional, del polo positivo al negativo por el circuito exterior. Su velocidad no representa la velocidad física de las cargas."
      },
      {
        "title": "Tres cantidades que puedes relacionar",
        "text": "El voltaje V se mide en voltios y representa una diferencia de energía por unidad de carga. La resistencia R se mide en ohmios (Ω). Para una resistencia ideal, la corriente I se calcula con I = V / R. Un miliamperio (mA) equivale a una milésima de amperio: 0,06 A son 60 mA.",
        "example": "Con el camino cerrado, 6 V / 100 Ω = 0,06 A = 60 mA. Si conservas 6 V y cambias a 200 Ω, obtienes 30 mA. Predice el cambio antes de editar el valor."
      },
      {
        "title": "Dos resistencias en un solo camino",
        "text": "En serie, la corriente pasa por una resistencia y después por la otra sin dividirse. Sus resistencias se suman. Dos resistencias de 100 Ω dan una resistencia total de 200 Ω. Con una fuente de 6 V, ambas conducen 30 mA; en cada resistencia cae un voltaje de 3 V. La corriente no se consume al pasar por la primera.",
        "example": "No confundas corriente y voltaje: en este ejemplo la corriente es igual en ambas resistencias, mientras que los 6 V de la fuente se reparten entre ellas."
      },
      {
        "title": "Tu comprobación en el laboratorio",
        "text": "Primero cierra S1 y observa la corriente. Después cambia R1 de 100 a 200 Ω manteniendo la fuente en 6 V. En el paso de serie, carga el ejemplo Serie y selecciona R1 y R2 para comparar sus lecturas. El guía confirmará cada actividad completada. En modo libre podrás repetir la comparación cambiando una sola variable cada vez.",
        "example": "Antes de pasar a la práctica: ¿qué ocurrirá con la corriente si duplicas la resistencia y mantienes el voltaje? Se reducirá a la mitad. Compruébalo con 60 mA y 30 mA."
      }
    ]
  },
  {
    "id": "circuitos-en-paralelo",
    "runtimeClassId": "circuitos-en-paralelo",
    "subjectId": "electronics",
    "title": "Circuitos en paralelo",
    "description": "Descubre qué ocurre cuando un circuito ofrece más de un recorrido.",
    "duration": "Lectura 4–5 min · práctica 5–8 min",
    "laboratoryTitle": "Compara dos caminos para la corriente",
    "sections": [
      {
        "title": "Qué vas a comparar",
        "text": "Aprenderás a reconocer dos caminos conectados a la misma fuente y a distinguir la corriente de una rama de la corriente total. Una rama es uno de los recorridos posibles entre dos puntos de conexión. No hace falta que los componentes estén dibujados uno al lado del otro para que estén en paralelo.",
        "example": "Busca las conexiones de ambos extremos: dos resistencias están en paralelo cuando cada una une el mismo par de puntos."
      },
      {
        "title": "El mismo voltaje, dos recorridos",
        "text": "Cada resistencia en paralelo queda conectada entre los mismos polos de la fuente. En este modelo de fuente ideal de 6 V, cada rama tiene 6 V. Las cargas pueden circular por cualquiera de los dos recorridos; no pasan primero por R1 y después por R2 como en una conexión en serie.",
        "example": "El voltaje no se divide entre las ramas: dos resistencias de 100 Ω en paralelo tienen 6 V cada una, no 3 V."
      },
      {
        "title": "Calcula una rama cada vez",
        "text": "Puedes aplicar I = V / R a cada resistencia. Con 6 V y 100 Ω, por R1 pasan 60 mA. Si R2 también vale 100 Ω, por ella pasan otros 60 mA. La corriente que entrega la fuente es la suma de las corrientes de las ramas: 120 mA.",
        "example": "La corriente se reparte por igual solo cuando las resistencias de las dos ramas son iguales. Tener dos caminos no garantiza un reparto idéntico."
      },
      {
        "title": "Cambia un camino y observa el conjunto",
        "text": "Si R2 aumenta a 200 Ω, su corriente baja a 30 mA. R1 conserva 100 Ω y sigue conduciendo 60 mA porque la fuente ideal mantiene los mismos 6 V. La corriente total pasa de 120 a 90 mA. La resistencia equivalente resume el conjunto visto desde la fuente: inicialmente es 50 Ω y después aproximadamente 66,7 Ω.",
        "example": "La corriente no toma únicamente el camino de menor resistencia. En este ejemplo circula por las dos ramas, con valores distintos."
      },
      {
        "title": "Prepara tu comparación",
        "text": "En la práctica seleccionarás las dos resistencias para reconocer sus lecturas, cambiarás R2 a 200 Ω y compararás de nuevo las corrientes. Distingue siempre el valor de un elemento del total que aporta la fuente. Mantén R1 en 100 Ω y la fuente en 6 V para que la comparación tenga sentido.",
        "example": "Predice antes de entrar: si una rama pasa de 60 a 30 mA y la otra sigue en 60 mA, ¿cuál es el total? 90 mA. El guía comprobará ese resultado."
      }
    ]
  },
  {
    "id": "encuentra-el-fallo",
    "runtimeClassId": "encuentra-el-fallo",
    "subjectId": "electronics",
    "title": "Encuentra el fallo",
    "description": "Aprende a observar un circuito antes de intentar repararlo.",
    "duration": "Lectura 4–5 min · práctica 6–10 min",
    "laboratoryTitle": "Repara tres montajes",
    "sections": [
      {
        "title": "Investiga antes de reparar",
        "text": "Esta clase propone tres montajes que no funcionan como se espera. Tu tarea es encontrar la causa, hacer una corrección y comprobar el resultado. Empieza observando las conexiones y las lecturas; cambiar varios elementos a la vez hace difícil saber qué resolvió el problema.",
        "example": "Usa este orden: observar → proponer una causa → cambiar una cosa → comprobar. Si el resultado no coincide con tu idea, vuelve a observar."
      },
      {
        "title": "Reconoce un circuito abierto",
        "text": "Un interruptor abierto o un cable ausente puede interrumpir el camino de retorno a la fuente. En ese caso no circula corriente en el circuito simple, aunque la fuente conserve su voltaje. Recorre con la vista cada conexión hasta regresar al otro polo.",
        "example": "Pregunta de diagnóstico: la fuente indica 6 V y la corriente total es cero. ¿Significa que la fuente está apagada? No necesariamente; comprueba primero si el camino está cerrado."
      },
      {
        "title": "Distingue un cable ausente de uno incorrecto",
        "text": "Un cable ausente deja dos terminales sin la conexión prevista. Un cable incorrecto puede unir puntos que no debían estar conectados o crear un atajo alrededor de un componente. Mover las piezas por la mesa no repara una conexión eléctrica: debes cambiar los extremos que une el cable.",
        "example": "En la aplicación, pulsa un terminal y después el otro para unirlos. Para retirar una conexión, utiliza Cables. La forma o el cruce visual de los cables no determina la conectividad."
      },
      {
        "title": "Comprende el aviso de cortocircuito",
        "text": "Un cortocircuito de la fuente aparece cuando un recorrido de resistencia nula conecta sus polos en el modelo ideal. No es lo mismo que un circuito abierto. Esta demo bloquea las mediciones porque una fuente ideal con cables ideales no permite calcular una corriente finita en esa situación.",
        "example": "Una lectura bloqueada o mostrada como cero en este estado no significa que un cortocircuito real tenga corriente cero. Aquí no se simulan calentamiento ni daños."
      },
      {
        "title": "Comprueba la reparación",
        "text": "Encontrarás un interruptor abierto, un cable faltante y una conexión incorrecta. Lee la indicación del guía en cada reto: identifica el recorrido esperado, corrige el problema y espera la confirmación. Ver esferas amarillas ayuda a observar corriente, pero también debes conservar el montaje solicitado para completar el objetivo.",
        "example": "Antes de entrar: si cerrar el interruptor no recupera la corriente, ¿qué revisarías después? Sigue los cables y comprueba el camino de ida y vuelta. El resultado debe confirmar tu diagnóstico."
      }
    ]
  },
  {
    "id": "enciende-un-led",
    "runtimeClassId": "enciende-un-led",
    "subjectId": "electronics",
    "title": "Enciende un LED",
    "description": "Conoce la polaridad y el papel de la resistencia antes de encender un LED.",
    "duration": "Lectura 4–5 min · práctica 6–10 min",
    "laboratoryTitle": "Conecta un LED y cambia su brillo",
    "sections": [
      {
        "title": "Qué hace diferente a un LED",
        "text": "Un LED es un componente que emite luz cuando conduce corriente en el sentido adecuado. A diferencia de la resistencia ideal, su orientación importa. En esta clase reconocerás sus terminales, lo encenderás con una resistencia en serie, corregirás una conexión invertida y compararás el brillo al cambiar la resistencia.",
        "example": "El montaje inicial ya contiene un LED rojo didáctico. Localiza L1, la resistencia R1 y el interruptor S1 antes de cambiar conexiones."
      },
      {
        "title": "Reconoce ánodo y cátodo",
        "text": "Los terminales del LED se llaman ánodo y cátodo. La base de L1 los identifica como A + y K −. En la orientación que permite conducir, la corriente convencional entra por el ánodo y sale por el cátodo. Los signos son una ayuda para conectar este montaje; el LED no es una fuente de energía.",
        "example": "En el reto de polaridad, la conexión prevista es R1 · B con L1 · A +, y L1 · K − con S1 · A. No basta con que el cuerpo del LED parezca orientado hacia un lado: importan sus conexiones."
      },
      {
        "title": "Por qué necesita una resistencia",
        "text": "La resistencia en serie limita la corriente de todo el recorrido. El LED de esta demo tiene un umbral de 2 V y una resistencia interna de 20 Ω. Al conducir, su voltaje se aproxima mediante V_LED = 2 V + I × 20 Ω. Es un modelo para aprender, no la ficha de un componente comercial.",
        "example": "Con la fuente en 6 V y R1 en 220 Ω: I = (6 − 2) / (220 + 20) ≈ 0,0167 A = 16,7 mA. Los 20 Ω forman parte del modelo del LED, no son otra pieza de la mesa."
      },
      {
        "title": "Relaciona corriente y brillo",
        "text": "Con el camino cerrado y el LED bien conectado, aumentar R1 reduce la corriente. Si R1 pasa de 220 a 470 Ω, el modelo calcula I = 4 / 490 ≈ 8,2 mA. La luz se vuelve más tenue. Por encima de 20 mA se muestra un aviso de sobrecorriente: es un límite didáctico elegido para esta demo.",
        "example": "No se simulan daños ni ruptura por voltaje inverso. Que el LED virtual sobreviva a una conexión no demuestra que un LED real pueda soportarla."
      },
      {
        "title": "Conecta, corrige y compara",
        "text": "Primero identifica L1. Después cierra S1 para encenderlo. El siguiente reto presenta un montaje con el LED invertido: retira sus dos conexiones incorrectas y vuelve a unir los terminales indicados por el guía. En la última actividad, cambia únicamente R1 a 470 Ω y selecciona el LED para comparar corriente y brillo.",
        "example": "Predice antes de entrar: ¿qué puede explicar que un LED esté apagado con S1 cerrado? En esta práctica, revisa su polaridad y las conexiones. Tras corregirlas, comprueba la lectura y espera la confirmación."
      }
    ]
  }
];
