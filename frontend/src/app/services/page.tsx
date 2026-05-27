"use client";

import { useEffect, useState } from "react";
import * as Lucide from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useSettings } from "../../context/SettingsContext";

interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  iconName: string;
  serviceCode: string;
  rate: number;
  order: number;
}

export default function ServicesPage() {
  const { settings } = useSettings();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getBackendUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "https://haadtechnicalservicescollc-delta.vercel.app";
  };

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch(`${getBackendUrl()}/api/services`);
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Helper to dynamically resolve Lucide components from their database string identifier
  const getIcon = (name: string) => {
    const IconComp = (Lucide as any)[name];
    if (IconComp) return <IconComp className="w-5 h-5" />;
    return <Lucide.Wrench className="w-5 h-5" />;
  };

  const getSpecialtyIcon = (name: string) => {
    const IconComp = (Lucide as any)[name];
    if (IconComp) return <IconComp className="w-12 h-12 text-white" />;
    return <Lucide.Ship className="w-12 h-12 text-white" />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-[#ba0013] selection:text-white">
      <Header />

      <main className="flex-1 w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-10">
        {/* Title Header */}
        <div className="border-b border-[#1A1A1A] pb-6">
          <span className="hts-label-sm text-xs text-[#006d39] font-bold block mb-1">
            • SERVICE PORTFOLIO
          </span>
          <h2 className="hts-display-lg text-[#1A1A1A] font-black uppercase">TECHNICAL MANPOWER SOLUTIONS</h2>
          <span className="hts-label-md text-xs text-[#5c5b5b] mt-1 block">
            SPECIALIZED INDUSTRIAL AND MARINE WORKFORCE DEPLOYMENT IN DUBAI.
          </span>
        </div>

        {/* Dry Docks Specialty Banner */}
        <section
          className="border-2 border-[#1A1A1A] bg-[#eeeeee] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
          style={{ borderRadius: "0px" }}
        >
          {/* Icon Square */}
          <div className="w-24 h-24 bg-[#ba0013] border-2 border-[#1A1A1A] flex items-center justify-center shrink-0" style={{ borderRadius: "0px" }}>
            {getSpecialtyIcon(settings.coreSpecialtyIcon)}
          </div>
          
          <div className="flex flex-col gap-2">
            <div>
              <span className="px-2.5 py-0.5 bg-[#006d39] text-white hts-label-sm text-[9px] font-bold inline-block" style={{ borderRadius: "0px" }}>
                CORE SPECIALTY
              </span>
            </div>
            <h3 className="hts-headline-md font-bold text-[#1A1A1A] uppercase">
              {settings.coreSpecialtyTitle}
            </h3>
            <p className="hts-body-md text-sm text-[#5c5b5b] leading-relaxed max-w-4xl">
              {settings.coreSpecialtyText}
            </p>
          </div>
        </section>

        {/* Competencies Grid */}
        <section className="flex flex-col gap-6">
          <h4 className="hts-headline-md text-base font-bold text-[#1A1A1A] border-b border-[#1A1A1A] pb-2">
            Comprehensive Manpower Portfolio
          </h4>
          
          {loading ? (
            <div className="text-center py-12 text-[#5c5b5b] hts-label-sm">
              Loading dynamic services registry...
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12 text-[#5c5b5b] hts-label-sm">
              No services registered in the database.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((item) => (
                <div
                  key={item._id}
                  className="border-2 border-[#1A1A1A] bg-white p-6 flex flex-col justify-between gap-6 relative"
                  style={{ borderRadius: "0px" }}
                >
                  {/* Small top-right icon indicator */}
                  <div className="absolute top-4 right-4 text-[#5c5b5b]/40">
                    {getIcon(item.iconName)}
                  </div>

                  <div className="flex flex-col gap-3">
                    <h5 className="hts-headline-md text-base font-black text-[#1A1A1A] border-b border-[#eeeeee] pb-1.5 pr-8">
                      {item.title}
                    </h5>
                    <p className="hts-body-md text-xs text-[#5c5b5b] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center border-t border-[#eeeeee] pt-2">
                    <span className="hts-label-sm text-[9px] text-[#ba0013] font-bold block">
                      {item.serviceCode || `HTS-ROLE: ${item.title.substring(0, 3).toUpperCase()}`}
                    </span>
                    <span className="hts-label-sm text-[9px] text-[#006d39] font-bold block font-mono">
                      RATE: {item.rate.toFixed(2)} AED/HR
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
