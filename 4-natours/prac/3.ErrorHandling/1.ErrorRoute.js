const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
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

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


//#region Route Error handling
  // middleware reached here, means the requested route is not listed above.
  // .all means all types of api methods (get/post/patch/delete etc)
  app.all('*').use((req, res, next) => {

    res.status(404).json({
      status : 'fail',
      message : `Cant find ${req.originalUrl} route`
    })
  })

//#endregion

module.exports = app;
