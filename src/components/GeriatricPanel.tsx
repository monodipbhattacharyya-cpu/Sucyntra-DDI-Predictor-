import { useMemo } from "react";
import { Users, AlertTriangle, Brain, ShieldAlert, BookOpen } from "lucide-react";
import { BEERS_CRITERIA } from "@/lib/drugSubstitution";
import { calculateACB } from "@/lib/geriatric";
import { Switch } from "@/components/ui/switch";

interface Props {
  enabled: boolean;
  onToggle: (v: boolean) => void;
  drugs: string[];
}

const GeriatricPanel = ({ enabled, onToggle, drugs }: Props) => {
  const activeDrugs = drugs.filter(Boolean);
  const acb = useMemo(() => calculateACB(activeDrugs), [activeDrugs]);
  const beersHits = useMemo(
    () => activeDrugs.map(d => ({ drug: d, info: BEERS_CRITERIA[d] })).filter(x => x.info),
    [activeDrugs],
  );

  return (
    <div className="card-elevated overflow-hidden">
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl amber-gradient flex items-center justify-center text-white shadow-md">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold font-display text-foreground">Geriatric Patient (65+)</p>
            <p className="text-[11px] text-muted-foreground">Routes drugs through Beers Criteria & Anticholinergic Burden Scale</p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} aria-label="Toggle geriatric mode" />
      </div>

      {enabled && (
        <div className="border-t border-border bg-secondary/40 p-4 space-y-4 animate-fade-in-up">
          {/* ACB Score */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Anticholinergic Cognitive Burden (ACB)</h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                acb.risk === "high" ? "bg-severe/15 text-severe" :
                acb.risk === "moderate" ? "bg-warning/20 text-warning" :
                "bg-success/15 text-success"
              }`}>
                Total: {acb.total} · {acb.risk.toUpperCase()} RISK
              </span>
            </div>
            {acb.breakdown.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">No anticholinergic agents detected in current list.</p>
            ) : (
              <div className="space-y-1.5">
                {acb.breakdown.map(b => (
                  <div key={b.drug} className="flex items-center justify-between text-[11px] bg-secondary/60 rounded-md px-2.5 py-1.5">
                    <span className="font-mono font-semibold text-foreground">{b.drug}</span>
                    <span className={`font-bold ${b.score >= 3 ? "text-severe" : b.score >= 2 ? "text-warning" : "text-primary"}`}>
                      ACB {b.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 text-[10px] text-muted-foreground italic flex items-start gap-1">
              <BookOpen className="w-3 h-3 mt-0.5 flex-shrink-0" />
              Boustani M et al. <em>Aging Health</em>. 2008;4(3):311-320 · DOI 10.2217/1745509X.4.3.311. Score ≥3 is associated with increased risk of cognitive impairment.
            </p>
          </div>

          {/* Beers hits */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-severe" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Beers Criteria · Potentially Inappropriate Medications</h4>
              {beersHits.length > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-severe/15 text-severe">{beersHits.length} flagged</span>
              )}
            </div>
            {beersHits.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">No Beers-listed inappropriate medications detected.</p>
            ) : (
              <div className="space-y-2">
                {beersHits.map(({ drug, info }) => (
                  <div key={drug} className="border-l-4 border-severe/60 bg-severe/5 rounded-r-lg p-3">
                    <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                      <p className="text-xs font-bold text-severe">{drug}</p>
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-severe text-severe-foreground">
                        {info.severity === "avoid" ? "AVOID" : info.severity === "use-with-caution" ? "USE WITH CAUTION" : "CONDITIONAL"}
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground/80 mb-1">{info.reason}</p>
                    <p className="text-[10px] text-success font-semibold">✓ Alternative: {info.alternative}</p>
                    <p className="text-[9px] text-muted-foreground mt-1 italic">Tapering protocol: reduce by 25% every 1–2 weeks; reassess clinical response and withdrawal symptoms.</p>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-3 text-[10px] text-muted-foreground italic flex items-start gap-1">
              <BookOpen className="w-3 h-3 mt-0.5 flex-shrink-0" />
              American Geriatrics Society 2023 Updated AGS Beers Criteria®. <em>J Am Geriatr Soc</em>. 2023;71(7):2052-2081 · DOI 10.1111/jgs.18372.
            </p>
          </div>

          {beersHits.length > 0 && (
            <div className="flex items-start gap-2 bg-warning/10 border border-warning/30 rounded-lg p-3">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-foreground/85">
                <strong>Deprescribing recommended.</strong> Discuss with prescriber: consider safer alternatives, gradual taper, and shared decision-making (STOPP/START criteria, O'Mahony D et al., <em>Age Ageing</em>. 2015;44(2):213-218 · DOI 10.1093/ageing/afu145).
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GeriatricPanel;
