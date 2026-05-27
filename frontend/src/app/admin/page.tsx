"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSettings } from "../../context/SettingsContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Lock, Save, Trash2, ClipboardList, Settings as SettingsIcon, FileText, CheckCircle2, AlertTriangle, Search, Eye } from "lucide-react";

interface InquiryLog {
  _id: string;
  entityName: string;
  contactNo: string;
  email: string;
  serviceClassification: string;
  details: string;
  createdAt: string;
}

interface QuotationLog {
  _id: string;
  clientName: string;
  projectRef: string;
  projectLocation: string;
  date: string;
  status: string;
  items: Array<{
    designation: string;
    quantity: number;
    hours: number;
    rate: number;
    total: number;
  }>;
  subtotal: number;
  vat: number;
  total: number;
  createdAt: string;
}

export default function AdminPage() {
  const { settings, updateSettings, refreshSettings } = useSettings();
  
  // Authentication State
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Tab State
  const [activeTab, setActiveTab] = useState<"settings" | "inquiries" | "quotations">("settings");

  // Dynamic Settings Form State
  const [formSettings, setFormSettings] = useState({
    licenseNo: "",
    trnNo: "",
    address: "",
    phone: "",
    email: "",
    fax: "",
    tel: "",
    commercialRegister: "",
    qaText: ""
  });

  // DB Logs States
  const [inquiries, setInquiries] = useState<InquiryLog[]>([]);
  const [quotations, setQuotations] = useState<QuotationLog[]>([]);
  
  // Search & Loading States
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | null; text: string }>({ type: null, text: "" });
  const [selectedQuote, setSelectedQuote] = useState<QuotationLog | null>(null);

  const getBackendUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "https://haadtechnicalservicescollc-delta.vercel.app";
  };

  // Sync settings when loaded
  useEffect(() => {
    if (settings) {
      setFormSettings({
        licenseNo: settings.licenseNo,
        trnNo: settings.trnNo,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        fax: settings.fax,
        tel: settings.tel,
        commercialRegister: settings.commercialRegister,
        qaText: settings.qaText
      });
    }
  }, [settings]);

  // Load Inquiries & Quotations on Authentication
  useEffect(() => {
    if (isAuthenticated) {
      fetchInquiries();
      fetchQuotations();
    }
  }, [isAuthenticated]);

  const fetchInquiries = async () => {
    try {
      const res = await fetch(`${getBackendUrl()}/api/inquiry`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
    }
  };

  const fetchQuotations = async () => {
    try {
      const res = await fetch(`${getBackendUrl()}/api/quotation`);
      if (res.ok) {
        const data = await res.json();
        setQuotations(data);
      }
    } catch (err) {
      console.error("Failed to fetch quotations:", err);
    }
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = password.trim();
    if (cleanPass === "haad" || cleanPass === "haadhts") {
      setIsAuthenticated(true);
      setLoginError("");
      setMessage({ type: "success", text: "Secure Access Granted." });
      setTimeout(() => setMessage({ type: null, text: "" }), 3000);
    } else {
      setLoginError("ACCESS DENIED: INVALID AUTHORIZATION KEY.");
    }
  };

  // Update Settings handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage({ type: null, text: "" });

    const success = await updateSettings(formSettings);
    if (success) {
      await refreshSettings();
      setMessage({ type: "success", text: "Global corporate details updated successfully." });
    } else {
      setMessage({ type: "error", text: "Failed to save corporate configurations. Database offline." });
    }
    setActionLoading(false);
    setTimeout(() => setMessage({ type: null, text: "" }), 4000);
  };

  // Delete Inquiry handler
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry record?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${getBackendUrl()}/api/inquiry/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Inquiry log deleted successfully." });
        setInquiries(prev => prev.filter(item => item._id !== id));
      } else {
        setMessage({ type: "error", text: "Failed to delete inquiry log." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage({ type: null, text: "" }), 4000);
    }
  };

  // Delete Quotation handler
  const handleDeleteQuotation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quotation estimate?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${getBackendUrl()}/api/quotation/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Quotation record deleted successfully." });
        setQuotations(prev => prev.filter(item => item._id !== id));
        if (selectedQuote?._id === id) {
          setSelectedQuote(null);
        }
      } else {
        setMessage({ type: "error", text: "Failed to delete quotation record." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage({ type: null, text: "" }), 4000);
    }
  };

  // Filtering search logs
  const filteredInquiries = inquiries.filter(item => 
    item.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.serviceClassification.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuotations = quotations.filter(item =>
    item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.projectRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.projectLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Secure Password Gate
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F4F4F4] selection:bg-[#ba0013] selection:text-white">
        <Header />
        
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md border-2 border-[#1A1A1A] bg-white p-6 md:p-8 flex flex-col gap-6 relative" style={{ borderRadius: "0px" }}>
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#ba0013]"></div>

            <div className="text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 border border-[#1A1A1A] flex items-center justify-center bg-[#F4F4F4]">
                <Lock className="w-6 h-6 text-[#ba0013]" />
              </div>
              <h2 className="hts-headline-lg text-lg font-black text-[#1A1A1A] mt-2">SECURE CONTROL PANEL</h2>
              <p className="hts-label-sm text-[10px] text-[#5c5b5b] tracking-wider">
                HAAD TECHNICAL SERVICES AUTHORIZED PERSONNEL ONLY
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="hts-label-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider">
                  ENTER SECURE AUTHORIZATION PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="PLACEHOLDER"
                  className="w-full border border-[#1A1A1A] p-3 text-xs font-mono text-center focus:outline-none focus:border-[#ba0013] transition-all bg-[#F9F9F9]"
                  style={{ borderRadius: "0px" }}
                  required
                />
              </div>

              {loginError && (
                <div className="p-2 border border-[#ba0013] bg-[#ba0013]/5 text-[#ba0013] font-mono text-[9px] text-center uppercase tracking-wider">
                  ⚠️ {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#1A1A1A] hover:bg-[#ba0013] text-white font-bold text-xs uppercase tracking-wider transition-all hts-label-sm border border-[#1A1A1A]"
                style={{ borderRadius: "0px" }}
              >
                GRANT ACCESS
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-[#ba0013] selection:text-white">
      <Header />

      <main className="flex-1 w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-8">
        
        {/* Title Header */}
        <div className="border-b border-[#1A1A1A] pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="hts-label-sm text-xs text-[#006d39] font-bold block mb-1">
              • HTS CONTROL SYSTEM PANEL
            </span>
            <h2 className="hts-headline-lg font-black text-[#1A1A1A]">ADMINISTRATION PORTAL</h2>
          </div>

          {/* Secure Status Badge */}
          <div className="flex items-center gap-2 border border-[#006d39] bg-[#006d39]/5 px-3 py-1.5" style={{ borderRadius: "0px" }}>
            <span className="w-2 h-2 bg-[#006d39] animate-pulse"></span>
            <span className="hts-label-sm text-[9px] text-[#006d39] font-mono font-bold tracking-widest">SECURE SESSION ACTIVE</span>
          </div>
        </div>

        {/* Status Notification messages */}
        {message.text && (
          <div
            className={`p-4 flex items-center gap-3 border font-sans text-xs ${
              message.type === "success"
                ? "bg-[#006d39]/10 border-[#006d39] text-[#006d39]"
                : "bg-[#ba0013]/10 border-[#ba0013] text-[#ba0013]"
            }`}
            style={{ borderRadius: "0px" }}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab Navigator Bar */}
        <div className="flex flex-wrap border border-[#1A1A1A]" style={{ borderRadius: "0px" }}>
          <button
            onClick={() => { setActiveTab("settings"); setSelectedQuote(null); }}
            className={`flex-1 md:flex-none px-6 py-3 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 md:border-b-0 md:border-r border-[#1A1A1A] transition-all ${
              activeTab === "settings"
                ? "bg-[#ba0013] text-white"
                : "bg-white text-[#1A1A1A] hover:bg-[#F4F4F4]"
            }`}
            style={{ borderRadius: "0px" }}
          >
            <SettingsIcon className="w-4 h-4" /> Global Settings
          </button>
          
          <button
            onClick={() => { setActiveTab("inquiries"); setSelectedQuote(null); }}
            className={`flex-1 md:flex-none px-6 py-3 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 md:border-b-0 md:border-r border-[#1A1A1A] transition-all ${
              activeTab === "inquiries"
                ? "bg-[#006d39] text-white"
                : "bg-white text-[#1A1A1A] hover:bg-[#F4F4F4]"
            }`}
            style={{ borderRadius: "0px" }}
          >
            <ClipboardList className="w-4 h-4" /> Inquiries ({inquiries.length})
          </button>

          <button
            onClick={() => { setActiveTab("quotations"); setSelectedQuote(null); }}
            className={`flex-1 md:flex-none px-6 py-3 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 md:border-b-0 transition-all ${
              activeTab === "quotations"
                ? "bg-[#1A1A1A] text-white"
                : "bg-white text-[#1A1A1A] hover:bg-[#F4F4F4]"
            }`}
            style={{ borderRadius: "0px" }}
          >
            <FileText className="w-4 h-4" /> Quotations ({quotations.length})
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="w-full">
          
          {/* TAB 1: SITE CONFIGURATION SETTINGS */}
          {activeTab === "settings" && (
            <div className="border border-[#1A1A1A] bg-white p-6 md:p-8 flex flex-col gap-6" style={{ borderRadius: "0px" }}>
              <div className="border-b border-[#eeeeee] pb-3">
                <span className="hts-label-sm text-[10px] text-[#ba0013] font-bold block mb-1">SECTION 1.0</span>
                <h3 className="hts-headline-md text-base font-bold text-[#1A1A1A]">COMPANY GLOBAL CONFIGURATION SETTINGS</h3>
                <p className="text-xs text-[#5c5b5b] mt-1 font-sans">
                  Modifying these variables updates all Header, Footer, and Contact details site-wide in real time.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Licensing details */}
                  <div className="flex flex-col gap-1.5">
                    <label className="hts-label-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider font-mono">
                      TRADE LICENSE NUMBER
                    </label>
                    <input
                      type="text"
                      value={formSettings.licenseNo}
                      onChange={(e) => setFormSettings({...formSettings, licenseNo: e.target.value})}
                      placeholder="PLACEHOLDER"
                      className="w-full border border-[#1A1A1A] p-2.5 text-xs font-mono bg-[#F9F9F9] focus:bg-white focus:outline-none focus:border-[#ba0013] transition-all"
                      style={{ borderRadius: "0px" }}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="hts-label-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider font-mono">
                      TAX REGISTER NUMBER (TRN)
                    </label>
                    <input
                      type="text"
                      value={formSettings.trnNo}
                      onChange={(e) => setFormSettings({...formSettings, trnNo: e.target.value})}
                      placeholder="PLACEHOLDER"
                      className="w-full border border-[#1A1A1A] p-2.5 text-xs font-mono bg-[#F9F9F9] focus:bg-white focus:outline-none focus:border-[#ba0013] transition-all"
                      style={{ borderRadius: "0px" }}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="hts-label-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider font-mono">
                      COMMERCIAL REGISTER CODE
                    </label>
                    <input
                      type="text"
                      value={formSettings.commercialRegister}
                      onChange={(e) => setFormSettings({...formSettings, commercialRegister: e.target.value})}
                      placeholder="PLACEHOLDER"
                      className="w-full border border-[#1A1A1A] p-2.5 text-xs font-mono bg-[#F9F9F9] focus:bg-white focus:outline-none focus:border-[#ba0013] transition-all"
                      style={{ borderRadius: "0px" }}
                      required
                    />
                  </div>

                  {/* Phone & Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="hts-label-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider font-mono">
                      DIRECT LINE MOBILE
                    </label>
                    <input
                      type="text"
                      value={formSettings.phone}
                      onChange={(e) => setFormSettings({...formSettings, phone: e.target.value})}
                      placeholder="PLACEHOLDER"
                      className="w-full border border-[#1A1A1A] p-2.5 text-xs font-mono bg-[#F9F9F9] focus:bg-white focus:outline-none focus:border-[#ba0013] transition-all"
                      style={{ borderRadius: "0px" }}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="hts-label-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider font-mono">
                      OFFICIAL EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      value={formSettings.email}
                      onChange={(e) => setFormSettings({...formSettings, email: e.target.value})}
                      placeholder="PLACEHOLDER"
                      className="w-full border border-[#1A1A1A] p-2.5 text-xs font-mono bg-[#F9F9F9] focus:bg-white focus:outline-none focus:border-[#ba0013] transition-all"
                      style={{ borderRadius: "0px" }}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="hts-label-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider font-mono">
                        OFFICE TEL
                      </label>
                      <input
                        type="text"
                        value={formSettings.tel}
                        onChange={(e) => setFormSettings({...formSettings, tel: e.target.value})}
                        placeholder="PLACEHOLDER"
                        className="w-full border border-[#1A1A1A] p-2.5 text-xs font-mono bg-[#F9F9F9] focus:bg-white focus:outline-none focus:border-[#ba0013] transition-all"
                        style={{ borderRadius: "0px" }}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="hts-label-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider font-mono">
                        FAX LINE
                      </label>
                      <input
                        type="text"
                        value={formSettings.fax}
                        onChange={(e) => setFormSettings({...formSettings, fax: e.target.value})}
                        placeholder="PLACEHOLDER"
                        className="w-full border border-[#1A1A1A] p-2.5 text-xs font-mono bg-[#F9F9F9] focus:bg-white focus:outline-none focus:border-[#ba0013] transition-all"
                        style={{ borderRadius: "0px" }}
                      />
                    </div>
                  </div>

                  {/* HQ Address */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="hts-label-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider font-mono">
                      OFFICE HEADQUARTERS ADDRESS
                    </label>
                    <input
                      type="text"
                      value={formSettings.address}
                      onChange={(e) => setFormSettings({...formSettings, address: e.target.value})}
                      placeholder="PLACEHOLDER"
                      className="w-full border border-[#1A1A1A] p-2.5 text-xs font-sans bg-[#F9F9F9] focus:bg-white focus:outline-none focus:border-[#ba0013] transition-all"
                      style={{ borderRadius: "0px" }}
                      required
                    />
                  </div>

                  {/* Quality Assurance text block */}
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="hts-label-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider font-mono">
                      QUALITY ASSURANCE & REGULATORY DECLARATION TEXT (FOOTER block)
                    </label>
                    <textarea
                      value={formSettings.qaText}
                      onChange={(e) => setFormSettings({...formSettings, qaText: e.target.value})}
                      placeholder="PLACEHOLDER"
                      rows={4}
                      className="w-full border border-[#1A1A1A] p-2.5 text-xs font-sans bg-[#F9F9F9] focus:bg-white focus:outline-none focus:border-[#ba0013] transition-all resize-none"
                      style={{ borderRadius: "0px" }}
                      required
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full md:w-auto self-end px-8 py-3 bg-[#ba0013] hover:bg-[#e31e24] disabled:bg-[#dadada] text-white font-bold text-xs uppercase tracking-wider transition-all hts-label-sm border border-[#ba0013] flex items-center justify-center gap-2"
                  style={{ borderRadius: "0px" }}
                >
                  <Save className="w-4 h-4" /> {actionLoading ? "SAVING SETTINGS..." : "SAVE SETTINGS"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: INQUIRY LOGS MANAGEMENT */}
          {activeTab === "inquiries" && (
            <div className="border border-[#1A1A1A] bg-white p-6 flex flex-col gap-6" style={{ borderRadius: "0px" }}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#eeeeee] pb-4">
                <div>
                  <span className="hts-label-sm text-[10px] text-[#006d39] font-bold block mb-1">SECTION 2.0</span>
                  <h3 className="hts-headline-md text-base font-bold text-[#1A1A1A]">SERVICE INQUIRY SUBMISSIONS</h3>
                </div>

                {/* Search box */}
                <div className="relative w-full md:w-72">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-[#5c5b5b]" />
                  </span>
                  <input
                    type="text"
                    placeholder="PLACEHOLDER"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-[#1A1A1A] text-xs font-mono focus:outline-none bg-[#F9F9F9]"
                    style={{ borderRadius: "0px" }}
                  />
                </div>
              </div>

              {/* Inquiry Logs list table */}
              <div className="overflow-x-auto border border-[#1A1A1A]" style={{ borderRadius: "0px" }}>
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-[#1A1A1A] text-white border-b border-[#1A1A1A] hts-label-sm text-[10px]">
                      <th className="p-3 font-bold border-r border-[#1A1A1A] w-36">DATE / TIME</th>
                      <th className="p-3 font-bold border-r border-[#1A1A1A] w-52">ENTITY NAME</th>
                      <th className="p-3 font-bold border-r border-[#1A1A1A] w-36">CONTACT NO</th>
                      <th className="p-3 font-bold border-r border-[#1A1A1A] w-48">EMAIL ADDRESS</th>
                      <th className="p-3 font-bold border-r border-[#1A1A1A] w-48">CLASSIFICATION</th>
                      <th className="p-3 font-bold border-r border-[#1A1A1A]">DETAILS</th>
                      <th className="p-3 font-bold text-center w-20">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-xs font-mono text-[#5c5b5b]">
                          NO INQUIRY LOGS REGISTERED IN DATABASE.
                        </td>
                      </tr>
                    ) : (
                      filteredInquiries.map((item) => (
                        <tr key={item._id} className="border-b border-[#eeeeee] last:border-b-0 hover:bg-[#F9F9F9] text-xs font-sans text-[#1a1c1c]">
                          <td className="p-3 border-r border-[#eeeeee] font-mono text-[10px] text-[#5c5b5b]">
                            {new Date(item.createdAt).toLocaleString("en-AE")}
                          </td>
                          <td className="p-3 border-r border-[#eeeeee] font-bold uppercase">
                            {item.entityName}
                          </td>
                          <td className="p-3 border-r border-[#eeeeee] font-mono text-[11px]">
                            {item.contactNo}
                          </td>
                          <td className="p-3 border-r border-[#eeeeee] font-mono text-[11px] select-all">
                            {item.email}
                          </td>
                          <td className="p-3 border-r border-[#eeeeee] font-mono text-[10px] text-[#006d39] font-bold">
                            {item.serviceClassification.toUpperCase()}
                          </td>
                          <td className="p-3 border-r border-[#eeeeee] whitespace-normal leading-relaxed text-[#5c5b5b]">
                            {item.details || <span className="italic text-[#dadada]">No details provided</span>}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteInquiry(item._id)}
                              className="p-1.5 border border-[#ba0013] text-[#ba0013] hover:bg-[#ba0013]/5 transition-all"
                              style={{ borderRadius: "0px" }}
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: QUOTATION LOGS REGISTRY */}
          {activeTab === "quotations" && (
            <div className="flex flex-col gap-6">
              
              <div className="border border-[#1A1A1A] bg-white p-6 flex flex-col gap-6" style={{ borderRadius: "0px" }}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#eeeeee] pb-4">
                  <div>
                    <span className="hts-label-sm text-[10px] text-[#ba0013] font-bold block mb-1">SECTION 3.0</span>
                    <h3 className="hts-headline-md text-base font-bold text-[#1A1A1A]">MANPOWER QUOTATIONS REGISTRY</h3>
                  </div>

                  {/* Search box */}
                  <div className="relative w-full md:w-72">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-[#5c5b5b]" />
                    </span>
                    <input
                      type="text"
                      placeholder="PLACEHOLDER"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-[#1A1A1A] text-xs font-mono focus:outline-none bg-[#F9F9F9]"
                      style={{ borderRadius: "0px" }}
                    />
                  </div>
                </div>

                {/* Quotations List table */}
                <div className="overflow-x-auto border border-[#1A1A1A]" style={{ borderRadius: "0px" }}>
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-[#1A1A1A] text-white border-b border-[#1A1A1A] hts-label-sm text-[10px]">
                        <th className="p-3 font-bold border-r border-[#1A1A1A] w-36">DATE / TIME</th>
                        <th className="p-3 font-bold border-r border-[#1A1A1A] w-32">REFERENCE</th>
                        <th className="p-3 font-bold border-r border-[#1A1A1A] w-48">CLIENT NAME</th>
                        <th className="p-3 font-bold border-r border-[#1A1A1A] w-48">SITE LOCATION</th>
                        <th className="p-3 font-bold border-r border-[#1A1A1A] text-center w-24">ITEMS</th>
                        <th className="p-3 font-bold border-r border-[#1A1A1A] text-right w-36">TOTAL VALUE</th>
                        <th className="p-3 font-bold border-r border-[#1A1A1A] text-center w-24">STATUS</th>
                        <th className="p-3 font-bold text-center w-28">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuotations.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-xs font-mono text-[#5c5b5b]">
                            NO QUOTATION SUBMISSIONS REGISTERED IN DATABASE.
                          </td>
                        </tr>
                      ) : (
                        filteredQuotations.map((quote) => (
                          <tr key={quote._id} className="border-b border-[#eeeeee] last:border-b-0 hover:bg-[#F9F9F9] text-xs font-sans text-[#1a1c1c]">
                            <td className="p-3 border-r border-[#eeeeee] font-mono text-[10px] text-[#5c5b5b]">
                              {new Date(quote.createdAt).toLocaleString("en-AE")}
                            </td>
                            <td className="p-3 border-r border-[#eeeeee] font-mono text-[10px] font-bold text-blue-600 select-all">
                              {quote.projectRef}
                            </td>
                            <td className="p-3 border-r border-[#eeeeee] font-bold uppercase">
                              {quote.clientName}
                            </td>
                            <td className="p-3 border-r border-[#eeeeee] text-[#5c5b5b]">
                              {quote.projectLocation}
                            </td>
                            <td className="p-3 border-r border-[#eeeeee] text-center font-mono font-bold text-[#1A1A1A]">
                              {quote.items.length}
                            </td>
                            <td className="p-3 border-r border-[#eeeeee] text-right font-mono font-bold text-[#ba0013]">
                              {quote.total.toLocaleString("en-AE", { minimumFractionDigits: 2 })} AED
                            </td>
                            <td className="p-3 border-r border-[#eeeeee] text-center">
                              <span className={`inline-block px-2 py-0.5 font-bold hts-label-sm text-[8px] uppercase ${
                                quote.status === "urgent" 
                                  ? "bg-[#ba0013] text-white" 
                                  : quote.status === "active" 
                                    ? "bg-[#006d39] text-white" 
                                    : "bg-[#5c5b5b] text-white"
                              }`} style={{ borderRadius: "0px" }}>
                                {quote.status}
                              </span>
                            </td>
                            <td className="p-3 text-center flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedQuote(quote)}
                                className="p-1.5 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition-all"
                                style={{ borderRadius: "0px" }}
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              
                              <button
                                onClick={() => handleDeleteQuotation(quote._id)}
                                className="p-1.5 border border-[#ba0013] text-[#ba0013] hover:bg-[#ba0013]/5 transition-all"
                                style={{ borderRadius: "0px" }}
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Individual Quote Detail Inspector Card */}
              {selectedQuote && (
                <div className="border border-[#1A1A1A] bg-white p-6 flex flex-col gap-6 relative" style={{ borderRadius: "0px" }}>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#ba0013]"></div>

                  <div className="flex justify-between items-start border-b border-[#eeeeee] pb-4">
                    <div>
                      <span className="hts-label-sm text-[9px] text-[#5c5b5b] block font-mono">SPECIFICATION VIEWER</span>
                      <h4 className="hts-headline-md text-sm font-bold text-[#1A1A1A]">
                        QUOTATION REFERENCE: <span className="font-mono text-blue-600">{selectedQuote.projectRef}</span>
                      </h4>
                    </div>
                    <button 
                      onClick={() => setSelectedQuote(null)}
                      className="text-xs font-bold text-[#ba0013] hover:underline"
                    >
                      [CLOSE VIEWER]
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-[#5c5b5b]">
                    <p><strong>Client Entity:</strong> <span className="text-[#1A1A1A] font-bold uppercase">{selectedQuote.clientName}</span></p>
                    <p><strong>Document Date:</strong> <span className="text-[#1A1A1A] font-mono">{selectedQuote.date}</span></p>
                    <p><strong>Work Site location:</strong> <span className="text-[#1A1A1A]">{selectedQuote.projectLocation}</span></p>
                    <p><strong>Registry Timestamp:</strong> <span className="text-[#1A1A1A] font-mono">{new Date(selectedQuote.createdAt).toLocaleString()}</span></p>
                  </div>

                  <div className="overflow-x-auto border border-[#1A1A1A]" style={{ borderRadius: "0px" }}>
                    <table className="w-full text-left border-collapse text-xs font-sans">
                      <thead>
                        <tr className="bg-[#F4F4F4] border-b border-[#1A1A1A] font-mono text-[10px] text-[#1A1A1A]">
                          <th className="p-3 font-bold border-r border-[#1A1A1A] w-12 text-center">NO</th>
                          <th className="p-3 font-bold border-r border-[#1A1A1A]">DESIGNATION</th>
                          <th className="p-3 font-bold border-r border-[#1A1A1A] text-center w-24">STAFF QTY</th>
                          <th className="p-3 font-bold border-r border-[#1A1A1A] text-center w-24">HOURS/STAFF</th>
                          <th className="p-3 font-bold border-r border-[#1A1A1A] text-right w-28">RATE / HR</th>
                          <th className="p-3 font-bold text-right w-32">TOTAL AED</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedQuote.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-[#eeeeee] last:border-b-0 hover:bg-[#F9F9F9]">
                            <td className="p-3 border-r border-[#eeeeee] text-center font-mono text-[#5c5b5b]">{idx + 1}</td>
                            <td className="p-3 border-r border-[#eeeeee] font-bold uppercase">{item.designation}</td>
                            <td className="p-3 border-r border-[#eeeeee] text-center font-mono">{item.quantity}</td>
                            <td className="p-3 border-r border-[#eeeeee] text-center font-mono">{item.hours}</td>
                            <td className="p-3 border-r border-[#eeeeee] text-right font-mono">{item.rate.toFixed(2)} AED</td>
                            <td className="p-3 text-right font-mono font-bold text-[#1A1A1A]">{item.total.toLocaleString("en-AE", { minimumFractionDigits: 2 })} AED</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 text-xs font-mono font-bold bg-[#F4F4F4] p-4 border border-[#1A1A1A] self-end w-full md:w-80">
                    <div className="flex justify-between w-full text-[#5c5b5b]">
                      <span>SUBTOTAL:</span>
                      <span>{selectedQuote.subtotal.toLocaleString("en-AE", { minimumFractionDigits: 2 })} AED</span>
                    </div>
                    <div className="flex justify-between w-full text-[#5c5b5b] border-b border-[#eeeeee] pb-1.5">
                      <span>VAT (5%):</span>
                      <span>{selectedQuote.vat.toLocaleString("en-AE", { minimumFractionDigits: 2 })} AED</span>
                    </div>
                    <div className="flex justify-between w-full text-sm text-[#ba0013] pt-1">
                      <span>TOTAL AED:</span>
                      <span>{selectedQuote.total.toLocaleString("en-AE", { minimumFractionDigits: 2 })} AED</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
