// Deterministic, literature-driven Drug-Food and Drug-Allergy lookup tables
// Sourced from peer-reviewed pharmacological data (Stockley's, FDA, Lexicomp summaries)

export type FoodSeverity = "severe" | "moderate" | "mild";

export interface FoodInteraction {
  food: string;
  severity: FoodSeverity;
  mechanism: string;
  recommendation: string;
  affectedDrugs: string[];
}

export const FOODS = [
  "Grapefruit Juice",
  "Alcohol",
  "Dairy / Calcium",
  "Vitamin K-rich Greens (Spinach, Kale)",
  "Tyramine-rich Foods (Aged Cheese, Cured Meat)",
  "Caffeine",
  "High-Fat Meals",
  "Licorice",
  "Cranberry Juice",
  "Banana / Orange (High K⁺)",
];

const FOOD_RULES: FoodInteraction[] = [
  {
    food: "Grapefruit Juice",
    severity: "severe",
    mechanism:
      "Furanocoumarins in grapefruit irreversibly inhibit intestinal CYP3A4, increasing systemic exposure of CYP3A4 substrates by 2–10×, raising toxicity risk (myopathy, hypotension, arrhythmia).",
    recommendation:
      "Avoid grapefruit and grapefruit juice entirely while on these drugs. Effect persists ~72 hours after last intake.",
    affectedDrugs: [
      "Atorvastatin", "Simvastatin", "Lovastatin",
      "Amlodipine", "Felodipine", "Nifedipine", "Nicardipine",
      "Diltiazem", "Verapamil",
      "Cyclosporine", "Tacrolimus", "Sirolimus",
      "Amiodarone", "Dronedarone",
      "Buspirone", "Triazolam", "Midazolam",
    ],
  },
  {
    food: "Alcohol",
    severity: "severe",
    mechanism:
      "Ethanol potentiates CNS depression, hepatotoxicity, and GI bleeding. With acetaminophen → NAPQI accumulation; with anticoagulants → bleeding; with metronidazole → disulfiram reaction.",
    recommendation:
      "Avoid or strictly limit alcohol. Counsel on bleeding signs, sedation, and liver toxicity.",
    affectedDrugs: [
      "Paracetamol", "Warfarin", "Aspirin", "Ibuprofen", "Naproxen",
      "Metronidazole", "Tinidazole",
      "Diazepam", "Alprazolam", "Lorazepam", "Clonazepam",
      "Tramadol", "Morphine", "Oxycodone", "Codeine", "Fentanyl",
      "Sertraline", "Fluoxetine", "Amitriptyline",
      "Metformin", "Insulin", "Glipizide", "Glimepiride",
    ],
  },
  {
    food: "Dairy / Calcium",
    severity: "moderate",
    mechanism:
      "Divalent cations (Ca²⁺, Mg²⁺) chelate fluoroquinolones, tetracyclines, and bisphosphonates in the gut, reducing absorption by 40–90%.",
    recommendation:
      "Separate dairy/antacid intake by ≥2 hours before or 6 hours after drug administration.",
    affectedDrugs: [
      "Ciprofloxacin", "Levofloxacin", "Moxifloxacin", "Norfloxacin", "Ofloxacin",
      "Doxycycline", "Tetracycline", "Minocycline",
      "Alendronate", "Risedronate",
      "Levothyroxine",
    ],
  },
  {
    food: "Vitamin K-rich Greens (Spinach, Kale)",
    severity: "moderate",
    mechanism:
      "Vitamin K antagonizes warfarin's anticoagulant effect by replenishing functional clotting factor synthesis, reducing INR.",
    recommendation:
      "Maintain consistent vitamin K intake — do not abruptly increase or eliminate leafy greens. Monitor INR after dietary changes.",
    affectedDrugs: ["Warfarin"],
  },
  {
    food: "Tyramine-rich Foods (Aged Cheese, Cured Meat)",
    severity: "severe",
    mechanism:
      "MAO inhibitors block tyramine metabolism, leading to massive norepinephrine release and hypertensive crisis (severe headache, stroke risk).",
    recommendation:
      "Strict dietary avoidance of aged cheese, cured meat, fermented soy, and tap beer while on MAOIs and for 2 weeks after discontinuation.",
    affectedDrugs: ["Linezolid", "Selegiline", "Phenelzine", "Tranylcypromine"],
  },
  {
    food: "Caffeine",
    severity: "mild",
    mechanism:
      "CYP1A2 substrates and inhibitors alter caffeine clearance. Stimulant additivity with sympathomimetics may increase anxiety, tremor, and arrhythmia risk.",
    recommendation:
      "Limit caffeine intake; monitor for jitteriness, palpitations, or insomnia.",
    affectedDrugs: ["Theophylline", "Ciprofloxacin", "Fluvoxamine", "Clozapine", "Lithium"],
  },
  {
    food: "High-Fat Meals",
    severity: "mild",
    mechanism:
      "Lipid-rich meals delay gastric emptying and increase bioavailability of lipophilic drugs (e.g., +60% AUC for some antifungals).",
    recommendation:
      "Take with or without food per label. Maintain consistency to avoid fluctuating plasma levels.",
    affectedDrugs: ["Itraconazole", "Posaconazole", "Griseofulvin", "Saquinavir"],
  },
  {
    food: "Licorice",
    severity: "moderate",
    mechanism:
      "Glycyrrhizin causes pseudohyperaldosteronism — sodium retention, potassium loss, hypertension; antagonizes antihypertensives and potentiates digoxin toxicity.",
    recommendation:
      "Avoid black licorice while on cardiovascular medications. Monitor BP and K⁺.",
    affectedDrugs: ["Digoxin", "Hydrochlorothiazide", "Furosemide", "Spironolactone", "Lisinopril"],
  },
  {
    food: "Cranberry Juice",
    severity: "moderate",
    mechanism:
      "Cranberry inhibits CYP2C9, increasing warfarin's anticoagulant effect and bleeding risk in case reports.",
    recommendation:
      "Limit cranberry juice intake. Monitor INR closely if consumed regularly.",
    affectedDrugs: ["Warfarin"],
  },
  {
    food: "Banana / Orange (High K⁺)",
    severity: "moderate",
    mechanism:
      "High dietary potassium combined with potassium-sparing diuretics or RAAS inhibitors can precipitate hyperkalemia (cardiac arrhythmia, asystole).",
    recommendation:
      "Counsel patients on potassium intake. Monitor serum K⁺ regularly.",
    affectedDrugs: [
      "Spironolactone", "Eplerenone", "Amiloride",
      "Lisinopril", "Enalapril", "Ramipril", "Losartan", "Valsartan",
    ],
  },
];

