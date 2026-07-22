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
