# Plan de la demo para una empresa de distribución eléctrica

Estado: **borrador, pendiente de aprobación del responsable.** Sustituye a [plan-demo.md](plan-demo.md), que queda como historial de la demo universitaria. Este documento es la fuente común de Claude Code (Sonnet 5.5) y Codex: qué se hace, por qué y quién lo hace.

## 1. Objetivo

La demo universitaria se aprobó. Ahora una empresa de distribución eléctrica evalúa la plataforma para capacitar a su personal. **Esta demo sirve para conseguir ese cliente.** El producto final arrancará de cero, con usuarios, organizaciones y funciones reales; nada de este código pasa al producto.

Lo que debe ver el cliente:

1. **Su propio trabajo:** redes de media y baja tensión, transformadores de poste, cortacircuitos, pértigas y EPP, no circuitos de aula.
2. **Seguridad sin riesgo:** practicar las maniobras y ver las consecuencias de un error sin que nadie salga herido.
3. **Gestión del personal:** cada técnico entra con su usuario, sigue la ruta de su cargo y su supervisor ve el avance y las constancias.

| Se prioriza | Se deja de lado |
| --- | --- |
| Lo que se ve en la presentación | Backend, base de datos y seguridad real |
| Realismo del equipo y del entorno | Refactorizar o preparar arquitectura |
| Que el guion funcione siempre | Casos que nadie verá |
| Pocas prácticas muy bien acabadas | Muchas prácticas a medias |

Se permite código repetido y valores fijos en el código si acortan el camino. Tres límites se mantienen:

- **Datos de demostración rotulados.** *(Cambio frente al plan anterior, que prohibía simular cuentas o progreso.)* Se permiten usuarios, cuadrillas y avances de ejemplo, siempre con el rótulo «Datos de demostración» visible. Lo que no funciona se rotula como «Concepto».
- **Contenido de seguridad revisado.** Todo texto o procedimiento de seguridad eléctrica lleva en pantalla «Contenido didáctico de demostración» y lo revisa una persona con criterio técnico, idealmente del cliente, antes de presentarlo.
- **Base estable:** `npm test` y `npm run build` pasan antes de integrar. No se desactivan pruebas para conseguirlo.

## 2. Supuestos mientras no haya respuesta

Estas preguntas siguen abiertas. Hasta que se respondan, el trabajo usa el supuesto indicado, elegido para que cambiarlo cueste poco.

| Pregunta | Supuesto de trabajo | Qué cambia con la respuesta |
| --- | --- | --- |
| Fecha de la demo | Unas tres semanas | Cuántas prácticas caben (sección 5) |
| País y normativa | Prácticas generales del sector: las cinco reglas de oro, sin citar una norma concreta | Nombres de equipos, distancias y la norma citada en las lecturas |
| Nombre y logo del cliente | Marca ficticia neutral, con espacio preparado para la suya | Una constante y un logo; nunca se usa su marca sin permiso |
| Formato | Pantalla grande, con VR en vivo si la prueba en Quest sale bien, y video de respaldo | Cuánto se invierte en VR |
| Público | Gerencia, salud y seguridad en el trabajo, y jefes de cuadrilla | El tono del guion y de las diapositivas |
| Experto que revisa | Pendiente de nombrar | Sin revisión, el contenido de seguridad no se presenta |

## 3. Guion propuesto (unos 10 minutos)

Lo que no aparece en el guion no se construye.

| Min | Momento | Qué demuestra |
| --- | --- | --- |
| 1 | Problema: accidentes, costo y riesgo de capacitar en campo (diapositivas) | Por qué invertir |
| 1 | Entrar como técnico: ruta de su cargo con prácticas asignadas | Capacitación por cargo |
| 1 | Lectura breve de las cinco reglas de oro | Teoría antes de la práctica |
| 4 | Práctica en un poste con transformador: hacerla bien y luego cometer un error a propósito (arco eléctrico y explicación) | Realismo y seguridad sin riesgo |
| 1 | Modo evaluación: puntaje y constancia | Certificación |
| 1 | Entrar como supervisor: avance de la cuadrilla, errores frecuentes y constancias por vencer | Lo que compra la empresa |
| 1 | Hoja de ruta y siguiente paso (diapositivas) | La decisión que se pide |

