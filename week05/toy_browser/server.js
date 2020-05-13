const http = require('http');

const server = http.createServer((req, res) => {
    console.log('request received');
    console.log(req.headers);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    res.setHeader('J-Foo', 'bar');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('ok')
});

server.listen(8080);
console.log(`the server running at 127.0.0.1:8080`)
