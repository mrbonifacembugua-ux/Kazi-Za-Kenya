"use client";

import { usePathname } from "next/navigation";

export default function AccountTypographyPolish() {
  const pathname = usePathname();
  const accountPage = pathname === "/account";
  const manageJobsPage = pathname === "/manage-jobs";

  if (!accountPage && !manageJobsPage) return null;

  return (
    <style jsx global>{`
      /*
       * Kazi za Kenya account typography hierarchy
       * Permanent interface language = Kazi green / stronger weight
       * User-entered content = charcoal
       * Supporting information = muted grey
       * Layout and behaviour are intentionally untouched.
       */

      ${accountPage ? `
        .page .card > h2,
        .page .card .profileEditor h2,
        .page .card .danger h2 {
          color: #176b35 !important;
          font-weight: 850 !important;
          letter-spacing: -0.01em;
        }

        .page .card .formGrid label {
          color: #176b35 !important;
          font-weight: 850 !important;
        }

        .page .card .formGrid input,
        .page .card .formGrid select,
        .page .card .formGrid textarea {
          color: #202922 !important;
          font-weight: 550 !important;
        }

        .page .card header h1,
        .page .card article b {
          color: #202922 !important;
        }

        .page .card header p,
        .page .card article p,
        .page .card .editorHeading p,
        .page .card .photoRow small,
        .page .card .empty,
        .page .card .danger p {
          color: #6f7b73 !important;
        }

        .page .card article .right > span {
          color: #176b35 !important;
          background: #edf7ef !important;
          border: 1px solid #d9ebdd;
          font-weight: 900 !important;
        }

        .page .card article .right > em {
          color: #176b35 !important;
          font-weight: 850 !important;
        }

        .page .card .actions button,
        .page .card article .right button,
        .page .card .uploadButton {
          color: #176b35 !important;
          font-weight: 850 !important;
        }
      ` : ""}

      ${manageJobsPage ? `
        .page .wrap > h1 {
          color: #176b35 !important;
          font-weight: 900 !important;
          letter-spacing: -0.02em;
        }

        .page .wrap > .intro,
        .page .wrap .none,
        .page .wrap .empty {
          color: #6f7b73 !important;
        }

        .page .wrap .jobhead h2,
        .page .wrap .person strong,
        .page .wrap .applicant p,
        .page .wrap .hired strong {
          color: #202922 !important;
        }

        .page .wrap .jobhead span,
        .page .wrap .jobhead > b {
          color: #176b35 !important;
          font-weight: 900 !important;
        }

        .page .wrap .jobhead span {
          background: #edf7ef;
          border: 1px solid #d9ebdd;
          border-radius: 999px;
          display: inline-block;
          padding: 4px 8px;
        }

        .page .wrap .person small,
        .page .wrap .completed span {
          color: #6f7b73 !important;
        }

        .page .wrap .price {
          color: #176b35 !important;
          font-weight: 900 !important;
        }

        .page .wrap .state {
          color: #176b35 !important;
          background: #edf7ef !important;
          border: 1px solid #d9ebdd;
          font-weight: 900 !important;
        }

        .page .wrap .state.rejected {
          color: #8b4141 !important;
          background: #f5eded !important;
          border-color: #ead9d9;
        }

        .page .wrap .hired,
        .page .wrap .waiting {
          color: #526057 !important;
        }
      ` : ""}
    `}</style>
  );
}
