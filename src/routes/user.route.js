import express from 'express'
import { getProfile, login, signup, updateProfile, userBlocked } from '../controllers/user.controller.js';
import verifyToken from '../middleware/auth.middleware.js';
import { authorizedRoles } from '../middleware/roles.middleware.js';

const router=express.Router();

router.post("/signup",signup)
router.post("/login",login)
router.get("/",verifyToken,getProfile)
router.put("/update",verifyToken,updateProfile)
router.put("/:userId/block",verifyToken,authorizedRoles("admin"),userBlocked)

export default router