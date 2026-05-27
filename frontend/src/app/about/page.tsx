"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Flag, Shield, Users, Hammer, Settings as SettingsIcon } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

interface TeamMemberItem {
  _id: string;
  memberId: string;
  name: string;
  designation: string;
  certification: string;
  status: string;
}

export default function AboutPage() {
  const { settings } = useSettings();
  const [team, setTeam] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getBackendUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || "https://haadtechnicalservicescollc-delta.vercel.app";
  };

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch(`${getBackendUrl()}/api/team`);
        if (res.ok) {
          const data = await res.json();
          setTeam(data);
        }
      } catch (err) {
        console.error("Failed to load team directory:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-[#ba0013] selection:text-white">
      <Header />

      <main className="flex-1 w-full px-4 md:px-8 lg:px-12 py-8 flex flex-col gap-12">
        {/* Section 1: Hero Profile */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-[#1A1A1A] pb-10">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <span className="hts-label-sm text-xs text-[#006d39] font-bold block mb-1">
              • CORPORATE PROFILE
            </span>
            <h2 className="hts-display-lg text-[#1A1A1A] leading-tight uppercase">
              {settings.aboutMissionTitle}
            </h2>
            <p className="hts-body-lg text-[#5c5b5b] leading-relaxed max-w-2xl mt-2">
              {settings.aboutMissionText}
            </p>
          </div>

          {/* construction image container */}
          <div className="lg:col-span-5 relative w-full h-[320px] border-2 border-[#1A1A1A] bg-[#eeeeee]" style={{ borderRadius: "0px" }}>
            <Image
              src="/construction_site.png"
              alt="Construction Site Structural Steel"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            {/* DUBAI OPERATIONS Badge */}
            <div className="absolute bottom-0 left-0 bg-[#ba0013] text-white px-3 py-1.5 hts-label-sm text-[10px] font-bold uppercase tracking-wider">
              DUBAI OPERATIONS
            </div>
          </div>
        </section>

        {/* Section 2: Corporate Mission & Standards */}
        <section className="flex flex-col gap-6">
          <h3 className="hts-headline-lg text-lg font-bold text-[#1A1A1A] uppercase">
            CORPORATE MISSION & STANDARDS
          </h3>
          <div className="border-t border-[#1A1A1A] pt-4"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SYS-01: Mission Card */}
            <div className="lg:col-span-7 border border-[#1A1A1A] bg-white p-6 relative flex flex-col gap-4" style={{ borderRadius: "0px" }}>
              <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
                <span className="hts-label-sm text-[10px] text-[#5c5b5b] font-bold">SYS-01: MISSION STATEMENT</span>
                <Flag className="w-4 h-4 text-[#ba0013]" />
              </div>
              <div className="border-l-4 border-[#ba0013] pl-4 py-2">
                <p className="hts-body-md text-xs text-[#1A1A1A] leading-relaxed font-sans">
                  Our objective is to deliver precise, scalable, and safe technical services to the industrial sector. We commit to executing every project with rigorous adherence to structural integrity and operational excellence, ensuring our clients achieve their project milestones without compromise.
                </p>
              </div>
            </div>

            {/* SYS-02: Safety Protocol Card */}
            <div className="lg:col-span-5 border border-[#1A1A1A] bg-white p-6 relative flex flex-col gap-4" style={{ borderRadius: "0px" }}>
              <div className="flex items-center justify-between border-b border-[#eeeeee] pb-2">
                <span className="hts-label-sm text-[10px] text-[#5c5b5b] font-bold">SYS-02: SAFETY PROTOCOL</span>
                <Shield className="w-4 h-4 text-[#006d39]" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 bg-[#006d39] text-white hts-label-sm text-[8px] font-bold uppercase tracking-wider inline-block mb-3" style={{ borderRadius: "0px" }}>
                  ACTIVE STANDARD
                </span>
                <h4 className="hts-headline-md text-sm font-bold text-[#1A1A1A] mb-1 uppercase">{settings.aboutSafetyTitle}</h4>
                <p className="hts-body-md text-xs text-[#5c5b5b] leading-relaxed">
                  {settings.aboutSafetyText}
                </p>
              </div>
            </div>

            {/* SYS-03: Core Competencies Box */}
            <div className="lg:col-span-12 border border-[#1A1A1A] bg-[#F9F9F9] p-6 flex flex-col gap-4" style={{ borderRadius: "0px" }}>
              <div className="border-b border-[#dadada] pb-2">
                <span className="hts-label-sm text-[10px] text-[#5c5b5b] font-bold">SYS-03: CORE COMPETENCIES</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Competency 1 */}
                <div className="flex gap-3">
                  <Hammer className="w-5 h-5 text-[#ba0013] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="hts-label-md text-xs font-bold text-[#1A1A1A] uppercase">{settings.competency1Title}</h5>
                    <p className="text-[11px] text-[#5c5b5b] mt-1 font-sans leading-relaxed">
                      {settings.competency1Text}
                    </p>
                  </div>
                </div>

                {/* Competency 2 */}
                <div className="flex gap-3">
                  <Users className="w-5 h-5 text-[#006d39] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="hts-label-md text-xs font-bold text-[#1A1A1A] uppercase">{settings.competency2Title}</h5>
                    <p className="text-[11px] text-[#5c5b5b] mt-1 font-sans leading-relaxed">
                      {settings.competency2Text}
                    </p>
                  </div>
                </div>

                {/* Competency 3 */}
                <div className="flex gap-3">
                  <SettingsIcon className="w-5 h-5 text-[#1A1A1A] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="hts-label-md text-xs font-bold text-[#1A1A1A] uppercase">{settings.competency3Title}</h5>
                    <p className="text-[11px] text-[#5c5b5b] mt-1 font-sans leading-relaxed">
                      {settings.competency3Text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Leadership & Technical Team */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-end border-b border-[#1A1A1A] pb-3">
            <h3 className="hts-headline-lg text-lg font-bold text-[#1A1A1A] uppercase">
              LEADERSHIP & TECHNICAL TEAM
            </h3>
            <span className="px-2 py-0.5 bg-[#1A1A1A] text-white hts-label-sm text-[8px] font-bold" style={{ borderRadius: "0px" }}>
              DIRECTORY LIVE
            </span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-[#5c5b5b] hts-label-sm border border-[#1A1A1A]">
              Loading dynamic team directory...
            </div>
          ) : team.length === 0 ? (
            <div className="text-center py-12 text-[#5c5b5b] hts-label-sm border border-[#1A1A1A]">
              No team members registered.
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#1A1A1A]" style={{ borderRadius: "0px" }}>
              <table className="w-full text-left border-collapse font-sans min-w-[600px]">
                <thead>
                  <tr className="bg-[#F4F4F4] border-b border-[#1A1A1A] hts-label-sm text-[10px] text-[#1A1A1A]">
                    <th className="p-3 font-bold border-r border-[#1A1A1A] w-16 text-center">ID</th>
                    <th className="p-3 font-bold border-r border-[#1A1A1A]">NAME</th>
                    <th className="p-3 font-bold border-r border-[#1A1A1A]">DESIGNATION</th>
                    <th className="p-3 font-bold border-r border-[#1A1A1A]">CERTIFICATION LEVEL</th>
                    <th className="p-3 font-bold text-center w-24">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map((member) => (
                    <tr
                      key={member._id}
                      className="border-b border-[#eeeeee] last:border-b-0 hover:bg-[#F9F9F9] transition-all text-xs font-sans text-[#1a1c1c]"
                    >
                      <td className="p-3 border-r border-[#1A1A1A] text-center font-mono text-[#5c5b5b]">
                        {member.memberId}
                      </td>
                      <td className="p-3 border-r border-[#1A1A1A] font-bold">
                        {member.name}
                      </td>
                      <td className="p-3 border-r border-[#1A1A1A]">
                        {member.designation}
                      </td>
                      <td className="p-3 border-r border-[#1A1A1A] font-mono text-[#5c5b5b]">
                        {member.certification}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 hts-label-sm text-[8px] font-bold ${
                            member.status === "ACTIVE"
                              ? "bg-[#006d39]/10 text-[#006d39] border border-[#006d39]"
                              : "bg-[#ba0013]/10 text-[#ba0013] border border-[#ba0013]"
                          }`}
                          style={{ borderRadius: "0px" }}
                        >
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