## 4. Tablero de tareas

Antes de empezar, cambia tu fila a «en curso». Estados: `pendiente`, `en curso`, `en revisión`, `hecha`. Prioridad: **A** imprescindible para el guion, **B** lo refuerza, **C** solo si sobra tiempo.

| ID | Tarea | Motivo | Agente | Prioridad | Estado | Depende de |
| --- | --- | --- | --- | --- | --- | --- |
| E0 | Aprobar plan, responder la sección 2 y cerrar el tablero anterior | Fija el alcance | Responsable | A | pendiente | — |
| E1 | Preparar la división: vistas, sesión de demo y resultados de práctica | Login, panel y laboratorios tocarían `main.ts` a la vez | Sonnet | A | pendiente | E0 |
| E2 | Login y usuarios de demostración | Entrada por cargo | Codex | A | pendiente | E1 |
| E3 | Rediseño del portal: rutas de capacitación e identidad del sector eléctrico | El portal actual se lee como campus universitario | Codex | A | pendiente | E1 |
| E4 | Kit 3D de distribución: poste, transformador, cortacircuitos, pértiga, EPP y entorno de calle | Base de realismo para todas las prácticas | Sonnet | A | pendiente | E1 |
| E5 | Práctica: cinco reglas de oro en un poste con transformador, con consecuencias del error | Centro del guion | Sonnet | A | pendiente | E4 |
| E6 | Panel del supervisor con datos de demostración | El argumento para quien paga | Codex | A | pendiente | E2, E3 |
| E7 | Modo evaluación y constancia | Convierte la práctica en certificación | Sonnet | B | pendiente | E5 |
| E8 | Lecturas de la ruta: riesgo eléctrico, cinco reglas, EPP y distancias, arco eléctrico, red de distribución | Teoría antes de la práctica | Quien termine antes | B | pendiente | E1 |
| E9 | Segunda práctica: cambio de fusible en cortacircuitos con pértiga | Muestra que el modelo escala | Codex | C | pendiente | E4 |
| E10 | Narración de prácticas y lecturas nuevas | Hoy solo electrónica habla | Sonnet | B | pendiente | E5, E8 |
| E11 | Desplegar por HTTPS, probar en Quest y grabar video de respaldo | WebXR exige HTTPS y nunca se probó en hardware real | Responsable + Sonnet | A | pendiente | E5, E6 |
| E12 | Diapositivas para la empresa | Las actuales son para la universidad | Sonnet | A | pendiente | E0 |

Si falta tiempo, se recorta en este orden: E9, E10, E8, E7. Nunca E5 ni E11.

### Alcance de E1

Es la única reorganización prevista y debe ser pequeña, sin cambiar lo que se ve hoy:

1. **Vistas separadas:** sacar de `main.ts` el portal y la sesión de laboratorio a `src/views/`, con un enrutador mínimo, para que login, portal y panel no editen las mismas líneas.
2. **Sesión de demostración:** `src/demo/` con el tipo de usuario (nombre, cargo, cuadrilla), la sesión activa en `localStorage` y la lista de usuarios de ejemplo.
3. **Resultados de práctica:** ampliar `LabContext` con una función para informar el resultado (pasos, errores, tiempo, aprobado) y guardarlo en el progreso de demostración, que leen el portal y el panel.

Las firmas concretas se registran en la bitácora al terminar E1. Hasta entonces, E2 a E9 no empiezan; E12 sí puede empezar.

### Alcance de E4 y E5

