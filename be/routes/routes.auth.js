import express from "express";
import jwt from "jsonwebtoken";
import pool from "../db/database_connection.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv'

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const SECRET_KEY=process.env.JWT_SECRET_KEY || "AdityaKurani"



router.get("/login", (req, res) => {
  console.log(process.env.JWT_SECRET)
  res.sendFile(path.resolve(__dirname, "../index.html"));
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const checkUserQuery = "SELECT * FROM credential WHERE email = $1";
    const existingUser = await pool.query(checkUserQuery, [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    var query = `INSERT INTO credential (cname, email, password) VALUES ($1, $2, $3) RETURNING *;`;
    var values = [username, email, password];

    const result1 = await pool.query(query, values);

    query = `INSERT INTO accesscreds (companyid , cname) VALUES ($1 , $2) RETURNING *;`
    values = [result1.rows[0].companyid , result1.rows[0].cname]

    const result2 = await pool.query(query,values)

    
    res.status(201).json({ message: "User created successfully", user: result1.rows[0]  , accessCreds : result2.rows[0] });

  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const query = "SELECT * FROM credential WHERE email = $1";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0){
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    if (password !== user.password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.companyid }, SECRET_KEY, { expiresIn: "3h" });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
    return res.json({ message: "User logged in successfully", token });

  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
