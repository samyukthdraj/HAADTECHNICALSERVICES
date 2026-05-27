import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./db";
import { Quotation } from "./models/Quotation";
import { Inquiry } from "./models/Inquiry";

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
  methods: ["GET", "POST", "OPTIONS"],
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
    version: "1.2.0",
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

// Quotation Submission Endpoint
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

  // Audit Log in Server Console
  console.log(`[QUOTATION SUBMISSION] - Ref: ${projectRef}`);
  console.log(`- Date: ${date}`);
  console.log(`- Client: ${clientName}`);
  console.log(`- Worksite: ${projectLocation}`);
  console.log(`- Status: ${status?.toUpperCase()}`);
  console.log(`- Total Items: ${items?.length}`);
  console.log(`- Subtotal: ${subtotal} AED`);
  console.log(`- VAT (5%): ${vat} AED`);
  console.log(`- Total: ${total} AED`);
  console.log("-----------------------------------------");

  // Input Validation
  if (!clientName || !projectRef || !total) {
    return res.status(400).json({
      success: false,
      message: "Required fields (clientName, projectRef, total) are missing."
    });
  }

  try {
    // Check if duplicate exists
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
      message: `Quotation Reference ${projectRef} successfully registered in HTS MongoDB. Total value is ${total.toLocaleString("en-AE", { minimumFractionDigits: 2 })} AED (inclusive of 5% VAT). Status set to: ${status?.toUpperCase() || 'DRAFT'}.`,
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

// Inquiry Submission Endpoint
app.post("/api/inquiry", async (req: Request, res: Response) => {
  const { entityName, contactNo, email, serviceClassification, details } = req.body;

  // Audit Log in Server Console
  console.log(`[SERVICE INQUIRY LOG]`);
  console.log(`- Entity Name: ${entityName}`);
  console.log(`- Contact No: ${contactNo}`);
  console.log(`- Email: ${email}`);
  console.log(`- Classification: ${serviceClassification}`);
  console.log(`- Details: ${details || "No details provided"}`);
  console.log("-----------------------------------------");

  // Input Validation
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
      message: `Inquiry for '${entityName}' successfully registered in HTS MongoDB. Our team will contact you at ${contactNo} or ${email} shortly.`,
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

// Start server locally (if not on Vercel)
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
