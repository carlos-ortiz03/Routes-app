"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes_controller_1 = require("../controllers/routes.controller");
const verifyUser_1 = require("../utils/verifyUser"); // Ensure this path is correct
const router = (0, express_1.Router)();
router.post("/save", verifyUser_1.verifyUser, routes_controller_1.saveRoute);
router.get("/", verifyUser_1.verifyUser, routes_controller_1.getRoutes);
router.delete("/:id", verifyUser_1.verifyUser, routes_controller_1.deleteRoute);
router.put("/:id", verifyUser_1.verifyUser, routes_controller_1.editRoute);
exports.default = router;
