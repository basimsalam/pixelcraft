import { testimonials } from "../data/siteContent";

export function Testimonials() {
  return (
    <section className="testimonials">
      <div className="section-tag fade-up">Client Love</div>
      <h2 className="section-title fade-up">
        Do not take my
        <br />
        <em>word for it.</em>
      </h2>
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <article className="testimonial-card fade-up" key={testimonial.name}>
            <div className="testimonial-stars" aria-label="5 star review">
              *****
            </div>
            <p className="testimonial-text">&quot;{testimonial.text}&quot;</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar" style={{ background: testimonial.color, color: "#111008" }}>
                {testimonial.initials}
              </div>
              <div>
                <div className="testimonial-name">{testimonial.name}</div>
                <div className="testimonial-role">{testimonial.role}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
