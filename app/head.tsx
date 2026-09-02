export default function Head() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              var root = document.documentElement;
              root.style.visibility = 'hidden';
              root.style.background = '#ffffff';
              root.setAttribute('data-adw-paint-guard', 'true');
            })();
          `,
        }}
      />

      <title>AnyDayWork — Find work near you. Any day.</title>
      <meta
        name="description"
        content="Find local workers, jobs and practical services near you with AnyDayWork."
      />

      <style>{`
        html[data-adw-paint-guard="true"] body {
          visibility: hidden !important;
        }

        html[data-adw-paint-guard="true"]::before {
          content: "AnyDayWork";
          position: fixed;
          inset: 0;
          z-index: 2147483647;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          color: #111111;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: clamp(32px, 8vw, 48px);
          font-weight: 850;
          letter-spacing: -0.045em;
          visibility: visible !important;
        }

        html[data-adw-paint-guard="true"]::after {
          content: "Find work near you. Any day.";
          position: fixed;
          left: 0;
          right: 0;
          top: calc(50% + 38px);
          z-index: 2147483647;
          text-align: center;
          color: #5f6b63;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 14px;
          font-weight: 600;
          visibility: visible !important;
        }

        .brand {
          font-size: 0 !important;
        }
        .brand::after {
          content: "AnyDayWork";
          display: inline-block;
          font-size: 21px;
          font-weight: 850;
          white-space: nowrap;
          color: #111111;
        }
        .hero > p {
          font-size: 0 !important;
        }
        .hero > p::after {
          content: "AnyDayWork connects people who need work done with people who can do it.";
          display: inline;
          font-size: 16px;
          line-height: 1.45;
          color: inherit;
        }
        @media (max-width: 800px) {
          .brand::after { font-size: 18px; }
        }
      `}</style>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              var root = document.documentElement;

              function reveal() {
                root.classList.add('adw-app-ready');
                root.removeAttribute('data-adw-paint-guard');
                root.style.visibility = 'visible';
                root.style.background = '';
              }

              function brandRawMarkup() {
                var brand = document.querySelector('.brand');
                if (brand && /Kazi za Kenya/i.test(brand.textContent || '')) {
                  brand.textContent = 'AnyDayWork';
                  brand.setAttribute('data-anydaywork-branded', 'true');
                  brand.setAttribute('aria-label', 'AnyDayWork');
                }

                var hero = document.querySelector('.hero > p');
                if (hero && /Kazi za Kenya/i.test(hero.textContent || '')) {
                  hero.textContent = 'AnyDayWork connects people who need work done with people who can do it.';
                }

                var safety = document.querySelector('.message-safety');
                if (safety && /Kazi za/i.test(safety.textContent || '')) {
                  safety.textContent = '🔒 Keep communication inside AnyDayWork until you are comfortable meeting.';
                }

                if (brand && /AnyDayWork/i.test(brand.textContent || '')) {
                  reveal();
                  return true;
                }
                return false;
              }

              if (brandRawMarkup()) return;

              var observer = new MutationObserver(function () {
                if (brandRawMarkup()) observer.disconnect();
              });

              observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                characterData: true
              });

              window.setTimeout(function () {
                brandRawMarkup();
                reveal();
                observer.disconnect();
              }, 3000);
            })();
          `,
        }}
      />
    </>
  );
}
