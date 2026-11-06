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
