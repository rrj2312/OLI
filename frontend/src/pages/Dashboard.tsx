import { Link } from "react-router-dom";
import { FileSearch, ShieldCheck, BarChart3, Flag, Users } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "AI Claim Extraction",
    desc: "Paste any project description and our AI extracts every verifiable claim automatically.",
    shadow: "shadow-blue hover:shadow-blue-hover",
  },
  {
    icon: BarChart3,
    title: "5-Dimension Scoring",
    desc: "Tech readiness, impact authenticity, greenwash risk, policy dependency, and scalability.",
    shadow: "shadow-green hover:shadow-green-hover",
  },
  {
    icon: Flag,
    title: "Red Flag Engine",
    desc: "Critical risks ranked by severity with fix recommendations and source citations.",
    shadow: "shadow-blue hover:shadow-blue-hover",
  },
  {
    icon: Users,
    title: "Investor Matching",
    desc: "Instantly see which investor types are a fit — and which aren't ready yet.",
    shadow: "shadow-green hover:shadow-green-hover",
  },
  {
    icon: ShieldCheck,
    title: "PortfolioShield",
    desc: "Stress-test your entire shortlist across subsidy, pricing, and supply chain scenarios.",
    shadow: "shadow-blue hover:shadow-blue-hover",
  },
];

const steps = [
  "Submit project description",
  "AI extracts verifiable claims",
  "5-dimension viability score generated",
  "Red flags ranked by severity",
  "Investor match recommendation",
];

const Dashboard = () => {
  return (
    <div className="container mx-auto max-w-5xl px-6 py-16">
      {/* Hero */}
      <section className="mb-20 glass-panel rounded-3xl px-8 py-16 text-center shadow-blue">
        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          Is this climate project <span className="text-primary">actually</span> what it claims?
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          OLI turns six months of climate due diligence into a two minute evidence trail.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/submit"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-shadow duration-200 shadow-blue hover:shadow-blue-hover"
          >
            Audit a Project
          </Link>
          <Link
            to="/portfolio"
            className="rounded-xl border-2 border-secondary px-6 py-3 text-sm font-semibold text-secondary transition-shadow duration-200 shadow-green hover:shadow-green-hover"
          >
            PortfolioShield
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mb-20">
        <h2 className="mb-8 text-center text-2xl font-bold">What OLI Does</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className={`rounded-xl glass-card p-6 ${f.shadow}`}
            >
              <f.icon className="mb-3 h-6 w-6 text-primary" />
              <h3 className="mb-1 text-sm font-bold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="mb-8 text-center text-2xl font-bold">How It Works</h2>
        <div className="grid gap-4 md:grid-cols-5">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`rounded-xl glass-card p-5 ${
                i % 2 === 0 ? "shadow-blue hover:shadow-blue-hover" : "shadow-green hover:shadow-green-hover"
              }`}
            >
              <span className="mb-2 inline-block font-mono text-2xl font-bold text-primary">{i + 1}</span>
              <p className="text-sm font-medium text-foreground">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
