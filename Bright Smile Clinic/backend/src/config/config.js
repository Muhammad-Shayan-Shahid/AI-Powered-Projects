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
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  // Resend's shared sandbox sender — swap for a verified clinic domain before production.
  EMAIL_FROM: process.env.EMAIL_FROM || 'Bright Smile Clinic <onboarding@resend.dev>',
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
};
