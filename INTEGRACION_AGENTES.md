# Umbral Labs — Guía de integración para agentes

Actualizado: 6 de noviembre de 2026. Estado: demo funcional de electrónica, con adaptación inicial a WebXR.

**El trabajo en curso, su reparto y sus prioridades están en [docs/plan-demo.md](docs/plan-demo.md).** Si choca con esta guía en lo referente a arquitectura o refactorización, manda el plan.

Este documento es la referencia técnica para un agente que se incorpore al repositorio. Describe el código existente y propone una evolución hacia múltiples laboratorios. **Las secciones de arquitectura propuesta no describen funcionalidades ya implementadas.** Antes de modificar, contrasta esta guía con los archivos y las pruebas de la revisión que recibiste.

## 1. Objetivo del producto y alcance de esta entrega

La demo servirá para presentar a una universidad un proyecto de digitalización de laboratorios. La visión es que la institución pueda ofrecer experiencias a sus estudiantes, empresas y universidades externas. Debe mostrar una plataforma educativa coherente, con varias disciplinas, clases guiadas y experimentación libre.

Las disciplinas y prácticas adicionales todavía están por definir. No inventar un catálogo aprobado ni implementar módulos ajenos al encargo recibido. Este documento prepara su integración; no convierte la demo en una plataforma institucional de producción.

Principios de experiencia:

- PC es la base de desarrollo y validación actual. Mantener compatibilidad con Meta Quest 2 mediante navegador y WebXR.
- Aprovechar el espacio 3D para instrumentos, controles, gráficas, guía y diálogos. Las acciones esenciales deben poder realizarse dentro de la escena, sin depender de paneles HTML en VR.
- Dos modos: clase guiada con objetivos y confirmaciones; modo libre con el mismo modelo físico y herramientas.
- Español para principiantes: explicar conceptos, nombrar los controles visibles y señalar qué resultado observar.
- Presentar como disponibles únicamente las funciones implementadas. Cuentas, pagos, licencias, administración institucional y acceso de organizaciones externas son posibilidades futuras, no capacidades actuales.

## 2. Puesta en marcha y herramientas

Ejecutar desde la raíz de este repositorio, la carpeta `laboratorio-vr`:

```sh
npm ci
npm run dev
```

Vite anuncia la URL local; normalmente `http://localhost:5173/`. Se necesita un navegador con WebGL. El entorno de desarrollo usado hasta ahora tiene Node 26 y npm 11; no hay una versión mínima declarada en `package.json`. Si usas otro entorno, comprueba compatibilidad con las versiones fijadas en `package-lock.json`.

```sh
npm test
npm run build
npm run preview
```

`npm test` ejecuta las pruebas TypeScript con `tsx` y el ejecutor de Node. `build` comprueba tipos y genera `dist/`. `preview` permite revisar la compilación. Para comprobar el servidor de despliegue, después de compilar, usa `npm start` (puerto `PORT`, o 4173 por defecto).

Tecnologías actuales: TypeScript estricto, HTML/CSS, Vite 7 y Babylon.js 8. No hay React, base de datos, API de negocio ni servicio de IA durante la ejecución. Node sirve archivos estáticos mediante `server.mjs`; no calcula la simulación. No reemplazar el stack ni actualizar dependencias sin una necesidad concreta del encargo. Conservar el archivo de bloqueo.

## 3. Mapa de la arquitectura actual

