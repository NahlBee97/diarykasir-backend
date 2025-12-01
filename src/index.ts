import express, { Request, Response } from "express";
import dotenv from "dotenv";

const app = express();

dotenv.config();

const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (reg: Request, res: Response) => {
  res.send("Diary Kasir Backend Connected");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
