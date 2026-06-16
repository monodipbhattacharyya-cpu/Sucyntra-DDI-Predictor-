import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceArea, Legend } from "recharts";
import { Activity, Clock, TrendingUp } from "lucide-react";

interface Props {
  drugA: string;
  drugB: string;
  severity: "severe" | "moderate" | "mild" | "none";
}

// Approximate elimination half-lives (hours) for common drugs.
// Source: Goodman & Gilman's, 14th ed., Appendix II — Pharmacokinetic Data.
const HALF_LIFE: Record<string, number> = {
  Warfarin: 40, Clopidogrel: 6, Aspirin: 3, Ibuprofen: 2, Naproxen: 14,
  Diclofenac: 2, Paracetamol: 3, Omeprazole: 1, Pantoprazole: 1, Esomeprazole: 1.5,
  Rabeprazole: 1, Atorvastatin: 14, Simvastatin: 2, Rosuvastatin: 19, Pravastatin: 2,
  Metformin: 6, Sertraline: 26, Fluoxetine: 96, Citalopram: 35, Escitalopram: 30,
  Paroxetine: 21, Tramadol: 6, Morphine: 3, Codeine: 3, Fentanyl: 4,
  Amlodipine: 40, Diltiazem: 5, Verapamil: 5, Metoprolol: 4, Atenolol: 7,
  Lisinopril: 12, Losartan: 2, Digoxin: 36, Furosemide: 2,
  Amiodarone: 600, Clarithromycin: 5, Erythromycin: 2, Azithromycin: 68,
  Fluconazole: 30, Ketoconazole: 8, Levothyroxine: 168, Lithium: 24,
  Phenytoin: 22, Carbamazepine: 15, Rifampicin: 3, Diazepam: 43, Alprazolam: 11,
  Lorazepam: 12, Midazolam: 2, Theophylline: 8, Cyclosporine: 8, Tacrolimus: 12,
};

function generateCurve(drug: string): number[] {
  const t12 = HALF_LIFE[drug] ?? 8;
  const Cmax = 100;
  const tmax = Math.max(0.5, Math.min(3, t12 * 0.15));
  const ke = Math.log(2) / t12;
  const ka = ke * 3;
  const points: number[] = [];
  for (let t = 0; t <= 24; t += 0.5) {
    // Bateman one-compartment model (oral absorption)
    const c = (Cmax * ka / (ka - ke)) * (Math.exp(-ke * t) - Math.exp(-ka * t));
    points.push(Math.max(0, c));
  }
  // Normalize so each drug peaks at ~100
  const peak = Math.max(...points);
  return points.map(p => peak > 0 ? (p / peak) * 100 : 0);
}

const PharmacokineticTimeline = ({ drugA, drugB, severity }: Props) => {
  const curveA = generateCurve(drugA);
  const curveB = generateCurve(drugB);

  const data = curveA.map((a, i) => ({
    hour: i * 0.5,
    [drugA]: Number(a.toFixed(1)),
    [drugB]: Number(curveB[i].toFixed(1)),
    overlap: Number(Math.min(a, curveB[i]).toFixed(1)),
  }));

  // Find peak overlap window (top 25% of overlap values)
  const overlapValues = data.map(d => d.overlap);
  const maxOverlap = Math.max(...overlapValues);
  const threshold = maxOverlap * 0.75;
  let riskStart = -1, riskEnd = -1;
  data.forEach((d, i) => {
    if (d.overlap >= threshold) {
      if (riskStart === -1) riskStart = d.hour;
      riskEnd = d.hour;
    }
  });

  const t12A = HALF_LIFE[drugA] ?? 8;
  const t12B = HALF_LIFE[drugB] ?? 8;

  return (
    <div className="card-elevated p-5 animate-fade-in-up">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg amber-gradient flex items-center justify-center text-white">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-foreground">Pharmacokinetic Overlap Timeline</h3>
            <p className="text-[10px] text-muted-foreground">Simulated 24h plasma concentration curves · Bateman one-compartment model</p>
          </div>
        </div>
        {riskStart >= 0 && severity !== "none" && (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-severe/15 text-severe inline-flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Peak risk: {riskStart}h – {riskEnd}h
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3 text-[10px]">
        <div className="bg-secondary/60 rounded-md px-2 py-1.5 flex items-center justify-between">
          <span className="font-mono font-semibold text-primary">{drugA}</span>
          <span className="text-muted-foreground">t½ ≈ {t12A}h</span>
        </div>
        <div className="bg-secondary/60 rounded-md px-2 py-1.5 flex items-center justify-between">
          <span className="font-mono font-semibold" style={{ color: "hsl(38 95% 45%)" }}>{drugB}</span>
          <span className="text-muted-foreground">t½ ≈ {t12B}h</span>
        </div>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Hours after dose", position: "insideBottom", offset: -2, style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" } }} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} label={{ value: "% Cmax", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" } }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {riskStart >= 0 && severity !== "none" && (
              <ReferenceArea x1={riskStart} x2={riskEnd} fill="hsl(var(--severe))" fillOpacity={0.12} stroke="hsl(var(--severe))" strokeOpacity={0.3} strokeDasharray="4 4" />
            )}
            <Line type="monotone" dataKey={drugA} stroke="hsl(22 92% 52%)" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey={drugB} stroke="hsl(38 95% 45%)" strokeWidth={2.5} dot={false} strokeDasharray="5 3" />
            <Line type="monotone" dataKey="overlap" stroke="hsl(var(--severe))" strokeWidth={1} dot={false} strokeOpacity={0.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[10px] text-muted-foreground mt-2 italic">
        Half-life values adapted from Goodman &amp; Gilman's, 14th ed., Appendix II. Curves are illustrative and do not replace therapeutic drug monitoring.
      </p>
    </div>
  );
};

export default PharmacokineticTimeline;
