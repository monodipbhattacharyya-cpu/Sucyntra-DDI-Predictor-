// Anticholinergic Cognitive Burden (ACB) Scale — Boustani et al., 2008.
// Reference: Boustani M, Campbell N, Munger S, Maidment I, Fox C.
// "Impact of anticholinergics on the aging brain." Aging Health. 2008;4(3):311-320.
// DOI: 10.2217/1745509X.4.3.311

export const ACB_SCORES: Record<string, 1 | 2 | 3> = {
  // Definite (score 2-3)
  "Amitriptyline": 3, "Nortriptyline": 2, "Imipramine": 3, "Desipramine": 2, "Clomipramine": 3,
  "Diphenhydramine": 3, "Chlorpheniramine": 3, "Hydroxyzine": 3, "Promethazine": 3,
  "Oxybutynin": 3, "Tolterodine": 3, "Solifenacin": 3, "Darifenacin": 3, "Fesoterodine": 3,
  "Paroxetine": 3, "Cyclobenzaprine": 2, "Olanzapine": 2, "Scopolamine": 3,
  "Atropine": 3, "Clozapine": 3, "Chlorpromazine": 3,
  // Possible (score 1)
  "Cetirizine": 1, "Loratadine": 1, "Quetiapine": 1, "Risperidone": 1, "Trazodone": 1,
  "Ranitidine": 1, "Cimetidine": 1, "Famotidine": 1, "Furosemide": 1, "Digoxin": 1,
  "Warfarin": 1, "Codeine": 1, "Metoprolol": 1, "Theophylline": 1, "Prednisolone": 1,
  "Prednisone": 1, "Loperamide": 1, "Haloperidol": 1, "Carbamazepine": 1, "Mirtazapine": 1,
};

export function calculateACB(drugs: string[]): { total: number; breakdown: Array<{ drug: string; score: number }>; risk: "low" | "moderate" | "high" } {
  const breakdown = drugs
    .map(d => ({ drug: d, score: ACB_SCORES[d] ?? 0 }))
    .filter(x => x.score > 0);
  const total = breakdown.reduce((a, b) => a + b.score, 0);
  const risk = total >= 3 ? "high" : total >= 1 ? "moderate" : "low";
  return { total, breakdown, risk };
}
