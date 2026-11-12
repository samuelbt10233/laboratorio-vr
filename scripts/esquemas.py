"""Genera los esquemas de las clases de distribución y operación con Schemdraw (pip install schemdraw).
Uso: python scripts/esquemas.py  →  public/esquemas/*.svg. Contenido didáctico: validar con el RETIE y ESSA."""
from pathlib import Path
import schemdraw
import schemdraw.elements as elm
import schemdraw.flow as flow

INK, BLUE, YELLOW, MUTED = '#17242b', '#1d4f73', '#f2c230', '#5d6b72'
OUT = Path(__file__).resolve().parent.parent / 'public' / 'esquemas'
schemdraw.config(font='sans-serif', fontsize=13, color=INK, lw=2)
GAP = 1.4  # separación vertical entre fases
WIDTH = 12


def fases(d, desde=0, hasta=WIDTH, cortes=()):
    """Tres conductores L1-L3; `cortes` reserva huecos (x0, x1) para insertar elementos."""
    for i, nombre in enumerate(('L1', 'L2', 'L3')):
        y = -i * GAP
        x = desde
        d += elm.Label().at((desde - .2, y)).label(nombre, loc='left', color=MUTED)
        for x0, x1 in cortes:
            d += elm.Line().at((x, y)).to((x0, y))
            x = x1
        d += elm.Line().at((x, y)).to((hasta, y))


def guardar(d, nombre):
    ruta = OUT / f'{nombre}.svg'
    d.save(str(ruta), transparent=True)
    # Dentro de <img> el SVG no hereda la fuente de la página: se fija una pila sans-serif real.
    svg = ruta.read_text(encoding='utf-8')
    ruta.write_text(svg.replace('font-family="sans"', 'font-family="IBM Plex Sans, Helvetica, Arial, sans-serif"'), encoding='utf-8')


def cortar_bloquear():
    with schemdraw.Drawing(show=False) as d:
        fases(d, cortes=[(4, 6)])
        for i in range(3):
            d += elm.Switch().at((4, -i * GAP)).to((6, -i * GAP))
        d += elm.Line(ls='--', color=BLUE).at((5, .7)).to((5, -2 * GAP - .5))
        d += elm.Label().at((5, -2 * GAP - 1)).label('Seccionador abierto: corte visible', color=MUTED)
        d += elm.Label().at((5, 1.2)).label('Bloqueo y tarjeta «No operar»', color=BLUE)
        guardar(d, 'cinco-reglas-1-cortar')


def verificar():
    with schemdraw.Drawing(show=False) as d:
        fases(d)
        for i in range(3):
            x = 3 + i * 3
            d += elm.Dot().at((x, -i * GAP))
            d += elm.Line().at((x, -i * GAP)).to((x, -2 * GAP - 1))
            d += elm.MeterV().down().at((x, -2 * GAP - 1)).label('0 V', loc='bot', ofst=.3, color=BLUE).color(BLUE)
            d += elm.Ground()
        d += elm.Label().at((6, -2 * GAP - 5.2)).label('Detector probado antes y después; una medida por fase', color=MUTED)
        guardar(d, 'cinco-reglas-2-verificar')


def poner_tierra():
    with schemdraw.Drawing(show=False) as d:
        fases(d)
        for x in (2, 10):
            for i in range(3):
                d += elm.Dot().at((x, -i * GAP)).color(BLUE)
            d += elm.Line(color=BLUE).at((x, 0)).to((x, -2 * GAP - 1))
            d += elm.Ground().color(BLUE)
        d += elm.Line(ls='--', color=MUTED).at((3.2, .6)).to((8.8, .6))
        d += elm.Line(ls='--', color=MUTED).at((3.2, -2 * GAP - .6)).to((8.8, -2 * GAP - .6))
        d += elm.Label().at((6, -2 * GAP - 1.1)).label('Zona de trabajo', color=MUTED)
        d += elm.Label().at((2, -2 * GAP - 2.4)).label('Tierra y cortocircuito', color=BLUE)
        d += elm.Label().at((10, -2 * GAP - 2.4)).label('Tierra y cortocircuito', color=BLUE)
        guardar(d, 'cinco-reglas-3-tierra')


