export default function Head() {
  return (
    <>
      <title>AnyDayWork — Find work near you. Any day.</title>
      <meta
        name="description"
        content="Find local workers, jobs and practical services near you with AnyDayWork."
      />

      <style>{`
        /*
          First-paint shield.
          The old marketplace HTML is still the server source, so on a slow
          connection the browser can paint it before React rebrands it.
          Hide that raw body immediately and show AnyDayWork instead.
        */
        html:not(.adw-app-ready) body {
          visibility: hidden !important;
        }

        html:not(.adw-app-ready)::before {
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

        html:not(.adw-app-ready)::after {
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

        /* Extra protection in case the page becomes visible before hydration. */
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
              function branded() {
                var node = document.querySelector('[data-anydaywork-branded="true"]');
                if (!node) return false;
                document.documentElement.classList.add('adw-app-ready');
                return true;
              }

              if (branded()) return;

              var observer = new MutationObserver(function () {
                if (branded()) observer.disconnect();
              });

              observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['data-anydaywork-branded']
              });

              /* Fail-safe only: never expose raw legacy branding. */
              window.setTimeout(function () {
                if (branded()) return;
                var brand = document.querySelector('.brand');
                if (brand) {
                  brand.textContent = 'AnyDayWork';
                  brand.setAttribute('data-anydaywork-branded', 'true');
                  brand.setAttribute('aria-label', 'AnyDayWork');
                }
                var hero = document.querySelector('.hero > p');
                if (hero && /Kazi za Kenya/i.test(hero.textContent || '')) {
                  hero.textContent = 'AnyDayWork connects people who need work done with people who can do it.';
                }
                document.documentElement.classList.add('adw-app-ready');
                observer.disconnect();
              }, 3000);
            })();
          `,
        }}
      />
    </>
  );
}
