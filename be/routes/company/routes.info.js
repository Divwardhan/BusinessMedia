import { Router } from "express";
import { companyTokenGenerate } from "../middlewares/middleware.company.js";
import pool from "../db/database_connection.js";

const companyInfoRoutes = Router();

// Get company info by company name
companyInfoRoutes.get("/info/:cname", async (req, res) => {
    try {
        const cname = req.params.cname;
        if (!cname) return res.status(400).json({ message: "Company name is required" });

        const query = `
            SELECT cname, description, type, profile_pic_url, cover_pic_url, followers_count, posts_count
            FROM company_info 
            WHERE cname = $1
        `;
        const values = [cname];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Company info not found" });
        }

        res.status(200).json({ info: result.rows[0] });
    } catch (err) {
        console.error("Error fetching company info:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Create or Add company info
companyInfoRoutes.post("/info/create", companyTokenGenerate, async (req, res) => {
    try {
        const companyId = req.userId;
        if (!companyId) return res.status(401).json({ message: "Unauthorized: Please login" });

        const { cname, description, type, profile_pic_url, cover_pic_url } = req.body;
        if (!cname || !description) {
            return res.status(400).json({ message: "Company name and description are required" });
        }

        const query = `
            INSERT INTO company_info (companyid, cname, description, type, profile_pic_url, cover_pic_url, followers_count, posts_count) 
            VALUES ($1, $2, $3, $4, $5, $6, 0, 0)
        `;
        const values = [companyId, cname, description, type || null, profile_pic_url || null, cover_pic_url || null];

        await pool.query(query, values);

        res.status(201).json({ message: "Company info created successfully" });
    } catch (err) {
        console.error("Error creating company info:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Edit company info
companyInfoRoutes.put("/info/edit", companyTokenGenerate, async (req, res) => {
    try {
        const companyId = req.userId;
        if (!companyId) return res.status(401).json({ message: "Unauthorized: Please login" });

        const { cname, description, type, profile_pic_url, cover_pic_url } = req.body;
        if (!cname) return res.status(400).json({ message: "Company name is required" });

        const query = `
            UPDATE company_info 
            SET 
                description = COALESCE($1, description),
                type = COALESCE($2, type),
                profile_pic_url = COALESCE($3, profile_pic_url),
                cover_pic_url = COALESCE($4, cover_pic_url)
            WHERE cname = $5 AND companyid = $6
        `;
        const values = [description || null, type || null, profile_pic_url || null, cover_pic_url || null, cname, companyId];

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

// Delete company info
companyInfoRoutes.delete("/info/delete", companyTokenGenerate, async (req, res) => {
    try {
        const companyId = req.userId;
        if (!companyId) return res.status(401).json({ message: "Unauthorized: Please login" });

        const { cname } = req.body;
        if (!cname) return res.status(400).json({ message: "Company name is required" });

        const query = `DELETE FROM company_info WHERE cname = $1 AND companyid = $2`;
        const values = [cname, companyId];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Company info not found" });
        }

        res.status(200).json({ message: "Company info deleted successfully" });
    } catch (err) {
        console.error("Error deleting company info:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default companyInfoRoutes;
