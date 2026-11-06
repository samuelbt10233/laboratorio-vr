# Plan de la demo

Estado: **aprobado por el responsable del proyecto el 2026-11-06.** Este documento es la fuente común de Claude Code y Codex: define qué se hace, por qué y quién lo hace.

## 1. Objetivo

Umbral Labs busca ser una plataforma educativa para educación superior y empresas: capacitación teórica y práctica, incluidos manejo de maquinaria y física, para virtualizar los laboratorios de una universidad y ofrecer clases o material de apoyo a la propia institución y a entidades externas.

**Esta demo sirve para conseguir la aprobación del proyecto.** Si se aprueba, el código arrancará de cero. Por eso:

| Se prioriza | Se deja de lado |
| --- | --- |
| Lo que el cliente ve durante la presentación | Refactorizar o preparar arquitectura para el futuro |
| Que el guion funcione siempre, sin fallos | Casos que nadie verá en la presentación |
| Una apariencia creíble, parecida a un laboratorio real | Pruebas de detalles visuales |
| Mostrar amplitud: universidad y empresa | Modelos físicos exhaustivos |

Se permite código repetido o valores fijos en el código si acortan el camino. Dos límites se mantienen:

- **Honestidad ante el cliente:** lo que no funciona se rotula como «Concepto». Sin cuentas, pagos ni progreso simulados como si fueran reales.
- **Base estable:** `npm test` y `npm run build` deben pasar antes de integrar. No se desactivan pruebas para conseguirlo.

Donde [INTEGRACION_AGENTES.md](../INTEGRACION_AGENTES.md) pida preparar contratos o arquitectura a largo plazo, manda este plan. Sus contratos de datos y narración siguen vigentes.

## 2. Flujo de trabajo

Cambios frente al flujo inicial (definir materias → frontend → estética → contenido → diapositivas):

| Cambio | Motivo |
| --- | --- |
| **Nuevo: guion de la demo, al principio** | Decide qué merece esfuerzo. Lo que no aparece en el guion no se construye. |
| **Nuevo: preparar la división antes de paralelizar** | Hoy casi todo pasa por `main.ts` y por listas únicas. Sin este paso, los dos agentes chocarían aunque sus temas sean distintos. |
| **Frontend, estética y contenido en paralelo** | Tocan zonas distintas una vez hecha la preparación, y ninguna depende del resultado de otra. |
| **Las diapositivas empiezan pronto** | El esquema orienta la demo. Al final solo se añaden capturas y cifras. |
| **Nuevo: despliegue y ensayo, antes de presentar** | WebXR exige HTTPS y nada se ha probado aún en unas Quest reales. Un video de respaldo protege la presentación. |

| Fase | Trabajo | Puede empezar cuando |
| --- | --- | --- |
| 0 | Guion de la demo y esquema de diapositivas | Ya |
| 1 | Aprobar materias y clases | Ya |
| 2 | Preparar la división del código (T2) | Fase 1 aprobada |
| 3 | En paralelo: portal, estética del laboratorio, contenido y laboratorios nuevos | T2 integrada |
| 4 | Integrar y generar audios | Terminada cada pieza |
| 5 | Desplegar por HTTPS, probar en Quest y grabar el video de respaldo | Fase 4 |
| 6 | Cerrar diapositivas y ensayar | Fase 5 |

### Guion propuesto (unos 8 minutos)

| Min | Momento | Qué demuestra |
| --- | --- | --- |
| 1 | Visión y problema (diapositivas) | Para qué existe la plataforma |
| 1 | Portal: materias de universidad y de empresa | Amplitud del catálogo |
| 3 | Ley de Ohm: lectura → laboratorio guiado con voz | El recorrido enseñanza → práctica |
| 2 | Capacitación industrial en VR (o video) | Oferta a empresas y uso de gafas |
| 1 | Cierre: hoja de ruta y siguiente paso (diapositivas) | La decisión que se pide al cliente |

## 3. Materias y clases recomendadas

