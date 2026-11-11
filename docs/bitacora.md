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

## 2026-11-06 · Codex · T3 · integrada localmente
- Qué: T3 incorporada a main local, sobre T4, sin cambios en archivos de T6 ni en la configuración de Claude.
- Validación: 81 pruebas y compilación correctas en la revisión combinada.
- Pendiente: publicación en GitHub y PR, bloqueados por revisión automática de permisos de envío externo. La integración local no equivale a despliegue. Quest real pendiente.

## 2026-11-06 · Claude Code · T6 · inicio
- Qué: laboratorio de capacitación industrial: bloqueo y etiquetado de una cinta transportadora (avisar, apagar, aislar, bloquear, liberar energía, verificar), con VR en vivo y una lectura previa.
- Por qué: mostrar la oferta a empresas y el uso de gafas; es el primer laboratorio sobre la entrada de T2.
- Archivos: `src/labs/industrial/`, `src/content/industrial.ts`, una línea en `src/labs/registry.ts`, una línea en `src/learning-content.ts` y la materia en `src/subjects.ts`.
- Base: `abf294d`; rama `claude/t6-industrial`, carpeta `laboratorio-vr-claude-t6`.
- Pendiente: el contenido de seguridad es didáctico y debe revisarlo una persona con criterio técnico antes de presentarse. No se tocan los archivos de T3, T5 ni T7.

## 2026-11-06 · Claude Code · T6 · fin
- Qué: nueva materia «Capacitación industrial» con la práctica de bloqueo y etiquetado de una cinta transportadora (avisar, apagar, aislar, bloquear, liberar energía, verificar) y su lectura previa. Incluye el concepto «Puesta en marcha segura de un torno». Funciona en pantalla y tiene entrada a VR en vivo.
- Por qué: mostrar la oferta a empresas y el uso de gafas; es el primer laboratorio real sobre la entrada de T2.
- Archivos: `src/labs/industrial/` (`procedure.ts` lógica pura, `scene.ts` escena, `xr.ts` VR, `index.ts` módulo, `industrial.css`), `src/content/industrial.ts`, `src/loto-procedure.test.ts`, una línea en `src/labs/registry.ts`, una en `src/learning-content.ts` y la materia en `src/subjects.ts`.
- Cómo se hizo: el laboratorio usa su propio lienzo y motor dentro del `host`, y un único mecanismo de selección (`POINTERPICK`) para ratón y para el láser de las Quest. El tablero de pasos es una textura dentro de la escena, así que se lee igual en VR. La lógica del procedimiento (`attempt`, `nextStep`) es una función pura con 7 pruebas.
- Pendiente:
  - La VR no se probó en gafas (T10, requiere HTTPS). En escritorio la entrada a VR queda desactivada con un mensaje.
  - El contenido de seguridad es didáctico: debe revisarlo una persona con criterio técnico antes de presentarse.
  - Para T3: la tarjeta de la materia industrial usa la ilustración genérica de electrónica; hace falta una en `subject-art.ts` y `platform-art.ts`.
  - Para T9: la lectura y los mensajes del laboratorio no tienen audio; son texto.

## 2026-11-06 · Claude Code · T6 · integrada
- Qué: PR #5 integrado en `main`; T6 queda hecha.
- Por qué: la oferta a empresas ya se puede mostrar.
- Archivos: `docs/plan-demo.md`.
- Pendiente: probar la VR en gafas (T10); revisión técnica del contenido de seguridad; ilustración de la materia (T3); audios (T9).

## 2026-11-06 · Claude Code · T0 y T11 · borrador de diapositivas
- Qué: presentación de 11 diapositivas en 4 secciones (visión, guion de la demo, resumen del proyecto, cierre), con notas del orador y dos capturas reales. Enlace (privado, solo el responsable): https://claude.ai/artifact/JCQPu4oHYaPqN2Jv34days
- Por qué: fijar el esquema que orienta la demo (T0) y adelantar el material de T11.
- Archivos: ninguno del repositorio; la presentación vive en el artefacto.
- Pendiente (T11, tras T10): sustituir las capturas por otras en alta resolución y añadir el portal cuando T3 termine; rellenar los corchetes (nombre, fecha, contacto, laboratorios reales, piloto y resultado de la prueba en Quest); ajustar la tarjeta de fluidos cuando se integre T7; ajustar la decisión que se pide, que el plan deja abierta. Las cifras del problema no se inventaron: sustituir por datos del cliente si los hay.

