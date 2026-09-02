export default function Loading() {
  return (
    <div className="adw-route-loading" role="status" aria-label="Loading AnyDayWork">
      <div className="adw-route-brand" aria-hidden="true">
        <span className="adw-route-any">Any</span>
        <span className="adw-route-day">Day</span>
        <span className="adw-route-work">Work</span>
      </div>
      <p>Find work near you. Any day.</p>
      <style>{`
        .adw-route-loading {
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: #ffffff;
          color: #17221b;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .adw-route-brand {
          display: inline-flex;
          align-items: center;
          font-size: clamp(34px, 7vw, 52px);
          font-weight: 950;
          line-height: 1;
          letter-spacing: -0.05em;
        }
        .adw-route-any { color: #111111; }
        .adw-route-day { color: #d21e26; }
        .adw-route-work { color: #08783b; }
        .adw-route-loading p {
          margin: 0;
          color: #657168;
          font-size: 14px;
          font-weight: 650;
          letter-spacing: -0.01em;
        }
      `}</style>
    </div>
  );
}
