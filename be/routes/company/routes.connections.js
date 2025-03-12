import { Router } from "express";
import pool from "../../db/database_connection.js";
import { companyTokenGenerate } from "../../middlewares/middleware.company.js";

const connectionRoutes = Router();

// Send a connection request
connectionRoutes.post(
  "/send_request",
  companyTokenGenerate,
  async (req, res) => {
    try {
      const companyAId = req.userId;
      const { companyBId } = req.body;

      if (!companyAId || !companyBId) {
        return res
          .status(400)
          .json({ message: "Both company IDs are required" });
      }

      if (companyAId === companyBId) {
        return res.status(400).json({ message: "Cannot connect to yourself" });
      }

      // Check if a connection already exists
      const checkQuery = `
        SELECT * FROM connections 
        WHERE (companyAId = $1 AND companyBId = $2) 
           OR (companyAId = $2 AND companyBId = $1);
      `;
      const checkValues = [companyAId, companyBId];
      const existingConnection = await pool.query(checkQuery, checkValues);

      if (existingConnection.rows.length > 0) {
        return res.status(409).json({ message: "Connection already exists" });
      }

      // Create a new connection with status = 'pending'
      const query = `
        INSERT INTO connections (companyAId, companyBId, connection_info)
        VALUES ($1, $2, 'pending')
        RETURNING connectionid;
      `;
      const values = [companyAId, companyBId];
      const result = await pool.query(query, values);

      res
        .status(201)
        .json({
          message: "Connection request sent",
          connectionId: result.rows[0].connectionid,
        });
    } catch (err) {
      console.error("Error sending connection request:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Accept connection request
connectionRoutes.put(
  "/accept_request/:connectionid",
  companyTokenGenerate,
  async (req, res) => {
    try {
      const companyId = req.userId;
      const connectionId = req.params.connectionid;

      const query = `
        UPDATE connections
        SET connection_info = 'accepted'
        WHERE connectionid = $1 
          AND connection_info = 'pending'
          AND (companyAId = $2 OR companyBId = $2);
      `;
      const values = [connectionId, companyId];
      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "No pending request found" });
      }

      res.status(200).json({ message: "Connection accepted" });
    } catch (err) {
      console.error("Error accepting connection request:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Decline connection request
connectionRoutes.put(
  "/decline_request/:connectionid",
  companyTokenGenerate,
  async (req, res) => {
    try {
      const companyId = req.userId;
      const connectionId = req.params.connectionid;

      const query = `
        UPDATE connections
        SET connection_info = 'rejected'
        WHERE connectionid = $1 
          AND connection_info = 'pending'
          AND (companyAId = $2 OR companyBId = $2);
      `;
      const values = [connectionId, companyId];
      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "No pending request found" });
      }

      res.status(200).json({ message: "Connection declined" });
    } catch (err) {
      console.error("Error declining connection request:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// View existing connections
connectionRoutes.get("/connections", companyTokenGenerate, async (req, res) => {
  try {
    const companyId = req.userId;

    const query = `
        SELECT connectionid, companyAId, companyBId, connection_info
        FROM connections
        WHERE companyAId = $1 OR companyBId = $1;
      `;
    const values = [companyId];
    const result = await pool.query(query, values);

    res.status(200).json({ connections: result.rows });
  } catch (err) {
    console.error("Error fetching connections:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete connection
connectionRoutes.delete(
  "/delete_connection/:connectionid",
  companyTokenGenerate,
  async (req, res) => {
    try {
      const companyId = req.userId;
      const connectionId = req.params.connectionid;

      const query = `
        DELETE FROM connections
        WHERE connectionid = $1
          AND (companyAId = $2 OR companyBId = $2);
      `;
      const values = [connectionId, companyId];
      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Connection not found" });
      }

      res.status(200).json({ message: "Connection deleted" });
    } catch (err) {
      console.error("Error deleting connection:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default connectionRoutes;