| Archivo o directorio | Responsabilidad y límites |
| --- | --- |
| `src/main.ts` | Entrada y coordinación: estado activo, escena, geometría de componentes, interacciones, navegación, clases y sincronización de las interfaces. Todavía concentra responsabilidades. |
| `src/template.ts` | Estructura HTML del catálogo y controles alternativos accesibles. Sus selectores se usan desde `main.ts`. |
| `src/style.css`, `atlas-theme.css`, `spatial-layout.css` | Estilos base, tema Atlas del portal y distribución/contraste del visor. `cloud-theme.css` conserva el tema anterior y ya no se importa. Revisar la cascada antes de añadir reglas globales. |
| `src/circuit.ts` | Contratos `Part`, `Wire`, `Circuit`, `Result`; validación, conexiones, ejemplos y cálculo resistivo. Independiente del DOM y Babylon. |
| `src/led-solver.ts` | Modelo eléctrico didáctico del LED y resolución de redes que lo incluyen. |
| `src/wire-routing.ts` | Curvas y desvíos visuales de los cables; no define conectividad eléctrica. |
| `src/wire-flow.ts`, `current-animation.ts` | Reparto de corriente por conexión y esferas amarillas que siguen los recorridos. |
| `src/circuit-charts.ts` | Monitor 3D con barrido I–V y caídas de tensión. No es un historial temporal. |
| `src/class-engine.ts` | Tipos de clase y objetivo, comprobación de metas, registro de acciones y sesiones en memoria. Está acoplado a `Circuit` y `solve`. |
| `src/classes/`, `src/lessons.ts` | Contenido de clases, asociación `laboratoryId` y registro educativo. |
| `src/laboratories.ts` | Registro de laboratorios y catálogo compartido de dos niveles para PC y VR: bienvenida/laboratorios → clases/modo libre. |
| `src/spatial-controls.ts` | Banco, inspector, conexiones y edición numérica dentro de la escena. Actualmente son herramientas de electrónica. |
| `src/spatial-guide.ts`, `step-confirmation.ts` | Avatar, diálogo, progreso, pistas y confirmación al completar actividades. |
| `src/narration.ts`, `public/audio/` | Reproducción de narraciones y confirmaciones; archivos MP3 y manifiesto. |
| `src/start-presentation.ts` | Solicitud de VR o pantalla completa desde el gesto de inicio; distingue acceso concedido y rechazado. |
| `src/navigation.ts` | Desplazamiento acotado con WASD en PC. |
| `src/quest-runtime.ts`, `quest-interface.ts`, `quest-layout.ts` | Entrada/salida WebXR, mandos, catálogo espacial, teletransporte, vista previa y transformaciones. |
| `scripts/generate-narration.mjs` | Generación de audios antes del despliegue; no se ejecuta en el navegador ni en Railway. |
| `src/*.test.ts` | Pruebas del modelo, clases, narración, navegación, rutas y adaptación espacial. |
| `server.mjs`, `index.html` | Servidor estático y entrada web. `dist/` se genera, no se edita. |

Flujo principal:

```text
Ratón / teclado / mandos
          ↓
Acción sobre el estado del circuito
          ↓
Validación y cálculo eléctrico
          ↓
Lecturas, componentes, gráficas y corriente animada
          ↓
Comprobación del objetivo pendiente
          ↓
Indicación del guía o confirmación → siguiente paso
```

La geometría es una representación del estado, no la fuente de verdad del modelo físico. No deducir conectividad de la proximidad de mallas ni de que dos cables se crucen visualmente.

## 4. Contratos existentes que se deben preservar

### Circuito y unidades

```ts
interface Part {
  id: string;
  kind: 'source' | 'resistor' | 'switch' | 'led';
  value: number;
  closed?: boolean;
  x: number;
  z: number;
}
interface Wire { id: string; a: string; b: string }
interface Circuit { parts: Part[]; wires: Wire[] }
```

Los terminales tienen formato `ID:0` y `ID:1`. En la fuente son positivo y negativo; en el LED, ánodo y cátodo. Los cálculos usan voltios, amperios, ohmios y vatios; los mA son una conversión de presentación. Preservar el signo de las lecturas internas aunque el inspector muestre magnitudes.

El modelo admite una fuente ideal de 1–12 V, resistencias de 10–1000 Ω, interruptores y hasta cuatro LED; el límite global es ocho componentes y 32 cables. La interfaz limita a cuatro resistencias. `validate` y los controles no son intercambiables: validar también los datos recuperados del almacenamiento.

En cortocircuito se bloquean las mediciones: el resultado con corriente cero no representa la corriente física real de una fuente cortocircuitada. El LED usa `V = 2 V + I × 20 Ω` al conducir; es una aproximación educativa. No hay transitorios, temperatura, destrucción ni tolerancias. Documentar supuestos y rangos de cualquier modelo nuevo y comprobarlo con casos conocidos.

### Coordenadas, selección y cableado

