// Central place to read and export environment variables.
// Import this instead of using process.env directly elsewhere in the app.
require('dotenv').config({ quiet: true }); // quiet: suppress dotenv's random console "tip" ads

module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
