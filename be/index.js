import express from "express";
import dotenv from "dotenv";
import pool from "../be/db/database_connection.js";
import authRoutes from "./routes/routes.auth.js";
import { fileURLToPath } from "url";
import path from "path";
import cookieParser from "cookie-parser";
import UserRoutes from "./routes/routes.user.js";
import GoogleAuthRoutes from "./routes/auth.google.js";
import session from "express-session";
import companyRoutes from "./routes/company/routes.posts.js";
import passport from "passport";
import cors from "cors";
import companyInfoRoutes from "./routes/company/routes.info.js";
import connectionRoutes from "./routes/company/routes.connections.js";
import chatRoutes from "./routes/company/routes.chatai.js";
import storyRoutes from "./routes/company/routes.story.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") }); 

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.JWT_SECRET_KEY || "Adityakurani",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
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

app.use("/auth/google", GoogleAuthRoutes);
app.use("/user", UserRoutes);
app.use("/company", companyRoutes); // Fixed route assignment
app.use("/company/info", companyInfoRoutes);
app.use("/auth", authRoutes);
app.use("/company/connection", connectionRoutes);
app.use("/company/chat", chatRoutes);
app.use("/company/story",storyRoutes)

app.get("/google/profile", (req, res) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  const { displayName, _json } = req.user;
  const profilePic = _json?.picture || "";

  res.send(`
    <h1>Welcome, ${displayName}!</h1>
    <h2>Email: ${_json?.email || "Not available"}</h2>
    ${profilePic ? `<img src="${profilePic}" alt="Profile Picture">` : ""}
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
