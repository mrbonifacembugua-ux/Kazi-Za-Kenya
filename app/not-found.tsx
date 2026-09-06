import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f6f8f7",
        color: "#111111",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <section
        aria-labelledby="not-found-title"
        style={{
          width: "min(100%, 560px)",
          padding: "36px 28px",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "20px",
          boxShadow: "0 12px 36px rgba(0, 0, 0, 0.08)",
          textAlign: "center",
        }}
      >
        <Link
          href="/"
          aria-label="AnyDayWork marketplace"
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            marginBottom: "22px",
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            textDecoration: "none",
          }}
        >
          <span style={{ color: "#111111" }}>Any</span>
          <span style={{ color: "#e30613" }}>Day</span>
          <span style={{ color: "#00843d" }}>Work</span>
        </Link>

        <div
          style={{
            margin: "0 auto 18px",
            width: "72px",
            height: "72px",
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            background: "#ecf7f0",
            color: "#00843d",
            fontSize: "22px",
            fontWeight: 800,
          }}
        >
          404
        </div>

        <h1
          id="not-found-title"
          style={{ margin: "0 0 10px", fontSize: "30px", lineHeight: 1.15 }}
        >
          This page isn&apos;t here
        </h1>

        <p
          style={{
            margin: "0 auto 26px",
            maxWidth: "430px",
            color: "#5f6368",
            fontSize: "16px",
            lineHeight: 1.6,
          }}
        >
          The link may be outdated or the page may have moved. You can return to
          the AnyDayWork marketplace and continue from there.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            borderRadius: "10px",
            background: "#00843d",
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Back to marketplace
        </Link>
      </section>
    </main>
  );
}
