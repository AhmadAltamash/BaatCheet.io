import { Router } from "express";
import { getUserInfo, login, signup, updateProfile } from '../controllers/AuthController.js'
import { verifyToken } from "../middleware/AuthMiddleware.js";

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post('/login', login)
authRoutes.get('/user-info', verifyToken, (req, res, next) => {
    console.log("Cookie received: ", req.cookies.jwt);
    console.log("Decoded userId: ", req.userId);
    next();
}, getUserInfo);
  
authRoutes.post('/update-profile', verifyToken, updateProfile)

export default authRoutes;