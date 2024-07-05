import { Router } from "express";
import {
  saveRoute,
  getRoutes,
  deleteRoute,
  editRoute,
} from "../controllers/routes.controller";
import { verifyUser } from "../utils/verifyUser"; // Ensure this path is correct

const router = Router();

router.post("/save", verifyUser, saveRoute);
router.get("/", verifyUser, getRoutes);
router.delete("/:id", verifyUser, deleteRoute);
router.put("/:id", verifyUser, editRoute);

export default router;