**La mayor carencia actual es la oferta a empresas:** la síntesis del proyecto menciona empresas y maquinaria, y el catálogo no muestra nada de eso. Por eso se propone una materia industrial por delante de ampliar física.

Niveles: **Completa** (laboratorio con varias clases), **Práctica corta** (una clase con laboratorio propio y sencillo), **Concepto** (lectura e ilustración, rotulado, sin laboratorio).

| Materia | Público | Clase | Nivel | Laboratorio | Esfuerzo |
| --- | --- | --- | --- | --- | --- |
| Electrónica | Universidad | Las cuatro actuales y Primeros pasos | Completa | Existente, con mejor estética | Solo estética |
| Capacitación industrial | Empresa | Bloqueo y etiquetado de una máquina antes de su mantenimiento | Práctica corta | Procedimiento en orden: avisar, apagar, aislar, bloquear, liberar energía, verificar | Medio |
| Mecánica de fluidos | Universidad | Presión y prensa hidráulica | Práctica corta | Cambiar fuerza y áreas, y observar la fuerza de salida (`F2 = F1 · A2 / A1`) | Medio |
| Mecánica | Universidad | Péndulo simple | Concepto; práctica corta si sobra tiempo | `T = 2π√(L/g)` | Bajo |
| Mecánica de fluidos | Universidad | Caudal y Bernoulli | Concepto | Ninguno | Bajo |
| Capacitación industrial | Empresa | Puesta en marcha segura de un torno | Concepto | Ninguno | Bajo |

Orden si falta tiempo: industrial → prensa hidráulica → péndulo. Dos prácticas nuevas bien acabadas pesan más que cinco a medias.

El contenido de seguridad industrial es didáctico. Debe indicarlo en pantalla y pasar por una persona con criterio técnico antes de presentarse.

### Decisiones pendientes

La tabla anterior y el reparto de la sección 4 están aprobados. Siguen abiertas estas preguntas, que pueden ajustar el alcance:

1. **¿Qué laboratorios reales tiene la universidad?** Lo ideal es incluir al menos uno que reconozca como suyo.
2. **Fecha de presentación y público:** determinan cuántas prácticas son viables.
3. **¿Habrá VR en vivo?** ¿Hay unas Quest 2 disponibles para ensayar?

## 4. Tablero de tareas

Antes de empezar, cambia tu fila a «en curso». Estados: `pendiente`, `en curso`, `en revisión`, `hecha`.

| ID | Tarea | Motivo | Agente | Estado | Depende de |
| --- | --- | --- | --- | --- | --- |
| T0 | Guion y esquema de diapositivas | Fija el alcance | Responsable + Claude Code | en revisión | — |
| T1 | Aprobar el catálogo | Define qué se construye | Responsable | hecha | — |
| T2 | Preparar la división del código | Evita cruces en la fase 3 | Claude Code | hecha | T1 |
| T3 | Nuevo diseño del portal | Primera impresión del cliente | Codex | hecha | T2 |
| T4 | Estética de laboratorio real en circuitos | Credibilidad ante el cliente | Claude Code | hecha | T2 |
| T5 | Lecturas de electrónica | Reforzar enseñanza → práctica | Codex | en revisión | T2 |
| T6 | Laboratorio de capacitación industrial | Demostrar la oferta a empresas | Claude Code | hecha | T2 |
| T7 | Laboratorio de prensa hidráulica | Demostrar otra disciplina | Codex | pendiente | T2 |
| T8 | Lecturas y tarjetas de «Concepto» | Mostrar amplitud | Quien termine antes | hecha | T2 |
| T9 | Generar audios e integrar el manifiesto | Tiene un solo responsable para evitar conflictos | Claude Code | pendiente | T5–T8 |
| T10 | Desplegar por HTTPS y probar en Quest | Requisito de WebXR y de la presentación | Responsable + Claude Code | pendiente | T9 |
| T11 | Diapositivas finales y video de respaldo | Presentación y plan B | Claude Code | pendiente | T10 |

### Alcance de T2

