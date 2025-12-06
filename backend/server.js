require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
// Increase payload limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

// Connect Database
connectDB();


// Test Route
app.get("/", (req, res) => {
  res.send("Server Running...");
});

// START WITH JUST THIS - NO OTHER ROUTES
console.log("✅ About to load startup clinic routes...");
const incubationRoutes = require("./routes/incubation_routes");
const startupClinicRoutes = require("./routes/startup_clinic_routes");
app.use("/api/clinic", startupClinicRoutes);

app.use("/api/incubation", incubationRoutes);
console.log("✅ Routes loaded successfully!");

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));