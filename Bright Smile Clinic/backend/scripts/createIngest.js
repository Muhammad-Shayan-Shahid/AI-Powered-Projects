import mongoose from "mongoose";

import config from "../src/config/config.js";
import { ingestAll } from "../src/services/ingestion.service.js";

await mongoose.connect(config.mongodbUri);

console.log("Connected to MongoDB");

const result = await ingestAll();

console.log(result);

await mongoose.disconnect();

console.log("Ingestion completed");