Las posiciones guardadas son locales a la mesa. `labRoot` aplica escala y altura de VR; `tableRoot` aplica la inclinación de 40°. Componentes, terminales, cables y partículas comparten esa transformación; el monitor permanece vertical. La escala actual de VR es 0,15 y la referencia de altura de mesa es 0,90 m. No almacenar posiciones transformadas a coordenadas mundiales.

El arrastre convierte desplazamientos al espacio local y limita posiciones a X ±4,35 y Z ±2,35. `validate` tolera X ±5 y Z ±3 en montajes guardados; no confundir el rango de edición con el de validación.

Conservar contorno de selección contrastante, señales de la acción pendiente y botones con fondo legible. Al mover un componente se recalculan los recorridos de todos los cables y las partículas usan esos mismos recorridos. Las curvas deben terminar en los terminales y evitar bases cuando haya paso libre; superponer dispositivos puede ocultar sus propios terminales.

### Sesiones y almacenamiento

- `SessionStore` guarda copias del circuito, selección, paso, inspecciones y finalización en memoria, con claves `class:<id>` y `free`.
- Cambiar al menú y volver conserva la sesión; recargar la página la reinicia. «Empezar desde el principio», en la preparación de una clase con sesión, borra solo la sesión de esa clase.
- Guardar/Recuperar usa `localStorage['umbral-circuit-v1']` para un solo montaje. No guarda progreso docente ni sincroniza dispositivos.
- No cambiar esa clave ni el formato sin una estrategia explícita de compatibilidad. Otros laboratorios deberán usar claves propias y formatos versionados; nunca interpretar datos de fluidos como un `Circuit`.

### Clase, guía y voz

Una clase actual es un `LabClass`: `laboratoryId` (`electronics`, o `null` para la bienvenida), ID estable, título, descripción, duración, nivel, ejemplo inicial, selección inicial y pasos. Cada paso incluye título, explicación, tarea, audio, confirmación `success`, ejemplo de recuperación y objetivos. Puede incluir `setup: Circuit` para cargar un reto específico.

Las metas actuales son `value`, `closed`, `measurement`, `inspect`, `action` y `diagnose`. Se evalúan en orden; la primera pendiente dirige las indicaciones. `diagnose` compara los nodos eléctricos e ignora posición, dirección e ID del cable y la orientación de resistencias e interruptores; la fuente y los LED conservan su polaridad. Las acciones del tutorial solo se registran cuando están pendientes; reconectar exige restaurar los extremos desconectados.

Un paso sin metas es informativo. No felicitar por cargar una sesión ya resuelta. Confirmar la transición a una actividad cumplida una vez por paso, respetar silencio y volver a la indicación pendiente si se invalida el resultado. Avanzar no debe ocurrir simplemente por reproducir el audio.

Clases existentes: `primeros-pasos`, `ley-de-ohm`, `circuitos-en-paralelo`, `encuentra-el-fallo`, `enciende-un-led`. Conservar IDs y comportamiento. Para añadir electrónica, ver [docs/adding-classes.md](docs/adding-classes.md).

La voz principal son MP3 locales de Dalia (`es-MX-DaliaNeural`, ritmo −5 %; los archivos conservan su nombre histórico `salome-*`); la síntesis del navegador es respaldo si falla una grabación. El avatar anima su boca al reproducir, sin sincronización fonética. Cambiar título, explicación, tarea o confirmación requiere actualizar sus audios y el manifiesto:

```sh
node --import tsx scripts/generate-narration.mjs
```

La preparación requiere Python con `edge-tts==7.3.1`, acceso a Internet y `ffprobe`; admite `TTS_PYTHON`, `TTS_VOICE` y `TTS_RATE`. Cada narración y confirmación necesita ruta única `/audio/nombre.mp3`. Las pruebas comprueban archivos y hashes del texto en `narration-manifest.json`. No falsear hashes ni reutilizar una grabación con texto distinto para hacer pasar pruebas. Si falta acceso al generador, informar qué contenido queda pendiente.

## 5. PC, Quest y formato visual común

Al abrir una experiencia, mantener la pantalla de preparación sin narración. `currentView` distingue `menu`, `ready` y `lab`. Solo «Iniciar clase» / «Iniciar simulación» debe solicitar VR o pantalla completa y activar escena y voz; no añadir audio en la apertura del catálogo o la preparación. La detección se prepara antes del clic para conservar el gesto de usuario de WebXR/pantalla completa. Una denegación mantiene la espera y ofrece reintento o continuación explícita en ventana. Dentro de VR, la preparación se presenta en el catálogo 3D.

