import express from "express";
import { signup, login } from "../controllers/auth.controller";
import { verifyUser } from "../utils/verifyUser"; // Make sure the path is correct

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/checkAuth", verifyUser, (req, res) => {
  res.status(200).json({ message: "User is authenticated" });
});

export default router;
