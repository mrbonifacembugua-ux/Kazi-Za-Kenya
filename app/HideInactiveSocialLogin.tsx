"use client";

export default function HideInactiveSocialLogin() {
  return (
    <style jsx global>{`
      @media (max-width: 900px) {
        .adwDivider,
        .adwSocials {
          display: none !important;
        }

        .adwSignup {
          margin-top: 1.5rem !important;
        }
      }
    `}</style>
  );
}
