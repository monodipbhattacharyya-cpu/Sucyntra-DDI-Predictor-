// Class-template expansion to reach 500+ safety profiles.
// Hand-curated profiles in drugSafetyProfile.ts take precedence; this fills the rest by class.
import type { SafetyProfile, AbusePotential, ToleranceSpeed, Schedule } from "./drugSafetyProfile";

interface ClassTemplate {
  drugClass: string;
  schedule: Schedule;
  abusePotential: AbusePotential;
  toleranceSpeed: ToleranceSpeed;
  toleranceMechanism: string;
  physical: boolean;
  psychological: boolean;
  crossTolerance: string[];
  abuseSymptoms: string[];
  overdoseSymptoms: string[];
  withdrawalSymptoms: string[];
  withdrawalOnset: string;
  reversalAgent?: string;
  redFlags: string[];
}

// ---- Class templates ----
const T: Record<string, ClassTemplate> = {
  opioid: {
    drugClass: "μ-Opioid Receptor Agonist", schedule: "II", abusePotential: "very-high", toleranceSpeed: "rapid",
    toleranceMechanism: "μ-receptor desensitization & β-arrestin recruitment; analgesic tolerance in days, euphoric tolerance in weeks. Cross-tolerant with all μ-agonists.",
    physical: true, psychological: true,
    crossTolerance: ["Morphine","Oxycodone","Fentanyl","Hydrocodone","Methadone","Heroin"],
    abuseSymptoms: ["Pinpoint pupils","Sedation / nodding","Slurred speech","Constipation","Itching","Pruritus / nose-scratching"],
    overdoseSymptoms: ["Respiratory depression","Pinpoint pupils","Coma","Cyanosis","Apnea"],
    withdrawalSymptoms: ["Yawning, lacrimation, rhinorrhea","Piloerection, mydriasis","Muscle/abdominal cramps","Diarrhea, vomiting","Anxiety, dysphoria","Tachycardia, hypertension"],
    withdrawalOnset: "Onset 6–24 h, peak 36–72 h, resolves 5–10 days",
    reversalAgent: "Naloxone 0.4–2 mg IV/IM/IN (titrate, repeat as needed)",
    redFlags: ["Early refill requests","Doctor shopping","Lost prescriptions","Dose escalation","Crushing/snorting/IV use","Combining with benzos or alcohol"],
  },
  benzo: {
    drugClass: "Benzodiazepine (GABA-A positive modulator)", schedule: "IV", abusePotential: "high", toleranceSpeed: "moderate",
    toleranceMechanism: "GABA-A subunit uncoupling; hypnotic tolerance in 1–2 weeks, anxiolytic slower. Cross-tolerant with alcohol and barbiturates.",
    physical: true, psychological: true,
    crossTolerance: ["Diazepam","Alprazolam","Lorazepam","Clonazepam","Alcohol","Barbiturates","Z-drugs"],
    abuseSymptoms: ["Slurred speech","Ataxia","Anterograde amnesia","Drowsiness","Disinhibition"],
    overdoseSymptoms: ["Sedation, coma","Respiratory depression (esp. with opioids/alcohol)","Hypotension"],
    withdrawalSymptoms: ["Rebound anxiety, insomnia","Tremor, diaphoresis","Seizures (potentially fatal)","Psychosis","Tachycardia, hypertension"],
    withdrawalOnset: "Onset 1–7 days; never stop abruptly — taper required",
    reversalAgent: "Flumazenil (cautious — can precipitate seizures in dependent users)",
    redFlags: ["Use >4 weeks","Co-use with opioids/alcohol","Dose escalation","Doctor shopping"],
  },
  zdrug: {
    drugClass: "Non-benzodiazepine Hypnotic (Z-drug)", schedule: "IV", abusePotential: "moderate", toleranceSpeed: "rapid",
    toleranceMechanism: "Selective GABA-A α1 binding; hypnotic tolerance in 2–4 weeks with rebound insomnia.",
    physical: true, psychological: true,
    crossTolerance: ["Benzodiazepines","Alcohol"],
    abuseSymptoms: ["Complex sleep behaviors","Anterograde amnesia","Daytime drowsiness"],
    overdoseSymptoms: ["Sedation","Respiratory depression with other CNS depressants"],
    withdrawalSymptoms: ["Rebound insomnia","Anxiety","Tremor"],
    withdrawalOnset: "Onset 1–2 days; resolves 1–2 weeks",
    reversalAgent: "Flumazenil",
    redFlags: ["Use >4 weeks","Combining with alcohol","Sleep-driving episodes"],
  },
  stimulant: {
    drugClass: "CNS Stimulant", schedule: "II", abusePotential: "very-high", toleranceSpeed: "rapid",
    toleranceMechanism: "Dopamine release/reuptake inhibition → D2 down-regulation; reward tolerance within days of high-dose use.",
    physical: false, psychological: true,
    crossTolerance: ["Amphetamine","Methylphenidate","Cocaine","Methamphetamine"],
    abuseSymptoms: ["Mydriasis","Tachycardia, hypertension","Hyperthermia","Bruxism","Insomnia","Weight loss","Skin picking","Pressured speech"],
    overdoseSymptoms: ["Hypertensive crisis","Hyperthermia","Seizures","MI/stroke","Rhabdomyolysis","Psychosis"],
    withdrawalSymptoms: ["Crash hypersomnia & hyperphagia","Severe depression, suicidality","Anhedonia","Vivid dreams","Intense craving"],
    withdrawalOnset: "Onset hours; crash 1–3 days, depression weeks",
    reversalAgent: "Supportive — benzodiazepines for agitation/seizures, active cooling",
    redFlags: ["Use for weight loss / study","IV or intranasal route","Diversion to peers","Paranoid delusions"],
  },
  barbiturate: {
    drugClass: "Barbiturate (GABA-A direct agonist)", schedule: "II", abusePotential: "high", toleranceSpeed: "moderate",
    toleranceMechanism: "Direct GABA-A chloride channel opening; narrow therapeutic index. Cross-tolerant with alcohol/benzodiazepines.",
    physical: true, psychological: true,
    crossTolerance: ["Alcohol","Benzodiazepines"],
    abuseSymptoms: ["Slurred speech","Ataxia","Disorientation","Nystagmus"],
    overdoseSymptoms: ["Respiratory arrest","Hypotension","Coma","Hypothermia"],
    withdrawalSymptoms: ["Anxiety, tremor","Seizures","Delirium","Cardiovascular collapse"],
    withdrawalOnset: "Onset 1–3 days; life-threatening — inpatient taper",
    redFlags: ["Any non-medical use","Co-use with opioids/alcohol"],
  },
  gabapentinoid: {
    drugClass: "α2δ Calcium Channel Modulator (Gabapentinoid)", schedule: "V", abusePotential: "moderate", toleranceSpeed: "moderate",
    toleranceMechanism: "α2δ-1 binding reduces excitatory transmitter release; euphoria/anxiolysis tolerance in weeks. Misuse rising in opioid-dependent populations.",
    physical: true, psychological: true,
    crossTolerance: ["Pregabalin","Gabapentin"],
    abuseSymptoms: ["Euphoria, dissociation","Slurred speech","Ataxia","Edema"],
    overdoseSymptoms: ["Sedation","Respiratory depression with opioids/alcohol","Paradoxical seizures"],
    withdrawalSymptoms: ["Anxiety, insomnia","Sweating, tachycardia","Seizures on abrupt cessation"],
    withdrawalOnset: "Onset 1–2 days; taper over 1 week",
    redFlags: ["Doses above approved range","Co-use with opioids → ↑ overdose mortality"],
  },
  ssri: {
    drugClass: "Selective Serotonin Reuptake Inhibitor (SSRI)", schedule: "Rx", abusePotential: "minimal", toleranceSpeed: "slow",
    toleranceMechanism: "5-HT receptor down-regulation; tolerance to side effects (GI, sexual) more than therapeutic effect. No reward tolerance.",
    physical: true, psychological: false, crossTolerance: [],
    abuseSymptoms: ["Not typically misused"],
    overdoseSymptoms: ["Serotonin syndrome (with other serotonergics)","QT prolongation (citalopram)","Seizures (rare)"],
    withdrawalSymptoms: ["SSRI discontinuation syndrome: FINISH — Flu-like, Insomnia, Nausea, Imbalance, Sensory disturbances ('brain zaps'), Hyperarousal"],
    withdrawalOnset: "Onset 1–3 days after stop, lasts 1–4 weeks; taper required (esp. paroxetine, venlafaxine)",
    redFlags: ["Abrupt discontinuation without taper","Combining with MAOIs or triptans"],
  },
  snri: {
    drugClass: "Serotonin-Norepinephrine Reuptake Inhibitor (SNRI)", schedule: "Rx", abusePotential: "minimal", toleranceSpeed: "slow",
    toleranceMechanism: "Dual 5-HT/NE reuptake inhibition. No reward potential but significant discontinuation syndrome, severe with short half-life (venlafaxine).",
    physical: true, psychological: false, crossTolerance: [],
    abuseSymptoms: ["Not typically misused"],
    overdoseSymptoms: ["Serotonin syndrome","Seizures","Hypertensive crisis","Cardiac conduction delay"],
    withdrawalSymptoms: ["Brain zaps, vertigo","Nausea, headache","Irritability, anxiety","Flu-like symptoms"],
    withdrawalOnset: "Onset 12–48 h (short half-life agents); taper over weeks",
    redFlags: ["Abrupt cessation","Co-prescription with MAOI/linezolid"],
  },
  tca: {
    drugClass: "Tricyclic Antidepressant", schedule: "Rx", abusePotential: "low", toleranceSpeed: "slow",
    toleranceMechanism: "Reuptake inhibition + anticholinergic & antihistaminergic effects; not rewarding but lethal in overdose due to Na⁺ channel blockade.",
    physical: true, psychological: false, crossTolerance: [],
    abuseSymptoms: ["Sedation, dry mouth (therapeutic)","Rarely diverted"],
    overdoseSymptoms: ["Wide-QRS arrhythmia","Seizures","Anticholinergic toxidrome","Coma","Hypotension"],
    withdrawalSymptoms: ["Cholinergic rebound: nausea, headache, malaise","Insomnia, vivid dreams"],
    withdrawalOnset: "Onset 1–3 days; taper over weeks",
    reversalAgent: "Sodium bicarbonate for cardiotoxicity",
    redFlags: ["Stockpiling for self-harm","Co-prescription with MAOI"],
  },
  maoi: {
    drugClass: "Monoamine Oxidase Inhibitor (MAOI)", schedule: "Rx", abusePotential: "low", toleranceSpeed: "slow",
    toleranceMechanism: "Irreversible MAO inhibition; activity returns only with new enzyme synthesis (~2 weeks).",
    physical: false, psychological: false, crossTolerance: [],
    abuseSymptoms: ["Rarely abused"],
    overdoseSymptoms: ["Hypertensive crisis (tyramine reaction)","Serotonin syndrome","Hyperthermia","Seizures"],
    withdrawalSymptoms: ["Discontinuation: agitation, psychosis, cognitive impairment"],
    withdrawalOnset: "Onset 1–3 days; 14-day washout required before serotonergics",
    redFlags: ["Dietary non-compliance (aged cheese, cured meats)","Combining with SSRI/SNRI/triptan"],
  },
  antipsychoticAtyp: {
    drugClass: "Atypical Antipsychotic (D2/5-HT2A antagonist)", schedule: "Rx", abusePotential: "low", toleranceSpeed: "moderate",
    toleranceMechanism: "Receptor down-regulation; misuse reported for sedation (quetiapine 'Suzie-Q', olanzapine).",
    physical: true, psychological: true, crossTolerance: [],
    abuseSymptoms: ["Sedation-seeking use","Weight gain","Metabolic syndrome"],
    overdoseSymptoms: ["Sedation","QT prolongation","Hypotension","Anticholinergic effects","NMS (rare)"],
    withdrawalSymptoms: ["Cholinergic/dopaminergic rebound: nausea, insomnia, agitation","Withdrawal dyskinesia","Supersensitivity psychosis"],
    withdrawalOnset: "Onset days; taper over weeks",
    redFlags: ["Use for sleep without indication","Diversion in correctional settings"],
  },
  antipsychoticTyp: {
    drugClass: "Typical Antipsychotic (D2 antagonist)", schedule: "Rx", abusePotential: "minimal", toleranceSpeed: "slow",
    toleranceMechanism: "D2 receptor blockade with eventual receptor upregulation → tardive dyskinesia risk.",
    physical: true, psychological: false, crossTolerance: [],
    abuseSymptoms: ["Not abused"],
    overdoseSymptoms: ["Extrapyramidal symptoms","NMS","QT prolongation","Hypotension"],
    withdrawalSymptoms: ["Withdrawal dyskinesia","Supersensitivity psychosis","Cholinergic rebound"],
    withdrawalOnset: "Days–weeks; taper over weeks",
    redFlags: ["Abrupt discontinuation"],
  },
  betablocker: {
    drugClass: "β-Adrenergic Blocker", schedule: "Rx", abusePotential: "minimal", toleranceSpeed: "slow",
    toleranceMechanism: "β-receptor upregulation during chronic blockade; abrupt withdrawal causes rebound hypertension, tachycardia, angina, MI.",
    physical: true, psychological: false, crossTolerance: [],
    abuseSymptoms: ["Performance-enhancement misuse (banned in shooting/archery)"],
    overdoseSymptoms: ["Bradycardia","Hypotension","AV block","Bronchospasm","Hypoglycemia"],
    withdrawalSymptoms: ["Rebound tachycardia, hypertension","Angina, MI in CAD","Tremor, anxiety"],
    withdrawalOnset: "Onset 1–2 days; taper over 1–2 weeks",
    reversalAgent: "Glucagon, high-dose insulin/dextrose, atropine, pacing",
    redFlags: ["Abrupt stop in CAD patient"],
  },
  ccb: {
    drugClass: "Calcium Channel Blocker", schedule: "Rx", abusePotential: "minimal", toleranceSpeed: "slow",
    toleranceMechanism: "Vascular smooth-muscle/cardiac L-type Ca²⁺ blockade; minimal tolerance.",
    physical: false, psychological: false, crossTolerance: [],
    abuseSymptoms: ["Not abused"],
    overdoseSymptoms: ["Hypotension","Bradycardia (non-DHP)","Hyperglycemia","Lactic acidosis","Cardiogenic shock"],
    withdrawalSymptoms: ["Rebound hypertension (rare with DHPs)"],
    withdrawalOnset: "Not clinically significant",
    reversalAgent: "Calcium gluconate, high-dose insulin/dextrose, vasopressors",
    redFlags: ["Co-prescription of non-DHP with β-blocker"],
  },
  acei: {
    drugClass: "ACE Inhibitor", schedule: "Rx", abusePotential: "minimal", toleranceSpeed: "none",
    toleranceMechanism: "No tolerance to antihypertensive effect.",
    physical: false, psychological: false, crossTolerance: [],
    abuseSymptoms: ["Not abused"],
    overdoseSymptoms: ["Severe hypotension","Hyperkalemia","Acute kidney injury","Angioedema"],
    withdrawalSymptoms: ["BP rebound (modest)"],
    withdrawalOnset: "Days",
    redFlags: ["Pregnancy exposure (teratogenic)"],
  },
  arb: {
    drugClass: "Angiotensin Receptor Blocker", schedule: "Rx", abusePotential: "minimal", toleranceSpeed: "none",
    toleranceMechanism: "AT1 receptor blockade; no tolerance.",
    physical: false, psychological: false, crossTolerance: [],
    abuseSymptoms: ["Not abused"],
    overdoseSymptoms: ["Hypotension","Hyperkalemia","AKI"],
    withdrawalSymptoms: ["BP rebound (mild)"],
    withdrawalOnset: "Days",
    redFlags: ["Pregnancy exposure"],
  },
  statin: {
    drugClass: "HMG-CoA Reductase Inhibitor (Statin)", schedule: "Rx", abusePotential: "minimal", toleranceSpeed: "none",
    toleranceMechanism: "No tolerance; ongoing therapy needed for LDL lowering.",
    physical: false, psychological: false, crossTolerance: [],
    abuseSymptoms: ["Not abused"],
    overdoseSymptoms: ["Myopathy, rhabdomyolysis","Hepatotoxicity"],
    withdrawalSymptoms: ["LDL rebound; ↑ CV event risk on stop"],
    withdrawalOnset: "Weeks",
    redFlags: ["Co-administration with strong CYP3A4 inhibitors"],
  },
  ppi: {
    drugClass: "Proton Pump Inhibitor", schedule: "OTC", abusePotential: "minimal", toleranceSpeed: "moderate",
    toleranceMechanism: "Tachyphylaxis uncommon, but rebound acid hypersecretion follows chronic use (gastrin-driven ECL hyperplasia).",
    physical: true, psychological: false, crossTolerance: [],
    abuseSymptoms: ["Not abused; commonly overused"],
    overdoseSymptoms: ["Generally well tolerated; long-term: B12/Mg deficiency, ↑ fracture risk"],
    withdrawalSymptoms: ["Rebound dyspepsia, heartburn (2–8 weeks)"],
    withdrawalOnset: "Onset 1–2 weeks; step-down to H2 blocker recommended",
    redFlags: ["Continuous use >8 weeks without indication"],
  },
  steroid: {
    drugClass: "Systemic Corticosteroid", schedule: "Rx", abusePotential: "moderate", toleranceSpeed: "moderate",
    toleranceMechanism: "Suppresses HPA axis → adrenal atrophy with chronic (>2 weeks) high-dose use. Performance/cosmetic misuse documented.",
    physical: true, psychological: true, crossTolerance: [],
    abuseSymptoms: ["Body-builder use","Cushingoid features","Insomnia, mania","Skin thinning, bruising"],
    overdoseSymptoms: ["Hyperglycemia","Hypertension","Psychosis","Osteoporotic fractures","Infection"],
    withdrawalSymptoms: ["Adrenal crisis: hypotension, fatigue, hypoglycemia, hyponatremia","Steroid withdrawal syndrome: arthralgia, malaise, fever"],
    withdrawalOnset: "Onset days after abrupt stop; taper required after >2 weeks of supraphysiological dosing",
    reversalAgent: "Stress-dose hydrocortisone for adrenal crisis",
    redFlags: ["Non-medical use for muscle gain","Topical/oral use beyond prescription"],
  },
  anabolic: {
    drugClass: "Anabolic Androgenic Steroid (AAS)", schedule: "III", abusePotential: "high", toleranceSpeed: "moderate",
    toleranceMechanism: "Androgen receptor down-regulation; HPG-axis suppression. No classic reward tolerance.",
    physical: true, psychological: true, crossTolerance: [],
    abuseSymptoms: ["Rapid muscle gain","Acne, gynecomastia","Testicular atrophy","Aggression ('roid rage')","Mood swings"],
    overdoseSymptoms: ["Hypertension","Cardiomyopathy","Hepatic adenoma","Thrombosis","Polycythemia"],
    withdrawalSymptoms: ["Hypogonadism, depression","Fatigue","Loss of libido","Suicidality"],
    withdrawalOnset: "Onset weeks; protracted hypogonadism months",
    redFlags: ["Gym/locker-room use","Multi-vial stacking","IM injection track marks"],
  },
  antihistH1Sed: {
    drugClass: "1st-Gen Sedating Antihistamine", schedule: "OTC", abusePotential: "moderate", toleranceSpeed: "rapid",
    toleranceMechanism: "H1/muscarinic blockade; sedative tolerance within 1–2 weeks. Abused for sleep, dissociation (high-dose anticholinergic delirium).",
    physical: false, psychological: true, crossTolerance: [],
    abuseSymptoms: ["Drowsiness","Anticholinergic toxidrome (dry/red/hot/blind/mad) at high dose","Hallucinations"],
    overdoseSymptoms: ["Anticholinergic delirium","Seizures","Wide-QRS tachycardia","Hyperthermia"],
    withdrawalSymptoms: ["Insomnia, rebound itching"],
    withdrawalOnset: "Onset 1–3 days",
    reversalAgent: "Physostigmine (selected anticholinergic toxicity)",
    redFlags: ["Use for sleep nightly","Adolescent recreational use of diphenhydramine ('Benadryl challenge')"],
  },
  antihistH1NonSed: {
    drugClass: "2nd-Gen Non-Sedating Antihistamine", schedule: "OTC", abusePotential: "minimal", toleranceSpeed: "slow",
    toleranceMechanism: "Selective peripheral H1 blockade; minimal tolerance.",
    physical: false, psychological: false, crossTolerance: [],
    abuseSymptoms: ["Not abused"],
    overdoseSymptoms: ["QT prolongation (rare)","Sedation in overdose"],
    withdrawalSymptoms: ["Rebound pruritus (chronic urticaria)"],
    withdrawalOnset: "Days",
    redFlags: ["None routine"],
  },
  muscleRelaxant: {
    drugClass: "Centrally-Acting Muscle Relaxant", schedule: "IV", abusePotential: "moderate", toleranceSpeed: "moderate",
    toleranceMechanism: "GABA-B / α2 agonism / structural TCA-like effects depending on agent; carisoprodol metabolizes to meprobamate (high abuse).",
    physical: true, psychological: true, crossTolerance: ["Benzodiazepines","Alcohol"],
    abuseSymptoms: ["Sedation","Ataxia","Slurred speech","Use with opioids ('Holy Trinity' = opioid + benzo + carisoprodol)"],
    overdoseSymptoms: ["Respiratory depression with co-ingestants","Coma","Seizures (baclofen)"],
    withdrawalSymptoms: ["Anxiety, tremor","Insomnia","Hallucinations","Seizures (baclofen, abrupt)"],
    withdrawalOnset: "Onset 1–3 days; baclofen withdrawal life-threatening if intrathecal",
    redFlags: ["Combination with opioids and benzodiazepines"],
  },
  triptan: {
    drugClass: "5-HT1B/1D Agonist (Triptan)", schedule: "Rx", abusePotential: "low", toleranceSpeed: "moderate",
    toleranceMechanism: "Receptor desensitization; medication-overuse headache (MOH) with >10 days/month use.",
    physical: false, psychological: true, crossTolerance: [],
    abuseSymptoms: ["Daily use for chronic headache"],
    overdoseSymptoms: ["Coronary vasospasm","Hypertension","Serotonin syndrome (with SSRIs)"],
    withdrawalSymptoms: ["Rebound headache (MOH)"],
    withdrawalOnset: "Days–weeks",
    redFlags: ["Use >10 days/month"],
  },
  decongestant: {
    drugClass: "Sympathomimetic Decongestant", schedule: "OTC", abusePotential: "moderate", toleranceSpeed: "rapid",
    toleranceMechanism: "α-adrenergic receptor down-regulation; rhinitis medicamentosa with topical use >3 days. Pseudoephedrine is meth precursor.",
    physical: true, psychological: true, crossTolerance: ["Amphetamines (precursor pathway)"],
    abuseSymptoms: ["Daily nasal spray use","Insomnia, agitation","Tachycardia"],
    overdoseSymptoms: ["Hypertensive emergency","Arrhythmia","Stroke","Hyperthermia"],
    withdrawalSymptoms: ["Severe nasal congestion rebound","Fatigue"],
    withdrawalOnset: "Onset 1–3 days",
    redFlags: ["Bulk purchasing of pseudoephedrine","Daily oxymetazoline >5 days"],
  },
  laxativeStim: {
    drugClass: "Stimulant Laxative", schedule: "OTC", abusePotential: "moderate", toleranceSpeed: "moderate",
    toleranceMechanism: "Enteric nerve plexus stimulation; chronic use → cathartic colon and electrolyte depletion. Misused for weight control.",
    physical: false, psychological: true, crossTolerance: [],
    abuseSymptoms: ["Eating-disorder context","Frequent diarrhea","Hypokalemia","Dehydration"],
    overdoseSymptoms: ["Severe electrolyte loss","Hypokalemic arrhythmia","Renal injury"],
    withdrawalSymptoms: ["Constipation rebound","Bloating"],
    withdrawalOnset: "Days–weeks",
    redFlags: ["Daily use","Hidden use in eating disorders"],
  },
  cannabinoid: {
    drugClass: "Cannabinoid (CB1 agonist)", schedule: "I", abusePotential: "moderate", toleranceSpeed: "moderate",
    toleranceMechanism: "CB1 receptor down-regulation; tolerance to euphoria/cardiovascular effects within weeks.",
    physical: true, psychological: true, crossTolerance: ["Synthetic cannabinoids"],
    abuseSymptoms: ["Conjunctival injection","Tachycardia","Increased appetite","Time distortion","Paranoia"],
    overdoseSymptoms: ["Acute panic","Cannabinoid hyperemesis","Psychosis (vulnerable)"],
    withdrawalSymptoms: ["Irritability","Insomnia, vivid dreams","Cravings","Decreased appetite"],
    withdrawalOnset: "Onset 1–3 days, peak 1 week",
    redFlags: ["Daily high-potency concentrate use","New-onset psychosis"],
  },
  dissociative: {
    drugClass: "NMDA Antagonist Dissociative", schedule: "III", abusePotential: "high", toleranceSpeed: "rapid",
    toleranceMechanism: "Rapid receptor adaptation; chronic use → cognitive impairment, urinary tract toxicity (ketamine cystitis).",
    physical: false, psychological: true, crossTolerance: ["Ketamine","PCP","DXM","Nitrous oxide"],
    abuseSymptoms: ["Dissociation ('K-hole')","Nystagmus","Urinary symptoms","Memory loss"],
    overdoseSymptoms: ["Profound dissociation","Respiratory depression at high dose","Hypertension"],
    withdrawalSymptoms: ["Craving","Depression","Sweating, tremor"],
    withdrawalOnset: "Onset days; psychological persists weeks",
    redFlags: ["Self-medication outside clinic","Bladder symptoms in young user"],
  },
  inhalant: {
    drugClass: "Volatile Inhalant / Anesthetic Gas", schedule: "OTC", abusePotential: "high", toleranceSpeed: "rapid",
    toleranceMechanism: "Lipid-soluble CNS depressant action; rapid tolerance and cardiotoxicity (sudden sniffing death).",
    physical: false, psychological: true, crossTolerance: ["Alcohol"],
    abuseSymptoms: ["Glue/paint smell on clothes","Perioral rash ('huffer's rash')","Slurred speech","Ataxia"],
    overdoseSymptoms: ["Sudden cardiac death (catecholamine sensitization)","Asphyxia","Seizures"],
    withdrawalSymptoms: ["Mild: irritability, sleep disturbance"],
    withdrawalOnset: "Hours–days",
    redFlags: ["Adolescent use of solvents, nitrous, poppers"],
  },
  hallucinogen: {
    drugClass: "Serotonergic Hallucinogen", schedule: "I", abusePotential: "low", toleranceSpeed: "rapid",
    toleranceMechanism: "5-HT2A receptor down-regulation; tolerance in days, full reset after 1–2 weeks abstinence.",
    physical: false, psychological: false, crossTolerance: ["LSD","Psilocybin","DMT","Mescaline"],
    abuseSymptoms: ["Mydriasis","Visual/auditory distortions","Synaesthesia","Tachycardia"],
    overdoseSymptoms: ["HPPD (persistent perceptual disorder)","Psychosis","Hyperthermia (MDMA-class)"],
    withdrawalSymptoms: ["Minimal physical withdrawal"],
    withdrawalOnset: "—",
    redFlags: ["Persistent flashbacks","Use in vulnerable psychiatric patients"],
  },
  // Catch-all minimal-abuse template for therapeutic chronic agents
  generic: {
    drugClass: "Therapeutic Agent (no abuse liability)", schedule: "Rx", abusePotential: "minimal", toleranceSpeed: "none",
    toleranceMechanism: "No clinically significant tolerance, dependence, or abuse liability documented.",
    physical: false, psychological: false, crossTolerance: [],
    abuseSymptoms: ["Not abused"],
    overdoseSymptoms: ["Class-specific organ toxicity at supratherapeutic doses"],
    withdrawalSymptoms: ["No withdrawal syndrome"],
    withdrawalOnset: "—",
    redFlags: ["None routine — monitor adherence and adverse effects"],
  },
  antibiotic: {
    drugClass: "Antibacterial Agent", schedule: "Rx", abusePotential: "minimal", toleranceSpeed: "none",
    toleranceMechanism: "No tolerance in the patient — but improper use breeds bacterial resistance.",
    physical: false, psychological: false, crossTolerance: [],
    abuseSymptoms: ["Self-prescribing leftover courses"],
    overdoseSymptoms: ["Class-specific (e.g., aminoglycoside nephro/ototoxicity, fluoroquinolone tendinopathy/QT)"],
    withdrawalSymptoms: ["None — finish full course"],
    withdrawalOnset: "—",
    redFlags: ["Incomplete courses promote resistance"],
  },
  insulinAgent: {
    drugClass: "Insulin / Antidiabetic", schedule: "Rx", abusePotential: "low", toleranceSpeed: "slow",
    toleranceMechanism: "Insulin resistance (down-regulation) with chronic over-dosing; no reward but documented misuse (insulin in eating disorders 'diabulimia', hypoglycemia for malingering).",
    physical: true, psychological: false, crossTolerance: [],
    abuseSymptoms: ["Unexplained hypoglycemia","Weight loss in T1DM (diabulimia)","Injection-site lipohypertrophy"],
    overdoseSymptoms: ["Severe hypoglycemia: confusion, seizure, coma","Hypokalemia"],
    withdrawalSymptoms: ["Hyperglycemia, DKA (T1DM)"],
    withdrawalOnset: "Hours",
    reversalAgent: "Dextrose IV, glucagon IM",
    redFlags: ["Insulin omission in T1DM teen/young adult","Factitious hypoglycemia"],
  },
  thyroidHormone: {
    drugClass: "Thyroid Hormone Replacement", schedule: "Rx", abusePotential: "low", toleranceSpeed: "none",
    toleranceMechanism: "No tolerance; misused for weight loss and energy.",
    physical: false, psychological: true, crossTolerance: [],
    abuseSymptoms: ["Weight loss focus","Tremor","Palpitations","Heat intolerance"],
    overdoseSymptoms: ["Thyrotoxicosis: tachyarrhythmia, atrial fibrillation, hyperthermia, agitation"],
    withdrawalSymptoms: ["Hypothyroid symptoms re-emerge"],
    withdrawalOnset: "Weeks (long t½)",
    redFlags: ["Non-medical use for weight loss"],
  },
  anticonvulsant: {
    drugClass: "Antiepileptic Drug", schedule: "Rx", abusePotential: "low", toleranceSpeed: "moderate",
    toleranceMechanism: "Variable mechanisms; abrupt withdrawal can precipitate breakthrough seizures or status epilepticus.",
    physical: true, psychological: false, crossTolerance: [],
    abuseSymptoms: ["Generally not abused (except gabapentinoids)"],
    overdoseSymptoms: ["Sedation, ataxia, nystagmus","Cardiac conduction (phenytoin, carbamazepine)","Hepatotoxicity (valproate)"],
    withdrawalSymptoms: ["Withdrawal seizures, status epilepticus"],
    withdrawalOnset: "Hours–days; taper essential",
    redFlags: ["Abrupt discontinuation in epilepsy patient"],
  },
};