Es la única reorganización del código prevista, y debe ser pequeña. Tres cambios, sin alterar el comportamiento actual:

1. **Separar la estética:** mover la geometría de la mesa y los componentes de `main.ts` a `src/lab-art.ts`, para que T3 y T4 no editen las mismas líneas.
2. **Separar el contenido:** dividir `learning-content.ts` en un archivo por materia dentro de `src/content/`.
3. **Crear el punto de entrada de los laboratorios nuevos:** cada uno vive en `src/labs/<id>/`, se abre con `mount` y se cierra con `unmount`, y `main.ts` solo añade una línea para abrirlo.

Las firmas concretas se registrarán en la bitácora al terminar T2. Hasta entonces, T3 a T8 no empiezan.

### Qué toca cada tarea

| Tarea | Archivos propios | No tocar |
| --- | --- | --- |
| T2 | `main.ts`, `learning-content.ts`, `src/content/`, `src/labs/`, `src/lab-art.ts` | Se hace sola, sin otras tareas en curso |
| T3 | `template.ts`, `*-theme.css`, `style.css`, `platform-art.ts`, `subject-art.ts`, renderizado del catálogo en `main.ts` | `lab-art.ts`, `src/labs/`, `circuit.ts` |
| T4 | `src/lab-art.ts`, `circuit-charts.ts`, entorno de la escena | `template.ts`, CSS del portal, `circuit.ts`, `class-engine.ts` |
| T5 | `src/content/electronica.ts` | `src/classes/` |
| T6 | `src/labs/industrial/`, `src/content/industrial.ts` | Otros laboratorios |
| T7 | `src/labs/fluidos/`, `src/content/fluidos.ts` | Otros laboratorios |
| T8 | `src/content/<materia>.ts` de cada concepto | Archivos de T5, T6 o T7 sin coordinar |
| T9 | `public/audio/`, `narration-manifest.json`, `scripts/generate-narration.mjs` | — |

**Archivos compartidos:** `main.ts` (fuera de lo indicado), `subjects.ts`, `laboratories.ts`, `lessons.ts`, `package.json` y `package-lock.json`. Solo admiten cambios mínimos, como añadir una línea a un registro. Si necesitas más, anótalo en la bitácora y coordina con el responsable. No se añaden dependencias sin una razón escrita.

## 5. Reglas de coordinación

1. **Una carpeta por agente.** Dos agentes en la misma carpeta se pisan los archivos sin que Git lo detecte. Crea tu copia con `git worktree` y ejecuta `npm ci` en ella:

   ```bash
   git worktree add ../laboratorio-vr-codex -b codex/t3-portal origin/main
   ```

2. **Una rama por tarea, desde `origin/main`:** `claude/tN-nombre` o `codex/tN-nombre`.
3. **Avisa antes de empezar:** actualiza tu fila del tablero y registra el inicio en la [bitácora](bitacora.md). Estos dos archivos pueden ir en un commit directo a `main`; el resto, por PR.
4. **Integra pronto:** PR pequeños, y `git pull --rebase origin main` antes de abrirlos. Revisa `git status` y el tablero al empezar cada sesión.
5. **Si necesitas un archivo ajeno, no lo edites:** anótalo en la bitácora y espera a que se resuelva.
6. **Audios:** la voz elegida es Dalia (`es-MX-DaliaNeural`, ritmo −5 %). No generes MP3 ni edites el manifiesto; deja los textos listos para T9. Las pruebas exigen audio para cada clase registrada en `lessons.ts`, así que un laboratorio nuevo debe usar su propia carpeta `public/audio/<id>/` y entrar en el manifiesto durante T9.

### Para dar una tarea por terminada

- `npm test` y `npm run build` pasan.
- El tramo del guion que le corresponde funciona en el navegador, sin errores en consola.
- Si cambió algo visible, hay captura en el PR.
- La bitácora registra qué se hizo, por qué, qué archivos tocó y qué quedó pendiente.

Sin hardware real, indica «no probado en Quest». No des por validado lo que no se ha probado.
