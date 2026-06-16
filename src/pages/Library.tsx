import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Search, BookMarked, Pill as PillIcon, Tag, Factory } from "lucide-react";
import { DRUG_FORMULATIONS, FORMULATION_COUNT, GENERIC_COUNT } from "@/lib/drugFormulations";
import { ACB_SCORES } from "@/lib/geriatric";
import { BEERS_CRITERIA } from "@/lib/drugSubstitution";

const ALL = Object.entries(DRUG_FORMULATIONS).sort(([a], [b]) => a.localeCompare(b));

const Library = () => {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return ALL;
    const t = q.toLowerCase();
    return ALL.filter(([generic, f]) =>
      generic.toLowerCase().includes(t) ||
      f.use.toLowerCase().includes(t) ||
      f.brands.some(b => b.toLowerCase().includes(t))
    );
  }, [q]);

  return (
    <div className="px-4 py-8">
      <Helmet>
        <title>Drug Library — SUCYNTRA DDI Predictor</title>
        <meta name="description" content={`Browse ${GENERIC_COUNT} generic drugs across ${FORMULATION_COUNT} commercial formulations with their clinical uses.`} />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="card-elevated p-6 grain-bg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 amber-gradient" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl amber-gradient flex items-center justify-center text-white shadow-lg">
              <BookMarked className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-foreground">Commercial Drug Library</h1>
              <p className="text-xs text-muted-foreground">
                {GENERIC_COUNT} generic molecules · {FORMULATION_COUNT}+ commercialized brand formulations · uses & interaction-ready
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <Stat label="Generics" value={GENERIC_COUNT} />
            <Stat label="Brand Formulations" value={FORMULATION_COUNT} />
            <Stat label="Interaction-Mapped" value="100%" />
          </div>

          <div className="relative mt-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search by generic, brand, or use… (e.g. Lipitor, hypertension, Augmentin)"
              className="w-full pl-10 pr-3 py-3 rounded-xl border border-border bg-secondary/40 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Showing {filtered.length} of {GENERIC_COUNT} generics. Use any brand or generic in the Interaction Checker — both are mapped to the same underlying interaction rules.
          </p>
        </div>

        {/* Results Grid - Enhanced Layout */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Showing <span className="text-primary font-bold">{Math.min(filtered.length, 250)}</span> of <span className="text-primary font-bold">{GENERIC_COUNT}</span> drugs
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.slice(0, 250).map(([generic, f]) => {
                const acb = ACB_SCORES[generic];
                const beers = BEERS_CRITERIA[generic];
                return (
                  <article key={generic} className="card-elevated p-5 hover:shadow-lg transition-all hover:-translate-y-1 group">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg amber-gradient flex items-center justify-center text-white flex-shrink-0 group-hover:shadow-md transition-shadow">
                          <PillIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-sm font-bold font-display text-foreground truncate group-hover:text-primary transition-colors">{generic}</h2>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {acb && <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-severe/10 text-severe">ACB: {acb}</span>}
                        {beers && <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-warning/10 text-warning">Beers</span>}
                      </div>
                    </div>
                    
                    <p className="text-xs text-foreground/70 leading-relaxed mb-3">{f.use}</p>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Brands</p>
                        <div className="flex flex-wrap gap-1">
                          {f.brands.slice(0, 3).map(b => (
                            <span key={b} className="text-[9px] px-2 py-1 bg-secondary/60 text-foreground/75 rounded-md">{b}</span>
                          ))}
                          {f.brands.length > 3 && <span className="text-[9px] px-2 py-1 bg-secondary/60 text-foreground/75 rounded-md">+{f.brands.length - 3}</span>}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            {filtered.length > 250 && (
              <p className="text-center text-xs text-muted-foreground">
                Showing first 250 of {filtered.length} matches — refine your search to see more.
              </p>
            )}
          </div>
        ) : (
          <div className="card-elevated p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">No drugs found matching "{q}"</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: number | string }) => (
  <div className="rounded-lg bg-accent/40 border border-primary/15 p-2 text-center">
    <p className="text-lg font-bold font-display text-gradient-amber">{value}</p>
    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
  </div>
);

export default Library;
