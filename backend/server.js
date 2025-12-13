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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect Database
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("Server Running...");
});

// Load routes
console.log("✅ Loading routes...");

// Existing routes
const incubationRoutes = require("./routes/incubation_routes");
const startupClinicRoutes = require("./routes/startup_clinic_routes");
const jobApplicationRoutes = require("./routes/job_application_routes");
const startupSubmissionRoutes = require("./routes/startup_submission_routes");

// CIBA Jobs route
const cibaJobsRoutes = require("./routes/ciba_jobs_routes");

// Incubated Startups route
const incubatedStartupsRoutes = require("./routes/incubated_startups_routes");

// Mount routes
app.use("/api/clinic", startupClinicRoutes);
app.use("/api/incubation", incubationRoutes);
app.use("/api/applications", jobApplicationRoutes);
app.use("/api/startups", startupSubmissionRoutes);

// Register admin routes
app.use("/api", cibaJobsRoutes);               // /api/admin/ciba-jobs
app.use("/api", incubatedStartupsRoutes);      // /api/admin/incubated-startups

console.log("✅ All routes mounted successfully!");

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));