const app = require('./server');
const http = require('http');

// Start server on ephemeral port and test /api/health
const srv = app.listen(0, () => {
  const port = srv.address().port;
  console.log('Test server listening on port', port);

  const options = {
    hostname: '127.0.0.1',
    port: port,
    path: '/api/health',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('STATUS:', res.statusCode);
      console.log('BODY:', data);
      srv.close(() => process.exit(0));
    });
  });

  req.on('error', (err) => {
    console.error('Request error:', err.message);
    srv.close(() => process.exit(2));
  });

  req.end();
});
