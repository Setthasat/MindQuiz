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
const auth_1 = require("./api/auth");
const room_1 = require("./api/room");
const quiz_1 = require("./api/quiz");
const submission_1 = require("./api/submission");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8888;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(process.env.DB_URL);
        console.log("✅ Database connected ...");
    }
    catch (err) {
        console.error("❌ Database connection error:", err);
        process.exit(1);
    }
});
if (process.env.DB_URL) {
    connectDB();
}
else {
    console.log("⚠️ Can't find DB_URL");
    process.exit(1);
}
// Initialize API instances
const Authinst = new auth_1.AuthAPI();
const RoomAPIinst = new room_1.RoomAPI();
const QuizAPIinst = new quiz_1.QuizAPI();
const SubmissionAPIinst = new submission_1.SubmissionAPI();
// Health check
app.get("/", (req, res) => {
    res.json({
        message: "Quiz Platform API Server",
        status: "running",
        timestamp: new Date().toISOString()
    });
});
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        database: mongoose_1.default.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    });
});
// Auth routes
app.post("/api/register", Authinst.register);
app.post("/api/login", Authinst.login);
app.get("/api/verify/:token", Authinst.verifyEmail);
app.post("/api/get/user", Authinst.getUserProfile);
app.post("/api/update/user", Authinst.updateUserProfile);
// Room routes
app.post("/api/room/create", RoomAPIinst.createRoom);
app.post("/api/room/get", RoomAPIinst.getRoom);
app.post("/api/room/join", RoomAPIinst.joinRoom);
app.post("/api/room/leave", RoomAPIinst.leaveRoom);
app.post("/api/room/delete", RoomAPIinst.deleteRoom);
app.post("/api/room/user-rooms", RoomAPIinst.getUserRooms);
app.post("/api/room/search", RoomAPIinst.searchRooms);
// Quiz routes
app.post("/api/quiz/create", QuizAPIinst.createQuiz);
app.post("/api/quiz/get", QuizAPIinst.getQuiz);
app.post("/api/quiz/update", QuizAPIinst.updateQuiz);
app.post("/api/quiz/delete", QuizAPIinst.deleteQuiz);
// Submission routes
app.post("/api/submission/submit", SubmissionAPIinst.submitQuiz);
app.post("/api/submission/get-all", SubmissionAPIinst.getSubmissions);
app.post("/api/submission/grade-writing", SubmissionAPIinst.gradeWritingQuestion);
app.post("/api/submission/get-detail", SubmissionAPIinst.getSubmissionDetail);
app.post("/api/submission/get-user", SubmissionAPIinst.getUserSubmission);
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        data: null
    });
});
app.use("*", (req, res) => {
    res.status(404).json({
        status: 404,
        message: "Route not found",
        data: null
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
