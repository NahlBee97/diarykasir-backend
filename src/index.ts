import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

// Routes
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";

// cors
app.use(
  cors({
    origin: process.env.FE_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Diary Kasir Backend Connected");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
