"""Genera SVG didácticos con Schemdraw 0.23. Ejecutar desde cualquier carpeta."""
from pathlib import Path
import schemdraw
import schemdraw.elements as e
OUT=Path(__file__).resolve().parent.parent/'public'/'esquemas-codex'
OUT.mkdir(exist_ok=True)
schemdraw.config(font='Arial',fontsize=12,color='#24465e',lw=2)
def save(d,name):
 p=OUT/(name+'.svg');d.save(str(p));s=p.read_text();p.write_text(s.replace('font-family="Arial"','font-family="Arial, Helvetica, sans-serif"'))
def chain(name,labels,opened=False):
 with schemdraw.Drawing(show=False) as d:
  for i,label in enumerate(labels):
   if i==1 and opened:d+=e.Switch().right().label(label)
   else:d+=e.RBox().right().label(label)
  save(d,name)
def loop(name,voltage,current,load):
 with schemdraw.Drawing(show=False) as d:
  d+=e.SourceV().up().label(voltage);d+=e.Line().right();d+=e.Resistor().down().label(load);d+=e.Line().left().label(current,loc='bot');save(d,name)
chain('acometida-recorrido',['Red','Protección','Medida','Usuario'])
chain('acometida-control',['Orden','Inspección','Registro'])
chain('medidores-registro',['Equipo','Registro kWh','Lectura'])
chain('medidores-diferencia',['1240 kWh','30 kWh','1270 kWh'])
chain('irregulares-indicio',['Observación','Verificación','Conclusión'])
chain('irregulares-reporte',['Identificación','Evidencia','Reporte'])
chain('suspension-control',['Orden','Punto correcto','Maniobra'])
chain('suspension-reconexion',['Autorización','Control técnico','Reconexión'],True)
loop('potencia-circuito','12 V','2 A','24 W')
chain('potencia-energia',['1 kW','2 h','2 kWh'])
with schemdraw.Drawing(show=False) as d:
 d+=e.SourceSin().up().label('Señal alterna');d+=e.Line().right();d+=e.Resistor().down().label('Carga');d+=e.Line().left();save(d,'alterna-circuito')
with schemdraw.Drawing(show=False) as d:
 for i,(label,phase) in enumerate([('L1','0°'),('L2','−120°'),('L3','+120°')]):
  d+=e.SourceSin().at((i*4,0)).up().label(label+' · '+phase)
 save(d,'alterna-fases')
with schemdraw.Drawing(show=False) as d:
 d+=e.Line().at((0,0)).to((6,0));d+=e.Resistor().at((0,-3)).to((6,-3)).label('Carga');d+=e.Line().at((0,0)).to((0,-3));d+=e.Line().at((6,0)).to((6,-3));d+=e.MeterV().at((3,0)).down().to((3,-3)).label('Tensión entre dos puntos');save(d,'multimetro-tension')
chain('multimetro-pinza',['Conductor individual','Pinza','Lectura A'])
