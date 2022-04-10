import express from "express";

import { createCategory, getCategories } from "../controllers/category";

const router = express.Router();

// post category
router.post("/", createCategory)

// get categories
router.get("/", getCategories)

export default router;