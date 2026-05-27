import { Schema, model } from "mongoose";

const SettingsSchema = new Schema({
  licenseNo: { type: String, default: "884721" },
  trnNo: { type: String, default: "100482591600003" },
  address: { type: String, default: "Office 402, Al Garhoud Business Center, Near GGICO Metro Station, Garhoud, Dubai, UAE" },
  phone: { type: String, default: "+971 50 6790358" },
  email: { type: String, default: "abdullakalathil32@gmail.com" },
  fax: { type: String, default: "+971 4 299 9998" },
  tel: { type: String, default: "+971 4 299 9999" },
  commercialRegister: { type: String, default: "139581" },
  qaText: { type: String, default: "All technical operations, mechanical installations, and manpower provisions are governed by the Federal Decree-Law No. (33) of 2021 regarding the Regulation of Labour Relations. We ensure strictly vetted technicians, compliance with Dubai Municipality safety codes, and full ISO 9001:2015 quality standards." },
  
  // Core Specialty Banner Details
  coreSpecialtyIcon: { type: String, default: "Ship" },
  coreSpecialtyTitle: { type: String, default: "MANPOWER SERVICES REGULARLY PROVIDED TO DRY DOCKS WORLD DUBAI" },
  coreSpecialtyText: { type: String, default: "We are a trusted partner for large-scale marine and industrial operations, supplying highly skilled, certified personnel ready for immediate deployment in high-stakes technical environments." },

  // About Section Details
  aboutMissionTitle: { type: String, default: "BUILDING THE FOUNDATION OF INDUSTRIAL EXCELLENCE" },
  aboutMissionText: { type: String, default: "HAADTECHNICALSERVICES CO. L.L.C is a premier provider of structural and manpower solutions in the Dubai industrial sector. We deliver uncompromising quality and safety for projects of all scales." },
  aboutSafetyTitle: { type: String, default: "Zero Incident Target" },
  aboutSafetyText: { type: String, default: "Safety is not an option; it is built into our core operations. Rigorous training and strict compliance with Dubai's regulatory standards." },
  
  // Competencies details
  competency1Title: { type: String, default: "STRUCTURAL FABRICATION" },
  competency1Text: { type: String, default: "High-precision steel and metal fabrication for industrial facilities." },
  competency2Title: { type: String, default: "MANPOWER PROVISION" },
  competency2Text: { type: String, default: "Supplying certified and experienced technical crews for large-scale operations." },
  competency3Title: { type: String, default: "EQUIPMENT MAINTENANCE" },
  competency3Text: { type: String, default: "Scheduled and emergency maintenance for heavy industrial machinery." },
  
  // Services Outline (Newline separated)
  servicesOutline: { type: String, default: "Electrical Contracting\nMechanical & Plumbing\nAir Conditioning & HVAC\nTechnical Manpower Supply\nFacilities Management" }
}, {
  timestamps: true
});

export const Settings = model("Settings", SettingsSchema);
