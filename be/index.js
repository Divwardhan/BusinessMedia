import express from "express";
import dotenv from "dotenv";
import pool from "./db/database_connection.js";
import authRoutes from "./routes/authentication.js";
import userRoutes from './routes/user.js';
import googleAuthRoutes from './routes/auth.google.js';
import { fileURLToPath } from "url";
import path from "path";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || "Adityakurani";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ✅ Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

// ✅ Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Database connected!", time: result.rows[0].now });
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// ✅ Use routes
app.use("/auth/google", googleAuthRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);

// ✅ Google profile route
app.get("/google/profile", (req, res) => {
  if (!req.user) return res.send("Unauthorized");

  const fullName = req.user.displayName;
  const profilePic = req.user._json.picture;

  res.send(`
    <h1>Welcome, ${fullName}!</h1>
    <h2>Email: ${req.user._json.email}</h2>
    <img src="${profilePic}" alt="Profile Picture" />
  `);
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
