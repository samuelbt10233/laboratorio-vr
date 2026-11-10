# Relevo a Codex: demo ESSA (2026-11-10)

Claude Code se queda sin cuota. Codex continúa solo hasta la demo de mañana, 2026-11-11. Este documento resume dónde está todo y qué falta. El plan completo sigue en [plan-demo-energia.md](plan-demo-energia.md); si algo aquí choca con el plan, manda el plan.

## Estado de `main` (`fb4f3dc` o posterior)

Cada merge en `main` se despliega en Railway: es la versión que se presentará. No integres nada sin `npm test` y `npm run build` en verde y sin revisarlo en el navegador.

| Tarea | Estado | Dónde |
| --- | --- | --- |
| D0 Contrato común | hecha | PR #12 |
| D2 Práctica de las cinco reglas de oro | hecha, **no probada en Quest** | PR #13 |
| D1 Login y portal para ESSA | pendiente | Codex |
| D3 Lectura breve con ilustración | pendiente, ahora de Codex | Codex |
| D4 Panel del supervisor | pendiente | Codex |
| D5 Ensayo, prueba en Quest y video | pendiente | Responsable + Codex |
| D6 Apoyos visuales de los ganchos | opcional, se recorta primero | Codex |

Orden recomendado con el tiempo que queda: **D1 → D4 → D5**, y D3 y D6 solo si sobra tiempo. Si falta tiempo, se recorta D6, luego D3, luego D4. D2 ya está.

## Lo que ya existe y debes usar

- **Ruta:** materia `distribucion` («Trabajo seguro en redes de distribución»), primera en `src/subjects.ts`.
- **Lectura:** `distribucion-cinco-reglas` en `src/content/distribucion.ts`, con seis secciones ya presentables y `labId: 'cinco-reglas'`.
- **Práctica:** `src/labs/cinco-reglas/`, registrada en `src/labs/registry.ts`.
  - `procedure.ts`: lógica pura, con pruebas en `src/cinco-reglas-procedure.test.ts`.
  - `scene.ts`: calle, poste, transformador, camión, arco eléctrico y tablero 3D para VR.
  - `index.ts`: panel HTML de pasos para pantalla, constancia y llamada a `saveResult`.
  - `sound.ts`: zumbido y arco sintetizados, sin archivos de audio.
- **Resultado para el panel:** `src/labs/cinco-reglas/result.ts`.
  - `readResult(): PracticeResult | null`. Devuelve `{contentId, aprobado, errores, segundos, fecha}`, o null si no hay dato o está dañado.
  - Clave de `localStorage`: `umbral-demo-resultado`. La práctica la escribe solo al completarse bien.
  - D4 la importa así: `import { readResult } from './labs/cinco-reglas/result'`.

## Qué falta, con detalle

### D1 Login y portal para ESSA

- **Login:** pantalla de entrada antes del portal. Dos usuarios ficticios, sin contraseña real; se elige uno y se entra:
  - Técnico: «Andrés Rojas, liniero».
  - Supervisora: «Laura Gómez, jefa de cuadrilla».
- **Rótulos:** «Preparado para ESSA» y «Datos de demostración» visibles. Sin logo ni colores de ESSA salvo que el responsable los aporte.
- **Portal:**
  - La ruta de distribución va primero.
  - Electrónica se presenta como «Fundamentos eléctricos».
  - Mecánica, Mecánica de fluidos y el torno se ocultan del catálogo. El código queda; solo se desenlaza.
- **Ilustración de la ruta:** falta su entrada en `src/subject-art.ts` (clave `distribucion`). Hoy muestra la de electrónica por defecto.
- **Archivos propios:** `template.ts`, CSS del portal, `platform-art.ts`, `subject-art.ts`, `subjects.ts` (resto de entradas), renderizado del catálogo y entrada en `main.ts`, y `src/demo/`.

### D4 Panel del supervisor

- **Vista:** al entrar como supervisora, una vista con la cuadrilla de ejemplo (5 o 6 personas ficticias): avance en la ruta, intentos, errores, constancias vigentes o por vencer.
- **Dato real:** si `readResult()` devuelve algo, la fila de «Andrés Rojas» muestra ese resultado real («Completada hoy · N errores · tiempo»). Así, en la demo, la práctica que se acaba de hacer aparece en el panel.
- **Rótulo:** «Datos de demostración» visible.
- **Gancho del editor (opcional, D6):** botón «Crear clase» que abre una maqueta fija del editor por bloques (texto, imagen, video, animación), rotulada «Concepto».
- **Archivos propios:** `src/demo/supervisor*`, `src/demo/datos-ejemplo.ts` y una línea en `main.ts`.

### D3 Lectura breve (opcional)

La lectura ya tiene texto. D3 añade una ilustración de las cinco reglas en `src/content/` siguiendo el patrón de `concept-drawings.ts` (SVG puro, enganchado en `main.ts` junto a los otros dibujos). D6 añade ahí un bloque «Video breve · Concepto» con portada, sin reproducir nada.

### D5 Ensayo

- **En Railway, después del último merge,** recorrer el guion completo:
  1. Entrar como técnico.
  2. Leer la lectura.
  3. Hacer la práctica bien y luego el error: puesta a tierra sin verificar → arco.
  4. Reiniciar y completar la práctica.
  5. Entrar como supervisora y ver el resultado en el panel.
- **Quest:** probar la práctica en las gafas.
  - La práctica reutiliza `enableXR` del laboratorio industrial.
  - En VR se lee el tablero 3D, que está a la izquierda de la escena; el panel HTML no se ve.
  - Si algo falla en las gafas, la práctica se muestra en pantalla.
- **Video de respaldo:** grabar el recorrido.

## Cuidados

- **Carpeta principal:** `laboratorio-vr` está atrasada (`8022e9b`) y tiene cambios sin confirmar en `docs/bitacora.md` y `docs/plan-demo.md` del plan anterior. Ya están superados. No trabajes ahí sin preguntar al responsable si se descartan. Crea tu propia carpeta desde `origin/main`:

  ```bash
  git worktree add ../laboratorio-vr-codex-d1 -b codex/d1-login origin/main
  ```

- **Instalación:** en la carpeta nueva, `npm ci` (o un enlace a `../laboratorio-vr/node_modules` que no se suba a Git).
- **Pruebas:** viven en `src/*.test.ts` (solo el primer nivel de `src/`). `src/distribucion-contract.test.ts` protege el contrato: si cambias ids o el orden de la ruta, falla a propósito.
- **Contenido:** el texto de seguridad está rotulado como didáctico y pendiente de validar con el RETIE y los procedimientos de ESSA. Mantén ese rótulo en todo lo nuevo.
- **Clics en la práctica:** dos clics muy seguidos cuentan como doble toque y el segundo se ignora. En la demo, tocar con calma.
- **Registro:** anota inicio y fin de cada tarea en la [bitácora](bitacora.md) y actualiza el tablero del plan.
