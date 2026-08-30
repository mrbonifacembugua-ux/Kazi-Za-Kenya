"use client";

export default function MobileMarketplaceHeader() {
  return (
    <style jsx global>{`
      @media (max-width: 800px) {
        /* Mobile marketplace header: account access matters more than duplicate search. */
        .app .topbar .search {
          display: none !important;
        }

        .app .topbar .actions {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          gap: 6px !important;
          margin-left: auto !important;
          min-width: 0 !important;
        }

        /* The same actions already exist in the lower marketplace panel. */
        .app .topbar .actions > .btn.primary {
          display: none !important;
        }

        /* Keep the narrow phone header focused on the account entry point. */
        .app .topbar .actions [data-kzk-logout-button="true"] {
          display: none !important;
        }

        .app .topbar .actions .btn {
          min-height: 40px !important;
          padding: 8px 11px !important;
          border-radius: 10px !important;
          font-size: 12px !important;
          line-height: 1 !important;
          white-space: nowrap !important;
        }

        .app .topbar .brand {
          flex: 1 1 auto !important;
          min-width: 0 !important;
          white-space: nowrap !important;
        }
      }

      @media (max-width: 380px) {
        .app .topbar .brand {
          font-size: 15px !important;
        }

        .app .topbar .actions .btn {
          padding-left: 9px !important;
          padding-right: 9px !important;
          font-size: 11px !important;
        }
      }
    `}</style>
  );
}
