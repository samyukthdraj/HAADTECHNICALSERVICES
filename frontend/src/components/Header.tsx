"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, Wrench } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function Header() {
  const pathname = usePathname();
  const { settings } = useSettings();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full bg-white border-b border-[#1A1A1A] sticky top-0 z-50">
      {/* Top Document Metadata Ribbon - Document Style */}
      <div className="w-full bg-[#1A1A1A] text-[#F4F4F4] py-1.5 px-4 md:px-8 lg:px-12 border-b border-[#1A1A1A]">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 hts-label-sm text-[11px]">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 uppercase">
              <MapPin className="w-3.5 h-3.5 text-[#e31e24]" />
              {settings.address.split(",").slice(-2).join(",").toUpperCase().trim()}
            </span>
            <span className="hidden md:inline-block text-[#5c5b5b]">|</span>
            <span className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#008f4c]" />
              LICENSE NO: {settings.licenseNo}
            </span>
            <span className="hidden md:inline-block text-[#5c5b5b]">|</span>
            <span className="flex items-center gap-1.5">
              TRN NO: {settings.trnNo}
            </span>
          </div>
          <div className="flex items-center gap-4 self-end md:self-auto">
            <span className="text-[#dadada] uppercase">ACTIVE STATUS: CERTIFIED TECHNICAL SERVICES</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="w-full px-4 md:px-8 lg:px-12 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding & Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 border border-[#1A1A1A] p-0.5 bg-white transition-all group-hover:border-[#e31e24]" style={{ borderRadius: "0px" }}>
            <Image
              src="/haad_logo.png"
              alt="HTS Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#1A1A1A] flex items-baseline gap-0.5 leading-none font-sans">
              <span className="text-[#ba0013]">HAAD</span>
              <span className="text-[#1A1A1A]">TECHNICAL</span>
              <span className="text-[#006d39]">SERVICES</span>
            </h1>
            <span className="hts-label-sm text-[9px] text-[#5c5b5b] mt-0.5 tracking-[0.12em]">
              CO. L.L.C. • TECHNICAL CONTRACTING & MANPOWER
            </span>
          </div>
        </Link>

        {/* Central Links & Right Side Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto justify-end">
          {/* Centered Navigation Menu */}
          <nav className="flex items-center gap-6 md:gap-8 hts-label-md text-xs font-bold">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`py-1 border-b-2 transition-all uppercase tracking-wider ${
                    isActive
                      ? "border-[#ba0013] text-[#1A1A1A]"
                      : "border-transparent text-[#5c5b5b] hover:text-[#1A1A1A] hover:border-[#1A1A1A]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Contact Direct Icons & CTA Button */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Phone Icon */}
            <a
              href={`tel:${settings.phone}`}
              className="p-2 border border-[#1A1A1A] hover:bg-[#F4F4F4] transition-all text-[#1A1A1A]"
              style={{ borderRadius: "0px" }}
              title={`Call Direct Line: ${settings.phone}`}
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Email Icon */}
            <a
              href={`mailto:${settings.email}`}
              className="p-2 border border-[#1A1A1A] hover:bg-[#F4F4F4] transition-all text-[#1A1A1A]"
              style={{ borderRadius: "0px" }}
              title={`Email: ${settings.email}`}
            >
              <Mail className="w-4 h-4" />
            </a>

            {/* Get Quote CTA */}
            <Link
              href="/#estimator"
              className="px-4 py-2 bg-[#e31e24] hover:bg-[#ba0013] text-white font-bold text-xs uppercase tracking-wider transition-all hts-label-sm border border-[#e31e24]"
              style={{ borderRadius: "0px" }}
            >
              Get Quote
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
