// backend/server.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
}));

// Increase payload limit for file uploads (only once)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect Database
connectDB();

// REQUEST LOGGER - See all incoming requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Test Route
app.get("/", (req, res) => {
  res.send("Server Running...");
});

// Load routes
console.log("✅ Loading routes...");

// Import all route files
const incubationRoutes = require("./routes/incubation_routes");
const startupClinicRoutes = require("./routes/startup_clinic_routes");
const newsletterRoutes = require("./routes/newsletter_route");
const jobApplicationRoutes = require("./routes/job_application_routes");
const startupSubmissionRoutes = require("./routes/startup_submission_routes");
const cibaJobsRoutes = require("./routes/ciba_jobs_routes");
const incubatedStartupsRoutes = require("./routes/incubated_startups_routes");

// Mount routes
app.use("/api/clinic", startupClinicRoutes);
app.use("/api/incubation", incubationRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/applications", jobApplicationRoutes);
app.use("/api/startups", startupSubmissionRoutes);
app.use("/api", cibaJobsRoutes);
app.use("/api", incubatedStartupsRoutes);

console.log("✅ All routes mounted successfully!");

// Route verification
console.log("\n📍 Available API Routes:");
console.log("  Newsletter:");
console.log("    GET  /api/newsletter");
console.log("    GET  /api/newsletter/:id/file");
console.log("    POST /api/newsletter");
console.log("  Clinic:");
console.log("    GET  /api/clinic");
console.log("  Incubation:");
console.log("    GET  /api/incubation");
console.log("  Applications:");
console.log("    GET  /api/applications");
console.log("  Startups:");
console.log("    GET  /api/startups");
console.log("  Admin:");
console.log("    GET  /api/admin/ciba-jobs");
console.log("    GET  /api/admin/incubated-startups\n");

// 404 Handler - catches unmatched routes
app.use((req, res) => {
  console.log(`❌ 404: Route not found - ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: "Route not found",
    requestedUrl: req.url,
    method: req.method
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ error: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Newsletter API: http://localhost:${PORT}/api/newsletter`);
  console.log(`📄 File endpoint: http://localhost:${PORT}/api/newsletter/:id/file\n`);
});