import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Trash2, FileText, AlertTriangle, CheckCircle,
  Plus, User, Activity, Pill, ChevronRight, Clock, Search,
} from "lucide-react";
import {
  loadHistory, clearHistory, deleteHistoryRecord,
  loadPatients, savePatient, deletePatient,
  type HistoryRecord, type SavedPatient,
} from "@/lib/patientStore";

const sevColor = (s: string) =>
  s === "severe" ? "text-severe bg-severe/10 border-severe/30" :
  s === "moderate" ? "text-warning bg-warning/10 border-warning/30" :
  s === "mild" ? "text-primary bg-primary/10 border-primary/30" :
  "text-success bg-success/10 border-success/30";

const Dashboard = () => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [patients, setPatients] = useState<SavedPatient[]>([]);
  const [q, setQ] = useState("");
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newMeds, setNewMeds] = useState("");

  useEffect(() => {
    setHistory(loadHistory());
    setPatients(loadPatients());
  }, []);

  const handleAdd = () => {
    if (!newName.trim()) return;
    savePatient({
      name: newName.trim(),
      age: newAge ? Number(newAge) : undefined,
      medications: newMeds.split(",").map(m => m.trim()).filter(Boolean),
    });
    setPatients(loadPatients());
    setNewName(""); setNewAge(""); setNewMeds("");
  };

  const filtered = history.filter(h =>
    !q || h.drugs.some(d => d.toLowerCase().includes(q.toLowerCase())) ||
    h.title.toLowerCase().includes(q.toLowerCase())
  );

  const stats = {
    total: history.length,
    severe: history.filter(h => h.severity === "severe").length,
    moderate: history.filter(h => h.severity === "moderate").length,
    safe: history.filter(h => h.severity === "none").length,
  };

  return (
    <div className="px-4 py-8">
      <Helmet>
        <title>Patient Dashboard — SUCYNTRA DDI Predictor</title>
        <meta name="description" content="Local, offline patient dashboard storing prescription history and interaction checks." />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="card-elevated p-6 grain-bg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 amber-gradient" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl amber-gradient flex items-center justify-center text-white shadow-lg">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-foreground">Patient Dashboard</h1>
              <p className="text-xs text-muted-foreground">Local history of prescriptions &amp; interaction checks · stored only on this device</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            <Stat label="Checks Run" value={stats.total} icon={Activity} tone="primary" />
            <Stat label="Severe Flags" value={stats.severe} icon={AlertTriangle} tone="severe" />
            <Stat label="Moderate" value={stats.moderate} icon={FileText} tone="warning" />
            <Stat label="Clean" value={stats.safe} icon={CheckCircle} tone="success" />
          </div>
        </div>

        {/* Patients */}
        <section className="card-elevated p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-sm font-bold font-display flex items-center gap-2"><User className="w-4 h-4 text-primary" /> Saved Patient Profiles</h2>
            <span className="text-[10px] text-muted-foreground">{patients.length} on file</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-4">
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Patient name" className="sm:col-span-1 px-3 py-2 text-sm rounded-lg border border-border bg-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input value={newAge} onChange={e => setNewAge(e.target.value)} type="number" placeholder="Age" className="px-3 py-2 text-sm rounded-lg border border-border bg-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <input value={newMeds} onChange={e => setNewMeds(e.target.value)} placeholder="Medications (comma-separated)" className="sm:col-span-1 px-3 py-2 text-sm rounded-lg border border-border bg-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button onClick={handleAdd} className="amber-gradient text-white text-sm font-semibold rounded-lg px-3 py-2 inline-flex items-center justify-center gap-1.5 shadow hover:shadow-md transition-shadow">
              <Plus className="w-4 h-4" /> Add Profile
            </button>
          </div>

          {patients.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border rounded-xl bg-secondary/20">
              <User className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="font-medium">No patients saved yet</p>
              <p className="text-xs mt-1">Add one above to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patients.map(p => (
                <div key={p.id} className="card-elevated p-5 hover:shadow-lg transition-all group">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl amber-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold font-display text-foreground truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.age ? `${p.age} years old` : "Age not set"}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { deletePatient(p.id); setPatients(loadPatients()); }} 
                      aria-label="Delete patient" 
                      className="p-2 text-muted-foreground hover:text-severe hover:bg-severe/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {p.medications.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Medications</p>
                      <div className="flex flex-wrap gap-2">
                        {p.medications.slice(0, 4).map(m => (
                          <span key={m} className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">{m}</span>
                        ))}
                        {p.medications.length > 4 && <span className="text-xs font-medium bg-secondary/60 text-foreground/70 px-2.5 py-1 rounded-full">+{p.medications.length - 4}</span>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* History */}
        <section className="card-elevated p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-sm font-bold font-display flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Interaction Check History</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search drug…" className="pl-7 pr-2 py-1.5 text-xs rounded-md border border-border bg-secondary/40 focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {history.length > 0 && (
                <button onClick={() => { clearHistory(); setHistory([]); }} className="text-[10px] text-muted-foreground hover:text-severe inline-flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-border rounded-xl">
              <Pill className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground mb-3">No interaction checks recorded yet.</p>
              <Link to="/checker" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                Run your first check <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.slice(0, 30).map(h => (
                <div key={h.id} className={`flex items-center justify-between gap-3 border rounded-xl p-3 ${sevColor(h.severity)}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold truncate">{h.title}</span>
                      <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full bg-background/70">{h.mode}</span>
                      {h.geriatric && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground">65+</span>}
                    </div>
                    <p className="text-[10px] opacity-80 truncate">{h.mechanism}</p>
                    <p className="text-[9px] opacity-60 mt-0.5">{new Date(h.timestamp).toLocaleString()} · Risk {h.riskScore}/100</p>
                  </div>
                  <button onClick={() => { deleteHistoryRecord(h.id); setHistory(loadHistory()); }} aria-label="Delete record" className="opacity-60 hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const Stat = ({ label, value, icon: Icon, tone }: { label: string; value: number; icon: any; tone: "primary" | "severe" | "warning" | "success" }) => {
  const cls = {
    primary: "bg-primary/10 text-primary border-primary/20",
    severe: "bg-severe/10 text-severe border-severe/20",
    warning: "bg-warning/15 text-warning border-warning/20",
    success: "bg-success/10 text-success border-success/20",
  }[tone];
  return (
    <div className={`rounded-xl border p-3 ${cls}`}>
      <Icon className="w-4 h-4 mb-1.5" />
      <p className="text-2xl font-bold font-display leading-none">{value}</p>
      <p className="text-[10px] uppercase tracking-wider opacity-80 mt-1">{label}</p>
    </div>
  );
};

export default Dashboard;