## 2026-11-06 · Codex · T5 · inicio
- Qué: ampliar las cuatro lecturas de electrónica con conceptos, ejemplos, predicciones y preparación de la práctica.
- Por qué: acompañar a estudiantes sin conocimientos previos antes del entorno 3D.
- Archivos: `src/content/electronica.ts`.
- Rama y carpeta: `codex/t5-lecturas`, `laboratorio-vr-codex-t5`, desde origin/main.
- Pendiente: revisión de contenidos y navegador, pruebas y compilación. Audios reservados para T9; no se modifican pasos del laboratorio.

## 2026-11-06 · Codex · T5 · fin
- Qué: cuatro lecturas ampliadas (21 secciones en total) con objetivos, conceptos para principiantes, ejemplos numéricos, errores frecuentes, predicciones con respuesta y preparación de la práctica. Tiempo de lectura separado del tiempo de laboratorio.
- Archivos: `src/content/electronica.ts`; evidencia `docs/evidencia-t5/lectura-ohm.png` en la rama codex/t5-lecturas.
- Validación: npm test (88 pruebas), npm run build correctos. Las cuatro lecturas y sus accesos a práctica revisados en PC, sin errores de consola. Ley de Ohm enlaza con preparación y conserva inicio manual. Ejemplos contrastados con los valores y objetivos de las clases existentes.
- Pendiente: revisión e integración de T5. No se tocaron src/classes/, audios, manifiesto ni simuladores. Las lecturas son texto, sin nueva narración; cualquier locución adicional corresponde a T9. No probado en Quest real.

## 2026-11-06 · Codex · T5 · ilustraciones
- Qué: por petición del responsable, añadir esquemas SVG locales a las lecturas de electrónica.
- Archivos: `src/content/electronics-drawings.ts`, CSS asociado y conexión mínima en el render de lectura de `src/main.ts`.
- Por qué: explicar camino cerrado/abierto, resistencia, serie/paralelo, cable ausente y polaridad LED. La ampliación a main.ts responde a la petición explícita de mostrar dibujos en la lectura; no cambia el runtime.
- Pendiente: comprobación visual y validación.

## 2026-11-06 · Codex · T5 · ilustraciones verificadas
- Qué: ocho figuras SVG con pie explicativo y descripción accesible, sin servicios externos ni cambios al modelo. Revisión visual de Ohm y LED y navegación de las figuras de paralelo y cable ausente.
- Validación: 88 pruebas superadas; compilación correcta. Revisada la correspondencia de polaridad de la fuente y del LED. Captura en docs/evidencia-t5/ilustraciones.png.
- Pendiente: revisión e integración de T5, sin publicación externa.

## 2026-11-06 · Claude Code · T8 · inicio
- Qué: lecturas reales de los tres conceptos del catálogo: péndulo simple (mecánica), caudal y Bernoulli (fluidos) y puesta en marcha segura de un torno (industrial). Hoy son esqueletos con «Propuesta de contenido» y duración «Por definir».
- Por qué: mostrar amplitud sin inventar laboratorios; cada concepto se enseña de verdad y se rotula como «Concepto».
- Archivos: `src/content/mecanica.ts`, `src/content/industrial.ts` (solo la lectura del torno, que es mía de T6), `src/content/fluidos-conceptos.ts` (nuevo, para no tocar `fluidos.ts` de T7), una línea en `src/learning-content.ts`, el id de Bernoulli en `previewContentIds` de fluidos en `src/subjects.ts`, y `src/concept-content.test.ts`.
- Base: `6ea6203`; rama `claude/t8-conceptos`, carpeta `laboratorio-vr-claude-t8`.
- Pendiente: no se toca `src/content/fluidos.ts` ni `src/content/electronica.ts`. T7 (Codex) añadirá su propio id a la misma lista de fluidos en `src/subjects.ts`: el conflicto, si lo hay, es de una línea.