- **Modelos:** preferir modelos glTF con licencia libre (CC0 o CC-BY) frente a modelarlos. Cada modelo se anota con origen, autor y licencia en `docs/licencias-modelos.md`. Si ninguno sirve, se modela por código, como hasta ahora, pero con materiales y texturas.
- **Rendimiento:** presupuesto pensado para Quest 2. Si un modelo pesa demasiado, se simplifica antes de integrarlo.
- **Procedimiento:** reutilizar la lógica pura del laboratorio de bloqueo y etiquetado (pasos ordenados, intentos, errores explicados), con pruebas.
- **Error:** al saltar un paso crítico, por ejemplo poner a tierra sin verificar ausencia de tensión, la escena muestra el arco eléctrico con destello y sonido, se detiene y explica el riesgo. Sin imágenes de personas heridas.

### Qué toca cada tarea

| Tarea | Archivos propios | No tocar |
| --- | --- | --- |
| E1 | `main.ts`, `src/views/`, `src/demo/`, `src/labs/types.ts`, `src/labs/host.ts` | Se hace sola, sin otras tareas en curso |
| E2 | `src/demo/login*`, CSS del login | `src/labs/` |
| E3 | `template.ts`, CSS del portal, `platform-art.ts`, `subject-art.ts`, `src/views/portal*`, `subjects.ts` | `src/labs/`, `src/demo/` salvo lectura |
| E4 | `src/labs/distribucion-kit/`, `public/models/`, `docs/licencias-modelos.md` | Laboratorios existentes |
| E5 | `src/labs/cinco-reglas/`, `src/content/distribucion-practicas.ts` | Kit de E4 sin coordinar |
| E6 | `src/views/supervisor*`, `src/demo/datos-ejemplo.ts` | `src/labs/` |
| E7 | Modo evaluación dentro de `src/labs/cinco-reglas/` y la constancia en `src/views/constancia*` | Panel de E6 |
| E8 | `src/content/distribucion-lecturas.ts` y sus dibujos | Archivos de E5 |
| E9 | `src/labs/cortacircuitos/` | Kit de E4 sin coordinar |
| E10 | `public/audio/`, `narration-manifest.json`, `scripts/generate-narration.mjs` | — |

**Archivos compartidos:** `subjects.ts` (de E3 durante esta fase), `src/labs/registry.ts`, `src/learning-content.ts`, `package.json` y `package-lock.json`. Solo admiten cambios mínimos, como añadir una línea a un registro. Si necesitas más, anótalo en la bitácora. No se añaden dependencias sin una razón escrita.

**Qué pasa con lo actual:** electrónica se mantiene como «Fundamentos eléctricos». Bloqueo y etiquetado queda en la ruta como práctica complementaria. Mecánica, fluidos y el torno salen del catálogo de esta demo; el código queda, sin enlazarse.

## 5. Fases

| Fase | Trabajo | Puede empezar cuando |
| --- | --- | --- |
| 0 | E0 y el esquema de E12 | Ya |
| 1 | E1 | E0 aprobada |
| 2 | En paralelo: Codex E2 → E3 → E6; Sonnet E4 → E5 → E7 | E1 integrada |
| 3 | E8, E9 y E10 según el tiempo | Terminada cada dependencia |
| 4 | E11, cierre de E12 y ensayo completo | E5 y E6 integradas |

## 6. Reglas de coordinación

Siguen vigentes las de [plan-demo.md](plan-demo.md#5-reglas-de-coordinación): una carpeta y una rama por tarea desde `origin/main` (`claude/eN-nombre` o `codex/eN-nombre`), aviso en el tablero y en la [bitácora](bitacora.md) antes de empezar, PR pequeños y no editar archivos ajenos. La voz sigue siendo Dalia y los audios los genera solo E10.

### Para dar una tarea por terminada

- `npm test` y `npm run build` pasan.
- Su tramo del guion funciona en el navegador, sin errores en consola.
- Si cambió algo visible, hay captura en el PR.
- La bitácora registra qué se hizo, por qué, qué archivos tocó y qué quedó pendiente.

Sin hardware real, indica «no probado en Quest». No des por validado lo que no se ha probado.
