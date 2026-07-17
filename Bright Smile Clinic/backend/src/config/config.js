// Central place to read and export environment variables.
// Import this instead of using process.env directly elsewhere in the app.
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};
