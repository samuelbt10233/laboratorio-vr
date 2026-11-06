# Bitácora de trabajo

Registro compartido entre Claude Code y Codex. Añade cada entrada al final, sin editar las anteriores. El tablero y las reglas están en [plan-demo.md](plan-demo.md).

Formato:

```text
## AAAA-MM-DD · Agente · Tarea · inicio | fin | bloqueo
- Qué: lo que se hace o se hizo.
- Por qué: el motivo.
- Archivos: los que se tocan.
- Pendiente: lo que queda, lo no probado y lo que necesita de otro agente.
```

## 2026-11-06 · Claude Code · T0 · inicio
- Qué: propuesta de flujo, catálogo y reparto en `docs/plan-demo.md`, con esta bitácora e instrucciones para ambos agentes.
- Por qué: la demo se trabaja con dos agentes y hay que dejar por escrito las tareas para evitar cruces.
- Archivos: `docs/plan-demo.md`, `docs/bitacora.md`, `AGENTS.md`, `CLAUDE.md`, `.gitattributes`, `INTEGRACION_AGENTES.md`.
- Pendiente: aprobar el catálogo y el reparto. T2 aún no ha empezado, y T3 a T8 dependen de ella.

## 2026-11-06 · Claude Code · Voz de la narración · fin
- Qué: cambio de la voz de Salomé a Dalia (`es-MX-DaliaNeural`, ritmo −5 %) en los 44 audios, el script, el respaldo del navegador y la documentación.
- Por qué: el responsable la eligió tras comparar muestras, porque Salomé sonaba robótica.
- Archivos: `public/audio/`, `scripts/generate-narration.mjs`, `src/narration.ts`, `README.md`, `INTEGRACION_AGENTES.md`, `docs/`.
- Pendiente: los MP3 conservan el nombre `salome-*`, sin efecto funcional. Los textos de T5 a T8 deben generarse con esta voz en T9.

## 2026-11-06 · Responsable · T1 · fin
- Qué: aprobación del plan, el catálogo y el reparto de tareas.
- Por qué: es la condición para empezar T2.
- Archivos: `docs/plan-demo.md`.
- Pendiente: siguen abiertas las preguntas de la sección 3 del plan. T3 a T8 no empiezan hasta que T2 esté integrada.

## 2026-11-06 · Claude Code · T2 · inicio
- Qué: separar la estética, el contenido por materia y crear la entrada de laboratorios nuevos, sin cambiar el comportamiento actual.
- Por qué: permitir que T3 a T8 avancen en paralelo sin editar las mismas líneas.
- Archivos: `src/main.ts`, `src/learning-content.ts`, `src/content/`, `src/labs/`, `src/lab-art.ts`, `src/subjects.ts`, `src/template.ts`.
- Pendiente: mientras esta tarea siga en curso, no empezar T3 a T8.

## 2026-11-06 · Claude Code · T2 · fin
- Qué: la estética de circuitos pasó a `src/lab-art.ts`, el contenido a `src/content/` (texto idéntico) y se creó la entrada de laboratorios en `src/labs/`. Electrónica no cambia: 81 pruebas en verde y las mismas 53 llamadas de dibujo.
- Por qué: T3 a T8 pueden avanzar en paralelo sin editar las mismas líneas de `main.ts` ni de `learning-content.ts`.
- Archivos: `src/main.ts`, `src/template.ts`, `src/subjects.ts`, `src/learning-content.ts`, `src/lab-art.ts`, `src/content/`, `src/labs/`, `src/lab-host.test.ts`, `src/subjects.test.ts`.
- Firmas:
  - Laboratorio nuevo: `src/labs/<id>/` exporta `lab:LabModule`, con `mount(context:LabContext):void|Promise<void>` y `unmount():void`. `LabContext` es `{host:HTMLElement;contentId:string;exit:()=>void}`. El módulo crea su propio canvas y motor dentro de `host`, y libera todo en `unmount`.
  - Registro: una línea en `src/labs/registry.ts`, por ejemplo `prensa:()=>import('./prensa').then(m=>m.lab)`.
  - Lectura: una entrada en `src/content/<materia>.ts` con `labId:'prensa'`. Su id se agrega a `previewContentIds` de la materia en `src/subjects.ts`.
  - Materia nueva o con laboratorio: `status:'available'`, `laboratoryIds:[]` y `previewContentIds:[...]`. Sin `labId`, la lectura aparece como «En preparación».
  - Estética de circuitos: `createLabArt(scene,tableRoot)` devuelve `{material,label,decorate,partVisual,ledLenses,red,metal,teal}`.
- Pendiente: T3 a T8 pueden empezar cuando se integre este PR. WebXR no forma parte de la entrada: cada laboratorio lo maneja por su cuenta. Una materia sin ilustración en `src/subject-art.ts` usa la ilustración genérica hasta que T3 la agregue. La prueba en navegador usó un laboratorio temporal, porque todavía no hay ninguno registrado.