export function lookupFoodInteraction(drug: string, food: string): FoodInteraction | null {
  const rule = FOOD_RULES.find((r) => r.food === food);
  if (!rule) return null;
  if (rule.affectedDrugs.includes(drug)) return rule;
  return {
    ...rule,
    severity: "mild",
    mechanism: `No documented direct interaction between ${drug} and ${food} in primary pharmacological literature.`,
    recommendation:
      "Maintain standard dietary precautions. Reassess if patient is on additional medications sharing the same pathway.",
  };
}

// ===== ALLERGY OVERLAP =====

export type AllergyClass =
  | "Penicillin"
  | "Sulfa (Sulfonamide)"
  | "NSAID / Aspirin"
  | "Macrolide"
  | "Cephalosporin"
  | "Iodine / Contrast"
  | "Opioid (Codeine)"
  | "Statin";

export const ALLERGY_CLASSES: AllergyClass[] = [
  "Penicillin",
  "Sulfa (Sulfonamide)",
  "NSAID / Aspirin",
  "Macrolide",
  "Cephalosporin",
  "Iodine / Contrast",
  "Opioid (Codeine)",
  "Statin",
];

export interface AllergyOverlap {
  severity: "severe" | "moderate" | "mild";
  mechanism: string;
  recommendation: string;
  crossReactiveDrugs: string[];
}

