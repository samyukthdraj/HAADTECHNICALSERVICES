"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CompanySettings {
  licenseNo: string;
  trnNo: string;
  address: string;
  phone: string;
  email: string;
  fax: string;
  tel: string;
  commercialRegister: string;
  qaText: string;
  
  // Core Specialty Banner Details
  coreSpecialtyIcon: string;
  coreSpecialtyTitle: string;
  coreSpecialtyText: string;

  // About Section Details
  aboutMissionTitle: string;
  aboutMissionText: string;
  aboutSafetyTitle: string;
  aboutSafetyText: string;
  
  // Competencies details
  competency1Title: string;
  competency1Text: string;
  competency2Title: string;
  competency2Text: string;
  competency3Title: string;
  competency3Text: string;
  
  // Services Outline (Newline separated)
  servicesOutline: string;
}

const DEFAULT_SETTINGS: CompanySettings = {
  licenseNo: "884721",
  trnNo: "100482591600003",
  address: "Office 402, Al Garhoud Business Center, Near GGICO Metro Station, Garhoud, Dubai, UAE",
  phone: "+971 50 6790358",
  email: "abdullakalathil32@gmail.com",
  fax: "+971 4 299 9998",
  tel: "+971 4 299 9999",
  commercialRegister: "139581",
  qaText: "All technical operations, mechanical installations, and manpower provisions are governed by the Federal Decree-Law No. (33) of 2021 regarding the Regulation of Labour Relations. We ensure strictly vetted technicians, compliance with Dubai Municipality safety codes, and full ISO 9001:2015 quality standards.",
  
  coreSpecialtyIcon: "Ship",
  coreSpecialtyTitle: "MANPOWER SERVICES REGULARLY PROVIDED TO DRY DOCKS WORLD DUBAI",
  coreSpecialtyText: "We are a trusted partner for large-scale marine and industrial operations, supplying highly skilled, certified personnel ready for immediate deployment in high-stakes technical environments.",

  aboutMissionTitle: "BUILDING THE FOUNDATION OF INDUSTRIAL EXCELLENCE",
  aboutMissionText: "HAADTECHNICALSERVICES CO. L.L.C is a premier provider of structural and manpower solutions in the Dubai industrial sector. We deliver uncompromising quality and safety for projects of all scales.",
  aboutSafetyTitle: "Zero Incident Target",
  aboutSafetyText: "Safety is not an option; it is built into our core operations. Rigorous training and strict compliance with Dubai's regulatory standards.",
  
  competency1Title: "STRUCTURAL FABRICATION",
  competency1Text: "High-precision steel and metal fabrication for industrial facilities.",
  competency2Title: "MANPOWER PROVISION",
  competency2Text: "Supplying certified and experienced technical crews for large-scale operations.",
  competency3Title: "EQUIPMENT MAINTENANCE",
  competency3Text: "Scheduled and emergency maintenance for heavy industrial machinery.",
  
  servicesOutline: "Electrical Contracting\nMechanical & Plumbing\nAir Conditioning & HVAC\nTechnical Manpower Supply\nFacilities Management"
};

interface SettingsContextProps {
  settings: CompanySettings;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<CompanySettings>) => Promise<boolean>;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CompanySettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getBackendUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "https://haadtechnicalservicescollc-delta.vercel.app";
  };

  const refreshSettings = async () => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/settings`);
      if (!response.ok) {
        throw new Error("Failed to fetch settings from database.");
      }
      const data = await response.json();
      if (data) {
        setSettings({
          licenseNo: data.licenseNo || DEFAULT_SETTINGS.licenseNo,
          trnNo: data.trnNo || DEFAULT_SETTINGS.trnNo,
          address: data.address !== undefined ? data.address : DEFAULT_SETTINGS.address,
          phone: data.phone !== undefined ? data.phone : DEFAULT_SETTINGS.phone,
          email: data.email !== undefined ? data.email : DEFAULT_SETTINGS.email,
          fax: data.fax !== undefined ? data.fax : DEFAULT_SETTINGS.fax,
          tel: data.tel !== undefined ? data.tel : DEFAULT_SETTINGS.tel,
          commercialRegister: data.commercialRegister || DEFAULT_SETTINGS.commercialRegister,
          qaText: data.qaText || DEFAULT_SETTINGS.qaText,
          
          coreSpecialtyIcon: data.coreSpecialtyIcon || DEFAULT_SETTINGS.coreSpecialtyIcon,
          coreSpecialtyTitle: data.coreSpecialtyTitle || DEFAULT_SETTINGS.coreSpecialtyTitle,
          coreSpecialtyText: data.coreSpecialtyText || DEFAULT_SETTINGS.coreSpecialtyText,
          
          aboutMissionTitle: data.aboutMissionTitle || DEFAULT_SETTINGS.aboutMissionTitle,
          aboutMissionText: data.aboutMissionText || DEFAULT_SETTINGS.aboutMissionText,
          aboutSafetyTitle: data.aboutSafetyTitle || DEFAULT_SETTINGS.aboutSafetyTitle,
          aboutSafetyText: data.aboutSafetyText || DEFAULT_SETTINGS.aboutSafetyText,
          
          competency1Title: data.competency1Title || DEFAULT_SETTINGS.competency1Title,
          competency1Text: data.competency1Text || DEFAULT_SETTINGS.competency1Text,
          competency2Title: data.competency2Title || DEFAULT_SETTINGS.competency2Title,
          competency2Text: data.competency2Text || DEFAULT_SETTINGS.competency2Text,
          competency3Title: data.competency3Title || DEFAULT_SETTINGS.competency3Title,
          competency3Text: data.competency3Text || DEFAULT_SETTINGS.competency3Text,
          
          servicesOutline: data.servicesOutline !== undefined ? data.servicesOutline : DEFAULT_SETTINGS.servicesOutline
        });
      }
    } catch (err: any) {
      console.warn("Using local settings fallback. Backend error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<CompanySettings>): Promise<boolean> => {
    try {
      const response = await fetch(`${getBackendUrl()}/api/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newSettings)
      });
      if (!response.ok) {
        throw new Error("Failed to update settings in database.");
      }
      const data = await response.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Update settings failure:", err);
      return false;
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, error, refreshSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
