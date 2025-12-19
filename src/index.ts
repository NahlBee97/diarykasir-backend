import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"

dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

// Routes
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";

// cors
app.use(
  cors({
    origin: process.env.FE_PRO_URL || process.env.FE_DEV_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (req: Request, res: Response) => {
  res.send("Diary Kasir Backend Connected");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);

// Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
