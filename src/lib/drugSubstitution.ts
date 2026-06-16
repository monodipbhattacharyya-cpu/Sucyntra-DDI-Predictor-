// Auto-Substitution & Alternative Therapy Engine
// When a Major/Contraindicated interaction is detected, suggests safer alternatives
// from the same therapeutic class with different metabolic pathways

import { DRUGS, type InteractionResult } from "./drugInteractions";

interface SubstitutionSuggestion {
  originalDrug: string;
  suggestedDrug: string;
  reason: string;
  therapeuticClass: string;
  metabolicAdvantage: string;
  confidenceLevel: "high" | "medium" | "low";
}

// Therapeutic class groupings with metabolic pathway info
const THERAPEUTIC_ALTERNATIVES: Record<string, { drugs: string[]; pathwayInfo: Record<string, string> }> = {
  "Proton Pump Inhibitor": {
    drugs: ["Omeprazole", "Pantoprazole", "Esomeprazole", "Lansoprazole", "Rabeprazole"],
    pathwayInfo: {
      "Omeprazole": "Strong CYP2C19 substrate & inhibitor",
      "Esomeprazole": "Strong CYP2C19 substrate & inhibitor",
      "Lansoprazole": "Moderate CYP2C19 substrate",
      "Pantoprazole": "Minimal CYP2C19 inhibition — safest with Clopidogrel",
      "Rabeprazole": "Non-enzymatic metabolism — no CYP2C19 interaction",
    },
  },
  "HMG-CoA Reductase Inhibitor (Statin)": {
    drugs: ["Atorvastatin", "Simvastatin", "Rosuvastatin", "Pravastatin", "Fluvastatin", "Pitavastatin"],
    pathwayInfo: {
      "Atorvastatin": "CYP3A4 substrate — high interaction risk",
      "Simvastatin": "CYP3A4 substrate — highest rhabdomyolysis risk",
      "Lovastatin": "CYP3A4 substrate — high interaction risk",
      "Rosuvastatin": "Minimal CYP metabolism — safest with CYP3A4 inhibitors",
      "Pravastatin": "Not CYP metabolized — safest alternative",
      "Fluvastatin": "CYP2C9 substrate — avoids CYP3A4 pathway",
      "Pitavastatin": "Minimal CYP involvement — excellent safety profile",
    },
  },
  "SSRI (Antidepressant)": {
    drugs: ["Sertraline", "Fluoxetine", "Citalopram", "Escitalopram", "Paroxetine"],
    pathwayInfo: {
      "Fluoxetine": "Potent CYP2D6 inhibitor — avoid with CYP2D6 substrates",
      "Paroxetine": "Strong CYP2D6 inhibitor — high interaction profile",
      "Sertraline": "Mild CYP2D6 inhibition — safer alternative",
      "Citalopram": "Minimal CYP inhibition — but QT prolongation risk",
      "Escitalopram": "Minimal CYP inhibition — preferred for low interaction risk",
    },
  },
  "Beta-Adrenergic Blocker": {
    drugs: ["Metoprolol", "Atenolol", "Bisoprolol", "Propranolol", "Carvedilol", "Nebivolol"],
    pathwayInfo: {
      "Metoprolol": "CYP2D6 substrate — dose adjustment needed in poor metabolizers",
      "Propranolol": "CYP2D6 & CYP1A2 substrate — multiple interactions",
      "Atenolol": "Renally cleared — no CYP interactions",
      "Bisoprolol": "50% renal, 50% hepatic — balanced clearance",
      "Nebivolol": "CYP2D6 substrate — but with vasodilatory benefit",
      "Carvedilol": "CYP2D6 substrate — alpha+beta blocking",
    },
  },
  "Calcium Channel Blocker": {
    drugs: ["Amlodipine", "Nifedipine", "Diltiazem", "Verapamil", "Felodipine"],
    pathwayInfo: {
      "Diltiazem": "CYP3A4 inhibitor — avoid with CYP3A4 substrates, causes bradycardia",
      "Verapamil": "CYP3A4 inhibitor — avoid with beta-blockers, causes bradycardia",
      "Amlodipine": "DHP CCB — no significant CYP inhibition, no bradycardia",
      "Nifedipine": "DHP CCB — minimal interaction risk",
      "Felodipine": "DHP CCB — CYP3A4 substrate but not inhibitor",
    },
  },
  "Anticoagulant": {
    drugs: ["Warfarin", "Rivaroxaban", "Apixaban", "Dabigatran"],
    pathwayInfo: {
      "Warfarin": "CYP2C9 substrate — many interactions, requires INR monitoring",
      "Rivaroxaban": "CYP3A4 & P-gp substrate — moderate interaction risk",
      "Apixaban": "CYP3A4 & P-gp substrate — fewer interactions than Rivaroxaban",
      "Dabigatran": "P-gp substrate only — no CYP metabolism, fewest drug interactions",
    },
  },
  "Benzodiazepine (Anxiolytic)": {
    drugs: ["Diazepam", "Alprazolam", "Lorazepam", "Clonazepam", "Midazolam", "Oxazepam"],
    pathwayInfo: {
      "Diazepam": "CYP3A4 & CYP2C19 substrate — multiple interactions",
      "Alprazolam": "CYP3A4 substrate — significant interaction risk",
      "Midazolam": "CYP3A4 substrate — highly sensitive to inhibitors",
      "Lorazepam": "Glucuronidation only — NO CYP metabolism, safest choice",
      "Oxazepam": "Glucuronidation only — NO CYP metabolism, safest choice",
      "Clonazepam": "CYP3A4 substrate — but lower sensitivity",
    },
  },
  "Opioid Analgesic": {
    drugs: ["Tramadol", "Codeine", "Morphine", "Oxycodone", "Fentanyl", "Buprenorphine"],
    pathwayInfo: {
      "Codeine": "CYP2D6 prodrug — ineffective in poor metabolizers, toxic in ultra-rapid",
      "Tramadol": "CYP2D6 substrate — serotonergic, seizure risk",
      "Oxycodone": "CYP3A4 & CYP2D6 substrate — dual pathway risk",
      "Fentanyl": "CYP3A4 substrate — dangerous with CYP3A4 inhibitors",
      "Morphine": "Glucuronidation — minimal CYP interactions, preferred for renal dosing",
      "Buprenorphine": "CYP3A4 substrate — partial agonist, ceiling effect on respiratory depression",
    },
  },
  "NSAID": {
    drugs: ["Ibuprofen", "Naproxen", "Diclofenac", "Celecoxib", "Meloxicam"],
    pathwayInfo: {
      "Ibuprofen": "CYP2C9 substrate — standard COX inhibitor",
      "Naproxen": "CYP2C9 substrate — long half-life",
      "Diclofenac": "CYP2C9 substrate — higher CV risk",
      "Celecoxib": "COX-2 selective — lower GI risk but CYP2C9 substrate",
      "Meloxicam": "COX-2 preferential — lower GI risk, CYP2C9 substrate",
    },
  },
  "Antipsychotic": {
    drugs: ["Haloperidol", "Risperidone", "Olanzapine", "Quetiapine", "Aripiprazole"],
    pathwayInfo: {
      "Haloperidol": "CYP2D6 & CYP3A4 — QT prolongation risk",
      "Risperidone": "CYP2D6 substrate — dose adjustment in poor metabolizers",
      "Olanzapine": "CYP1A2 substrate — affected by smoking",
      "Quetiapine": "CYP3A4 substrate — sedating, metabolic effects",
      "Aripiprazole": "CYP2D6 & CYP3A4 — partial agonist, lower metabolic risk",
    },
  },
};

