import { Router } from "express";
import { getDirections } from "../controllers/maps.controller";

const router = Router();

router.get("/directions", getDirections);

export default router;
