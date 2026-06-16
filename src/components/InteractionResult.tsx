import { useState } from "react";
import { InteractionResult as Result } from "@/lib/drugInteractions";
import {
  AlertTriangle, CheckCircle, AlertCircle, Info, Stethoscope, BookOpen,
  Dna, TrendingUp, ChevronDown, ChevronUp,
  Pipette, FlaskConical, Activity, Droplet,
} from "lucide-react";



interface Props {
  result: Result;
  drugA: string;
  drugB: string;
}

const severityConfig = {
  severe: {
    badgeClass: "badge-severe",
    label: "Actionable Clinical Interaction",
    icon: <AlertTriangle className="w-4 h-4" />,
    borderClass: "border-l-severe",
    bgClass: "bg-severe/5",
    ringClass: "ring-2 ring-severe/40 shadow-[0_0_30px_-8px_hsl(0,72%,51%/0.4)]",
  },
  moderate: {
    badgeClass: "badge-moderate",
    label: "Moderate Interaction",
    icon: <AlertCircle className="w-4 h-4" />,
    borderClass: "border-l-warning",
    bgClass: "bg-warning/3",
    ringClass: "",
  },
  mild: {
    badgeClass: "badge-mild",
    label: "Minor / Theoretical",
    icon: <Info className="w-4 h-4" />,
    borderClass: "border-l-primary",
    bgClass: "bg-primary/3",
    ringClass: "",
  },
  none: {
    badgeClass: "badge-safe",
    label: "No Significant Interaction",
    icon: <CheckCircle className="w-4 h-4" />,
    borderClass: "border-l-success",
    bgClass: "bg-success/3",
    ringClass: "",
  },
};

// Heuristic ADME overlap inference from pathway data
function getAdmePathwayClash(result: Result, drugA: string, drugB: string) {
  const pathways = result.inSilico?.pathwayOverlap ?? [];
  const text = (result.mechanism + " " + result.recommendation).toLowerCase();

  const has = (keys: string[]) => keys.some(k => text.includes(k) || pathways.some(p => p.toLowerCase().includes(k)));

  return [
    {
      stage: "Absorption",
      icon: Pipette,
      affected: has(["absorption", "chelat", "antacid", "p-glycoprotein", "p-gp"]),
      note: "GI uptake, chelation, P-gp efflux",
    },
    {
      stage: "Distribution",
      icon: Droplet,
      affected: has(["protein binding", "displace", "albumin"]),
      note: "Plasma protein binding, tissue partition",
    },
    {
      stage: "Metabolism",
      icon: FlaskConical,
      affected: has(["cyp", "metaboli", "enzyme", "inhibit", "induc"]),
      note: "Hepatic CYP450 enzymes",
    },
    {
      stage: "Excretion",
      icon: Activity,
      affected: has(["renal", "clearance", "excret", "kidney", "tubular"]),
      note: "Renal & biliary clearance",
    },
  ];
}

const InteractionResult = ({ result, drugA, drugB }: Props) => {
  const config = severityConfig[result.severity];
  const isMinor = result.severity === "mild" || result.severity === "none";
  const [minorOpen, setMinorOpen] = useState(false);
  const adme = getAdmePathwayClash(result, drugA, drugB);
  const clashCount = adme.filter(a => a.affected).length;

  // ===== MUTED COLLAPSED VIEW FOR MINOR/THEORETICAL =====
  if (isMinor && !minorOpen) {
    return (
      <div className="animate-fade-in-up">
        <button
          onClick={() => setMinorOpen(true)}
          className="w-full card-elevated p-4 flex items-center gap-3 hover:bg-secondary/30 transition-all opacity-80 hover:opacity-100"
        >
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            {config.icon}
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground/80">
              {drugA} ↔ {drugB}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {config.label} · Risk {result.riskScore}/100 · Click to expand
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className={`card-elevated p-6 border-l-4 ${config.borderClass} ${config.bgClass} ${config.ringClass} relative overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div>
            <h3 className={`font-display text-lg font-bold ${result.severity === "severe" ? "text-severe" : "text-foreground"}`}>
              {drugA} <span className="text-muted-foreground font-normal">↔</span> {drugB}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
              DDI Analysis Report · Risk Score: {result.riskScore}/100
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`${config.badgeClass} inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold ${result.severity === "severe" ? "animate-pulse" : ""}`}>
              {config.icon}
              {config.label}
            </span>
            {isMinor && (
              <button onClick={() => setMinorOpen(false)} aria-label="Collapse" className="text-muted-foreground hover:text-foreground">
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ADME Pathway Structural Overlap */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            <FlaskConical className="w-3.5 h-3.5" />
            ADME Pathway Clash — Structural Overlap
            {clashCount > 0 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-severe/15 text-severe ml-1">
                {clashCount} affected
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {adme.map(({ stage, icon: Icon, affected, note }) => (
              <div
                key={stage}
                className={`rounded-xl p-3 border text-center transition-all ${
                  affected
                    ? "bg-severe/8 border-severe/30 shadow-sm"
                    : "bg-secondary/30 border-border opacity-60"
                }`}
              >
                <Icon className={`w-4 h-4 mx-auto mb-1 ${affected ? "text-severe" : "text-muted-foreground"}`} />
                <p className={`text-[10px] font-bold ${affected ? "text-severe" : "text-foreground/70"}`}>{stage}</p>
                <p className="text-[8px] text-muted-foreground mt-0.5 leading-tight">{note}</p>
                {affected && (
                  <span className="inline-block mt-1 w-1.5 h-1.5 rounded-full bg-severe animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PGx Adjustment */}
        {result.pharmacogenomicAdjustment && (
          <div className="mb-5 bg-accent/60 rounded-xl p-4 border border-primary/15">
            <div className="flex items-center gap-2 text-sm font-semibold text-accent-foreground mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Dna className="w-4 h-4 text-primary" />
              </div>
              Pharmacogenomic Adjustment Applied
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-background/60 rounded-lg p-2.5">
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Affected Enzymes</span>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {result.pharmacogenomicAdjustment.affectedEnzymes.map(e => (
                    <span key={e} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-background/60 rounded-lg p-2.5">
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">Adjusted Score</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <TrendingUp className="w-3.5 h-3.5 text-warning" />
                  <span className="text-lg font-bold text-foreground font-display">
                    {result.pharmacogenomicAdjustment.adjustedRiskScore}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">/100</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-foreground/75 leading-relaxed">
              {result.pharmacogenomicAdjustment.explanation}
            </p>
          </div>
        )}

        {/* Mechanism */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5" />
            Pharmacological Mechanism
          </div>
          <p className="text-sm text-foreground/85 leading-relaxed pl-6">
            {result.mechanism}
          </p>
        </div>

        {/* Recommendation */}
        <div className={`rounded-xl p-4 border ${result.severity === "severe" ? "bg-severe/8 border-severe/30" : "bg-secondary/50 border-border"}`}>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            Clinical Management Recommendation
          </div>
          <p className={`text-sm leading-relaxed pl-6 ${result.severity === "severe" ? "text-foreground font-medium" : "text-foreground/85"}`}>
            {result.recommendation}
          </p>
        </div>

      </div>

    </div>
  );
};

export default InteractionResult;
