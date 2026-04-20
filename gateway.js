const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({ ws: true });

proxy.on('error', (err, req, res) => {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Application is booting up. Please refresh in a few seconds.');
});

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/igaming-platform/B2C-admin')) {
    proxy.web(req, res, { target: 'http://localhost:3001' });
  } else if (req.url.startsWith('/igaming-platform/B2C-frontend')) {
    proxy.web(req, res, { target: 'http://localhost:3002' });
  } else if (req.url.startsWith('/igaming-platform/B2B-admin')) {
    proxy.web(req, res, { target: 'http://localhost:3003' });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found on Gateway.');
  }
});

server.on('upgrade', (req, socket, head) => {
  if (req.url.startsWith('/igaming-platform/B2C-admin')) {
    proxy.ws(req, socket, head, { target: 'http://localhost:3001' });
  } else if (req.url.startsWith('/igaming-platform/B2C-frontend')) {
    proxy.ws(req, socket, head, { target: 'http://localhost:3002' });
  } else if (req.url.startsWith('/igaming-platform/B2B-admin')) {
    proxy.ws(req, socket, head, { target: 'http://localhost:3003' });
  }
});

server.listen(80, () => {
  console.log('✅ Local API Gateway running on http://muratbosnak');
});