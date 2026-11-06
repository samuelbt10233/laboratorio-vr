/** Reading material is independent of the simulation steps and their narration. */
export interface LearningSection {title:string;text:string;example:string}
export interface LearningContent {id:string;runtimeClassId:string|null;subjectId:string;title:string;description:string;duration:string;laboratoryTitle:string;sections:LearningSection[]}
export const learningContents:readonly LearningContent[]=[
  {
    "id": "ley-de-ohm",
    "runtimeClassId": "ley-de-ohm",
    "subjectId": "electronics",
    "title": "Ley de Ohm y circuitos básicos",
    "description": "Comprende qué necesita un circuito para funcionar antes de construir tu primer montaje.",
    "duration": "8–12 min",
    "laboratoryTitle": "Construye y modifica un circuito",
    "sections": [
      {
        "title": "Un camino para la corriente",
        "text": "La fuente aporta energía al circuito. Los cables conectan sus elementos y el interruptor abre o cierra el camino. Para que circule corriente debe existir un recorrido cerrado desde un polo de la fuente hasta el otro.",
        "example": "Observa el interruptor: abierto interrumpe el camino; cerrado permite que la corriente circule."
      },
      {
        "title": "Relaciona voltaje, resistencia y corriente",
        "text": "El voltaje se mide en voltios (V). La resistencia dificulta el paso de la corriente y se mide en ohmios (Ω). En este modelo, la corriente se obtiene al dividir el voltaje entre la resistencia: I = V / R.",
        "example": "Ejemplo: con 6 V y 100 Ω circulan 0,06 A, es decir, 60 mA. Si la resistencia aumenta a 200 Ω, la corriente baja a 30 mA."
      },
      {
        "title": "Lleva la idea al laboratorio",
        "text": "Primero cierra el interruptor y observa las esferas amarillas. Después cambia la resistencia de 100 a 200 Ω y compara la lectura de corriente. Cambia una sola cosa cada vez.",
        "example": "Tu objetivo: reconocer un circuito cerrado y comprobar cómo cambia la corriente al aumentar la resistencia."
      }
    ]
  },
  {
    "id": "circuitos-en-paralelo",
    "runtimeClassId": "circuitos-en-paralelo",
    "subjectId": "electronics",
    "title": "Circuitos en paralelo",
    "description": "Descubre qué ocurre cuando un circuito ofrece más de un recorrido.",
    "duration": "5–8 min",
    "laboratoryTitle": "Compara dos caminos para la corriente",
    "sections": [
      {
        "title": "Dos caminos en el mismo circuito",
        "text": "En una conexión en paralelo, cada rama ofrece un camino entre los mismos dos puntos. Por eso ambas tienen el mismo voltaje de la fuente.",
        "example": "Cada rama puede conducir una corriente diferente si sus resistencias son distintas."
      },
      {
        "title": "Compara las corrientes",
        "text": "Con una fuente de 6 V y dos resistencias de 100 Ω en paralelo, cada una conduce 60 mA. La fuente entrega la suma: 120 mA.",
        "example": "Si una resistencia aumenta a 200 Ω, su rama conduce 30 mA. La otra conserva 60 mA y el total pasa a 90 mA."
      },
      {
        "title": "Comprueba cada rama",
        "text": "En el laboratorio, selecciona las dos resistencias y revisa sus lecturas. Cambia una resistencia y observa tanto su rama como la corriente total.",
        "example": "Tu objetivo: distinguir el voltaje compartido y la suma de las corrientes."
      }
    ]
  },
  {
    "id": "encuentra-el-fallo",
    "runtimeClassId": "encuentra-el-fallo",
    "subjectId": "electronics",
    "title": "Encuentra el fallo",
    "description": "Aprende a observar un circuito antes de intentar repararlo.",
    "duration": "6–10 min",
    "laboratoryTitle": "Repara tres montajes",
    "sections": [
      {
        "title": "Observa antes de cambiar",
        "text": "Comprueba si el interruptor está abierto y si todos los elementos tienen un camino de ida y vuelta hasta la fuente. Una conexión ausente puede interrumpir la corriente.",
        "example": "Revisa el recorrido completo, no solo el elemento que parece fallar."
      },
      {
        "title": "Distingue los problemas",
        "text": "Un circuito abierto tiene un camino interrumpido. Un cortocircuito conecta los polos de la fuente por conductores sin la resistencia prevista. En la demo ideal, las mediciones de cortocircuito se bloquean.",
        "example": "Que la demo bloquee una lectura no significa que la corriente real de un cortocircuito sea cero."
      },
      {
        "title": "Repara y comprueba",
        "text": "Encontrarás tres retos: un interruptor abierto, un cable faltante y una conexión incorrecta. Repara el montaje y espera la confirmación del guía.",
        "example": "Tu objetivo: identificar la causa del fallo y recuperar el circuito esperado."
      }
    ]
  },
  {
    "id": "enciende-un-led",
    "runtimeClassId": "enciende-un-led",
    "subjectId": "electronics",
    "title": "Enciende un LED",
    "description": "Conoce la polaridad y el papel de la resistencia antes de encender un LED.",
    "duration": "6–10 min",
    "laboratoryTitle": "Conecta un LED y cambia su brillo",
    "sections": [
      {
        "title": "La orientación importa",
        "text": "El LED tiene dos terminales: ánodo (A +) y cátodo (K −). En el modelo de la demo conduce al estar orientado en el sentido correcto y superar su umbral.",
        "example": "Si lo conectas al revés, el LED del modelo permanece apagado."
      },
      {
        "title": "Controla la corriente",
        "text": "Una resistencia en serie limita la corriente. La demo usa un LED didáctico con umbral de 2 V y resistencia interna de 20 Ω; no representa un componente comercial concreto.",
        "example": "Con 6 V y una resistencia de 220 Ω, el modelo calcula unos 16,7 mA. Al aumentar a 470 Ω, baja a unos 8,2 mA."
      },
      {
        "title": "Enciende, corrige y compara",
        "text": "En el laboratorio reconocerás los terminales, cerrarás el circuito, corregirás una polaridad invertida y aumentarás la resistencia para observar el brillo.",
        "example": "Tu objetivo: comprender cómo influyen la orientación y la corriente en el LED."
      }
    ]
  },
  {
    "id": "fluidos-presion",
    "runtimeClassId": null,
    "subjectId": "fluids",
    "title": "Presión en un depósito",
    "description": "Propuesta de contenido para introducir un futuro laboratorio de fluidos.",
    "duration": "Por definir",
    "laboratoryTitle": "Explora la presión con la profundidad",
    "sections": [
      {
        "title": "Un fluido también ejerce presión",
        "text": "El agua en reposo ejerce presión sobre las paredes y el fondo de un depósito. A mayor profundidad, mayor es el peso de agua que queda por encima.",
        "example": "La presión cambia con la profundidad, incluso cuando el agua no está circulando."
      },
      {
        "title": "Identifica las variables",
        "text": "La presión hidrostática relativa depende de la densidad del fluido, la gravedad y la profundidad: p = ρ × g × h. Se mide en pascales (Pa).",
        "example": "Si el fluido y la gravedad se mantienen, duplicar la profundidad duplica la presión relativa."
      },
      {
        "title": "Imagina la comprobación",
        "text": "En un futuro laboratorio se podría variar el nivel del depósito y comparar la presión en puntos situados a distintas profundidades.",
        "example": "Concepto ilustrativo: el alcance, las actividades y el simulador están por definir."
      }
    ]
  },
  {
    "id": "mecanica-pendulo",
    "runtimeClassId": null,
    "subjectId": "mechanics",
    "title": "Explora un péndulo",
    "description": "Propuesta de contenido para introducir un futuro laboratorio de movimiento.",
    "duration": "Por definir",
    "laboratoryTitle": "Compara oscilaciones",
    "sections": [
      {
        "title": "Un movimiento que se repite",
        "text": "Un péndulo se mueve de un lado a otro alrededor de una posición de equilibrio. Una oscilación completa es el recorrido de ida y vuelta hasta la misma posición.",
        "example": "El período es el tiempo que tarda en completar esa oscilación."
      },
      {
        "title": "Compara la longitud",
        "text": "En el modelo ideal de péndulo simple, con oscilaciones pequeñas y gravedad constante, una mayor longitud produce un período mayor. La masa no modifica ese período.",
        "example": "Estas condiciones son importantes: un modelo ideal no describe todos los efectos de un péndulo real."
      },
      {
        "title": "Imagina la comprobación",
        "text": "En un futuro laboratorio se podría modificar la longitud y comparar cuánto tarda el péndulo en completar varias oscilaciones.",
        "example": "Concepto ilustrativo: el alcance, las actividades y el simulador están por definir."
      }
    ]
  }
];
export function getLearningContent(id:string){const content=learningContents.find(c=>c.id===id);if(!content)throw new Error(`Contenido desconocido: ${id}`);return content;}
