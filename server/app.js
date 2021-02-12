const path = require('path');
const express = require('express');
const cors = require('cors');
const router = require('./router');

// Create Express Application
const app = express();

// Server Port
const port = 8080;

// Activate cors // Parsing body // Access Static Files // Routing 
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(router);

// Home endpoint  
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// Set Server Port
app.set('port', port || 3002);

module.exports = app;