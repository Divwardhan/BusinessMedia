import { Router } from "express";
import { companyTokenGenerate } from "../../middlewares/middleware.company.js";
import pool from "../../db/database_connection.js";

const postRoutes = Router();

// Test Route
postRoutes.get("/test", companyTokenGenerate, (req, res) => {
  res.json({ msg: "hi" });
});

// Create Post
postRoutes.post("/create_post", companyTokenGenerate, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId)
      return res.status(400).json({ message: "Please login to create a post" });

    const { mediaUrl, post_description } = req.body;
    if (!mediaUrl || !post_description) {
      return res
        .status(400)
        .json({ message: "Media URL and post description are required" });
    }

    const query = `INSERT INTO posts (companyid, mediaurl, post_description, posttime) VALUES ($1, $2, $3, NOW())`;
    const values = [userId, mediaUrl, post_description];

    await pool.query(query, values);

    res.status(201).json({ message: "Post created successfully" });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Posts by Company Name
postRoutes.get("/getposts/:cname", async (req, res) => {
  try {
    const cname = req.params.cname;
    if (!cname)
      return res.status(400).json({ message: "Company name is required" });

    const query1 = `SELECT companyid FROM accesscreds WHERE cname = $1`;
    const result1 = await pool.query(query1, [cname]);

    if (result1.rows.length === 0)
      return res.status(404).json({ message: "Company does not exist" });

    const companyId = result1.rows[0].companyid;

    // Fetch posts along with like count
    const query2 = `
      SELECT p.*, COALESCE(pl.like_count, 0) AS boost
      FROM posts p
      LEFT JOIN (
        SELECT postid, COUNT(*) AS like_count FROM post_likes GROUP BY postid
      ) pl ON p.postid = pl.postid
      WHERE p.companyid = $1
      ORDER BY p.posttime DESC
    `;
    const result2 = await pool.query(query2, [companyId]);

    if (result2.rows.length === 0)
      return res
        .status(404)
        .json({ message: "No posts found for this company" });

    const posts = result2.rows.map((post) => ({
      ...post,
      post_description: post.post_description
        ? Buffer.from(post.post_description, "binary").toString("utf-8")
        : null,
    }));

    res.status(200).json({ posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Post by ID
postRoutes.get("/getpost/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId)
      return res.status(400).json({ message: "Post ID is required" });

    const query = `
      SELECT p.*, COALESCE(pl.like_count, 0) AS boost
      FROM posts p
      LEFT JOIN (
        SELECT postid, COUNT(*) AS like_count FROM post_likes GROUP BY postid
      ) pl ON p.postid = pl.postid
      WHERE p.postid = $1
    `;
    const result = await pool.query(query, [postId]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Post not found" });

    const post = result.rows[0];
    if (post.post_description) {
      post.post_description = Buffer.from(
        post.post_description,
        "binary"
      ).toString("utf-8");
    }

    res.status(200).json({ post });
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Like Post
postRoutes.get("/like_post/:id", companyTokenGenerate, async (req, res) => {
  try {
    const postId = req.params.id;
    const companyId = req.userId;

    if (!postId)
      return res.status(400).json({ message: "Post ID is required" });
    if (!companyId)
      return res.status(401).json({ message: "Unauthorized: Please login" });

    const likeCheckQuery = `SELECT * FROM post_likes WHERE postid = $1 AND companyid = $2`;
    const likeCheckResult = await pool.query(likeCheckQuery, [
      postId,
      companyId,
    ]);

    if (likeCheckResult.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "You have already liked this post" });
    }

    const likeQuery = `INSERT INTO post_likes (postid, companyid, liked_at) VALUES ($1, $2, NOW())`;
    await pool.query(likeQuery, [postId, companyId]);

    res.status(200).json({ message: "Post liked successfully" });
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Unlike Post
postRoutes.delete(
  "/unlike_post/:id",
  companyTokenGenerate,
  async (req, res) => {
    try {
      const postId = req.params.id;
      const companyId = req.userId;

      if (!postId)
        return res.status(400).json({ message: "Post ID is required" });

      const checkQuery = `SELECT * FROM post_likes WHERE postid = $1 AND companyid = $2`;
      const checkResult = await pool.query(checkQuery, [postId, companyId]);

      if (checkResult.rows.length === 0) {
        return res.status(400).json({ message: "You haven't liked this post" });
      }

      const deleteQuery = `DELETE FROM post_likes WHERE postid = $1 AND companyid = $2`;
      await pool.query(deleteQuery, [postId, companyId]);

      res.status(200).json({ message: "Post unliked successfully" });
    } catch (err) {
      console.error("Error unliking post:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Delete Post
postRoutes.delete(
  "/delete_post/:id",
  companyTokenGenerate,
  async (req, res) => {
    try {
      const postId = req.params.id;
      const companyId = req.userId;

      if (!postId)
        return res.status(400).json({ message: "Post ID is required" });

      const checkQuery = `SELECT * FROM posts WHERE postid = $1 AND companyid = $2`;
      const checkResult = await pool.query(checkQuery, [postId, companyId]);

      if (checkResult.rows.length === 0) {
        return res
          .status(403)
          .json({ message: "Post not found or unauthorized" });
      }

      await pool.query("BEGIN");

      await pool.query(`DELETE FROM post_likes WHERE postid = $1`, [postId]);
      await pool.query(`DELETE FROM posts WHERE postid = $1`, [postId]);

      await pool.query("COMMIT");

      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      await pool.query("ROLLBACK");
      console.error("Error deleting post:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default postRoutes;
