import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connectDB.js'; // Ensure the file extension is included for ES modules
import authRoutes from './routes/auth.routes.js'; 
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json()); // allows us to parse incomming request : req.body
app.use(cookieParser()); // allows us to parse incomming cookies

app.use("/api/auth", authRoutes );

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}



app.listen(5000, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});