## 2026-11-06 · Claude Code · T8 · fin
- Qué: tres lecturas de concepto con contenido real, de unos 6 minutos, cinco secciones cada una y un cierre rotulado «Concepto: qué falta para un laboratorio». Péndulo simple (`T = 2π√(L/g)`), caudal y Bernoulli (`A₁ · v₁ = A₂ · v₂` y `p + ½ρv² + ρgh`) y puesta en marcha segura de un torno. Los ejemplos numéricos están calculados a mano (1 m en la Tierra ≈ 2.0 s, en la Luna ≈ 4.9 s; de 1 a 4 m/s en agua la presión baja 7.5 kPa).
- Por qué: mostrar amplitud sin inventar laboratorios; cada tarjeta enseña algo de verdad y dice que es un concepto.
- Archivos: `src/content/mecanica.ts`, `src/content/fluidos-conceptos.ts` (nuevo), la lectura del torno en `src/content/industrial.ts`, una línea en `src/learning-content.ts`, el id de Bernoulli en la lista de fluidos de `src/subjects.ts` y `src/concept-content.test.ts` (4 pruebas).
- Para T7 (Codex): no se tocó `src/content/fluidos.ts`. La tarjeta «Presión en un depósito» (`fluidos-presion`) sigue como esqueleto con duración «Por definir»; T7 la sustituye por la lectura de la prensa hidráulica. Al añadir su id a `previewContentIds` de fluidos en `src/subjects.ts` puede haber un conflicto de una línea con el de Bernoulli.
- Pendiente: el contenido del torno es didáctico y debe revisarlo una persona con criterio técnico. Los conceptos no tienen audio (T9 decide si los narra). Si sobra tiempo, el péndulo es el candidato a práctica corta.

## 2026-11-06 · Claude Code · T8 · integrada
- Qué: PR #8 integrado en `main`; T8 queda hecha.
- Por qué: el catálogo ya muestra tres conceptos con contenido real.
- Archivos: `docs/plan-demo.md`.
- Pendiente: revisión técnica del contenido del torno; T7 (Codex) sustituye «Presión en un depósito»; T9 decide si narra los conceptos.

## 2026-11-06 · Claude Code · Clase visual de fluidos y mecánica · inicio
- Qué: ilustraciones animadas dentro de las lecturas de concepto de mecánica (péndulo) y fluidos (caudal y Bernoulli), para que el cliente vea algo en movimiento aunque todavía no haya laboratorio. No son un simulador y se rotulan como ilustración.
- Por qué: petición del responsable: una clase de cada materia que se vea en la presentación, sin laboratorio por ahora. Reutiliza el mecanismo de dibujos de T5.
- Archivos: `src/content/concept-drawings.ts` (SVG puro), `src/content/concept-figure.ts`, `src/content/concept-drawings.css`, `src/concept-drawings.test.ts` y una línea en `src/main.ts` junto a la de T5.
- Base: `752b2bc`; rama `claude/clase-visual-conceptos`, carpeta `laboratorio-vr-claude-t8`.
- Pendiente: no se toca `src/content/fluidos.ts` (T7) ni `src/content/electronics-drawings.ts` (T5).

## 2026-11-06 · Claude Code · Clase visual de fluidos y mecánica · fin
- Qué: siete ilustraciones animadas en las lecturas de concepto. Péndulo (4): una oscilación, largo 1 m frente a 4 m, masa 50 g frente a 500 g, y Tierra frente a Luna. Caudal y Bernoulli (3): caudal `Q = A · v`, continuidad con el agua cuatro veces más rápida en la parte estrecha, y tubo de Venturi con columnas de presión. Cada dibujo lleva el aviso «Ilustración animada: no es un simulador».
- Por qué: que el cliente vea algo en movimiento en mecánica y en fluidos aunque todavía no haya laboratorio.
- Cómo se hizo: los tiempos salen de la física, no de valores puestos a ojo (`period(L,g) = 2π√(L/g)`; velocidad en el tramo estrecho = 4 × la del ancho). Las pruebas comprueban esas proporciones. El movimiento se apaga con «reducir movimiento» del sistema.
- Archivos: `src/content/concept-drawings.ts`, `src/content/concept-figure.ts`, `src/content/concept-drawings.css`, `src/concept-drawings.test.ts` (9 pruebas) y dos líneas en `src/main.ts`, junto a las de T5.
- Para T7 (Codex): para añadir dibujos a su lectura basta una entrada en el mapa `drawings` de `concept-drawings.ts` o su propio módulo con el mismo patrón; `fluidos.ts` no se tocó.
- Pendiente: no se probó en Quest; las lecturas se ven en el navegador de escritorio. El torno no tiene dibujos. Los conceptos siguen sin audio.

