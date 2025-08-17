import express, { Request, Response, Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { API } from "./api/api";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8888;

app.use(cors());
app.use(express.json());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL!);
        console.log("✅ Database connected ...");
    } catch (err) {
        console.error("❌ Database connection error:", err);
    }
};

if (process.env.DB_URL) {
    connectDB();
} else {
    console.log("⚠️ Can't find DB_URL");
}

const APIinst = new API();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello from Express + TypeScript 🚀");
});

app.post("/api/register", APIinst.register);
app.post("/api/login", APIinst.login);
app.get("/api/verify/:token", APIinst.verifyEmail);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