## 2026-11-06 · Claude Code · T2 · integrada
- Qué: PR #3 integrado en `main`; T2 queda hecha.
- Por qué: desbloquea T3 a T8.
- Archivos: `docs/plan-demo.md`.
- Pendiente: T3, T5 y T7 pueden empezar con Codex, cada una en su carpeta y rama. Claude Code sigue con T4 y T6.

## 2026-11-06 · Claude Code · T4 · inicio
- Qué: dar a la mesa de circuitos el aspecto de un laboratorio real: entorno, banco de trabajo e instrumentos, sin cambiar la lógica ni la interacción.
- Por qué: credibilidad ante el cliente; la funcionalidad ya está validada.
- Archivos: `src/lab-art.ts`, `src/circuit-charts.ts`, entorno de la escena.
- Base: `f8dbe0a`; rama `claude/t4-estetica`, carpeta `laboratorio-vr-claude-t4`.
- Pendiente: no se tocan `template.ts`, el CSS del portal, `circuit.ts` ni `class-engine.ts`.

## 2026-11-06 · Claude Code · T4 · fin
- Qué: la mesa de circuitos ahora está en un laboratorio: banco de madera con patas y estante, sala con ventana, banco de instrumentos (osciloscopio, fuente, multímetro), pizarra con un circuito, estantería de componentes y pedestal para el monitor de gráficas.
- Por qué: credibilidad ante el cliente; la funcionalidad no cambia.
- Archivos: `src/lab-environment.ts` (nuevo), `src/lab-art.ts` (llama al entorno y lo devuelve como `environment`), `src/main.ts` (una línea: apaga `environment` en VR).
- Firma: `createLabEnvironment(scene,labRoot,tableRoot,material)` devuelve el nodo `room`. Los sólidos se fusionan por material para limitar las llamadas de dibujo.
- Pendiente: en VR solo se conserva el marco de madera; la sala se apaga para cuidar el rendimiento de las Quest. No se probó en Quest (T10). Los letreros de seguridad y el rótulo del laboratorio quedan tapados por el monitor en la vista por defecto.

## 2026-11-06 · Claude Code · T4 · integrada
- Qué: PR #4 integrado en `main`; T4 queda hecha.
- Por qué: cierra la mejora visual del laboratorio de circuitos.
- Archivos: `docs/plan-demo.md`.
- Pendiente: probar en Quest (T10). Para la proyección usar «Ocultar paneles», que deja ver toda la sala.
## 2026-11-06 · Codex · T3 · inicio
- Qué: mejorar el portal académico y explicar el recorrido de aprendizaje para la presentación.
- Por qué: mostrar una plataforma para universidad y empresa, con lectura antes de la práctica.
- Archivos: `src/template.ts`, `src/subjects-theme.css`, renderizado del catálogo si es necesario.
- Base: `f8dbe0a`; rama `codex/t3-portal`, carpeta `laboratorio-vr-codex`.
- Pendiente: T5 y T7 después de esta entrega. No se modifican los archivos de T4 ni T6.

## 2026-11-06 · Codex · T3 · fin
- Qué: portal con recorrido de aprendizaje, contexto universidad/empresa, orientación del catálogo, propuestas rotuladas Concepto y etapas visibles en la lectura. El número de secciones se obtiene del contenido real.
- Por qué: facilitar la primera visita y explicar el paso de teoría a práctica sin cambiar el diseño aprobado ni los simuladores.
- Archivos: `src/template.ts`, `src/subjects-theme.css`, `src/main.ts` (presentación del catálogo y lectura). Evidencia en `docs/evidencia-t3/` de la rama `codex/t3-portal`.
- Validación: npm test, 81 pruebas superadas; npm run build correcto, con advertencia existente de tamaño. Revisión PC de inicio → materia → lectura → preparación y regreso; sin errores de consola.
- Pendiente: revisión e integración de la rama; no probado en Quest real. T5 y T7 siguen pendientes. No se modificaron audios, modelos ni archivos de T4/T6.

## 2026-11-06 · Codex · T3 · ajuste visual solicitado
- Qué: sustituir la estructura editorial por un portal inspirado en las capturas de Cloudflare: navegación lateral, barra superior, búsqueda amplia, tarjetas compactas y tipografía sans serif. Se conservan crema, terracota y los acentos cálidos.
- Archivos: `src/workspace-theme.css`, `src/template.ts`, `src/main.ts` (navegación del catálogo); capturas en `docs/evidencia-t3/`.
- Validación: compilación correcta; 81 pruebas superadas; inicio, materia y lectura revisados en PC, sin errores de consola.
- Pendiente: revisión e integración de T3. Quest real no probado. No se añadieron cuentas, métricas ni servicios ficticios.
