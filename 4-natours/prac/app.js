const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');

const app = express();

//#region 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
//#endregion

// #region 2) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//#endregion

//#region Route Error handling
  // middleware reached here, means the requested route is not listed above.
  // .all means all types of api methods (get/post/patch/delete etc)
  app.all('*').use((req, res, next) => {

    // basic route error handling
    // res.status(404).json({
    //   status : 'fail',
    //   message : `Cant find ${req.originalUrl} route`
    // })
  

  // b)error middleware
  // const err = new Error(`Cant find ${req.originalUrl} route`);
  // err.statusCode = 404;
  // err.status = 'fail'
  // next(err) //pass param in next() means middleware will skip all middlewares and skip to the error middleware

  // c) from common new Apperror class
   next(new AppError(`Cant find ${req.originalUrl} route`)) // 

  })
//#endregion


//#region 3) Global Error Handler

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || '500';
  err.status = err.status || 'error'

  res.status(err.statusCode).json({
    statusCode : err.statusCode,
    message : err.message
  })

})

//#endregion

module.exports = app;
