import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Pill, FlaskConical, Zap, Apple, ShieldAlert, Shield, BarChart3, Database, Activity, ArrowRight } from "lucide-react";
import DrugSelect from "@/components/DrugSelect";
import InteractionResult from "@/components/InteractionResult";
import InteractionChart from "@/components/InteractionChart";
import DrugCategoryBadges from "@/components/DrugCategoryBadges";
import LoadingAnimation from "@/components/LoadingAnimation";
import PrescriptionParser from "@/components/PrescriptionParser";
import InSilicoDisplay from "@/components/InSilicoDisplay";
import PolypharmacyAnalyzer from "@/components/PolypharmacyAnalyzer";
import SubstitutionPanel from "@/components/SubstitutionPanel";
import PDFExport from "@/components/PDFExport";
import GeriatricPanel from "@/components/GeriatricPanel";
import PharmacokineticTimeline from "@/components/PharmacokineticTimeline";
import { predictInteraction, DRUGS, type InteractionResult as Result, type PharmacogenomicProfile } from "@/lib/drugInteractions";
import { FOODS, lookupFoodInteraction, ALLERGY_CLASSES, lookupAllergyOverlap, type AllergyClass } from "@/lib/drugFoodAllergy";
import { saveHistoryRecord } from "@/lib/patientStore";

// Default PGx profile (UI removed — engine still runs deterministic adjustments)
const DEFAULT_PGX: PharmacogenomicProfile = {
  cyp2d6: "extensive", cyp2c19: "extensive", cyp2c9: "extensive",
  cyp3a4: "extensive", cyp1a2: "extensive",
};

type Mode = "drug" | "food" | "allergy";

interface SimpleResult {
  severity: "severe" | "moderate" | "mild" | "none";
  mechanism: string;
  recommendation: string;
  title: string;
}

