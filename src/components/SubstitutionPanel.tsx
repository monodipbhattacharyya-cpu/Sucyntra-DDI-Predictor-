import { ArrowRight, RefreshCw, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { type InteractionResult } from "@/lib/drugInteractions";
import { findSubstitutions } from "@/lib/drugSubstitution";

interface Props {
  result: InteractionResult;
  drugA: string;
  drugB: string;
}

const SubstitutionPanel = ({ result, drugA, drugB }: Props) => {
  const suggestions = findSubstitutions(result, drugA, drugB);

  if (suggestions.length === 0) return null;

  return (
    <div className="card-elevated p-5 border-l-4 border-l-success animate-fade-in-up relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg amber-gradient" />

      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg amber-gradient flex items-center justify-center text-white shadow">
          <RefreshCw className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground font-display">
            Recommended Therapeutic Alternatives
          </h3>
          <p className="text-[10px] text-muted-foreground">
            Same therapeutic class · avoids the specific metabolic clash (e.g. hepatic → renal clearance)
          </p>
        </div>
      </div>


      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <div
            key={`${s.originalDrug}-${s.suggestedDrug}`}
            className={`rounded-xl p-4 border transition-all ${
              s.confidenceLevel === "high"
                ? "bg-success/5 border-success/20"
                : "bg-accent/40 border-border"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {s.confidenceLevel === "high" ? (
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
              ) : (
                <Shield className="w-4 h-4 text-primary flex-shrink-0" />
              )}
              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                s.confidenceLevel === "high"
                  ? "bg-success/15 text-success"
                  : "bg-primary/10 text-primary"
              }`}>
                {s.confidenceLevel === "high" ? "Preferred" : "Alternative"} · {s.therapeuticClass}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-severe line-through opacity-60">
                  {s.originalDrug}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-success" />
                <span className="text-xs font-mono font-bold text-success">
                  {s.suggestedDrug}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-foreground/75 leading-relaxed mb-1.5">
              {s.reason}
            </p>
            <p className="text-[10px] text-muted-foreground italic">
              Metabolic Profile: {s.metabolicAdvantage}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-start gap-2 bg-warning/5 rounded-lg p-3 border border-warning/15">
        <AlertTriangle className="w-3.5 h-3.5 text-warning mt-0.5 flex-shrink-0" />
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <strong>Clinical Note:</strong> These substitutions are based on pharmacokinetic pathway analysis.
          Always verify patient-specific factors (allergies, comorbidities, prior drug history) before switching therapy.
          Consult the attending physician for final decision.
        </p>
      </div>
    </div>
  );
};

export default SubstitutionPanel;