## 2026-11-06 · Codex · Desplazamiento VR · inicio
- Qué: movimiento continuo con palanca izquierda y selector Caminar/Teletransporte en la barra espacial, por petición del responsable.
- Archivos: quest-runtime.ts, quest-interface.ts, vr-walking.ts y pruebas, ayuda y documentación Quest.
- Rama: codex/vr-walking; carpeta laboratorio-vr-codex-vr.
- Pendiente: validar reglas de movimiento; prueba en Quest real pendiente. Alcance inicial: runtime compartido de electrónica; los módulos independientes tienen sus propios controles.

## 2026-11-06 · Codex · Desplazamiento VR · fin
- Qué: caminar a 0,75 m/s como máximo con palanca izquierda, orientación horizontal de la mirada, zona muerta y límites de sala/mesa. Selector espacial Caminar/Teletransporte; pausa en catálogo, preparación y sesión no visible.
- Validación: 105 pruebas superadas, incluidos rumbo, diagonal, límites, bloqueo de mesa y tiempo. Compilación correcta; selector visible en vista Quest en PC, sin errores de consola. Evidencia en docs/evidencia-vr/.
- Pendiente: integración de codex/vr-walking. No validado con mandos físicos ni Quest real; la vista PC no emula el movimiento del joystick. Runtime de electrónica; los módulos independientes no se modificaron.

## 2026-11-10 · Claude Code · Plan de la demo para distribución eléctrica
- Qué: nuevo plan [plan-demo-energia.md](plan-demo-energia.md) con objetivo, supuestos, guion de 10 minutos y tablero E0 a E12 repartido entre Sonnet 5.5 y Codex. `plan-demo.md` queda cerrado como historial y `AGENTS.md` apunta al plan nuevo.
- Por qué: la demo universitaria se aprobó y ahora se prepara una demo para una empresa de distribución eléctrica (login, rediseño, realismo y prácticas del sector).
- Cambio de regla propuesto: se permiten usuarios y avances de ejemplo rotulados como «Datos de demostración». Queda sujeto a la aprobación del plan (E0).
- Pendiente: E0 (aprobar el plan y responder fecha, país y normativa, marca, formato, público y experto revisor). Del tablero anterior quedan sin cerrar T5, T7, T9, T10 y T11, y hay cambios sin confirmar de Codex en la carpeta principal; E0 decide qué se descarta.

## 2026-11-10 · Claude Code · Plan reducido para ESSA, demo mañana
- Qué: el plan se reescribe tras conocer los datos. Cliente: ESSA (Colombia). Fecha: mañana, como añadido de unos 5 minutos a una reunión ya programada. Tablero D0–D5: un solo recorrido (login de técnico → lectura de las cinco reglas → práctica en poste con arco al equivocarse → panel del supervisor).
- Por qué: con un día no caben el kit de modelos, la segunda práctica, la evaluación ni la reorganización de `main.ts`. Un contrato común (sección 3 del plan) sustituye a esa reorganización para que los dos agentes no se esperen.
- Decisiones: demo en pantalla; VR solo si se prueba esta noche en las Quest. Sin logo de ESSA salvo permiso. Contenido rotulado como didáctico, pendiente de validar con el RETIE y los procedimientos de ESSA. T5, T7, T9, T10 y T11 suspendidas.
- Pendiente: aprobación del plan; D0 desbloquea D1–D4.

## 2026-11-10 · Claude Code · Plan ESSA: ganchos y despliegue
- Qué: el plan añade dos funciones que el responsable mencionará de viva voz como gancho, sin estar operativas: bloques de video breves dentro de las clases y un editor de clases por bloques (texto, imagen, video, animación) para un rol alto. Nueva tarea opcional D6 con un apoyo visual rotulado «Concepto» para cada una; es la primera en recortarse.
- Despliegue: el responsable confirma que ya hay despliegue en Railway y que la VR funciona en Quest. Cada merge en `main` publica la versión de la demo, así que `main` debe estar siempre presentable. T10 queda cubierta; la práctica nueva (D2) se prueba en gafas en D5.

