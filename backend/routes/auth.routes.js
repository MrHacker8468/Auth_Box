import express from "express";
import { login, logout, signup, verifyEmail , resetPassword , forgotPassword , checkAuth } from "../controllers/auth.controllers.js";
import { verifyToken } from "../middleware/verifytoken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


export default router;
