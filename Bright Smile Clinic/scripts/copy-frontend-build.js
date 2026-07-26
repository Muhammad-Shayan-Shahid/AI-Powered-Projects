// Copies the freshly-built frontend/dist into backend/public so the Express
// server (backend/src/app.js) can serve it as static files in production.
// Run automatically as part of the root "build" script on every deploy —
// never hand-copy this folder, since a stale manual copy would silently
// serve an old build after the next frontend change.
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'frontend', 'dist');
const publicDir = path.join(__dirname, '..', 'backend', 'public');

if (!fs.existsSync(distDir)) {
  console.error(`Frontend build output not found at ${distDir}. Run "npm run build" from the repo root.`);
  process.exit(1);
}

fs.rmSync(publicDir, { recursive: true, force: true });
fs.cpSync(distDir, publicDir, { recursive: true });

console.log(`Copied ${distDir} -> ${publicDir}`);
