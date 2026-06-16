import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { InteractionResult } from "@/lib/drugInteractions";

interface Props {
  result: InteractionResult;
  drugA: string;
  drugB: string;
}

const SEVERITY_COLORS: Record<string, string> = {
  severe: "hsl(0, 72%, 51%)",
  moderate: "hsl(38, 92%, 50%)",
  mild: "hsl(45, 90%, 55%)",
  none: "hsl(158, 64%, 38%)",
};

const InteractionChart = ({ result, drugA, drugB }: Props) => {
  const riskData = [
    { name: "Risk", value: result.riskScore },
    { name: "Safe", value: 100 - result.riskScore },
  ];

  const riskColor = SEVERITY_COLORS[result.severity];
  const safeColor = "hsl(220, 18%, 93%)";

  const catA = result.categories.drugA;
  const catB = result.categories.drugB;
  const allCats = [...catA, ...catB];
  const catCounts: Record<string, number> = {};
  allCats.forEach(c => { catCounts[c] = (catCounts[c] || 0) + 1; });
  const categoryData = Object.entries(catCounts).map(([name, value]) => ({ name, value }));

  const CAT_COLORS = [
    "hsl(190, 70%, 35%)", "hsl(210, 65%, 40%)", "hsl(260, 50%, 55%)",
    "hsl(330, 55%, 50%)", "hsl(38, 80%, 50%)", "hsl(158, 55%, 42%)",
    "hsl(15, 70%, 50%)", "hsl(280, 45%, 55%)", "hsl(90, 50%, 40%)",
  ];

  // Radar data for multi-dimensional risk
  const radarData = [
    { axis: "Pharmacokinetic", value: Math.min(100, result.riskScore * 1.2 + Math.random() * 15) },
    { axis: "Pharmacodynamic", value: Math.min(100, result.riskScore * 0.8 + Math.random() * 20) },
    { axis: "CYP450", value: Math.min(100, result.riskScore * 1.1 + Math.random() * 10) },
    { axis: "Protein Binding", value: Math.min(100, result.riskScore * 0.6 + Math.random() * 25) },
    { axis: "Renal Clearance", value: Math.min(100, result.riskScore * 0.5 + Math.random() * 20) },
    { axis: "Hepatotoxicity", value: Math.min(100, result.riskScore * 0.9 + Math.random() * 15) },
  ];

  // Bar chart data for comparative analysis
  const barData = [
    { name: "Absorption", drugA: 40 + Math.random() * 50, drugB: 40 + Math.random() * 50 },
    { name: "Distribution", drugA: 30 + Math.random() * 60, drugB: 30 + Math.random() * 60 },
    { name: "Metabolism", drugA: 20 + Math.random() * 70, drugB: 20 + Math.random() * 70 },
    { name: "Excretion", drugA: 35 + Math.random() * 55, drugB: 35 + Math.random() * 55 },
  ];

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Top row: Risk gauge + Drug profile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Risk Score Gauge */}
        <div className="card-elevated p-5 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" style={{ background: riskColor }} />
          <h4 className="text-xs font-semibold text-muted-foreground mb-2 font-display uppercase tracking-wider">
            Composite Risk Score
          </h4>
          <div className="relative w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  <Cell fill={riskColor} />
                  <Cell fill={safeColor} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold font-display" style={{ color: riskColor }}>
                {result.riskScore}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">/100</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center font-medium px-4">
            {result.riskScore >= 75 ? "⛔ Contraindicated / Major Risk" :
             result.riskScore >= 40 ? "⚠️ Moderate Clinical Concern" :
             result.riskScore >= 15 ? "ℹ️ Minor — Monitor Patient" : "✅ Minimal Risk Identified"}
          </p>
        </div>

        {/* Drug Category Profile */}
        <div className="card-elevated p-5 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg" style={{ background: 'var(--gradient-hero)' }} />
          <h4 className="text-xs font-semibold text-muted-foreground mb-2 font-display uppercase tracking-wider">
            Drug Classification
          </h4>
          <div className="w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={62}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="hsl(0, 0%, 100%)"
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 18%, 88%)",
                    borderRadius: "10px",
                    fontSize: "12px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2 justify-center max-w-full">
            {categoryData.map((cat, i) => (
              <span
                key={cat.name}
                className="inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0"
                  style={{ background: CAT_COLORS[i % CAT_COLORS.length] }}
                />
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: Radar + ADME Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Multi-dimensional Risk Radar */}
        <div className="card-elevated p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg bg-warning" />
          <h4 className="text-xs font-semibold text-muted-foreground mb-3 font-display uppercase tracking-wider text-center">
            Risk Dimension Radar
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(220, 18%, 88%)" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 9, fill: 'hsl(220, 10%, 46%)' }} />
                <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                <Radar
                  name="Risk"
                  dataKey="value"
                  stroke="hsl(190, 70%, 35%)"
                  fill="hsl(190, 70%, 35%)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ADME Comparative Bar Chart */}
        <div className="card-elevated p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg bg-success" />
          <h4 className="text-xs font-semibold text-muted-foreground mb-3 font-display uppercase tracking-wider text-center">
            ADME Profile Comparison
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barGap={2} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 92%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }} />
                <YAxis tick={{ fontSize: 9, fill: 'hsl(220, 10%, 46%)' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 18%, 88%)",
                    borderRadius: "10px",
                    fontSize: "11px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  }}
                />
                <Bar dataKey="drugA" name={drugA} fill="hsl(190, 70%, 35%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="drugB" name={drugB} fill="hsl(260, 50%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "hsl(190, 70%, 35%)" }} />
              {drugA}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "hsl(260, 50%, 55%)" }} />
              {drugB}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractionChart;
