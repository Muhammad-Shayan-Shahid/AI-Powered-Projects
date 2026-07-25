// Registered first, before anything else, so nothing that runs during startup
// can slip through uncaught. A failing external API call (Gemini, Resend,
// ImageKit, etc.) anywhere in the app must never take down the whole process
// for every other feature (auth, booking, ...) — log it clearly and keep serving.
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection (server continues running):', reason);
});
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception (server continues running):', error);
});

const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/database');
const { PORT, CLIENT_URL } = require('./src/config/config');
const { initSocket } = require('./src/services/socket.service');

const startServer = async () => {
  await connectDB();

  // Socket.io needs the raw http server (not the Express app) so it can
  // upgrade connections to websockets on the same port.
  const server = http.createServer(app);
  initSocket(server, CLIENT_URL);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
