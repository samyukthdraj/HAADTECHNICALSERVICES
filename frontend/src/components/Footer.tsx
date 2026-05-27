"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Printer, Shield } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="w-full mt-auto bg-white border-t-8 border-[#ba0013] print:border-t-4">
      {/* Signature & Invoice Anchor Block (Visible on print and desktop) */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[#eeeeee]">
        <div>
          <h4 className="hts-label-md text-xs text-[#5c5b5b] mb-3">HTS QUALITY ASSURANCE & COMPLIANCE</h4>
          <p className="hts-body-md text-sm text-[#1A1A1A] max-w-full leading-relaxed">
            {settings.qaText}
          </p>
          <div className="flex gap-4 mt-4 text-[#006d39] text-xs font-semibold hts-label-sm">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> ISO 9001 CERTIFIED</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> 100% COMPLIANT</span>
          </div>
        </div>

        {/* Authorized Signature Block - Mimics company document */}
        <div className="flex flex-col items-stretch md:items-end justify-center">
          <div className="w-full md:w-[320px] border-2 border-dashed border-[#1A1A1A] p-4 text-center bg-[#f9f9f9]" style={{ borderRadius: "0px" }}>
            <span className="hts-label-sm text-[10px] text-[#5c5b5b] block mb-12">FOR HAAD TECHNICAL SERVICES CO. L.L.C.</span>
            <div className="w-full border-t border-[#1A1A1A] pt-1">
              <span className="hts-label-md text-[11px] text-[#1A1A1A] block font-bold">AUTHORIZED SIGNATORY</span>
              <span className="hts-label-sm text-[9px] text-[#5c5b5b] block">DUBAI OFFICE • SEAL & SIGNATURE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Info Columns */}
      <div className="bg-[#f4f4f4] py-8">
        <div className="w-full px-4 md:px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h5 className="hts-label-md text-xs text-[#1A1A1A] mb-4 border-b border-[#1A1A1A] pb-1">OFFICE ADDRESS</h5>
            <p className="hts-body-md text-sm text-[#5c5b5b] flex items-start gap-2 leading-relaxed font-sans">
              <MapPin className="w-4 h-4 text-[#ba0013] shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </p>
          </div>

          <div>
            <h5 className="hts-label-md text-xs text-[#1A1A1A] mb-4 border-b border-[#1A1A1A] pb-1">COMMUNICATION</h5>
            <ul className="space-y-2.5 hts-body-md text-sm text-[#5c5b5b]">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#ba0013]" />
                <span>Tel: {settings.tel}</span>
              </li>
              <li className="flex items-center gap-2 flex-wrap">
                <Phone className="w-4 h-4 text-[#ba0013]" />
                <span>Mob: {settings.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-[#ba0013]" />
                <span>Fax: {settings.fax}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#ba0013]" />
                <a href={`mailto:${settings.email}`} className="hover:underline">{settings.email}</a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="hts-label-md text-xs text-[#1A1A1A] mb-4 border-b border-[#1A1A1A] pb-1">SERVICES OUTLINE</h5>
            <ul className="space-y-1.5 hts-body-md text-sm text-[#5c5b5b]">
              <li>• Electrical Contracting</li>
              <li>• Mechanical & Plumbing</li>
              <li>• Air Conditioning & HVAC</li>
              <li>• Technical Manpower Supply</li>
              <li>• Facilities Management</li>
            </ul>
          </div>

          <div>
            <h5 className="hts-label-md text-xs text-[#1A1A1A] mb-4 border-b border-[#1A1A1A] pb-1">REGULATORY INFO</h5>
            <ul className="space-y-1 hts-label-sm text-[11px] text-[#5c5b5b]">
              <li>COMMERCIAL REGISTER: {settings.commercialRegister}</li>
              <li>TRADE LICENSE NO: {settings.licenseNo}</li>
              <li>TRN NO: {settings.trnNo}</li>
              <li>VAT ACCOUNT STATUS: ACTIVE</li>
              <li>JURISDICTION: DUBAI, UAE</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="w-full bg-[#1A1A1A] text-[#dadada] py-4 px-4 border-t border-[#1A1A1A] print:hidden">
        <div className="w-full px-4 md:px-8 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs hts-label-sm">
          <span>© {new Date().getFullYear()} HAAD TECHNICAL SERVICES CO. L.L.C. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-4">
            <Link href="#terms" className="hover:underline">TERMS OF SERVICE</Link>
            <span>•</span>
            <Link href="#privacy" className="hover:underline">PRIVACY POLICY</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
