import express from "express";
import jwt from "jsonwebtoken";
import pool from "../db/database_connection.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const UserRoutes = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const SECRET_KEY = process.env.JWT_SECRET_KEY;

UserRoutes.post("/create", async (req, res) => {
  const { username, email, password, bio, profile_pic } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required" });
  }

  try {
    const query = `INSERT INTO users (username, email, password, bio, profile_pic) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [username, email, password, bio || null, profile_pic || null];
    const result = await pool.query(query, values);
    res.json({ message: "User created successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

UserRoutes.put("/update/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { username, email, password, bio, profile_pic } = req.body;

  try {
    const query = `UPDATE users SET username=$1, email=$2, password=$3, bio=$4, profile_pic=$5, updated_at=NOW() WHERE id=$6 RETURNING *`;
    const values = [username, email, password, bio, profile_pic, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

UserRoutes.delete("/delete/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const query = "DELETE FROM users WHERE id=$1";
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully", id });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

UserRoutes.post("/follow/:cname", async (req, res) => {
  const { user_id } = req.body;
  const cname = req.params.cname;

  try {
    const companyid = await pool.query(`SELECT companyid from accesscreds WHERE cname =$1` , [cname])
    const query = `INSERT INTO followers (user_id, company_id) VALUES ($1, $2) RETURNING *`;
    const result = await pool.query(query, [user_id, companyid.rows[0].companyid]);
    res.json({ message: "Successfully followed the company", follow: result.rows[0] });
  } catch (err) {
    console.error("Error following company:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
UserRoutes.post("/review/:cname", async (req, res) => {
  const { user_id, review, rating } = req.body;
  const cname = req.params.cname;

  try {
    const companyResult = await pool.query(`SELECT companyid FROM accesscreds WHERE cname = $1`, [cname]);

    if (companyResult.rows.length === 0) {
      return res.status(400).json({ error: "Company not found in accesscreds" });
    }

    const company_id = companyResult.rows[0].companyid;

    const existingReview = await pool.query(
      `SELECT id FROM user_reviews WHERE user_id = $1 AND company_id = $2`,
      [user_id, company_id]
    );

    let result;
    if (existingReview.rows.length > 0) {
      const review_id = existingReview.rows[0].id;
      const updateQuery = `
        UPDATE user_reviews 
        SET review = $1, rating = $2, created_at = CURRENT_TIMESTAMP
        WHERE id = $3 RETURNING *`;
      result = await pool.query(updateQuery, [review, rating, review_id]);
    } else {
      const insertQuery = `
        INSERT INTO user_reviews (user_id, company_id, review, rating) 
        VALUES ($1, $2, $3, $4) RETURNING *`;
      result = await pool.query(insertQuery, [user_id, company_id, review, rating]);
    }

    res.json({ message: "Review saved successfully", review: result.rows[0] });
  } catch (err) {
    console.error("Error adding/updating review:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

UserRoutes.post("/request-role/:cname", async (req, res) => {
  const { user_id, role } = req.body;
  const cname = req.params.cname;

  const companyid = await pool.query(`SELECT companyid FROM accesscreds WHERE cname = $1` , [cname])

  if (!["member"].includes(role)) {
    return res.status(400).json({ error: "Invalid role." });
  }
  const user = await pool.query(`SELECT * FROM users WHERE id = $1` , [user_id])
  if(!user){
    return res.status(400).json({ error :"The user is not found . Please signup to continue"})
  }

  try {
    const query = `INSERT INTO user_roles (user_id, companyid, role) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role RETURNING *`;
    const result = await pool.query(query, [user_id, companyid.rows[0].companyid, role]);
    res.json({ message: "Role request submitted", user_role: result.rows[0] });
  } catch (err) {
    console.error("Error requesting role:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default UserRoutes;
