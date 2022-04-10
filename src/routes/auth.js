import express from 'express'

import { register, login, logout, refreshToken } from '../controllers/auth';


const router = express.Router();

// Register
router.post("/register", register)

// Login
router.post("/login", login)

//logout
router.post("/logout", logout)

//Refresh Token
router.post("/refresh", refreshToken)

export default router