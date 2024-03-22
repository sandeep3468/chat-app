import express from "express";
import isAuthenticatedUser from "../middlewares/isAuthenticatedUser";
import {
  signup,
  signin,
  getMe,
  getAllUsers,
} from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", isAuthenticatedUser, getMe);
router.get("/allUsers", isAuthenticatedUser, getAllUsers);

export default router;
