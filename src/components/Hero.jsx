import { heroStats } from "../data/siteContent";

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-left">
        <div className="hero-tag">Freelance Web & SEO Studio</div>
        <h1 className="hero-title">
          Websites that
          <br />
          <em>rank,</em> convert
          <br />
          <span className="outline">&amp; grow.</span>
        </h1>
        <p className="hero-desc">
          I build fast, beautiful websites and craft SEO strategies that put your business in front of the right people, turning clicks into loyal customers.
        </p>
        <div className="hero-actions">
          <a href="#contact" className="btn-primary">
            Start a Project &rarr;
          </a>
          <a href="#work" className="btn-ghost">
            View Work
          </a>
        </div>
        <div className="hero-stats" aria-label="PixelCraft performance highlights">
          {heroStats.map((stat, index) => (
            <div className="hero-stat" key={stat.label}>
              <div className="hero-stat-kicker">{String(index + 1).padStart(2, "0")}</div>
              <div className="hero-stat-num">
                {stat.value}
                {stat.label === "Client Rating" && <span aria-hidden="true">/5</span>}
              </div>
              <div className="hero-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-right">
        <div className="hero-visual">
          <div className="hero-badge">
            <div className="hero-badge-label">Organic Traffic</div>
            <div className="hero-badge-value">+312%</div>
            <div className="hero-badge-sub">Up last 90 days</div>
          </div>
          <div className="hero-pill">#1 on Google</div>
          <div className="hero-card-main">
            <div className="hero-browser-bar">
              <div className="browser-dot" style={{ background: "#FF605C" }} />
              <div className="browser-dot" style={{ background: "#FFBD44" }} />
              <div className="browser-dot" style={{ background: "#00CA4E" }} />
              <div className="browser-address-bar" />
            </div>
            <div className="hero-card-img">
              <div className="hero-browser-content">
                <div className="mock-block mock-block-accent tall" />
                <div className="mock-block" />
                <div className="mock-block mock-block-soft" />
                <div className="mock-block wide" />
                <div className="mock-block short" />
                <div className="mock-block mock-block-mid short" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
