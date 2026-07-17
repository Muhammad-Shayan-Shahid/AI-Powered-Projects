const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Health check route to confirm the API is reachable.
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API running' });
});

module.exports = app;
