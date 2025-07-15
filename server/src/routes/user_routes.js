import { Router } from "express";
import { registerUser,loginUser,refreshAccessToken,logoutUser,updateUserAvatar,updateProfile } from "../controllers/user_ctrl.js";
import {upload } from "../middlewares/multer_middlewares.js"
import { verifyToken } from "../middlewares/verifyToken.js";
const router = Router();

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout",verifyToken, logoutUser);
router.post("/update-avatar",verifyToken, upload.single("avatar"), updateUserAvatar);
router.put("/profile",verifyToken,updateProfile);

export default router;
