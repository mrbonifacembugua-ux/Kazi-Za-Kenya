import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find Local Workers & Jobs in Kenya | AnyDayWork",
  description:
    "Find local services and jobs in Kenya with AnyDayWork. Explore electricians, plumbers, cleaners, mechanics, carpenters, technicians, designers and more.",
  alternates: { canonical: "/country/kenya" },
  openGraph: {
    title: "Find Local Workers & Jobs in Kenya | AnyDayWork",
    description: "Discover local services and job opportunities across Kenya with AnyDayWork.",
    type: "website",
  },
};

const services = [
  "Electricians",
  "Plumbers",
  "Cleaning Services",
  "Carpenters",
  "Mechanics",
  "Phone & Electronics Repair",
  "Painters",
  "Moving & Delivery",
  "Home & Appliance Repair",
  "Web & Graphic Design",
  "Tailoring",
  "General Handyman Services",
];

const locations = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Machakos", "Nyeri"];

export default function KenyaCountryPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Find Local Workers & Jobs in Kenya",
    description: "AnyDayWork helps people discover local services and job opportunities in Kenya.",
    about: { "@type": "Country", name: "Kenya" },
  };

  return (
    <main className="country-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">ANYDAYWORK KENYA</p>
          <h1>Find Local Workers & Jobs in Kenya</h1>
          <p className="lead">
            Discover people who can help with everyday work and explore jobs people need done across Kenya.
          </p>
          <div className="actions">
            <Link href="/" className="primary">Find a worker</Link>
            <Link href="/post-job" className="secondary">Post a job</Link>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <h2>Popular services in Kenya</h2>
        <p>Browse practical local services. Availability will grow as real workers join AnyDayWork.</p>
        <div className="grid">
          {services.map((service) => <div className="card" key={service}>{service}</div>)}
        </div>
      </section>

      <section className="soft">
        <div className="wrap section">
          <h2>Find work and services near you</h2>
          <p>AnyDayWork is designed to connect people based on the country and area where the work is needed.</p>
          <div className="locations">
            {locations.map((location) => <span key={location}>{location}</span>)}
          </div>
        </div>
      </section>

      <section className="wrap section two">
        <div>
          <h2>Need someone to do a job?</h2>
          <p>Post what you need done, describe the work and location, and let suitable local workers discover the opportunity.</p>
          <Link href="/post-job" className="textLink">Post a job in Kenya →</Link>
        </div>
        <div>
          <h2>Looking for work?</h2>
          <p>Create your real AnyDayWork account and offer the services you can provide. Your profile remains part of the existing marketplace.</p>
          <Link href="/signup" className="textLink">Create an account →</Link>
        </div>
      </section>

      <section className="wrap note">
        <strong>Real marketplace first.</strong>
        <p>This country page describes services available through the marketplace. Example profiles used for development are not presented here as real workers.</p>
      </section>

      <style>{`
        .country-page{min-height:100vh;background:#fff;color:#17221b;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.wrap{width:min(1100px,calc(100% - 36px));margin:0 auto}.hero{padding:86px 0 72px;background:linear-gradient(135deg,#f1f8f3,#fff)}.eyebrow{font-size:12px;font-weight:900;letter-spacing:.14em;color:#13723a;margin:0 0 14px}.hero h1{font-size:clamp(36px,6vw,64px);line-height:1.02;max-width:820px;margin:0 0 20px;letter-spacing:-.04em}.lead{max-width:700px;font-size:19px;line-height:1.65;color:#536159}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}.primary,.secondary{padding:13px 19px;border-radius:12px;font-weight:850;text-decoration:none}.primary{background:#15763b;color:#fff}.secondary{border:1px solid #bfd3c5;color:#175e34;background:#fff}.section{padding:58px 0}.section h2{font-size:29px;margin:0 0 10px}.section>p{color:#617068;max-width:760px;line-height:1.65}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:25px}.card{border:1px solid #dde7df;border-radius:14px;padding:18px;font-weight:800;background:#fff}.soft{background:#f6f8f6}.locations{display:flex;flex-wrap:wrap;gap:9px;margin-top:23px}.locations span{padding:9px 13px;border-radius:999px;background:#fff;border:1px solid #dbe5dd;font-weight:700}.two{display:grid;grid-template-columns:1fr 1fr;gap:45px}.two p{color:#617068;line-height:1.65}.textLink{color:#126f36;font-weight:850;text-decoration:none}.note{margin-top:5px;margin-bottom:60px;border:1px solid #e0e8e2;background:#fafcfa;border-radius:16px;padding:20px}.note p{margin:6px 0 0;color:#647169;line-height:1.55}@media(max-width:720px){.hero{padding:60px 0 50px}.grid{grid-template-columns:1fr 1fr}.two{grid-template-columns:1fr;gap:22px}.section{padding:42px 0}}@media(max-width:430px){.grid{grid-template-columns:1fr}.hero h1{font-size:38px}}
      `}</style>
    </main>
  );
}
