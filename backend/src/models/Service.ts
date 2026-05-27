import { Schema, model } from "mongoose";

const ServiceSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  iconName: { type: String, default: "Hammer" },
  serviceCode: { type: String, required: true },
  rate: { type: Number, default: 25 },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Service = model("Service", ServiceSchema);
