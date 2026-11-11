# Plan: más módulos y clases para ESSA

Estado: **aprobado por el responsable el 2026-11-11.** Se trabaja en paralelo con Claude Code y Codex. Sin gafas hoy: todo se valida en el navegador de escritorio. Continúa [plan-demo-energia.md](plan-demo-energia.md); las reglas de coordinación de su sección 5 siguen vigentes.

## 1. Objetivo

El portal pasa de 3 módulos con 7 clases a 5 módulos con 18 clases, todas con el mismo formato que «Las cinco reglas de oro»: video (espacio reservado), explicación con imágenes, laboratorio si lo hay y evaluación de 3 preguntas.

Reglas de contenido, iguales para los dos agentes:

- **Tono de capacitación profesional:** impersonal, sin tutear. La primera sección es «Objetivo de la clase» (qué hace el participante al terminar); los ejemplos se presentan como «Caso típico de accidente», «Error frecuente» o «Resultado esperado».
- **Didáctico, no normativo:** no se citan artículos del RETIE ni valores (distancias, tensiones, resistencias de tierra) que nadie haya verificado. Toda clase de distribución, operación o medida lleva en su última sección: «Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA.»
- **Ficha mínima:** 5 secciones (título, texto de más de 60 caracteres y ejemplo), duración, `laboratoryTitle` y 3 preguntas con su explicación. Al menos 2 secciones con imagen (SVG generado; ver sección 4).
- **Sin marca de ESSA:** ni logo ni colores.

## 2. Módulos, clases y reparto

`★` = lleva laboratorio 3D si da el tiempo. Sin laboratorio, la clase muestra «Laboratorio en preparación» y sigue teniendo evaluación.

| Módulo (`subjectId`) | Clase (`id`) | Título | Agente | Estado |
| --- | --- | --- | --- | --- |
| Trabajo seguro en redes de distribución (`distribucion`) | `distribucion-cinco-reglas` | Las cinco reglas de oro | — | hecha |
| | `distribucion-epp` ★ | Equipo de protección personal y su inspección | Claude | completa con laboratorio (C1) |
| | `distribucion-distancias` ★ | Distancias mínimas de seguridad | Claude | completa con laboratorio (C1) |
| | `distribucion-ats` | Análisis de trabajo seguro y permiso de trabajo | Claude | lectura y evaluación (C1) |
| | `distribucion-alturas` | Trabajo en alturas en poste | Claude | lectura y evaluación (C1) |
| Operación y mantenimiento de la red (`operacion`) | `operacion-cortacircuitos` ★ | Maniobra de cortacircuitos con pértiga | Claude | completa con laboratorio (C1) |
| | `operacion-transformador` | Transformador de distribución | Claude | lectura y evaluación (C1) |
| | `operacion-puesta-tierra` | Puesta a tierra y medición de su resistencia | Claude | lectura y evaluación (C1) |
| | `operacion-inspeccion` | Inspección de redes y reporte de anomalías | Claude | lectura y evaluación (C1) |
| Atención al usuario y medida (`medida`) | `medida-acometida` | Instalación y revisión de una acometida | Codex | pendiente |
| | `medida-medidores` | Medidores de energía: tipos, lectura y sellado | Codex | pendiente |
| | `medida-irregulares` | Detección de conexiones irregulares | Codex | pendiente |
| | `medida-suspension` | Suspensión y reconexión del servicio | Codex | pendiente |
| Fundamentos eléctricos (`electronics`) | `fundamentos-potencia` ★ | Potencia y energía eléctrica | Codex | pendiente |
| | `fundamentos-alterna` | Corriente alterna y sistema trifásico | Codex | pendiente |
| | `fundamentos-multimetro` | Uso seguro del multímetro y la pinza amperimétrica | Codex | pendiente |

Las cuatro clases de electrónica existentes y bloqueo y etiquetado no cambian.

**Cuándo aparece una clase:** C0 deja cada clase registrada con una ficha provisional. La clase queda oculta en el portal hasta que tiene evaluación o laboratorio; en cuanto su agente añade las preguntas, aparece sola. Así nunca se muestra una ficha a medias.

## 3. Contrato común (C0, Claude)

C0 deja en `main`, antes de repartir:

