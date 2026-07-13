import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import config from "./src/config/config.js";

connectDB().then(() => {
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
});
