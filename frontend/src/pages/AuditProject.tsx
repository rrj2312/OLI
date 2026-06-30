import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitAudit } from "@/api/client";
import { Loader2 } from "lucide-react";

const SAMPLE_TEXT = `Company: SoilRevive Technologies. Technology: Biochar application to degraded agricultural soils in Maharashtra. CO2 claim: 340 kg CO2 per hectare per year at ₹4,400 per ton cost. Stage: 18-month field trial completed across 3 districts, peer-reviewed paper submitted. Revenue model: 55% carbon credits, 30% farmer subscriptions, 15% state pilot grant. Team: 6 members including 2 soil scientists, published field trial data available. Supply chain: Biomass sourced within 50km radius, transportation emissions fully accounted.`;

const AuditProject = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const canSubmit = text.trim().length >= 50;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await submitAudit(text);
      navigate("/report", { state: { report: data } });
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex max-w-2xl flex-col items-center px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold">Audit a Climate Project</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your project description here…"
        className="mb-4 h-56 w-full resize-none rounded-xl glass-input p-4 font-mono text-sm text-foreground shadow-blue transition-shadow duration-200 focus:shadow-blue-hover focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      <div className="mb-6 flex w-full gap-3">
        <button
          onClick={() => setText(SAMPLE_TEXT)}
          className="rounded-xl glass-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          Load Sample
        </button>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-blue transition-all duration-200 hover:shadow-blue-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          Run Audit
        </button>
      </div>

      {loading && (
        <div className="w-full rounded-xl glass-card p-8 text-center shadow-blue">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Extracting claims → Retrieving benchmarks → Validating → Scoring…
          </p>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default AuditProject;