const ALLERGY_RULES: Record<AllergyClass, { members: string[]; crossReactive: string[]; mechanism: string; recommendation: string }> = {
  "Penicillin": {
    members: ["Amoxicillin", "Ampicillin", "Amoxicillin-Clavulanate", "Piperacillin-Tazobactam"],
    crossReactive: ["Cephalexin", "Cefuroxime", "Ceftriaxone", "Cefixime", "Ceftazidime", "Cefepime"],
    mechanism:
      "β-lactam ring antigenicity. Cross-reactivity with 1st-generation cephalosporins ~1–10%; lower for later generations.",
    recommendation:
      "Avoid all penicillins. Use non-β-lactam alternatives (macrolide, fluoroquinolone, clindamycin). Cephalosporins only if reaction was non-IgE and side-chain differs.",
  },
  "Sulfa (Sulfonamide)": {
    members: ["Trimethoprim-Sulfamethoxazole", "Sulfasalazine"],
    crossReactive: ["Furosemide", "Hydrochlorothiazide", "Celecoxib", "Glimepiride", "Glipizide"],
    mechanism:
      "Sulfonamide moiety hypersensitivity (Stevens-Johnson syndrome, TEN risk). Cross-reactivity between antimicrobial and non-antimicrobial sulfonamides is debated but caution warranted.",
    recommendation:
      "Avoid sulfonamide antibiotics absolutely. Use alternatives (loop diuretic ethacrynic acid replaces furosemide if sulfa concern).",
  },
  "NSAID / Aspirin": {
    members: ["Aspirin", "Ibuprofen", "Naproxen", "Diclofenac", "Indomethacin", "Piroxicam", "Ketorolac", "Mefenamic Acid", "Meloxicam"],
    crossReactive: ["Celecoxib"],
    mechanism:
      "COX-1 inhibition causes leukotriene shift → bronchospasm in AERD (aspirin-exacerbated respiratory disease). Cross-reactivity within all non-selective NSAIDs.",
    recommendation:
      "Avoid all non-selective NSAIDs. Paracetamol is generally safe. Selective COX-2 (Celecoxib) often tolerated but use cautiously.",
  },
  "Macrolide": {
    members: ["Azithromycin", "Clarithromycin", "Erythromycin"],
    crossReactive: ["Azithromycin", "Clarithromycin", "Erythromycin"],
    mechanism: "Class-wide hypersensitivity; structural similarity within macrolides.",
    recommendation: "Use alternative class (doxycycline, fluoroquinolone, β-lactam).",
  },
  "Cephalosporin": {
    members: ["Cephalexin", "Cefuroxime", "Ceftriaxone", "Cefixime", "Ceftazidime", "Cefepime"],
    crossReactive: ["Amoxicillin", "Ampicillin", "Piperacillin-Tazobactam"],
    mechanism: "β-lactam ring; cross-reactivity with penicillins varies by R-group side chain.",
    recommendation: "Avoid all cephalosporins. Penicillins generally avoided unless allergy testing confirms tolerance.",
  },
  "Iodine / Contrast": {
    members: [],
    crossReactive: ["Amiodarone"],
    mechanism: "Iodine content in amiodarone (37% by weight) can trigger reactions in iodine-sensitive patients.",
    recommendation: "Premedicate if essential or choose alternative antiarrhythmic.",
  },
  "Opioid (Codeine)": {
    members: ["Codeine", "Morphine"],
    crossReactive: ["Hydrocodone", "Oxycodone"],
    mechanism: "True IgE-mediated opioid allergy is rare; most reactions are pseudo-allergic (histamine release). Natural opioids cross-react more than synthetic.",
    recommendation: "Switch to synthetic opioid (Fentanyl, Tramadol, Buprenorphine) and pre-medicate with antihistamine if needed.",
  },
  "Statin": {
    members: ["Atorvastatin", "Simvastatin", "Rosuvastatin", "Pravastatin", "Fluvastatin", "Lovastatin", "Pitavastatin"],
    crossReactive: [],
    mechanism: "Statin-associated myopathy/hepatitis is largely class effect; true allergy uncommon.",
    recommendation: "Rotate to hydrophilic statin (Pravastatin/Rosuvastatin) or non-statin lipid therapy (Ezetimibe, PCSK9 inhibitor).",
  },
};

export function lookupAllergyOverlap(drug: string, allergy: AllergyClass): AllergyOverlap {
  const rule = ALLERGY_RULES[allergy];
  const isDirect = rule.members.includes(drug);
  const isCross = rule.crossReactive.includes(drug);

  if (isDirect) {
    return {
      severity: "severe",
      mechanism: `${drug} belongs to the ${allergy} class. Direct re-exposure carries high risk of anaphylaxis or severe hypersensitivity. ${rule.mechanism}`,
      recommendation: `CONTRAINDICATED. ${rule.recommendation}`,
      crossReactiveDrugs: rule.crossReactive,
    };
  }
  if (isCross) {
    return {
      severity: "moderate",
      mechanism: `${drug} shows documented cross-reactivity with ${allergy}-class agents. ${rule.mechanism}`,
      recommendation: `Use with caution and only if benefit outweighs risk. ${rule.recommendation}`,
      crossReactiveDrugs: rule.crossReactive,
    };
  }
  return {
    severity: "mild",
    mechanism: `${drug} is not a member of, nor a documented cross-reactive agent for, the ${allergy} class.`,
    recommendation: "Standard precaution. Confirm full allergy history and consult prescriber if uncertain.",
    crossReactiveDrugs: rule.crossReactive,
  };
}
