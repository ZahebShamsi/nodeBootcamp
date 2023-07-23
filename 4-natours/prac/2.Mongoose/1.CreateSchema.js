const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

  //#region 1. Create schema and Model
 
  const tourSchema = new mongoose.Schema({
    name : {
      type : String,
      required : [true, 'A tour must have a name'], // validators
      // unique : true
    },
    rating : {
      type : Number,
      default : 4.5
    },
    price : {
      type : Number,
      required : [true, 'A tour must have a price'],
    }
  })

  const Tour = mongoose.model('Tour', tourSchema);

  const testTour = new Tour({
    "name" : "The park cam",
    "price" : 100
  })

  testTour.save().then((doc) => {
    console.log(doc)
  }).catch((err) => console.log('Error is 🍀', err))

  //#endregion


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});