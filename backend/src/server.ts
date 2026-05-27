import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./db";
import { Quotation } from "./models/Quotation";
import { Inquiry } from "./models/Inquiry";
import { Settings } from "./models/Settings";
import { Service } from "./models/Service";
import { TeamMember } from "./models/TeamMember";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for localhost development and the deployed Vercel domain
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://haadtechnicalservicescollc.vercel.app"
  ],
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Security & Logging Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Database connection middleware for lazy serverless connections
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection middleware failure:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed. Please check backend server configuration."
    });
  }
});

// Base Health Check Route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "HAAD Technical Services Backend API is active",
    timestamp: new Date().toISOString(),
    version: "1.4.0",
    dbState: mongooseConnectionState()
  });
});

function mongooseConnectionState() {
  switch (mongoose.connection.readyState) {
    case 0: return "disconnected";
    case 1: return "connected";
    case 2: return "connecting";
    case 3: return "disconnecting";
    default: return "unknown";
  }
}

// ==========================================
// CORPORATE SETTINGS ENDPOINTS
// ==========================================

// Get Settings
app.get("/api/settings", async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error("Fetch settings error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve global configurations." });
  }
});

// Update Settings
app.post("/api/settings", async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.status(200).json({
      success: true,
      message: "Corporate details updated successfully in database.",
      settings
    });
  } catch (error) {
    console.error("Save settings error:", error);
    res.status(500).json({ success: false, message: "Failed to save corporate configurations." });
  }
});

// ==========================================
// DYNAMIC SERVICES ENDPOINTS
// ==========================================

// Get all Services (Seed if empty)
app.get("/api/services", async (req: Request, res: Response) => {
  try {
    let list = await Service.find().sort({ order: 1 });
    if (list.length === 0) {
      const defaultServices = [
        { title: "CARPENTRY", description: "Skilled carpenters for industrial formwork, structural woodwork, and precise finish carpentry.", iconName: "Hammer", serviceCode: "HTS-role: car-100", rate: 25, order: 0 },
        { title: "DECK HANDS", description: "Experienced marine deck hands certified for safety and efficiency in dry dock operations.", iconName: "Anchor", serviceCode: "HTS-role: dec-102", rate: 22, order: 1 },
        { title: "HELPER", description: "Reliable and resilient general labor force crucial for site preparation and material handling.", iconName: "Users", serviceCode: "HTS-role: hel-105", rate: 18, order: 2 },
        { title: "MASON", description: "Expert masons proficient in structural brickwork, blockwork, concrete finishing, and heavy industrial masonry.", iconName: "LayoutGrid", serviceCode: "HTS-role: mas-108", rate: 24, order: 3 },
        { title: "STEEL FIXER", description: "Precision steel fixers trained to position reinforcement bars for critical concrete structures.", iconName: "Wrench", serviceCode: "HTS-role: stf-110", rate: 26, order: 4 },
        { title: "WELDER", description: "Certified industrial welders (MIG, TIG, ARC) specializing in structural steel and marine fabrication.", iconName: "Flame", serviceCode: "HTS-role: wel-112", rate: 30, order: 5 },
        { title: "PLATER", description: "Specialized steel platers for heavy fabrication, ship repair, and structural assembly.", iconName: "Scissors", serviceCode: "HTS-role: pla-115", rate: 28, order: 6 },
        { title: "MECHANIC", description: "Industrial and marine mechanics capable of maintaining, diagnosing, and repairing heavy machinery.", iconName: "Wrench", serviceCode: "HTS-role: mec-118", rate: 32, order: 7 },
        { title: "RIGGER", description: "Certified riggers expert in safe lifting operations, securing heavy loads, and operating in scaffolding.", iconName: "Compass", serviceCode: "HTS-role: rig-120", rate: 25, order: 8 }
      ];
      await Service.insertMany(defaultServices);
      list = await Service.find().sort({ order: 1 });
    }
    res.status(200).json(list);
  } catch (error) {
    console.error("Get services error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch services." });
  }
});

