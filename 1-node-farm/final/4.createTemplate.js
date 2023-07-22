const http = require('http');
const fs = require('fs');

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

const replaceTemplate = (cardTemp, product) => {

    let output = cardTemp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}


const server = http.createServer((req, res) => {
    
    const pathName = req.url;

    // Overview Page
    if(pathName === '/' || pathName === '/overview'){
        res.writeHead(200, {
            'Content-type': 'text/html'
          });
      
          const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
          const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
          res.end(output);
    }
    
    // Products page -> template bulding for products is in next page
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