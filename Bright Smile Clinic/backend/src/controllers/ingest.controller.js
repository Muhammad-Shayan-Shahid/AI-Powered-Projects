import { ingestAll } from "../services/ingestion.service.js";

export async function triggerIngestion(req, res, next) {
  try {
    const summary = await ingestAll();
    res.json({ message: "Ingestion complete", ...summary });
  } catch (err) {
    next(err);
  }
}
