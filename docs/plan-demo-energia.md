# Plan de la demo para ESSA

Estado: **pendiente de aprobación del responsable (2026-11-10). La demo es mañana, 2026-11-11.** Sustituye a [plan-demo.md](plan-demo.md), que queda como historial de la demo universitaria. Este documento es la fuente común de Claude Code (Sonnet 5.5) y Codex.

## 1. Contexto y objetivo

La demo universitaria se aprobó. Al terminarla se añadió, a último momento, una demostración dentro de una reunión ya programada con **ESSA**, distribuidora de energía en Colombia. La reunión no es sobre la plataforma: la demo es un añadido corto, de unos 5 minutos.

**Objetivo:** que ESSA vea en 5 minutos su propio trabajo hecho en la plataforma y quiera una conversación aparte para capacitar a su personal. El producto final arrancará de cero; nada de este código pasa al producto.

Con un día de trabajo, se construye **un solo recorrido muy bien acabado**. Lo demás del plan anterior (kit de modelos, segunda práctica, evaluación completa, audios, reorganización del código) queda fuera.

Límites que se mantienen:

- **Datos de demostración rotulados.** Se permiten usuarios y avances de ejemplo con el rótulo «Datos de demostración» visible. Cambia la regla del plan anterior, que prohibía simularlos.
- **Contenido didáctico, no normativo.** No hay tiempo para que un experto de ESSA lo revise. La práctica y la lectura llevan en pantalla: «Contenido didáctico de demostración. Debe validarse con el RETIE y los procedimientos de ESSA». No se citan artículos del RETIE ni valores de tensión que nadie haya verificado.
- **Marca:** se muestra el texto «Preparado para ESSA». No se usa su logo ni sus colores salvo que el responsable los aporte con permiso.
- **Base estable:** `npm test` y `npm run build` pasan antes de integrar.

## 2. Guion (5 minutos)

| Min | Momento | Qué demuestra |
| --- | --- | --- |
| 0,5 | Entrar como técnico de redes (usuario de demostración) | Cada persona tiene su ruta |
| 0,5 | Ruta «Trabajo seguro en redes de distribución» y lectura breve de las cinco reglas de oro. **Gancho:** bloques de video breves dentro de la clase | Teoría antes de la práctica |
| 3 | Práctica en un poste con transformador: las cinco reglas en orden, luego un error a propósito (poner a tierra sin verificar ausencia de tensión → arco eléctrico y explicación) | Realismo y seguridad sin riesgo |
| 1 | Entrar como supervisor: avance de la cuadrilla y constancias. **Gancho:** ESSA crea sus propias clases desde la plataforma | Lo que compra la empresa |

**VR:** el despliegue en Railway y la VR ya funcionan en las Quest. La práctica nueva (D2) se muestra en gafas solo si pasa la prueba en Quest de D5; si no, se hace en pantalla.

### Ganchos que se mencionan de viva voz

La plataforma es un centro de clases y capacitaciones, y el responsable presentará dos funciones que **no estarán operativas en la demo**:

1. **Bloques de video en las clases:** videos breves dentro de la explicación que complementan el texto.
2. **Editor de clases por bloques:** una persona con rol alto (coordinación de capacitación o supervisión) crea la sección de texto de una clase desde la plataforma, añadiendo bloques de texto, imagen, video o animación, sin programar.

Si sobra tiempo, cada gancho tiene un apoyo visual barato, rotulado «Concepto» (D6). Sin él, el gancho se cuenta igual: no bloquea nada.

- En la lectura de D3, un bloque de video con portada y la etiqueta «Video breve · Concepto», sin reproducir nada.
- En el panel de D4, un botón «Crear clase» que abre una maqueta fija del editor: una clase a medio armar con bloques de texto, imagen, video y animación, y una barra para añadir bloques. No guarda nada.

## 3. Contrato común

Se fija ahora para que los dos agentes trabajen sin esperarse:

| Pieza | Valor |
| --- | --- |
| Materia | `id: 'distribucion'`, título «Trabajo seguro en redes de distribución», primera en `subjects.ts` |
| Contenido | `id: 'distribucion-cinco-reglas'` en `src/content/distribucion.ts`, con `labId: 'cinco-reglas'` |
| Laboratorio | `src/labs/cinco-reglas/`, registrado en `src/labs/registry.ts` como `'cinco-reglas'` |
| Usuarios | Técnico «Andrés Rojas, liniero» y supervisora «Laura Gómez, jefa de cuadrilla» (ficticios). Sin contraseña real: elegir usuario y entrar |
| Resultado de la práctica | Al terminar, el laboratorio guarda en `localStorage` la clave `umbral-demo-resultado` con `{contentId, aprobado, errores, segundos, fecha}`. El panel la lee si existe y la añade a los datos de ejemplo |

D0 deja esto en `main` antes de repartir el resto: la materia, el contenido con texto provisional y un laboratorio vacío que abre y cierra.

## 4. Tablero

