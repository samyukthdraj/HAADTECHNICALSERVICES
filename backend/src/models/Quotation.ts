import { Schema, model } from "mongoose";

const QuotationItemSchema = new Schema({
  designation: { type: String, required: true },
  quantity: { type: Number, required: true },
  hours: { type: Number, required: true },
  rate: { type: Number, required: true },
  total: { type: Number, required: true }
});

const QuotationSchema = new Schema({
  clientName: { type: String, required: true },
  projectRef: { type: String, required: true, unique: true },
  projectLocation: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ["draft", "active", "urgent"], default: "draft" },
  items: [QuotationItemSchema],
  subtotal: { type: Number, required: true },
  vat: { type: Number, required: true },
  total: { type: Number, required: true }
}, {
  timestamps: true
});

export const Quotation = model("Quotation", QuotationSchema);
