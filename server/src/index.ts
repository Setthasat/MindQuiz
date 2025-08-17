import express, { Request, Response, Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { AuthAPI } from "./api/auth";
import { RoomAPI } from "./api/room";
import { QuizAPI } from "./api/quiz";
import { SubmissionAPI } from "./api/submission";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8888;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL!);
        console.log("✅ Database connected ...");
    } catch (err) {
        console.error("❌ Database connection error:", err);
        process.exit(1);
    }
};

if (process.env.DB_URL) {
    connectDB();
} else {
    console.log("⚠️ Can't find DB_URL");
    process.exit(1);
}

// Initialize API instances
const APIinst = new AuthAPI();
const RoomAPIinst = new RoomAPI();
const QuizAPIinst = new QuizAPI();
const SubmissionAPIinst = new SubmissionAPI();

// Health check
app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "Quiz Platform API Server",
        status: "running",
        timestamp: new Date().toISOString()
    });
});

app.get("/health", (req: Request, res: Response) => {
    res.json({
        status: "healthy",
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    });
});

// Auth routes
app.post("/api/register", APIinst.register);
app.post("/api/login", APIinst.login);
app.get("/api/verify/:token", APIinst.verifyEmail);

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

app.use((err: any, req: Request, res: Response, next: any) => {
    console.error("Error:", err);
    res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        data: null
    });
});

app.use("*", (req: Request, res: Response) => {
    res.status(404).json({
        status: 404,
        message: "Route not found",
        data: null
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
