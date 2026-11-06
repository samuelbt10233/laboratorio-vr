import { platformArtwork, introArtwork } from './platform-art';
const resistorIcon = '<svg viewBox="0 0 32 24" aria-hidden="true"><path d="M1 12h5l3-6 4 12 4-12 4 12 3-6h7"/></svg>';
const switchIcon = '<svg viewBox="0 0 32 24" aria-hidden="true"><path d="M1 16h7m16 0h7M9 15 23 5"/><circle cx="8" cy="16" r="2"/><circle cx="24" cy="16" r="2"/></svg>';
export const layout = `
<header class="atlas-header" aria-label="Navegación principal">
  <a class="brand" href="#" aria-label="Umbral Labs"><span class="brand-symbol">u</span><span class="sidebar-brand-name">umbral<span class="brand-tag">labs</span></span></a>
  <nav aria-label="Experiencias de aprendizaje"><span class="portal-nav-label">PLATAFORMA</span>
    <button class="nav-item active" data-nav-filter="all" aria-current="page">Inicio</button>
    <div id="laboratory-nav"></div><span class="portal-nav-label">COMIENZA AQUÍ</span>
    
    <button class="nav-item" id="welcome-nav">Bienvenida</button>
  </nav>
  <button id="quick-search" class="atlas-search" aria-label="Buscar experiencias" title="Buscar experiencias (Ctrl K)"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 5 5"/></svg><span>Buscar</span><kbd>Ctrl K</kbd></button>
<div class="portal-sidebar-footer"><span class="online-dot"></span> Aprendizaje en tu navegador<small>PC · Meta Quest</small></div></header>
<div class="app-content">
<header class="app-topbar"><div class="topbar-context">Umbral <span>/</span> <span id="header-context">Catálogo de experiencias</span></div><div class="header-right"><button id="back-menu" class="back-menu" hidden>← Clases del laboratorio</button><span class="demo">VERSIÓN DE DEMOSTRACIÓN</span></div></header>
<main id="main-menu" class="menu-page">
  <nav id="catalogue-path" class="catalogue-path" aria-label="Ubicación" hidden><button id="catalogue-home">Inicio</button><span aria-hidden="true">/</span><span id="catalogue-lab-name"></span></nav>
  <section class="menu-hero">
    <div class="menu-hero-copy"><div class="menu-kicker" id="menu-kicker">APRENDIZAJE QUE PUEDES EXPLORAR</div><h1 id="menu-title"><span id="menu-title-lead">El conocimiento se construye</span> <em id="menu-title-accent">explorando.</em></h1><p id="menu-subtitle">Del concepto al descubrimiento. Empieza con la bienvenida o elige un laboratorio para aprender haciendo.</p><div class="atlas-hero-actions"><button id="browse-labs" class="atlas-primary">Explorar laboratorios <span aria-hidden="true">↗</span></button><button id="hero-welcome" class="atlas-text-button">Primera vez por aquí →</button></div></div>
    <div class="atlas-art" id="catalogue-art"><span class="atlas-art-tag">LABORATORIO 01 / ELECTRÓNICA</span>${introArtwork('catalogue-hero')}<div class="atlas-art-caption"><span class="intro-captions" aria-hidden="true"><span>01 / CONECTA LOS ELEMENTOS</span><span>02 / CIERRA EL CIRCUITO</span><span>03 / OBSERVA LA CORRIENTE</span></span><span>UMBRAL LABS</span></div></div>
  </section>
  <section class="learning-route" aria-labelledby="learning-route-title"><div><span class="welcome-eyebrow">UN RECORRIDO, MUCHAS POSIBILIDADES</span><h2 id="learning-route-title">Comprende. Experimenta. Descubre.</h2><p>Una propuesta para conectar la formación universitaria y la capacitación de empresas con la práctica en entornos virtuales.</p></div><ol><li><span>01</span><strong>Elige una materia</strong><p>Encuentra una clase y conoce qué vas a aprender.</p></li><li><span>02</span><strong>Comprende la idea</strong><p>Lee la explicación y los ejemplos a tu ritmo.</p></li><li><span>03</span><strong>Ponla a prueba</strong><p>Entra al laboratorio disponible y aprende experimentando.</p></li></ol></section>
  <section class="catalogue-band"><div class="catalogue-search-frame"><label class="catalogue-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 5 5"/></svg><input id="experience-search" type="search" aria-label="Buscar clases y laboratorios" placeholder="Buscar una clase o laboratorio…" autocomplete="off"/><span class="search-shortcut"><kbd>Ctrl</kbd><kbd>K</kbd></span></label></div>
  <section class="experience-catalogue" aria-labelledby="catalogue-title">
    <div class="catalogue-heading"><div><div class="eyebrow">EXPLORA UMBRAL</div><h2 id="catalogue-title">Bienvenida y laboratorios</h2><p id="catalogue-description" class="catalogue-description">Elige una materia para descubrir sus clases.</p></div><span id="catalogue-result-count" class="catalogue-count" role="status" aria-live="polite">2 experiencias</span></div>
    <div id="class-filters" class="class-filters" role="group" aria-label="Filtrar experiencias" hidden><button data-entry-filter="all" aria-pressed="true">Todas</button><button data-entry-filter="class" aria-pressed="false">Clases con contenido</button><button data-entry-filter="free" aria-pressed="false">Modo libre</button></div>
    <ul class="experience-list"></ul>
    <div id="empty-catalogue" class="empty-catalogue" hidden><h3>No hay experiencias para mostrar</h3><p id="empty-catalogue-text">Prueba con otra búsqueda.</p><button id="reset-catalogue">Ver todas las experiencias</button></div>
    <div class="catalogue-note"><span class="online-dot"></span> Disponible en PC desde tu navegador <span>·</span> Puedes guardar tus montajes en este navegador.</div>
  </section>
  </section>
  <section id="getting-started" class="getting-started" aria-labelledby="getting-started-title">
    <div class="getting-started-heading"><div><span class="welcome-eyebrow">BIENVENIDO A UMBRAL LABS</span><h2 id="getting-started-title">¿Es tu primera visita?</h2><p>Conoce los controles y a tu guía. El tutorial utiliza una mesa de electrónica para practicar.</p></div><button id="start-tutorial" class="start-tutorial">Abrir bienvenida <span aria-hidden="true">↗</span></button></div>
    <ol class="getting-started-steps">
      <li><span class="welcome-number" aria-hidden="true">1</span><div><h3>Aprende los controles</h3><p>En «Primeros pasos» practicarás cómo seleccionar, mover y conectar elementos, con ayuda del guía.</p></div></li>
      <li><span class="welcome-number" aria-hidden="true">2</span><div><h3>Elige una materia</h3><p>Lee el contenido de una clase y después comprueba lo aprendido en su laboratorio.</p></div></li>
      <li><span class="welcome-number" aria-hidden="true">3</span><div><h3>Explora a tu ritmo</h3><p>En el modo libre puedes crear tus propios circuitos y ver cómo cambian las lecturas y las gráficas.</p></div></li>
    </ol>
  </section>
  <details class="home-help">
    <summary><span>Controles y consejos rápidos</span><span class="home-help-toggle" aria-hidden="true">+</span></summary>
    <div class="home-help-grid">
      <article><h3>En tu PC</h3><p>Pulsa la escena y usa <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> para desplazarte. Arrastra con el botón derecho para girar la vista y usa la rueda para acercarte.</p><p>Pulsa un elemento o su nombre en la lista para seleccionarlo. Arrastra su cuerpo o usa las flechas de «Propiedades» para moverlo.</p></article>
      <article><h3>Dentro del laboratorio</h3><p>El panel izquierdo permite añadir elementos; el derecho muestra sus propiedades. Para crear un cable, pulsa un terminal y después otro. Para quitarlo, abre «Cables» y pulsa su cruz.</p><p>Para cambiar un valor, pulsa el número y confirma con «Aplicar». En PC también puedes escribir y pulsar <kbd>Enter</kbd>.</p></article>
      <article><h3>Tu guía y tus montajes</h3><p>Pulsa «Escuchar» para oír al guía y abre la explicación o las pistas para leer más. Al completar una actividad verás una confirmación y podrás continuar.</p><p>«Guardar» conserva el montaje en este navegador y dispositivo; «Recuperar» lo carga después. Guardar reemplaza el montaje anterior. Cargar un ejemplo también reemplaza la mesa actual.</p></article>
      <article><h3>Con Meta Quest</h3><p>Abre esta página en el navegador de las gafas, elige una experiencia y pulsa «Iniciar clase» o «Iniciar simulación». Si VR está disponible, solicitaremos acceso a las gafas. Apunta con el mando y usa el gatillo para seleccionar. La palanca izquierda permite ir a las zonas marcadas.</p><p>Los paneles y el guía permanecen dentro del entorno. «Vista Quest en PC» permite revisar esa distribución con ratón; no activa la realidad virtual.</p></article>
    </div>
  </details>
  <footer><span>UMBRAL LABS <i></i> Un espacio para aprender experimentando.</span><span>Versión de demostración</span></footer>
</main>
<main id="study-view" class="study-page" hidden>
  <ol class="course-route portal-wrap" aria-label="Etapas de la experiencia"><li aria-current="step"><span>01</span> Comprende la idea</li><li><span>02</span> Prepara tu espacio</li><li><span>03</span> Experimenta en 3D</li></ol>
  <section class="study-hero"><div class="portal-wrap"><button id="study-back" class="atlas-text-button">← <span id="study-subject"></span></button><div class="study-intro"><div><span class="welcome-eyebrow">APRENDE ANTES DE EXPERIMENTAR</span><h1 id="study-title"></h1><p id="study-description"></p></div><aside class="study-facts"><span>EN ESTA CLASE</span><strong id="study-duration"></strong><p id="study-section-count">Contenido introductorio</p><p id="study-status"></p><a href="#study-practice">Ver la práctica ↓</a></aside></div></div></section>
  <div class="reading-layout portal-wrap"><aside class="reading-index"><span class="welcome-eyebrow">TU RECORRIDO</span><nav id="study-outline" aria-label="Contenido de la clase"></nav><p>Lee a tu ritmo. Al final encontrarás el acceso a la práctica.</p></aside><div id="study-sections"></div></div>
  <section id="study-practice" class="practice-band"><div class="portal-wrap"><div><span class="welcome-eyebrow">DEL CONCEPTO A LA EXPERIENCIA</span><h2 id="study-lab-title"></h2><p id="study-practice-description"></p></div><button id="study-prepare" class="atlas-primary"></button></div></section>
  <footer class="portal-wrap"><span>UMBRAL LABS · Aprende experimentando.</span><span>Versión de demostración</span></footer>
</main>
<main id="external-lab" hidden><button id="external-back">← Volver al contenido</button><div id="external-lab-host"></div></main>
<main id="launch-view" class="menu-page launch-page" hidden>
  <div class="atlas-launch-path"><button id="launch-back" class="atlas-text-button">← Volver al catálogo</button><span>Antes de empezar</span></div>
  <div class="atlas-launch-layout">
    <section class="atlas-class-intro" aria-labelledby="launch-title"><span class="welcome-eyebrow" id="launch-category">CLASE GUIADA</span><h1 id="launch-title"></h1><p id="launch-description"></p><div class="launch-meta" id="launch-meta"></div><div class="atlas-class-preview">${platformArtwork('class-preview')}<span>ILUSTRACIÓN DEL LABORATORIO</span></div><div class="atlas-outcomes"><h2>Lo que vas a descubrir</h2><p id="launch-outcomes"></p></div></section>
    <aside class="launch-card" aria-labelledby="launch-card-title">
      <span class="welcome-eyebrow">A TU RITMO, DESDE EL PRINCIPIO</span><h2 id="launch-card-title">Prepara tu espacio.</h2><p>Tu guía esperará hasta que estés listo. Acomódate antes de comenzar.</p>
      <div class="atlas-device" id="launch-device" role="status">Comprobando el modo de inicio…</div>
      <button id="start-simulation" class="start-tutorial" disabled>Iniciar clase</button>
      <button id="launch-restart" class="atlas-text-button" hidden>Empezar desde el principio</button>
      <p id="launch-error" role="alert" hidden></p><button id="launch-window" hidden>Continuar en esta ventana</button>
      <p class="launch-note"><span aria-hidden="true">◌</span> La simulación y el audio esperan hasta que pulses iniciar.</p>
      <div class="atlas-launch-steps"><span class="welcome-eyebrow">ASÍ SERÁ TU EXPERIENCIA</span><ol class="launch-steps"><li>Entra al entorno 3D en tu PC o tus gafas.</li><li>Escucha al guía y realiza la actividad.</li><li>Recibe confirmación y continúa.</li></ol></div>
    </aside>
  </div>
  <footer><span>UMBRAL LABS <i></i> Aprender haciendo, desde cualquier lugar.</span><span>Versión de demostración</span></footer>
</main>
<main id="lab-view" hidden>
  <div class="breadcrumb">Laboratorios <span>›</span> Física e ingeniería <span>›</span><strong>Electrónica básica</strong></div>
  <section class="heading">
    <div class="heading-copy"><div class="eyebrow"><span></span> LABORATORIO 01</div><h1>Circuitos eléctricos<span>.</span></h1><p>Conecta ideas. Construye, experimenta y descubre cómo fluye la corriente.</p></div>
    <div class="heading-actions"><div class="session-meta"><span>Corriente continua</span><i></i><span>Nivel introductorio</span></div><div class="mode" aria-label="Modo de práctica"><button id="class-mode" class="active" aria-pressed="true"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m3 5 7-3 7 3-7 3-7-3Zm2 2v6l5 3 5-3V7M17 6v6"/></svg>Clase guiada</button><button id="free-mode" aria-pressed="false"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m10 2 7 4v8l-7 4-7-4V6l7-4Zm-7 4 7 4 7-4m-7 4v8"/></svg>Modo libre</button></div></div>
  </section>
  <p id="xr-status" class="xr-status" role="status">Comprobando compatibilidad con VR…</p>
  <div class="workspace">
    <div class="lab-stage">
      <div class="stage-heading"><div><span class="stage-icon">⌘</span><strong>Mesa de experimentación</strong></div><span class="stage-badge"><i></i> EN TIEMPO REAL</span></div>
      <section class="viewport" aria-label="Entorno de experimentación">
        <div class="view-top"><span><i></i> ESPACIO 3D</span><div class="camera-tools"><button id="enter-vr" disabled>Comprobando VR…</button><button id="quest-preview">Vista Quest en PC</button><button id="fullscreen">Pantalla completa</button><button id="toggle-controls" aria-pressed="true">Ocultar paneles</button><button id="focus-charts">Ver gráficas ↗</button><button id="toggle-charts" aria-pressed="true">Ocultar gráficas</button><button id="top-view">Vista superior ↓</button><button id="camera">Restablecer vista ↗</button></div></div>
        <div id="guide-cue" class="guide-cue" role="status" aria-live="polite" hidden></div>
        <p id="step-confirmation" class="sr-only" role="status" aria-live="polite"></p><p id="charts-summary" class="sr-only" aria-live="polite"></p><canvas id="scene" aria-describedby="charts-summary" tabindex="0" aria-label="Mesa de circuitos 3D con paneles de herramientas y propiedades. Pulsa la escena y usa WASD para desplazarte dentro del laboratorio. Pulsa el valor de un componente para escribir y Enter para aplicar. Controles alternativos por teclado disponibles debajo."></canvas>
        <div class="view-help"><span>WASD para desplazarte</span><span>Arrastra para mover elementos</span><span>Botón derecho para orbitar</span><span>Rueda para zoom</span></div>
        <div class="wire-tools"><span class="wire-symbol">⌁</span><span id="connection-hint" role="status" aria-live="polite">Conectar: pulsa dos terminales</span><button id="cancel-wire">Cancelar</button></div>
      </section>
      <div class="meter" aria-label="Mediciones del circuito"><div class="meter-top"><span class="section-label">LECTURAS DEL CIRCUITO</span><span class="live-label"><span class="live-dot">●</span> En vivo</span></div><div class="meter-values"><div class="measurement primary-measurement"><div class="meter-main"><span id="current">0.0</span><small>mA</small></div><div class="meter-caption">Corriente total</div></div><div class="measurement"><strong id="voltage">6.0 V</strong><span>Tensión de la fuente</span></div><div class="measurement"><strong id="resistance">—</strong><span>Resistencia equivalente</span></div></div><div id="status" class="status"></div></div>
      <div class="stage-footnote"><span id="selection-status" class="selection-status" role="status" aria-live="polite">Seleccionado: S1</span><span class="footnote-divider">·</span><span class="footer-dot"></span> Modelo didáctico de corriente continua <span class="footnote-divider">·</span> <span class="current-legend" title="Animación ilustrativa; la velocidad no representa la velocidad física de las cargas.">● Esferas amarillas: corriente convencional (+ → −)</span></div>
    </div>

  </div>
  <details class="accessible-controls"><summary>Controles alternativos por teclado</summary><div class="accessible-controls-content">    <aside class="right panel" aria-label="Asistente y clase">
      <div class="panel-heading"><span class="section-label">APRENDE A TU RITMO</span><span class="guide-star">✦</span></div>
      <div class="guide"><div class="guide-top"><div class="guide-avatar" role="img" aria-label="Avatar de la guía virtual"><div class="robot-antenna"></div><div class="robot-head"><div class="robot-face"><i class="robot-eye"></i><i class="robot-eye"></i><i class="robot-mouth"></i></div></div><div class="robot-body"></div></div><div><strong>Tu guía virtual</strong><small id="guide-tag">CLASE GUIADA · 01 / 04</small><span class="guide-availability"><i></i> Aquí para acompañarte</span></div></div>
      <div class="progress"><i id="progress"></i></div>
      <div class="speech-bubble" id="dialogue" role="region" aria-label="Diálogo de la guía"><span class="dialogue-label">VAMOS PASO A PASO</span><h2 id="lesson-title"></h2><p id="lesson-text"></p><div id="lesson-task"></div></div>
      <div class="narration-controls" id="narration-controls"><div class="voice-actions"><button id="speak-lesson">▶ Escuchar</button><button id="stop-lesson" hidden>■ Detener</button><button id="mute-lesson" aria-pressed="false">Silenciar</button></div><p id="voice-status" role="status" aria-live="polite"></p></div><button id="reset-challenge" hidden>Reiniciar este reto</button><button id="next" class="primary">Continuar →</button></div>

    </aside>    <aside class="left panel" aria-label="Componentes y propiedades">
      <div class="panel-heading"><span class="section-label">HERRAMIENTAS</span><span class="panel-index">01</span></div>
      <h2>Tu banco de trabajo</h2><p class="muted">Todo empieza con una conexión.</p>
      <div class="component"><span class="icon source-icon">±</span><div><strong>Fuente DC</strong><small>1–12 V · fuente ideal</small></div><span class="count">×1</span></div>
      <button class="component" id="add-r" aria-label="Añadir resistencia"><span class="icon">${resistorIcon}</span><span><strong>Resistencia</strong><small>10–1000 Ω</small></span><span class="add">+</span></button>
      <button class="component" id="add-s" aria-label="Añadir interruptor"><span class="icon">${switchIcon}</span><span><strong>Interruptor</strong><small>Abrir / cerrar circuito</small></span><span class="add">+</span></button>
      <button class="component" id="add-l" aria-label="Añadir LED"><span class="icon">◉</span><span><strong>LED rojo</strong><small>A + / K −</small></span><span class="add">+</span></button>
      <div class="section-label spaced">MONTAJES DE EJEMPLO</div><div class="presets"><button data-preset="simple">Simple</button><button data-preset="series">Serie</button><button data-preset="parallel">Paralelo</button></div>
      <div class="inspector"><div class="section-label"><span>PROPIEDADES</span><span class="inspector-symbol">↗</span></div><div id="inspector"></div></div>
      <div class="storage"><button id="save">Guardar</button><button id="load">Recuperar</button><button id="empty">Vaciar mesa</button></div>
      <div class="panel-note"><span>↳</span> Selecciona un componente en la mesa para ajustar sus propiedades.</div>
    </aside>
      <details class="connections"><summary><span class="connections-label">Conexiones <span id="wire-count"></span></span></summary><div class="connect-form"><label>Desde<select id="wire-from" aria-label="Terminal de origen"></select></label><label>Hasta<select id="wire-to" aria-label="Terminal de destino"></select></label><button id="connect-terminals">Conectar terminales</button><p>También puedes pulsar los terminales sobre la mesa.</p></div><div id="wire-list"></div></details></div></details>
  <footer><span>UMBRAL LABS <i></i> Un espacio para aprender experimentando.</span><span>Simulación educativa · Versión de demostración</span></footer>
  <div id="toast" role="status" aria-live="polite"></div>
</main>
</div>`;
