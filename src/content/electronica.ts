import type { LearningContent } from '../learning-content';
export const electronica:readonly LearningContent[]=[
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
  }
];
