"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("./error");
const verifyUser = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next((0, error_1.errorHandler)(401, "Unauthorized"));
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, ((err, decoded) => {
        if (err) {
            return next((0, error_1.errorHandler)(401, "Unauthorized"));
        }
        else {
            if (decoded &&
                typeof decoded === "object" &&
                "id" in decoded &&
                "email" in decoded) {
                req.user = {
                    id: decoded.id,
                    email: decoded.email,
                };
                next();
            }
            else {
                return next((0, error_1.errorHandler)(401, "Unauthorized"));
            }
        }
    }));
};
exports.verifyUser = verifyUser;
