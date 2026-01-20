// Quick script to get your local IP address for network testing
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return 'localhost';
}

const ip = getLocalIP();
console.log('\n=== Local Network Access ===\n');
console.log(`Your local IP: ${ip}`);
console.log(`\nFrontend URL: http://${ip}:5173`);
console.log(`Backend API: http://${ip}:5000`);
console.log(`\nOther devices on your Wi-Fi can access:`);
console.log(`  - http://${ip}:5173 (Main App)\n`);