def senalizar():
    with schemdraw.Drawing(show=False) as d:
        fases(d)
        for x in (2, 10):
            for i in range(3):
                d += elm.Dot().at((x, -i * GAP)).color(BLUE)
            d += elm.Line(color=BLUE).at((x, 0)).to((x, -2 * GAP - 1))
            d += elm.Ground().color(BLUE)
        d += elm.Line(ls='--', color=YELLOW, lw=4).at((3, 1)).to((9, 1))
        d += elm.Line(ls='--', color=YELLOW, lw=4).at((9, 1)).to((9, -2 * GAP - 1))
        d += elm.Line(ls='--', color=YELLOW, lw=4).at((9, -2 * GAP - 1)).to((3, -2 * GAP - 1))
        d += elm.Line(ls='--', color=YELLOW, lw=4).at((3, -2 * GAP - 1)).to((3, 1))
        d += elm.Label().at((6, -2 * GAP - 1.6)).label('Zona delimitada y señalizada', color=MUTED)
        guardar(d, 'cinco-reglas-4-senalizar')


# --- Clases de distribución y operación (docs/plan-clases.md) ---

def cadena(d, pasos, ancho=3.2, alto=1.3, color=INK):
    """Pasos en fila unidos por flechas; devuelve las cajas."""
    cajas = []
    for i, texto in enumerate(pasos):
        if i:
            d += flow.Arrow().right(.8).at(cajas[-1].E).color(MUTED)
            caja = d.add(flow.Box(w=ancho, h=alto).label(texto, fontsize=12).color(color).anchor('W'))
        else:
            caja = d.add(flow.Box(w=ancho, h=alto).label(texto, fontsize=12).color(color))
        cajas.append(caja)
    return cajas


def decision(d, desde, si, no, pregunta):
    """Rombo tras `desde` con salida a la derecha (sí) y hacia abajo (no)."""
    d += flow.Arrow().right(.8).at(desde.E).color(MUTED)
    rombo = flow.Decision(w=3.4, h=2, E='Sí', S='No').label(pregunta, fontsize=11).anchor('W')
    d += rombo
    d += flow.Arrow().right(.8).at(rombo.E).color(MUTED)
    d += flow.Box(w=2.6, h=1.2).label(si, fontsize=12).anchor('W').color(BLUE)
    d += flow.Arrow().down(.8).at(rombo.S).color(MUTED)
    d += flow.Box(w=2.6, h=1.2).label(no, fontsize=12).anchor('N').color('#a33a2b')


def epp_equipo():
    with schemdraw.Drawing(show=False) as d:
        d += flow.Box(w=5, h=2.6).label('Equipo básico\n\ncasco · gafas o careta\nropa ignífuga · botas', fontsize=12)
        d += flow.Box(w=5, h=2.6).at((6, 0)).anchor('W').label('Equipo dieléctrico\n\nguantes de su clase\ny protector de cuero\nmangas · cubiertas', fontsize=12).color(BLUE)
        d += elm.Label().at((5.5, -2)).label('Se suma el dieléctrico cerca de partes energizadas', color=MUTED)
        guardar(d, 'epp-1-equipo')


def epp_inspeccion():
    with schemdraw.Drawing(show=False) as d:
        cajas = cadena(d, ['Revisión\nvisual', 'Inflado del\nguante'], ancho=2.6)
        decision(d, cajas[-1], 'Usar', 'Retirar y\nreportar', '¿Ensayo\nvigente y\nsin daños?')
        guardar(d, 'epp-2-inspeccion')


def distancias_zonas():
    with schemdraw.Drawing(show=False) as d:
        d += flow.Circle(r=3.6).at((0, 0)).anchor('center').color(MUTED).label('', loc='top')
        d += flow.Circle(r=2.3).at((0, 0)).anchor('center').color(YELLOW)
        d += flow.Circle(r=1.1).at((0, 0)).anchor('center').color('#a33a2b')
        d += elm.Dot(radius=.18).at((0, 0)).color(INK)
        d += elm.Label().at((0, -.45)).label('Conductor', fontsize=11)
        d += elm.Line(color=MUTED).at((.8, .7)).to((5.2, 2.2))
        d += elm.Label().at((5.3, 2.2)).label('Zona de peligro: solo trabajo en tensión', loc='right', color='#a33a2b')
        d += elm.Line(color=MUTED).at((1.9, 1.2)).to((5.2, .7))
        d += elm.Label().at((5.3, .7)).label('Zona de proximidad: personal calificado y controles', loc='right', color=INK)
        d += elm.Line(color=MUTED).at((3.3, -1.3)).to((5.2, -.8))
        d += elm.Label().at((5.3, -.8)).label('Fuera de las zonas: sin restricción eléctrica', loc='right', color=MUTED)
        d += elm.Label().at((5.3, -2.3)).label('El tamaño de cada zona depende de la tensión', loc='right', color=MUTED)
        guardar(d, 'distancias-1-zonas')


