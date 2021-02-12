const path = require('path');
const express = require('express');
const cors = require('cors');
const router = require('./router');
require("env2")("config.env");

// Create Express Application
const app = express();

// Activate cors // Parsing body // Access Static Files // Routing 
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.use(router);

// Home endpoint  
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// Set Server Port
app.set('port', process.env.PORT || 3002);

module.exports = app;