const Index = () => {
  const [mode, setMode] = useState<Mode>("drug");
  const [drugA, setDrugA] = useState("");
  const [drugB, setDrugB] = useState("");
  const [food, setFood] = useState("");
  const [allergy, setAllergy] = useState<AllergyClass | "">("");
  const [result, setResult] = useState<Result | null>(null);
  const [auxResult, setAuxResult] = useState<SimpleResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [geriatric, setGeriatric] = useState(false);

  const reset = () => { setResult(null); setAuxResult(null); };

  const handleAnalyze = useCallback(() => {
    reset();
    if (mode === "drug") {
      if (!drugA || !drugB) return;
      setLoading(true);
      setTimeout(() => {
        const r = predictInteraction(drugA, drugB, DEFAULT_PGX);
        setResult(r);
        setLoading(false);
        saveHistoryRecord({
          mode: "drug",
          drugs: [drugA, drugB],
          severity: r.severity,
          riskScore: r.riskScore,
          title: `${drugA} ↔ ${drugB}`,
          mechanism: r.mechanism,
          recommendation: r.recommendation,
          geriatric,
        });
      }, 1200);
    } else if (mode === "food") {
      if (!drugA || !food) return;
      setLoading(true);
      setTimeout(() => {
        const r = lookupFoodInteraction(drugA, food);
        if (r) {
          const sev = r.severity === "severe" ? "severe" : r.severity === "moderate" ? "moderate" : "mild";
          setAuxResult({ severity: sev, mechanism: r.mechanism, recommendation: r.recommendation, title: `${drugA} ↔ ${food}` });
          saveHistoryRecord({ mode: "food", drugs: [drugA], context: food, severity: sev, riskScore: sev === "severe" ? 75 : sev === "moderate" ? 50 : 20, title: `${drugA} ↔ ${food}`, mechanism: r.mechanism, recommendation: r.recommendation, geriatric });
        }
        setLoading(false);
      }, 1000);
    } else {
      if (!drugA || !allergy) return;
      setLoading(true);
      setTimeout(() => {
        const r = lookupAllergyOverlap(drugA, allergy as AllergyClass);
        setAuxResult({ severity: r.severity, mechanism: r.mechanism, recommendation: r.recommendation, title: `${drugA} ↔ ${allergy} Allergy` });
        saveHistoryRecord({ mode: "allergy", drugs: [drugA], context: allergy, severity: r.severity, riskScore: r.severity === "severe" ? 80 : r.severity === "moderate" ? 50 : 15, title: `${drugA} ↔ ${allergy} Allergy`, mechanism: r.mechanism, recommendation: r.recommendation, geriatric });
        setLoading(false);
      }, 1000);
    }
  }, [mode, drugA, drugB, food, allergy, geriatric]);

  const handlePrescriptionDrugs = useCallback((a: string, b: string) => {
    setMode("drug"); setDrugA(a); setDrugB(b); reset();
    setLoading(true);
    setTimeout(() => {
      const r = predictInteraction(a, b, DEFAULT_PGX);
      setResult(r); setLoading(false);
      saveHistoryRecord({ mode: "drug", drugs: [a, b], severity: r.severity, riskScore: r.riskScore, title: `${a} ↔ ${b}`, mechanism: r.mechanism, recommendation: r.recommendation, geriatric });
    }, 1200);
  }, [geriatric]);

  const canAnalyze =
    (mode === "drug" && drugA && drugB) ||
    (mode === "food" && drugA && food) ||
    (mode === "allergy" && drugA && allergy);

  return (
    <div className="px-4 py-8">
      <Helmet>
        <title>Interaction Checker — SUCYNTRA DDI Predictor</title>
        <meta name="description" content="Check drug-drug, drug-food and drug-allergy interactions with deterministic clinical rules, ADME mapping, and pharmacokinetic overlap timeline." />
        <link rel="canonical" href="https://sucyntraddip.lovable.app/checker" />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-5">
        {/* Page heading */}
        <div className="card-elevated p-6 grain-bg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 amber-gradient" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl amber-gradient flex items-center justify-center text-white shadow-lg">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-foreground">Interaction Checker</h1>
              <p className="text-xs text-muted-foreground">
                Evidence-based · {DRUGS.length}+ drugs · ADME + PK overlap mapping
              </p>
            </div>
          </div>
        </div>

        <PrescriptionParser onDrugsFound={handlePrescriptionDrugs} />

        <GeriatricPanel
          enabled={geriatric}
          onToggle={setGeriatric}
          drugs={[drugA, drugB].filter(Boolean)}
        />

        {/* Selection Card with Mode Tabs */}
        <section className="card-elevated p-6 relative" aria-labelledby="pair-heading">
          <div className="absolute top-0 left-0 right-0 h-1 amber-gradient rounded-t-2xl" />
          <h2 id="pair-heading" className="text-xs font-semibold text-muted-foreground font-display uppercase tracking-wider mb-3 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" /> Interaction Check
          </h2>

          <div role="tablist" aria-label="Interaction mode" className="grid grid-cols-3 gap-1.5 p-1 bg-secondary/60 rounded-xl mb-5">
            {([
              { id: "drug", label: "Drug ↔ Drug", icon: <Pill className="w-3.5 h-3.5" /> },
              { id: "food", label: "Drug ↔ Food", icon: <Apple className="w-3.5 h-3.5" /> },
              { id: "allergy", label: "Drug ↔ Allergy", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
            ] as { id: Mode; label: string; icon: JSX.Element }[]).map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={mode === tab.id}
                onClick={() => { setMode(tab.id); reset(); }}
                className={`flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-semibold px-2 py-2.5 rounded-lg transition-all ${
                  mode === tab.id
                    ? "bg-card text-primary shadow-sm border border-primary/30"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-5">
            <DrugSelect
              label={mode === "drug" ? "Drug A" : "Drug"}
              value={drugA}
              onChange={setDrugA}
              icon={<Pill className="w-4 h-4 text-primary" />}
            />
            {mode === "drug" && (
              <DrugSelect label="Drug B" value={drugB} onChange={setDrugB} icon={<FlaskConical className="w-4 h-4 text-primary" />} />
            )}
            {mode === "food" && (
              <div className="flex-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Food / Beverage</label>
                <div className="relative">
                  <Apple className="w-4 h-4 text-primary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select value={food} onChange={(e) => setFood(e.target.value)} className="w-full pl-10 pr-3 py-3 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
                    <option value="">Select a food…</option>
                    {FOODS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            )}
            {mode === "allergy" && (
              <div className="flex-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Known Allergy Class</label>
                <div className="relative">
                  <ShieldAlert className="w-4 h-4 text-primary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select value={allergy} onChange={(e) => setAllergy(e.target.value as AllergyClass)} className="w-full pl-10 pr-3 py-3 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
                    <option value="">Select an allergy…</option>
                    {ALLERGY_CLASSES.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze || loading}
            className="w-full amber-gradient text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:opacity-95 hover:shadow-lg active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm glow-ring"
          >
            <Zap className="w-4 h-4" /> Analyze Interaction
          </button>
        </section>

        {loading && <LoadingAnimation />}

        {/* Aux (Food/Allergy) result */}
        {auxResult && !loading && (
          <section className="animate-fade-in-up">
            <div className={`card-elevated p-6 border-l-4 ${
              auxResult.severity === "severe" ? "border-l-severe" :
              auxResult.severity === "moderate" ? "border-l-warning" :
              "border-l-primary"
            }`}>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="font-display text-lg font-bold text-foreground">{auxResult.title}</h3>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                  auxResult.severity === "severe" ? "badge-severe" :
                  auxResult.severity === "moderate" ? "badge-moderate" : "badge-mild"
                }`}>
                  {auxResult.severity === "severe" ? "Actionable Clinical Risk" :
                   auxResult.severity === "moderate" ? "Moderate — Caution" : "Minor / Theoretical"}
                </span>
              </div>
              <div className="mb-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Mechanism</p>
                <p className="text-sm text-foreground/85 leading-relaxed">{auxResult.mechanism}</p>
              </div>
              <div className="bg-secondary/60 rounded-xl p-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Clinical Recommendation</p>
                <p className="text-sm text-foreground/85 leading-relaxed">{auxResult.recommendation}</p>
              </div>
            </div>
          </section>
        )}

        {/* Drug-Drug result */}
        {result && !loading && (
          <section className="space-y-5" aria-labelledby="result-heading">
            <h2 id="result-heading" className="sr-only">Interaction Analysis Result</h2>
            <SubstitutionPanel result={result} drugA={drugA} drugB={drugB} />
            <div className="flex justify-end">
              <PDFExport result={result} drugA={drugA} drugB={drugB} />
            </div>
            <div className="card-elevated p-4 flex flex-col sm:flex-row gap-4">
              <DrugCategoryBadges drugName={drugA} categories={result.categories.drugA} />
              <div className="hidden sm:block w-px bg-border" />
              <DrugCategoryBadges drugName={drugB} categories={result.categories.drugB} />
            </div>
            <InteractionChart result={result} drugA={drugA} drugB={drugB} />
            {result.inSilico && (
              <InSilicoDisplay analysis={result.inSilico} drugA={drugA} drugB={drugB} />
            )}
            <InteractionResult result={result} drugA={drugA} drugB={drugB} />
            <PharmacokineticTimeline drugA={drugA} drugB={drugB} severity={result.severity} />
          </section>
        )}

        <section aria-labelledby="polypharmacy-heading">
          <h2 id="polypharmacy-heading" className="sr-only">Polypharmacy Analyzer</h2>
          <PolypharmacyAnalyzer pgxProfile={DEFAULT_PGX} />
        </section>
      </div>
    </div>
  );
};

export default Index;
