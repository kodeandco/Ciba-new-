require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
}));

// Increase payload limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect Database
connectDB();

// REQUEST LOGGER - Add this to see ALL incoming requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Test Route
app.get("/", (req, res) => {
  res.send("Server Running...");
});

// Load Routes
console.log("✅ About to load routes...");
const incubationRoutes = require("./routes/incubation_routes");
const startupClinicRoutes = require("./routes/startup_clinic_routes");
const newsletterRoutes = require("./routes/newsletter_route");

// Register Routes
app.use("/api/incubation", incubationRoutes);
app.use("/api/clinic", startupClinicRoutes);
app.use("/api/newsletter", newsletterRoutes);

console.log("✅ Routes loaded successfully!");

// Simple route verification
console.log("\n📍 Routes should be available at:");
console.log("  GET  /api/newsletter");
console.log("  GET  /api/newsletter/:id/file");
console.log("  POST /api/newsletter");
console.log("  GET  /api/incubation");
console.log("  GET  /api/clinic");

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