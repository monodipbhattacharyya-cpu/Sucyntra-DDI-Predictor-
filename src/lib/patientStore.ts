// Lightweight client-side storage for prescription / interaction history.
// Fully offline (localStorage). No PHI is transmitted.

export interface HistoryRecord {
  id: string;
  timestamp: number;
  mode: "drug" | "food" | "allergy" | "polypharmacy";
  drugs: string[];
  context?: string;          // food name / allergy class
  severity: "severe" | "moderate" | "mild" | "none";
  riskScore: number;
  title: string;
  mechanism: string;
  recommendation: string;
  geriatric?: boolean;
}

export interface SavedPatient {
  id: string;
  name: string;
  age?: number;
  notes?: string;
  medications: string[];
  createdAt: number;
}

const HISTORY_KEY = "sucyntra.history.v1";
const PATIENTS_KEY = "sucyntra.patients.v1";

export function loadHistory(): HistoryRecord[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch { return []; }
}

export function saveHistoryRecord(rec: Omit<HistoryRecord, "id" | "timestamp">) {
  const all = loadHistory();
  const full: HistoryRecord = { ...rec, id: crypto.randomUUID(), timestamp: Date.now() };
  all.unshift(full);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(all.slice(0, 200)));
  return full;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function deleteHistoryRecord(id: string) {
  const all = loadHistory().filter(r => r.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(all));
}

export function loadPatients(): SavedPatient[] {
  try {
    return JSON.parse(localStorage.getItem(PATIENTS_KEY) || "[]");
  } catch { return []; }
}

export function savePatient(p: Omit<SavedPatient, "id" | "createdAt">) {
  const all = loadPatients();
  const full: SavedPatient = { ...p, id: crypto.randomUUID(), createdAt: Date.now() };
  all.unshift(full);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(all));
  return full;
}

export function deletePatient(id: string) {
  const all = loadPatients().filter(p => p.id !== id);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(all));
}