| Pieza | Valor |
| --- | --- |
| Módulos | `operacion` y `medida` en `src/subjects.ts`, después de `distribucion`. Las 15 clases nuevas ya listadas en `previewContentIds`: nadie vuelve a editar `subjects.ts` |
| Fichas provisionales | `src/content/distribucion.ts` (Claude), `src/content/operacion.ts` (Claude), `src/content/medida.ts` (Codex), `src/content/fundamentos.ts` (Codex). Ya registradas en `learning-content.ts` |
| Evaluaciones | Un archivo por agente y módulo: `src/demo/evaluaciones-distribucion.ts` y `-operacion.ts` (Claude), `-medida.ts` y `-fundamentos.ts` (Codex). `evaluaciones.ts` los reúne; no se edita |
| Imágenes | `src/demo/figuras-distribucion.ts` y `figuras-operacion.ts` (Claude), `figuras-medida.ts` y `figuras-fundamentos.ts` (Codex). Ya enganchadas en `main.ts`: cada una devuelve `null` hasta que su dueño la llena |
| Resultados de práctica | `saveResult` guarda además un mapa por clase en `umbral-demo-resultados`; `resultFor(contentId)` lo lee. `readResult()` y la clave `umbral-demo-resultado` siguen siendo de «Cinco reglas», para no tocar el panel de D4 |
| Asignaciones | El técnico tiene asignados distribución, operación y fundamentos; medida e industrial quedan abiertos. Una clase cuenta como completada si su laboratorio guardó un resultado aprobado o, sin laboratorio, si su evaluación se aprobó |

## 4. Qué toca cada agente

| Agente | Archivos propios | No tocar |
| --- | --- | --- |
| Claude | `src/content/{distribucion,operacion}.ts`, `src/demo/evaluaciones-{distribucion,operacion}.ts`, `src/demo/figuras-{distribucion,operacion}.ts`, `scripts/esquemas.py`, `public/esquemas/`, laboratorios nuevos en `src/labs/<id>/` | Archivos de Codex |
| Codex | `src/content/{medida,fundamentos}.ts`, `src/demo/evaluaciones-{medida,fundamentos}.ts`, `src/demo/figuras-{medida,fundamentos}.ts`, `scripts/esquemas-codex.py`, `public/esquemas-codex/`, laboratorio de potencia si lo hace | Archivos de Claude |
| Compartidos | `src/labs/registry.ts` (una línea por laboratorio), `docs/bitacora.md` (solo añadir al final), tablero de este documento (solo la columna «Estado» de sus filas) | — |

Imágenes: SVG generados con Schemdraw (`pip install schemdraw`), como los de «Las cinco reglas». Se sirven con `<img>` desde `public/`; la fuente debe ser una pila sans-serif real (ver `scripts/esquemas.py`).

Laboratorios: se copia el patrón de `src/labs/cinco-reglas/` (procedimiento puro con pruebas, escena, panel lateral, constancia) y se guarda el resultado con `saveResult`. No se generaliza código entre laboratorios.

## 5. Para dar una clase por terminada

- `npm test` y `npm run build` pasan; la prueba de evaluaciones exige 3 preguntas válidas por clase visible.
- La clase se ve completa en el navegador (video, explicación con imágenes, laboratorio o «en preparación», evaluación aprobada y suspendida).
- La bitácora registra qué se hizo y qué quedó pendiente; el PR lleva captura.
- El responsable hace cada merge: integrar es desplegar en Railway.

## 6. Encargo para Codex

Tras el merge de C0, desde `main` actualizado y en una rama `codex/c2-medida-fundamentos`:

1. Sustituir las fichas provisionales de `src/content/medida.ts` y `src/content/fundamentos.ts` por las clases completas (sección 1).
2. Escribir las 3 preguntas de cada clase en `src/demo/evaluaciones-{medida,fundamentos}.ts`: con eso la clase aparece en el portal. El módulo «Atención al usuario y medida» aparece con su primera clase.
3. Generar los esquemas con `scripts/esquemas-codex.py` en `public/esquemas-codex/` y enlazarlos en `src/demo/figuras-{medida,fundamentos}.ts`, por índice de sección como en `figuras-distribucion.ts`.
4. Si queda tiempo, laboratorio de `fundamentos-potencia` en `src/labs/potencia/` con su línea en `registry.ts` y `labId:'potencia'` en la ficha.
5. Marcar el estado de sus filas en la sección 2, registrar en la bitácora y abrir PR por módulo, sin integrar.
