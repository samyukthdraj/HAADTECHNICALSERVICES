import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  Ship,
  Hammer,
  Compass,
  Users,
  Grid,
  Scissors,
  Wrench,
  Anchor,
  Flame,
  LayoutGrid
} from "lucide-react";

export default function ServicesPage() {
  const portfolio = [
    {
      title: "CARPENTRY",
      description: "Skilled carpenters for industrial formwork, structural woodwork, and precise finish carpentry required in complex construction and marine environments.",
      icon: Hammer,
    },
    {
      title: "DECK HANDS",
      description: "Experienced marine deck hands certified for safety and efficiency in dry dock operations, vessel maintenance, and offshore support roles.",
      icon: Anchor,
    },
    {
      title: "HELPER",
      description: "Reliable and resilient general labor force crucial for site preparation, material handling, and assisting specialized tradesmen safely.",
      icon: Users,
    },
    {
      title: "MASON",
      description: "Expert masons proficient in structural brickwork, blockwork, concrete finishing, and heavy industrial masonry tasks.",
      icon: LayoutGrid,
    },
    {
      title: "STEEL FIXER",
      description: "Precision steel fixers trained to interpret complex structural drawings and securely position reinforcement bars for critical concrete structures.",
      icon: Wrench,
    },
    {
      title: "WELDER",
      description: "Certified industrial welders (MIG, TIG, ARC) specializing in structural steel, pipefitting, and marine-grade fabrication.",
      icon: Flame,
    },
    {
      title: "PLATER",
      description: "Specialized steel platers for heavy fabrication, ship repair, and structural assembly, ensuring exact tolerances in heavy industry.",
      icon: Scissors,
    },
    {
      title: "MECHANIC",
      description: "Industrial and marine mechanics capable of maintaining, diagnosing, and repairing heavy machinery and plant equipment.",
      icon: Wrench,
    },
    {
      title: "RIGGER",
      description: "Certified riggers expert in safe lifting operations, securing heavy loads, and operating in complex crane and scaffolding environments.",
      icon: Compass,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-[#ba0013] selection:text-white">
      <Header />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8 flex flex-col gap-10">
        {/* Title Header */}
        <div className="border-b border-[#1A1A1A] pb-6">
          <span className="hts-label-sm text-xs text-[#006d39] font-bold block mb-1">
            • SERVICE PORTFOLIO
          </span>
          <h2 className="hts-headline-lg font-black text-[#1A1A1A]">TECHNICAL MANPOWER SOLUTIONS</h2>
          <span className="hts-label-md text-xs text-[#5c5b5b] mt-1 block">
            SPECIALIZED INDUSTRIAL AND MARINE WORKFORCE DEPLOYMENT IN DUBAI.
          </span>
        </div>

        {/* Dry Docks Specialty Banner */}
        <section
          className="border-2 border-[#1A1A1A] bg-[#eeeeee] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6"
          style={{ borderRadius: "0px" }}
        >
          {/* Ship Icon Square */}
          <div className="w-24 h-24 bg-[#ba0013] border-2 border-[#1A1A1A] flex items-center justify-center shrink-0" style={{ borderRadius: "0px" }}>
            <Ship className="w-12 h-12 text-white" />
          </div>
          
          <div className="flex flex-col gap-2">
            <div>
              <span className="px-2.5 py-0.5 bg-[#006d39] text-white hts-label-sm text-[9px] font-bold inline-block" style={{ borderRadius: "0px" }}>
                CORE SPECIALTY
              </span>
            </div>
            <h3 className="hts-headline-md text-lg font-bold text-[#1A1A1A]">
              MANPOWER SERVICES REGULARLY PROVIDED TO DRY DOCKS WORLD DUBAI
            </h3>
            <p className="hts-body-md text-sm text-[#5c5b5b] leading-relaxed max-w-4xl">
              We are a trusted partner for large-scale marine and industrial operations, supplying highly skilled, certified personnel ready for immediate deployment in high-stakes technical environments.
            </p>
          </div>
        </section>

        {/* Competencies Grid */}
        <section className="flex flex-col gap-6">
          <h4 className="hts-headline-md text-base font-bold text-[#1A1A1A] border-b border-[#1A1A1A] pb-2">
            Comprehensive Manpower Portfolio
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolio.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="border-2 border-[#1A1A1A] bg-white p-6 flex flex-col justify-between gap-4 relative"
                  style={{ borderRadius: "0px" }}
                >
                  {/* Small top-right icon indicator */}
                  <div className="absolute top-4 right-4 text-[#5c5b5b]/40">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex flex-col gap-3">
                    <h5 className="hts-headline-md text-base font-black text-[#1A1A1A] border-b border-[#eeeeee] pb-1.5 pr-8">
                      {item.title}
                    </h5>
                    <p className="hts-body-md text-xs text-[#5c5b5b] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <span className="hts-label-sm text-[9px] text-[#ba0013] font-bold block">
                    HTS-ROLE: {item.title.substring(0, 3)}-{String(100 + index)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