def distancias_controles():
    with schemdraw.Drawing(show=False) as d:
        d += flow.Decision(w=4, h=2.2, E='Sí', S='No').label('¿Se garantiza\nla distancia?', fontsize=11)
        rombo = d.elements[-1]
        d += flow.Arrow().right(1).at(rombo.E).color(MUTED)
        d += flow.Box(w=3.2, h=1.2).label('Trabajar con\nobservación', fontsize=12).anchor('W').color(BLUE)
        d += flow.Arrow().down(1).at(rombo.S).color(MUTED)
        d += flow.Box(w=5.6, h=1.6).label('Desenergizar, o barreras y\ncubiertas aislantes\ncon observador dedicado', fontsize=12).anchor('N')
        guardar(d, 'distancias-2-controles')


def ats_columnas():
    with schemdraw.Drawing(show=False) as d:
        cadena(d, ['Paso\nAscenso al poste', 'Peligro\nCaída de altura', 'Control\nLínea de vida,\narnés, inspección'], ancho=3.8, alto=1.8)
        guardar(d, 'ats-1-columnas')


def ats_jerarquia():
    with schemdraw.Drawing(show=False) as d:
        niveles = ['Eliminar el peligro', 'Aislarlo', 'Procedimientos', 'Equipo de protección']
        for i, texto in enumerate(niveles):
            ancho = 9 - i * 1.6
            d += flow.Box(w=ancho, h=1).at((0, -i * 1.2)).anchor('N').label(texto, fontsize=12).color(BLUE if i == 0 else INK)
        d += elm.Label().at((5.6, -.5)).label('Más eficaz', loc='right', color=BLUE)
        d += elm.Label().at((5.6, -4.1)).label('Último recurso', loc='right', color=MUTED)
        guardar(d, 'ats-2-jerarquia')


def alturas_inspeccion():
    with schemdraw.Drawing(show=False) as d:
        cadena(d, ['Base y\nverticalidad', 'Fisuras y\nherrajes', 'Redes\ncercanas', 'Subir\nconectado'], ancho=2.6)
        guardar(d, 'alturas-1-inspeccion')


def alturas_sistema():
    with schemdraw.Drawing(show=False) as d:
        cadena(d, ['Punto de\nanclaje', 'Conector:\neslinga o\nlínea de vida', 'Arnés de\ncuerpo\ncompleto'], ancho=3, alto=1.8, color=BLUE)
        d += elm.Label().at((5.3, -1.6)).label('Conexión permanente; doble conexión al pasar obstáculos', color=MUTED)
        guardar(d, 'alturas-2-sistema')


def cortacircuitos_esquema():
    with schemdraw.Drawing(show=False) as d:
        fases(d, hasta=4)
        for i in range(3):
            y = -i * GAP
            d += elm.Fuse().at((4, y)).to((6, y)).color(BLUE)
            d += elm.Line().at((6, y)).to((8, y))
        d += elm.Label().at((5, .8)).label('Cortacircuitos', color=BLUE)
        d += flow.Box(w=1.6, h=2 * GAP + .8).at((8, .4)).anchor('NW').label('Trafo', fontsize=12)
        d += elm.Label().at((2, -2 * GAP - .9)).label('Red de media tensión', color=MUTED)
        guardar(d, 'cortacircuitos-1-esquema')


def cortacircuitos_orden():
    with schemdraw.Drawing(show=False) as d:
        for i, (nombre, abre, cierra) in enumerate((('L1', '2', '2'), ('L2', '1', '3'), ('L3', '3', '1'))):
            x = i * 3.4
            d += elm.Fuse().at((x, 0)).to((x, -2)).color(BLUE)
            d += elm.Label().at((x, .5)).label(nombre, color=MUTED)
            d += elm.Label().at((x, -2.6)).label(f'Abre {abre}.º · cierra {cierra}.º', fontsize=12)
        d += elm.Label().at((3.4, -3.6)).label('Primero la central; el cierre en orden inverso', color=MUTED)
        guardar(d, 'cortacircuitos-2-orden')