Mantener el tema Atlas: fondo crema, acentos terracota, títulos editoriales serif, navegación horizontal, búsqueda y catálogo en lista. La preparación de clase muestra información e ilustración a la izquierda y el inicio manual a la derecha; se apila en pantallas pequeñas. `platform-art.ts` genera ilustraciones SVG locales con IDs únicos, independientes de la escena. Dentro del laboratorio, priorizar el experimento y los controles espaciales con contraste suficiente. El guía debe seguir compacto y ampliable, sin ocupar todo el ancho ni tapar el montaje. No imponer la mesa inclinada a una disciplina que necesite otra geometría: esa decisión pertenece al laboratorio correspondiente.

Los controles HTML alternativos deben conservarse para teclado y accesibilidad, conectados a las mismas acciones que los controles 3D. No crear dos versiones del modelo físico para PC y Quest. No introducir acciones esenciales dependientes exclusivamente de hover, teclado físico o una ventana HTML.

WebXR exige contexto seguro y acción del usuario. La integración actual ofrece rayos y gatillos de ambos mandos, edición numérica 3D y teletransporte a tres posiciones; no hay seguimiento de manos. La vista Quest en PC revisa distribución, no emula un visor. **La interacción y el rendimiento en Quest 2 real están pendientes de validación.** Ver [docs/quest-2.md](docs/quest-2.md).

Evitar recursos pesados y descargas innecesarias; liberar mallas, materiales, texturas, observadores y audio al abandonar una experiencia. El paquete actual ya genera una advertencia por tamaño: no afirmar que existe un presupuesto de rendimiento validado en las gafas. Medir antes de fijar objetivos o prometer fluidez.

## 6. Evolución propuesta hacia múltiples laboratorios

### Separar laboratorio, clase y modo

Un **laboratorio** aporta un modelo físico, instrumentos, estado y representación propios. Una **clase** define un recorrido educativo dentro de ese laboratorio. El **modo libre** utiliza sus herramientas sin imponer ese recorrido.

Actualmente `LabClass`, `Goal`, `SessionStore`, los paneles y `main.ts` están orientados a electrónica. Registrar una clase de fluidos en `lessons.ts` no añade un simulador de fluidos. No extender `Circuit.kind` con válvulas o masas ni introducir condiciones por disciplina dentro de `solve`.

La evolución recomendada es un núcleo común de navegación, sesión, guía y adaptación de dispositivo, conectado a módulos independientes por disciplina. Una organización objetivo posible, **todavía no existente**, es:

```text
src/
  app/                     # Catálogo y coordinación de la experiencia activa
  core/                    # Contratos, sesiones, acciones y recorrido educativo
  shared/                  # Guía, audio y utilidades realmente reutilizables
  devices/                 # Adaptadores PC y WebXR
  labs/
    electronics/           # Modelo, escena, herramientas y clases existentes
    <laboratorio-id>/      # Modelo, escena, herramientas, clases y pruebas nuevas
```

No mover todos los archivos de golpe para alcanzar esta estructura. Extraer por etapas, conservando importaciones compatibles cuando sea útil y verificando electrónica tras cada extracción.

### Contrato mínimo que deben acordar los agentes antes de integrar otra disciplina

| Área | Acuerdo necesario |
| --- | --- |
| Identidad y catálogo | `labId` estable; clases vinculadas explícitamente a su laboratorio; registro compartido por catálogo web y espacial. |
| Estado | Tipo propio por laboratorio; creación inicial, validación, copia, serialización y versión de esquema. |
| Acciones | Operaciones de dominio usadas tanto desde PC como desde VR; cambios notificables para actualizar guía y lecturas. |
| Simulación | Entradas, salidas, unidades, supuestos, rangos y tratamiento de errores. Si es temporal, avance por tiempo transcurrido, independiente de los fotogramas. |
| Aprendizaje | Evaluación de metas e indicaciones adaptadas a la disciplina, manteniendo progreso, pistas y confirmaciones comunes. |
| Escena | Montaje, actualización, pausa, reanudación y destrucción explícitos, con propiedad clara de los recursos. |
| Dispositivo | Cambio PC/VR sin perder el estado; controles esenciales disponibles en el espacio. |
| Persistencia | Claves separadas por laboratorio y clase; validación y migración cuando cambie el formato. |

