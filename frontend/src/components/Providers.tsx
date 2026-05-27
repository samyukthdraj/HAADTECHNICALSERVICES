"use client";

import React from "react";
import { SettingsProvider } from "../context/SettingsContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      {children}
    </SettingsProvider>
  );
}
