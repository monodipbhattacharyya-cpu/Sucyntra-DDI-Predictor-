import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { type InteractionResult } from "@/lib/drugInteractions";
import { findSubstitutions } from "@/lib/drugSubstitution";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Props {
  result: InteractionResult;
  drugA: string;
  drugB: string;
}

// Brand palette — matches the orange/yellow-white UI theme.
const BRAND = {
  orange:   [234, 88, 12]  as [number, number, number], // primary vivid orange
  amber:    [245, 158, 11] as [number, number, number],
  yellow:   [253, 224, 71] as [number, number, number],
  cream:    [255, 251, 235]as [number, number, number],
  ink:      [41, 22, 8]    as [number, number, number], // deep warm brown
  severe:   [220, 38, 38]  as [number, number, number],
  warning:  [234, 145, 12] as [number, number, number],
  success:  [22, 163, 74]  as [number, number, number],
  muted:    [120, 100, 80] as [number, number, number],
  rule:     [253, 186, 116]as [number, number, number],
};

const sevColor = (sev: string): [number, number, number] => {
  if (sev === "severe") return BRAND.severe;
  if (sev === "moderate") return BRAND.warning;
  if (sev === "mild") return BRAND.amber;
  return BRAND.success;
};

const PDFExport = ({ result, drugA, drugB }: Props) => {
  const [generating, setGenerating] = useState(false);

  const generatePDF = () => {
    setGenerating(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // --- Cream background wash on every page (drawn at end via helper) ---
        const paintPage = () => {
          // cream wash
          doc.setFillColor(...BRAND.cream);
          doc.rect(0, 0, pageWidth, pageHeight, "F");
          // top amber gradient bar (simulated by stacked rects)
          doc.setFillColor(...BRAND.orange);
          doc.rect(0, 0, pageWidth, 4, "F");
          doc.setFillColor(...BRAND.amber);
          doc.rect(0, 4, pageWidth, 2, "F");
          doc.setFillColor(...BRAND.yellow);
          doc.rect(0, 6, pageWidth, 1.2, "F");
          // bottom strip
          doc.setFillColor(...BRAND.orange);
          doc.rect(0, pageHeight - 10, pageWidth, 3, "F");
          doc.setFillColor(...BRAND.amber);
          doc.rect(0, pageHeight - 7, pageWidth, 1.5, "F");
          // side accent
          doc.setFillColor(...BRAND.orange);
          doc.rect(0, 7.2, 6, pageHeight - 17.2, "F");
        };

        // === COVER LETTERHEAD ===
        paintPage();

        // Logo mark — orange rounded square with "S"
        doc.setFillColor(...BRAND.orange);
        doc.roundedRect(14, 16, 16, 16, 3, 3, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("S", 22, 27, { align: "center" });

        // Brand title
        doc.setTextColor(...BRAND.ink);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("SUCYNTRA", 34, 24);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...BRAND.muted);
        doc.text("DDI PREDICTOR · CLINICAL DECISION SUPPORT PAD", 34, 29);

        // Right header — report meta
        doc.setFontSize(8);
        doc.setTextColor(...BRAND.muted);
        doc.text(`Report ID: SDDI-${Date.now().toString().slice(-8)}`, pageWidth - 14, 20, { align: "right" });
        doc.text(`Issued: ${new Date().toLocaleString()}`, pageWidth - 14, 25, { align: "right" });
        doc.text("Evidence-based · Deterministic engine", pageWidth - 14, 30, { align: "right" });

        // Divider amber line
        doc.setDrawColor(...BRAND.rule);
        doc.setLineWidth(0.6);
        doc.line(14, 36, pageWidth - 14, 36);

        let y = 44;

        // Report title block
        doc.setFillColor(...BRAND.orange);
        doc.roundedRect(14, y, pageWidth - 28, 14, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text("DRUG–DRUG INTERACTION ANALYSIS REPORT", pageWidth / 2, y + 9, { align: "center" });
        y += 22;

        // Severity hero pill
        const sc = sevColor(result.severity);
        doc.setFillColor(...sc);
        doc.roundedRect(14, y, pageWidth - 28, 22, 3, 3, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("CLINICAL SEVERITY", 20, y + 8);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(result.severity.toUpperCase(), 20, y + 17);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("RISK SCORE", pageWidth - 60, y + 8);
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(`${result.riskScore}/100`, pageWidth - 60, y + 18);
        y += 30;

        // Drug pair card
        doc.setTextColor(...BRAND.ink);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text("Rx Pair Analyzed", 14, y);
        y += 4;

        autoTable(doc, {
          startY: y,
          head: [["Drug A", "Drug B", "Severity", "Risk Score"]],
          body: [[drugA, drugB, result.severity.toUpperCase(), `${result.riskScore}/100`]],
          theme: "grid",
          headStyles: { fillColor: BRAND.orange, textColor: [255, 255, 255], fontSize: 9, fontStyle: "bold" },
          bodyStyles: { fontSize: 10, textColor: BRAND.ink, fillColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: BRAND.cream },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 8;

        // Classification
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...BRAND.ink);
        doc.text("Pharmacological Classification", 14, y);
        y += 4;

        autoTable(doc, {
          startY: y,
          head: [["Drug", "Classification(s)"]],
          body: [
            [drugA, result.categories.drugA.join(", ")],
            [drugB, result.categories.drugB.join(", ")],
          ],
          theme: "grid",
          headStyles: { fillColor: BRAND.amber, textColor: BRAND.ink, fontSize: 9, fontStyle: "bold" },
          bodyStyles: { fontSize: 9, textColor: BRAND.ink },
          alternateRowStyles: { fillColor: BRAND.cream },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 8;

        // Mechanism block with orange left rule
        const mechLines = doc.splitTextToSize(result.mechanism, pageWidth - 36);
        const mechH = mechLines.length * 4.6 + 14;
        if (y + mechH > pageHeight - 22) { doc.addPage(); paintPage(); y = 16; }
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(14, y, pageWidth - 28, mechH, 2, 2, "F");
        doc.setFillColor(...BRAND.orange);
        doc.rect(14, y, 2.5, mechH, "F");
        doc.setTextColor(...BRAND.orange);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("PHARMACOLOGICAL MECHANISM", 20, y + 6);
        doc.setTextColor(...BRAND.ink);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(mechLines, 20, y + 12);
        y += mechH + 6;

        // Recommendation block — yellow tint
        const recLines = doc.splitTextToSize(result.recommendation, pageWidth - 36);
        const recH = recLines.length * 4.6 + 14;
        if (y + recH > pageHeight - 22) { doc.addPage(); paintPage(); y = 16; }
        doc.setFillColor(255, 248, 220);
        doc.roundedRect(14, y, pageWidth - 28, recH, 2, 2, "F");
        doc.setFillColor(...BRAND.amber);
        doc.rect(14, y, 2.5, recH, "F");
        doc.setTextColor(...BRAND.ink);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("CLINICAL MANAGEMENT RECOMMENDATION", 20, y + 6);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(recLines, 20, y + 12);
        y += recH + 8;

        // PGx adjustment
        if (result.pharmacogenomicAdjustment) {
          if (y > pageHeight - 60) { doc.addPage(); paintPage(); y = 16; }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(...BRAND.ink);
          doc.text("Pharmacogenomic Adjustment", 14, y);
          y += 4;
          autoTable(doc, {
            startY: y,
            head: [["Affected Enzymes", "Adjusted Score", "Explanation"]],
            body: [[
              result.pharmacogenomicAdjustment.affectedEnzymes.join(", "),
              `${result.pharmacogenomicAdjustment.adjustedRiskScore}/100`,
              result.pharmacogenomicAdjustment.explanation,
            ]],
            theme: "grid",
            headStyles: { fillColor: BRAND.orange, textColor: [255, 255, 255], fontSize: 9 },
            bodyStyles: { fontSize: 8, textColor: BRAND.ink },
            margin: { left: 14, right: 14 },
            columnStyles: { 2: { cellWidth: 90 } },
          });
          y = (doc as any).lastAutoTable.finalY + 8;
        }

        // Evidence matrix
        if (result.inSilico) {
          if (y > pageHeight - 70) { doc.addPage(); paintPage(); y = 16; }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(...BRAND.ink);
          doc.text("Evidence-Based Interaction Matrix", 14, y);
          y += 4;
          autoTable(doc, {
            startY: y,
            head: [["Parameter", "Value"]],
            body: [
              ["Structural Overlap (Tanimoto)", `${(result.inSilico.structuralSimilarity * 100).toFixed(1)}%`],
              ["Literature Reliability Grade", `${result.inSilico.confidenceScore}%`],
              ["Shared Pharmacological Classes", result.inSilico.sharedTargets.join(", ") || "None"],
              ["Pathway Overlap", result.inSilico.pathwayOverlap.join(", ") || "None"],
              ["Cross-Pathway Flag", result.inSilico.predictedNovelRisk ? "Yes" : "No"],
            ],
            theme: "grid",
            headStyles: { fillColor: BRAND.amber, textColor: BRAND.ink, fontSize: 9 },
            bodyStyles: { fontSize: 8, textColor: BRAND.ink },
            alternateRowStyles: { fillColor: BRAND.cream },
            margin: { left: 14, right: 14 },
          });
          y = (doc as any).lastAutoTable.finalY + 8;
        }

        // Substitutions
        const subs = findSubstitutions(result, drugA, drugB);
        if (subs.length > 0) {
          if (y > pageHeight - 60) { doc.addPage(); paintPage(); y = 16; }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(...BRAND.ink);
          doc.text("Recommended Clinical Interventions", 14, y);
          y += 4;
          autoTable(doc, {
            startY: y,
            head: [["Switch From", "Switch To", "Class", "Advantage"]],
            body: subs.map(s => [s.originalDrug, s.suggestedDrug, s.therapeuticClass, s.metabolicAdvantage]),
            theme: "grid",
            headStyles: { fillColor: BRAND.orange, textColor: [255, 255, 255], fontSize: 9 },
            bodyStyles: { fontSize: 8, textColor: BRAND.ink },
            alternateRowStyles: { fillColor: BRAND.cream },
            margin: { left: 14, right: 14 },
          });
          y = (doc as any).lastAutoTable.finalY + 8;
        }

        // === Apply background + footer on all pages ===
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          // Re-paint background underneath if we missed (page 2+ added without paint)
          // We already painted on first page; for added pages we painted in branches above.
          // Footer text
          doc.setFontSize(7);
          doc.setTextColor(...BRAND.muted);
          doc.text(
            `SUCYNTRA DDI Predictor · Clinical Pad · Page ${i} of ${totalPages}`,
            14, pageHeight - 13
          );
          doc.text(
            `Patient: ${drugA} + ${drugB}`,
            pageWidth / 2, pageHeight - 13, { align: "center" }
          );
          doc.text(
            "Made with care by Monodip Bhattacharyya",
            pageWidth - 14, pageHeight - 13, { align: "right" }
          );
          // Watermark mini-logo bottom-left
          doc.setFillColor(...BRAND.orange);
          doc.roundedRect(pageWidth / 2 - 3, pageHeight - 6.2, 6, 3.6, 0.5, 0.5, "F");
        }

        doc.save(`SUCYNTRA_DDI_${drugA}_${drugB}_${new Date().toISOString().split("T")[0]}.pdf`);
      } catch (e) {
        console.error("PDF generation error:", e);
      } finally {
        setGenerating(false);
      }
    }, 300);
  };

  return (
    <button
      onClick={generatePDF}
      disabled={generating}
      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg amber-gradient text-white shadow hover:shadow-md transition-all disabled:opacity-50"
    >
      {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
      {generating ? "Generating Pad..." : "Export SUCYNTRA Clinical Pad (PDF)"}
    </button>
  );
};

export default PDFExport;