// Add / Update Service
app.post("/api/services", async (req: Request, res: Response) => {
  try {
    const { _id, title, description, iconName, serviceCode, rate, order } = req.body;
    if (_id) {
      const updated = await Service.findByIdAndUpdate(_id, { title, description, iconName, serviceCode, rate, order }, { new: true });
      res.status(200).json({ success: true, message: "Service updated successfully.", service: updated });
    } else {
      const created = new Service({ title, description, iconName, serviceCode, rate, order });
      await created.save();
      res.status(201).json({ success: true, message: "Service created successfully.", service: created });
    }
  } catch (error) {
    console.error("Save service error:", error);
    res.status(500).json({ success: false, message: "Failed to save service." });
  }
});

// Reorder Services
app.post("/api/services/reorder", async (req: Request, res: Response) => {
  try {
    const { orders } = req.body; // Array of {_id: string, order: number}
    for (const item of orders) {
      await Service.findByIdAndUpdate(item._id, { order: item.order });
    }
    res.status(200).json({ success: true, message: "Services reordered successfully." });
  } catch (error) {
    console.error("Reorder services error:", error);
    res.status(500).json({ success: false, message: "Failed to reorder services." });
  }
});

// Delete Service
app.delete("/api/services/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }
    res.status(200).json({ success: true, message: "Service deleted successfully." });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ success: false, message: "Failed to delete service." });
  }
});

// ==========================================
// LEADERSHIP & TEAM ENDPOINTS
// ==========================================

// Get all Team Members (Seed if empty)
app.get("/api/team", async (req: Request, res: Response) => {
  try {
    let list = await TeamMember.find().sort({ createdAt: 1 });
    if (list.length === 0) {
      const defaultTeam = [
        { memberId: "001", name: "Abdullah Al-Hashimi", designation: "Managing Director", certification: "Executive", status: "ACTIVE" },
        { memberId: "042", name: "Thomas Weaver", designation: "Chief Structural Engineer", certification: "Lvl 5 - Seismic", status: "ACTIVE" },
        { memberId: "118", name: "Omar Farooq", designation: "Safety Operations Manager", certification: "OSHA Certified", status: "ACTIVE" },
        { memberId: "285", name: "Rajesh Kumar", designation: "Site Supervisor", certification: "Lvl 3 - Heavy Mach.", status: "DEPLOYED" }
      ];
      await TeamMember.insertMany(defaultTeam);
      list = await TeamMember.find().sort({ createdAt: 1 });
    }
    res.status(200).json(list);
  } catch (error) {
    console.error("Get team members error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch team directory." });
  }
});

// Add / Update Team Member
app.post("/api/team", async (req: Request, res: Response) => {
  try {
    const { _id, memberId, name, designation, certification, status } = req.body;
    if (_id) {
      const updated = await TeamMember.findByIdAndUpdate(_id, { memberId, name, designation, certification, status }, { new: true });
      res.status(200).json({ success: true, message: "Team member updated successfully.", member: updated });
    } else {
      // Check duplicate ID
      const existing = await TeamMember.findOne({ memberId });
      if (existing) {
        return res.status(409).json({ success: false, message: `Duplicate ID: Member with ID ${memberId} already exists.` });
      }
      const created = new TeamMember({ memberId, name, designation, certification, status });
      await created.save();
      res.status(201).json({ success: true, message: "Team member added successfully.", member: created });
    }
  } catch (error) {
    console.error("Save team member error:", error);
    res.status(500).json({ success: false, message: "Failed to save team member details." });
  }
});

// Delete Team Member
app.delete("/api/team/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await TeamMember.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Team member not found." });
    }
    res.status(200).json({ success: true, message: "Team member deleted successfully." });
  } catch (error) {
    console.error("Delete team member error:", error);
    res.status(500).json({ success: false, message: "Failed to delete team member." });
  }
});

// ==========================================
// QUOTATION ENDPOINTS
// ==========================================

