import { processSteps } from "../data/siteContent";

export function Process() {
  return (
    <section className="process" id="process">
      <div className="section-tag fade-up">How It Works</div>
      <h2 className="section-title fade-up">
        A process built for
        <br />
        <em>real results.</em>
      </h2>
      <div className="process-grid">
        {processSteps.map((step, index) => (
          <article className="process-step fade-up" key={step.num}>
            {index < processSteps.length - 1 && <div className="process-arrow">&rarr;</div>}
            <div className="process-step-num">{step.num}</div>
            <h3 className="process-step-title">{step.title}</h3>
            <p className="process-step-desc">{step.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
