const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = 3000;

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//#region 1. MiddleWare
app.use(express.json()); // middleware for Post request

app.use(express.static(`${__dirname}/public`)) // expose static assets to browser url

app.use((req, res, next) => {
    console.log('From Middleware');
    next()
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next()
})

app.use(morgan('dev')); // 3rd party middleware for logging on console, it internally calls next();


//#endregion

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);



app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`)
})