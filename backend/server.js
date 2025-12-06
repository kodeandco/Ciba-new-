// // server.js
// require("dotenv").config();
// const express = require("express");
// const jwt = require("jsonwebtoken");
// const connectDB = require("./db");
// const cors = require("cors"); // <-- ADD THIS
// const startupClinicRoutes = require("./routes/startup_clinic_routes");

// const app = express();

// // CORS FOR LOCALHOST 3000
// app.use(
//    cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     credentials: true,
//   })
// );
// // Handle preflight
// app.options("*", cors());
// // Middleware
// app.use(express.json());

// // Connect Database
// connectDB();

// // Test Route
// app.get("/", (req, res) => {
//   res.send("Server Running...");
// });

// // Routes
// app.use("/api/clinic", startupClinicRoutes);

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server Running on port ${PORT}`));
// server.js - MINIMAL TEST VERSION
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

app.use(express.json());

// Connect Database
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("Server Running...");
});

// START WITH JUST THIS - NO OTHER ROUTES
console.log("✅ About to load startup clinic routes...");

const startupClinicRoutes = require("./routes/startup_clinic_routes");
app.use("/api/clinic", startupClinicRoutes);

console.log("✅ Routes loaded successfully!");

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));