import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";
import ingestRoutes from "./routes/ingest.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/chat", chatRoutes);
app.use("/api/ingest", ingestRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use(errorHandler); // must stay last

export default app;
