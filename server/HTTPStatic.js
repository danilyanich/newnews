
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const port = 3000;

const queryToObject = (query) => {
    if (!query) return false;
    let decquery = decodeURIComponent(query);
    try {
        return JSON.parse(
            (decquery
                .replace(/\?/, '{"')
                .replace(/=/g, '":"')
                .replace(/[&;]/g, '","')
                + '"}')
                .replace(/"\[.+\]"/, match => {
                    return match
                        .replace(/"\[/, '["')
                        .replace(/\]"/, '"]')
                        .replace(/,/, '","');
                })
            );
    } catch (ex) {
        return false;
    }
};

const extentions = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword'
};

const home = './docs';

const responses = [
    {
        matcher: /^\/$/g,
        listener: (request, response) => {
            fs.readFile(path.join(home, 'index.html'), (error, data) => {
                if (error) {
                    response.statusCode = 500;
                    response.end(`Error getting the file: ${error}.`);
                } else {
                    response.setHeader('Content-type', 'text/html');
                    response.end(data);
                }
            });
        }
    }, {
        matcher: /^.*$/g,
        listener: (request, response) => {
            const parsedUrl = url.parse(request.url);
            let pathname = `./docs${parsedUrl.pathname}`;
            const ext = path.parse(pathname).ext;

            fs.exists(pathname, (exist) => {
                if (!exist) {
                    response.statusCode = 404;
                    response.end(`File ${pathname} not found!`);
                    return;
                }

                fs.readFile(pathname, (error, data) => {
                    if (error) {
                        response.statusCode = 500;
                        response.end(`Error getting the file: ${error}.`);
                    } else {
                        response.setHeader('Content-type', extentions[ext] || 'text/plain');
                        response.end(data);
                    }
                });
            });
        }
    }
];


http.createServer((request, response) => {
    console.log(`${request.method}:${request.url}`);
    for (let res of responses)
        if (request.url.match(res.matcher)) {
            res.listener(request, response);
            break;
        }
}).listen(port);
