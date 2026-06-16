import { useState, useRef, useEffect } from "react";
import { DRUGS } from "@/lib/drugInteractions";
import { Search, ChevronDown } from "lucide-react";

interface DrugSelectProps {
  label: string;
  value: string;
  onChange: (drug: string) => void;
  icon: React.ReactNode;
}

const DrugSelect = ({ label, value, onChange, icon }: DrugSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = DRUGS.filter(d =>
    d.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full card-elevated px-4 py-3 text-left flex items-center justify-between gap-2 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <span className={value ? "text-foreground font-medium" : "text-muted-foreground"}>
          {value || "Select a drug..."}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full card-elevated overflow-hidden animate-fade-in-up">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search drugs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-secondary rounded-md border-none outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">No drugs found</div>
            ) : (
              filtered.map(drug => (
                <button
                  key={drug}
                  type="button"
                  onClick={() => { onChange(drug); setOpen(false); setSearch(""); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                    value === drug ? "bg-accent text-accent-foreground font-medium" : "text-foreground"
                  }`}
                >
                  {drug}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugSelect;