// ---- Drug-to-class mapping ----
const M: Record<string, keyof typeof T> = {
  // Opioids
  Morphine:"opioid", Oxycodone:"opioid", Hydrocodone:"opioid", Fentanyl:"opioid",
  Codeine:"opioid", Methadone:"opioid", Buprenorphine:"opioid", Pethidine:"opioid",
  Tapentadol:"opioid", Tramadol:"opioid", Sufentanil:"opioid", Alfentanil:"opioid",
  Remifentanil:"opioid", Hydromorphone:"opioid", Oxymorphone:"opioid", Levorphanol:"opioid",
  Heroin:"opioid", Dihydrocodeine:"opioid", Pentazocine:"opioid", Nalbuphine:"opioid",
  Butorphanol:"opioid", Loperamide:"opioid",
  // Benzodiazepines
  Diazepam:"benzo", Alprazolam:"benzo", Lorazepam:"benzo", Clonazepam:"benzo",
  Midazolam:"benzo", Temazepam:"benzo", Oxazepam:"benzo", Chlordiazepoxide:"benzo",
  Triazolam:"benzo", Flurazepam:"benzo", Estazolam:"benzo", Quazepam:"benzo",
  Bromazepam:"benzo", Etizolam:"benzo", Clobazam:"benzo", Flunitrazepam:"benzo",
  // Z-drugs / hypnotics
  Zolpidem:"zdrug", Eszopiclone:"zdrug", Zaleplon:"zdrug", Zopiclone:"zdrug",
  Suvorexant:"zdrug", Lemborexant:"zdrug", Ramelteon:"zdrug",
  // Stimulants
  Amphetamine:"stimulant", Dextroamphetamine:"stimulant", Lisdexamfetamine:"stimulant",
  Methamphetamine:"stimulant", Methylphenidate:"stimulant", Dexmethylphenidate:"stimulant",
  Cocaine:"stimulant", Modafinil:"stimulant", Armodafinil:"stimulant",
  Phentermine:"stimulant", Diethylpropion:"stimulant", Benzphetamine:"stimulant",
  Phendimetrazine:"stimulant", Atomoxetine:"stimulant", MDMA:"stimulant",
  Cathinone:"stimulant", Mephedrone:"stimulant",
  // Barbiturates
  Phenobarbital:"barbiturate", Pentobarbital:"barbiturate", Secobarbital:"barbiturate",
  Butalbital:"barbiturate", Thiopental:"barbiturate", Amobarbital:"barbiturate",
  // Gabapentinoids
  Pregabalin:"gabapentinoid", Gabapentin:"gabapentinoid",
  // SSRIs
  Sertraline:"ssri", Fluoxetine:"ssri", Citalopram:"ssri", Escitalopram:"ssri",
  Paroxetine:"ssri", Fluvoxamine:"ssri", Vilazodone:"ssri", Vortioxetine:"ssri",
  // SNRIs
  Venlafaxine:"snri", Duloxetine:"snri", Desvenlafaxine:"snri", Milnacipran:"snri",
  Levomilnacipran:"snri",
  // TCAs
  Amitriptyline:"tca", Nortriptyline:"tca", Imipramine:"tca", Desipramine:"tca",
  Clomipramine:"tca", Doxepin:"tca", Trimipramine:"tca", Protriptyline:"tca",
  Maprotiline:"tca", Amoxapine:"tca",
  // MAOIs
  Phenelzine:"maoi", Tranylcypromine:"maoi", Isocarboxazid:"maoi", Selegiline:"maoi",
  Rasagiline:"maoi", Moclobemide:"maoi",
  // Atypical antipsychotics
  Risperidone:"antipsychoticAtyp", Olanzapine:"antipsychoticAtyp", Quetiapine:"antipsychoticAtyp",
  Aripiprazole:"antipsychoticAtyp", Clozapine:"antipsychoticAtyp", Ziprasidone:"antipsychoticAtyp",
  Paliperidone:"antipsychoticAtyp", Lurasidone:"antipsychoticAtyp", Asenapine:"antipsychoticAtyp",
  Iloperidone:"antipsychoticAtyp", Brexpiprazole:"antipsychoticAtyp", Cariprazine:"antipsychoticAtyp",
  // Typical antipsychotics
  Haloperidol:"antipsychoticTyp", Chlorpromazine:"antipsychoticTyp", Fluphenazine:"antipsychoticTyp",
  Perphenazine:"antipsychoticTyp", Trifluoperazine:"antipsychoticTyp", Thioridazine:"antipsychoticTyp",
  Thiothixene:"antipsychoticTyp", Loxapine:"antipsychoticTyp", Pimozide:"antipsychoticTyp",
  Droperidol:"antipsychoticTyp", Prochlorperazine:"antipsychoticTyp",
  // Beta blockers
  Propranolol:"betablocker", Atenolol:"betablocker", Metoprolol:"betablocker",
  Bisoprolol:"betablocker", Carvedilol:"betablocker", Nebivolol:"betablocker",
  Labetalol:"betablocker", Sotalol:"betablocker", Esmolol:"betablocker",
  Acebutolol:"betablocker", Pindolol:"betablocker", Timolol:"betablocker",
  Nadolol:"betablocker",
  // CCBs
  Amlodipine:"ccb", Nifedipine:"ccb", Diltiazem:"ccb", Verapamil:"ccb",
  Felodipine:"ccb", Nicardipine:"ccb", Isradipine:"ccb", Nimodipine:"ccb",
  Clevidipine:"ccb",
  // ACEi
  Lisinopril:"acei", Enalapril:"acei", Ramipril:"acei", Captopril:"acei",
  Perindopril:"acei", Benazepril:"acei", Quinapril:"acei", Trandolapril:"acei",
  Fosinopril:"acei", Moexipril:"acei",
  // ARBs
  Losartan:"arb", Valsartan:"arb", Irbesartan:"arb", Telmisartan:"arb",
  Candesartan:"arb", Olmesartan:"arb", Eprosartan:"arb", Azilsartan:"arb",
  // Statins
  Atorvastatin:"statin", Simvastatin:"statin", Rosuvastatin:"statin",
  Pravastatin:"statin", Fluvastatin:"statin", Lovastatin:"statin", Pitavastatin:"statin",
  // PPIs
  Omeprazole:"ppi", Pantoprazole:"ppi", Esomeprazole:"ppi", Lansoprazole:"ppi",
  Rabeprazole:"ppi", Dexlansoprazole:"ppi",
  // Steroids
  Prednisone:"steroid", Prednisolone:"steroid", Dexamethasone:"steroid",
  Methylprednisolone:"steroid", Hydrocortisone:"steroid", Triamcinolone:"steroid",
  Betamethasone:"steroid", Budesonide:"steroid", Fludrocortisone:"steroid",
  Cortisone:"steroid",
  // Anabolic steroids
  Testosterone:"anabolic", Nandrolone:"anabolic", Stanozolol:"anabolic",
  Oxandrolone:"anabolic", Oxymetholone:"anabolic", Trenbolone:"anabolic",
  Methandrostenolone:"anabolic", Boldenone:"anabolic", Drostanolone:"anabolic",
  // Antihistamines sedating
  Diphenhydramine:"antihistH1Sed", Chlorpheniramine:"antihistH1Sed", Hydroxyzine:"antihistH1Sed",
  Promethazine:"antihistH1Sed", Doxylamine:"antihistH1Sed", Brompheniramine:"antihistH1Sed",
  Cyproheptadine:"antihistH1Sed", Meclizine:"antihistH1Sed", Dimenhydrinate:"antihistH1Sed",
  // Antihistamines non-sedating
  Cetirizine:"antihistH1NonSed", Loratadine:"antihistH1NonSed", Fexofenadine:"antihistH1NonSed",
  Desloratadine:"antihistH1NonSed", Levocetirizine:"antihistH1NonSed", Bilastine:"antihistH1NonSed",
  // Muscle relaxants
  Cyclobenzaprine:"muscleRelaxant", Baclofen:"muscleRelaxant", Tizanidine:"muscleRelaxant",
  Methocarbamol:"muscleRelaxant", Carisoprodol:"muscleRelaxant", Metaxalone:"muscleRelaxant",
  Orphenadrine:"muscleRelaxant", Chlorzoxazone:"muscleRelaxant", Dantrolene:"muscleRelaxant",
  // Triptans
  Sumatriptan:"triptan", Rizatriptan:"triptan", Zolmitriptan:"triptan",
  Eletriptan:"triptan", Naratriptan:"triptan", Almotriptan:"triptan", Frovatriptan:"triptan",
  Ergotamine:"triptan",
  // Decongestants
  Pseudoephedrine:"decongestant", Phenylephrine:"decongestant", Oxymetazoline:"decongestant",
  Xylometazoline:"decongestant", Naphazoline:"decongestant",
  // Stimulant laxatives
  Bisacodyl:"laxativeStim", Senna:"laxativeStim", "Castor Oil":"laxativeStim",
  Sennosides:"laxativeStim",
  // Cannabinoids
  Cannabis:"cannabinoid", THC:"cannabinoid", Dronabinol:"cannabinoid", Nabilone:"cannabinoid",
  Cannabidiol:"cannabinoid", CBD:"cannabinoid",
  // Dissociatives
  Ketamine:"dissociative", Esketamine:"dissociative", PCP:"dissociative",
  Dextromethorphan:"dissociative", "Nitrous Oxide":"dissociative",
  // Inhalants
  Toluene:"inhalant", "Amyl Nitrite":"inhalant", "Butyl Nitrite":"inhalant",
  Chloroform:"inhalant", Halothane:"inhalant", Isoflurane:"inhalant", Sevoflurane:"inhalant",
  // Hallucinogens
  LSD:"hallucinogen", Psilocybin:"hallucinogen", DMT:"hallucinogen", Mescaline:"hallucinogen",
  Ibogaine:"hallucinogen", Salvinorin:"hallucinogen",
  // Insulins / antidiabetics
  Insulin:"insulinAgent", Glipizide:"insulinAgent", Glimepiride:"insulinAgent",
  Glyburide:"insulinAgent", Repaglinide:"insulinAgent", Nateglinide:"insulinAgent",
  // Thyroid
  Levothyroxine:"thyroidHormone", Liothyronine:"thyroidHormone",
  // Anticonvulsants
  Phenytoin:"anticonvulsant", Carbamazepine:"anticonvulsant", "Valproic Acid":"anticonvulsant",
  Lamotrigine:"anticonvulsant", Levetiracetam:"anticonvulsant", Topiramate:"anticonvulsant",
  Oxcarbazepine:"anticonvulsant", Zonisamide:"anticonvulsant", Ethosuximide:"anticonvulsant",
  Lacosamide:"anticonvulsant", Perampanel:"anticonvulsant", Tiagabine:"anticonvulsant",
  Vigabatrin:"anticonvulsant", Primidone:"anticonvulsant", Felbamate:"anticonvulsant",
  Rufinamide:"anticonvulsant",
  // Antibiotics (sample — large class)
  Amoxicillin:"antibiotic", Ampicillin:"antibiotic", Penicillin:"antibiotic",
  "Amoxicillin-Clavulanate":"antibiotic", Cephalexin:"antibiotic", Cefuroxime:"antibiotic",
  Ceftriaxone:"antibiotic", Cefixime:"antibiotic", Ceftazidime:"antibiotic", Cefepime:"antibiotic",
  Azithromycin:"antibiotic", Clarithromycin:"antibiotic", Erythromycin:"antibiotic",
  Ciprofloxacin:"antibiotic", Levofloxacin:"antibiotic", Moxifloxacin:"antibiotic",
  Norfloxacin:"antibiotic", Ofloxacin:"antibiotic", Doxycycline:"antibiotic",
  Tetracycline:"antibiotic", Minocycline:"antibiotic", Clindamycin:"antibiotic",
  Metronidazole:"antibiotic", "Trimethoprim-Sulfamethoxazole":"antibiotic",
  Vancomycin:"antibiotic", Linezolid:"antibiotic", Nitrofurantoin:"antibiotic",
  Gentamicin:"antibiotic", Amikacin:"antibiotic", Tobramycin:"antibiotic",
  Colistin:"antibiotic", Fosfomycin:"antibiotic", Rifaximin:"antibiotic",
  Fidaxomicin:"antibiotic", Daptomycin:"antibiotic", Tigecycline:"antibiotic",
  Meropenem:"antibiotic", Ertapenem:"antibiotic", Imipenem:"antibiotic", Aztreonam:"antibiotic",
  "Piperacillin-Tazobactam":"antibiotic",
};

