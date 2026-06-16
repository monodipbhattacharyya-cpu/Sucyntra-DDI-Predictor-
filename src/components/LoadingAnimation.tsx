import { Database, Dna, Activity, Shield } from "lucide-react";

const stages = [
  { icon: Database, label: "Querying Clinical Rules Engine", color: "text-primary" },
  { icon: Dna, label: "Pharmacogenomic Cross-Reference", color: "text-success" },
  { icon: Activity, label: "CYP450 Pathway Mapping", color: "text-warning" },
  { icon: Shield, label: "Evidence-Based Safety Check", color: "text-severe" },
];

const LoadingAnimation = () => (
  <div className="card-elevated p-8 flex flex-col items-center justify-center gap-6 animate-fade-in-up relative overflow-hidden">
    <div className="absolute inset-0 shimmer" />

    <div className="relative">
      <div className="w-20 h-20 rounded-2xl hero-gradient flex items-center justify-center shadow-lg relative">
        <Database className="w-10 h-10 text-primary-foreground animate-pulse" />
        <div className="absolute inset-[-8px] animate-spin" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-success shadow-sm" />
        </div>
        <div className="absolute inset-[-12px] animate-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-warning shadow-sm" />
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-2 w-full max-w-xs">
      {stages.map((stage, i) => (
        <div
          key={stage.label}
          className="flex items-center gap-3 animate-fade-in-up"
          style={{ animationDelay: `${i * 0.3}s`, animationFillMode: 'both' }}
        >
          <stage.icon className={`w-4 h-4 ${stage.color} animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }} />
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground/70">{stage.label}</p>
            <div className="h-1 bg-secondary rounded-full mt-1 overflow-hidden">
              <div
                className="h-full hero-gradient rounded-full"
                style={{
                  animation: `shimmer 1.5s ease-in-out ${i * 0.3}s infinite`,
                  width: '100%',
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-muted-foreground font-display">Analyzing interaction</span>
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
      </div>
    </div>
  </div>
);

export default LoadingAnimation;
