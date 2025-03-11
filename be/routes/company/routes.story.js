import { Router } from "express";
import { companyTokenGenerate } from "../../middlewares/middleware.company.js";
import pool from "../../db/database_connection.js";

const storyRoutes= Router()

storyRoutes.get('/:cname', async (req, res) => {
    try {
        const cname = decodeURIComponent(req.params.cname);

        if (!cname) {
            return res.status(400).json({ message: "Company name is needed to fetch their stories" });
        }

        const companyResult = await pool.query(
            'SELECT companyid FROM accesscreds WHERE LOWER(cname) = LOWER($1)', 
            [cname]
        );

        if (companyResult.rowCount === 0) {
            return res.status(404).json({ message: "Company not found" });
        }

        const companyId = companyResult.rows[0].companyid;

        const storyQuery = `
            SELECT stories.*, accesscreds.cname AS company_name
            FROM stories
            INNER JOIN accesscreds ON stories.companyid = accesscreds.companyid
            WHERE stories.companyid = $1 
                AND stories.isactive = true 
                AND stories.expires_at > NOW()
            ORDER BY stories.storytime DESC
            LIMIT 1;
        `;

        const storyResult = await pool.query(storyQuery, [companyId]);

        if (storyResult.rowCount === 0) {
            return res.status(404).json({ message: "No active stories found for this company" });
        }

        res.status(200).json(storyResult.rows[0]);
    } catch (error) {
        console.error("Error fetching story:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

storyRoutes.delete("/delete/:storyId", companyTokenGenerate, async (req, res) => {
    try {
        const userId = req.userId;
        const { storyId } = req.params;

        if (!userId) {
            return res.status(401).json({ message: "Please login to delete a story" });
        }

        if (!storyId) {
            return res.status(400).json({ message: "Story ID is required to delete a story" });
        }

        const companyQuery = `SELECT companyid FROM accesscreds WHERE companyid = $1`;
        const companyResult = await pool.query(companyQuery, [userId]);

        if (companyResult.rowCount === 0) {
            return res.status(403).json({ message: "You are not authorized to delete stories" });
        }

        const companyId = companyResult.rows[0].companyid;

        const storyCheckQuery = `SELECT * FROM stories WHERE storyid = $1 AND companyid = $2`;
        const storyCheck = await pool.query(storyCheckQuery, [storyId, companyId]);

        if (storyCheck.rowCount === 0) {
            return res.status(404).json({ message: "Story not found or you do not have permission to delete it" });
        }

        const deleteQuery = `DELETE FROM stories WHERE storyid = $1 AND companyid = $2 RETURNING *`;
        const deletedStory = await pool.query(deleteQuery, [storyId, companyId]);

        res.status(200).json({ 
            message: "Story deleted successfully", 
            deletedStory: deletedStory.rows[0] 
        });

    } catch (err) {
        console.error("Error deleting story:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default storyRoutes;

