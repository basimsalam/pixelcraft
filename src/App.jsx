import { useState, useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --beige: #F5EFE0;
    --beige-dark: #EDE3CA;
    --beige-mid: #D9CEAF;
    --black: #111008;
    --black-soft: #1E1C10;
    --charcoal: #2C2A1E;
    --accent: #C8A96E;
    --accent-light: #E8D4A8;
    --white: #FDFAF4;
    --text-muted: #6B6450;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--beige);
    color: var(--black);
    overflow-x: hidden;
    cursor: none;
  }
  a, button, input, textarea, select { font: inherit; }

  /* Custom cursor moved entirely to DOM refs + RAF, no React state */
  .cursor {
    position: fixed;
    width: 12px; height: 12px;
    background: var(--black);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    will-change: left, top;
    transition: width 0.3s, height 0.3s, background 0.3s;
    mix-blend-mode: multiply;
  }
  .cursor-ring {
    position: fixed;
    width: 40px; height: 40px;
    border: 1.5px solid var(--black);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    will-change: left, top;
    transition: left 0.12s ease-out, top 0.12s ease-out, width 0.3s, height 0.3s, opacity 0.3s;
    opacity: 0.5;
  }
  .cursor.hovered { width: 24px; height: 24px; background: var(--accent); }
  .cursor-ring.hovered { width: 60px; height: 60px; opacity: 0.2; }
  .icon-svg {
    width: 1em;
    height: 1em;
    display: block;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.9;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .service-icon .icon-svg,
  .contact-detail-icon .icon-svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  .hero-pill .icon-svg {
    width: 0.95rem;
    height: 0.95rem;
    display: inline-block;
    margin-right: 0.35rem;
    vertical-align: -0.13rem;
  }
  .portfolio-bg .icon-svg {
    width: 4rem;
    height: 4rem;
    color: var(--accent);
    opacity: 0.95;
  }
  .portfolio-item:first-child .portfolio-bg .icon-svg {
    width: 6rem;
    height: 6rem;
  }
  .testimonial-stars {
    display: flex;
    gap: 0.2rem;
  }
  .testimonial-stars .icon-svg {
    width: 0.82rem;
    height: 0.82rem;
    fill: currentColor;
    stroke-width: 0;
  }
  .pricing-check .icon-svg {
    width: 0.95rem;
    height: 0.95rem;
    stroke-width: 2.4;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--beige); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 3px; }

  /* Nav */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.5rem 4rem;
    transition: background 0.4s, backdrop-filter 0.4s, padding 0.3s;
  }
  nav.scrolled {
    background: rgba(245,239,224,0.92);
    backdrop-filter: blur(16px);
    padding: 1rem 4rem;
    border-bottom: 1px solid var(--beige-mid);
  }
  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: var(--black);
    text-decoration: none;
  }
  .nav-logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 2.5rem; list-style: none; }
  .nav-links a {
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--charcoal);
    text-decoration: none;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--accent); }
  .nav-cta {
    background: var(--black);
    color: var(--beige) !important;
    padding: 0.6rem 1.4rem;
    border-radius: 2px;
    transition: background 0.2s, color 0.2s !important;
  }
  .nav-cta:hover { background: var(--accent) !important; color: var(--black) !important; }

  /* Mobile nav */
  .hamburger {
    display: none; flex-direction: column; gap: 5px; cursor: none;
    background: none; border: none; padding: 4px;
  }
  .hamburger span {
    width: 24px; height: 2px; background: var(--black);
    transition: transform 0.3s, opacity 0.3s;
  }
  .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  .mobile-menu {
    position: fixed; inset: 0; z-index: 99;
    background: var(--black);
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    gap: 3rem;
    transform: translateX(100%);
    transition: transform 0.5s cubic-bezier(0.77,0,0.175,1);
  }
  .mobile-menu.open { transform: translateX(0); }
  .mobile-menu a {
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem; color: var(--beige);
    text-decoration: none; font-style: italic;
    transition: color 0.2s;
  }
  .mobile-menu a:hover { color: var(--accent); }

  /* Hero */
  .hero {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 4rem;
    padding-top: 6rem;
    overflow: hidden;
    position: relative;
  }
  .hero-left {
    display: flex; flex-direction: column; justify-content: center;
    padding-right: 4rem;
    z-index: 2;
  }
  .hero-tag {
    display: inline-flex; align-items: center; gap: 0.6rem;
    font-size: 0.75rem; font-weight: 500; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--text-muted);
    margin-bottom: 2rem;
  }
  .hero-tag::before {
    content: ''; width: 32px; height: 1px; background: var(--accent);
  }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3.2rem, 5.5vw, 6rem);
    font-weight: 900;
    line-height: 1.0;
    letter-spacing: -0.03em;
    margin-bottom: 1.8rem;
    color: var(--black);
  }
  .hero-title em {
    font-style: italic;
    color: var(--accent);
  }
  .hero-title .outline {
    -webkit-text-stroke: 2px var(--black);
    color: transparent;
  }
  .hero-desc {
    font-size: 1.05rem;
    line-height: 1.75;
    color: var(--text-muted);
    max-width: 440px;
    margin-bottom: 2.8rem;
    font-weight: 300;
  }
  .hero-actions { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
  .btn-primary {
    background: var(--black);
    color: var(--beige);
    padding: 0.9rem 2.2rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: none; cursor: none;
    text-decoration: none;
    display: inline-flex; align-items: center; gap: 0.5rem;
    transition: background 0.2s, transform 0.2s;
    border-radius: 2px;
  }
  .btn-primary:hover { background: var(--accent); color: var(--black); transform: translateY(-2px); }
  .btn-ghost {
    background: transparent;
    color: var(--black);
    padding: 0.9rem 2.2rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: 1.5px solid var(--black);
    cursor: none;
    text-decoration: none;
    display: inline-flex; align-items: center; gap: 0.5rem;
    transition: all 0.2s;
    border-radius: 2px;
  }
  .btn-ghost:hover { background: var(--black); color: var(--beige); }
  .hero-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0;
    margin-top: 3.5rem;
    max-width: 620px;
    padding: 1.35rem 0;
    border-top: 1px solid var(--beige-mid);
    border-bottom: 1px solid var(--beige-mid);
  }
  .hero-stat {
    position: relative;
    padding: 0 1.35rem;
  }
  .hero-stat + .hero-stat {
    border-left: 1px solid var(--beige-mid);
  }
  .hero-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 3.2vw, 2.85rem); font-weight: 900;
    color: var(--black);
    line-height: 0.92;
    letter-spacing: 0;
  }
  .hero-stat-num span {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    margin-left: 0.25rem;
    color: var(--text-muted);
  }
  .hero-stat-label {
    max-width: 8.5rem;
    font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text-muted); margin-top: 0.65rem;
    line-height: 1.35;
  }

  .hero-right {
    position: relative; display: flex; align-items: center; justify-content: center;
  }
  .hero-visual {
    position: relative; width: 100%; height: 80vh; max-height: 700px;
  }
  .hero-card-main {
    position: absolute; right: 0; top: 50%; transform: translateY(-50%);
    width: 85%; background: var(--black);
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 40px 40px 80px rgba(17,16,8,0.25);
  }
  .hero-card-img {
    width: 100%; aspect-ratio: 4/3;
    background: linear-gradient(135deg, #1E1C10 0%, #2C2A1E 40%, #3A3520 100%);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .hero-card-img::before {
    content: '';
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      45deg, transparent, transparent 30px,
      rgba(200,169,110,0.04) 30px, rgba(200,169,110,0.04) 31px
    );
  }
  .hero-browser-bar {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.75rem 1rem; background: rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .browser-dot { width: 8px; height: 8px; border-radius: 50%; }
  .hero-browser-content {
    padding: 1.5rem;
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;
  }
  .mock-block {
    background: rgba(200,169,110,0.15);
    border-radius: 3px;
    height: 80px;
  }
  .mock-block.tall { height: 160px; grid-row: span 2; }
  .mock-block.wide { grid-column: span 2; height: 50px; }

  .hero-badge {
    position: absolute; left: -20px; bottom: 20%;
    background: var(--white);
    border: 1px solid var(--beige-mid);
    border-radius: 3px;
    padding: 1rem 1.2rem;
    box-shadow: 0 20px 50px rgba(17,16,8,0.12);
    z-index: 3;
    animation: float 4s ease-in-out infinite;
  }
  .hero-badge-label {
    font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 0.3rem;
  }
  .hero-badge-value {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem; font-weight: 700; color: var(--black);
    line-height: 1;
  }
  .hero-badge-sub {
    font-size: 0.72rem; color: var(--accent); margin-top: 0.2rem; font-weight: 500;
  }

  .hero-pill {
    position: absolute; right: 10%; top: 12%;
    background: var(--accent);
    color: var(--black);
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: 0.78rem; font-weight: 600;
    letter-spacing: 0.05em;
    animation: float 3.5s 1s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }
  .hero-badge, .hero-pill { will-change: transform; }
  .marquee-track { will-change: transform; }
  .service-card, .portfolio-item, .pricing-card { will-change: auto; }
  .fade-up { contain: layout style; }

  /* Marquee */
  .marquee-section {
    background: var(--black);
    padding: 1.2rem 0;
    overflow: hidden;
    display: flex;
  }
  .marquee-track {
    display: flex; gap: 3rem; white-space: nowrap;
    animation: marquee 20s linear infinite;
    flex-shrink: 0;
  }
  .marquee-item {
    display: flex; align-items: center; gap: 1rem;
    font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--beige-mid);
  }
  .marquee-dot { color: var(--accent); font-size: 1.2rem; }
  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  /* Section base */
  section { padding: clamp(5rem, 8vw, 7rem) clamp(1.25rem, 5vw, 4rem); }
  .section-tag {
    display: inline-flex; align-items: center; gap: 0.6rem;
    font-size: 0.73rem; font-weight: 500; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--accent);
    margin-bottom: 1.2rem;
  }
  .section-tag::before { content: ''; width: 20px; height: 1px; background: var(--accent); }
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.2rem, 4vw, 3.5rem);
    font-weight: 900; line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--black);
  }
  .section-title em { font-style: italic; color: var(--accent); }

  /* Services */
  .services { background: var(--white); }
  .services-header {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 4rem; align-items: end; margin-bottom: 5rem;
  }
  .services-desc {
    font-size: 1rem; line-height: 1.75; color: var(--text-muted); font-weight: 300;
  }
  .services-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 0; border: 1px solid var(--beige-mid);
  }
  .service-card {
    padding: 3rem 2.5rem;
    border-right: 1px solid var(--beige-mid);
    border-bottom: 1px solid var(--beige-mid);
    transition: background 0.3s;
    position: relative; overflow: hidden;
  }
  .service-card:nth-child(3n) { border-right: none; }
  .service-card:nth-last-child(-n+3) { border-bottom: none; }
  .service-card::before {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 3px; background: var(--accent);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s cubic-bezier(0.77,0,0.175,1);
  }
  .service-card:hover { background: var(--black); }
  .service-card:hover::before { transform: scaleX(1); }
  .service-card:hover .service-icon { background: rgba(200,169,110,0.15); color: var(--accent); }
  .service-card:hover .service-name { color: var(--beige); }
  .service-card:hover .service-desc { color: var(--beige-mid); }
  .service-card:hover .service-num { color: rgba(200,169,110,0.2); }
  .service-num {
    font-family: 'Playfair Display', serif;
    font-size: 4rem; font-weight: 900;
    color: var(--beige-mid); position: absolute; top: 1rem; right: 1.5rem;
    line-height: 1; transition: color 0.3s;
  }
  .service-icon {
    width: 52px; height: 52px; border-radius: 3px;
    background: var(--beige); display: flex; align-items: center; justify-content: center;
    font-size: 1.4rem; margin-bottom: 1.8rem; transition: all 0.3s;
  }
  .service-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem; font-weight: 700; margin-bottom: 0.8rem;
    transition: color 0.3s;
  }
  .service-desc {
    font-size: 0.9rem; line-height: 1.7; color: var(--text-muted);
    font-weight: 300; transition: color 0.3s;
  }
  .service-list {
    margin-top: 1.2rem; list-style: none;
    display: flex; flex-direction: column; gap: 0.4rem;
  }
  .service-list li {
    font-size: 0.8rem; color: var(--text-muted);
    transition: color 0.3s;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .service-list li::before { content: '>'; color: var(--accent); font-size: 0.75rem; }
  .service-card:hover .service-list li { color: var(--beige-mid); }

  /* Process */
  .process { background: var(--black); }
  .process .section-title { color: var(--beige); }
  .process .section-tag { color: var(--accent); }
  .process-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 0; margin-top: 5rem;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .process-step {
    padding: 3rem 2rem;
    border-right: 1px solid rgba(255,255,255,0.08);
    position: relative;
    transition: background 0.3s;
  }
  .process-step:last-child { border-right: none; }
  .process-step:hover { background: rgba(200,169,110,0.05); }
  .process-arrow {
    position: absolute; right: -12px; top: 50%;
    transform: translateY(-50%);
    width: 22px; height: 22px;
    background: var(--accent); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; color: var(--black); z-index: 2;
  }
  .process-step:last-child .process-arrow { display: none; }
  .process-step-num {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem; font-weight: 900;
    color: rgba(200,169,110,0.2);
    line-height: 1; margin-bottom: 1.5rem;
  }
  .process-step-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem; font-weight: 700;
    color: var(--beige); margin-bottom: 0.8rem;
  }
  .process-step-desc {
    font-size: 0.88rem; line-height: 1.7;
    color: rgba(245,239,224,0.45); font-weight: 300;
  }

  /* Portfolio */
  .portfolio { background: var(--beige); }
  .portfolio-header {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 4rem;
  }
  .portfolio-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    grid-template-rows: auto auto;
    gap: 1.5rem;
  }
  .portfolio-item {
    background: var(--black);
    border-radius: 4px; overflow: hidden;
    position: relative; cursor: none;
    group: true;
  }
  .portfolio-item:first-child { grid-row: span 2; }
  .portfolio-img {
    aspect-ratio: 16/10;
    position: relative; overflow: hidden;
  }
  .portfolio-item:first-child .portfolio-img { aspect-ratio: unset; height: 100%; min-height: 520px; position: relative; }
  .portfolio-bg {
    width: 100%; height: 100%;
    transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
    display: flex; align-items: center; justify-content: center;
    font-size: 4rem;
  }
  .portfolio-item:hover .portfolio-bg { transform: scale(1.05); }
  .portfolio-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(17,16,8,0.9) 0%, transparent 60%);
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 2rem;
    opacity: 0; transition: opacity 0.3s;
  }
  .portfolio-item:first-child .portfolio-overlay { opacity: 1; }
  .portfolio-item:hover .portfolio-overlay { opacity: 1; }
  .portfolio-tag-small {
    font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 0.4rem;
  }
  .portfolio-item-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem; font-weight: 700;
    color: var(--beige); margin-bottom: 0.4rem;
  }
  .portfolio-item-sub {
    font-size: 0.82rem; color: rgba(245,239,224,0.6);
  }
  .portfolio-link {
    position: absolute; top: 1.5rem; right: 1.5rem;
    width: 36px; height: 36px;
    background: var(--accent);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; color: var(--black);
    opacity: 0; transition: opacity 0.3s;
    text-decoration: none;
  }
  .portfolio-item:hover .portfolio-link { opacity: 1; }

