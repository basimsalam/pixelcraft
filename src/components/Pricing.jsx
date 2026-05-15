import { pricingPlans } from "../data/siteContent";

export function Pricing() {
  const scrollToContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="pricing" id="pricing">
      <div className="section-heading-centered">
        <div className="section-tag fade-up section-tag-centered">Investment</div>
        <h2 className="section-title fade-up">
          Transparent pricing.
          <br />
          <em>Exceptional value.</em>
        </h2>
      </div>
      <div className="pricing-grid">
        {pricingPlans.map((plan) => (
          <article className={`pricing-card fade-up ${plan.featured ? "featured" : ""}`} key={plan.name}>
            {plan.featured && <div className="pricing-badge">Most Popular</div>}
            <h3 className="pricing-name">{plan.name}</h3>
            <div className="pricing-price">
              {plan.price === "Custom" ? (
                "Custom"
              ) : (
                <>
                  SAR {plan.price}
                  {plan.period && <span>{plan.period}</span>}
                </>
              )}
            </div>
            <p className="pricing-desc">{plan.desc}</p>
            <ul className="pricing-features">
              {plan.features.map((feature) => (
                <li className="pricing-feature" key={feature}>
                  <span className="pricing-check">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="pricing-btn" onClick={scrollToContact}>
              {plan.price === "Custom" ? "Let's Talk" : "Get Started"} &rarr;
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
