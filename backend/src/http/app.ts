import cors from "cors";
import express, { type Request, type Response, type NextFunction } from "express";

import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

export default app;