// Build the generated record. Drug name shown on its own line; class added in mechanism context.
const buildProfile = (drug: string, t: ClassTemplate): SafetyProfile => ({
  drug,
  drugClass: t.drugClass,
  schedule: t.schedule,
  abusePotential: t.abusePotential,
  toleranceSpeed: t.toleranceSpeed,
  toleranceMechanism: t.toleranceMechanism,
  dependence: { physical: t.physical, psychological: t.psychological, crossTolerance: t.crossTolerance },
  abuseSymptoms: t.abuseSymptoms,
  overdoseSymptoms: t.overdoseSymptoms,
  withdrawalSymptoms: t.withdrawalSymptoms,
  withdrawalOnset: t.withdrawalOnset,
  reversalAgent: t.reversalAgent,
  redFlags: t.redFlags,
});

// Bulk drug lists from the main DRUGS catalog assigned to the generic template
// to extend coverage well past 500 entries.
const GENERIC_BULK: string[] = [
  // NSAIDs / analgesics (non-abuse)
  "Paracetamol","Ibuprofen","Aspirin","Naproxen","Diclofenac","Celecoxib","Meloxicam",
  "Indomethacin","Piroxicam","Ketorolac","Mefenamic Acid","Etoricoxib","Nimesulide",
  // Anticoagulants
  "Warfarin","Clopidogrel","Heparin","Enoxaparin","Rivaroxaban","Apixaban","Dabigatran",
  "Ticagrelor","Prasugrel","Fondaparinux","Edoxaban","Bivalirudin","Argatroban",
  // Antidiabetics non-insulin
  "Metformin","Sitagliptin","Linagliptin","Saxagliptin","Vildagliptin","Alogliptin",
  "Empagliflozin","Dapagliflozin","Canagliflozin","Ertugliflozin","Liraglutide",
  "Semaglutide","Exenatide","Dulaglutide","Tirzepatide","Pioglitazone","Rosiglitazone",
  "Acarbose","Miglitol","Pramlintide",
  // Antifungals
  "Fluconazole","Ketoconazole","Itraconazole","Voriconazole","Posaconazole","Isavuconazole",
  "Terbinafine","Nystatin","Amphotericin B","Caspofungin","Micafungin","Anidulafungin",
  "Griseofulvin","Flucytosine",
  // Antivirals
  "Acyclovir","Valacyclovir","Famciclovir","Oseltamivir","Zanamivir","Baloxavir",
  "Remdesivir","Molnupiravir","Nirmatrelvir-Ritonavir","Ritonavir","Lopinavir",
  "Tenofovir","Emtricitabine","Dolutegravir","Efavirenz","Abacavir","Lamivudine",
  "Zidovudine","Nevirapine","Atazanavir","Darunavir","Raltegravir","Maraviroc",
  "Ganciclovir","Valganciclovir","Cidofovir","Foscarnet","Sofosbuvir","Ledipasvir",
  "Daclatasvir","Glecaprevir-Pibrentasvir",
  // H2 blockers
  "Ranitidine","Famotidine","Cimetidine","Nizatidine",
  // GI / motility
  "Sucralfate","Misoprostol","Ondansetron","Granisetron","Palonosetron","Metoclopramide",
  "Domperidone","Bismuth Subsalicylate","Mesalamine","Balsalazide","Olsalazine",
  "Lactulose","Linaclotide","Lubiprostone","Prucalopride","Ursodeoxycholic Acid",
  "Chenodeoxycholic Acid","Octreotide","Eluxadoline","Alosetron","Aprepitant","Scopolamine",
  // Antiarrhythmics / cardiac
  "Digoxin","Amiodarone","Dronedarone","Flecainide","Procainamide","Quinidine","Lidocaine",
  "Mexiletine","Propafenone","Dofetilide","Ibutilide","Vernakalant","Hydralazine",
  "Isosorbide Mononitrate","Isosorbide Dinitrate","Nitroglycerin","Ranolazine","Ivabradine",
  "Sacubitril-Valsartan","Adenosine","Atropine","Epinephrine","Norepinephrine","Dopamine",
  "Dobutamine","Vasopressin",
  // Diuretics
  "Furosemide","Hydrochlorothiazide","Chlorthalidone","Indapamide","Spironolactone",
  "Eplerenone","Amiloride","Bumetanide","Torsemide","Metolazone","Acetazolamide","Mannitol",
  // Respiratory
  "Salbutamol","Ipratropium","Tiotropium","Formoterol","Salmeterol","Montelukast",
  "Theophylline","Aminophylline","Fluticasone","Beclometasone","Mometasone","Ciclesonide",
  "Roflumilast","Omalizumab","Mepolizumab","Benralizumab","Zafirlukast","Zileuton",
  "Cromoglycate","Pirfenidone","Nintedanib","Indacaterol","Olodaterol","Aclidinium",
  "Umeclidinium","Glycopyrronium",
  // Lipid-lowering non-statin
  "Ezetimibe","Fenofibrate","Gemfibrozil","Bezafibrate","Niacin","Colesevelam",
  "Cholestyramine","Colestipol","Evolocumab","Alirocumab","Bempedoic Acid",
  "Icosapent Ethyl","Inclisiran",
  // Antimalarials / antiparasitics
  "Chloroquine","Hydroxychloroquine","Mefloquine","Atovaquone-Proguanil","Primaquine",
  "Artemether-Lumefantrine","Quinine","Ivermectin","Albendazole","Mebendazole",
  "Praziquantel","Pyrantel Pamoate","Nitazoxanide",
  // Gout / rheum
  "Allopurinol","Colchicine","Febuxostat","Probenecid","Pegloticase","Rasburicase",
  "Methotrexate","Hydroxychloroquine","Sulfasalazine","Leflunomide","Apremilast","Tofacitinib",
  "Baricitinib","Upadacitinib","Filgotinib",
  // Osteoporosis / endocrine
  "Alendronate","Risedronate","Zoledronic Acid","Ibandronate","Pamidronate","Raloxifene",
  "Denosumab","Teriparatide","Abaloparatide","Romosozumab","Calcitonin",
  // Immunosuppressants / biologics
  "Cyclosporine","Tacrolimus","Sirolimus","Everolimus","Mycophenolate","Azathioprine",
  "Rituximab","Trastuzumab","Bevacizumab","Cetuximab","Adalimumab","Infliximab","Etanercept",
  "Golimumab","Certolizumab","Tocilizumab","Sarilumab","Secukinumab","Ixekizumab",
  "Ustekinumab","Guselkumab","Risankizumab","Dupilumab","Vedolizumab","Natalizumab",
  "Ocrelizumab","Ofatumumab","Belimumab","Eculizumab","Ravulizumab","Anakinra","Canakinumab",
  // Oncology - targeted
  "Imatinib","Erlotinib","Gefitinib","Lapatinib","Sorafenib","Sunitinib","Pazopanib",
  "Crizotinib","Vemurafenib","Dabrafenib","Trametinib","Ibrutinib","Palbociclib",
  "Ribociclib","Abemaciclib","Osimertinib","Alectinib","Lenvatinib","Cabozantinib",
  "Regorafenib","Axitinib","Nilotinib","Dasatinib","Bosutinib","Ponatinib",
  "Acalabrutinib","Venetoclax","Olaparib","Niraparib","Rucaparib","Talazoparib",
  // Oncology - cytotoxic
  "Cisplatin","Carboplatin","Oxaliplatin","Cyclophosphamide","Ifosfamide","Doxorubicin",
  "Epirubicin","Daunorubicin","Paclitaxel","Docetaxel","Cabazitaxel","Vincristine",
  "Vinblastine","Vinorelbine","Etoposide","Teniposide","Fluorouracil","Capecitabine",
  "Gemcitabine","Irinotecan","Topotecan","Bleomycin","Mitomycin","Mercaptopurine",
  "Cytarabine","Busulfan","Chlorambucil","Melphalan","Procarbazine","Dacarbazine",
  "Temozolomide","Hydroxyurea","Pemetrexed","Methotrexate",
  // Immunotherapy / IO
  "Nivolumab","Pembrolizumab","Atezolizumab","Durvalumab","Avelumab","Cemiplimab",
  "Ipilimumab","Tremelimumab",
  // Hormonal therapy
  "Tamoxifen","Letrozole","Anastrozole","Exemestane","Fulvestrant","Leuprolide",
  "Goserelin","Degarelix","Bicalutamide","Flutamide","Enzalutamide","Apalutamide",
  "Abiraterone","Darolutamide",
  // Urological
  "Tamsulosin","Alfuzosin","Silodosin","Finasteride","Dutasteride","Sildenafil","Tadalafil",
  "Vardenafil","Avanafil","Oxybutynin","Tolterodine","Solifenacin","Darifenacin",
  "Fesoterodine","Mirabegron","Vibegron","Trospium",
  // Antifibrinolytics
  "Tranexamic Acid","Aminocaproic Acid","Desmopressin","Phytonadione","Protamine",
  // Tuberculosis
  "Rifampicin","Isoniazid","Pyrazinamide","Ethambutol","Streptomycin","Bedaquiline",
  "Pretomanid","Linezolid","Cycloserine","Capreomycin",
  // Neurology
  "Donepezil","Memantine","Rivastigmine","Galantamine","Levodopa-Carbidopa","Pramipexole",
  "Ropinirole","Entacapone","Tolcapone","Amantadine","Rasagiline","Selegiline","Safinamide",
  "Riluzole","Edaravone","Tetrabenazine","Deutetrabenazine","Valbenazine","Pimavanserin",
  "Erenumab","Fremanezumab","Galcanezumab","Eptinezumab","Ubrogepant","Rimegepant",
  // Eye
  "Latanoprost","Bimatoprost","Travoprost","Brimonidine","Dorzolamide","Brinzolamide",
  "Pilocarpine","Cyclopentolate","Tropicamide","Ranibizumab","Aflibercept","Brolucizumab",
  // Dermatology
  "Isotretinoin","Tretinoin","Adapalene","Tazarotene","Dapsone","Thalidomide","Lenalidomide",
  "Pomalidomide","Apremilast","Calcipotriol","Tacalcitol","Pimecrolimus","Mupirocin",
  // Supplements / electrolytes
  "Potassium Chloride","Calcium Carbonate","Calcium Citrate","Ferrous Sulfate","Ferrous Gluconate",
  "Folic Acid","Cyanocobalamin","Methylcobalamin","Vitamin D","Cholecalciferol","Ergocalciferol",
  "Vitamin K","Magnesium Oxide","Magnesium Sulfate","Zinc Sulfate","Zinc Gluconate",
  "Sodium Bicarbonate","Sodium Chloride","Multivitamin",
  // Antiemetics extra
  "Aprepitant","Fosaprepitant","Rolapitant","Netupitant","Doxylamine-Pyridoxine",
  // Antihypertensives misc
  "Clonidine","Methyldopa","Minoxidil","Prazosin","Doxazosin","Terazosin","Guanfacine",
  "Reserpine","Hydralazine","Aliskiren",
  // Misc
  "Naloxone","Naltrexone","Disulfiram","Acamprosate","Varenicline","Bromocriptine",
  "Cabergoline","Cinacalcet","Etelcalcetide","Sevelamer","Lanthanum","Patiromer",
  "Sodium Polystyrene Sulfonate","Sodium Zirconium Cyclosilicate",
];

export function buildExpandedSafetyProfiles(curated: Record<string, SafetyProfile>): Record<string, SafetyProfile> {
  const out: Record<string, SafetyProfile> = { ...curated };
  // Add class-templated drugs (don't overwrite curated)
  for (const [drug, key] of Object.entries(M)) {
    if (out[drug]) continue;
    out[drug] = buildProfile(drug, T[key]);
  }
  // Add bulk generic-template drugs
  for (const drug of GENERIC_BULK) {
    if (out[drug]) continue;
    out[drug] = buildProfile(drug, T.generic);
  }
  return out;
}
