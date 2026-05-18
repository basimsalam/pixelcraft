import { footerLinks, serviceLinks, socialLinks } from "../data/siteContent";

export function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <div className="footer-brand">
            pixel<span>craft</span>
          </div>
          <p className="footer-tagline">
            Freelance web design & SEO studio helping businesses grow their online presence and generate more leads through thoughtful design and proven strategy.
          </p>
        </div>
        <FooterLinkColumn title="Services" links={serviceLinks} href="#services" />
        <FooterLinkColumn title="Quick Links" links={footerLinks} />
        <div>
          <div className="footer-col-title">Contact</div>
          <ul className="footer-links">
            <li>
              <a href="mailto:hello@pixelcraft.com">basimnnas@gmail.com</a>
            </li>
            <li>
              <a href="tel:+966551234567">+966 50 65 36 605 </a>
            </li>
            <li>
              <a href="#contact">Riyadh, Saudi Arabia</a>
            </li>
            <li className="footer-socials">
              {socialLinks.map((social) => (
                <a href="#contact" key={social} className="social-link" aria-label={`${social} profile`}>
                  {social}
                </a>
              ))}
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">&copy; 2026 PixelCraft Studio. All rights reserved.</div>
        <div className="footer-copy">Crafted with care in Riyadh</div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({ href, links, title }) {
  return (
    <div>
      <div className="footer-col-title">{title}</div>
      <ul className="footer-links">
        {links.map((link) => (
          <li key={link}>
            <a href={href ?? `#${link.toLowerCase()}`}>{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
