import express from "express";
import isAuthenticatedUser from "../middlewares/isAuthenticatedUser";
import { signup, signin, getMe } from "../controllers/authController";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/me", isAuthenticatedUser, getMe);

export default router;
