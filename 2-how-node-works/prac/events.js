const EventEmitter = require('events');
const http = require('http');

//#region 1 - Event Emitter Intro

    // => code start 
        // const myEmitter = new EventEmitter();

        // myEmitter.on('newSale', () => {
        //     console.log('newSale 1')
        // })
        // myEmitter.on('newSale', () => {
        //     console.log('newSale 2')
        // })
        // myEmitter.on('newSale', (stock) => {
        //     console.log(`There are ${stock} sale`)
        // })
        // myEmitter.emit('newSale', 9, 2);
    // => code end 


    // => Result start
        // newSale 1
        // newSale 2
        // There are 9 sale
    // => Result end

    // => Explanation start
        //  we can also pass arguments in EventEmitter
    // => Explanation end

//#endregion 1

//#region 2 - Custom Class extends EventEmitter

    // => code start 
        // class Sales extends EventEmitter {
        //     constructor(){
        //         super(); // inherit all methods of Parent class
        //     }
        // }
        // const myEmitter = new Sales();

        // myEmitter.on('newSale', () => {
        //     console.log('newSale 1')
        // })
        // myEmitter.on('newSale', () => {
        //     console.log('newSale 2')
        // })
        // myEmitter.on('newSale', (stock) => {
        //     console.log(`There are ${stock} sale`)
        // })
        // myEmitter.emit('newSale', 9, 2);
    // => code end 


    // => Result start
        // newSale 1
        // newSale 2
        // There are 9 sale
    // => Result end

    // => Explanation start
        //  super() inherits all methods of Parent class
    // => Explanation end

//#endregion 2

//#region 3 - Server event emitters

    // => code start 
        // const server = http.createServer();
        // server.on('request', (req, res) => { 
        //     console.log(' request recieved 1 '); 
        //     res.end("Request recieved")
        // })
        // server.on('request', (req, res) => { 
        //     console.log(' another request recieved 2 ')
        // })
        // server.on('close', () => {
        //     console.log(' server closed ')
        // })

        // server.listen(8000, '127.0.0.1', () => {
        //     console.log('waitingg for request');
        // })

    // => code end 


    // => Result start

        // waitingg for request
        // request recieved 1 
        // another request recieved 2 
        // request recieved 1 
        // another request recieved 2 

    // => Result end

    // => Explanation start
        // server sends 2 request ... one for / , one for favicon... hence 2 times console.
        // we can send only 1 res.end(); 

    // => Explanation end

//#endregion 3
