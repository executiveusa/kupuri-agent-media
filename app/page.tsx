export default function Home() {
  return (
    <>
      {/* HEADER */}
      <header className="site-header" role="banner">
        <div className="container header-inner">
          <a href="/" className="logo" aria-label="VozViva — inicio">
            <span className="logo-mark">VozViva</span>
          </a>
          <nav className="nav-desktop" aria-label="Navegación principal">
            <a href="#demos">Ver demos</a>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#precios">Precios</a>
            <a href="#preguntas">Preguntas</a>
          </nav>
          <a
            href="/dashboard/create"
            className="btn btn-primary btn-sm nav-cta"
          >
            Empezar gratis
          </a>
          <button
            className="nav-toggle"
            aria-label="Abrir menú"
            aria-expanded="false"
            aria-controls="mobile-nav"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div
          id="mobile-nav"
          className="nav-mobile"
          hidden
          role="navigation"
          aria-label="Menú móvil"
        >
          <a href="#demos" className="mobile-link">
            Ver demos
          </a>
          <a href="#como-funciona" className="mobile-link">
            Cómo funciona
          </a>
          <a href="#precios" className="mobile-link">
            Precios
          </a>
          <a href="#preguntas" className="mobile-link">
            Preguntas
          </a>
          <a
            href="/dashboard/create"
            className="btn btn-primary mobile-cta"
          >
            Empezar gratis
          </a>
        </div>
      </header>

      <main id="main-content">
        {/* HERO */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="container hero-inner">
            <div className="hero-content">
              <h1 id="hero-heading" className="hero-headline">
                La forma más fácil de crear videos{' '}
                <br className="br-lg" />
                <em>para redes sociales en español.</em>
              </h1>
              <p className="hero-sub">
                Escribe tu idea y elige el estilo. VozViva es una versión de
                prueba: estamos construyendo videos con persona virtual y voz
                en español para TikTok, Reels y Shorts.
              </p>
              <div className="hero-actions">
                <a
                  href="/dashboard/create"
                  className="btn btn-primary btn-lg"
                >
                  Probar la versión de prueba
                </a>
                <a href="#demos" className="btn btn-ghost btn-lg">
                  Ver ejemplos
                </a>
              </div>
              <p className="hero-note">
                Versión de prueba · Aún no se cobra nada
              </p>
            </div>

            <div className="hero-phone" aria-hidden="true">
              <div className="phone-frame">
                <div className="phone-notch"></div>
                <div className="phone-screen">
                  <video
                    className="phone-video hero-video"

                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-label="Demo de video generado con VozViva"
                    data-demo="hero"
                  />
                  <div className="phone-placeholder">
                    <div className="ph-avatar"></div>
                    <div className="ph-subtitles">
                      <div className="ph-word">Reserva</div>
                      <div className="ph-word ph-word--active">hoy</div>
                      <div className="ph-word">y</div>
                      <div className="ph-word">ahorra</div>
                    </div>
                    <div className="ph-meta">
                      <div className="ph-bar"></div>
                      <div className="ph-tags">TikTok · Reels · Shorts</div>
                    </div>
                  </div>
                </div>
                <div className="phone-bar"></div>
              </div>
              <div className="hero-platform-labels" aria-hidden="true">
                <span>TikTok</span>
                <span>Reels</span>
                <span>Shorts</span>
              </div>
            </div>
          </div>
        </section>

        {/* QUALITY BAR */}
        <div className="quality-bar" aria-label="Características principales">
          <div className="container quality-inner">
            <div className="quality-item">
              <strong>Personas virtuales</strong>
              <span>En español</span>
            </div>
            <div className="quality-divider" aria-hidden="true"></div>
            <div className="quality-item">
              <strong>Voz y subtítulos</strong>
              <span>En español para LATAM</span>
            </div>
            <div className="quality-divider" aria-hidden="true"></div>
            <div className="quality-item">
              <strong>Formato vertical</strong>
              <span>9:16 para todas las redes</span>
            </div>
            <div className="quality-divider" aria-hidden="true"></div>
            <div className="quality-item">
              <strong>Sin grabarte</strong>
              <span>Sin cámara</span>
            </div>
          </div>
        </div>

        {/* DEMO VIDEOS */}
        <section
          id="demos"
          className="demos-section"
          aria-labelledby="demos-heading"
        >
          <div className="container">
            <p className="section-eyebrow">Ejemplos de muestra</p>
            <h2 id="demos-heading" className="section-heading">
              Mira lo que VozViva puede crear.
            </h2>
            <p className="section-sub">
              Ejemplos de muestra para mostrar el estilo. El texto de cada
              ejemplo es una idea inventada, no un cliente real.
            </p>

            <div className="demos-grid">
              {/* Demo 1: Spa */}
              <div className="demo-card">
                <div className="demo-phone-wrap">
                  <div className="demo-phone">
                    <div className="demo-screen">
                      <video
                        className="demo-video"

                        muted
                        loop
                        playsInline
                        data-demo="spa"
                        aria-label="Demo: anuncio para spa"
                      />
                      <div className="demo-placeholder dp-spa">
                        <div className="dp-avatar"></div>
                        <div className="dp-gradient"></div>
                        <div className="dp-caption">
                          Relájate.
                          <br />
                          Reserva hoy.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="demo-info">
                  <div className="demo-tag">Spa &amp; Bienestar</div>
                  <div className="demo-prompt">
                    &ldquo;Promociona mi masaje relajante de 60 minutos con 20%
                    de descuento&rdquo;
                  </div>
                  <div className="demo-outputs">
                    <span>Generado con IA</span>
                    <span>Clip mudo de muestra</span>
                  </div>
                </div>
              </div>

              {/* Demo 2: Restaurante */}
              <div className="demo-card">
                <div className="demo-phone-wrap">
                  <div className="demo-phone">
                    <div className="demo-screen">
                      <video
                        className="demo-video"

                        muted
                        loop
                        playsInline
                        data-demo="restaurant"
                        aria-label="Demo: anuncio para restaurante"
                      />
                      <div className="demo-placeholder dp-restaurant">
                        <div className="dp-avatar"></div>
                        <div className="dp-gradient"></div>
                        <div className="dp-caption">
                          Menú del día.
                          <br />
                          Ven hoy.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="demo-info">
                  <div className="demo-tag">Restaurante</div>
                  <div className="demo-prompt">
                    &ldquo;Anuncia mi menú del fin de semana: tacos de birria y
                    pozole&rdquo;
                  </div>
                  <div className="demo-outputs">
                    <span>Generado con IA</span>
                    <span>Clip mudo de muestra</span>
                  </div>
                </div>
              </div>

              {/* Demo 3: Inmobiliaria */}
              <div className="demo-card">
                <div className="demo-phone-wrap">
                  <div className="demo-phone">
                    <div className="demo-screen">
                      <video
                        className="demo-video"

                        muted
                        loop
                        playsInline
                        data-demo="realestate"
                        aria-label="Demo: anuncio inmobiliaria"
                      />
                      <div className="demo-placeholder dp-realestate">
                        <div className="dp-avatar"></div>
                        <div className="dp-gradient"></div>
                        <div className="dp-caption">
                          Depto ideal.
                          <br />
                          CDMX.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="demo-info">
                  <div className="demo-tag">Inmobiliaria</div>
                  <div className="demo-prompt">
                    &ldquo;Muestra este departamento de dos recámaras con
                    balcón en CDMX&rdquo;
                  </div>
                  <div className="demo-outputs">
                    <span>Generado con IA</span>
                    <span>Clip mudo de muestra</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="demos-cta">
              <a
                href="/dashboard/create"
                className="btn btn-primary btn-lg"
              >
                Crear mi video ahora
              </a>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="como-funciona"
          className="how-section"
          aria-labelledby="how-heading"
        >
          <div className="container">
            <p className="section-eyebrow center">Cómo funciona</p>
            <h2 id="how-heading" className="section-heading center">
              Tres pasos. Un video.
            </h2>

            <div className="steps-track">
              <div className="step">
                <div className="step-visual">
                  <div className="step-screen step-screen--prompt">
                    <div className="ss-bar">
                      <div className="ss-dot"></div>
                      <div className="ss-dot"></div>
                      <div className="ss-dot"></div>
                    </div>
                    <div className="ss-label">VozViva</div>
                    <div className="ss-input">
                      <div className="ss-cursor"></div>
                      <span>
                        &ldquo;Promociona mi spa con 20% de descuento este fin
                        de semana&rdquo;
                      </span>
                    </div>
                    <div className="ss-send">Generar video</div>
                  </div>
                </div>
                <div className="step-body">
                  <div className="step-num">1</div>
                  <h3 className="step-title">Escribe tu idea</h3>
                  <p className="step-desc">
                    Una frase describe lo que necesitas. Sin tecnicismos. Sin
                    configuración complicada.
                  </p>
                </div>
              </div>

              <div className="step-arrow" aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>

              <div className="step">
                <div className="step-visual">
                  <div className="step-screen step-screen--style">
                    <div className="ss-label">Elige el estilo</div>
                    <div className="ss-options">
                      <div className="ss-opt ss-opt--active">Persona mujer</div>
                      <div className="ss-opt">Persona hombre</div>
                    </div>
                    <div className="ss-options">
                      <div className="ss-opt ss-opt--active">Tono cálido</div>
                      <div className="ss-opt">Profesional</div>
                    </div>
                    <div className="ss-options">
                      <div className="ss-opt ss-opt--active">15 segundos</div>
                      <div className="ss-opt">30 segundos</div>
                    </div>
                  </div>
                </div>
                <div className="step-body">
                  <div className="step-num">2</div>
                  <h3 className="step-title">Elige el estilo</h3>
                  <p className="step-desc">
                    Selecciona la persona virtual, el tono, el formato y la
                    duración. VozViva genera el guion.
                  </p>
                </div>
              </div>

              <div className="step-arrow" aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>

              <div className="step">
                <div className="step-visual">
                  <div className="step-screen step-screen--result">
                    <div className="ss-label">Tu video</div>
                    <div className="ss-video-thumb">
                      <div className="ss-thumb-avatar"></div>
                      <div className="ss-play">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M5 3l14 9-14 9V3z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ss-downloads">
                      <div className="ss-dl">TikTok MP4</div>
                      <div className="ss-dl">Reels MP4</div>
                      <div className="ss-dl">Shorts MP4</div>
                    </div>
                  </div>
                </div>
                <div className="step-body">
                  <div className="step-num">3</div>
                  <h3 className="step-title">Descarga y publica</h3>
                  <p className="step-desc">
                    Pensado para formato vertical 9:16. Tú revisas el resultado
                    antes de publicarlo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOR EVERY BUSINESS */}
        <section className="for-section" aria-labelledby="for-heading">
          <div className="container">
            <p className="section-eyebrow center">Para quién es</p>
            <h2 id="for-heading" className="section-heading center">
              Pensado para negocios pequeños.
            </h2>
            <div className="for-grid">
              <div className="for-item">Spas y centros de bienestar</div>
              <div className="for-item">Restaurantes y cafeterías</div>
              <div className="for-item">Hoteles boutique</div>
              <div className="for-item">Inmobiliarias</div>
              <div className="for-item">Clínicas y consultorios</div>
              <div className="for-item">Tiendas y e-commerce</div>
              <div className="for-item">Coaches y consultores</div>
              <div className="for-item">Agencias de marketing</div>
              <div className="for-item">Proyectos sociales</div>
              <div className="for-item">Marcas personales</div>
              <div className="for-item">Escuelas y academias</div>
              <div className="for-item">Cualquier negocio con algo que decir</div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section
          id="precios"
          className="pricing-section"
          aria-labelledby="pricing-heading"
        >
          <div className="container">
            <p className="section-eyebrow center">Precios</p>
            <h2 id="pricing-heading" className="section-heading center">
              Precios próximamente.
            </h2>
            <p className="pricing-disclaimer">
              VozViva es una versión de prueba. Todavía no hay planes ni cobros.
              Si quieres probarlo cuando abra, escríbenos.
            </p>
            <div className="cta-actions">
              <a
                href="mailto:hello@kupurimedia.com?subject=Quiero%20probar%20VozViva"
                className="btn btn-primary btn-lg"
              >
                Avísame cuando abra
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="preguntas"
          className="faq-section"
          aria-labelledby="faq-heading"
        >
          <div className="container">
            <p className="section-eyebrow center">Preguntas frecuentes</p>
            <h2 id="faq-heading" className="section-heading center">
              Respuestas directas.
            </h2>
            <div className="faq-list">
              <details className="faq-item">
                <summary className="faq-q">
                  <span>¿Necesito saber editar video?</span>
                  <span className="faq-icon" aria-hidden="true"></span>
                </summary>
                <p className="faq-a">
                  No. La idea es que no tengas que editar video. Es una versión de prueba y puede fallar.</p>
              </details>

              <details className="faq-item">
                <summary className="faq-q">
                  <span>¿Los videos son en español de México?</span>
                  <span className="faq-icon" aria-hidden="true"></span>
                </summary>
                <p className="faq-a">
                  Está diseñado para español de México y Latinoamérica. La calidad de la voz y los subtítulos todavía se está probando.</p>
              </details>

              <details className="faq-item">
                <summary className="faq-q">
                  <span>¿Sirve para mi negocio local?</span>
                  <span className="faq-icon" aria-hidden="true"></span>
                </summary>
                <p className="faq-a">
                  Está pensado para negocios pequeños como restaurantes, spas, clínicas, hoteles y tiendas. Aún no hay clientes de ejemplo.</p>
              </details>

              <details className="faq-item">
                <summary className="faq-q">
                  <span>¿Puedo crear videos para mis clientes?</span>
                  <span className="faq-icon" aria-hidden="true"></span>
                </summary>
                <p className="faq-a">
                  Todavía no hay un plan para agencias. Escríbenos si te interesa y lo hablamos.</p>
              </details>

              <details className="faq-item">
                <summary className="faq-q">
                  <span>¿Cuánto cuesta?</span>
                  <span className="faq-icon" aria-hidden="true"></span>
                </summary>
                <p className="faq-a">
                  Todavía no hay precios ni cobros. Cuando existan, los publicaremos aquí.</p>
              </details>

              <details className="faq-item">
                <summary className="faq-q">
                  <span>¿Qué tan rápido llega el video?</span>
                  <span className="faq-icon" aria-hidden="true"></span>
                </summary>
                <p className="faq-a">
                  Aún no medimos tiempos reales. Depende de la duración y el estilo elegido.</p>
              </details>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="cta-section" aria-labelledby="cta-heading">
          <div className="container">
            <h2 id="cta-heading" className="cta-heading">
              Tu próximo video puede salir
              <br />
              de una idea simple.
            </h2>
            <div className="cta-actions">
              <a
                href="/dashboard/create"
                className="btn btn-cta btn-xl"
              >
                Probar la versión de prueba
              </a>
              <a
                href="mailto:hello@kupurimedia.com?subject=Hablemos%20de%20VozViva"
                className="btn btn-ghost-light btn-xl"
              >
                Hablar con el equipo
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer" role="contentinfo">
        <div className="container footer-inner">
          <span className="footer-logo">VozViva</span>
          <nav className="footer-nav" aria-label="Pie de página">
            <a href="#demos">Demos</a>
            <a href="#precios">Precios</a>
            <a href="#preguntas">FAQ</a>
            <a href="mailto:hello@kupurimedia.com">Contacto</a>
          </nav>
          <p className="footer-credit">
            Hecho por{' '}
            <a href="https://kupurimedia.com">Kupuri Media</a>
          </p>
        </div>
      </footer>
    </>
  )
}
