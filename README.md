# Umbral · Demo de laboratorio para PC y WebXR

Primera demo local de electrónica básica en navegador. TypeScript, Vite y Babylon.js. Incluye mesa 3D, cableado editable, fuente de 1–12 V, hasta cuatro resistencias, interruptores, inspector, mediciones, clase guiada de cuatro pasos y modo libre. No requiere cuentas ni servicios de IA.

Para incorporar otro agente y preparar la evolución hacia laboratorios de distintas disciplinas, comenzar por [la guía de arquitectura e integración](INTEGRACION_AGENTES.md). Distingue el estado actual de la arquitectura propuesta, los contratos que deben preservarse y las comprobaciones de entrega.

## Ejecutar

```sh
npm install
npm run dev
```

Abrir la URL indicada por Vite. Se necesita un navegador con WebGL. Los recursos 3D son generados localmente; la tipografía externa tiene fuentes de respaldo.

## Controles

- Arrastrar el cuerpo de un componente: moverlo sobre la mesa.
- Pulsar un componente: inspeccionar o modificar su valor; confirmar con «Aplicar valor».
- Pulsar un terminal y después otro: añadir un cable. El terminal de origen se resalta. Escape cancela. También puedes usar los botones de terminal del inspector o los selectores «Desde/Hasta» en «Conexiones».
- Abrir «Conexiones» para eliminar un cable.
- «Vista superior» permite revisar el cableado desde arriba.
- Botón derecho y arrastrar: orbitar. Rueda: acercar o alejar.
- Guardar/Recuperar conserva un montaje en el almacenamiento del navegador actual. Vaciar mesa conserva únicamente la fuente. Los ejemplos y reiniciar la clase reemplazan el montaje actual; guarda antes si deseas conservarlo.

## Modelo y límites

`src/circuit.ts` no depende de Babylon.js ni del DOM. Agrupa nodos unidos por cables e interruptores cerrados y aplica análisis nodal a redes resistivas con una única fuente ideal. Soporta redes serie, paralelo y mixtas; las ramas flotantes tienen corriente cero. Identifica circuitos abiertos y cortocircuitos directos a través de conductores ideales. En cortocircuito se bloquea la medición: el modelo no incluye resistencia interna ni corriente máxima de la fuente. Las corrientes por resistencia usan como referencia terminal 0 → 1; el inspector muestra magnitudes. «∞ Ω» significa que no hay recorrido conductor entre los polos.

No modela transitorios, temperatura, daño, resistencia de cables o tolerancias. El LED usa la aproximación por tramos descrita más abajo; los demás elementos conservan su comportamiento ideal. La medición del inspector es una sonda virtual ideal; todavía no hay un multímetro con puntas manipulables. La clase incluye un avatar sencillo con animación de habla y un cuadro de diálogo. La narración reproduce primero los audios neurales incluidos en `public/audio/`, generados con la voz mexicana Dalia (`es-MX-DaliaNeural`) y ritmo −5 %. La voz del navegador se usa únicamente si una grabación no puede cargarse. Pulsa «Escuchar» al abrir la página; al entrar a la clase o avanzar de paso se inicia la narración. Puedes detener, repetir o silenciar. Al pasar al modo libre se detiene. La boca se anima durante la reproducción; no es sincronización fonética. La guía es una introducción, no una evaluación formal del aprendizaje.

## Verificación

```sh
npm test
npm run build
npm run preview
```

Las pruebas cubren ley de Ohm, conservación de tensión/corriente, serie, paralelo, red mixta, flotantes, ramas abiertas, puentes, cortocircuito y reglas de conexión (duplicados, terminales inválidos y construcción desde cero).

## Railway

Configurar este directorio como raíz del servicio, `npm ci && npm run build` como comando de compilación y `npm start` como inicio. El servidor estático `server.mjs` sirve `dist/`, usa `PORT` si Railway lo proporciona y escucha en `0.0.0.0`. Conectar el dominio y activar HTTPS en Railway. Esta entrega no publica ni modifica infraestructura.

## Siguiente fase

La primera integración WebXR incluye mandos, paneles en el espacio, teclado numérico y teletransporte limitado. «Vista Quest en PC» permite revisar la distribución con ratón. La interacción, comodidad y rendimiento necesitan validación en Quest 2 real. Consulta [la guía de prueba en Quest 2](docs/quest-2.md).

## Regenerar narraciones

Los textos están en `src/classes/` y se registran en `src/lessons.ts`. Para mantener diálogo y voz sincronizados, instala `edge-tts==7.3.1` en un entorno Python de generación y ejecuta:

```sh
node --import tsx scripts/generate-narration.mjs
```

