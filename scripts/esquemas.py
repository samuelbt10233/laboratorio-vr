"""Genera los esquemas de «Las cinco reglas de oro» con Schemdraw (pip install schemdraw).
Uso: python scripts/esquemas.py  →  public/esquemas/*.svg. Contenido didáctico: validar con el RETIE y ESSA."""
from pathlib import Path
import schemdraw
import schemdraw.elements as elm

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


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    for f in (cortar_bloquear, verificar, poner_tierra, senalizar):
        f()
    print('\n'.join(sorted(p.name for p in OUT.glob('*.svg'))))
