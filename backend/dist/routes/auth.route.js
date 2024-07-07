"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const verifyUser_1 = require("../utils/verifyUser"); // Make sure the path is correct
const router = express_1.default.Router();
router.post("/signup", auth_controller_1.signup);
router.post("/login", auth_controller_1.login);
router.get("/checkAuth", verifyUser_1.verifyUser, (req, res) => {
    res.status(200).json({ message: "User is authenticated" });
});
exports.default = router;