## 2026-11-10 · Claude Code · D0 Contrato común
- Qué: plan integrado (PR #11). D0 deja en `main` el contrato de la sección 3: materia `distribucion` primera en el catálogo, lectura `distribucion-cinco-reglas` con texto ya presentable (seis secciones, rotulada como didáctica y pendiente de validar con el RETIE y ESSA), y laboratorio `cinco-reglas` registrado que abre una tarjeta «Práctica en preparación».
- Firmas para D1, D2 y D4: `src/labs/cinco-reglas/result.ts` exporta `PracticeResult {contentId, aprobado, errores, segundos, fecha}`, `RESULT_KEY = 'umbral-demo-resultado'`, `saveResult(result)` y `readResult(): PracticeResult | null` (devuelve null si no hay dato o está dañado). El panel de D4 importa `readResult`; D2 llama a `saveResult` al terminar.
- Archivos: `src/subjects.ts` (entrada nueva), `src/learning-content.ts` (una línea), `src/content/distribucion.ts`, `src/labs/registry.ts` (una línea), `src/labs/cinco-reglas/{index.ts,result.ts,cinco-reglas.css}`, `src/distribucion-contract.test.ts` (2 pruebas).
- Validación: 107 pruebas superadas, build correcto; en el navegador la ruta, la lectura y el laboratorio provisional abren sin errores en consola.
- Pendiente para D1 (Codex): la tarjeta de la ruta usa la ilustración por defecto de electrónica; falta su entrada en `subject-art.ts`.

## 2026-11-10 · Claude Code · D2 Práctica de las cinco reglas de oro
- Qué: la práctica `cinco-reglas` sustituye a la tarjeta provisional. Calle con poste de concreto, cruceta, línea trifásica que cruza la calle, cortacircuitos, transformador, camión de la cuadrilla con baliza, casas y sombras. En una lona: EPP, pértiga, tarjeta, detector, equipo de puesta a tierra y conos. Pasos: EPP, cortar (los cortacircuitos se abren), bloquear (tarjeta en el poste), verificar (luz verde en el detector), puesta a tierra (cables en las tres fases) y señalizar (conos y cinta).
- Error del guion: poner a tierra sin verificar dispara el arco (destello en pantalla, núcleo luminoso, chispas, luz, sonido sintetizado y marca en el conductor), detiene la práctica y explica el riesgo. Hay zumbido del transformador mientras la línea está energizada.
- Al terminar: constancia «Datos de demostración» con errores, tiempo y fecha, y `saveResult` guarda el resultado para el panel de D4 (comprobado en `localStorage`).
- Pantalla y VR: un panel HTML grande refleja los pasos porque el tablero 3D no se lee en un proyector; el tablero 3D queda a la izquierda para la VR. Volúmenes de selección invisibles facilitan tocar herramientas finas con ratón o láser.
- Archivos: `src/labs/cinco-reglas/{procedure,scene,sound,index}.ts`, `cinco-reglas.css`, `src/cinco-reglas-procedure.test.ts` (8 pruebas). Reutiliza `enableXR` del laboratorio industrial sin modificarlo.
- Validación: 115 pruebas superadas, build correcto; recorrido completo en el navegador (con error y sin él) sin errores en consola.
- Pendiente: **no probado en Quest** (D5). Dos clics muy seguidos cuentan como doble toque y el segundo se ignora: en la demo, tocar con calma.

## 2026-11-10 · Claude Code · Relevo a Codex
- Qué: D2 integrada (PR #13); D0 y D2 hechas en el tablero. Claude Code se queda sin cuota y Codex continúa solo: [relevo-codex.md](relevo-codex.md) resume el estado, el contrato, lo que falta (D1, D4, D5; D3 y D6 opcionales) y los cuidados. D3 y D5 pasan a Codex. `AGENTS.md` enlaza el relevo.
- Pendiente: D1, D4 y D5 antes de la demo de mañana; D2 sin probar en Quest.

## 2026-11-10 · Codex · D1 inicio
- Entrada de demostración y portal ESSA, autorizados por el responsable. Rama codex/d1-login desde 5fd36a9, carpeta propia.
- Avance D1: selector accesible de perfiles ficticios, cambiar perfil, rótulo ESSA, catálogo enfocado y dibujo de distribución. 115 pruebas pasan. Pendiente revisión visual en navegador y panel D4; no integrado ni desplegado.
- Revisión en navegador PC: acceso técnico, ruta distribución, lectura, apertura de práctica, regreso y cambio a supervisora correctos. Sin errores de consola capturados. Captura en docs/evidencia-d1/entrada.png. D4 pendiente; ambos perfiles acceden por ahora al catálogo. Sin prueba Quest ni despliegue.

## 2026-11-11 · Codex · D1 ajuste visual
- Portal con composición de dashboard según referencias: lateral fija, encabezado compacto, búsqueda amplia, tarjetas de materias y botones azules. Tipografía compacta; blanco y azul claro. Verificado en navegador; compilación correcta antes del ajuste final de especificidad de colores. Sin cambios de lógica ni despliegue.

## 2026-11-11 · Codex · D1 finalizada
- Entrada por perfiles ficticios técnico/supervisora, cambio de perfil, portal ESSA y catálogo enfocado. Diseño final blanco y azul con lateral fija, búsqueda y tarjetas compactas.
- Validación final: 115 pruebas superadas, compilación y git diff --check correctos; portal revisado en navegador, sin errores de consola. Evidencia docs/evidencia-d1/portal-final.png.
- D1 hecha en rama codex/d1-login; integración y despliegue pendientes del responsable. D4 implementará el panel de supervisora; actualmente ambos perfiles acceden al catálogo. No probado en Quest.

## 2026-11-11 · Claude Code · Portal minimalista
- Qué: a petición del responsable, el portal pasa a un diseño sobrio y fácil de usar. Una tipografía (IBM Plex Sans), fondo gris claro, superficies blancas, un solo azul para acciones y lugar actual, y un amarillo de seguridad que solo marca la ruta asignada. Se quitan la búsqueda doble, el titular a dos colores, la ilustración, el bloque «Comprende. Experimenta. Descubre.», la nota de PC, la bienvenida y los consejos de la portada, las etiquetas en mayúsculas y los números duplicados de la lectura. Las rutas son filas con título, descripción, datos y un botón con la acción («Abrir ruta», «Empezar»).
- Textos: «Tu capacitación», «Rutas de capacitación», menú «Capacitación / Rutas / Ayuda · Primeros pasos». En la entrada, sin mayúsculas ni flechas; el botón de perfil muestra el nombre y anuncia «cambiar perfil».
- Archivos: `src/essa-minimal.css` (nuevo, se carga al final), textos en `src/main.ts`, `src/template.ts` y `src/demo/entry.ts` (D1 de Codex, ya integrada), fuente en `index.html`.
- Validación: 115 pruebas, build correcto; revisado en escritorio (1440) y móvil (375, sin desplazamiento horizontal): entrada, portal, ruta y lectura, sin errores en consola. La práctica 3D y el laboratorio de electrónica no cambian.
- Pendiente: D4 y D5. La página «Prepara tu espacio» de electrónica conserva su estilo anterior salvo botones y etiquetas.

## 2026-11-11 · Claude Code · Inicio tipo panel
- Qué: sobre el portal minimalista, el inicio adopta la distribución de referencia que pidió el responsable (panel de administración). Lateral con buscador arriba, iconos de línea y texto más grande. Inicio centrado con píldora «Preparado para ESSA», titular grande y buscador ancho. Debajo, tres columnas con chevrones: «Rutas», «Práctica asignada» (tarjeta de las cinco reglas, marcada en amarillo, con «Empezar» o «Completada · repetir») y «Clases». Al final, «Tu avance» con tres cifras: prácticas completadas, errores y tiempo del último intento.
- «Tu avance» lee el resultado real de la práctica (`readResult` de `src/labs/cinco-reglas/result.ts`) y lleva el rótulo «Datos de esta sesión de demostración». Sin intento, muestra «—».
- El buscador del inicio ahora también encuentra clases, no solo rutas («ohm», «reglas»). El torno sigue oculto.
- Archivos: `src/demo/home.ts` (nuevo), `src/essa-minimal.css`, `src/main.ts` (render del inicio y búsqueda), `src/template.ts` (contenedor `#home-dashboard`, menú).
- Validación: 115 pruebas, build correcto; revisado en escritorio (1440) y móvil (375, sin desplazamiento horizontal). La tarjeta asignada abre la lectura, las filas abren la ruta e «Inicio» vuelve al panel.
- Pendiente: D4 (panel de supervisora, puede reutilizar `.home-stat` y `.home-col`) y D5.

## 2026-11-11 · Claude Code · Panel de cabecera del inicio
- Qué: a petición del responsable, el inicio pierde la píldora «Preparado para ESSA» y gana un panel azul oscuro (#123a56) sin texto encima de «Tu capacitación». Es la base sobre la que se añadirán, poco a poco, elementos que den personalidad a la página. Solo se ve en el inicio; las páginas de ruta conservan su encabezado.
- Archivos: `src/template.ts` (elemento `.home-banner`) y `src/essa-minimal.css`.
- Validación: 115 pruebas, build correcto, revisado en escritorio y sin errores en consola.

## 2026-11-11 · Claude Code · Saludo y ruta en el panel del inicio
- Qué: el panel azul del inicio muestra el perfil («Técnico liniero» o «Supervisora, jefa de cuadrilla»), el saludo («Hola, Andrés» o «Hola, Laura»), la ruta («Tu ruta asignada» o «Ruta de tu cuadrilla: Trabajo seguro en redes de distribución») y un botón blanco «Abrir ruta». Cambia al cambiar de perfil.
- Archivos: `src/demo/home.ts` (`renderBanner`, `renderHome` recibe el rol), `src/main.ts` (pasa `app.dataset.demoRole`), `src/template.ts` y `src/essa-minimal.css`.
- Validación: 115 pruebas y build correctos. Revisado en escritorio y móvil (sin desplazamiento horizontal), con los dos perfiles; el botón abre la ruta. Sin errores en consola.

## 2026-11-11 · Claude Code · Ilustración del poste en el panel
- Qué: a la derecha del saludo, un dibujo de líneas de un poste de distribución con cruceta, aisladores, cables, transformador y una señal de riesgo eléctrico en amarillo de seguridad. Tonos de azul claro sobre el panel; los cables se desvanecen hacia la izquierda. Es decorativo (`aria-hidden`) y se oculta en móvil. El botón «Abrir ruta» pasa debajo del texto.
- Archivos: `src/demo/home.ts` (SVG en línea `POLE`) y `src/essa-minimal.css`.
- Validación: 115 pruebas y build correctos; revisado en escritorio y móvil (sin desplazamiento horizontal) y sin errores en consola.

## 2026-11-11 · Claude Code · Panel del inicio más bajo
- Qué: a petición del responsable, se quita el botón «Abrir ruta» del panel y el panel baja de unos 250 px a unos 150 px en escritorio (dibujo de 250 px de ancho, titular de 28 px, menos relleno). La ruta se sigue abriendo desde la columna «Rutas» y la tarjeta de la práctica asignada.
- Archivos: `src/demo/home.ts` y `src/essa-minimal.css`.
- Validación: 115 pruebas y build correctos; revisado en escritorio y sin errores en consola.

## 2026-11-11 · Claude Code · Inicio con módulos y actividades pendientes
- Qué: a petición del responsable, el inicio muestra de un vistazo lo más relevante. «Módulos activos»: cada módulo asignado con barra de clases completadas («2 de 4 clases») y la siguiente clase con su fecha de revisión. «Actividades pendientes»: las clases asignadas sin terminar, ordenadas por fecha de revisión, con «En N días»; la más próxima va marcada en amarillo. El panel azul resume cuántas hay y la próxima revisión. «Tu avance» cuenta las clases completadas de los módulos asignados.
- Lateral: «Mis módulos» (Trabajo seguro en redes de distribución, Fundamentos eléctricos) y «Módulos abiertos» (Capacitación industrial). En toda la interfaz «ruta» pasa a ser «módulo».
- Datos: `src/demo/asignaciones.ts` (datos de demostración). Las fechas se calculan desde el día en que se abre la página. Las dos primeras clases de electrónica figuran como hechas; las cinco reglas cuentan como hechas solo si la práctica real se aprobó (`readResult`). Prueba en `src/demo-assignments.test.ts`.
- Archivos: `src/demo/home.ts`, `src/demo/asignaciones.ts`, `src/main.ts`, `src/template.ts`, `src/essa-minimal.css`.
- Validación: 119 pruebas y build correctos. Revisado en escritorio y móvil (sin desplazamiento horizontal), con y sin la práctica aprobada; el módulo abre su página y la actividad abre la lectura. Sin errores en consola.
- Pendiente: D4 (el panel de la supervisora puede reutilizar `asignaciones.ts`) y D5.

## 2026-11-11 · Claude Code · Títulos del inicio más visibles
- Qué: «Módulos activos» y «Actividades pendientes» pasan a 21 px en negrita, con una línea oscura debajo y un contador azul (2 y 3). Archivos: `src/demo/home.ts` y `src/essa-minimal.css`.
- Validación: 119 pruebas y build correctos; revisado en escritorio y sin errores en consola.
