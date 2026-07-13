import { Router } from "express";
import { triggerIngestion } from "../controllers/ingest.controller.js";

const router = Router();

router.post("/", triggerIngestion);

export default router;
