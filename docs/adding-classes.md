# Añadir una clase

Cada clase se define en un archivo de `src/classes/` que exporta un objeto de tipo `LabClass`. Usa `ohm.ts` o `parallel.ts` como ejemplo y registra el objeto en el arreglo `classes` de `src/lessons.ts`. El catálogo del laboratorio, la búsqueda, el número de pasos y el reproductor se actualizan automáticamente. El inicio muestra la bienvenida y los laboratorios definidos en `src/laboratories.ts`; al entrar en uno aparecen únicamente sus clases y su modo libre. El tutorial `primeros-pasos` pertenece a la bienvenida y no se repite dentro de Electrónica.

La definición incluye `laboratoryId` (`electronics` para las clases de este laboratorio; `null` para la bienvenida general), un `id` único y estable, título, descripción, duración, nivel, `initialPreset`, `initialSelection` y una lista de `steps`. Los montajes disponibles son `simple`, `series`, `parallel` y `empty`. Los identificadores de componentes deben existir en el montaje usado: `V1`, `R1`, `R2` y `S1`.

Cada paso tiene `id`, `title`, `text`, `task`, `audio`, `success`, `repairPreset` y `goals`. Las reglas se evalúan en orden; la primera pendiente determina la indicación visual y bloquea el avance:

```ts
goals: [
  {kind:'value', part:'R2', value:200, unit:'Ω'},
  {kind:'closed', part:'S1'},
  {kind:'measurement', quantity:'current', value:0.09},
  {kind:'inspect', parts:['R1','R2']}
]
```

`value` exige el valor del componente; `closed` exige un interruptor cerrado; `measurement` comprueba corriente total en amperios o resistencia equivalente en ohmios y exige circuito cerrado; `inspect` requiere seleccionar todos los componentes indicados durante ese paso. Pon las condiciones eléctricas antes de `inspect`. Si dejan de cumplirse, se reinicia la comprobación de inspección. `goals: []` permite continuar tras leer el contenido. `repairPreset` señala el ejemplo que permite recuperar el montaje cuando falta un componente o no coincide una medición. La recuperación debe permitir completar las reglas del paso.

El avatar lee título, explicación y tarea. `audio` apunta a un MP3 en `public/audio/` que se reproduce como narración principal. Puedes grabarlo o generar los audios de todas las clases con:

```sh
node --import tsx scripts/generate-narration.mjs
```

El generador requiere `edge-tts==7.3.1`, acceso a Internet y `ffprobe` en el entorno de generación. Usa por defecto la voz neural mexicana Dalia (`es-MX-DaliaNeural`) con ritmo −5 %; no se carga el sintetizador en la aplicación. `TTS_PYTHON`, `TTS_VOICE` y `TTS_RATE` permiten configurar la generación. Usa una ruta `/audio/nombre-unico.mp3` por paso, directamente dentro de la carpeta audio. Después ejecuta `npm test` y `npm run build`.

El progreso se conserva por ID de clase al navegar dentro de la sesión de la página, incluidos circuito, selección, paso, componentes revisados y finalización. El modo libre tiene su propia sesión. Recargar la página reinicia ese progreso; Guardar/Recuperar sigue guardando únicamente un montaje en el navegador. El último paso completado ofrece acceso al modo libre; volver a una clase terminada permite revisarla.

Esta estructura comparte el laboratorio de electrónica de corriente continua. Una práctica de otra disciplina requiere su propio modelo físico, componentes y reglas.

## Estilo de los diálogos

Escribe para alguien que empieza desde cero: explica primero para qué sirve un elemento y presenta después su nombre técnico. Introduce unidades y símbolos con su significado. Da instrucciones con los nombres visibles de los botones y termina indicando qué cambio debe observar el estudiante. Usa frases breves y un lenguaje cercano, sin presuponer que conoce términos como rama, serie o tensión. Mantén la explicación breve para que quepa en la tarjeta 3D.

Después de cambiar título, explicación o actividad, regenera el audio. Las pruebas comparan el hash del texto pronunciado con el manifiesto de las grabaciones para detectar desajustes.

## Confirmación al completar un paso

Cada paso incluye `success: { text, audio }`. Escribe una confirmación breve que reconozca la acción y explique el resultado observado, por ejemplo: «¡Muy bien! Cerraste el camino y la corriente ya circula». Usa una ruta MP3 propia en `public/audio/`. El generador crea estas grabaciones además de la narración principal y registra sus hashes en `narration-manifest.json`. Reutiliza los audios cuyo texto, voz y ritmo no han cambiado.

La guía confirma automáticamente cuando las reglas pasan de pendientes a cumplidas. La tarjeta muestra un estado verde persistente, cambia el botón a «Continuar» y reproduce la confirmación una vez por paso durante la sesión, respetando el silencio. Si el circuito deja de cumplir las reglas, la tarjeta vuelve a indicar qué falta. No se felicita por cargar una sesión ya resuelta ni por un paso meramente informativo. La guía minimizada se abre al completar una actividad. Al finalizar la clase, el modo libre muestra también la confirmación final.

## Tutorial de uso

`src/classes/tutorial.ts` registra «Primeros pasos en Umbral Labs», la primera entrada del catálogo. Sus ocho pasos enseñan orientación, selección, movimiento, edición, interruptor, cableado, gráficas y guardado. Comparte la guía, las voces y las sesiones de las clases.

Las reglas `action` permiten verificar operaciones de interfaz: `move`, `disconnect`, `connect`, `charts` y `save`. Incluyen una indicación `hint` y un identificador de botón 3D `target` opcional. Solo se registra la acción que está pendiente en ese paso; acciones de pasos anteriores o posteriores no adelantan el tutorial. Los marcadores se conservan con la sesión de la clase y se limpian al pasar al siguiente paso. El guardado se confirma solo si el almacenamiento local termina correctamente.

## Montajes propios y retos de diagnóstico

Un paso puede incluir `setup: Circuit`. Al entrar a ese paso se carga una copia independiente del montaje; al retomar una sesión se conserva el circuito que el estudiante estaba editando. Las clases sin `setup` mantienen su comportamiento anterior: el montaje continúa entre pasos. `createStepCircuit` prepara copias para la entrada y el reinicio.

«Encuentra el fallo» (`src/classes/find-fault.ts`) usa tres montajes: interruptor abierto, cable faltante y conexión que puentea la resistencia y cortocircuita la fuente. La regla `diagnose` contiene `expected: Circuit` y `hint`. Compara componentes, valores, estado de los interruptores y los nodos que forman los cables; ignora posiciones, identificadores y dirección de los cables, y la orientación de resistencias e interruptores, que no tienen polaridad. La fuente y los LED sí la conservan. Así exige reparar el montaje y no acepta obtener la misma corriente con otros valores ni puenteando un componente; en ese caso la guía explica que la corriente es correcta, pero el recorrido no coincide.

La guía muestra «Ver pistas» en estos retos. La vista ampliada permite «Reiniciar este reto», que restaura solo el montaje del paso actual. Las indicaciones de diagnóstico orientan sin señalar directamente el elemento culpable. Cada reparación válida utiliza las confirmaciones y narraciones comunes.

## Clase de LED

`src/classes/led.ts` registra «Enciende un LED» y exporta el montaje `ledCircuit()`. El tipo `led` usa terminal 0 = ánodo A + y terminal 1 = cátodo K −; su `value` fijo de 2 representa el umbral del modelo. No es un campo editable de resistencia. Las reglas de la clase combinan inspección, interruptor, corriente calculada y conexiones esperadas. La corriente de LED entra al reparto por cables, al brillo y al monitor. La interpretación y los límites físicos del modelo están en README.
