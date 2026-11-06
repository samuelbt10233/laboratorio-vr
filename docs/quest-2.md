# Primera adaptación a Meta Quest 2

## Revisar ahora desde PC

Abre una clase y pulsa «Vista Quest en PC». Los paneles quedan colocados en el espacio y la mesa usa escala de metros: ancho 1,68 m y superficie a unos 0,90 m. «Pantalla completa» facilita revisar la distribución. Usa el ratón para los botones, componentes y terminales. Al pulsar un valor aparece un teclado numérico 3D. Las flechas del inspector mueven el componente sobre la mesa con límites.

Esta vista permite revisar geometría y funcionamiento; no emula el visor, la visión estereoscópica ni los mandos. «Volver a vista PC» recupera la cámara y conserva el circuito.

## Entrar desde las gafas

1. Publica la aplicación en Railway y abre su URL HTTPS desde el navegador de Quest. El servidor incluido sirve `dist/`; comandos: `npm ci && npm run build` y `npm start`. Esta adaptación no ha desplegado la aplicación.
2. Elige una clase o el modo libre. Se abre una pantalla de preparación sin narración ni simulación activa.
3. Pulsa «Iniciar clase» o «Iniciar simulación». Si la inicialización detectó soporte para `immersive-vr`, el mismo gesto solicita la sesión inmersiva. Acepta la solicitud del navegador. La clase comienza después de entrar. En PC, el botón solicita pantalla completa.
4. Si el acceso falla, la clase sigue esperando: reintenta o elige explícitamente «Continuar en esta ventana». «Entrar en VR» sigue disponible como control durante una simulación ya iniciada. Al cambiar de experiencia desde el catálogo espacial, también aparece un botón «Iniciar clase» dentro del entorno.

WebXR necesita un contexto seguro y una acción del usuario para entrar. El `localhost` del visor apunta al propio visor; no al PC donde se ejecuta Vite. Para la prueba inicial utiliza una URL HTTPS accesible desde las gafas.

## Controles dentro de la escena

- Apunta con cualquiera de los mandos y pulsa el gatillo para seleccionar componentes, botones y terminales.
- Para cablear, selecciona dos terminales en la mesa o en el inspector. La pestaña «Cables» permite eliminar conexiones.
- Pulsa el valor de una fuente o resistencia, introduce los números en el teclado 3D y pulsa «Aplicar». «Cancelar» recupera el valor anterior. También hay botones −/+.
- Las cuatro flechas del inspector permiten mover el elemento seleccionado sin arrastrarlo. El arrastre mediante rayo es complementario y debe verificarse en el dispositivo.
- La palanca izquierda activa el teletransporte a tres posiciones marcadas frente a la mesa. No hay desplazamiento continuo con WASD en modo inmersivo.
- «Volver al inicio» recupera la posición horizontal frente a la mesa; se conserva la altura de cabeza proporcionada por el visor.
- «Clases y modo libre» abre el catálogo 3D. Permite cambiar de experiencia o volver al circuito actual sin salir de VR.
- «Salir de VR» vuelve a la página y conserva el montaje. La finalización de la sesión desde el navegador también restaura el modo PC.

El guía, sus diálogos, narración, felicitaciones y controles permanecen dentro del espacio. Los mandos se representan con geometría sencilla y rayos de selección; no se descargan modelos de mandos. Esta fase utiliza mandos, sin seguimiento de manos.

## Verificación pendiente en Quest 2 real

La compilación, las pruebas del modelo y la vista de distribución se han comprobado en PC. No se ha comprobado una sesión WebXR en hardware real.

En la primera prueba con gafas hay que revisar:

- Entrada, salida y reentrada; altura de la mesa respecto al suelo y posición inicial.
- Legibilidad al girar la cabeza y comodidad de los paneles y del guía.
- Rayos y gatillos de ambos mandos, terminales, teclado numérico y flechas de movimiento.
- Teletransporte limitado a las tres posiciones y botón de regreso al inicio.
- Una clase completa de Ohm, la clase de paralelo y el cambio a modo libre desde el catálogo 3D.
- Narración tras pulsar «Escuchar», confirmaciones de paso y silencio.
- Fluidez con cuatro resistencias, cables y esferas de corriente; ajustar resolución o cantidad de partículas según la medición real.

El suelo virtual mide 4,8 × 4,8 m; los destinos de teletransporte están restringidos frente a la mesa. Esto limita la navegación virtual. El espacio físico lo gestiona el límite de seguridad del visor.

## Implementación

`quest-runtime.ts` gestiona WebXR, mandos, teletransporte, entrada/salida y vista de PC. `quest-interface.ts` contiene la navegación y el catálogo 3D. `quest-layout.ts` define escala y límites. El modelo eléctrico y las reglas de clase son compartidos entre PC y VR. Las coordenadas del circuito conservan su formato al guardar; la transformación a metros solo afecta a su representación.

Fuentes: [WebXR y contexto seguro (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/XRSystem/requestSession), [seguridad y permisos (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Permissions_and_security), [experiencia WebXR de Babylon.js](https://github.com/BabylonJS/Documentation/blob/master/content/features/featuresDeepDive/webXR/webXRExperienceHelpers.md).
