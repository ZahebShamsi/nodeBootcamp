const http = require('http');
const fs = require('fs');

const dataHtml = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(dataHtml);

const server = http.createServer((req, res) => {
    
    const pathName = req.url;

    // Overview Page
    if(pathName === '/' || pathName === '/overview'){
        res.writeHead(200, {
            'Content-type': 'text/html'
          });
          res.end("<h1>HELLO OVERVIEW<h1>");
    }
    
    // Products page
    else if(pathName === '/products'){
        res.end("<h1>HELLO PRODUCTS<h1>");
    }

    // API Page (readFile from JSON) 
    else if(pathName === '/api'){
        res.writeHead(200 , {'Content-Type' : 'application/json',})
        res.end(dataHtml);
    }

    // Not Found
    else{
        res.writeHead(404 , {
            'Content-Type' : 'text/html',
            'my-header' : 'its mine'
        });
        res.end("<h1>404 !!! Not Found<h1>");
    }
    
});

server.listen('8000', '127.0.0.1', () => {
    console.log("LISTENING ON 8000");
})