import { type DrugCategory } from "@/lib/drugInteractions";

interface Props {
  drugName: string;
  categories: DrugCategory[];
}

const CATEGORY_STYLES: Record<string, string> = {
  "CYP3A4 Inhibitor": "bg-destructive/10 text-destructive",
  "CYP2D6 Inhibitor": "bg-destructive/10 text-destructive",
  "CYP Inducer": "bg-warning/15 text-warning",
  "HMG-CoA Reductase Inhibitor (Statin)": "bg-primary/10 text-primary",
  "NSAID": "bg-warning/15 text-warning",
  "Opioid Analgesic": "bg-severe/10 text-severe",
  "Anticoagulant": "bg-severe/10 text-severe",
  "Antiplatelet": "bg-severe/10 text-severe",
  "QT Prolonger": "bg-destructive/10 text-destructive",
  "CNS Depressant": "bg-warning/15 text-warning",
  "Serotonergic Agent": "bg-accent text-accent-foreground",
  "Potassium-Sparing Agent": "bg-primary/10 text-primary",
  "Potassium-Wasting Diuretic": "bg-primary/10 text-primary",
  "Beta-Adrenergic Blocker": "bg-primary/10 text-primary",
  "Calcium Channel Blocker": "bg-primary/10 text-primary",
  "ACE Inhibitor": "bg-primary/10 text-primary",
  "ARB (Angiotensin II Blocker)": "bg-primary/10 text-primary",
  "SSRI (Antidepressant)": "bg-accent text-accent-foreground",
  "SNRI (Antidepressant)": "bg-accent text-accent-foreground",
  "Tricyclic Antidepressant": "bg-accent text-accent-foreground",
  "Benzodiazepine (Anxiolytic)": "bg-warning/15 text-warning",
  "Corticosteroid (Anti-inflammatory)": "bg-primary/10 text-primary",
  "Proton Pump Inhibitor": "bg-secondary text-secondary-foreground",
  "Aminoglycoside Antibiotic": "bg-destructive/10 text-destructive",
  "Antipsychotic": "bg-warning/15 text-warning",
  "Azole Antifungal": "bg-destructive/10 text-destructive",
  "Biguanide (Antidiabetic)": "bg-success/10 text-success",
  "Sulfonylurea (Hypoglycemic)": "bg-warning/15 text-warning",
  "SGLT2 Inhibitor": "bg-success/10 text-success",
  "GLP-1 Receptor Agonist": "bg-success/10 text-success",
  "Nitrate (Vasodilator)": "bg-severe/10 text-severe",
  "PDE5 Inhibitor": "bg-primary/10 text-primary",
  "Loop Diuretic": "bg-primary/10 text-primary",
  "Thiazide Diuretic": "bg-primary/10 text-primary",
  "Macrolide Antibiotic": "bg-destructive/10 text-destructive",
  "Fluoroquinolone Antibiotic": "bg-destructive/10 text-destructive",
  "Tetracycline Antibiotic": "bg-warning/15 text-warning",
  "Thyroid Hormone": "bg-secondary text-secondary-foreground",
  "Antithyroid Agent": "bg-secondary text-secondary-foreground",
  "Immunosuppressant": "bg-severe/10 text-severe",
  "Xanthine Derivative": "bg-warning/15 text-warning",
  "Antihistamine": "bg-secondary text-secondary-foreground",
  "Muscle Relaxant": "bg-warning/15 text-warning",
  "Triptan (Antimigraine)": "bg-accent text-accent-foreground",
  "Antitubercular Agent": "bg-destructive/10 text-destructive",
  "Antiretroviral": "bg-destructive/10 text-destructive",
  "Antiepileptic": "bg-warning/15 text-warning",
  "CYP2C19 Substrate": "bg-destructive/10 text-destructive",
  "CYP2C9 Substrate": "bg-destructive/10 text-destructive",
  "CYP1A2 Substrate": "bg-destructive/10 text-destructive",
  "Tyrosine Kinase Inhibitor": "bg-severe/10 text-severe",
  "Alkylating Agent": "bg-severe/10 text-severe",
  "Antimetabolite": "bg-severe/10 text-severe",
  "DPP-4 Inhibitor": "bg-success/10 text-success",
  "Carbapenem Antibiotic": "bg-destructive/10 text-destructive",
  "Other": "bg-muted text-muted-foreground",
};

const DrugCategoryBadges = ({ drugName, categories }: Props) => {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <span className="text-xs font-semibold text-foreground">{drugName}</span>
      <div className="flex flex-wrap gap-1">
        {categories.map(cat => (
          <span
            key={cat}
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${CATEGORY_STYLES[cat] || CATEGORY_STYLES["Other"]}`}
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DrugCategoryBadges;