// Get all Quotations
app.get("/api/quotation", async (req: Request, res: Response) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.status(200).json(quotations);
  } catch (error) {
    console.error("Fetch quotations error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve quotations list." });
  }
});

// Submit Quotation
app.post("/api/quotation", async (req: Request, res: Response) => {
  const {
    clientName,
    projectRef,
    projectLocation,
    date,
    status,
    items,
    subtotal,
    vat,
    total
  } = req.body;

  console.log(`[QUOTATION SUBMISSION] - Ref: ${projectRef}`);
  console.log("-----------------------------------------");

  if (!clientName || !projectRef || !total) {
    return res.status(400).json({
      success: false,
      message: "Required fields (clientName, projectRef, total) are missing."
    });
  }

  try {
    const existing = await Quotation.findOne({ projectRef });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Duplicate Reference Error: A quotation with Reference ${projectRef} already exists.`
      });
    }

    const quotation = new Quotation({
      clientName,
      projectRef,
      projectLocation,
      date,
      status,
      items,
      subtotal,
      vat,
      total
    });
    await quotation.save();

    res.status(201).json({
      success: true,
      message: `Quotation Reference ${projectRef} successfully registered.`,
      ref: projectRef,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Database save error for quotation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to store quotation details in database."
    });
  }
});

// Delete Quotation by ID
app.delete("/api/quotation/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await Quotation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Quotation record not found." });
    }
    res.status(200).json({ success: true, message: "Quotation record deleted successfully." });
  } catch (error) {
    console.error("Delete quotation error:", error);
    res.status(500).json({ success: false, message: "Failed to delete quotation record." });
  }
});

// ==========================================
// INQUIRY ENDPOINTS
// ==========================================

// Get all Inquiries
app.get("/api/inquiry", async (req: Request, res: Response) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    console.error("Fetch inquiries error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve inquiries list." });
  }
});

// Submit Inquiry (Mail logging is logged to server output as SMTP variables are not set)
app.post("/api/inquiry", async (req: Request, res: Response) => {
  const { entityName, contactNo, email, serviceClassification, details } = req.body;

  console.log(`[SERVICE INQUIRY LOG] - Entity Name: ${entityName}`);
  console.log(`[MAIL DISPATCH ACTION] - Dest: abdullakalathil32@gmail.com`);
  console.log(`-----------------------------------------`);
  console.log(`Subject: New Service Inquiry - ${entityName}`);
  console.log(`Content: Requester: ${entityName}\nContact: ${contactNo}\nEmail: ${email}\nService: ${serviceClassification}\nDetails: ${details}`);
  console.log("-----------------------------------------");

  if (!entityName || !contactNo || !email) {
    return res.status(400).json({
      success: false,
      message: "Required fields (entityName, contactNo, email) are missing."
    });
  }

  try {
    const inquiry = new Inquiry({
      entityName,
      contactNo,
      email,
      serviceClassification: serviceClassification || "General Technical Services",
      details
    });
    await inquiry.save();

    res.status(201).json({
      success: true,
      message: `Inquiry for '${entityName}' successfully registered in database. (Mail dispatch simulated).`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database save error for inquiry:", error);
    res.status(500).json({
      success: false,
      message: "Failed to store service inquiry log in database."
    });
  }
});

// Delete Inquiry by ID
app.delete("/api/inquiry/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await Inquiry.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Inquiry log not found." });
    }
    res.status(200).json({ success: true, message: "Inquiry log deleted successfully." });
  } catch (error) {
    console.error("Delete inquiry error:", error);
    res.status(500).json({ success: false, message: "Failed to delete inquiry log." });
  }
});

// Start server locally
if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(` HTS BACKEND RUNNING ON http://localhost:${PORT}`);
      console.log(` Health Check API: http://localhost:${PORT}/api/health`);
      console.log(`=================================================`);
    });
  }).catch((err) => {
    console.error("Failed to start server locally due to connection error:", err);
  });
}

export default app;
