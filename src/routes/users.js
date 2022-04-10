import express from "express";
import verify from "../middlewares/verifyJWT";
import { getAllUser, getUserById, updatedUser, deletedUser } from "../controllers/user";

const router = express.Router()

// Get user by id
router.get("/:id", getUserById)

// Get all user
router.get("/", getAllUser)

// Update user
router.put("/:id", verify, updatedUser)

// Delete user
router.delete("/:id", verify , deletedUser)


export default router