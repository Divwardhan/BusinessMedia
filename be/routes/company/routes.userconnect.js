import { Router } from "express";
import dotenv from "dotenv";
import pool from "../../db/database_connection.js";

dotenv.config();
const companyUser = Router();


companyUser.get("/followers/:company_id", async (req, res) => {
  const { company_id } = req.params;

  try {
    const followers = await pool.query(
      `SELECT user_id FROM followers WHERE company_id = $1`, 
      [company_id]
    );
    res.json({ followers: followers.rows });
  } catch (err) {
    console.error("Error fetching followers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

companyUser.get("/member-requests/:company_id", async (req, res) => {
  const { company_id } = req.params;

  try {
    const requests = await pool.query(
      `SELECT user_id, role, role_status FROM user_roles WHERE companyid = $1 AND role_status = false`,
      [company_id]
    );
    res.json({ requests: requests.rows });
  } catch (err) {
    console.error("Error fetching member requests:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Accept or reject membership requests
companyUser.post("/handle-request", async (req, res) => {
  const { company_id, user_id, action } = req.body; // action can be "accept" or "reject"

  try {
    if (action === "accept") {
      await pool.query(
        `UPDATE user_roles SET status = true WHERE companyid = $1 AND user_id = $2`,
        [company_id, user_id]
      );
      res.json({ message: "User request accepted" });
    } else if (action === "reject") {
      await pool.query(
        `DELETE FROM user_roles WHERE companyid = $1 AND user_id = $2`,
        [company_id, user_id]
      );
      res.json({ message: "User request rejected" });
    } else {
      res.status(400).json({ error: "Invalid action" });
    }
  } catch (err) {
    console.error("Error handling request:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default companyUser;
