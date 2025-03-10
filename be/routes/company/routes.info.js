import { Router } from "express";
<<<<<<< HEAD
import pool from "../../db/database_connection.js";
=======
import pool from "../db/database_connection.js";
>>>>>>> 50d0a0b21b553779ba777e68e250051a66cb3f92
import { companyTokenGenerate } from "../../middlewares/middleware.company.js";

const companyInfoRoutes = Router();

companyInfoRoutes.post(
  "/create_info",
  companyTokenGenerate,
  async (req, res) => {
    try {
      const companyId = req.userId;
      if (!companyId) {
        return res.status(401).json({ message: "Unauthorized: Please login" });
      }

      const {
        companyname,
        bio,
        weburl,
        phonenumber,
        email,
        genre,
        state,
        city,
      } = req.body;

      if (!companyname || !email) {
        return res
          .status(400)
          .json({ message: "Company name and email are required" });
      }

      const query = `
            INSERT INTO c_info (companyid, companyname, bio, weburl, phonenumber, email, genre, state, city)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (companyid) 
            DO UPDATE SET 
                companyname = EXCLUDED.companyname,
                bio = EXCLUDED.bio,
                weburl = EXCLUDED.weburl,
                phonenumber = EXCLUDED.phonenumber,
                email = EXCLUDED.email,
                genre = EXCLUDED.genre,
                state = EXCLUDED.state,
                city = EXCLUDED.city;
        `;
      const values = [
        companyId,
        companyname,
        bio,
        weburl,
        phonenumber,
        email,
        genre,
        state,
        city,
      ];

      await pool.query(query, values);
      res
        .status(201)
        .json({ message: "Company info created/updated successfully" });
    } catch (err) {
      console.error("Error creating/updating company info:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

companyInfoRoutes.get("/get_info/:companyId", async (req, res) => {
  try {
    const companyId = req.params.companyId;

    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required" });
    }

    const query = `SELECT companyid, companyname, bio, weburl, phonenumber, email, genre, state, city FROM c_info WHERE companyid = $1`;
    const values = [companyId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Company info not found" });
    }

    res.status(200).json({ companyInfo: result.rows[0] });
  } catch (err) {
    console.error("Error fetching company info:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

companyInfoRoutes.put("/edit_info", companyTokenGenerate, async (req, res) => {
  try {
    const companyId = req.userId;
    if (!companyId) {
      return res.status(401).json({ message: "Unauthorized: Please login" });
    }

    const { companyname, bio, weburl, phonenumber, email, genre, state, city } =
      req.body;

    const query = `
            UPDATE c_info
            SET companyname = $1, bio = $2, weburl = $3, phonenumber = $4, 
                email = $5, genre = $6, state = $7, city = $8
            WHERE companyid = $9
        `;
    const values = [
      companyname,
      bio,
      weburl,
      phonenumber,
      email,
      genre,
      state,
      city,
      companyId,
    ];

    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Company info not found" });
    }

    res.status(200).json({ message: "Company info updated successfully" });
  } catch (err) {
    console.error("Error updating company info:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

companyInfoRoutes.delete(
  "/delete_info",
  companyTokenGenerate,
  async (req, res) => {
    try {
      const companyId = req.userId;
      if (!companyId) {
        return res.status(401).json({ message: "Unauthorized: Please login" });
      }

      const query = `DELETE FROM c_info WHERE companyid = $1`;
      const values = [companyId];

      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Company info not found" });
      }

      res.status(200).json({ message: "Company info deleted successfully" });
    } catch (err) {
      console.error("Error deleting company info:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

<<<<<<< HEAD
export default companyInfoRoutes;
=======
export default companyInfoRoutes;
>>>>>>> 50d0a0b21b553779ba777e68e250051a66cb3f92
