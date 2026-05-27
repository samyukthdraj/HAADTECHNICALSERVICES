"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Send, Printer, RefreshCw, CheckCircle } from "lucide-react";

interface ManpowerRow {
  id: string;
  designation: string;
  quantity: number;
  hours: number;
  rate: number;
}

const DEFAULT_ROWS: ManpowerRow[] = [
  { id: "1", designation: "HVAC Senior Technician", quantity: 2, hours: 80, rate: 35 },
  { id: "2", designation: "Electrical Contracting Technician", quantity: 3, hours: 120, rate: 30 },
  { id: "3", designation: "Plumbing & Pipe Fitter", quantity: 2, hours: 80, rate: 28 },
  { id: "4", designation: "General Technical Helper / Laborer", quantity: 5, hours: 160, rate: 16 },
];

export default function QuotationCalculator() {
  const [rows, setRows] = useState<ManpowerRow[]>(DEFAULT_ROWS);
  const [clientName, setClientName] = useState("EMAAR PROPERTIES PJSC");
  const [projectRef, setProjectRef] = useState("HTS-QT-2026-4028");
  const [projectLocation, setProjectLocation] = useState("Downtown Dubai, UAE");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<"draft" | "active" | "urgent">("draft");
  
  // Backend communication states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  // Auto-generate reference on component load
  useEffect(() => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const timer = setTimeout(() => {
      setProjectRef(`HTS-QT-2026-${randomSuffix}`);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleAddRow = () => {
    const newRow: ManpowerRow = {
      id: Date.now().toString(),
      designation: "Technical Operator / Technician",
      quantity: 1,
      hours: 40,
      rate: 25,
    };
    setRows([...rows, newRow]);
  };

  const handleRemoveRow = (id: string) => {
    if (rows.length === 1) return;
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleRowChange = (id: string, field: keyof ManpowerRow, value: string | number) => {
    setRows(
      rows.map((row) => {
        if (row.id === id) {
          if (field === "designation") {
            return { ...row, designation: String(value) };
          }
          const numValue = typeof value === "number" ? value : parseFloat(value) || 0;
          if (field === "quantity") return { ...row, quantity: numValue };
          if (field === "hours") return { ...row, hours: numValue };
          if (field === "rate") return { ...row, rate: numValue };
        }
        return row;
      })
    );
  };

  const handleReset = () => {
    setRows(DEFAULT_ROWS);
    setClientName("EMAAR PROPERTIES PJSC");
    setProjectLocation("Downtown Dubai, UAE");
    setDate(new Date().toISOString().split("T")[0]);
    setStatus("draft");
    setSubmitResult(null);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setProjectRef(`HTS-QT-2026-${randomSuffix}`);
  };

  // Calculations
  const subtotal = rows.reduce((sum, row) => sum + row.quantity * row.hours * row.rate, 0);
  const vat = subtotal * 0.05; // Dubai VAT 5%
  const total = subtotal + vat;

  // API Submit handler
  const handleSubmitQuote = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://haadtechnicalservicescollc-delta.vercel.app";
      const response = await fetch(`${backendUrl}/api/quotation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName,
          projectRef,
          projectLocation,
          date,
          status,
          items: rows.map(r => ({
            designation: r.designation,
            quantity: r.quantity,
            hours: r.hours,
            rate: r.rate,
            total: r.quantity * r.hours * r.rate
          })),
          subtotal,
          vat,
          total
        }),
      });

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      const data = await response.json();
      setSubmitResult({
        success: true,
        message: data.message || "Quotation details submitted successfully!",
      });
      setStatus("active");
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmitResult({
        success: false,
        message: "Failed to connect to the backend server. Make sure the backend is running on http://localhost:5000.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="w-full bg-white border-2 border-[#1A1A1A] p-4 md:p-8 relative" style={{ borderRadius: "0px" }}>
      {/* Top Banner Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#ba0013]"></div>

      {/* Sheet Title & Metadata */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-[#1A1A1A] pb-6">
        <div>
          <span className="hts-label-sm text-[10px] text-[#006d39] font-bold block mb-1">
            • OFFICIAL TECHNICAL SERVICES QUOTATION SHEET
          </span>
          <h2 className="hts-headline-lg font-black text-[#1A1A1A]">MANPOWER COST ESTIMATION</h2>
          <span className="hts-label-md text-xs text-[#5c5b5b] mt-1 block">
            JURISDICTION: DUBAI REGULATORY LAWS • RATE AED / HOUR
          </span>
        </div>

        {/* Status Chip Picker */}
        <div className="flex items-center gap-2 print:hidden">
          <span className="hts-label-sm text-[11px] text-[#5c5b5b]">SHEET STATUS:</span>
          <div className="flex border border-[#1A1A1A]" style={{ borderRadius: "0px" }}>
            <button
              onClick={() => setStatus("draft")}
              className={`px-3 py-1 text-xs font-bold uppercase transition-all ${
                status === "draft"
                  ? "bg-[#5c5b5b] text-white"
                  : "bg-white text-[#5c5b5b] hover:bg-[#F4F4F4]"
              }`}
              style={{ borderRadius: "0px" }}
            >
              Draft
            </button>
            <button
              onClick={() => setStatus("active")}
              className={`px-3 py-1 text-xs font-bold uppercase border-l border-[#1A1A1A] transition-all ${
                status === "active"
                  ? "bg-[#006d39] text-white"
                  : "bg-white text-[#5c5b5b] hover:bg-[#F4F4F4]"
              }`}
              style={{ borderRadius: "0px" }}
            >
              Active
            </button>
            <button
              onClick={() => setStatus("urgent")}
              className={`px-3 py-1 text-xs font-bold uppercase border-l border-[#1A1A1A] transition-all ${
                status === "urgent"
                  ? "bg-[#ba0013] text-white"
                  : "bg-white text-[#5c5b5b] hover:bg-[#F4F4F4]"
              }`}
              style={{ borderRadius: "0px" }}
            >
              Urgent
            </button>
          </div>
        </div>

        {/* Status Chip for Print (static) */}
        <div className="hidden print:block">
          <div className={`px-4 py-1 text-xs font-bold uppercase border-2 border-[#1A1A1A]`}>
            STATUS: {status.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Form Fields Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 bg-[#F4F4F4] p-6 border border-[#1A1A1A]" style={{ borderRadius: "0px" }}>
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="hts-label-sm text-[#1A1A1A]">CLIENT / PROJECT ENTITY</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value.toUpperCase())}
            className="w-full bg-white border border-[#1A1A1A] p-2.5 hts-body-md text-sm outline-none focus:border-[#ba0013] font-sans"
            style={{ borderRadius: "0px" }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="hts-label-sm text-[#1A1A1A]">QUOTATION REFERENCE</label>
          <input
            type="text"
            value={projectRef}
            onChange={(e) => setProjectRef(e.target.value)}
            className="w-full bg-white border border-[#1A1A1A] p-2.5 hts-label-md text-xs outline-none focus:border-[#ba0013]"
            style={{ borderRadius: "0px" }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="hts-label-sm text-[#1A1A1A]">DOCUMENT DATE</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white border border-[#1A1A1A] p-2.5 hts-label-md text-xs outline-none focus:border-[#ba0013]"
            style={{ borderRadius: "0px" }}
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-4">
          <label className="hts-label-sm text-[#1A1A1A]">PROJECT WORK SITE LOCATION</label>
          <input
            type="text"
            value={projectLocation}
            onChange={(e) => setProjectLocation(e.target.value)}
            className="w-full bg-white border border-[#1A1A1A] p-2.5 hts-body-md text-sm outline-none focus:border-[#ba0013]"
            style={{ borderRadius: "0px" }}
          />
        </div>
      </div>

      {/* Critical Data Table */}
      <div className="w-full overflow-x-auto mb-8 border border-[#1A1A1A]">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#1A1A1A] text-white border-b border-[#1A1A1A]">
              <th className="p-3 hts-label-md text-xs font-bold">ITEM NO</th>
              <th className="p-3 hts-label-md text-xs font-bold w-[40%]">MANPOWER DESIGNATION / TECHNICAL SERVICE</th>
              <th className="p-3 hts-label-md text-xs font-bold text-center">STAFF QTY</th>
              <th className="p-3 hts-label-md text-xs font-bold text-center">TOTAL HOURS</th>
              <th className="p-3 hts-label-md text-xs font-bold text-right">RATE (AED/HR)</th>
              <th className="p-3 hts-label-md text-xs font-bold text-right">TOTAL (AED)</th>
              <th className="p-3 hts-label-md text-xs font-bold text-center print:hidden">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const rowTotal = row.quantity * row.hours * row.rate;
              return (
                <tr
                  key={row.id}
                  className={`border-b border-[#1A1A1A] ${
                    index % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"
                  }`}
                >
                  <td className="p-3 hts-label-md text-xs text-center border-r border-[#1A1A1A]">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  
                  <td className="p-2 border-r border-[#1A1A1A]">
                    <input
                      type="text"
                      value={row.designation}
                      onChange={(e) => handleRowChange(row.id, "designation", e.target.value)}
                      className="w-full bg-transparent p-1 hts-body-md text-sm outline-none border-b border-transparent focus:border-[#ba0013]"
                    />
                  </td>

                  <td className="p-2 border-r border-[#1A1A1A] text-center">
                    <input
                      type="number"
                      min="1"
                      value={row.quantity || ""}
                      onChange={(e) => handleRowChange(row.id, "quantity", e.target.value)}
                      className="w-20 bg-transparent p-1 text-center hts-label-md text-sm outline-none border-b border-transparent focus:border-[#ba0013]"
                    />
                  </td>

                  <td className="p-2 border-r border-[#1A1A1A] text-center">
                    <input
                      type="number"
                      min="1"
                      value={row.hours || ""}
                      onChange={(e) => handleRowChange(row.id, "hours", e.target.value)}
                      className="w-24 bg-transparent p-1 text-center hts-label-md text-sm outline-none border-b border-transparent focus:border-[#ba0013]"
                    />
                  </td>

                  <td className="p-2 border-r border-[#1A1A1A] text-right">
                    <input
                      type="number"
                      min="0.1"
                      step="0.5"
                      value={row.rate || ""}
                      onChange={(e) => handleRowChange(row.id, "rate", e.target.value)}
                      className="w-24 bg-transparent p-1 text-right hts-label-md text-sm outline-none border-b border-transparent focus:border-[#ba0013]"
                    />
                  </td>

                  <td className="p-3 text-right hts-label-md text-sm font-bold bg-[#F4F4F4]/50 border-r border-[#1A1A1A]">
                    {rowTotal.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  <td className="p-2 text-center print:hidden">
                    <button
                      onClick={() => handleRemoveRow(row.id)}
                      disabled={rows.length === 1}
                      className="p-1.5 text-[#5c5b5b] hover:text-[#ba0013] disabled:opacity-30 transition-colors"
                      title="Delete Row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Row Control Button */}
      <div className="flex justify-start mb-8 print:hidden">
        <button
          onClick={handleAddRow}
          className="flex items-center gap-2 px-4 py-2 border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all hts-label-sm text-xs font-bold"
          style={{ borderRadius: "0px" }}
        >
          <Plus className="w-4 h-4" /> ADD MANPOWER LINE
        </button>
      </div>

      {/* Calculation / Invoice Summary Block */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-t border-[#1A1A1A] pt-6">
        {/* Dynamic Notes Section */}
        <div className="w-full md:w-[50%]">
          <h4 className="hts-label-md text-xs text-[#1A1A1A] mb-3">CONTRACTUAL TERMS & CONDITIONS</h4>
          <ul className="space-y-1 text-xs text-[#5c5b5b] hts-body-md">
            <li>1. Manpower rates are inclusive of all local regulations, visa, and insurance costs.</li>
            <li>2. Standard working hours calculated as 8 hours/day, 6 days/week.</li>
            <li>3. Overtime rates apply at 1.25x basic hourly rate for extra hours.</li>
            <li>4. Invoicing cycle: Monthly based on approved, signed timesheets.</li>
            <li>5. VAT 5% is applicable strictly under UAE Federal Tax Authority rules.</li>
          </ul>
        </div>

        {/* Tabular Calculations Box */}
        <div className="w-full md:w-[360px] border-2 border-[#1A1A1A] bg-[#f9f9f9]" style={{ borderRadius: "0px" }}>
          <div className="p-4 border-b border-[#1A1A1A] bg-[#eeeeee]">
            <h4 className="hts-label-md text-xs text-center font-bold text-[#1A1A1A]">QUOTATION FINANCIAL SUMMARY</h4>
          </div>
          
          <div className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center hts-label-md text-xs text-[#5c5b5b]">
              <span>SUBTOTAL</span>
              <span className="font-bold text-[#1A1A1A]">
                {subtotal.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
              </span>
            </div>

            <div className="flex justify-between items-center hts-label-md text-xs text-[#5c5b5b]">
              <span>TAX / VAT (5.0%)</span>
              <span className="font-bold text-[#006d39]">
                {vat.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
              </span>
            </div>

            <div className="border-t border-[#1A1A1A] pt-3 flex justify-between items-center">
              <span className="hts-label-md text-sm font-black text-[#1a1a1a]">TOTAL ESTIMATION</span>
              <span className="hts-label-md text-base font-black text-[#ba0013]">
                {total.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* API Submission Status Banner */}
      {submitResult && (
        <div
          className={`mt-8 p-4 flex items-start gap-3 border-2 ${
            submitResult.success
              ? "bg-[#87faaa]/20 border-[#006d39] text-[#00210d]"
              : "bg-red-50 border-[#ba1a1a] text-[#93000a]"
          }`}
          style={{ borderRadius: "0px" }}
        >
          {submitResult.success && <CheckCircle className="w-5 h-5 text-[#006d39] shrink-0 mt-0.5" />}
          <div className="text-sm">
            <span className="font-bold block hts-label-sm">
              {submitResult.success ? "SUBMISSION SUCCESS" : "SUBMISSION ERROR"}
            </span>
            <p className="mt-0.5">{submitResult.message}</p>
          </div>
        </div>
      )}

      {/* Control Buttons Footer */}
      <div className="mt-8 pt-6 border-t border-[#eeeeee] flex flex-wrap justify-between items-center gap-4 print:hidden">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 border border-[#5c5b5b] text-[#5c5b5b] hover:bg-[#F4F4F4] transition-all hts-label-sm text-xs font-bold"
          style={{ borderRadius: "0px" }}
        >
          <RefreshCw className="w-4 h-4" /> RESET ESTIMATE SHEET
        </button>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F4F4F4] transition-all hts-label-sm text-xs font-bold"
            style={{ borderRadius: "0px" }}
          >
            <Printer className="w-4 h-4" /> PRINT SHEET
          </button>
          
          <button
            onClick={handleSubmitQuote}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#ba0013] hover:bg-[#e31e24] text-white transition-all hts-label-sm text-xs font-bold disabled:opacity-50"
            style={{ borderRadius: "0px" }}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> SUBMITTING...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> SUBMIT TO BACKEND
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
