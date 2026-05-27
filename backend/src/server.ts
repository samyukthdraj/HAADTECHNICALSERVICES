import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Next.js frontend running on http://localhost:3000
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Security & Logging Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Base Health Check Route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "HAAD Technical Services Backend API is active",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Quotation Submission Endpoint
app.post("/api/quotation", (req: Request, res: Response) => {
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

  // Simulate database storage or ERP sync
  res.status(201).json({
    success: true,
    message: `Quotation Reference ${projectRef} successfully registered in HTS ERP Server. Total value is ${total.toLocaleString("en-AE", { minimumFractionDigits: 2 })} AED (inclusive of 5% VAT). Status set to: ${status?.toUpperCase() || 'DRAFT'}.`,
    ref: projectRef,
    timestamp: new Date().toISOString()
  });
});

// Inquiry Submission Endpoint
app.post("/api/inquiry", (req: Request, res: Response) => {
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

  // Simulate ERP sync
  res.status(201).json({
    success: true,
    message: `Inquiry for '${entityName}' successfully registered in HTS ERP Server. Our team will contact you at ${contactNo} or ${email} shortly.`,
    timestamp: new Date().toISOString()
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(` HTS BACKEND RUNNING ON http://localhost:${PORT}`);
  console.log(` Health Check API: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});