Estos son requisitos de diseño, no una API ya exportada. Antes de desarrollar en paralelo, registrar en este documento o en una propuesta enlazada las firmas concretas, su responsable y su estado de implementación. El registro de navegación `src/laboratories.ts` y la asociación `LabClass.laboratoryId` ya existen. La bienvenida se abre desde el inicio; las cuatro clases de electrónica y su modo libre se abren dentro de ese laboratorio. Esto organiza el catálogo, pero no incorpora un cargador de simuladores ni un motor pedagógico genérico: `openLab`, las sesiones del modo libre y el runtime todavía son de electrónica. No registrar otra disciplina como disponible hasta integrar su runtime y separar su persistencia.

Secuencia de integración recomendada:

1. Acordar una práctica breve, su disciplina, objetivos, parámetros y resultados esperados.
2. Definir los contratos compartidos y encapsular electrónica detrás de ellos sin alterar su comportamiento.
3. Construir el modelo del nuevo laboratorio aislado de Babylon y comprobar sus resultados.
4. Añadir escena y herramientas propias reutilizando guía, narración y adaptadores donde sus contratos lo permitan.
5. Integrar catálogo, sesiones, modo libre y una clase guiada corta. Asegurar el cambio de ida y vuelta entre laboratorios sin residuos ni pérdida de sesión.
6. Verificar PC y vista Quest; documentar por separado las pruebas pendientes en hardware real.

El acceso institucional, roles, informes, licencias y oferta a terceros necesitarán decisiones de producto y servicios adicionales. La demo puede comunicar esa visión, pero no introducir autenticación ficticia ni afirmar aislamiento entre instituciones sin implementarlo.

## 7. Coordinación entre agentes y cambios seguros

Antes de trabajar:

1. Leer esta guía, `README.md` y la documentación específica; revisar `git status` y los cambios existentes.
2. Identificar la revisión base o commit compartido. Usar una rama por entrega (prefijo recomendado `codex/` para trabajo de Codex) o parches con una base identificada. Si los agentes están en máquinas distintas, verificar que reciben también los audios y el archivo de bloqueo.
3. Acordar alcance, archivos propios, archivos compartidos y responsable de integración. No sobrescribir cambios ajenos ni restaurar el repositorio completo.
4. Ejecutar las comprobaciones de referencia y registrar fallos previos antes de atribuirlos a la entrega.

Archivos con alto riesgo de conflicto: `main.ts`, `template.ts`, `lessons.ts`, `class-engine.ts`, estilos globales, `package.json`, `package-lock.json` y el manifiesto de narración. Evitar ediciones simultáneas sin coordinar. Preferir que cada agente prepare su módulo y una modificación pequeña del registro; un integrador aplica los cambios compartidos. No duplicar listas de clases en PC y Quest.

No editar `node_modules/` ni `dist/`, desactivar pruebas, retirar validaciones ni resolver conflictos borrando funcionalidades. No cambiar selectores HTML usados por el código sin actualizar sus consumidores. No añadir secretos al frontend; las variables `VITE_*` son públicas en la aplicación compilada. Los textos y metadatos deben insertarse como texto, no como HTML arbitrario.

Para los módulos nuevos, usar IDs estables en minúsculas y guiones, nombres descriptivos, tipos explícitos y unidades documentadas. Mantener el idioma visual y narrativo del producto. No añadir dependencias, servicios externos o cambios de despliegue por conveniencia sin explicar su necesidad y efectos.

## 8. Verificación y criterios de entrega

Por cada cambio funcional, ejecutar `npm test` y `npm run build`. Añadir pruebas relevantes para modelos físicos, metas, formatos guardados o contratos nuevos; no crear pruebas que solo repitan detalles visuales de implementación. Una entrega solo documental requiere revisar enlaces y exactitud, sin necesidad de reconstruir la aplicación.

Lista de revisión manual para una integración de laboratorio:

