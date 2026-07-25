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
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  // gemini-embedding-001 supports Matryoshka truncation to smaller output
  // dimensions (3072/1536/768) without a separate model — 768 keeps the
  // Atlas Vector Search index small while still giving good retrieval quality.
  GEMINI_EMBEDDING_MODEL: process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001',
  GEMINI_EMBEDDING_DIMENSIONS: Number(process.env.GEMINI_EMBEDDING_DIMENSIONS) || 768,
  // Pinned to a concrete, stable (non-preview) model — NOT a "-latest" alias.
  // "-latest" silently repoints to whatever Google currently considers the
  // best flash model, which is how this project ended up on gemini-3.6-flash
  // and its free tier is capped at only 20 requests/day. Google no longer
  // publishes per-model free-tier numbers in the docs (moved to the
  // account-specific dashboard at https://aistudio.google.com/rate-limit), so
  // this was chosen empirically for this project's API key: gemini-2.0-flash
  // and gemini-2.0-flash-lite-001 both returned a hard 0 free-tier limit for
  // this project, gemini-2.5-flash/-flash-lite 404 as no longer available to
  // new users, but gemini-3.1-flash-lite survived 8 rapid back-to-back calls
  // with no rate-limit error (vs. gemini-3.6-flash failing almost immediately)
  // and supports function calling + thoughtSignature correctly. If this ever
  // needs to change again, check the real numbers for this project at the
  // dashboard link above before picking a replacement.
  GEMINI_CHAT_MODEL: process.env.GEMINI_CHAT_MODEL || 'gemini-3.1-flash-lite',
};
