const http = require('http');
const url = require('url');


const server = http.createServer((req, res) => {
    
    const pathName = req.url;

    if(pathName === '/' || pathName === '/overview'){
        res.end("<h1>HELLO NODE<h1>");
    }else if(pathName === '/products'){
        res.end("<h1>HELLO PRODUCTS<h1>");
    }else{
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