// Deterministic Drug Tolerance, Dependence & Abuse profiles
// Sources: DSM-5-TR, DEA scheduling, NIDA, WHO ICD-11, Goodman & Gilman 14e, Stockley's

export type Schedule = "I" | "II" | "III" | "IV" | "V" | "OTC" | "Rx";
export type AbusePotential = "very-high" | "high" | "moderate" | "low" | "minimal";
export type ToleranceSpeed = "rapid" | "moderate" | "slow" | "none";

export interface SafetyProfile {
  drug: string;
  drugClass: string;
  schedule: Schedule;
  abusePotential: AbusePotential;
  toleranceSpeed: ToleranceSpeed;
  toleranceMechanism: string;
  dependence: { physical: boolean; psychological: boolean; crossTolerance: string[] };
  abuseSymptoms: string[];      // signs caregivers/clinicians can spot
  overdoseSymptoms: string[];   // acute toxidrome
  withdrawalSymptoms: string[]; // discontinuation syndrome
  withdrawalOnset: string;      // time window
  reversalAgent?: string;       // antidote if any
  redFlags: string[];           // behavioral red flags of misuse
}

export const SAFETY_PROFILES: Record<string, SafetyProfile> = {
  // ===== OPIOIDS =====
  Morphine: {
    drug: "Morphine", drugClass: "μ-Opioid agonist", schedule: "II",
    abusePotential: "very-high", toleranceSpeed: "rapid",
    toleranceMechanism: "μ-opioid receptor down-regulation + β-arrestin desensitization; analgesic tolerance within days, euphoric tolerance within weeks.",
    dependence: { physical: true, psychological: true, crossTolerance: ["Oxycodone","Hydrocodone","Fentanyl","Heroin","Methadone","Codeine"] },
    abuseSymptoms: ["Pinpoint (miotic) pupils","Sedation / nodding off","Slurred speech","Constipation","Itching / scratching nose","Track marks (IV)","Social withdrawal"],
    overdoseSymptoms: ["Respiratory depression <12/min","Cyanosis","Pinpoint pupils","Coma","Hypotension","Apnea"],
    withdrawalSymptoms: ["Yawning, lacrimation, rhinorrhea","Piloerection (goosebumps)","Mydriasis","Muscle cramps, abdominal pain","Diarrhea, vomiting","Anxiety, dysphoria","Tachycardia, hypertension"],
    withdrawalOnset: "Onset 6–12 h, peak 36–72 h, resolves 5–7 days",
    reversalAgent: "Naloxone 0.4–2 mg IV/IM/IN",
    redFlags: ["Early refill requests","Multiple prescribers (doctor shopping)","Lost prescriptions","Escalating dose without analgesic benefit","Crushing/snorting tablets"],
  },
  Oxycodone: {
    drug: "Oxycodone", drugClass: "μ-Opioid agonist", schedule: "II",
    abusePotential: "very-high", toleranceSpeed: "rapid",
    toleranceMechanism: "Cross-tolerant with other μ-agonists; rapid receptor desensitization, particularly with ER formulations crushed for IR effect.",
    dependence: { physical: true, psychological: true, crossTolerance: ["Morphine","Hydrocodone","Fentanyl","Heroin"] },
    abuseSymptoms: ["Pinpoint pupils","Euphoria followed by sedation","Itching","Constipation","Slow shallow breathing"],
    overdoseSymptoms: ["Respiratory depression","Stupor/coma","Pinpoint pupils","Hypotension","Pulmonary edema"],
    withdrawalSymptoms: ["Flu-like aches","Rhinorrhea, lacrimation","Piloerection","Diarrhea, abdominal cramps","Severe craving","Restless legs"],
    withdrawalOnset: "Onset 8–12 h, peak 1–3 days, resolves 5–10 days",
    reversalAgent: "Naloxone (may require repeat dosing — half-life mismatch)",
    redFlags: ["Tampering with ER tablets","Buying on street","Combining with benzodiazepines or alcohol","Forged prescriptions"],
  },
  Fentanyl: {
    drug: "Fentanyl", drugClass: "Synthetic μ-Opioid (100× morphine)", schedule: "II",
    abusePotential: "very-high", toleranceSpeed: "rapid",
    toleranceMechanism: "Extremely rapid tolerance; narrow therapeutic index. Illicit analogues (carfentanil) carry near-instantaneous lethal risk.",
    dependence: { physical: true, psychological: true, crossTolerance: ["Morphine","Oxycodone","Heroin","Methadone"] },
    abuseSymptoms: ["Profound sedation","Pinpoint pupils","Stiff chest (wooden chest syndrome)","Patch chewing/extracting gel"],
    overdoseSymptoms: ["Sudden apnea","Chest wall rigidity","Cyanosis","Cardiac arrest within minutes"],
    withdrawalSymptoms: ["Severe diaphoresis","Tachycardia","Diarrhea, vomiting","Intense craving","Insomnia"],
    withdrawalOnset: "Onset 2–6 h (short-acting); patches mask onset until 24 h after removal",
    reversalAgent: "High-dose naloxone (2–4 mg, may need repeat); call emergency services",
    redFlags: ["Patch tampering or chewing","Suspected illicit fentanyl-laced product","Sudden unconscious episodes"],
  },
  Codeine: {
    drug: "Codeine", drugClass: "Opioid prodrug (→ morphine via CYP2D6)", schedule: "III",
    abusePotential: "moderate", toleranceSpeed: "moderate",
    toleranceMechanism: "Ultra-rapid CYP2D6 metabolizers convert excess to morphine → unexpected toxicity; tolerance develops over weeks.",
    dependence: { physical: true, psychological: true, crossTolerance: ["Morphine","Tramadol","Hydrocodone"] },
    abuseSymptoms: ["Persistent cough syrup use ('purple drank')","Drowsiness","Constipation","Itching"],
    overdoseSymptoms: ["Respiratory depression","Sedation","Pinpoint pupils"],
    withdrawalSymptoms: ["Yawning, runny nose","Muscle aches","Anxiety","Abdominal cramps"],
    withdrawalOnset: "Onset 8–12 h, peak 36–72 h",
    reversalAgent: "Naloxone",
    redFlags: ["Buying multiple bottles of codeine cough syrup","Combining with promethazine/alcohol"],
  },
  Tramadol: {
    drug: "Tramadol", drugClass: "Weak μ-agonist + SNRI", schedule: "IV",
    abusePotential: "moderate", toleranceSpeed: "moderate",
    toleranceMechanism: "Dual mechanism → seizure risk at high doses; serotonergic component increases risk of serotonin syndrome.",
    dependence: { physical: true, psychological: true, crossTolerance: ["Codeine","Morphine"] },
    abuseSymptoms: ["Agitation","Diaphoresis","Mydriasis (atypical for opioids)","Tremor","Confusion"],
    overdoseSymptoms: ["Seizures","Serotonin syndrome","Respiratory depression","Coma"],
    withdrawalSymptoms: ["Classic opioid withdrawal PLUS atypical: hallucinations, paranoia, paresthesia, restless legs"],
    withdrawalOnset: "Onset 12–24 h, lasts 5–7 days",
    reversalAgent: "Naloxone (partial); benzodiazepines for seizures",
    redFlags: ["Self-medication for depression","Combining with SSRIs/SNRIs","Doses >400 mg/day"],
  },

  // ===== BENZODIAZEPINES =====
  Diazepam: {
    drug: "Diazepam", drugClass: "Long-acting Benzodiazepine (GABA-A)", schedule: "IV",
    abusePotential: "high", toleranceSpeed: "moderate",
    toleranceMechanism: "GABA-A receptor subunit uncoupling; sedative tolerance in 1–2 weeks, anxiolytic tolerance slower, anticonvulsant tolerance variable.",
    dependence: { physical: true, psychological: true, crossTolerance: ["Alprazolam","Lorazepam","Clonazepam","Alcohol","Barbiturates","Z-drugs (zolpidem)"] },
    abuseSymptoms: ["Slurred speech","Ataxia","Anterograde amnesia","Drowsiness","Disinhibition"],
    overdoseSymptoms: ["Sedation, coma","Respiratory depression (esp. with opioids/alcohol)","Hypotension","Hyporeflexia"],
    withdrawalSymptoms: ["Rebound anxiety, insomnia","Tremor, sweating","Seizures (potentially fatal)","Psychosis, hallucinations","Tachycardia, hypertension"],
    withdrawalOnset: "Onset 2–7 days (long t½), can persist weeks; never stop abruptly",
    reversalAgent: "Flumazenil (use cautiously — can precipitate seizures in dependent users)",
    redFlags: ["Use with opioids or alcohol","Doctor shopping","Dose escalation","Use for sleep beyond 2–4 weeks"],
  },
  Alprazolam: {
    drug: "Alprazolam", drugClass: "Short-acting Benzodiazepine", schedule: "IV",
    abusePotential: "very-high", toleranceSpeed: "rapid",
    toleranceMechanism: "Rapid receptor desensitization due to short half-life → inter-dose withdrawal, drives compulsive redosing.",
    dependence: { physical: true, psychological: true, crossTolerance: ["Diazepam","Lorazepam","Clonazepam","Alcohol"] },
    abuseSymptoms: ["Inter-dose anxiety","Slurred speech","Blackouts","Memory gaps","Risky behavior"],
    overdoseSymptoms: ["Severe sedation","Respiratory depression (with CNS depressants)","Coma"],
    withdrawalSymptoms: ["Severe rebound anxiety","Panic attacks","Seizures","Delirium","Perceptual disturbances"],
    withdrawalOnset: "Onset 6–24 h, peak 1–4 days; taper mandatory (often via diazepam crossover)",
    reversalAgent: "Flumazenil (risky in chronic users)",
    redFlags: ["Multiple short-term prescriptions","Pressed/counterfeit 'Xanax bars'","Co-use with opioids → high overdose risk"],
  },
  Clonazepam: {
    drug: "Clonazepam", drugClass: "Long-acting Benzodiazepine", schedule: "IV",
    abusePotential: "high", toleranceSpeed: "moderate",
    toleranceMechanism: "Slower tolerance than alprazolam; anticonvulsant tolerance may develop within months.",
    dependence: { physical: true, psychological: true, crossTolerance: ["Diazepam","Alprazolam","Lorazepam","Alcohol"] },
    abuseSymptoms: ["Sedation","Ataxia","Cognitive blunting","Mood lability"],
    overdoseSymptoms: ["CNS depression","Respiratory depression in combination overdoses"],
    withdrawalSymptoms: ["Anxiety rebound","Insomnia","Seizures","Depersonalization, derealization"],
    withdrawalOnset: "Onset 2–7 days; protracted withdrawal can last months",
    reversalAgent: "Flumazenil (caution)",
    redFlags: ["Long-term daily use","Combining with opioids","Self-escalation of dose"],
  },

  // ===== STIMULANTS =====
  Amphetamine: {
    drug: "Amphetamine", drugClass: "CNS Stimulant (DAT/NET reverse-transporter)", schedule: "II",
    abusePotential: "very-high", toleranceSpeed: "rapid",
    toleranceMechanism: "Dopamine depletion + D2 receptor down-regulation; reward tolerance within days of high-dose use.",
    dependence: { physical: false, psychological: true, crossTolerance: ["Methamphetamine","Methylphenidate","Cocaine","MDMA"] },
    abuseSymptoms: ["Mydriasis (dilated pupils)","Tachycardia, hypertension","Hyperthermia","Diaphoresis","Bruxism (jaw clenching)","Insomnia","Weight loss","Skin picking, formication","Pressured speech, grandiosity"],
    overdoseSymptoms: ["Hypertensive crisis","Hyperthermia >40 °C","Seizures","Stroke, MI","Rhabdomyolysis","Psychosis, agitation"],
    withdrawalSymptoms: ["'Crash': hypersomnia, hyperphagia","Severe depression, suicidality","Anhedonia","Vivid dreams","Intense craving"],
    withdrawalOnset: "Onset within hours of last dose; crash 1–3 days, depression weeks",
    reversalAgent: "No specific antidote — benzodiazepines for agitation/seizures, active cooling",
    redFlags: ["Use to lose weight or study","IV/intranasal use","Combining with opioids ('speedball')","Paranoid delusions"],
  },
  Methylphenidate: {
    drug: "Methylphenidate", drugClass: "CNS Stimulant (DAT inhibitor)", schedule: "II",
    abusePotential: "high", toleranceSpeed: "moderate",
    toleranceMechanism: "Similar to amphetamine but less DA release; tolerance to euphoria, not therapeutic ADHD effect, with proper dosing.",
    dependence: { physical: false, psychological: true, crossTolerance: ["Amphetamine","Cocaine"] },
    abuseSymptoms: ["Crushing/snorting tablets","Insomnia","Weight loss","Anxiety","Tachycardia"],
    overdoseSymptoms: ["Hypertension, tachycardia","Seizures","Hyperthermia","Psychosis"],
    withdrawalSymptoms: ["Fatigue","Depression","Hyperphagia","Sleep disturbance"],
    withdrawalOnset: "Onset hours to 1 day; resolves 1–2 weeks",
    reversalAgent: "Supportive; benzodiazepines for agitation",
    redFlags: ["Tampering with ER capsules","Diversion to peers","Use without ADHD diagnosis"],
  },

  // ===== ALCOHOL & SEDATIVES =====
  Alcohol: {
    drug: "Alcohol", drugClass: "GABA-A potentiator + NMDA antagonist", schedule: "OTC",
    abusePotential: "very-high", toleranceSpeed: "moderate",
    toleranceMechanism: "Metabolic (CYP2E1 induction) + functional (receptor adaptation); tolerance within weeks of daily use.",
    dependence: { physical: true, psychological: true, crossTolerance: ["Benzodiazepines","Barbiturates","Z-drugs"] },
    abuseSymptoms: ["Smell of alcohol","Slurred speech","Ataxia","Nystagmus","Mood lability","Hidden bottles"],
    overdoseSymptoms: ["Coma at BAC >0.3%","Respiratory depression","Aspiration","Hypoglycemia","Hypothermia"],
    withdrawalSymptoms: ["Tremor, anxiety (6–12 h)","Seizures (12–48 h)","Hallucinations","Delirium tremens (48–96 h): autonomic storm, confusion, fatal if untreated"],
    withdrawalOnset: "Onset 6–24 h after last drink; DTs peak at 48–96 h",
    reversalAgent: "Benzodiazepines (CIWA-Ar protocol), thiamine, fluids",
    redFlags: ["Morning drinking","Failed cut-down attempts","CAGE score ≥2","Liver enzyme elevation"],
  },
  Zolpidem: {
    drug: "Zolpidem", drugClass: "Non-benzodiazepine 'Z-drug' (GABA-A α1)", schedule: "IV",
    abusePotential: "moderate", toleranceSpeed: "rapid",
    toleranceMechanism: "Tolerance to hypnotic effect in 2–4 weeks; rebound insomnia common.",
    dependence: { physical: true, psychological: true, crossTolerance: ["Benzodiazepines","Alcohol"] },
    abuseSymptoms: ["Complex sleep behaviors (sleep-driving, sleep-eating)","Anterograde amnesia","Hallucinations at high dose"],
    overdoseSymptoms: ["Sedation","Respiratory depression with other CNS depressants"],
    withdrawalSymptoms: ["Rebound insomnia","Anxiety","Tremor","Seizures (rare, high-dose)"],
    withdrawalOnset: "Onset 1–2 days; resolves 1–2 weeks",
    reversalAgent: "Flumazenil",
    redFlags: ["Use >4 weeks","Dose escalation","Combining with alcohol"],
  },

  // ===== CANNABINOIDS & OTHERS =====
  Cannabis: {
    drug: "Cannabis (THC)", drugClass: "CB1 partial agonist", schedule: "I",
    abusePotential: "moderate", toleranceSpeed: "moderate",
    toleranceMechanism: "CB1 receptor down-regulation; tolerance to euphoria & cardiovascular effects within weeks of daily use.",
    dependence: { physical: true, psychological: true, crossTolerance: ["Synthetic cannabinoids (K2/Spice)"] },
    abuseSymptoms: ["Conjunctival injection (red eyes)","Tachycardia","Increased appetite","Dry mouth","Impaired coordination","Time distortion","Paranoia/anxiety at high dose"],
    overdoseSymptoms: ["Acute panic, paranoia","Cannabinoid hyperemesis syndrome (cyclical vomiting + hot showers)","Rare: psychosis in vulnerable users"],
    withdrawalSymptoms: ["Irritability, anger","Insomnia, vivid dreams","Decreased appetite","Restlessness","Cravings"],
    withdrawalOnset: "Onset 24–72 h, peak 1 week, resolves 2–3 weeks",
    redFlags: ["Daily/high-potency concentrate use","Onset of psychotic symptoms","Use before driving or work"],
  },
  Pregabalin: {
    drug: "Pregabalin", drugClass: "α2δ-1 Ca²⁺ channel modulator", schedule: "V",
    abusePotential: "moderate", toleranceSpeed: "moderate",
    toleranceMechanism: "Euphoria/anxiolysis tolerance in weeks; misuse rising in opioid-dependent populations.",
    dependence: { physical: true, psychological: true, crossTolerance: ["Gabapentin","Benzodiazepines (partial)"] },
    abuseSymptoms: ["Euphoria, dissociation","Slurred speech","Ataxia","Edema"],
    overdoseSymptoms: ["Sedation","Respiratory depression (with opioids/alcohol)","Seizures (paradoxical)"],
    withdrawalSymptoms: ["Anxiety, insomnia","Sweating","Tachycardia","Seizures (abrupt cessation)"],
    withdrawalOnset: "Onset 1–2 days; taper over 1 week",
    redFlags: ["Doses >600 mg/day","Co-use with opioids → markedly increased overdose mortality"],
  },

  // ===== NICOTINE =====
  Nicotine: {
    drug: "Nicotine", drugClass: "Nicotinic ACh receptor agonist", schedule: "OTC",
    abusePotential: "very-high", toleranceSpeed: "rapid",
    toleranceMechanism: "Upregulation of nAChRs paradoxically increases craving; tolerance within hours/days.",
    dependence: { physical: true, psychological: true, crossTolerance: [] },
    abuseSymptoms: ["Tobacco smell","Stained fingers/teeth","Chronic cough","Frequent smoking breaks","Vaping device use"],
    overdoseSymptoms: ["Nausea, vomiting","Tachycardia → bradycardia","Seizures (acute pediatric e-liquid ingestion)"],
    withdrawalSymptoms: ["Irritability","Anxiety","Difficulty concentrating","Increased appetite","Craving"],
    withdrawalOnset: "Onset 4–24 h, peak 3 days, resolves 2–4 weeks",
    reversalAgent: "Supportive; NRT/varenicline/bupropion for cessation",
    redFlags: ["Smoking within 30 min of waking (Fagerström)","Failed quit attempts","Vape pod-a-day use"],
  },

  // ===== KETAMINE / DISSOCIATIVES =====
  Ketamine: {
    drug: "Ketamine", drugClass: "NMDA antagonist", schedule: "III",
    abusePotential: "high", toleranceSpeed: "rapid",
    toleranceMechanism: "Rapid tolerance to dissociative effects; chronic use → ketamine cystitis, cognitive impairment.",
    dependence: { physical: false, psychological: true, crossTolerance: ["PCP","Dextromethorphan","Nitrous oxide (partial)"] },
    abuseSymptoms: ["'K-hole' (dissociation)","Nystagmus","Slurred speech","Urinary urgency/pain (ketamine cystitis)","Memory impairment"],
    overdoseSymptoms: ["Profound dissociation","Respiratory depression at high dose","Laryngospasm","Hypertension"],
    withdrawalSymptoms: ["Craving","Depression","Anxiety","Tremor","Sweating"],
    withdrawalOnset: "Onset 1–3 days; psychological withdrawal persists weeks",
    redFlags: ["Bladder symptoms in young user","Self-medication for depression outside clinic","Use with alcohol/GHB"],
  },
};

export const SAFETY_DRUGS = Object.keys(SAFETY_PROFILES);

// Quick lookup helper
export function getSafetyProfile(drug: string): SafetyProfile | undefined {
  return SAFETY_PROFILES[drug];
}
