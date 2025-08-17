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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = require("./api/api");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8888;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.DB_URL);
        console.log("✅ Database connected ...");
    }
    catch (err) {
        console.error("❌ Database connection error:", err);
    }
});
if (process.env.DB_URL) {
    connectDB();
}
else {
    console.log("⚠️ Can't find DB_URL");
}
const APIinst = new api_1.API();
app.get("/", (req, res) => {
    res.send("Hello from Express + TypeScript 🚀");
});
app.post("/api/register", (req, res) => APIinst.register);
app.post("/api/login", (req, res) => APIinst.login);
app.get("/api/verify/:token", (req, res) => APIinst.verifyEmail);
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
