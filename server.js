const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Serve static files from dist/widget
app.use('/widget', express.static(path.join(__dirname, 'dist/widget')));

// Serve demo page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Widget server running at http://localhost:${PORT}`);
  console.log(`📦 Widget files available at http://localhost:${PORT}/widget/`);
  console.log(`🎯 Demo page available at http://localhost:${PORT}/`);
});