export default function Head() {
  return (
    <>
      <title>AnyDayWork — Find work near you. Any day.</title>
      <meta
        name="description"
        content="Find local workers, jobs and practical services near you with AnyDayWork."
      />
      <style>{`
        /* Critical first-paint branding. This lives in <head> so the old
           Kazi za Kenya text can never be painted while React/CSS loads. */
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
    </>
  );
}