// Known problematic pathways to avoid
const PATHWAY_CONFLICTS: Record<string, string[]> = {
  "CYP3A4": ["Atorvastatin", "Simvastatin", "Lovastatin", "Midazolam", "Alprazolam", "Fentanyl", "Oxycodone", "Diltiazem", "Verapamil"],
  "CYP2D6": ["Codeine", "Tramadol", "Metoprolol", "Fluoxetine", "Paroxetine"],
  "CYP2C19": ["Omeprazole", "Esomeprazole", "Clopidogrel", "Diazepam"],
  "CYP2C9": ["Warfarin", "Phenytoin", "Glimepiride"],
};

function getTherapeuticClass(drug: string): string | null {
  for (const [cls, info] of Object.entries(THERAPEUTIC_ALTERNATIVES)) {
    if (info.drugs.includes(drug)) return cls;
  }
  return null;
}

export function findSubstitutions(
  result: InteractionResult,
  drugA: string,
  drugB: string
): SubstitutionSuggestion[] {
  if (result.severity !== "severe" && result.severity !== "moderate") return [];

  const suggestions: SubstitutionSuggestion[] = [];

  // Try substituting each drug
  for (const targetDrug of [drugA, drugB]) {
    const otherDrug = targetDrug === drugA ? drugB : drugA;
    const cls = getTherapeuticClass(targetDrug);
    if (!cls) continue;

    const classInfo = THERAPEUTIC_ALTERNATIVES[cls];
    if (!classInfo) continue;

    // Find alternatives that don't conflict
    for (const alt of classInfo.drugs) {
      if (alt === targetDrug) continue;

      const pathInfo = classInfo.pathwayInfo[alt];
      if (!pathInfo) continue;

      // Check if the alternative has a metabolic advantage
      const mechanism = result.mechanism.toLowerCase();
      let isGoodAlternative = false;
      let advantage = "";

      // CYP3A4 conflict → suggest non-CYP3A4 metabolized
      if (mechanism.includes("cyp3a4") && !PATHWAY_CONFLICTS["CYP3A4"]?.includes(alt)) {
        isGoodAlternative = true;
        advantage = "Does not use CYP3A4 pathway";
      }
      // CYP2C19 conflict (e.g., Clopidogrel + Omeprazole)
      if (mechanism.includes("cyp2c19") && !PATHWAY_CONFLICTS["CYP2C19"]?.includes(alt)) {
        isGoodAlternative = true;
        advantage = "Minimal CYP2C19 inhibition";
      }
      // CYP2D6 conflict
      if (mechanism.includes("cyp2d6") && !PATHWAY_CONFLICTS["CYP2D6"]?.includes(alt)) {
        isGoodAlternative = true;
        advantage = "Does not significantly inhibit CYP2D6";
      }
      // QT prolongation
      if (mechanism.includes("qt") && !pathInfo.toLowerCase().includes("qt")) {
        isGoodAlternative = true;
        advantage = "Lower QT prolongation risk";
      }
      // Bleeding risk
      if (mechanism.includes("bleeding") && pathInfo.toLowerCase().includes("fewer")) {
        isGoodAlternative = true;
        advantage = "Lower bleeding interaction risk";
      }
      // Bradycardia
      if (mechanism.includes("bradycardia") && !pathInfo.toLowerCase().includes("bradycardia")) {
        isGoodAlternative = true;
        advantage = "No bradycardia risk";
      }
      // General: if the mechanism mentions any CYP and the alternative avoids it
      if (!isGoodAlternative && (pathInfo.toLowerCase().includes("no cyp") || pathInfo.toLowerCase().includes("minimal") || pathInfo.toLowerCase().includes("safest"))) {
        isGoodAlternative = true;
        advantage = "Minimal metabolic interaction potential";
      }

      if (isGoodAlternative) {
        suggestions.push({
          originalDrug: targetDrug,
          suggestedDrug: alt,
          reason: `${targetDrug} interacts with ${otherDrug}. ${alt} is in the same class (${cls}) but ${advantage.toLowerCase()}.`,
          therapeuticClass: cls,
          metabolicAdvantage: pathInfo,
          confidenceLevel: advantage.includes("safest") || advantage.includes("Does not use") ? "high" : "medium",
        });
      }
    }
  }

  // Deduplicate and sort by confidence
  const seen = new Set<string>();
  return suggestions
    .filter(s => {
      const key = `${s.originalDrug}-${s.suggestedDrug}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.confidenceLevel] - order[b.confidenceLevel];
    })
    .slice(0, 6);
}

// Beers Criteria - drugs inappropriate for elderly (≥65)
export const BEERS_CRITERIA: Record<string, { reason: string; alternative: string; severity: "avoid" | "use-with-caution" | "conditional" }> = {
  "Diphenhydramine": { reason: "Highly anticholinergic — cognitive impairment, delirium, falls risk", alternative: "Cetirizine or Loratadine (non-anticholinergic)", severity: "avoid" },
  "Chlorpheniramine": { reason: "First-generation antihistamine — sedation, confusion in elderly", alternative: "Fexofenadine or Loratadine", severity: "avoid" },
  "Hydroxyzine": { reason: "Anticholinergic — confusion, urinary retention, constipation", alternative: "Buspirone for anxiety, Cetirizine for allergy", severity: "avoid" },
  "Promethazine": { reason: "Highly anticholinergic, risk of EPS in elderly", alternative: "Ondansetron for nausea", severity: "avoid" },
  "Diazepam": { reason: "Long-acting benzodiazepine — prolonged sedation, falls, fractures", alternative: "Lorazepam (shorter acting) or non-benzo (Buspirone)", severity: "avoid" },
  "Chlordiazepoxide": { reason: "Long-acting benzodiazepine — accumulation in elderly", alternative: "Lorazepam or Oxazepam (glucuronidation, no accumulation)", severity: "avoid" },
  "Alprazolam": { reason: "Benzodiazepine — falls risk, cognitive decline in elderly", alternative: "SSRI or Buspirone for anxiety", severity: "avoid" },
  "Amitriptyline": { reason: "Highly anticholinergic TCA — cardiac conduction, delirium, falls", alternative: "Sertraline or Escitalopram (SSRI)", severity: "avoid" },
  "Imipramine": { reason: "Anticholinergic TCA — orthostatic hypotension, cardiac risk", alternative: "Sertraline or Duloxetine", severity: "avoid" },
  "Clomipramine": { reason: "Anticholinergic TCA — seizure risk, cardiac effects", alternative: "Escitalopram or Venlafaxine", severity: "avoid" },
  "Nortriptyline": { reason: "TCA with anticholinergic effects (less than Amitriptyline)", alternative: "Duloxetine for neuropathic pain", severity: "use-with-caution" },
  "Glimepiride": { reason: "Long-acting sulfonylurea — risk of prolonged hypoglycemia", alternative: "Metformin or Linagliptin (renal-safe DPP-4i)", severity: "avoid" },
  "Glyburide": { reason: "Highest hypoglycemia risk among sulfonylureas in elderly", alternative: "Metformin or Empagliflozin", severity: "avoid" },
  "Indomethacin": { reason: "Highest GI and CNS adverse effects among NSAIDs", alternative: "Topical Diclofenac or Paracetamol", severity: "avoid" },
  "Ketorolac": { reason: "High GI bleeding risk, especially with anticoagulants in elderly", alternative: "Paracetamol or Celecoxib (lower GI risk)", severity: "avoid" },
  "Piroxicam": { reason: "Long half-life NSAID — GI bleeding, renal toxicity in elderly", alternative: "Ibuprofen (short course) or Paracetamol", severity: "avoid" },
  "Metoclopramide": { reason: "EPS risk (tardive dyskinesia) — elderly are more susceptible", alternative: "Domperidone or Ondansetron", severity: "avoid" },
  "Cyclobenzaprine": { reason: "Anticholinergic muscle relaxant — sedation, falls in elderly", alternative: "Tizanidine (lower dose) or physical therapy", severity: "avoid" },
  "Oxybutynin": { reason: "Anticholinergic — cognitive decline, dry mouth, constipation", alternative: "Mirabegron (beta-3 agonist, non-anticholinergic)", severity: "avoid" },
  "Tolterodine": { reason: "Anticholinergic burden in elderly — delirium risk", alternative: "Mirabegron", severity: "use-with-caution" },
  "Clonidine": { reason: "CNS depression, orthostatic hypotension, bradycardia in elderly", alternative: "Amlodipine or Lisinopril", severity: "avoid" },
  "Methyldopa": { reason: "Bradycardia, depression, orthostatic hypotension", alternative: "Amlodipine or Losartan", severity: "avoid" },
  "Prazosin": { reason: "First-dose orthostatic hypotension — high falls risk", alternative: "Tamsulosin (more uroselective)", severity: "use-with-caution" },
  "Digoxin": { reason: "Narrow therapeutic index — toxicity risk with renal decline", alternative: "Rate control with Metoprolol or Diltiazem", severity: "use-with-caution" },
  "Zolpidem": { reason: "Increased sensitivity in elderly — falls, delirium, next-day impairment", alternative: "Sleep hygiene, Ramelteon, low-dose Trazodone", severity: "avoid" },
  "Eszopiclone": { reason: "Sedative-hypnotic — same risks as Zolpidem in elderly", alternative: "Ramelteon or Suvorexant", severity: "avoid" },
  "Sliding Scale Insulin": { reason: "Higher risk of hypoglycemia without benefit in elderly", alternative: "Basal insulin with fixed doses", severity: "use-with-caution" },
  "Pethidine": { reason: "Neurotoxic metabolite (norpethidine) — seizures in elderly", alternative: "Morphine or Buprenorphine (safer in elderly)", severity: "avoid" },
  "Doxazosin": { reason: "Orthostatic hypotension risk — not recommended for HTN in elderly", alternative: "Amlodipine, Lisinopril, or Chlorthalidone", severity: "avoid" },
};

// Soundex algorithm for phonetic drug name matching
export function soundex(word: string): string {
  const s = word.toUpperCase().replace(/[^A-Z]/g, "");
  if (!s) return "";
  const map: Record<string, string> = {
    B: "1", F: "1", P: "1", V: "1",
    C: "2", G: "2", J: "2", K: "2", Q: "2", S: "2", X: "2", Z: "2",
    D: "3", T: "3",
    L: "4",
    M: "5", N: "5",
    R: "6",
  };
  let result = s[0];
  let lastCode = map[s[0]] || "0";
  for (let i = 1; i < s.length && result.length < 4; i++) {
    const code = map[s[i]] || "0";
    if (code !== "0" && code !== lastCode) {
      result += code;
    }
    lastCode = code;
  }
  return result.padEnd(4, "0");
}

// Find closest drug match using Soundex + Levenshtein
export function findDrugMatch(text: string, confidence: number): { match: string; score: number } | null {
  if (confidence >= 80) return null; // High confidence, no correction needed

  const textSoundex = soundex(text);
  const textLower = text.toLowerCase();
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const drug of DRUGS) {
    const drugLower = drug.toLowerCase();
    const drugSx = soundex(drug);

    // Soundex match
    let score = 0;
    if (textSoundex === drugSx) score += 50;
    else if (textSoundex.substring(0, 3) === drugSx.substring(0, 3)) score += 30;

    // Levenshtein-like similarity
    const maxLen = Math.max(textLower.length, drugLower.length);
    let matches = 0;
    for (let i = 0; i < Math.min(textLower.length, drugLower.length); i++) {
      if (textLower[i] === drugLower[i]) matches++;
    }
    score += (matches / maxLen) * 40;

    // Substring match bonus
    if (drugLower.includes(textLower) || textLower.includes(drugLower)) score += 25;

    // Length similarity
    const lenDiff = Math.abs(textLower.length - drugLower.length);
    if (lenDiff <= 2) score += 10;

    if (score > bestScore && score >= 40) {
      bestScore = score;
      bestMatch = drug;
    }
  }

  return bestMatch ? { match: bestMatch, score: Math.min(bestScore, 100) } : null;
}

// Simulated Drug Registry for authentication
export interface DrugRegistryEntry {
  drugName: string;
  batchNumber: string;
  manufacturer: string;
  expiryDate: string;
  status: "valid" | "expired" | "recalled" | "spurious";
  alertMessage?: string;
}

export function checkDrugAuthenticity(barcode: string): DrugRegistryEntry {
  // Simulated registry lookup
  const seed = barcode.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const drugIndex = seed % DRUGS.length;
  const drug = DRUGS[drugIndex];

  const manufacturers = ["Sun Pharma", "Cipla Ltd", "Dr. Reddy's", "Lupin Ltd", "Aurobindo", "Zydus", "Torrent Pharma", "Glenmark", "Alkem Labs", "Mankind Pharma"];
  const manufacturer = manufacturers[seed % manufacturers.length];

  const now = new Date();
  const monthsOffset = (seed % 36) - 6; // -6 to +30 months
  const expiry = new Date(now.getFullYear(), now.getMonth() + monthsOffset, 1);
  const isExpired = expiry < now;

  const batchPrefix = String.fromCharCode(65 + (seed % 26));
  const batchNum = `${batchPrefix}${String(seed % 10000).padStart(4, "0")}`;

  // 5% chance of spurious
  const isSpurious = seed % 20 === 7;

  const status: DrugRegistryEntry["status"] = isSpurious ? "spurious" : isExpired ? "expired" : "valid";

  return {
    drugName: drug as string,
    batchNumber: batchNum,
    manufacturer,
    expiryDate: expiry.toISOString().split("T")[0],
    status,
    alertMessage: isSpurious
      ? "⚠️ COUNTERFEIT WARNING: This batch has been flagged in the National Drug Registry as potentially spurious. Do NOT dispense. Report to regulatory authorities."
      : isExpired
      ? `⚠️ EXPIRED: This medication expired on ${expiry.toLocaleDateString()}. Do not use.`
      : undefined,
  };
}

