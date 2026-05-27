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
  qaText: "All technical operations, mechanical installations, and manpower provisions are governed by the Federal Decree-Law No. (33) of 2021 regarding the Regulation of Labour Relations. We ensure strictly vetted technicians, compliance with Dubai Municipality safety codes, and full ISO 9001:2015 quality standards."
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
          address: data.address || DEFAULT_SETTINGS.address,
          phone: data.phone || DEFAULT_SETTINGS.phone,
          email: data.email || DEFAULT_SETTINGS.email,
          fax: data.fax || DEFAULT_SETTINGS.fax,
          tel: data.tel || DEFAULT_SETTINGS.tel,
          commercialRegister: data.commercialRegister || DEFAULT_SETTINGS.commercialRegister,
          qaText: data.qaText || DEFAULT_SETTINGS.qaText
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