.portfolio-overlay-img {
    background: linear-gradient(to top, rgba(17,16,8,0.95) 0%, rgba(17,16,8,0.3) 50%, transparent 100%) !important;
    opacity: 1 !important;
  }

  .tm-mockup-wrap {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    padding: 2rem;
    background: linear-gradient(145deg, #0f0f1a 0%, #1a1228 60%, #0d0d18 100%);
  }
  .tm-mockup {
    width: 100%; max-width: 420px;
    background: #16141f;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06);
  }
  .tm-mockup-bar {
    display: flex; align-items: center; gap: 5px;
    padding: 0.6rem 0.9rem;
    background: #1e1b2a;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .tm-dot-r, .tm-dot-y, .tm-dot-g {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  }
  .tm-dot-r { background: #FF605C; }
  .tm-dot-y { background: #FFBD44; }
  .tm-dot-g { background: #00CA4E; }
  .tm-addr {
    flex: 1; margin-left: 0.5rem;
    background: rgba(255,255,255,0.06); border-radius: 3px;
    font-size: 0.6rem; color: rgba(255,255,255,0.25);
    padding: 3px 8px; letter-spacing: 0.04em;
  }
  .tm-mockup-body { padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
  .tm-hero-block {
    display: flex; gap: 0.75rem; align-items: center;
    background: rgba(200,169,110,0.06); border-radius: 5px;
    padding: 1rem;
  }
  .tm-hero-text { flex: 1; display: flex; flex-direction: column; gap: 0.4rem; }
  .tm-line-block { height: 7px; border-radius: 3px; background: rgba(255,255,255,0.12); }
  .tm-line-lg { width: 85%; }
  .tm-line-md { width: 65%; }
  .tm-line-sm { width: 45%; }
  .tm-cta-block {
    margin-top: 0.4rem; height: 22px; width: 80px; border-radius: 3px;
    background: var(--accent); opacity: 0.75;
  }
  .tm-hero-img {
    width: 80px; height: 72px; border-radius: 4px; flex-shrink: 0;
    background: linear-gradient(135deg, rgba(200,169,110,0.25), rgba(200,169,110,0.08));
    border: 1px solid rgba(200,169,110,0.15);
  }
  .tm-cards-row { display: flex; gap: 0.6rem; }
  .tm-card-block {
    flex: 1; height: 52px; border-radius: 4px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
  }
  .tm-card-block:nth-child(2) { background: rgba(200,169,110,0.08); border-color: rgba(200,169,110,0.15); }

  /* Testimonials */
  .testimonials { background: var(--black-soft); }
  .testimonials .section-title { color: var(--beige); }
  .testimonials-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem; margin-top: 4rem;
  }
  .testimonial-card {
    background: rgba(245,239,224,0.04);
    border: 1px solid rgba(245,239,224,0.08);
    padding: 2.5rem;
    border-radius: 3px;
    transition: background 0.3s, border-color 0.3s;
  }
  .testimonial-card:hover {
    background: rgba(245,239,224,0.07);
    border-color: rgba(200,169,110,0.3);
  }
  .testimonial-stars { color: var(--accent); font-size: 0.85rem; letter-spacing: 0.1em; margin-bottom: 1.5rem; }
  .testimonial-text {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 1rem; line-height: 1.75;
    color: var(--beige-mid); margin-bottom: 2rem;
  }
  .testimonial-author { display: flex; align-items: center; gap: 0.8rem; }
  .testimonial-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; font-weight: 700;
    font-family: 'Playfair Display', serif;
    flex-shrink: 0;
  }
  .testimonial-name {
    font-size: 0.9rem; font-weight: 600; color: var(--beige);
  }
  .testimonial-role { font-size: 0.78rem; color: rgba(245,239,224,0.4); margin-top: 0.15rem; }

  /* Pricing */
  .pricing { background: var(--beige); }
  .pricing-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem; margin-top: 4rem;
  }
  .pricing-card {
    padding: 3rem 2.5rem;
    background: var(--white);
    border: 1px solid var(--beige-mid);
    border-radius: 3px;
    position: relative;
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .pricing-card:hover { transform: translateY(-8px); box-shadow: 0 30px 60px rgba(17,16,8,0.12); }
  .pricing-card.featured {
    background: var(--black); border-color: transparent;
    transform: scale(1.03);
  }
  .pricing-card.featured:hover { transform: scale(1.03) translateY(-8px); }
  .pricing-badge {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: var(--accent); color: var(--black);
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0.3rem 1rem; border-radius: 50px;
  }
  .pricing-name {
    font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--text-muted); margin-bottom: 1rem;
  }
  .pricing-card.featured .pricing-name { color: var(--beige-mid); }
  .pricing-price {
    font-family: 'Playfair Display', serif;
    font-size: 3rem; font-weight: 900; color: var(--black);
    line-height: 1;
  }
  .pricing-card.featured .pricing-price { color: var(--beige); }
  .pricing-price span { font-size: 1rem; font-weight: 400; color: var(--text-muted); }
  .pricing-desc {
    font-size: 0.88rem; color: var(--text-muted); line-height: 1.6;
    margin: 1rem 0 2rem;
  }
  .pricing-card.featured .pricing-desc { color: rgba(245,239,224,0.5); }
  .pricing-features { list-style: none; display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 2.5rem; }
  .pricing-feature {
    display: flex; align-items: flex-start; gap: 0.7rem;
    font-size: 0.88rem; color: var(--charcoal); line-height: 1.4;
  }
  .pricing-card.featured .pricing-feature { color: var(--beige-mid); }
  .pricing-check { color: var(--accent); font-size: 0.85rem; flex-shrink: 0; }
  .pricing-btn {
    width: 100%; padding: 0.9rem;
    background: var(--beige);
    border: 1.5px solid var(--black);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.83rem; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    cursor: none; border-radius: 2px;
    transition: all 0.2s;
    color: var(--black);
  }
  .pricing-btn:hover { background: var(--black); color: var(--beige); }
  .pricing-card.featured .pricing-btn {
    background: var(--accent); border-color: var(--accent); color: var(--black);
  }
  .pricing-card.featured .pricing-btn:hover { background: var(--beige); border-color: var(--beige); }

  /* CTA */
  .cta-section {
    background: var(--black);
    padding: 8rem 4rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .cta-bg {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200,169,110,0.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .cta-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.5rem, 5vw, 5rem);
    font-weight: 900; line-height: 1.05;
    color: var(--beige); margin-bottom: 1.5rem;
    position: relative;
  }
  .cta-title em { color: var(--accent); font-style: italic; }
  .cta-desc {
    font-size: 1.05rem; color: rgba(245,239,224,0.5);
    max-width: 520px; margin: 0 auto 3rem;
    line-height: 1.7; font-weight: 300;
  }
  .cta-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

  /* Contact */
  .contact { background: var(--white); }
  .contact-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: 6rem; align-items: start; }
  .contact-info-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 700; color: var(--black);
    margin-bottom: 1.2rem; line-height: 1.2;
  }
  .contact-info-desc {
    font-size: 0.95rem; line-height: 1.75; color: var(--text-muted); font-weight: 300;
    margin-bottom: 3rem;
  }
  .contact-detail { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.5rem; }
  .contact-detail-icon {
    width: 40px; height: 40px; border-radius: 3px;
    background: var(--beige); display: flex; align-items: center; justify-content: center;
    font-size: 1rem; flex-shrink: 0;
  }
  .contact-detail-label { font-size: 0.73rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); }
  .contact-detail-value { font-size: 0.95rem; font-weight: 500; color: var(--black); margin-top: 0.2rem; }
  .contact-form { display: flex; flex-direction: column; gap: 1.2rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
  .form-label { font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); font-weight: 500; }
  .form-input, .form-textarea {
    padding: 0.9rem 1rem;
    background: var(--beige);
    border: 1.5px solid transparent;
    border-radius: 2px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem; color: var(--black);
    transition: border-color 0.2s, background 0.2s;
    outline: none;
    resize: none;
  }
  .form-input:focus, .form-textarea:focus {
    border-color: var(--accent); background: var(--white);
  }
  .form-textarea { min-height: 130px; }

  /* Footer */
  footer {
    background: var(--black);
    padding: 5rem 4rem 2.5rem;
  }
  .footer-top {
    display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: 4rem; padding-bottom: 4rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .footer-brand {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 900; color: var(--beige);
    margin-bottom: 1rem;
  }
  .footer-brand span { color: var(--accent); }
  .footer-tagline { font-size: 0.88rem; color: rgba(245,239,224,0.4); line-height: 1.65; font-weight: 300; }
  .footer-col-title {
    font-size: 0.73rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 1.5rem;
  }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.75rem; }
  .footer-links a {
    font-size: 0.88rem; color: rgba(245,239,224,0.5);
    text-decoration: none; transition: color 0.2s;
  }
  .footer-links a:hover { color: var(--beige); }
  .footer-bottom {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 2rem;
  }
  .footer-copy { font-size: 0.8rem; color: rgba(245,239,224,0.3); }
  .footer-socials { display: flex; gap: 1rem; }
  .social-link {
    width: 36px; height: 36px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem;
    color: rgba(245,239,224,0.5);
    text-decoration: none;
    transition: all 0.2s;
  }
  .social-link:hover { border-color: var(--accent); color: var(--accent); }

  /* Animations */
  .fade-up {
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .fade-up.visible { opacity: 1; transform: translateY(0); }
  .fade-up:nth-child(2) { transition-delay: 0.1s; }
  .fade-up:nth-child(3) { transition-delay: 0.2s; }
  .fade-up:nth-child(4) { transition-delay: 0.3s; }

  /* Responsive */
  @media (max-width: 1100px) {
    .hero { grid-template-columns: 1fr; min-height: auto; padding: 8rem 3rem 5rem; }
    .hero-left { padding-right: 0; text-align: center; align-items: center; }
    .hero-right { display: none; }
    .hero-stats { width: min(100%, 620px); }
    .hero-stat-label { margin-left: auto; margin-right: auto; }
    .hero-tag { align-self: center; }
    .services-grid { grid-template-columns: repeat(2, 1fr); }
    .service-card:nth-child(3n) { border-right: 1px solid var(--beige-mid); }
    .service-card:nth-child(2n) { border-right: none; }
    .process-grid { grid-template-columns: repeat(2, 1fr); }
    .process-step:nth-child(2) .process-arrow { display: none; }
    .testimonials-grid { grid-template-columns: 1fr 1fr; }
    .footer-top { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
  }

  @media (max-width: 920px) {
    nav, nav.scrolled { padding-left: 2rem; padding-right: 2rem; }
    .nav-links { display: none; }
    .hamburger { display: flex; }
    .pricing-grid { grid-template-columns: 1fr; max-width: 620px; margin-left: auto; margin-right: auto; }
    .pricing-card.featured { transform: none; }
    .pricing-card.featured:hover { transform: translateY(-8px); }
    .contact-grid { grid-template-columns: 1fr; gap: 4rem; }
    .contact-info-desc { max-width: 620px; }
    footer { padding-left: 2rem; padding-right: 2rem; }
  }

  @media (max-width: 768px) {
    nav { padding: 1.2rem 1.5rem; }
    nav.scrolled { padding: 1rem 1.5rem; }
    .nav-links { display: none; }
    .hamburger { display: flex; }
    section { padding: 5rem 1.5rem; }
    .hero { padding: 7rem 1.5rem 4.5rem; }
    .hero-title { font-size: clamp(2.75rem, 13vw, 4.2rem); }
    .hero-desc { font-size: 1rem; max-width: 36rem; }
    .hero-actions { justify-content: center; }
    .hero-stats { grid-template-columns: 1fr; margin-top: 3rem; padding: 1rem 0; }
    .hero-stat { padding: 1rem 0; }
    .hero-stat + .hero-stat { border-left: none; border-top: 1px solid var(--beige-mid); }
    .services-header { grid-template-columns: 1fr; gap: 1.5rem; }
    .services-grid { grid-template-columns: 1fr; }
    .service-card { border-right: none !important; }
    .service-card:nth-last-child(-n+3) { border-bottom: 1px solid var(--beige-mid); }
    .service-card:last-child { border-bottom: none; }
    .process-grid { grid-template-columns: 1fr; border: none; gap: 1rem; }
    .process-step { border-right: none; border: 1px solid rgba(255,255,255,0.08); }
    .process-arrow { display: none !important; }
    .portfolio-grid { grid-template-columns: 1fr; }
    .portfolio-item:first-child { grid-row: auto; }
    .portfolio-item:first-child .portfolio-img { min-height: 280px; }
    .portfolio-item:first-child .portfolio-overlay { opacity: 1; }
    .testimonials-grid { grid-template-columns: 1fr; }
    .pricing-grid { grid-template-columns: 1fr; }
    .pricing-card.featured { transform: none; }
    .contact-grid { grid-template-columns: 1fr; gap: 3rem; }
    .form-row { grid-template-columns: 1fr; }
    .footer-top { grid-template-columns: 1fr 1fr; gap: 2rem; }
    .footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }
    .cta-section { padding: 5rem 1.5rem; }
    .portfolio-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
  }

  @media (max-width: 560px) {
    body { cursor: auto; }
    .cursor, .cursor-ring { display: none; }
    nav, nav.scrolled { padding-left: 1rem; padding-right: 1rem; }
    .nav-logo { font-size: 1.25rem; }
    .mobile-menu { gap: 2.2rem; }
    .mobile-menu a { font-size: 2rem; }
    section { padding: 4rem 1rem; }
    .hero { padding: 6.5rem 1rem 4rem; }
    .hero-tag { font-size: 0.68rem; margin-bottom: 1.5rem; }
    .hero-tag::before { width: 22px; }
    .hero-title { letter-spacing: -0.02em; }
    .hero-actions { width: 100%; }
    .hero-actions .btn-primary,
    .hero-actions .btn-ghost,
    .cta-actions .btn-primary,
    .cta-actions .btn-ghost {
      width: 100%;
      justify-content: center;
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .hero-stats { width: 100%; margin-top: 2.5rem; }
    .services-header { margin-bottom: 3rem; }
    .service-card,
    .process-step,
    .pricing-card,
    .testimonial-card {
      padding: 2rem 1.5rem;
    }
    .service-card { border-bottom: 1px solid var(--beige-mid) !important; }
    .service-card:last-child { border-bottom: none !important; }
    .portfolio-header { align-items: stretch; }
    .portfolio-header .btn-ghost { justify-content: center; }
    .portfolio-item:first-child .portfolio-img { min-height: 240px; }
    .portfolio-overlay { opacity: 1; padding: 1.4rem; }
    .portfolio-link { opacity: 1; }
    .cta-title { font-size: clamp(2.2rem, 12vw, 3.3rem); }
    .contact-detail { align-items: center; }
    .footer-top { grid-template-columns: 1fr; gap: 2.25rem; }
    .footer-bottom { align-items: flex-start; text-align: left; }
    footer { padding: 4rem 1rem 2rem; }
  }

  @media (max-width: 380px) {
    .hero-title { font-size: 2.45rem; }
    .hero-desc { font-size: 0.95rem; }
    .hero-stat-num { font-size: 2rem; }
    .section-title { font-size: 2rem; }
    .pricing-price { font-size: 2.45rem; }
  }
`;

const SERVICES = [
  { icon: "monitor", name: "Web Design & Development", desc: "Pixel-perfect, high-converting websites built with modern tech that load fast and look stunning.", list: ["Custom React & Next.js builds", "CMS integration (WordPress, Sanity)", "E-commerce (Shopify, WooCommerce)"] },
  { icon: "chart", name: "SEO Strategy", desc: "Data-driven SEO that climbs Google rankings, drives organic traffic, and turns visitors into leads.", list: ["Technical SEO audits", "Keyword research & mapping", "On-page & off-page optimization"] },
  { icon: "zap", name: "Performance Optimization", desc: "Speed is conversion. We optimize Core Web Vitals, image delivery, and every millisecond.", list: ["Lighthouse score optimization", "CDN & caching setup", "Lazy loading & code splitting"] },
  { icon: "target", name: "Landing Page Design", desc: "High-impact landing pages engineered to convert, from concept to A/B tested live pages.", list: ["Conversion rate optimization", "A/B testing frameworks", "Analytics & heatmap setup"] },
  { icon: "link", name: "Local SEO", desc: "Dominate local search results and capture customers in your area before your competitors do.", list: ["Google Business optimization", "Local citation building", "Review strategy & management"] },
  { icon: "tool", name: "Website Maintenance", desc: "Your site always running smoothly with updates, security, backups, and support on demand.", list: ["Monthly performance reports", "Security patches & updates", "Priority support & fixes"] },
];

const PROCESS = [
  { num: "01", title: "Discovery Call", desc: "We dig into your business goals, target audience, and competitors to build a clear brief." },
  { num: "02", title: "Strategy & Design", desc: "Wireframes, moodboards, and a complete strategy document for your approval before any code." },
  { num: "03", title: "Build & Optimize", desc: "Clean code, SEO baked in from day one, and fast iterations with your feedback loop." },
  { num: "04", title: "Launch & Grow", desc: "Live deployment, final QA, and ongoing growth support so you never stop improving." },
];

const PROJECTS = [
  { title: "Thiramaala", tag: "Web Design + Development", sub: "Live project — visit the site", color: "linear-gradient(135deg, #0D0D1A 0%, #1A1228 50%, #0D0D1A 100%)", icon: "monitor", link: "https://thiramaala.vercel.app/", custom: true },
  { title: "Nova Fitness Studio", tag: "Landing Page + Local SEO", sub: "#1 in local search results", color: "linear-gradient(135deg, #1A1910 0%, #2C2A1E 100%)", icon: "activity" },
  { title: "Maison Bakery", tag: "E-commerce + SEO", sub: "3x online revenue in 3 months", color: "linear-gradient(135deg, #241F0E 0%, #1A1910 100%)", icon: "bag" },
];

const TESTIMONIALS = [
  { text: "Working with this team transformed our online presence completely. Our organic traffic tripled within 4 months, results we never expected so quickly.", name: "Sarah Al-Rashidi", role: "CEO, Luxe Interiors", initials: "SR", color: "#C8A96E" },
  { text: "Our website went from invisible to ranking #1 locally. The design is stunning and our phone hasn't stopped ringing since launch.", name: "Mohammed Al-Otaibi", role: "Owner, Nova Fitness", initials: "MO", color: "#8B7D5A" },
  { text: "The attention to detail is incredible. Every pixel was considered, and the SEO strategy was data-driven and remarkably effective.", name: "Laila Hassan", role: "Director, Maison Cafe", initials: "LH", color: "#6B6450" },
];

const PRICING = [
  { name: "Starter", price: "1,499", period: "/ project", desc: "Perfect for small businesses launching their digital presence.", features: ["5-page responsive website", "On-page SEO setup", "Google Analytics integration", "Contact form + CTA", "1 month free support"], featured: false },
  { name: "Growth", price: "2,499", period: "/ project", desc: "The complete package for businesses serious about online growth.", features: ["10-page custom website", "Full SEO strategy & setup", "Local SEO optimization", "Landing page + A/B testing", "3 months support & reporting", "Speed & performance tuning"], featured: true },
  { name: "Enterprise", price: "Custom", period: "", desc: "Large-scale builds, ongoing retainers, and complex SEO campaigns.", features: ["Unlimited pages & features", "Monthly SEO retainer", "Dedicated account manager", "Custom integrations & CMS", "Priority 24h support", "Quarterly strategy reviews"], featured: false },
];

function Icon({ name }) {
  const paths = {
    monitor: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>,
    chart: <><path d="M4 19V5" /><path d="M4 19h17" /><path d="M8 15l3-4 3 2 4-6" /></>,
    zap: <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />,
    target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>,
    link: <><path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" /><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1" /></>,
    tool: <><path d="M14.7 6.3a4 4 0 0 0-5 5L4 17v3h3l5.7-5.7a4 4 0 0 0 5-5l-3 3-2-2 3-3z" /></>,
    home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></>,
    activity: <path d="M4 13h4l2-6 4 10 2-4h4" />,
    bag: <><path d="M6 8h12l-1 13H7L6 8z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M4 7l8 6 8-6" /></>,
    phone: <path d="M6 3h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" />,
    pin: <><path d="M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    trophy: <><path d="M8 4h8v4a4 4 0 0 1-8 0V4z" /><path d="M6 6H4a4 4 0 0 0 4 4M18 6h2a4 4 0 0 1-4 4M12 12v5M9 21h6M8 17h8" /></>,
    star: <path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3z" />,
    check: <path d="M5 12l4 4 10-10" />,
  };

  return (
    <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {paths[name] ?? paths.monitor}
    </svg>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", service: "", budget: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  // Cursor uses direct DOM refs, so mouse movement does not trigger React renders.
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const rafRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });

  // Scroll: throttled with RAF so it fires at most once per frame
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cursor: update DOM directly via RAF.
  useEffect(() => {
    const onMove = (e) => { mousePos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove, { passive: true });

    const loop = () => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.left = mousePos.current.x + "px";
        cursorDotRef.current.style.top  = mousePos.current.y + "px";
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = mousePos.current.x + "px";
        cursorRingRef.current.style.top  = mousePos.current.y + "px";
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Cursor hover: single delegated listener on document.
  useEffect(() => {
    const SELECTOR = "a, button, .service-card, .portfolio-item, .pricing-card";
    const onEnter = (e) => {
      if (e.target.closest(SELECTOR)) {
        cursorDotRef.current?.classList.add("hovered");
        cursorRingRef.current?.classList.add("hovered");
      }
    };
    const onLeave = (e) => {
      if (e.target.closest(SELECTOR)) {
        cursorDotRef.current?.classList.remove("hovered");
        cursorRingRef.current?.classList.remove("hovered");
      }
    };
    document.addEventListener("mouseover", onEnter);
    document.addEventListener("mouseout", onLeave);
    return () => {
      document.removeEventListener("mouseover", onEnter);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  // IntersectionObserver: runs once on mount only
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target); // stop watching once visible
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  const marqueeItems = ["Web Design", "SEO Strategy", "Lead Generation", "Performance", "Conversion Rate Optimization", "Local SEO", "E-commerce", "React Development"];

  return (
    <>
      <style>{style}</style>
      <div ref={cursorDotRef} className="cursor" style={{ left: "-100px", top: "-100px" }} />
      <div ref={cursorRingRef} className="cursor-ring" style={{ left: "-100px", top: "-100px" }} />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {["Services", "Process", "Work", "Pricing", "Contact"].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>
        ))}
      </div>

      {/* Nav */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#" className="nav-logo">pixel<span>craft</span></a>
        <ul className="nav-links">
          {["Services", "Process", "Work", "Pricing", "Contact"].map(item => (
            <li key={item}><a href={`#${item.toLowerCase()}`}>{item}</a></li>
          ))}
          <li><a href="#contact" className="nav-cta">Get a Quote</a></li>
        </ul>
        <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-left">
          <div className="hero-tag">Freelance Web & SEO Studio</div>
          <h1 className="hero-title">
            Websites that<br />
            <em>rank,</em> convert<br />
            <span className="outline">&amp; grow.</span>
          </h1>
          <p className="hero-desc">
            I build fast, beautiful websites and craft SEO strategies that put your business in front of the right people, turning clicks into loyal customers.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn-primary">Start a Project &rarr;</a>
            <a href="#work" className="btn-ghost">View Work</a>
          </div>
          <div className="hero-stats" aria-label="PixelCraft performance highlights">
            <div className="hero-stat">
              <div className="hero-stat-num">10+</div>
              <div className="hero-stat-label">Projects Delivered</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">300%</div>
              <div className="hero-stat-label">Avg Traffic Growth</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">4.9<span aria-hidden="true">/5</span></div>
              <div className="hero-stat-label">Client Rating</div>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-visual">
            <div className="hero-badge">
              <div className="hero-badge-label">Organic Traffic</div>
              <div className="hero-badge-value">+312%</div>
              <div className="hero-badge-sub">Up last 90 days</div>
            </div>
            <div className="hero-pill"><Icon name="trophy" /> #1 on Google</div>
            <div className="hero-card-main">
              <div className="hero-browser-bar">
                <div className="browser-dot" style={{ background: "#FF605C" }} />
                <div className="browser-dot" style={{ background: "#FFBD44" }} />
                <div className="browser-dot" style={{ background: "#00CA4E" }} />
                <div style={{ flex: 1, height: "20px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", marginLeft: "0.5rem" }} />
              </div>
              <div className="hero-card-img">
                <div className="hero-browser-content">
                  <div className="mock-block tall" style={{ background: "rgba(200,169,110,0.2)" }} />
                  <div className="mock-block" />
                  <div className="mock-block" style={{ background: "rgba(200,169,110,0.1)" }} />
                  <div className="mock-block wide" />
                  <div className="mock-block" style={{ height: "40px" }} />
                  <div className="mock-block" style={{ height: "40px", background: "rgba(200,169,110,0.15)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-section">
        {[0, 1].map(k => (
          <div className="marquee-track" key={k}>
            {marqueeItems.map((item, i) => (
              <div className="marquee-item" key={i}>
                <span className="marquee-dot">*</span>{item}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Services */}
      <section className="services" id="services">
        <div className="services-header">
          <div>
            <div className="section-tag fade-up">What I Offer</div>
            <h2 className="section-title fade-up">Every service you<br /><em>need to dominate</em><br />online.</h2>
          </div>
          <p className="services-desc fade-up">
            From handcrafted websites that stop visitors in their tracks, to SEO strategies that keep delivering results for years, I handle the digital growth so you can focus on running your business.
          </p>
        </div>
        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <div className="service-card fade-up" key={i}>
              <div className="service-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="service-icon"><Icon name={s.icon} /></div>
              <div className="service-name">{s.name}</div>
              <div className="service-desc">{s.desc}</div>
              <ul className="service-list">
                {s.list.map((l, j) => <li key={j}>{l}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="process" id="process">
        <div className="section-tag fade-up">How It Works</div>
        <h2 className="section-title fade-up">A process built for<br /><em>real results.</em></h2>
        <div className="process-grid">
          {PROCESS.map((p, i) => (
            <div className="process-step fade-up" key={i}>
              {i < PROCESS.length - 1 && <div className="process-arrow">&rarr;</div>}
              <div className="process-step-num">{p.num}</div>
              <div className="process-step-title">{p.title}</div>
              <div className="process-step-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio */}
      <section className="portfolio" id="work">
        <div className="portfolio-header">
          <div>
            <div className="section-tag fade-up">Selected Work</div>
            <h2 className="section-title fade-up">Results that<br /><em>speak loudly.</em></h2>
          </div>
          <a href="#contact" className="btn-ghost fade-up">Start Your Project &rarr;</a>
        </div>
        <div className="portfolio-grid">
          {PROJECTS.map((p, i) => (
            <div className="portfolio-item fade-up" key={i}>
              <div className="portfolio-img">
<div className="portfolio-bg" style={{ background: p.color }}>
                  {p.custom ? (
                    <div className="tm-mockup-wrap">
                      <div className="tm-mockup">
                        <div className="tm-mockup-bar">
                          <span className="tm-dot-r" /><span className="tm-dot-y" /><span className="tm-dot-g" />
                          <span className="tm-addr">thiramaala.vercel.app</span>
                        </div>
                        <div className="tm-mockup-body">
                          <div className="tm-hero-block">
                            <div className="tm-hero-text">
                              <div className="tm-line-block tm-line-lg" />
                              <div className="tm-line-block tm-line-md" />
                              <div className="tm-line-block tm-line-sm" />
                              <div className="tm-cta-block" />
                            </div>
                            <div className="tm-hero-img" />
                          </div>
                          <div className="tm-cards-row">
                            <div className="tm-card-block" />
                            <div className="tm-card-block" />
                            <div className="tm-card-block" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Icon name={p.icon} />
                  )}
                </div>
                <div className={`portfolio-overlay${p.custom ? " portfolio-overlay-img" : ""}`}>
                  <div className="portfolio-tag-small">{p.tag}</div>
                  <div className="portfolio-item-title">{p.title}</div>
                  <div className="portfolio-item-sub">{p.sub}</div>
                </div>
                <a href={p.link || "#contact"} className="portfolio-link" {...(p.link ? { target: "_blank", rel: "noopener noreferrer" } : {})}>&rarr;</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials — commented out temporarily
      <section className="testimonials">
        <div className="section-tag fade-up">Client Love</div>
        <h2 className="section-title fade-up">Don't take my<br /><em>word for it.</em></h2>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div className="testimonial-card fade-up" key={i}>
              <div className="testimonial-stars">{[0, 1, 2, 3, 4].map((star) => <Icon name="star" key={star} />)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" style={{ background: t.color, color: "#111008" }}>{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      */}

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          <div className="section-tag fade-up" style={{ justifyContent: "center" }}>Investment</div>
          <h2 className="section-title fade-up">Transparent pricing.<br /><em>Exceptional value.</em></h2>
        </div>
        <div className="pricing-grid">
          {PRICING.map((p, i) => (
            <div className={`pricing-card fade-up ${p.featured ? "featured" : ""}`} key={i}>
              {p.featured && <div className="pricing-badge">Most Popular</div>}
              <div className="pricing-name">{p.name}</div>
              <div className="pricing-price">
                {p.price === "Custom" ? "Custom" : <>SAR {p.price}{p.period && <span>{p.period}</span>}</>}
              </div>
              <p className="pricing-desc">{p.desc}</p>
              <ul className="pricing-features">
                {p.features.map((f, j) => (
                  <li className="pricing-feature" key={j}>
                    <span className="pricing-check"><Icon name="check" /></span>{f}
                  </li>
                ))}
              </ul>
              <button className="pricing-btn" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                {p.price === "Custom" ? "Let's Talk" : "Get Started"} &rarr;
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <div className="cta-section">
        <div className="cta-bg" />
        <div className="section-tag fade-up" style={{ justifyContent: "center" }}>Ready?</div>
        <h2 className="cta-title fade-up">Let's build something<br /><em>remarkable</em> together.</h2>
        <p className="cta-desc fade-up">Your next customer is searching for you right now. Let's make sure they find you and choose you.</p>
        <div className="cta-actions fade-up">
          <a href="#contact" className="btn-primary">Book a Free Consultation &rarr;</a>
          <a href="mailto:basimsalam22@gmail.com" className="btn-ghost" style={{ borderColor: "rgba(245,239,224,0.3)", color: "var(--beige)" }}>basimsalam22@gmail.com</a>
        </div>
      </div>

      {/* Contact */}
      <section className="contact" id="contact">
        <div className="contact-grid">
          <div>
            <div className="section-tag fade-up">Get In Touch</div>
            <h2 className="contact-info-title fade-up">Let's start your<br />project today.</h2>
            <p className="contact-info-desc fade-up">
              Fill out the form and I'll get back to you within 24 hours with a tailored proposal. No commitment, no pressure, just a conversation about your goals.
            </p>
            {[
              { icon: "mail", label: "Email", value: "basimsalam22@gmail.com" },
              { icon: "phone", label: "WhatsApp", value: "+966 506536605" },
              { icon: "pin", label: "Location", value: "Riyadh, Saudi Arabia" },
              { icon: "clock", label: "Response Time", value: "Within 24 hours" },
            ].map((d, i) => (
              <div className="contact-detail fade-up" key={i}>
                <div className="contact-detail-icon"><Icon name={d.icon} /></div>
                <div>
                  <div className="contact-detail-label">{d.label}</div>
                  <div className="contact-detail-value">{d.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--beige)", borderRadius: "4px" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem", display: "flex", justifyContent: "center" }}><Icon name="mail" /></div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", marginBottom: "0.75rem" }}>Message Received!</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>I'll be in touch within 24 hours. Looking forward to working with you.</p>
              </div>
            ) : (
              <form className="contact-form fade-up" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input className="form-input" type="text" placeholder="Ahmed Al-Rashidi" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" type="email" placeholder="ahmed@company.com" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Service Interested In</label>
                    <select className="form-input" value={formData.service} onChange={e => setFormData({ ...formData, service: e.target.value })}>
                      <option value="">Select a service</option>
                      <option>Web Design & Development</option>
                      <option>SEO Strategy</option>
                      <option>Landing Page</option>
                      <option>Local SEO</option>
                      <option>Full Package</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Budget Range</label>
                    <select className="form-input" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })}>
                      <option value="">Select a range</option>
                      <option>SAR 1,000 - 2,000</option>
                      <option>SAR 2,000 - 5,000</option>
                      <option>SAR 5,000 - 10,000</option>
                      <option>SAR 10,000+</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Tell Me About Your Project</label>
                  <textarea className="form-textarea" placeholder="Describe your business, your goals, and what you're looking to achieve..." required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Send Message &rarr;
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-top">
          <div>
            <div className="footer-brand">pixel<span>craft</span></div>
            <p className="footer-tagline">Freelance web design & SEO studio helping businesses grow their online presence and generate more leads through thoughtful design and proven strategy.</p>
          </div>
          <div>
            <div className="footer-col-title">Services</div>
            <ul className="footer-links">
              {["Web Design", "SEO Strategy", "Local SEO", "Landing Pages", "Performance Optimization", "Website Maintenance"].map(l => <li key={l}><a href="#services">{l}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Quick Links</div>
            <ul className="footer-links">
              {["About", "Portfolio", "Process", "Pricing", "Blog", "Contact"].map(l => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            <ul className="footer-links">
              <li><a href="mailto:basimsalam22@gmail.com">basimsalam22@gmail.com</a></li>
              <li><a href="tel:+966506536605">+966 50 65 36 605</a></li>
              <li><a href="#">Riyadh, Saudi Arabia</a></li>
              <li style={{ marginTop: "1rem" }}>
                <div style={{ display: "flex", gap: "0.7rem" }}>
                  {["x", "in", "ig", "be"].map(s => (
                    <a href="#" key={s} className="social-link">{s}</a>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">&copy; 2025 PixelCraft Studio. All rights reserved.</div>
          <div className="footer-copy">Crafted with care in Riyadh</div>
        </div>
      </footer>
      <Analytics />
    </>
  );
}
