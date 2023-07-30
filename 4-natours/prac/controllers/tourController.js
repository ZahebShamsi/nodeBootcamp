const fs = require('fs');
const Tour = require('../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchError');

//#region middleware

    // checkId isn't needed because mongoose create id automatically
        // exports.checkId = (req, res, next, val) => {
        //     console.log(`Tour id is: ${val}`);
        //     if (req.params.id * 1 > tours.length) {
        //         return res.status(404).json({
        //           status: 'fail',
        //           message: 'Invalid ID'
        //         });
        //       }

        //     next(); // will goto next middleware if validated ... else return
        // }
//#endregion

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing name or price'
      });
    }
    next();
  };

exports.aliasTopTours = (req, res, next) => { // prefills the request param even if user hasn't filled the query params
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage, price'
    req.query.fields = 'name, price, ratingsAverage, summary, difficulty'
    next();
}

exports.getAllTours = catchAsync(async (req,res) => {
    const queryObj = {...req.params};
    //#region filter
        // Type 1
            // const queryObj = {...req.params};
            // const excludedFields = ['page','sort', 'limit', 'fields']
            // excludedFields.forEach((el) => delete queryObj[el]);
            // const query = Tour.find(queryObj);
            // const tours = await query;

        // Type 2
            // const tours = await Tour.find(query)
                            // .where('duration').equals(5)
                            // .where('difficulty').equals('easy');
                // can't use this one becoz every where operation returns filtered object
                // once anything return , then await wont wait for final operation.

        // Type 3 Advance filtering
            // url - ?duration[gte]=5&difficulty=easy&price[lt]=1500

            // let queryStr = JSON.stringify(queryObj);
            // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
            // const query = Tour.find(JSON.parse(queryStr));
    //#endregion

    //#region Sort 
        // url = ?sort=price  //sorted by price in ascending order
        // url = ?sort=-price // minus added , sorted by price in descending order
        // url = ?sort=-price,rating // sorted by price in ascending order , if same price then sort by rating
        
            // let queryStr = JSON.stringify(queryObj);
            // let query = Tour.find(JSON.parse(queryStr));
            
            // if(req.query.sort){
            //     const sortBy = req.query.sort.split(',').join(' '); //mongoose accept space separated values
            //     query = query.sort(sortBy);
            // }else{
            //     query = query.sort(-createdAt); // default sorting result case
            // }
            
            // const tours = await query;  
    
        //#endregion

    //#region Limiting Fields - return only required properties

            // url = ?fields=name,price //returns only name and price property in response
            // url = ?fields=-price // minus added , returnsall properties except price
            // you can also provide "select" : false in the schema for the property to remove the property from response
        
            // let queryStr = JSON.stringify(queryObj);
            // let query = Tour.find(JSON.parse(queryStr));
            
            // if(req.query.fields){
            //     const fields = req.query.fields.split(',').join(' '); //mongoose accept space separated values
            //     query = query.select(fields);
            // }else{
            //     query = query.select('-__v'); // default remove this property
            // }
            
            // const tours = await query;
    //#endregion

    //#region Pagination and limiting

        // page=3&limit=10 , 1-10 page 1 , 11-20 page 2, 21-30 page 3
            // const page = req.query.page * 1 || 1;
            // const limit = req.query.limit * 1 || 100;
            // const skip = (page - 1) * limit;

            // query = query.skip(skip).limit(limit);

            // if(req.query.page){
            //     const numTours = await Tour.countDocuments(); // return row counts
            //     if(skip >= numTours){ throw new Error('This page does not exist')}
            // }

            // const tours = await Tour.find();
    //#endregion

    // const tours = await Tour.find();

    const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    const tours = await features.query;

    
        res.status(200).json({
            'status' : 'success',
            result : tours.length,
            data : { tours }
        })

})

exports.createTour = catchAsync(async (req,res) => {

    // old method
        // const tour = new Tour({}); 
        // tour.save({})
    
    //  new method
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            'status' : 'success',
            data : newTour
        })

})

exports.getTourById = catchAsync(async (req,res) => {

    // old
        // const id = req.params.id * 1;
        // const tour = tours.find( el => el.id === id);

    // new
    const tours = await Tour.findById(req.params.id);  // Tour.findOne{_id : req.params.id}
            res.status(200).json({
                'status' : 'success',
                data : { tours }
            })

})

exports.updateTour = catchAsync(async (req,res) => {
        const tour = await Tour.findByIdAndUpdate(
            req.params.id, 
            req.body , 
            {   new : true, // returns updated object
                runValidators : true // to runValidator mentioned in properties in tour model
            }
        )

        res.status(200).json({
            'status' : 'success',
            data : {tour}
        })
})

exports.deleteTour = catchAsync(async (req,res) => {
        const tour = await Tour.findByIdAndDelete(
            req.params.id, 
        )

        res.status(204).json({
            'status' : 'successfully deleted',
        })
})

//#region Aggregate controllers
exports.getTourStats = catchAsync(async (req, res) => {
      const stats = await Tour.aggregate([
        {
          $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
          $group: {
            _id: { $toUpper: '$difficulty' }, // null if we want to group all data 
            numTours: { $sum: 1 },
            numRatings: { $sum: '$ratingsQuantity' },
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        },
        {
          $sort: { avgPrice: 1 }
        }
        // we can also chain the aggregation pipeline
        // {
        //   $match: { _id: { $ne: 'EASY' } }
        // }
      ]);
  
      res.status(200).json({
        status: 'success',
        data: {
          stats
        }
      });

  });
  
  exports.getMonthlyPlan = catchAsync(async (req, res) => {
      const year = req.params.year * 1; // 2021
  
      const plan = await Tour.aggregate([
        {
          $unwind: '$startDates'  
          // startDates array to string , if 3 startDates elements in a documents then it will break into 3 documents
        },
        {
          $match: {
            startDates: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`)
            }
          }
        },
        {
          $group: {
            _id: { $month: '$startDates' },
            numTourStarts: { $sum: 1 }, // count 1 for each document
            tours: { $push: '$name' } // return array
          }
        },
        // {
        //   $addFields: { month: '$_id' } // count
        // },
        // {
        //   $project: {
        //     _id: 0 // don't send in return statement
        //   }
        // },
        // {
        //   $sort: { numTourStarts: -1 } // descending order
        // },
        // {
        //   $limit: 12 // max 12 months (max count)
        // }
      ]);
  
      res.status(200).json({
        status: 'success',
        data: {
          plan
        }
      });
  });

//#endregion