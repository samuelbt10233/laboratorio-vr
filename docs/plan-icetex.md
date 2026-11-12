# Plan: demo para ICETEX

Reunión con ICETEX el 13 de noviembre de 2026. Se muestra el mismo producto con un perfil propio y dos módulos que encajan con los temas de Comunidad ICETEX: educación financiera y formación complementaria. La demo de ESSA no cambia.

## 1. Cómo se entra

- ESSA: la dirección de siempre.
- ICETEX: la misma dirección con `?cliente=icetex`. El acceso muestra «Preparado para ICETEX» y el perfil «Valentina Ríos · Beneficiaria de crédito educativo», con sus dos módulos asignados y fechas de revisión.
- Sin logo ni colores de ICETEX. «Datos de demostración» se mantiene.

Reglas de contenido:
- Didáctico, en tono profesional y cercano a un estudiante universitario.
- Sin tasas, montos, convocatorias ni condiciones reales de ICETEX; los ejemplos usan cifras redondas y ficticias.
- Cada clase cierra con «Contenido didáctico de demostración. No constituye asesoría financiera.» (finanzas) o «Contenido didáctico de demostración.» (formación complementaria).
- Estructura como las clases de ESSA: 5 secciones, 2 esquemas, evaluación de 3 preguntas con distractores creíbles y respuestas correctas repartidas.

## 2. Módulos, clases y reparto

`★` = lleva práctica interactiva.

| Módulo (`subjectId`) | Clase (`id`) | Título | Agente | Estado |
| --- | --- | --- | --- | --- |
| Educación financiera (`finanzas`) | `finanzas-presupuesto` ★ | Presupuesto y ahorro durante los estudios | Claude | pendiente |
| | `finanzas-credito` | Crédito educativo responsable | Claude | pendiente |
| | `finanzas-fraudes` | Prevención de fraudes y estafas | Claude | pendiente |
| Formación complementaria (`complementaria`) | `complementaria-digital` | Habilidades digitales y seguridad en línea | Codex | pendiente |
| | `complementaria-empleabilidad` | Hoja de vida y entrevista de trabajo | Codex | pendiente |
| | `complementaria-emprendimiento` | Emprender una idea paso a paso | Codex | pendiente |

La práctica de `finanzas-presupuesto` es un simulador: un mes de una estudiante con su presupuesto, imprevistos y una oferta fraudulenta; cada decisión mueve el saldo, el ahorro y la cuota al día.

## 3. Contrato común (I0, Claude)

| Pieza | Valor |
| --- | --- |
| Cliente | `src/demo/cliente.ts`: módulos visibles, módulos asignados, perfiles, ilustración, clase cuya práctica alimenta el inicio y nota de las evaluaciones. Nadie más lo edita |
| Módulos | `finanzas` y `complementaria` en `src/subjects.ts`, con sus 6 clases en `previewContentIds`. El catálogo de cada cliente solo lista sus módulos |
| Fichas provisionales | `src/content/finanzas.ts` (Claude) y `src/content/complementaria.ts` (Codex), registradas en `learning-content.ts` |
| Evaluaciones | `src/demo/evaluaciones-finanzas.ts` (Claude) y `-complementaria.ts` (Codex). Con las preguntas, la clase aparece |
| Imágenes | `src/demo/figuras-finanzas.ts` (Claude, `public/esquemas/`) y `figuras-complementaria.ts` (Codex, `public/esquemas-codex/`), ya enganchadas en `main.ts` |
| Asignaciones | Fechas de revisión de las 6 clases en `src/demo/asignaciones.ts` |
| Pruebas | `src/icetex-plan.test.ts` |

## 4. Qué toca cada agente

| Agente | Archivos propios | No tocar |
| --- | --- | --- |
| Claude | `src/content/finanzas.ts`, `src/demo/{evaluaciones,figuras}-finanzas.ts`, `scripts/esquemas.py`, `public/esquemas/`, `src/labs/presupuesto/` | Archivos de Codex |
| Codex | `src/content/complementaria.ts`, `src/demo/{evaluaciones,figuras}-complementaria.ts`, `scripts/esquemas-codex.py`, `public/esquemas-codex/` | Archivos de Claude |
| Compartidos | `src/labs/registry.ts` (una línea por laboratorio), `docs/bitacora.md` (solo añadir al final), tablero de este documento (solo la columna «Estado» de sus filas) | — |

## 5. Para dar una clase por terminada

- `npm test` y `npm run build` pasan.
- La clase se ve completa en `/?cliente=icetex` (explicación con esquemas, evaluación aprobada y suspendida) y la demo de ESSA sigue igual.
- La bitácora registra qué se hizo y qué quedó pendiente; el PR lleva captura.
- El responsable hace cada merge: integrar es desplegar en Railway.

## 6. Encargo para Codex

Tras el merge de I0, desde `main` actualizado y en una rama `codex/i2-complementaria`:

1. Sustituir las fichas provisionales de `src/content/complementaria.ts` por las 3 clases completas (secciones 1 y 2).
2. Escribir las 3 preguntas de cada clase en `src/demo/evaluaciones-complementaria.ts`, con distractores creíbles (no opciones absurdas).
3. Generar 2 esquemas por clase con `scripts/esquemas-codex.py` en `public/esquemas-codex/` y enlazarlos en `src/demo/figuras-complementaria.ts`.
4. Marcar el estado de sus filas, registrar en la bitácora y abrir PR, sin integrar.
5. Si queda tiempo: revisar los distractores de `src/demo/evaluaciones-medida.ts`.