- Inicio, búsqueda, filtros y apertura de las cinco clases existentes y modo libre.
- Una clase completa: indicación del elemento correcto, edición, validación, confirmación una sola vez, avance y regreso al menú.
- Retos con montaje propio: reparación, pistas, reinicio y reanudación de sesión.
- LED, serie y paralelo: lecturas coherentes, selección visible y gráficas actualizadas.
- Cableado: conectar, cancelar, eliminar, mover componentes y observar curvas y corriente.
- Guardar/Recuperar: montaje anterior compatible y datos inválidos rechazados.
- Teclado, WASD limitado, pantalla completa, controles alternativos, audio, silencio y guía compacta.
- Vista Quest en PC: controles espaciales, catálogo y regreso a PC con estado conservado.
- Laboratorio nuevo: entrada, salida, pausa y reentrada; cambio entre disciplinas sin escenas, audio o controles duplicados; sesiones separadas.
- Revisar errores de consola y guardar evidencia visual de cambios de interfaz. Indicar qué se probó en PC y qué sigue pendiente en Quest real.

No hace falta repetir toda la revisión manual para una corrección localizada; seleccionar casos relacionados y ampliar cuando cambien componentes compartidos.

Cada entrega del otro agente debe incluir: revisión base, propósito, archivos modificados, contratos añadidos o cambiados, comandos de comprobación y resultados, pasos para reproducir la práctica, capturas si cambia la interfaz, nuevos recursos/dependencias y limitaciones pendientes. Entregar código fuente y recursos necesarios, no solo una carpeta compilada.

## 9. Despliegue y referencias

El usuario dispone de dominio y Railway. Configuración prevista: raíz del servicio en esta carpeta, compilación `npm ci && npm run build`, inicio `npm start`; `server.mjs` escucha en `0.0.0.0` y usa `PORT`. Se necesita HTTPS accesible para probar desde las gafas: `localhost` en Quest apunta al visor, no al PC. La documentación de configuración no acredita un despliegue activo ni autoriza cambios de infraestructura fuera de una tarea que los solicite.

Referencias del repositorio:

- [README: ejecución, modelo y funcionalidades](README.md). Algunas secciones históricas describen etapas anteriores; para el catálogo vigente consultar `src/lessons.ts`.
- [Añadir clases de electrónica](docs/adding-classes.md).
- [Adaptación y revisión en Quest 2](docs/quest-2.md).
- [Contratos educativos actuales](src/class-engine.ts) y [registro de clases](src/lessons.ts).
- [Modelo eléctrico](src/circuit.ts) y [modelo LED](src/led-solver.ts).

Mantener esta guía actualizada cuando se implementen los contratos entre laboratorios. Registrar qué partes propuestas pasan a existir, sus rutas y sus limitaciones para que el siguiente agente no trabaje sobre supuestos.

### Portal académico y contenido previo (noviembre 2026)

El portal web sigue **Inicio → Materia → Clase (lectura) → Preparación → Simulación**. El tutorial de bienvenida y el modo libre acceden directamente a preparación. La voz y la simulación solo comienzan al pulsar iniciar, conservando la solicitud de pantalla completa/VR.

- `src/subjects.ts`: materias, estado disponible/en preparación y laboratorios que pertenecen a cada materia. Una materia puede agrupar varios laboratorios.
- `src/learning-content.ts`: lectura por clase, con secciones, ejemplo y destino `runtimeClassId`. No modificar los pasos ni el audio de la simulación para editar una lectura.
- `src/subject-art.ts`: ilustraciones del catálogo. `src/subjects-theme.css`: presentación académica, bandas claras/naranjas y lectura adaptable.
- Para añadir una clase operativa, registrarla en el motor existente y añadir su lectura con el mismo identificador. Para una propuesta futura, usar `runtimeClassId: null` y registrarla en `previewContentIds` de una materia en preparación. Su botón de simulación permanece deshabilitado: nunca conectarla por defecto al motor de electrónica.
- `src/laboratories.ts` sigue siendo el registro de simulaciones y el catálogo espacial de Quest. Las lecturas del portal se consultan antes de entrar al entorno inmersivo; el catálogo dentro de VR conserva el acceso directo a las prácticas disponibles.
- Las sesiones, identificadores de clase, montajes guardados y grabaciones siguen usando sus contratos existentes. La lectura es informativa y no crea un progreso persistente ni un requisito de aprobación.
