"use client";

import Image from "next/image";
import Link from "next/link";
import { Wrench, Mail, Phone, MapPin } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-white border-b-2 border-[#1A1A1A] z-50">
      {/* Top Metadata Bar - Systematic Industrial Document Look */}
      <div className="w-full bg-[#1A1A1A] text-[#F4F4F4] py-1.5 px-4 md:px-8 border-b border-[#1A1A1A]">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 hts-label-sm text-[11px]">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#e31e24]" />
              DUBAI, UNITED ARAB EMIRATES
            </span>
            <span className="hidden md:inline-block text-[#5c5b5b]">|</span>
            <span className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#008f4c]" />
              LICENSE NO: 884721
            </span>
            <span className="hidden md:inline-block text-[#5c5b5b]">|</span>
            <span className="flex items-center gap-1.5">
              TRN NO: 100482591600003
            </span>
          </div>
          <div className="flex items-center gap-4 self-end md:self-auto">
            <a href="tel:+97142999999" className="hover:text-[#e31e24] transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#e31e24]" /> +971 4 299 9999
            </a>
            <span className="text-[#5c5b5b]">|</span>
            <a href="mailto:info@haadtechnical.com" className="hover:text-[#008f4c] transition-colors flex items-center gap-1">
              <Mail className="w-3 h-3 text-[#008f4c]" /> info@haadtechnical.com
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Branding & Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="relative w-14 h-14 border border-[#1A1A1A] p-0.5 bg-white transition-all group-hover:border-[#e31e24]">
            <Image
              src="/haad_logo.png"
              alt="HTS Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#1A1A1A] flex flex-wrap items-baseline gap-1 leading-none font-sans">
              <span className="text-[#ba0013]">HAAD</span>
              <span className="text-[#1A1A1A]">TECHNICAL</span>
              <span className="text-[#006d39]">SERVICES</span>
            </h1>
            <span className="hts-label-sm text-[10px] text-[#5c5b5b] mt-1 tracking-[0.15em]">
              CO. L.L.C. • TECHNICAL CONTRACTING & MANPOWER
            </span>
          </div>
        </Link>

        {/* Navigation Menu */}
        <nav className="flex items-center flex-wrap gap-1 sm:gap-2">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-semibold border-2 border-[#1A1A1A] bg-[#1A1A1A] text-white hover:bg-white hover:text-[#1A1A1A] transition-all uppercase tracking-wider text-center min-w-[90px]"
            style={{ borderRadius: "0px" }}
          >
            Home
          </Link>
          <Link
            href="#services"
            className="px-4 py-2 text-sm font-semibold border-2 border-transparent hover:border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F4F4F4] transition-all uppercase tracking-wider text-center min-w-[90px]"
            style={{ borderRadius: "0px" }}
          >
            Services
          </Link>
          <Link
            href="#about"
            className="px-4 py-2 text-sm font-semibold border-2 border-transparent hover:border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F4F4F4] transition-all uppercase tracking-wider text-center min-w-[90px]"
            style={{ borderRadius: "0px" }}
          >
            About
          </Link>
          <Link
            href="#contact"
            className="px-4 py-2 text-sm font-semibold border-2 border-[#ba0013] text-[#ba0013] hover:bg-[#ba0013] hover:text-white transition-all uppercase tracking-wider text-center min-w-[90px]"
            style={{ borderRadius: "0px" }}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
