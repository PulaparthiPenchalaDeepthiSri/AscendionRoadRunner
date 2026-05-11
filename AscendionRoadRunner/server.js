const express = require('express');
const path = require('path');
const app = express();

// Serve static files from current directory
app.use(express.static(__dirname));

// Serve static files from js directory
app.use('/js', express.static(path.join(__dirname, 'js')));

// Main viewer dashboard route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'viewer.html'));
});

// Viewer page
app.get('/viewer.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'viewer.html'));
});

// Driver tracking page
app.get('/driver.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'driver.html'));
});

// Index/home page
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    service: 'RoadRunner',
    timestamp: new Date().toISOString() 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 RoadRunner is running on port ${PORT}`);
  console.log(`📍 Access at: http://localhost:${PORT}`);
});