def transformador_partes():
    with schemdraw.Drawing(show=False) as d:
        d += elm.Line().at((0, 0)).to((1.5, 0))
        d += elm.Fuse().right().label('Cortacircuitos', loc='top', fontsize=11)
        d += elm.Line().right(1.5)
        d += (t := elm.Transformer(t1=4, t2=4).anchor('p1').label('Transformador', loc='top', ofst=.3))
        d += elm.Line().at(t.s1).right(1.5)
        d += elm.Label().label('Baja tensión', loc='right', color=MUTED, ofst=(0, -.6))
        d += elm.Label().at((0, -.6)).label('Media tensión', loc='right', color=MUTED)
        d += elm.Line().at(t.p2).down(.6)
        d += elm.Ground().color(BLUE)
        d += elm.Line().at(t.s2).down(.6)
        d += elm.Ground().color(BLUE)
        d += elm.Label().at((t.p2.x + .9, t.p2.y - 1.9)).label('Tanque y neutro a tierra', color=BLUE)
        guardar(d, 'transformador-1-partes')


def transformador_placa():
    with schemdraw.Drawing(show=False) as d:
        placa = d.add(flow.Box(w=7, h=3.6).label('Potencia nominal (kVA)\nTensión primaria / secundaria\nGrupo de conexión\nImpedancia (%)\nNúmero de serie', fontsize=12))
        d += elm.Label().at((placa.N.x, placa.N.y + .5)).label('Placa de características', color=BLUE)
        guardar(d, 'transformador-2-placa')


def tierra_componentes():
    with schemdraw.Drawing(show=False) as d:
        for x, nombre in ((0, 'Pararrayos'), (3, 'Tanque del\ntransformador'), (6, 'Neutro')):
            d += flow.Box(w=2.4, h=1.2).at((x, 0)).anchor('center').label(nombre, fontsize=11)
            d += elm.Line(color=BLUE).at((x, -.6)).to((x, -1.6))
        d += elm.Line(color=BLUE).at((0, -1.6)).to((6, -1.6))
        d += elm.Line(color=BLUE).at((3, -1.6)).to((3, -3))
        d += elm.Ground().color(BLUE).label('Electrodo enterrado', loc='bot', ofst=.4)
        guardar(d, 'puesta-tierra-1-componentes')


def tierra_medicion():
    with schemdraw.Drawing(show=False) as d:
        d += elm.Line(color=MUTED).at((-1, 0)).to((12, 0))
        for x, nombre, color in ((0, 'E\nbajo prueba', INK), (5.5, 'P\npotencial', BLUE), (11, 'C\ncorriente', BLUE)):
            d += elm.Line(color=color, lw=4).at((x, .3)).to((x, -1.6))
            d += elm.Label().at((x, -2.4)).label(nombre, fontsize=12, color=color)
        medidor = d.add(flow.Box(w=3.4, h=1.1).at((5.5, 3.4)).anchor('center').label('Medidor de tierra', fontsize=12).color(BLUE))
        for x in (0, 5.5, 11):
            d += elm.Line(color=MUTED, ls='--').at((x, .3)).to((min(max(x, 4), 7), medidor.S.y))
        d += elm.Label().at((5.5, -3.6)).label('Electrodos en línea, a la distancia del procedimiento', color=MUTED)
        guardar(d, 'puesta-tierra-2-medicion')


def inspeccion_metodo():
    with schemdraw.Drawing(show=False) as d:
        cadena(d, ['Base', 'Poste', 'Herrajes', 'Aisladores', 'Conductores\ny equipos'], ancho=2.2, alto=1)
        d += elm.Label().at((6.4, -1.3)).label('En cada estructura, de abajo hacia arriba; poste a poste, en un sentido', color=MUTED)
        guardar(d, 'inspeccion-1-metodo')


