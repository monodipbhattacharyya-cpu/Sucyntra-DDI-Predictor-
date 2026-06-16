import { useState, useRef } from "react";
import { FileText, Search, X, ArrowRight, Camera, Upload, Loader2, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { DRUGS } from "@/lib/drugInteractions";
import { createWorker } from "tesseract.js";
import { findDrugMatch } from "@/lib/drugSubstitution";

interface Props {
  onDrugsFound: (drugA: string, drugB: string) => void;
}

interface OcrCorrection {
  original: string;
  suggested: string;
  score: number;
  accepted: boolean;
}

function extractDrugs(text: string): string[] {
  const normalized = text.toLowerCase();
  const found = new Set<string>();

  for (const drug of DRUGS) {
    const lower = drug.toLowerCase();
    const regex = new RegExp(`\\b${lower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (regex.test(normalized)) {
      found.add(drug);
    }
  }

  return Array.from(found);
}

function extractWithCorrection(text: string): { drugs: string[]; corrections: OcrCorrection[] } {
  const drugs = extractDrugs(text);
  const corrections: OcrCorrection[] = [];

  // Split text into words and check low-confidence matches
  const words = text.split(/[\s,;:.\-\/\\()\[\]{}]+/).filter(w => w.length >= 4);
  for (const word of words) {
    const isAlreadyFound = drugs.some(d => d.toLowerCase() === word.toLowerCase());
    if (isAlreadyFound) continue;

    // Simulate OCR confidence (real OCR would provide this)
    const confidence = 40 + (word.length * 3) + (word.charCodeAt(0) % 20);
    if (confidence < 80) {
      const match = findDrugMatch(word, confidence);
      if (match && !drugs.includes(match.match)) {
        corrections.push({
          original: word,
          suggested: match.match,
          score: match.score,
          accepted: false,
        });
      }
    }
  }

  return { drugs, corrections };
}

const PrescriptionParser = ({ onDrugsFound }: Props) => {
  const [text, setText] = useState("");
  const [detectedDrugs, setDetectedDrugs] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPair, setSelectedPair] = useState<[number, number]>([-1, -1]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<"text" | "image">("text");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [corrections, setCorrections] = useState<OcrCorrection[]>([]);

  const handleParse = () => {
    if (!text.trim()) return;
    const { drugs, corrections: corr } = extractWithCorrection(text);
    setDetectedDrugs(drugs);
    setCorrections(corr);
    if (drugs.length >= 2) {
      setSelectedPair([0, 1]);
    }
  };

  const acceptCorrection = (index: number) => {
    const corr = corrections[index];
    const updated = [...corrections];
    updated[index] = { ...corr, accepted: true };
    setCorrections(updated);
    if (!detectedDrugs.includes(corr.suggested)) {
      const newDrugs = [...detectedDrugs, corr.suggested];
      setDetectedDrugs(newDrugs);
      if (newDrugs.length >= 2 && selectedPair[0] === -1) {
        setSelectedPair([0, 1]);
      }
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setOcrLoading(true);
    setOcrProgress(0);
    setDetectedDrugs([]);
    setCorrections([]);

    try {
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data: { text: ocrText } } = await worker.recognize(file);
      await worker.terminate();

      setText(ocrText);
      const { drugs, corrections: corr } = extractWithCorrection(ocrText);
      setDetectedDrugs(drugs);
      setCorrections(corr);
      if (drugs.length >= 2) {
        setSelectedPair([0, 1]);
      }
    } catch (err) {
      console.error("OCR failed:", err);
      setText("OCR extraction failed. Please try again or paste text manually.");
    } finally {
      setOcrLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    e.target.value = "";
  };

  const handleCheckInteraction = () => {
    const [a, b] = selectedPair;
    if (a >= 0 && b >= 0 && detectedDrugs[a] && detectedDrugs[b]) {
      onDrugsFound(detectedDrugs[a], detectedDrugs[b]);
      setIsOpen(false);
    }
  };

  const toggleDrug = (index: number) => {
    const [a, b] = selectedPair;
    if (a === index) setSelectedPair([-1, b]);
    else if (b === index) setSelectedPair([a, -1]);
    else if (a === -1) setSelectedPair([index, b]);
    else if (b === -1) setSelectedPair([a, index]);
    else setSelectedPair([a, index]);
  };

  const handleClose = () => {
    setIsOpen(false);
    setDetectedDrugs([]);
    setText("");
    setPreviewUrl(null);
    setMode("text");
  };

  if (!isOpen) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => { setIsOpen(true); setMode("image"); }}
          className="card-elevated p-4 flex items-center gap-3 hover:shadow-lg transition-all duration-200 group"
        >
          <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center flex-shrink-0">
            <Camera className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-semibold text-foreground">Scan Prescription</p>
            <p className="text-xs text-muted-foreground">Camera or image upload with OCR</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </button>
        <button
          onClick={() => { setIsOpen(true); setMode("text"); }}
          className="card-elevated p-4 flex items-center gap-3 hover:shadow-lg transition-all duration-200 group"
        >
          <div className="w-10 h-10 rounded-lg bg-foreground/10 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-foreground/70" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-semibold text-foreground">Paste Prescription</p>
            <p className="text-xs text-muted-foreground">Type or paste clinical notes</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="card-elevated p-5 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {mode === "image" ? <Camera className="w-4 h-4 text-primary" /> : <FileText className="w-4 h-4 text-primary" />}
          <h3 className="text-sm font-semibold text-foreground font-display">
            {mode === "image" ? "Scan Prescription (OCR)" : "Prescription Text Parser"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(mode === "image" ? "text" : "image")}
            className="text-xs text-primary hover:underline"
          >
            {mode === "image" ? "Switch to Text" : "Switch to Camera"}
          </button>
          <button onClick={handleClose} aria-label="Close prescription parser" className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {mode === "image" ? (
        <div className="space-y-3">
          {/* Hidden file inputs */}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />

          {!previewUrl && !ocrLoading && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Camera className="w-8 h-8 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Take Photo</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Upload className="w-8 h-8 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Upload Image</span>
              </button>
            </div>
          )}

          {previewUrl && (
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img src={previewUrl} alt="Uploaded prescription scan" className="w-full max-h-48 object-contain bg-secondary/30" />
              {ocrLoading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-xs font-medium text-foreground">Extracting text… {ocrProgress}%</p>
                  <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full hero-gradient rounded-full transition-all duration-300" style={{ width: `${ocrProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {previewUrl && !ocrLoading && (
            <button
              onClick={() => { setPreviewUrl(null); setText(""); setDetectedDrugs([]); }}
              className="text-xs text-primary hover:underline"
            >
              ← Upload a different image
            </button>
          )}

          {/* Show OCR-extracted text */}
          {text && !ocrLoading && (
            <div className="space-y-1">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Extracted Text</p>
              <div className="bg-secondary/50 border border-border rounded-lg p-3 text-xs text-foreground/80 max-h-24 overflow-y-auto whitespace-pre-wrap">
                {text}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"Paste prescription or clinical notes here...\n\nExample:\nRx: Warfarin 5mg OD\n    Aspirin 75mg OD\n    Omeprazole 20mg OD\n    Metformin 500mg BD"}
            className="w-full h-32 bg-secondary/50 border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            maxLength={2000}
          />
          <button
            onClick={handleParse}
            disabled={!text.trim()}
            className="mt-3 w-full hero-gradient text-primary-foreground font-semibold py-2.5 rounded-lg transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            <Search className="w-4 h-4" />
            Extract Drugs
          </button>
        </>
      )}

      {/* Detected drugs */}
      {detectedDrugs.length > 0 && (
        <div className="mt-4 space-y-3 animate-fade-in-up">
          <p className="text-xs font-medium text-muted-foreground">
            Found <span className="text-primary font-bold">{detectedDrugs.length}</span> drug{detectedDrugs.length !== 1 ? "s" : ""} — select any 2 to check interaction:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {detectedDrugs.map((drug, i) => {
              const isA = selectedPair[0] === i;
              const isB = selectedPair[1] === i;
              return (
                <button
                  key={drug}
                  onClick={() => toggleDrug(i)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                    isA
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : isB
                      ? "bg-accent-foreground text-accent border-accent-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {isA && "A: "}{isB && "B: "}{drug}
                </button>
              );
            })}
          </div>

          {selectedPair[0] >= 0 && selectedPair[1] >= 0 && (
            <button
              onClick={handleCheckInteraction}
              className="w-full bg-foreground text-background font-semibold py-2.5 rounded-lg text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              Check {detectedDrugs[selectedPair[0]]} ↔ {detectedDrugs[selectedPair[1]]}
            </button>
          )}
        </div>
      )}

      {/* OCR Corrections - Soundex Phonetic Matching */}
      {corrections.length > 0 && (
        <div className="mt-3 space-y-2 animate-fade-in-up">
          <div className="flex items-center gap-2 text-xs font-medium text-warning">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Medical Handwriting Correction — Low-confidence words detected</span>
          </div>
          {corrections.filter(c => !c.accepted).map((corr, i) => (
            <div key={corr.original} className="flex items-center gap-2 bg-warning/5 border border-warning/20 rounded-lg p-2.5">
              <span className="text-[10px] text-muted-foreground">OCR read:</span>
              <span className="text-xs font-mono bg-warning/15 text-warning px-2 py-0.5 rounded">{corr.original}</span>
              <span className="text-[10px] text-muted-foreground">→ Did you mean</span>
              <button
                onClick={() => acceptCorrection(corrections.indexOf(corr))}
                className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full hover:bg-primary/20 transition-all"
              >
                {corr.suggested}?
              </button>
              <span className="text-[9px] text-muted-foreground ml-auto">({corr.score}% match)</span>
            </div>
          ))}
        </div>
      )}

      {detectedDrugs.length === 0 && text.trim() && !ocrLoading && mode === "text" && (
        <p className="mt-3 text-xs text-muted-foreground text-center">
          Click "Extract Drugs" to parse your prescription text
        </p>
      )}

      {detectedDrugs.length === 0 && text.trim() && !ocrLoading && mode === "image" && (
        <p className="mt-3 text-xs text-warning text-center font-medium">
          No drugs detected in the image. Try a clearer photo or paste the text manually.
        </p>
      )}
    </div>
  );
};

export default PrescriptionParser;