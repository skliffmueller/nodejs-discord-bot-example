const http = require('http');
const qs = require('querystring');

function createServer(hostname, port, routes) {
    const server = http.createServer((req, res) => {
        let route = routes.find(r => {
            return r.uri == req.url && r.method == req.method;
        });
        if(!route) {
            route = routes.find(r => {
                return r.uri == '*' && r.method == req.method;
            })
        }
        if(!route) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Not Found\n');
            return;
        }
        if(req.method == 'GET') {
            try {
                route.handler(req, res)
            } catch(e) {
                console.log(e);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Internal Service Error\n');
            }
            return;
        }
        if(req.method == 'POST') {
            let route = routes.find(r => {
                return r.uri == req.url
            });
            if(!route) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Not Found\n');
                return;
            }
    
            let body = '';
            req.on('data', data => (body += data));
            req.on('end', () => {
                if(req.headers['content-type']=='application/json') {
                    req.body = JSON.parse(body);
                } else if(req.headers['content-type']=='application/x-www-form-urlencoded') {
                    req.body = qs.parse(body);
                } else {
                    req.body = body;
                }
                try {
                    route.handler(req, res)
                } catch(e) {
                    console.log(e);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Internal Service Error\n');
                }
            })
            return;
        }
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Bad Request\n');
    });
    
    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });

    return server;
}

module.exports = createServer;