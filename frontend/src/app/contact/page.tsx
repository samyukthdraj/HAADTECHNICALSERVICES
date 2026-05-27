"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Phone, Mail, MapPin, ClipboardList, CheckCircle2, AlertTriangle } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

export default function ContactPage() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    entityName: "",
    contactNo: "",
    email: "",
    serviceClassification: "General Technical Services",
    details: "",
  });

  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.entityName || !formData.contactNo || !formData.email) {
      setStatus({
        type: "error",
        message: "Required fields (Requester Entity Name, Contact No, Email) are missing.",
      });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://haadtechnicalservicescollc-delta.vercel.app";
      const response = await fetch(`${backendUrl}/api/inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({
          type: "success",
          message: data.message || "Service inquiry logged successfully.",
        });
        // Clear form
        setFormData({
          entityName: "",
          contactNo: "",
          email: "",
          serviceClassification: "General Technical Services",
          details: "",
        });
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to submit inquiry log to the server.",
        });
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatus({
        type: "error",
        message: "Network error: Connection to HAAD Technical Services ERP server failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  const hasContactCards = settings.phone || settings.email || settings.address;

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-[#ba0013] selection:text-white">
      <Header />

      <main className="flex-1 w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-10">
        {/* Title Header */}
        <div className="border-b border-[#1A1A1A] pb-6">
          <span className="hts-label-sm text-xs text-[#006d39] font-bold block mb-1">
            • COMMUNICATION HUBS
          </span>
          <h2 className="hts-display-lg text-[#1A1A1A] font-black uppercase">CONTACT OPERATIONS</h2>
          <span className="hts-label-md text-xs text-[#5c5b5b] mt-1 block">
            DIRECT COMMUNICATION CHANNELS FOR TECHNICAL INQUIRIES AND MANPOWER DEPLOYMENT IN DUBAI.
          </span>
        </div>

        {/* Content Columns Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info Cards */}
          {hasContactCards && (
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Card 1: Direct Line */}
              {settings.phone && (
                <div className="border border-[#1A1A1A] bg-white p-5 flex flex-col gap-2" style={{ borderRadius: "0px" }}>
                  <span className="hts-label-sm text-[10px] text-[#ba0013] font-bold flex items-center gap-1.5 border-b border-[#eeeeee] pb-1.5">
                    <Phone className="w-3.5 h-3.5" /> DIRECT LINE
                  </span>
                  <p className="hts-body-md text-[11px] text-[#5c5b5b] font-sans">
                    Immediate response for urgent technical services.
                  </p>
                  <span className="hts-display-lg text-xl md:text-2xl font-black text-[#1A1A1A] mt-1 block tracking-tight">
                    {settings.phone}
                  </span>
                </div>
              )}

              {/* Card 2: Official Comm */}
              {settings.email && (
                <div className="border border-[#1A1A1A] bg-white p-5 flex flex-col gap-2" style={{ borderRadius: "0px" }}>
                  <span className="hts-label-sm text-[10px] text-[#006d39] font-bold flex items-center gap-1.5 border-b border-[#eeeeee] pb-1.5">
                    <Mail className="w-3.5 h-3.5" /> OFFICIAL COMM
                  </span>
                  <p className="hts-body-md text-[11px] text-[#5c5b5b] font-sans">
                    For project proposals, quotes, and documentation.
                  </p>
                  <span className="hts-display-lg text-sm md:text-base font-bold text-[#1A1A1A] mt-1 block tracking-tight select-all break-all">
                    {settings.email}
                  </span>
                </div>
              )}

              {/* Card 3: HQ Dubai + Image */}
              {settings.address && (
                <div className="border border-[#1A1A1A] bg-white p-5 flex flex-col gap-4" style={{ borderRadius: "0px" }}>
                  <div className="flex flex-col gap-1">
                    <span className="hts-label-sm text-[10px] text-[#1A1A1A] font-bold flex items-center gap-1.5 border-b border-[#eeeeee] pb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#ba0013]" /> HQ DUBAI
                    </span>
                    <p className="text-[11px] text-[#5c5b5b] font-sans mt-2 leading-relaxed">
                      <strong>HQ:</strong> {settings.address.toUpperCase()}
                    </p>
                  </div>

                  {/* Cityscape Image Container */}
                  <div className="relative w-full h-[180px] border border-[#1A1A1A]" style={{ borderRadius: "0px" }}>
                    <Image
                      src="/dubai_garhoud.png"
                      alt="Dubai Garhoud Cityscape"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
              )}

            </div>
          )}

          <div className={`${hasContactCards ? "lg:col-span-7" : "lg:col-span-12"} border border-[#1A1A1A] bg-white p-6 md:p-8 flex flex-col gap-6`} style={{ borderRadius: "0px" }}>
            <span className="hts-label-sm text-xs text-[#006d39] font-bold flex items-center gap-2 border-b border-[#1A1A1A] pb-3 uppercase">
              <ClipboardList className="w-4 h-4 text-[#ba0013]" /> SERVICE INQUIRY LOG
            </span>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Row 1: Name and Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="hts-label-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider">
                    REQ. ENTITY NAME *
                  </label>
                  <input
                    type="text"
                    name="entityName"
                    value={formData.entityName}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full border border-[#1A1A1A] p-2.5 text-xs font-mono focus:outline-none focus:border-[#ba0013] transition-all bg-[#F9F9F9]"
                    style={{ borderRadius: "0px" }}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="hts-label-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider">
                    CONTACT NO. *
                  </label>
                  <input
                    type="text"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    placeholder=""
                    className="w-full border border-[#1A1A1A] p-2.5 text-xs font-mono focus:outline-none focus:border-[#ba0013] transition-all bg-[#F9F9F9]"
                    style={{ borderRadius: "0px" }}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Email */}
              <div className="flex flex-col gap-1.5">
                <label className="hts-label-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder=""
                  className="w-full border border-[#1A1A1A] p-2.5 text-xs font-mono focus:outline-none focus:border-[#ba0013] transition-all bg-[#F9F9F9]"
                  style={{ borderRadius: "0px" }}
                  required
                />
              </div>

              {/* Row 3: Service dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="hts-label-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider">
                  SERVICE CLASSIFICATION
                </label>
                <select
                  name="serviceClassification"
                  value={formData.serviceClassification}
                  onChange={handleChange}
                  className="w-full border border-[#1A1A1A] p-2.5 text-xs font-mono focus:outline-none focus:border-[#ba0013] transition-all bg-[#F9F9F9]"
                  style={{ borderRadius: "0px" }}
                >
                  <option value="General Technical Services">General Technical Services</option>
                  <option value="MEP Contracting">MEP Contracting</option>
                  <option value="Manpower Provision">Manpower Provision</option>
                  <option value="Facilities Management">Facilities Management</option>
                </select>
              </div>

              {/* Row 4: Details Textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="hts-label-sm text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider">
                  OPERATIONAL REQUIREMENT DETAILS
                </label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder=""
                  rows={4}
                  className="w-full border border-[#1A1A1A] p-2.5 text-xs font-sans focus:outline-none focus:border-[#ba0013] transition-all bg-[#F9F9F9] resize-none"
                  style={{ borderRadius: "0px" }}
                />
              </div>

              {/* Status Alert Notification */}
              {status.type && (
                <div
                  className={`p-3 flex items-start gap-2 border font-sans text-xs ${
                    status.type === "success"
                      ? "bg-[#006d39]/10 border-[#006d39] text-[#006d39]"
                      : "bg-[#ba0013]/10 border-[#ba0013] text-[#ba0013]"
                  }`}
                  style={{ borderRadius: "0px" }}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#e31e24] hover:bg-[#ba0013] disabled:bg-[#dadada] disabled:border-[#dadada] text-white font-bold text-xs uppercase tracking-wider transition-all hts-label-sm border border-[#e31e24]"
                style={{ borderRadius: "0px" }}
              >
                {loading ? "Registering Inquiry Log..." : "SUBMIT INQUIRY LOG"}
              </button>

            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
