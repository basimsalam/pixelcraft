import { navItems } from "../data/siteContent";

const toSectionId = (item) => item.toLowerCase();

export function Navigation({ menuOpen, onMenuToggle, onMenuClose, scrolled }) {
  return (
    <>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navItems.map((item) => (
          <a key={item} href={`#${toSectionId(item)}`} onClick={onMenuClose}>
            {item}
          </a>
        ))}
      </div>

      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#home" className="nav-logo">
          pixel<span>craft</span>
        </a>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item}>
              <a href={`#${toSectionId(item)}`}>{item}</a>
            </li>
          ))}
          <li>
            <a href="#contact" className="nav-cta">
              Get a Quote
            </a>
          </li>
        </ul>
        <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={onMenuToggle} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>
      </nav>
    </>
  );
}
