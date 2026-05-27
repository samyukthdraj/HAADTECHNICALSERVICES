"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Send, Printer, RefreshCw, CheckCircle, Ship } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

interface ManpowerRow {
  id: string;
  designation: string;
  quantity: number;
  hours: number;
  rate: number;
}

interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  serviceCode: string;
  rate: number;
}

export default function QuotationCalculator() {
  const { settings } = useSettings();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [rows, setRows] = useState<ManpowerRow[]>([]);
  const [clientName, setClientName] = useState("EMAAR PROPERTIES PJSC");
  const [projectRef, setProjectRef] = useState("HTS-QT-2026-4028");
  const [projectLocation, setProjectLocation] = useState("Downtown Dubai, UAE");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<"draft" | "active" | "urgent">("draft");
  
  // Backend communication states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const getBackendUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "https://haadtechnicalservicescollc-delta.vercel.app";
  };

  // Fetch dynamic services on mount & seed rows
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch(`${getBackendUrl()}/api/services`);
        if (res.ok) {
          const data: ServiceItem[] = await res.json();
          setServices(data);
          if (data && data.length > 0) {
            // Seed initial rows based on the first few services fetched
            const seededRows = data.slice(0, 3).map((svc, idx) => ({
              id: String(idx + 1),
              designation: svc.title,
              quantity: idx === 0 ? 2 : 1,
              hours: idx === 0 ? 80 : 120,
              rate: svc.rate
            }));
            setRows(seededRows);
          }
        }
      } catch (err) {
        console.error("Failed to load services for dropdown estimator:", err);
      }
    }
    loadServices();
  }, []);

  // Auto-generate reference on component load
  useEffect(() => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setProjectRef(`HTS-QT-2026-${randomSuffix}`);
  }, []);

  const handleAddRow = () => {
    const fallbackService = services[0] || { title: "HELPER", rate: 18 };
    const newRow: ManpowerRow = {
      id: Date.now().toString(),
      designation: fallbackService.title,
      quantity: 1,
      hours: 40,
      rate: fallbackService.rate,
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
          const numValue = typeof value === "number" ? value : parseFloat(value) || 0;
          if (field === "quantity") return { ...row, quantity: numValue };
          if (field === "hours") return { ...row, hours: numValue };
        }
        return row;
      })
    );
  };

  const handleDesignationSelect = (id: string, selectedTitle: string) => {
    const matched = services.find((s) => s.title === selectedTitle);
    if (!matched) return;
    setRows(
      rows.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            designation: selectedTitle,
            rate: matched.rate // Lock rate automatically to dynamic value
          };
        }
        return row;
      })
    );
  };

  const handleReset = () => {
    if (services.length > 0) {
      const seededRows = services.slice(0, 3).map((svc, idx) => ({
        id: String(idx + 1),
        designation: svc.title,
        quantity: idx === 0 ? 2 : 1,
        hours: idx === 0 ? 80 : 120,
        rate: svc.rate
      }));
      setRows(seededRows);
    }
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
      const response = await fetch(`${getBackendUrl()}/api/quotation`, {
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
        const errData = await response.json();
        throw new Error(errData.message || "Server responded with an error");
      }

      const data = await response.json();
      setSubmitResult({
        success: true,
        message: data.message || "Quotation details submitted successfully!",
      });
      setStatus("active");
    } catch (error: any) {
      console.error("Submission failed:", error);
      setSubmitResult({
        success: false,
        message: error.message || "Failed to connect to the backend server.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="estimator" className="w-full bg-white border-2 border-[#1A1A1A] p-4 md:p-8 relative print-document-container scroll-mt-20" style={{ borderRadius: "0px" }}>
      {/* Top Banner Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#ba0013] print:hidden"></div>

      {/* Print-Only Professional Corporate Letterhead */}
      <div className="hidden print:flex flex-row justify-between items-center border-b-2 border-[#1A1A1A] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 border border-[#1A1A1A] p-0.5 bg-white shrink-0">
            <img
              src="/haad_logo.png"
              alt="HTS Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-[#1A1A1A] flex items-baseline gap-0.5 leading-none">
              <span className="text-[#ba0013]">HAAD</span>
              <span className="text-[#1A1A1A]">TECHNICAL</span>
              <span className="text-[#006d39]">SERVICES</span>
            </h1>
            <span className="text-[8px] text-[#5c5b5b] mt-0.5 tracking-[0.08em] uppercase font-mono">
              CO. L.L.C. • TECHNICAL CONTRACTING
            </span>
          </div>
        </div>
        <div className="text-right font-mono text-[9px] text-[#5c5b5b] leading-tight uppercase">
          {settings.email && <div>EMAIL: {settings.email}</div>}
          {settings.phone && <div>MOB: {settings.phone}</div>}
          {settings.address && <div>ADDR: {settings.address.split(",").slice(0, 3).join(", ")}</div>}
          {settings.trnNo && <div>TRN NO: {settings.trnNo}</div>}
        </div>
      </div>

      {/* Sheet Title & Metadata */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-[#1A1A1A] pb-6">
        <div>
          <span className="hts-label-sm text-[10px] text-[#006d39] font-bold block mb-1">
            • OFFICIAL TECHNICAL SERVICES QUOTATION SHEET
          </span>
          <h2 className="hts-headline-lg font-black text-[#1A1A1A] uppercase">MANPOWER COST ESTIMATION</h2>
          <span className="hts-label-md text-xs text-[#5c5b5b] mt-1 block">
            JURISDICTION: DUBAI REGULATORY LAWS • RATE AED / HOUR
          </span>
        </div>

        {/* Status Chip Picker */}
        <div className="flex items-center gap-2 print:hidden">
          <span className="hts-label-sm text-[11px] text-[#5c5b5b]">SHEET STATUS:</span>
          <div className="flex border border-[#1A1A1A]" style={{ borderRadius: "0px" }}>
            {["draft", "active", "urgent"].map((st) => (
              <button
                key={st}
                onClick={() => setStatus(st as any)}
                className={`px-3 py-1 text-xs font-bold uppercase transition-all border-r last:border-r-0 border-[#1A1A1A] ${
                  status === st
                    ? st === "draft"
                      ? "bg-[#5c5b5b] text-white"
                      : st === "active"
                      ? "bg-[#006d39] text-white"
                      : "bg-[#ba0013] text-white"
                    : "bg-white text-[#5c5b5b] hover:bg-[#F4F4F4]"
                }`}
                style={{ borderRadius: "0px" }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Status Chip for Print (static) */}
        <div className="hidden print:block">
          <div className="px-4 py-1 text-xs font-bold uppercase border-2 border-[#1A1A1A]">
            STATUS: {status}
          </div>
        </div>
      </div>

      {/* Form Fields Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 bg-[#F4F4F4] p-6 border border-[#1A1A1A] print:p-2 print:bg-white" style={{ borderRadius: "0px" }}>
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="hts-label-sm text-[#1A1A1A] font-bold">CLIENT / PROJECT ENTITY</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value.toUpperCase())}
            placeholder=""
            className="w-full bg-white border border-[#1A1A1A] p-2.5 hts-body-md text-sm outline-none focus:border-[#ba0013] font-sans font-bold"
            style={{ borderRadius: "0px" }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="hts-label-sm text-[#1A1A1A] font-bold">QUOTATION REFERENCE</label>
          <input
            type="text"
            value={projectRef}
            onChange={(e) => setProjectRef(e.target.value)}
            placeholder=""
            className="w-full bg-white border border-[#1A1A1A] p-2.5 hts-label-md text-xs outline-none focus:border-[#ba0013] font-mono font-bold"
            style={{ borderRadius: "0px" }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="hts-label-sm text-[#1A1A1A] font-bold">DOCUMENT DATE</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white border border-[#1A1A1A] p-2.5 hts-label-md text-xs outline-none focus:border-[#ba0013]"
            style={{ borderRadius: "0px" }}
          />
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-4">
          <label className="hts-label-sm text-[#1A1A1A] font-bold">PROJECT WORK SITE LOCATION</label>
          <input
            type="text"
            value={projectLocation}
            onChange={(e) => setProjectLocation(e.target.value)}
            placeholder=""
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
              <th className="p-3 hts-label-md text-xs font-bold w-16 text-center">ITEM NO</th>
              <th className="p-3 hts-label-md text-xs font-bold w-[45%]">MANPOWER DESIGNATION / TECHNICAL SERVICE</th>
              <th className="p-3 hts-label-md text-xs font-bold text-center w-24">STAFF QTY</th>
              <th className="p-3 hts-label-md text-xs font-bold text-center w-28">TOTAL HOURS</th>
              <th className="p-3 hts-label-md text-xs font-bold text-right w-36">RATE (AED/HR)</th>
              <th className="p-3 hts-label-md text-xs font-bold text-right w-36">TOTAL (AED)</th>
              <th className="p-3 hts-label-md text-xs font-bold text-center w-20 print:hidden">ACTION</th>
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
                  <td className="p-3 hts-label-md text-xs text-center border-r border-[#1A1A1A] font-mono">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  
                  <td className="p-2 border-r border-[#1A1A1A]">
                    <select
                      value={row.designation}
                      onChange={(e) => handleDesignationSelect(row.id, e.target.value)}
                      className="w-full bg-transparent p-1 hts-body-md text-sm outline-none border-b border-transparent focus:border-[#ba0013] font-sans font-bold cursor-pointer"
                    >
                      {services.length === 0 ? (
                        <option value={row.designation}>{row.designation}</option>
                      ) : (
                        services.map((svc) => (
                          <option key={svc._id} value={svc.title}>
                            {svc.title.toUpperCase()} ({svc.serviceCode})
                          </option>
                        ))
                      )}
                    </select>
                  </td>

                  <td className="p-2 border-r border-[#1A1A1A] text-center">
                    <input
                      type="number"
                      min="1"
                      value={row.quantity || ""}
                      onChange={(e) => handleRowChange(row.id, "quantity", e.target.value)}
                      className="w-full bg-transparent p-1 text-center hts-label-md text-sm outline-none border-b border-transparent focus:border-[#ba0013]"
                    />
                  </td>

                  <td className="p-2 border-r border-[#1A1A1A] text-center">
                    <input
                      type="number"
                      min="1"
                      value={row.hours || ""}
                      onChange={(e) => handleRowChange(row.id, "hours", e.target.value)}
                      className="w-full bg-transparent p-1 text-center hts-label-md text-sm outline-none border-b border-transparent focus:border-[#ba0013]"
                    />
                  </td>

                  <td className="p-3 border-r border-[#1A1A1A] text-right hts-label-md text-sm font-bold bg-[#F4F4F4]/30 text-[#5c5b5b]">
                    {row.rate.toFixed(2)}
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
          <h4 className="hts-label-md text-xs text-[#1A1A1A] mb-3 font-bold">CONTRACTUAL TERMS & CONDITIONS</h4>
          <ul className="space-y-1 text-xs text-[#5c5b5b] hts-body-md leading-relaxed">
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
          className={`mt-8 p-4 flex items-start gap-3 border-2 print:hidden ${
            submitResult.success
              ? "bg-[#87faaa]/20 border-[#006d39] text-[#00210d]"
              : "bg-red-50 border-[#ba1a1a] text-[#93000a]"
          }`}
          style={{ borderRadius: "0px" }}
        >
          {submitResult.success && <CheckCircle className="w-5 h-5 text-[#006d39] shrink-0 mt-0.5" />}
          <div className="text-sm font-sans">
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
            disabled={isSubmitting || rows.length === 0}
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
