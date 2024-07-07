"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editRoute = exports.deleteRoute = exports.getRoutes = exports.saveRoute = void 0;
const route_model_1 = __importDefault(require("../models/route.model"));
const saveRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, distance, geometry, travelMode } = req.body;
        const userId = req.user.id; // User ID is extracted from the token
        // Ensure geometry.coordinates is an array of arrays of numbers
        if (!Array.isArray(geometry.coordinates) ||
            !Array.isArray(geometry.coordinates[0])) {
            throw new Error("Invalid geometry coordinates");
        }
        const newRoute = new route_model_1.default({
            name,
            distance,
            geometry,
            travelMode,
            user: userId,
        });
        yield newRoute.save();
        res.status(201).json({ message: "Route saved successfully!" });
    }
    catch (error) {
        console.error("Error saving route:", error); // Log the error to the server console
        res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.saveRoute = saveRoute;
const getRoutes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const routes = yield route_model_1.default.find({ user: userId });
        res.status(200).json(routes);
    }
    catch (error) {
        console.error("Error fetching routes:", error); // Log the error to the server console
        res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.getRoutes = getRoutes;
const deleteRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const routeId = req.params.id;
        const userId = req.user.id;
        const route = yield route_model_1.default.findOneAndDelete({ _id: routeId, user: userId });
        if (!route) {
            return res.status(404).json({ message: "Route not found" });
        }
        res.status(200).json({ message: "Route deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting route:", error); // Log the error to the server console
        res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.deleteRoute = deleteRoute;
const editRoute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const routeId = req.params.id;
        const userId = req.user.id;
        const { name } = req.body;
        const route = yield route_model_1.default.findOneAndUpdate({ _id: routeId, user: userId }, { name }, { new: true });
        if (!route) {
            return res.status(404).json({ message: "Route not found" });
        }
        res.status(200).json({ message: "Route updated successfully", route });
    }
    catch (error) {
        console.error("Error updating route:", error); // Log the error to the server console
        res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.editRoute = editRoute;
