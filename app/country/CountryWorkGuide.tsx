import Link from "next/link";

type Country = "Kenya" | "Uganda" | "Nigeria";

const guides: Record<Country, {
  intro: string;
  areas: { name: string; guidance: string }[];
  steps: string[];
}> = {
  Kenya: {
    intro: "Whether you need a repair at home or want to offer a practical skill, start by describing the task and the location clearly. AnyDayWork lets you explore its marketplace; listings and availability depend on participating users.",
    areas: [
      { name: "Nairobi", guidance: "For apartment repairs, cleaning or electrical work, include your estate or neighbourhood and preferred visit time." },
      { name: "Mombasa", guidance: "For plumbing, painting or moving help, specify access arrangements and whether materials are already available." },
      { name: "Kisumu", guidance: "For carpentry or appliance repair, describe the item, the problem and whether work must be completed on-site." }
    ],
    steps: [
      "Describe the task, location, timing and any materials you already have.",
      "Compare relevant worker profiles and agree on scope, price and timing before work starts.",
      "If offering services, describe your skills and the locations you can reasonably serve."
    ]
  },
  Uganda: {
    intro: "Local jobs range from household repairs to motorcycle maintenance and delivery support. When looking for help, a clear description of the job and neighbourhood makes it easier to identify a suitable worker.",
    areas: [
      { name: "Kampala", guidance: "For cleaning, plumbing and electrical work, share the division or neighbourhood and any building-access requirements." },
      { name: "Jinja", guidance: "For carpentry or painting, include measurements, photos of the work area and your desired completion date." },
      { name: "Mbarara", guidance: "For motorcycle repairs or deliveries, specify the vehicle or parcel details and the pickup location." }
    ],
    steps: [
      "State your town, the type of work and when you need it completed.",
      "Check a worker's stated experience and clarify whether tools and supplies are included.",
      "Agree on payment terms and a safe meeting or work arrangement before proceeding."
    ]
  },
  Nigeria: {
    intro: "From home maintenance to delivery and digital services, requirements can differ widely by city. Include the exact task, service area and expected outcome when looking for local help.",
    areas: [
      { name: "Lagos", guidance: "For repairs, cleaning or deliveries, specify your area and allow for travel or access arrangements." },
      { name: "Abuja", guidance: "For electrical work or carpentry, explain the property type and whether a site visit is needed for an estimate." },
      { name: "Port Harcourt", guidance: "For mechanics or construction support, describe the equipment, project stage and required skills." }
    ],
    steps: [
      "Post a clear description with the city, neighbourhood, budget range and deadline.",
      "Ask about relevant experience and confirm the scope before committing.",
      "Use safe payment practices and avoid sharing sensitive personal information publicly."
    ]
  }
};

export default function CountryWorkGuide({ country }: { country: Country }) {
  const guide = guides[country];
  return (
    <section aria-labelledby="country-work-guide" style={{maxWidth:1240,margin:"0 auto",padding:"56px 20px 70px",color:"#142019"}}>
      <p style={{fontSize:12,fontWeight:800,color:"#147a42",letterSpacing:".08em"}}>PRACTICAL LOCAL GUIDE</p>
      <h2 id="country-work-guide" style={{fontSize:"clamp(27px,4vw,38px)",margin:"10px 0 14px"}}>Finding and offering work in {country}</h2>
      <p style={{lineHeight:1.75,maxWidth:850,color:"#4d6155"}}>{guide.intro}</p>
      <h3 style={{fontSize:23,margin:"32px 0 15px"}}>Tips for different locations</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:16}}>
        {guide.areas.map(area=><article key={area.name} style={{border:"1px solid #dce6de",borderRadius:14,padding:20,background:"#f8fbf9"}}>
          <h4 style={{margin:"0 0 8px",fontSize:18}}>{area.name}</h4>
          <p style={{lineHeight:1.65,margin:0,color:"#4d6155"}}>{area.guidance}</p>
        </article>)}
      </div>
      <h3 style={{fontSize:23,margin:"34px 0 14px"}}>Before hiring or offering a service</h3>
      <ol style={{lineHeight:1.9,paddingLeft:23,maxWidth:900}}>{guide.steps.map(step=><li key={step}>{step}</li>)}</ol>
      <p style={{lineHeight:1.7,color:"#4d6155"}}>Explore the <Link href="/" style={{color:"#11783d",fontWeight:700}}>AnyDayWork marketplace</Link> to see available options. This guide does not imply that workers or jobs are currently listed in every location.</p>
    </section>
  );
}
