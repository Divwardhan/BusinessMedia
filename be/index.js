import express, { query } from "express";
import dotenv from "dotenv";
import pool from "./db/database_connection.js";
import authRoutes from "./routes/authentication.js";
import { fileURLToPath } from "url";
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import path from "path";
import UserRoutes from './routes/user.js'
import GoogleAuthRoutes from './routes/auth.google.js'
import session from "express-session";

dotenv.config();

const app = express();

app.use(cookieParser())

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const SECRET_KEY="Adityakurani"
app.use(
  session({
    secret: process.env.SECRET_KEY || "Adityakurani",
    resave: false,
    saveUninitialized: true,
  })
);
import passport from "passport";
app.use(passport.initialize());
app.use(passport.session());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname,"index.html"))
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Database connected!", time: result.rows[0].now });
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use("/auth/google",GoogleAuthRoutes)
app.use('/user',UserRoutes)
app.use("/auth", authRoutes); 
app.get("/google/profile", (req, res) => {
  if (!req.user) {
    return res.send("Unauthorized");
  }

  const fullName = req.user.displayName; 
  const profilePic = req.user._json.picture;

  res.send(`
    <h1>Welcome, ${fullName} !</h1>
    <h2>Email ${req.user._json.email} </h2>
    <img src="${profilePic}" alt="Profile Picture">
  `);
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
