import express, { Request, Response } from "express";
import { signup, login, logout } from "../controllers/auth.controller";
import { verifyUser, CustomRequest } from "../utils/verifyUser"; // Ensure the path is correct

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/checkAuth", verifyUser, (req: CustomRequest, res: Response) => {
  if (req.user) {
    res
      .status(200)
      .json({ username: req.user.username, email: req.user.email });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

export default router;