Requiere acceso a Internet y `ffprobe` (incluido con ffmpeg). `TTS_PYTHON` permite elegir el ejecutable del entorno; `TTS_VOICE` y `TTS_RATE` permiten cambiar voz y ritmo. El valor predeterminado es `es-MX-DaliaNeural` con ritmo `-5%`. El generador utiliza el servicio de lectura en voz alta de Microsoft a través de edge-tts. Es una herramienta de preparación de contenido; no se distribuye en el navegador ni se ejecuta en Railway.

Los siete MP3 se validan antes de copiarlos a `public/audio/`. `narration-manifest.json` registra voz, ritmo, duración y hash del texto de cada paso. La aplicación sirve estos archivos estáticos y no necesita credenciales ni llamar al servicio de síntesis durante las clases.

## Representación de componentes

El interruptor muestra un esquema de contacto abierto/cerrado según su estado. La resistencia usa un cuerpo axial con patillas y código nominal de cinco bandas cuando el valor se representa exactamente con tres cifras significativas; para otros valores se conserva únicamente la etiqueta numérica. La banda de tolerancia es decorativa: el modelo continúa siendo ideal. La fuente muestra su tensión en la pantalla superior. Las bases conservan la selección y el arrastre.

## Indicaciones de la clase

La clase señala el componente relevante con un aro y una flecha en la mesa. Los campos y botones de la acción pendiente se resaltan con una etiqueta breve: cerrar S1, seleccionar R1, escribir/aplicar 200 Ω, cargar Serie, revisar R2 y continuar. Las señales se actualizan según el montaje y la selección, y desaparecen en modo libre. No bloquean otros controles.

## Interfaz

El frontend usa tres áreas: banco de componentes y propiedades, mesa 3D con lecturas debajo, y guía con conexiones. La escena mantiene una altura estable y el panel de guía permite desplazamiento independiente. En ventanas pequeñas las áreas se reorganizan verticalmente. La estructura visual está en `src/template.ts` y los estilos en `src/style.css`.

## Gráficas dentro de la escena

El monitor 3D muestra la característica I–V del circuito completo (barrido teórico de la fuente de 0 a 12 V con la misma red) y las caídas de tensión actuales en hasta cuatro resistencias. El punto amarillo indica el estado actual. No es un historial temporal. En circuito abierto la corriente es cero; en cortocircuito las gráficas bloquean las lecturas.

«Ver gráficas» acerca la cámara al monitor. Pulsar una de las gráficas acerca esa sección. «Restablecer vista» vuelve al conjunto; «Ocultar gráficas» libera la mesa. Los datos se actualizan al cambiar conexiones, valores, interruptores o montajes.

## Menú general

La pantalla inicial lista la clase «Ley de Ohm y circuitos básicos» y el modo libre «Banco de electrónica». El botón «Menú general» y el logotipo permiten regresar. Cada modo conserva su montaje y el paso de la clase en memoria al volver al menú durante la misma sesión de página. Recargar reinicia esa memoria; «Empezar desde el principio», en la preparación de una clase ya abierta, reinicia solo esa clase, también dentro de VR. «Guardar» mantiene un montaje en el almacenamiento local para recuperarlo después. La narración y el renderizado 3D se detienen mientras se muestra el menú.

## Navegación y tema visual

El diseño neutro de `src/cloud-theme.css` usa la referencia visual proporcionada: barra lateral fija, búsqueda central y listas simples. Inicio muestra las dos experiencias; Clases guiadas y Modo libre filtran la lista; Recientes muestra experiencias visitadas durante la sesión. La búsqueda ignora tildes y mayúsculas, y Ctrl+K enfoca el campo. La barra se compacta en el laboratorio para dejar espacio a la escena.

### Catálogo de clases

Las clases se registran en `src/lessons.ts` y se definen por separado en `src/classes/`. Incluye Ley de Ohm y Circuitos en paralelo, con sesiones independientes y reglas compartidas para guiar y validar los pasos. Consulta [cómo añadir una clase](docs/adding-classes.md).

### Controles dentro de la escena

La mesa incluye dos paneles 3D interactivos: banco de componentes y propiedades/conexiones. Permiten añadir y seleccionar elementos, cargar ejemplos, cambiar valores, abrir/cerrar interruptores, conectar terminales, eliminar cables y guardar/recuperar montajes. Para escribir un valor, pulsa su pantalla numérica, usa el teclado y Enter o Aplicar; Escape cancela la edición. Los botones −/+ ajustan 1 V o 10 Ω respetando los límites del modelo.

Los paneles siguen la cámara para mantener la legibilidad al orbitar o mirar desde arriba. «Ocultar paneles» libera la vista de la mesa y las gráficas. Las indicaciones de clase resaltan el botón correspondiente dentro de la escena. Debajo del laboratorio, «Controles alternativos por teclado» ofrece los mismos controles mediante elementos HTML accesibles. El asistente también está integrado en la escena.

### Desplazamiento WASD

