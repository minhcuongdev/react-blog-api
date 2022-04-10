import express from "express";

import { getPostById, getPosts, createdPost, updatedPost, deletePost } from "../controllers/post";

const router = express.Router();

// Get post by id
router.get("/:id", getPostById)

// Get all posts
router.get("/", getPosts)

// Create post
router.post("/", createdPost)

// Update post
router.put("/:id", updatedPost)

// delete post
router.delete("/:id", deletePost)

export default router;