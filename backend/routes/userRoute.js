import express from 'express';
import { checkAuth, login, signup, updateProfile } from '../controllers/userController.js';
import { auth } from '../middleware/auth.js';
import User from '../models/user.js';

export const userRouter = express.Router();

userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.put("/update-profile", auth, updateProfile);
userRouter.get("/check", auth, checkAuth);