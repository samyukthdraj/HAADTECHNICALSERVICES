"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import QuotationCalculator from "../components/QuotationCalculator";
import { Hammer, Users, Lightbulb, Compass, Award, ShieldCheck } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function Home() {
  const { settings } = useSettings();

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-[#ba0013] selection:text-white">
      {/* Navigation Header */}
      <Header />

      {/* Main Page Layout */}
      <main className="flex-1 w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-12">
        
        {/* Section 1: Hero / Corporate Profile */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border-2 border-[#1A1A1A] bg-white relative p-6 md:p-10" style={{ borderRadius: "0px" }}>
          {/* Top Industrial Banner */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#ba0013]"></div>

          {/* Left Column: Mission & Statement */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-4">
              <span className="hts-label-sm text-[#006d39] font-bold tracking-[0.2em] block">
                • DUBAI TECHNICAL SERVICES PROVIDER
              </span>
              <h2 className="hts-display-lg font-black text-[#1A1A1A] leading-tight">
                INDUSTRIAL SCALE PRECISION CONTRACTING & MANPOWER
              </h2>
              <p className="hts-body-lg text-[#5c5b5b] leading-relaxed">
                HAAD Technical Services Co. L.L.C. is an engineered solutions contractor based in Dubai, UAE. We specialize in MEP contracting, electrical installations, HVAC retrofits, and high-quality skilled manpower supply for commercial, civil, and industrial developments.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#estimator"
                className="px-6 py-3 bg-[#ba0013] text-white border-2 border-[#ba0013] hover:bg-[#e31e24] hover:border-[#e31e24] transition-all hts-label-sm text-xs font-bold text-center"
                style={{ borderRadius: "0px" }}
              >
                Estimate Manpower Cost
              </a>
              <a
                href="#services"
                className="px-6 py-3 border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F4F4F4] transition-all hts-label-sm text-xs font-bold text-center"
                style={{ borderRadius: "0px" }}
              >
                Our Capabilities
              </a>
            </div>
          </div>

          {/* Right Column: Key Industrial Metrics */}
          <div className="lg:col-span-5 bg-[#F4F4F4] border border-[#1A1A1A] p-6 flex flex-col justify-between gap-6" style={{ borderRadius: "0px" }}>
            <div className="border-b border-[#1A1A1A] pb-3">
              <h3 className="hts-label-md text-xs font-bold text-[#1A1A1A]">HTS SYSTEM MATRICES</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[#1A1A1A] bg-white p-4 text-center">
                <span className="hts-label-sm text-[10px] text-[#5c5b5b] block">ACTIVE STAFF</span>
                <span className="hts-display-lg text-3xl font-black text-[#ba0013] block mt-1">450+</span>
                <span className="hts-label-sm text-[9px] text-[#006d39] block mt-0.5">VETTED TECHNICIANS</span>
              </div>
              
              <div className="border border-[#1A1A1A] bg-white p-4 text-center">
                <span className="hts-label-sm text-[10px] text-[#5c5b5b] block">COMPLETED PROJECTS</span>
                <span className="hts-display-lg text-3xl font-black text-[#1A1A1A] block mt-1">120+</span>
                <span className="hts-label-sm text-[9px] text-[#5c5b5b] block mt-0.5">IN UAE DUBAI</span>
              </div>

              <div className="border border-[#1A1A1A] bg-white p-4 text-center col-span-2">
                <span className="hts-label-sm text-[10px] text-[#5c5b5b] block">TAX COMPLIANCE</span>
                <span className="hts-label-md text-xs font-bold text-[#006d39] block mt-2 font-mono">VAT REGISTERED (5%)</span>
                <span className="hts-label-sm text-[9px] text-[#5c5b5b] block mt-0.5 font-mono">TRN NO: {settings.trnNo}</span>
              </div>
            </div>

            <div className="text-xs text-[#5c5b5b] flex items-center justify-center gap-2 hts-label-sm">
              <Award className="w-4 h-4 text-[#ba0013]" /> REGISTERED COMMERCIAL LICENSE NO. {settings.licenseNo}
            </div>
          </div>
        </section>

        {/* Section 2: Core Expertise Areas (Grid) */}
        <section id="services" className="flex flex-col gap-6">
          <div className="flex flex-col gap-1 border-l-4 border-[#ba0013] pl-3">
            <span className="hts-label-sm text-xs text-[#006d39] font-bold">HTS OPERATIONS</span>
            <h3 className="hts-headline-lg font-black text-[#1A1A1A]">CORE CONTRACTING CAPABILITIES</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1 */}
            <div className="border-2 border-[#1A1A1A] bg-white p-6 flex flex-col justify-between gap-4" style={{ borderRadius: "0px" }}>
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 border border-[#1A1A1A] flex items-center justify-center bg-[#F4F4F4]">
                  <Hammer className="w-5 h-5 text-[#ba0013]" />
                </div>
                <h4 className="hts-headline-md text-lg font-bold text-[#1A1A1A]">MEP CONTRACTING</h4>
                <p className="hts-body-md text-sm text-[#5c5b5b] leading-relaxed">
                  Design, installation, commissioning and maintenance of mechanical, electrical, and plumbing engineering frameworks. High density drawings and structural layout design.
                </p>
              </div>
              <span className="hts-label-sm text-[10px] text-[#ba0013] font-bold">CO-OP CODE: HTS-MEP</span>
            </div>

            {/* Box 2 */}
            <div className="border-2 border-[#1A1A1A] bg-white p-6 flex flex-col justify-between gap-4" style={{ borderRadius: "0px" }}>
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 border border-[#1A1A1A] flex items-center justify-center bg-[#F4F4F4]">
                  <Users className="w-5 h-5 text-[#006d39]" />
                </div>
                <h4 className="hts-headline-md text-lg font-bold text-[#1A1A1A]">MANPOWER PROVISIONS</h4>
                <p className="hts-body-md text-sm text-[#5c5b5b] leading-relaxed">
                  On-demand supply of skilled, semi-skilled, and general laborers. Vetted HVAC technicians, certified electricians, pipe-fitters, civil technicians, and industrial welders.
                </p>
              </div>
              <span className="hts-label-sm text-[10px] text-[#006d39] font-bold">CO-OP CODE: HTS-MWS</span>
            </div>

            {/* Box 3 */}
            <div className="border-2 border-[#1A1A1A] bg-white p-6 flex flex-col justify-between gap-4" style={{ borderRadius: "0px" }}>
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 border border-[#1A1A1A] flex items-center justify-center bg-[#F4F4F4]">
                  <Lightbulb className="w-5 h-5 text-[#ba0013]" />
                </div>
                <h4 className="hts-headline-md text-lg font-bold text-[#1A1A1A]">FACILITIES MANAGEMENT</h4>
                <p className="hts-body-md text-sm text-[#5c5b5b] leading-relaxed">
                  Preventive maintenance contracts, HVAC troubleshooting, emergency backup lighting setups, water pump overhauls, and general technical services for property managers.
                </p>
              </div>
              <span className="hts-label-sm text-[10px] text-[#1A1A1A] font-bold">CO-OP CODE: HTS-FMS</span>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive Quotation Estimator Sheet */}
        <section id="estimator" className="flex flex-col gap-6">
          <div className="flex flex-col gap-1 border-l-4 border-[#ba0013] pl-3">
            <span className="hts-label-sm text-xs text-[#006d39] font-bold">CALCULATION CONSOLE</span>
            <h3 className="hts-headline-lg font-black text-[#1A1A1A]">TECHNICAL MANPOWER BID GENERATION</h3>
          </div>
          
          <QuotationCalculator />
        </section>

        {/* Section 4: Informative Compliance Strip */}
        <section className="bg-[#1A1A1A] text-white p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-b-4 border-[#006d39]" style={{ borderRadius: "0px" }}>
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-8 h-8 text-[#008f4c] shrink-0" />
            <div>
              <h5 className="hts-label-md text-xs font-bold text-white">SAFETY FIRST PROTOCOL</h5>
              <p className="text-xs text-[#dadada] mt-1 font-sans">
                Full compliance with Dubai OHS regulations and civil defense guidelines. Strict PPE enforcement on every worksite.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Compass className="w-8 h-8 text-[#e31e24] shrink-0" />
            <div>
              <h5 className="hts-label-md text-xs font-bold text-white">DUBAI-WIDE OPERATIONS</h5>
              <p className="text-xs text-[#dadada] mt-1 font-sans">
                Active servicing across Jebel Ali, Al Quoz, Garhoud, Dubai Marina, Downtown, and industrial zones across UAE.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Award className="w-8 h-8 text-[#008f4c] shrink-0" />
            <div>
              <h5 className="hts-label-md text-xs font-bold text-white">LICENSED CONTRACTORS</h5>
              <p className="text-xs text-[#dadada] mt-1 font-sans">
                Fully registered trade entity. Certified under License No. {settings.licenseNo} to perform professional MEP services.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Corporate Document Style Footer */}
      <Footer />
    </div>
  );
}