def inspeccion_reporte():
    with schemdraw.Drawing(show=False) as d:
        ficha = d.add(flow.Box(w=6.4, h=3).label('Código de la estructura\nDescripción de la anomalía\nFotografía\nPrioridad', fontsize=12))
        d += elm.Label().at((ficha.N.x, ficha.N.y + .5)).label('Datos mínimos del reporte', color=BLUE)
        d += elm.Label().at((ficha.S.x, ficha.S.y - .6)).label('Riesgo inmediato: asegurar la zona y avisar al centro de control', color='#a33a2b')
        guardar(d, 'inspeccion-2-reporte')


CLASES = (epp_equipo, epp_inspeccion, distancias_zonas, distancias_controles, ats_columnas, ats_jerarquia,
          alturas_inspeccion, alturas_sistema, cortacircuitos_esquema, cortacircuitos_orden, transformador_partes,
          transformador_placa, tierra_componentes, tierra_medicion, inspeccion_metodo, inspeccion_reporte)


# --- Educación financiera (docs/plan-icetex.md); cifras ficticias ---

def presupuesto_reparto():
    with schemdraw.Drawing(show=False) as d:
        d += flow.Box(w=11, h=1).at((0, 0)).anchor('W').label('Ingresos del mes', fontsize=12).color(INK)
        partes = (('Fijos y cuota', 6, INK), ('Ahorro', 1.5, BLUE), ('Variables', 3.5, MUTED))
        x = 0
        for texto, ancho, color in partes:
            d += flow.Box(w=ancho, h=1).at((x, -1.6)).anchor('W').label(texto, fontsize=11).color(color)
            x += ancho
        d += elm.Label().at((5.5, -2.8)).label('1.º fijos y cuota, 2.º ahorro, 3.º lo variable', color=MUTED)
        guardar(d, 'presupuesto-1-reparto')


def presupuesto_imprevisto():
    with schemdraw.Drawing(show=False) as d:
        cajas = cadena(d, ['Gasto no\nplaneado'], ancho=2.6)
        decision(d, cajas[-1], 'Fondo para\nimprevistos', 'Esperar y\nplanearlo', '¿Se puede\naplazar?')
        guardar(d, 'presupuesto-2-imprevisto')


def credito_componentes():
    with schemdraw.Drawing(show=False) as d:
        cadena(d, ['Capital\nprestado', 'Interés\ncosto del dinero', 'Plazo\nnúmero de cuotas', 'Cuota\npago periódico'], ancho=3, alto=1.5)
        d += elm.Label().at((7.4, -1.4)).label('Más plazo: cuota menor, total pagado mayor', color=MUTED)
        guardar(d, 'credito-1-componentes')


def credito_dificultad():
    with schemdraw.Drawing(show=False) as d:
        cajas = cadena(d, ['Revisar el\nplan de pagos'], ancho=2.6)
        decision(d, cajas[-1], 'Pagar a tiempo\npor canal oficial', 'Contactar a\nla entidad', '¿Alcanza\npara la\ncuota?')
        guardar(d, 'credito-2-dificultad')


def fraudes_senales():
    with schemdraw.Drawing(show=False) as d:
        ficha = d.add(flow.Box(w=7.4, h=3.2).label('Rentabilidad alta y garantizada\nPresión para decidir ya\nPago anticipado para liberar dinero\nPide claves o códigos', fontsize=12))
        d += elm.Label().at((ficha.N.x, ficha.N.y + .5)).label('Señales de alerta', color='#a33a2b')
        d += elm.Label().at((ficha.S.x, ficha.S.y - .6)).label('Mucho, rápido y sin riesgo: desconfiar', color=MUTED)
        guardar(d, 'fraudes-1-senales')


def fraudes_verificar():
    with schemdraw.Drawing(show=False) as d:
        cajas = cadena(d, ['Oferta o\nmensaje', 'Ir al canal\noficial'], ancho=2.6)
        decision(d, cajas[-1], 'Continuar', 'No pagar\ny reportar', '¿Entidad\nvigilada y\ncoincide?')
        guardar(d, 'fraudes-2-verificar')


FINANZAS = (presupuesto_reparto, presupuesto_imprevisto, credito_componentes, credito_dificultad,
            fraudes_senales, fraudes_verificar)


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    for f in (cortar_bloquear, verificar, poner_tierra, senalizar, *CLASES, *FINANZAS):
        f()
    print('\n'.join(sorted(p.name for p in OUT.glob('*.svg'))))
