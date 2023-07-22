const http = require('http');
const fs = require('fs');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

const dataHtml = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(dataHtml);

const tempOverview = fs.readFileSync(
    `${__dirname}/templates/overview.html`,
    'utf-8'
  );
  const tempCard = fs.readFileSync(
    `${__dirname}/templates/card.html`,
    'utf-8'
  );
  const tempProduct = fs.readFileSync(
    `${__dirname}/templates/product.html`,
    'utf-8'
  );



const server = http.createServer((req, res) => {
    
    const {query, pathname} = url.parse(req.url, true); // parseUrl
    // Overview Page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {
            'Content-type': 'text/html'
          });
      
          const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
          const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
          res.end(output);
    }
    
    // Products page
    else if(pathname === '/product'){
         const product = dataObj[query.id];
         const output = replaceTemplate(tempProduct, product);
         res.end(output);
    }

    // API Page (readFile from JSON) 
    else if(pathname === '/api'){
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