Estados: `pendiente`, `en curso`, `en revisión`, `hecha`.

| ID | Tarea | Agente | Estado | Depende de |
| --- | --- | --- | --- | --- |
| D0 | Contrato: materia, contenido provisional y laboratorio vacío registrados | Sonnet | en revisión | — |
| D1 | Login de demostración y portal para ESSA: entrada por usuario, «Preparado para ESSA», ruta de distribución primero, electrónica como «Fundamentos eléctricos»; mecánica, fluidos y torno ocultos | Codex | pendiente | D0 |
| D2 | Práctica de las cinco reglas de oro en un poste con transformador, con arco eléctrico al cometer el error y constancia al terminar | Sonnet | pendiente | D0 |
| D3 | Lectura breve de las cinco reglas, con ilustración | Sonnet | pendiente | D0 |
| D4 | Panel del supervisor con cuadrilla de ejemplo y el resultado real de la práctica | Codex | pendiente | D1 |
| D5 | Ensayo completo sobre Railway, prueba de D2 en Quest y video de respaldo | Responsable + Sonnet | pendiente | D1–D4 |
| D6 | Apoyos visuales de los ganchos: bloque de video en la lectura y maqueta del editor de clases | Quien termine antes | pendiente | D3, D4 |

**Hora de congelar el código: esta noche.** Lo que no esté integrado y ensayado entonces no entra en la demo. Si falta tiempo, se recorta en este orden: D6, D3, D4. Nunca D2.

### Qué toca cada tarea

| Tarea | Archivos propios | No tocar |
| --- | --- | --- |
| D0 | `subjects.ts` (solo la entrada nueva), `learning-content.ts` (una línea), `src/content/distribucion.ts`, `src/labs/registry.ts` (una línea), `src/labs/cinco-reglas/` | — |
| D1 | `template.ts`, CSS del portal, `platform-art.ts`, `subject-art.ts`, `subjects.ts` (resto de entradas), renderizado del catálogo y entrada en `main.ts`, `src/demo/` | `src/labs/`, `src/content/distribucion.ts` |
| D2 | `src/labs/cinco-reglas/`, `src/cinco-reglas*.test.ts` | Portal y `main.ts` |
| D3 | `src/content/distribucion.ts`, dibujos en `src/content/` | Archivos de T5 |
| D4 | `src/demo/supervisor*`, `src/demo/datos-ejemplo.ts` y una línea en `main.ts` | `src/labs/` |
| D6 | Bloque de video: `src/content/` junto a la lectura de D3. Maqueta del editor: `src/demo/editor*` y el botón en el panel de D4 | Coordinar con el autor de D3 o D4 si sigue en curso |

### Alcance de D2

- **Partir del laboratorio de bloqueo y etiquetado** (`src/labs/industrial/`): misma lógica pura de pasos, intentos y errores explicados, con pruebas. Se copia; no se generaliza.
- **Pasos:** 1) corte efectivo de todas las fuentes, 2) bloqueo de los equipos de corte y señalización, 3) verificación de ausencia de tensión, 4) puesta a tierra y en cortocircuito, 5) señalización y delimitación de la zona de trabajo. Antes de empezar, verificar el EPP.
- **Escena:** poste, crucetas, transformador, cortacircuitos, conductores, pértiga, detector de tensión y equipo de puesta a tierra, en un entorno de calle. Modelado por código con mejores materiales que los laboratorios actuales; no hay tiempo para buscar y licenciar modelos.
- **Error:** el paso fuera de orden dispara un destello de arco con sonido, detiene la práctica y explica el riesgo. Sin imágenes de personas heridas.
- **Constancia:** al terminar, una tarjeta «Práctica completada · Datos de demostración» con errores y tiempo.
- **VR:** se conserva el patrón de `enableXR` del laboratorio industrial, pero solo se valida en escritorio.

## 5. Reglas de coordinación

Siguen vigentes las de [plan-demo.md](plan-demo.md#5-reglas-de-coordinación): una carpeta y una rama por tarea desde `origin/main` (`claude/dN-nombre` o `codex/dN-nombre`), aviso en el tablero y en la [bitácora](bitacora.md), PR pequeños y no editar archivos ajenos.

**Integrar es desplegar:** cada merge en `main` publica la versión en Railway, que es la que se presentará. Por eso `main` debe estar siempre presentable: no se integra trabajo a medias, el responsable hace cada merge, y tras cada uno se revisa la versión publicada.

T10 del plan anterior queda cubierta: hay despliegue en Railway y la VR funciona en Quest. T5, T7, T9 y T11 quedan suspendidas hasta después de la demo.

### Para dar una tarea por terminada

- `npm test` y `npm run build` pasan.
- Su tramo del guion funciona en el navegador, sin errores en consola, y hay captura en el PR.
- La bitácora registra qué se hizo y qué quedó pendiente.

La VR en Quest ya está validada con lo existente; cada pieza nueva se marca «no probado en Quest» hasta que pase D5.
