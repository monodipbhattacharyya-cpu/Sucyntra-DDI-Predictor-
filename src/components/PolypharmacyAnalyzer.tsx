import { useState, useCallback } from "react";
import { Layers, Plus, X, Zap, AlertTriangle, CheckCircle, AlertCircle, Info, TrendingUp } from "lucide-react";
import { DRUGS, analyzePolypharmacy, type PharmacogenomicProfile, type PolypharmacyResult, type Severity } from "@/lib/drugInteractions";
import DrugSelect from "./DrugSelect";

interface Props {
  pgxProfile?: PharmacogenomicProfile;
}

const severityIcon: Record<Severity, React.ReactNode> = {
  severe: <AlertTriangle className="w-4 h-4" />,
  moderate: <AlertCircle className="w-4 h-4" />,
  mild: <Info className="w-4 h-4" />,
  none: <CheckCircle className="w-4 h-4" />,
};

const severityBadge: Record<Severity, string> = {
  severe: "badge-severe",
  moderate: "badge-moderate",
  mild: "badge-mild",
  none: "badge-safe",
};

const severityLabel: Record<Severity, string> = {
  severe: "Major/Contraindicated",
  moderate: "Moderate",
  mild: "Minor",
  none: "Minimal",
};

const PolypharmacyAnalyzer = ({ pgxProfile }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [drugs, setDrugs] = useState<string[]>(["", "", ""]);
  const [result, setResult] = useState<PolypharmacyResult | null>(null);
  const [loading, setLoading] = useState(false);

  const addDrug = () => {
    if (drugs.length < 10) setDrugs([...drugs, ""]);
  };

  const removeDrug = (index: number) => {
    if (drugs.length > 3) setDrugs(drugs.filter((_, i) => i !== index));
  };

  const updateDrug = (index: number, value: string) => {
    const updated = [...drugs];
    updated[index] = value;
    setDrugs(updated);
  };

  const validDrugs = drugs.filter(d => d.trim() !== "");
  const canAnalyze = validDrugs.length >= 3 && new Set(validDrugs).size === validDrugs.length;

  const handleAnalyze = useCallback(() => {
    if (!canAnalyze) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(analyzePolypharmacy(validDrugs, pgxProfile));
      setLoading(false);
    }, 1500);
  }, [validDrugs, canAnalyze, pgxProfile]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="card-elevated p-5 flex items-center gap-4 hover:shadow-lg transition-all duration-200 group w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" style={{ background: 'var(--gradient-hero)' }} />
        <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center flex-shrink-0 shadow-md">
          <Layers className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="text-left flex-1">
          <p className="text-base font-bold text-foreground font-display">Polypharmacy Cumulative Risk Analyzer</p>
          <p className="text-xs text-muted-foreground mt-0.5">Evidence-based pathway accumulation across 3–10 concurrent drugs</p>
        </div>
        <TrendingUp className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
      </button>
    );
  }

  return (
    <div className="card-elevated p-6 animate-fade-in-up relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" style={{ background: 'var(--gradient-hero)' }} />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center shadow-sm">
            <Layers className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground font-display">Polypharmacy Cumulative Risk Analyzer</h3>
            <p className="text-[10px] text-muted-foreground">Deterministic pathway accumulation engine</p>
          </div>
        </div>
        <button onClick={() => { setIsOpen(false); setResult(null); }} aria-label="Close polypharmacy analyzer" className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        Add 3–10 drugs to analyze cumulative interactions. The clinical rules engine detects when multiple "minor" interactions compound via the same pathway into a "major" clinical risk.
      </p>

      {/* Drug inputs */}
      <div className="space-y-2 mb-4">
        {drugs.map((drug, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="flex-1">
              <DrugSelect
                label={`Drug ${i + 1}`}
                value={drug}
                onChange={(v) => updateDrug(i, v)}
                icon={<span className="text-xs font-bold text-primary">{i + 1}</span>}
              />
            </div>
            {drugs.length > 3 && (
              <button
                onClick={() => removeDrug(i)}
                aria-label={`Remove drug ${i + 1}`}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors mb-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {drugs.length < 10 && (
          <button
            onClick={addDrug}
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Plus className="w-3 h-3" /> Add Drug
          </button>
        )}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!canAnalyze || loading}
        className="w-full hero-gradient text-primary-foreground font-semibold py-3 rounded-lg transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
      >
        <Zap className="w-4 h-4" />
        {loading ? "Analyzing..." : `Analyze ${validDrugs.length} Drug Regimen`}
      </button>

      {/* Results */}
      {result && (
        <div className="mt-5 space-y-4 animate-fade-in-up">
          {/* Overall Risk */}
          <div className={`p-4 rounded-lg border-l-4 ${
            result.cumulativeRisk.severity === "severe" ? "border-l-severe bg-severe/5" :
            result.cumulativeRisk.severity === "moderate" ? "border-l-warning bg-warning/5" :
            result.cumulativeRisk.severity === "mild" ? "border-l-primary bg-primary/5" :
            "border-l-success bg-success/5"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-foreground font-display">Cumulative Risk Assessment</h4>
              <span className={`${severityBadge[result.cumulativeRisk.severity]} inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold`}>
                {severityIcon[result.cumulativeRisk.severity]}
                Score: {result.cumulativeRisk.overallScore}/100
              </span>
            </div>

            {/* Top Concerns */}
            {result.cumulativeRisk.topConcerns.length > 0 && (
              <ul className="space-y-1 mb-3">
                {result.cumulativeRisk.topConcerns.map((c, i) => (
                  <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-warning mt-0.5 flex-shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            )}

            <p className="text-[11px] text-muted-foreground">
              {result.cumulativeRisk.alertFatigueReduction}
            </p>
          </div>

          {/* Pathway Accumulation */}
          {result.cumulativeRisk.pathwayAccumulation.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Pathway Accumulation Analysis
              </h4>
              <div className="space-y-2">
                {result.cumulativeRisk.pathwayAccumulation.map((pa, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${
                    pa.cumulativeSeverity === "severe" ? "border-severe/30 bg-severe/5" :
                    pa.cumulativeSeverity === "moderate" ? "border-warning/30 bg-warning/5" :
                    "border-border bg-secondary/30"
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-foreground">{pa.pathway}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        pa.cumulativeSeverity === "severe" ? "bg-severe/15 text-severe" :
                        pa.cumulativeSeverity === "moderate" ? "bg-warning/15 text-warning" :
                        pa.cumulativeSeverity === "mild" ? "bg-primary/15 text-primary" :
                        "bg-success/15 text-success"
                      }`}>
                        {severityLabel[pa.cumulativeSeverity]}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {pa.drugs.map(d => (
                        <span key={d} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">
                          {d}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{pa.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pairwise Summary */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Pairwise Interactions ({result.pairwiseInteractions.length} pairs)
            </h4>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {result.pairwiseInteractions
                .sort((a, b) => b.result.riskScore - a.result.riskScore)
                .map((pair, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-secondary/30 text-xs">
                  <span className="text-foreground/80">
                    {pair.drugA} ↔ {pair.drugB}
                  </span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    pair.result.severity === "severe" ? "bg-severe/15 text-severe" :
                    pair.result.severity === "moderate" ? "bg-warning/15 text-warning" :
                    pair.result.severity === "mild" ? "bg-primary/15 text-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {pair.result.riskScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolypharmacyAnalyzer;
