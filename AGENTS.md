# Instrucciones para agentes

Esta demo se desarrolla en paralelo con Claude Code y Codex, y su objetivo es conseguir un cliente: una empresa de distribución eléctrica que quiere capacitar a su personal. Lo que importa es lo que verá el cliente, no la calidad del código a largo plazo; el producto final empezará de cero.

Antes de hacer cambios:

1. Lee [docs/plan-demo-energia.md](docs/plan-demo-energia.md): objetivo, guion, tablero, archivos de cada tarea y reglas. El plan anterior, [docs/plan-demo.md](docs/plan-demo.md), queda como historial.
2. Lee el final de [docs/bitacora.md](docs/bitacora.md) y revisa `git status`.
3. Trabaja solo en una tarea asignada a ti, en tu propia carpeta y rama. Marca el inicio en el tablero y en la bitácora.
4. No edites archivos de otra tarea: anótalo en la bitácora y coordina con el responsable.

Antes de integrar: `npm test` y `npm run build` deben pasar, y la bitácora debe recoger qué se hizo, por qué y qué quedó pendiente.

Referencia técnica del código existente: [INTEGRACION_AGENTES.md](INTEGRACION_AGENTES.md). Si choca con el plan en lo referente a arquitectura o refactorización, manda el plan.
