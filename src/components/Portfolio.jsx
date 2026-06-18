import { projects } from "../data/siteContent";

export function Portfolio() {
  return (
    <section className="portfolio" id="work">
      <div className="portfolio-header">
        <div>
          <div className="section-tag fade-up">Selected Work</div>
          <h2 className="section-title fade-up">
            Results that
            <br />
            <em>speak loudly.</em>
          </h2>
        </div>
        <a href="#contact" className="btn-ghost fade-up">
          Start Your Project &rarr;
        </a>
      </div>
      <div className="portfolio-grid">
        {projects.map((project, index) => (
          <article className="portfolio-item fade-up" key={project.title}>
            <div className="portfolio-img">
              <div className="portfolio-bg" style={{ background: project.color }}>
                <span className={index === 0 ? "portfolio-symbol portfolio-symbol-large" : "portfolio-symbol"}>
                  {project.visual}
                </span>
              </div>
              <div className="portfolio-overlay">
                <div className="portfolio-tag-small">{project.tag}</div>
                <h3 className="portfolio-item-title">{project.title}</h3>
                <p className="portfolio-item-sub">{project.sub}</p>
              </div>
              <a
                href={project.link || "#contact"}
                className="portfolio-link"
                aria-label={project.link ? `View ${project.title}` : `Start a project like ${project.title}`}
                {...(project.link ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                &rarr;
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