Pulsa la escena para enfocarla y mantén W/S para avanzar/retroceder y A/D para moverte lateralmente, según la orientación de la cámara. El desplazamiento es horizontal, con velocidad constante incluso en diagonal. El centro de la cámara queda limitado a X entre −6 y 6, Z entre −5 y 7, y altura entre 0 y 5; el zoom conserva su radio de 7–26. «Restablecer vista» vuelve a la posición inicial. Al editar un valor, salir del visor o cambiar de pestaña, se detiene el desplazamiento.

### Corriente animada

Las esferas amarillas recorren los cables en el sentido de corriente convencional (del polo positivo al negativo en el circuito exterior). Solo aparecen en cables con corriente: se ocultan al abrir el circuito, en ramas sin retorno y en cortocircuitos cuya medición está bloqueada. Su velocidad aumenta con la corriente de cada cable y es ilustrativa. El recorrido se actualiza al mover componentes. En lazos redundantes de conductores ideales, donde el modelo no determina un reparto único, se usa un reparto visual con igual peso por conexión.


### Guía virtual en 3D

El avatar es un robot geométrico dentro de Babylon.js. Su boca se anima mientras se reproduce la narración. El diálogo, el progreso, las indicaciones del paso y los botones Escuchar/Repetir, Detener, Silenciar y Continuar son superficies interactivas de la escena. Comparten las mismas reglas y el mismo narrador de las clases. En modo libre, la guía muestra instrucciones y acceso al catálogo de clases.

«Pantalla completa» dedica el visor de PC al laboratorio, con el avatar y sus controles dentro. Escape o «Salir de pantalla completa» vuelve a la página. El contenido HTML equivalente se conserva en «Controles alternativos por teclado». Esta integración se ha validado en PC; la entrada inmersiva WebXR y los mandos ya tienen una primera integración, pendiente de validación en Quest 2 real.

La guía se presenta como una tarjeta compacta en la esquina inferior derecha. Muestra la indicación actual y los controles principales; «Ver explicación» despliega el contenido completo. «−» minimiza la tarjeta y «Abrir» la recupera. La selección se mantiene al cambiar de paso.

Las dos clases usan diálogos para principiantes, con instrucciones sobre los botones visibles, definiciones de los conceptos al introducirlos y resultados que el estudiante puede observar. Los siete audios de Dalia corresponden a esta redacción.

### Confirmación de actividades

Cuando el estudiante completa las reglas de un paso, el guía muestra «Paso completado», reconoce el resultado con un mensaje específico y lo narra con Dalia. La tarjeta permanece verde y el botón cambia a «Continuar». La felicitación se reproduce una sola vez por paso durante la sesión y respeta el silencio. Si se modifica el circuito y deja de cumplir el objetivo, se recupera la indicación de la acción pendiente. Las confirmaciones se definen en `success` dentro de cada paso.

### Tutorial de bienvenida

«Primeros pasos en Umbral Labs» aparece primero en el catálogo de PC y en el catálogo 3D. Incluye ocho pasos para aprender los controles sin conocimientos de electrónica, con narraciones de Dalia y confirmaciones de actividad. Las flechas de movimiento del inspector están disponibles tanto en PC como en la distribución Quest. La navegación inicial se explica sin obligar a usar un dispositivo concreto; las actividades siguientes validan las acciones reales. Guardar conserva el montaje en ese navegador y reemplaza el anterior; no guarda el avance de clase.

### Encuentra el fallo

Clase de diagnóstico de tres retos independientes: interruptor abierto, cable faltante y conexión incorrecta que provoca un cortocircuito. El estudiante debe recuperar el montaje de 6 V, 100 Ω y 60 mA. Las reglas comprueban las conexiones y los valores, permitiendo mover elementos. Incluye voz de Dalia, pistas y reinicio del reto desde la guía 3D. La sesión conserva la reparación al volver al catálogo; avanzar carga el siguiente fallo. El modelo ideal bloquea las lecturas de cortocircuito y no simula daños.

### Enciende un LED

Clase de cuatro pasos: identificar ánodo/cátodo, encender con resistencia en serie, corregir polaridad invertida y atenuar la luz. Incluye narración y confirmaciones de Dalia, reinicio por paso y LED disponible desde el banco de componentes en PC y VR.

`led-solver.ts` usa un modelo didáctico por tramos: corriente nula en inversa o por debajo del umbral; en conducción, `V_LED = 2 V + I × 20 Ω`. No representa un LED comercial concreto. La luz depende de la corriente y cambia a naranja con aviso por encima del límite elegido de 20 mA. No simula destrucción, temperatura, tolerancias ni ruptura inversa. Con 6 V y 220 Ω circulan 16,67 mA; con 470 Ω, 8,16 mA. No deben usarse estos números como especificaciones de un componente real.

