const resistorIcon = '<svg viewBox="0 0 32 24" aria-hidden="true"><path d="M1 12h5l3-6 4 12 4-12 4 12 3-6h7"/></svg>';
const switchIcon = '<svg viewBox="0 0 32 24" aria-hidden="true"><path d="M1 16h7m16 0h7M9 15 23 5"/><circle cx="8" cy="16" r="2"/><circle cx="24" cy="16" r="2"/></svg>';
export const layout = `
<aside class="app-sidebar" aria-label="Navegación principal">
  <a class="brand" href="#" aria-label="Umbral Labs"><span class="brand-symbol">u</span><span class="sidebar-brand-name">umbral<span class="brand-tag">labs</span></span></a>
  <button id="quick-search" class="sidebar-search" aria-label="Buscar experiencias" title="Buscar experiencias (Ctrl K)"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 5 5"/></svg><span class="nav-label">Búsqueda rápida…</span><kbd>Ctrl K</kbd></button>
  <nav aria-label="Experiencias de aprendizaje">
    <button class="nav-item active" data-nav-filter="all" aria-label="Inicio" aria-current="page" title="Inicio"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/></svg><span class="nav-label">Inicio</span></button>
    <button class="nav-item" data-nav-filter="recent" aria-label="Recientes" title="Recientes"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8a9 9 0 1 1-1 6M3 3v6h6M12 7v5l4 2"/></svg><span class="nav-label">Recientes</span><span class="nav-chevron">›</span></button>
    <div class="nav-section-label">Aprender</div>
    <button class="nav-item" data-nav-filter="class" aria-label="Clases guiadas" title="Clases guiadas"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m2 8 10-5 10 5-10 5-10-5Zm4 3v7l6 3 6-3v-7m4-3v10"/></svg><span class="nav-label">Clases guiadas</span><span class="nav-chevron">›</span></button>
    <div class="nav-section-label">Experimentar</div>
    <button class="nav-item" data-nav-filter="free" aria-label="Modo libre" title="Modo libre"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm-9 5 9 5 9-5m-9 5v10"/></svg><span class="nav-label">Modo libre</span><span class="nav-chevron">›</span></button>
  </nav>
  <div class="sidebar-footer"><span class="sidebar-version"><i></i> Versión de demostración</span><button id="collapse-sidebar" aria-label="Contraer menú lateral" aria-expanded="true" title="Contraer o expandir menú"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M9 4v16"/></svg></button></div>
</aside>
<div class="app-content">
<header class="app-topbar"><div class="topbar-context">Umbral <span>/</span> <span id="header-context">Catálogo de experiencias</span></div><div class="header-right"><button id="back-menu" class="back-menu" hidden>← Menú general</button><span class="demo">DEMO · PC</span></div></header>
<main id="main-menu" class="menu-page">
  <section class="menu-hero">
    <div class="menu-hero-copy"><div class="menu-kicker"><span>u</span> Tu espacio de aprendizaje</div><h1 id="menu-title">¿Qué quieres explorar hoy?</h1><p id="menu-subtitle">Elige una clase guiada o construye tu propio experimento.</p></div>

  </section>
  <div class="catalogue-search-frame"><label class="catalogue-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 5 5"/></svg><input id="experience-search" type="search" aria-label="Buscar clases y laboratorios" placeholder="Buscar una clase o laboratorio…" autocomplete="off"/><span class="search-shortcut"><kbd>Ctrl</kbd><kbd>K</kbd></span></label></div>
  <section class="experience-catalogue" aria-labelledby="catalogue-title">
    <div class="catalogue-heading"><div><div class="eyebrow">EXPERIENCIAS DISPONIBLES</div><h2 id="catalogue-title">Electrónica básica</h2></div><span id="catalogue-result-count" class="catalogue-count" role="status" aria-live="polite">2 experiencias</span></div>
    <ul class="experience-list">
      <li><button class="experience-row sandbox-row" data-open-mode="free" aria-label="Abrir modo libre: Banco de electrónica"><span class="experience-icon"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="m16 3 11 6v14l-11 6-11-6V9l11-6Zm-11 6 11 7 11-7m-11 7v13"/></svg></span><span class="experience-copy"><span class="experience-type">MODO LIBRE</span><strong>Banco de electrónica</strong><span class="experience-description">Una mesa para tus ideas. Añade componentes, diseña conexiones y observa las mediciones y gráficas.</span><span class="experience-meta"><span>Exploración abierta</span><i></i><span>A tu ritmo</span></span></span><span class="experience-action"><span id="free-entry-label">Explorar</span><span>↗</span></span></button></li>
    </ul>
    <div id="empty-catalogue" class="empty-catalogue" hidden><h3>No hay experiencias para mostrar</h3><p id="empty-catalogue-text">Prueba con otra búsqueda.</p><button id="reset-catalogue">Ver todas las experiencias</button></div>
    <div class="catalogue-note"><span class="online-dot"></span> Disponible en PC desde tu navegador <span>·</span> Puedes guardar tus montajes en este navegador.</div>
  </section>
  <footer><span>UMBRAL LABS <i></i> Un espacio para aprender experimentando.</span><span>Versión de demostración</span></footer>
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
      <div class="stage-footnote"><span id="selection-status" class="selection-status" role="status" aria-live="polite">Seleccionado: S1</span><span class="footnote-divider">·</span><span class="footer-dot"></span> Modelo ideal de corriente continua <span class="footnote-divider">·</span> <span class="current-legend" title="Animación ilustrativa; la velocidad no representa la velocidad física de las cargas.">● Esferas amarillas: corriente convencional (+ → −)</span></div>
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
