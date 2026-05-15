import { services } from "../data/siteContent";

export function Services() {
  return (
    <section className="services" id="services">
      <div className="services-header">
        <div>
          <div className="section-tag fade-up">What I Offer</div>
          <h2 className="section-title fade-up">
            Every service you
            <br />
            <em>need to dominate</em>
            <br />
            online.
          </h2>
        </div>
        <p className="services-desc fade-up">
          From handcrafted websites that stop visitors in their tracks, to SEO strategies that keep delivering results for years, I handle the digital growth so you can focus on running your business.
        </p>
      </div>
      <div className="services-grid">
        {services.map((service, index) => (
          <article className="service-card fade-up" key={service.name}>
            <div className="service-num">{String(index + 1).padStart(2, "0")}</div>
            <div className="service-icon">{service.icon}</div>
            <h3 className="service-name">{service.name}</h3>
            <p className="service-desc">{service.desc}</p>
            <ul className="service-list">
              {service.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
