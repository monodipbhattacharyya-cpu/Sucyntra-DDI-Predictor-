import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import {
  ShieldAlert, AlertTriangle, Activity, Brain, Pill, Search,
  TrendingUp, Eye, HeartPulse, Clock, Syringe, Flag, Info
} from "lucide-react";
import {
  SAFETY_PROFILES as CURATED,
  type AbusePotential, type ToleranceSpeed,
} from "@/lib/drugSafetyProfile";
import { buildExpandedSafetyProfiles } from "@/lib/drugSafetyProfileExpanded";

const SAFETY_PROFILES = buildExpandedSafetyProfiles(CURATED);
const SAFETY_DRUGS = Object.keys(SAFETY_PROFILES).sort();

const potentialColor: Record<AbusePotential, string> = {
  "very-high": "bg-severe/15 text-severe border-severe/30",
  high: "bg-warning/15 text-warning border-warning/30",
  moderate: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  low: "bg-primary/10 text-primary border-primary/20",
  minimal: "bg-muted text-muted-foreground border-border",
};

const toleranceLabel: Record<ToleranceSpeed, string> = {
  rapid: "Rapid (days)", moderate: "Moderate (weeks)", slow: "Slow (months)", none: "Minimal",
};

const Safety = () => {
  const [selected, setSelected] = useState<string>("Morphine");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return SAFETY_DRUGS;
    const t = q.toLowerCase();
    return SAFETY_DRUGS.filter(d =>
      d.toLowerCase().includes(t) ||
      SAFETY_PROFILES[d].drugClass.toLowerCase().includes(t)
    );
  }, [q]);

  const p = SAFETY_PROFILES[selected];

  return (
    <div className="px-4 py-8">
      <Helmet>
        <title>Tolerance & Abuse Profile — SUCYNTRA DDI Predictor</title>
        <meta name="description" content="Determine drug tolerance, identify abuse and dependence symptoms, with withdrawal and overdose toxidromes from deterministic clinical rules." />
        <link rel="canonical" href="https://sucyntraddip.lovable.app/safety" />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="card-elevated p-6 grain-bg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 amber-gradient" />
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl amber-gradient flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-foreground">Tolerance, Dependence & Abuse Profiler</h1>
              <p className="text-xs text-muted-foreground mt-1">
                Deterministic toxidrome lookup · DSM-5-TR + DEA + NIDA + Stockley's references · {SAFETY_DRUGS.length} high-risk agents mapped
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar: drug list */}
          <aside className="card-elevated p-4 h-fit lg:sticky lg:top-20">
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search agent or class…"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-secondary/40 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
              {filtered.map(d => {
                const sp = SAFETY_PROFILES[d];
                const active = selected === d;
                return (
                  <button
                    key={d}
                    onClick={() => setSelected(d)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg border transition-all ${
                      active ? "bg-primary/10 border-primary/30 shadow-sm" : "border-transparent hover:bg-accent/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-semibold truncate ${active ? "text-primary" : "text-foreground"}`}>{d}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${potentialColor[sp.abusePotential]}`}>
                        {sp.abusePotential === "very-high" ? "V-HIGH" : sp.abusePotential.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{sp.drugClass}</p>
                  </button>
                );
              })}
              {filtered.length === 0 && <p className="text-xs text-muted-foreground px-2 py-3">No matches.</p>}
            </div>
          </aside>

          {/* Main panel */}
          {p && (
            <main className="space-y-4">
              {/* Title + meta */}
              <div className="card-elevated p-5 border-l-4 border-l-primary">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h2 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
                      <Pill className="w-5 h-5 text-primary" /> {p.drug}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.drugClass}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Chip label={`Schedule ${p.schedule}`} tone="primary" icon={<Flag className="w-3 h-3" />} />
                    <Chip label={`Abuse: ${p.abusePotential.toUpperCase()}`} tone={p.abusePotential === "very-high" || p.abusePotential === "high" ? "severe" : "warning"} icon={<AlertTriangle className="w-3 h-3" />} />
                    <Chip label={`Tolerance: ${toleranceLabel[p.toleranceSpeed]}`} tone="amber" icon={<TrendingUp className="w-3 h-3" />} />
                  </div>
                </div>
              </div>

              {/* Tolerance mechanism */}
              <Section icon={<TrendingUp className="w-4 h-4" />} title="Tolerance Determination" tone="amber">
                <p className="text-sm text-foreground/85 leading-relaxed mb-3">{p.toleranceMechanism}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <Mini label="Physical Dependence" value={p.dependence.physical ? "Yes" : "No"} alert={p.dependence.physical} />
                  <Mini label="Psychological Dependence" value={p.dependence.psychological ? "Yes" : "No"} alert={p.dependence.psychological} />
                  <Mini label="Tolerance Speed" value={toleranceLabel[p.toleranceSpeed]} />
                </div>
                {p.dependence.crossTolerance.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/70">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Cross-Tolerance With</p>
                    <div className="flex flex-wrap gap-1">
                      {p.dependence.crossTolerance.map(c => (
                        <span key={c} className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent border border-primary/15">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Section>

              {/* Abuse identification */}
              <Section icon={<Eye className="w-4 h-4" />} title="Identifying Abuse — Clinical Signs" tone="warning">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {p.abuseSymptoms.map(s => (
                    <li key={s} className="flex items-start gap-2 text-sm text-foreground/85">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />{s}
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Red flags */}
              <Section icon={<Flag className="w-4 h-4" />} title="Behavioral Red Flags of Misuse" tone="severe">
                <ul className="space-y-1.5">
                  {p.redFlags.map(s => (
                    <li key={s} className="flex items-start gap-2 text-sm text-foreground/85">
                      <Flag className="w-3 h-3 text-severe mt-1 flex-shrink-0" />{s}
                    </li>
                  ))}
                </ul>
              </Section>

              {/* Overdose */}
              <Section icon={<HeartPulse className="w-4 h-4" />} title="Acute Overdose Toxidrome" tone="severe">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {p.overdoseSymptoms.map(s => (
                    <div key={s} className="flex items-start gap-2 p-2 rounded-lg bg-severe/5 border border-severe/15 text-sm text-foreground/85">
                      <AlertTriangle className="w-3.5 h-3.5 text-severe mt-0.5 flex-shrink-0" />{s}
                    </div>
                  ))}
                </div>
                {p.reversalAgent && (
                  <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/25 flex items-start gap-2">
                    <Syringe className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">Reversal / Antidote</p>
                      <p className="text-sm text-foreground/85">{p.reversalAgent}</p>
                    </div>
                  </div>
                )}
              </Section>

              {/* Withdrawal */}
              <Section icon={<Brain className="w-4 h-4" />} title="Discontinuation / Withdrawal Syndrome" tone="amber">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-2">
                  <Clock className="w-3 h-3" /> <span className="font-semibold">{p.withdrawalOnset}</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {p.withdrawalSymptoms.map(s => (
                    <li key={s} className="flex items-start gap-2 text-sm text-foreground/85">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />{s}
                    </li>
                  ))}
                </ul>
              </Section>

              <div className="card-elevated p-3 flex items-start gap-2 bg-secondary/40">
                <Info className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Educational reference only. Use validated screening tools (CAGE, AUDIT, DAST-10, CIWA-Ar, COWS) and confirm with clinical assessment. Never stop sedative/opioid agents abruptly in dependent patients — taper required.
                </p>
              </div>
            </main>
          )}
        </div>
      </div>
    </div>
  );
};

const Chip = ({ label, tone, icon }: { label: string; tone: "primary" | "severe" | "warning" | "amber"; icon: JSX.Element }) => {
  const cls = tone === "severe" ? "bg-severe/15 text-severe border-severe/30"
    : tone === "warning" ? "bg-warning/15 text-warning border-warning/30"
    : tone === "amber" ? "bg-amber-500/15 text-amber-700 border-amber-500/30"
    : "bg-primary/10 text-primary border-primary/25";
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${cls}`}>
      {icon}{label}
    </span>
  );
};

const Section = ({ icon, title, tone, children }: { icon: JSX.Element; title: string; tone: "primary" | "severe" | "warning" | "amber"; children: React.ReactNode }) => {
  const bar = tone === "severe" ? "border-l-severe" : tone === "warning" ? "border-l-warning" : tone === "amber" ? "border-l-amber-500" : "border-l-primary";
  return (
    <section className={`card-elevated p-5 border-l-4 ${bar}`}>
      <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
        {icon}{title}
      </h3>
      {children}
    </section>
  );
};

const Mini = ({ label, value, alert }: { label: string; value: string; alert?: boolean }) => (
  <div className={`rounded-lg p-2 border ${alert ? "bg-severe/5 border-severe/20" : "bg-accent/40 border-primary/15"}`}>
    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className={`text-sm font-bold font-display ${alert ? "text-severe" : "text-foreground"}`}>{value}</p>
  </div>
);

export default Safety;
