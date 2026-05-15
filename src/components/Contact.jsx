import { useState } from "react";
import { contactDetails } from "../data/siteContent";

const initialFormData = {
  name: "",
  email: "",
  service: "",
  budget: "",
  message: "",
};

const serviceOptions = [
  "Web Design & Development",
  "SEO Strategy",
  "Landing Page",
  "Local SEO",
  "Full Package",
];

const budgetOptions = [
  "SAR 1,000 - 2,000",
  "SAR 2,000 - 5,000",
  "SAR 5,000 - 10,000",
  "SAR 10,000+",
];

export function Contact() {
  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-grid">
        <div>
          <div className="section-tag fade-up">Get In Touch</div>
          <h2 className="contact-info-title fade-up">
            Let&apos;s start your
            <br />
            project today.
          </h2>
          <p className="contact-info-desc fade-up">
            Fill out the form and I&apos;ll get back to you within 24 hours with a tailored proposal. No commitment, no pressure, just a conversation about your goals.
          </p>
          {contactDetails.map((detail) => (
            <div className="contact-detail fade-up" key={detail.label}>
              <div className="contact-detail-icon">{detail.icon}</div>
              <div>
                <div className="contact-detail-label">{detail.label}</div>
                <div className="contact-detail-value">{detail.value}</div>
              </div>
            </div>
          ))}
        </div>
        <div>{submitted ? <ContactSuccess /> : <ContactForm formData={formData} onSubmit={handleSubmit} onFieldChange={updateField} />}</div>
      </div>
    </section>
  );
}

function ContactSuccess() {
  return (
    <div className="contact-success">
      <div className="contact-success-icon">OK</div>
      <h3>Message Received!</h3>
      <p>I&apos;ll be in touch within 24 hours. Looking forward to working with you.</p>
    </div>
  );
}

function ContactForm({ formData, onSubmit, onFieldChange }) {
  return (
    <form className="contact-form fade-up" onSubmit={onSubmit}>
      <div className="form-row">
        <TextInput label="Your Name" placeholder="Ahmed Al-Rashidi" value={formData.name} onChange={onFieldChange("name")} />
        <TextInput label="Email Address" placeholder="ahmed@company.com" type="email" value={formData.email} onChange={onFieldChange("email")} />
      </div>

      <div className="form-row">
        <SelectInput label="Service Interested In" value={formData.service} onChange={onFieldChange("service")} placeholder="Select a service" options={serviceOptions} />
        <SelectInput label="Budget Range" value={formData.budget} onChange={onFieldChange("budget")} placeholder="Select a range" options={budgetOptions} />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="message">
          Tell Me About Your Project
        </label>
        <textarea
          id="message"
          className="form-textarea"
          placeholder="Describe your business, your goals, and what you're looking to achieve..."
          required
          value={formData.message}
          onChange={onFieldChange("message")}
        />
      </div>

      <button type="submit" className="btn-primary form-submit">
        Send Message &rarr;
      </button>
    </form>
  );
}

function TextInput({ label, onChange, placeholder, type = "text", value }) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input id={id} className="form-input" type={type} placeholder={placeholder} required value={value} onChange={onChange} />
    </div>
  );
}

function SelectInput({ label, onChange, options, placeholder, value }) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="form-group">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <select id={id} className="form-input" value={value} onChange={onChange}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
