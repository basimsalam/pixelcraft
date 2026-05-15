import { marqueeItems } from "../data/siteContent";

export function Marquee() {
  return (
    <div className="marquee-section">
      {[0, 1].map((track) => (
        <div className="marquee-track" key={track}>
          {marqueeItems.map((item) => (
            <div className="marquee-item" key={`${track}-${item}`}>
              <span className="marquee-dot">*</span>
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
