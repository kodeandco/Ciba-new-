// backend/server.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const path = require("path");

const app = express();

// CORS Configuration - MUST be before other middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Handle preflight requests
app.options(/.*/, cors()); // ✅ regex, not "*"


// Increase payload limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect Database
connectDB();

// REQUEST LOGGER - See all incoming requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url} from ${req.headers.origin || 'direct'}`);
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
const graduatedStartupsRoutes = require("./routes/graduated_startups_route");
const galleryRoutes = require("./routes/gallery_routes");
const mentorsRoutes = require("./routes/mentors_route");
const partnersRoutes = require("./routes/partners_routes");
const testimonialsRoutes = require("./routes/testimonials_routes");
const authRoutes = require("./routes/authRoutes");


// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/clinic", startupClinicRoutes);
app.use("/api/incubation", incubationRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/applications", jobApplicationRoutes);
app.use("/api/startups", startupSubmissionRoutes);
app.use("/api", cibaJobsRoutes);
app.use("/api", incubatedStartupsRoutes);
app.use("/api", graduatedStartupsRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/mentors", mentorsRoutes);
app.use("/api/partners", partnersRoutes);
app.use("/api/testimonials", testimonialsRoutes);

console.log("✅ All routes mounted successfully!");

// Route verification
console.log("\n📍 Available API Routes:");
console.log("  Gallery:");
console.log("    GET    /api/gallery");
console.log("    GET    /api/gallery/:id/image");
console.log("    POST   /api/gallery");
console.log("  Newsletter:");
console.log("    GET    /api/newsletter");
console.log("    GET    /api/newsletter/all");
console.log("    GET    /api/newsletter/:id");
console.log("    GET    /api/newsletter/:id/file");
console.log("    POST   /api/newsletter");
console.log("    POST   /api/newsletter/subscribe");
console.log("    PUT    /api/newsletter/:id");
console.log("    DELETE /api/newsletter/:id");
console.log("  Clinic:");
console.log("    GET    /api/clinic");
console.log("  Incubation:");
console.log("    GET    /api/incubation");
console.log("  Applications:");
console.log("    GET    /api/applications");
console.log("  Startups:");
console.log("    GET    /api/startups");
console.log("  Admin:");
console.log("    GET    /api/admin/ciba-jobs");
console.log("    GET    /api/admin/incubated-startups\n");

// GET /admin/setup - browser-friendly setup page
app.get("/admin/setup", (req, res) => {
  const { setupToken } = req.query;

  if (!setupToken) {
    return res.status(400).send("<h2>Missing setup token</h2>");
  }

  // Simple HTML page to submit admin setup
  res.send(`
    <html>
      <head>
        <title>Admin Setup</title>
      </head>
      <body style="font-family: sans-serif; padding: 20px;">
        <h2>Admin Setup</h2>
        <form id="setupForm">
          <input type="hidden" name="setupToken" value="${setupToken}" />
          <div>
            <label>Email: <input type="email" name="email" required /></label>
          </div>
          <div>
            <label>Password: <input type="password" name="password" required /></label>
          </div>
          <button type="submit" style="margin-top: 10px;">Create Admin</button>
        </form>

        <div id="message" style="margin-top: 20px; color: green;"></div>

        <script>
          const form = document.getElementById('setupForm');
          const messageDiv = document.getElementById('message');

          form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = {
              email: form.email.value,
              password: form.password.value,
              setupToken: form.setupToken.value
            };

            try {
              const res = await fetch('http://localhost:5000/api/auth/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });

              const result = await res.json();

              if (res.ok) {
                messageDiv.style.color = 'green';
                messageDiv.textContent = result.message;
              } else {
                messageDiv.style.color = 'red';
                messageDiv.textContent = result.error || JSON.stringify(result);
              }
            } catch (err) {
              messageDiv.style.color = 'red';
              messageDiv.textContent = 'Error: ' + err.message;
            }
          });
        </script>
      </body>
    </html>
  `);
});

// Error Handler - MUST be after routes
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ error: err.message });
});



// 404 Handler - MUST be LAST, after all routes and error handler
app.use((req, res) => {
  console.log(`❌ 404: Route not found - ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: "Route not found",
    requestedUrl: req.url,
    method: req.method
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📸 Gallery API: http://localhost:${PORT}/api/gallery`);
  console.log(`📋 Newsletter API: http://localhost:${PORT}/api/newsletter`);
  console.log(`📄 File endpoint: http://localhost:${PORT}/api/newsletter/:id/file\n`);
});