El cálculo nodal enumera los estados de hasta cuatro LED; una conductancia numérica de 10⁻¹² S estabiliza nodos flotantes y las corrientes menores de 10⁻⁸ A se presentan como cero. Los circuitos sin LED conservan el solucionador resistivo anterior. Las esferas de corriente incluyen la corriente de los LED y desaparecen en inversa. El barrido I–V calcula cada punto del modelo y las barras incluyen resistencias y LED. En estos circuitos, la resistencia equivalente indicada es V/I en el punto de operación, no una resistencia constante. Guardar/Recuperar conserva los LED y sus conexiones.

### Mesa inclinada

La superficie de trabajo se eleva 40° hacia el fondo, tanto en PC como en VR (`questLayout.tableTilt`). Componentes, terminales, cables y corriente comparten la transformación de la mesa; el monitor permanece vertical. El arrastre convierte el desplazamiento del espacio a coordenadas de la superficie, manteniendo sus límites. Las patas se adaptan a la altura de cada punto de apoyo. La posición guardada de los elementos sigue usando las coordenadas locales de la mesa.

### Recorrido de los cables

`wire-routing.ts` genera cables flexibles en las coordenadas locales de la mesa. Primero intenta una curva cúbica con salida lateral y una ligera holgura. Si atraviesa una base, busca un recorrido corto entre esquinas con margen y redondea sus cambios de dirección. Las curvas se comprueban por segmentos contra las bases; se conserva una conexión exacta en cada terminal. Ya no se usan escalones ni carriles ortogonales.

Al mover cualquier componente se recalculan todos los recorridos, incluidas las esferas de corriente. Si la colocación bloquea las salidas laterales o no deja un paso libre, se usa un arco suave elevado. Superponer físicamente dos componentes todavía puede ocultar sus propios terminales; el trazado no cambia la posición del montaje. La geometría del cable es visual y no altera las conexiones ni los cálculos eléctricos. Las pruebas comprueban terminales, desvíos alrededor de obstáculos, movimiento, rutas elevadas, continuidad de las curvas y ausencia de giros bruscos.

### Catálogo por laboratorio

El inicio permite elegir la bienvenida («Primeros pasos») o un laboratorio. Al abrir Electrónica básica aparecen sus cuatro clases y el modo libre. El botón de regreso de cada práctica lleva a las clases del laboratorio; Inicio vuelve a la selección general. Búsqueda y Recientes respetan esta jerarquía.

`src/laboratories.ts` contiene los laboratorios disponibles y genera las opciones de ambos catálogos, web y 3D. Cada `LabClass` declara `laboratoryId`; la bienvenida usa `null`. Esta separación prepara la navegación para más disciplinas; el runtime de simulación actual sigue siendo exclusivamente de electrónica.

### Inicio explícito de la simulación

Abrir una clase, la bienvenida o el modo libre muestra primero una pantalla de preparación sin audio. «Iniciar clase» / «Iniciar simulación» solicita una sesión WebXR si está disponible, o pantalla completa en PC. La guía y la escena activa comienzan después de entrar. Si se rechaza la solicitud, se puede reintentar o pulsar «Continuar en esta ventana»; no hay inicio automático tras el error. Las experiencias seleccionadas dentro de VR muestran la preparación en un panel 3D. El paso final de una clase puede continuar directamente al modo libre, sin interrumpir la sesión que el usuario ya inició.

### Identidad visual Atlas

El portal usa `src/atlas-theme.css`: tonos crema y terracota, títulos editoriales y navegación horizontal. Inicio mantiene la selección de bienvenida o laboratorio; el catálogo conserva búsqueda, Recientes y sesiones. La ficha previa de cada clase presenta descripción, duración, pasos e inicio manual, con el dispositivo detectado automáticamente. Las ilustraciones SVG de `src/platform-art.ts` son decorativas e independientes de Babylon. El tema anterior `cloud-theme.css` ya no se carga. No se incorporan perfiles, progreso ficticio ni laboratorios conceptuales del mockup. Los controles espaciales y el inicio a pantalla completa / WebXR mantienen su funcionamiento.

La ilustración principal de Atlas incluye una introducción silenciosa de 7 segundos (`introArtwork`): dibuja los tres cables, cierra el interruptor y muestra partículas de corriente antes de reiniciarse. Usa SVG y animaciones CSS, sin iniciar Babylon ni reproducir la clase. Las miniaturas y la preparación de clase mantienen ilustraciones estáticas. La preferencia de movimiento reducido presenta el circuito conectado sin animación.

El portal académico permite explorar materias y leer una introducción a cada clase antes de preparar el laboratorio. Electrónica incluye cuatro clases operativas y modo libre. Mecánica de fluidos y Mecánica muestran propuestas de contenido, con sus simulaciones identificadas como pendientes. Las materias se registran en `src/subjects.ts` y las lecturas en `src/learning-content.ts`.
