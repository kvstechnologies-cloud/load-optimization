// Azure App Service startup file
// This file helps Azure find and start your application

const { spawn } = require('child_process');
const path = require('path');

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || 5000;

// Start the application
const app = spawn('node', [path.join(__dirname, 'dist', 'index.js')], {
  stdio: 'inherit',
  env: process.env
});

app.on('error', (error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

app.on('close', (code) => {
  console.log(`Application exited with code ${code}`);
  if (code !== 0) {
    process.exit(code);
  }
});