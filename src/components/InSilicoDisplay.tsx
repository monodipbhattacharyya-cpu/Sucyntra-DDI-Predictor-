import { Database, Target, GitBranch, AlertTriangle, Fingerprint, BookOpen, Network } from "lucide-react";
import { type InSilicoAnalysis } from "@/lib/drugInteractions";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface Props {
  analysis: InSilicoAnalysis;
  drugA: string;
  drugB: string;
}

const InSilicoDisplay = ({ analysis, drugA, drugB }: Props) => {
  const confidenceColor = analysis.confidenceScore >= 80 ? "text-success" :
    analysis.confidenceScore >= 50 ? "text-warning" : "text-severe";

  const confidenceGrade = analysis.confidenceScore >= 80 ? "A — High Evidence" :
    analysis.confidenceScore >= 60 ? "B — Moderate Evidence" :
    analysis.confidenceScore >= 40 ? "C — Limited Evidence" : "D — Theoretical";

  const radarData = [
    { metric: "Structural", value: analysis.structuralSimilarity * 100 },
    { metric: "Reliability", value: analysis.confidenceScore },
    { metric: "Targets", value: Math.min(100, analysis.sharedTargets.length * 25) },
    { metric: "Pathways", value: Math.min(100, analysis.pathwayOverlap.length * 20) },
    { metric: "Fingerprint", value: analysis.molecularFingerprint.reduce((a, b) => a + b, 0) / analysis.molecularFingerprint.length * 100 },
  ];

  return (
    <div className="card-elevated p-5 animate-fade-in-up relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-success to-warning rounded-t-lg" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
          <Database className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground font-display">Evidence-Based Interaction Matrix</h4>
          <p className="text-[10px] text-muted-foreground">Clinical Rules Engine · Pathway & Pharmacological Class Cross-Reference</p>
        </div>
        <span className="text-[9px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold font-mono flex items-center gap-1">
          <BookOpen className="w-3 h-3" />
          Lit-Driven
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="stat-card">
          <Fingerprint className="w-4 h-4 text-primary mx-auto mb-1.5" />
          <p className="text-2xl font-bold text-foreground font-display">
            {(analysis.structuralSimilarity * 100).toFixed(0)}%
          </p>
          <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Structural Overlap (Tanimoto)</p>
        </div>

        <div className="stat-card">
          <Target className={`w-4 h-4 ${confidenceColor} mx-auto mb-1.5`} />
          <p className={`text-2xl font-bold font-display ${confidenceColor}`}>
            {analysis.confidenceScore}%
          </p>
          <p className="text-[9px] text-foreground font-semibold mt-0.5">Literature Reliability Grade</p>
          <p className="text-[8px] text-muted-foreground/80 italic mt-0.5 leading-tight">
            {confidenceGrade}
            <br />(e.g., Sourced from Stockley's Drug Interactions &amp; FDA Datasets)
          </p>
        </div>

        <div className="stat-card">
          <GitBranch className="w-4 h-4 text-accent-foreground mx-auto mb-1.5" />
          <p className="text-2xl font-bold text-foreground font-display">
            {analysis.sharedTargets.length}
          </p>
          <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Shared Pharmacological Classes</p>
        </div>

        <div className={`stat-card ${analysis.predictedNovelRisk ? "ring-1 ring-warning/30" : ""}`}>
          <AlertTriangle className={`w-4 h-4 mx-auto mb-1.5 ${analysis.predictedNovelRisk ? "text-warning" : "text-success"}`} />
          <p className={`text-2xl font-bold font-display ${analysis.predictedNovelRisk ? "text-warning" : "text-success"}`}>
            {analysis.predictedNovelRisk ? "⚠" : "✓"}
          </p>
          <p className="text-[9px] text-muted-foreground font-medium mt-0.5">Cross-Pathway Flag</p>
        </div>
      </div>

      {/* Radar */}
      <div className="bg-secondary/30 rounded-xl p-4 mb-4">
        <h5 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Network className="w-3 h-3" />
          Multi-Dimensional Pharmacological Overlap
        </h5>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="hsl(220, 18%, 88%)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: 'hsl(220, 10%, 46%)' }} />
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
              <Radar
                dataKey="value"
                stroke="hsl(190, 70%, 35%)"
                fill="hsl(190, 70%, 35%)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {analysis.pathwayOverlap.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Shared Metabolic Pathways
          </p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.pathwayOverlap.map(p => (
              <span key={p} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/15">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-secondary/20 rounded-xl p-4">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Physicochemical Property Map — {drugA} vs {drugB}
        </p>
        <div className="flex gap-0.5 h-8 rounded-lg overflow-hidden">
          {analysis.molecularFingerprint.map((v, i) => (
            <div
              key={i}
              className="flex-1 transition-all hover:scale-y-110"
              style={{
                background: `hsl(${190 + i * 15}, ${50 + v * 30}%, ${28 + v * 22}%)`,
                opacity: 0.5 + v * 0.5,
              }}
              title={`Dimension ${i + 1}: ${v.toFixed(3)}`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[8px] text-muted-foreground font-mono">LogP (Lipophilicity)</span>
          <span className="text-[8px] text-muted-foreground font-mono">pKa (Ionization)</span>
          <span className="text-[8px] text-muted-foreground font-mono">HBA/HBD</span>
        </div>
      </div>
    </div>
  );
};

export default InSilicoDisplay;
