import { Schema, model } from "mongoose";

const InquirySchema = new Schema({
  entityName: { type: String, required: true },
  contactNo: { type: String, required: true },
  email: { type: String, required: true },
  serviceClassification: { type: String, required: true },
  details: { type: String, default: "" }
}, {
  timestamps: true
});

export const Inquiry = model("Inquiry", InquirySchema);
