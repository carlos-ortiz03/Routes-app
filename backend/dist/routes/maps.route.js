"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const maps_controller_1 = require("../controllers/maps.controller");
const router = (0, express_1.Router)();
router.get("/directions", maps_controller_1.getDirections);
exports.default = router;
