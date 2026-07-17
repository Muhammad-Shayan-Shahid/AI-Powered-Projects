const app = require('./src/app');
const connectDB = require('./src/config/database');
const { PORT } = require('./src/config/config');

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => { 
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
