export default function Head() {
  const bootGuard = `
    (function () {
      try {
        var params = new URLSearchParams(window.location.search);
        var country = params.get('country');
        if (window.location.pathname !== '/' || !country || !/^[a-z]{2}$/i.test(country)) return;

        var root = document.documentElement;
        root.setAttribute('data-kzk-market-entry-boot', '1');

        var started = Date.now();
        var finished = false;

        function reveal() {
          if (finished) return;
          finished = true;
          root.removeAttribute('data-kzk-market-entry-boot');
        }

        function styledMarketplaceReady() {
          var app = document.querySelector('.app');
          var topbar = document.querySelector('.topbar');
          var panel = document.querySelector('.panel');
          if (!app || !topbar || !panel) return false;

          try {
            var topbarStyle = window.getComputedStyle(topbar);
            var panelStyle = window.getComputedStyle(panel);
            var appStyle = window.getComputedStyle(app);

            var topbarReady = topbarStyle.display === 'flex' || topbarStyle.display === 'grid';
            var panelReady = panelStyle.position === 'absolute' || panelStyle.position === 'fixed' || panelStyle.overflowY === 'auto' || panelStyle.overflowY === 'scroll';
            var fontReady = appStyle.fontFamily && appStyle.fontFamily.toLowerCase().indexOf('times') === -1;

            return topbarReady && panelReady && fontReady;
          } catch (_) {
            return false;
          }
        }

        function check() {
          if (finished) return;
          if (styledMarketplaceReady()) {
            requestAnimationFrame(function () {
              requestAnimationFrame(reveal);
            });
            return;
          }
          if (Date.now() - started > 2500) {
            reveal();
            return;
          }
          window.setTimeout(check, 30);
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', check, { once: true });
        } else {
          check();
        }
        window.setTimeout(reveal, 3000);
      } catch (_) {}
    })();
  `;

  return (
    <>
      <title>AnyDayWork — Find work near you. Any day.</title>
      <meta
        name="description"
        content="Find local workers, jobs and practical services near you with AnyDayWork."
      />
      <style>{`
        html[data-kzk-market-entry-boot="1"] body {
          visibility: hidden !important;
          background: #f5f7f5 !important;
        }
      `}</style>
      <script dangerouslySetInnerHTML={{ __html: bootGuard }} />
    </>
  );
}
