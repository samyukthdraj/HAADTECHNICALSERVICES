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
  qaText: { type: String, default: "All technical operations, mechanical installations, and manpower provisions are governed by the Federal Decree-Law No. (33) of 2021 regarding the Regulation of Labour Relations. We ensure strictly vetted technicians, compliance with Dubai Municipality safety codes, and full ISO 9001:2015 quality standards." }
}, {
  timestamps: true
});

export const Settings = model("Settings", SettingsSchema);
