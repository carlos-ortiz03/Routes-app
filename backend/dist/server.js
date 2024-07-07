"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Ensure this is at the very top
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const maps_route_1 = __importDefault(require("./routes/maps.route"));
const routes_route_1 = __importDefault(require("./routes/routes.route")); // Add this import
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((err) => {
    console.log("Error connecting to MongoDB", err);
});
const app = (0, express_1.default)();
// Set up CORS
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_route_1.default);
app.use("/api/maps", maps_route_1.default);
app.use("/api/routes", routes_route_1.default); // Add this line
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
app.listen(5001, () => {
    console.log("Server is running on http://localhost:5001");
});
