import type { LearningContent } from '../learning-content';
export const fundamentos:readonly LearningContent[]=[
  {
    "id": "fundamentos-potencia",
    "runtimeClassId": null,
    "subjectId": "electronics",
    "title": "Potencia y energía eléctrica",
    "description": "Distinguir potencia y energía y calcular consumos sencillos con unidades coherentes.",
    "duration": "Lectura 6 min · evaluación 3 min",
    "laboratoryTitle": "Potencia y energía eléctrica",
    "sections": [
      {
        "title": "Objetivo de la clase",
        "text": "Distinguir potencia y energía y calcular consumos sencillos con unidades coherentes. La actividad combina explicación, esquemas y verificación de conocimientos.",
        "example": "Resultado esperado: justificar las decisiones usando los conceptos de esta clase."
      },
      {
        "title": "Potencia eléctrica",
        "text": "La potencia indica la rapidez con que un equipo transforma energía. En un circuito ideal de corriente continua se calcula como P = V · I, con voltios, amperios y vatios; no representa energía acumulada.",
        "example": "Resultado esperado: 12 V y 2 A corresponden a 24 W."
      },
      {
        "title": "Energía durante un intervalo",
        "text": "Si la potencia permanece constante, la energía se obtiene con E = P · t. Usar potencia en kW y tiempo en horas permite expresar el resultado en kWh, que representa una cantidad de energía.",
        "example": "Resultado esperado: un equipo de 1 kW durante 2 horas consume 2 kWh."
      },
      {
        "title": "Comparar consumos",
        "text": "Dos equipos con igual potencia pueden consumir distinta energía si funcionan durante tiempos diferentes. Para estimar el total se suma la energía de cada equipo y se explicitan los tiempos y supuestos usados.",
        "example": "Error frecuente: elegir el equipo de menor consumo mirando solo su potencia nominal."
      },
      {
        "title": "Límites del cálculo",
        "text": "En corriente alterna la potencia activa depende también de las características de la carga y su factor de potencia. El producto simple de tensión y corriente no debe presentarse como potencia activa universal.",
        "example": "Resultado esperado: reconocer que el ejemplo de corriente continua no cubre todas las cargas de una red."
      },
      {
        "title": "Alcance y preparación",
        "text": "Contenido didáctico de demostración. La medición e intervención de instalaciones requieren personal autorizado y procedimientos aprobados.",
        "example": "Resultado esperado: revisar los esquemas y responder las tres preguntas. La práctica 3D está en preparación."
      }
    ]
  },
  {
    "id": "fundamentos-alterna",
    "runtimeClassId": null,
    "subjectId": "electronics",
    "title": "Corriente alterna y sistema trifásico",
    "description": "Distinguir corriente alterna, valor eficaz y relaciones básicas de un sistema trifásico equilibrado.",
    "duration": "Lectura 6 min · evaluación 3 min",
    "laboratoryTitle": "Corriente alterna y sistema trifásico",
    "sections": [
      {
        "title": "Objetivo de la clase",
        "text": "Distinguir corriente alterna, valor eficaz y relaciones básicas de un sistema trifásico equilibrado. La actividad combina explicación, esquemas y verificación de conocimientos.",
        "example": "Resultado esperado: justificar las decisiones usando los conceptos de esta clase."
      },
      {
        "title": "Variación en el tiempo",
        "text": "En corriente alterna, la tensión y la corriente cambian con el tiempo y pueden invertir su sentido. La frecuencia cuenta ciclos por segundo; el dibujo de una onda describe su evolución, no el recorrido físico del conductor.",
        "example": "Resultado esperado: distinguir el período de una onda de su amplitud."
      },
      {
        "title": "Valor eficaz",
        "text": "El valor eficaz permite comparar el efecto térmico con una señal continua sobre una resistencia. Para una onda sinusoidal, el valor máximo es raíz de dos veces el eficaz; esa relación no describe cualquier forma de onda.",
        "example": "Error frecuente: interpretar el valor eficaz como el máximo instantáneo."
      },
      {
        "title": "Tres fases",
        "text": "Un sistema trifásico equilibrado puede representarse mediante tres ondas sinusoidales desplazadas 120 grados entre sí. Ese desplazamiento permite describir cómo se relacionan las fases durante cada ciclo.",
        "example": "Resultado esperado: reconocer tres fases distintas, no tres copias simultáneas de una misma onda."
      },
      {
        "title": "Tensiones y condiciones",
        "text": "La tensión entre fases es distinta de la tensión entre fase y neutro. En estrella equilibrada, la primera es raíz de tres veces la segunda; identificar la conexión y el punto de medida es indispensable antes de aplicar una relación.",
        "example": "Error frecuente: aplicar una relación de estrella a cualquier circuito sin identificar su conexión."
      },
      {
        "title": "Alcance y preparación",
        "text": "Contenido didáctico de demostración. La medición e intervención de instalaciones requieren personal autorizado y procedimientos aprobados.",
        "example": "Resultado esperado: revisar los esquemas y responder las tres preguntas. La práctica 3D está en preparación."
      }
    ]
  },
  {
    "id": "fundamentos-multimetro",
    "runtimeClassId": null,
    "subjectId": "electronics",
    "title": "Uso seguro del multímetro y la pinza amperimétrica",
    "description": "Identificar función, conexiones y controles previos del instrumento antes de una medición autorizada.",
    "duration": "Lectura 6 min · evaluación 3 min",
    "laboratoryTitle": "Uso seguro del multímetro y la pinza amperimétrica",
    "sections": [
      {
        "title": "Objetivo de la clase",
        "text": "Identificar función, conexiones y controles previos del instrumento antes de una medición autorizada. La actividad combina explicación, esquemas y verificación de conocimientos.",
        "example": "Resultado esperado: justificar las decisiones usando los conceptos de esta clase."
      },
      {
        "title": "Selección del instrumento",
        "text": "El instrumento y sus accesorios deben ser adecuados al entorno de medida. Se revisan estado, límites y categoría de medición, además de las instrucciones del fabricante y el procedimiento de trabajo autorizado.",
        "example": "Error frecuente: elegir un equipo únicamente por el valor máximo que aparece en su pantalla."
      },
      {
        "title": "Tensión y corriente",
        "text": "La tensión se mide entre dos puntos con la función y bornes adecuados. La corriente con multímetro exige otra configuración; conectar una entrada de corriente directamente entre puntos de tensión puede provocar un cortocircuito.",
        "example": "Caso típico de accidente: conservar la punta en el borne de corriente al intentar medir tensión."
      },
      {
        "title": "Pinza amperimétrica",
        "text": "La pinza mide el efecto magnético asociado a la corriente. Para medir la corriente de un conductor se abraza ese conductor; rodear ida y retorno juntos puede cancelar sus contribuciones y dar una lectura engañosa.",
        "example": "Error frecuente: interpretar una lectura baja con dos conductores dentro como ausencia de corriente."
      },
      {
        "title": "Continuidad y cierre",
        "text": "La continuidad se comprueba en circuitos desenergizados y bajo las condiciones indicadas por el fabricante. Tras medir se revisa la coherencia de la lectura y se deja el instrumento en una configuración segura para su almacenamiento.",
        "example": "Resultado esperado: no usar continuidad para verificar por sí sola ausencia de tensión."
      },
      {
        "title": "Alcance y preparación",
        "text": "Contenido didáctico de demostración. La medición e intervención de instalaciones requieren personal autorizado y procedimientos aprobados.",
        "example": "Resultado esperado: revisar los esquemas y responder las tres preguntas. La práctica 3D está en preparación."
      }
    ]
  }
];
