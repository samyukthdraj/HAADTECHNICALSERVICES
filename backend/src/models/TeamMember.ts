import { Schema, model } from "mongoose";

const TeamMemberSchema = new Schema({
  memberId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  designation: { type: String, required: true },
  certification: { type: String, required: true },
  status: { type: String, enum: ["ACTIVE", "DEPLOYED"], default: "ACTIVE" }
}, {
  timestamps: true
});

export const TeamMember = model("TeamMember", TeamMemberSchema);
