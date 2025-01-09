import { connectDB } from "./config/db.js";
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { authRoutes } from "./routes/authRoutes.js";
import { chatRoutes } from "./routes/chatRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();


app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

export default app;