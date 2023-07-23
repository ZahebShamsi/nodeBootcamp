const fs = require('fs');
const Tour = require('../models/tourModel')

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

exports.getAllTours = async (req,res) => {

    const tours = await Tour.find();
    try{
        res.status(200).json({
            'status' : 'success',
            result : tours.length,
            data : { tours }
        })
    }catch(err){
        res.status(400).json({
            'status' : 'error',
            'message' : err
        })
    }

}

exports.createTour = async (req,res) => {

    // old method
        // const tour = new Tour({}); 
        // tour.save({})
    
    //  new method
    try{
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            'status' : 'success',
            data : newTour
        })
    }catch(err){
        res.status(400).json({
            'status' : 'fail',
            data : 'Invalid Body'
        })
    }


}

exports.getTourById = async (req,res) => {

    // old
        // const id = req.params.id * 1;
        // const tour = tours.find( el => el.id === id);

    // new
    const tours = await Tour.findById(req.params.id);  // Tour.findOne{_id : req.params.id}
        try{
            res.status(200).json({
                'status' : 'success',
                data : { tours }
            })
        }catch(err){
            res.status(400).json({
                'status' : 'error',
                'message' : err
            })
        }
}

exports.updateTour = async (req,res) => {
    try{
        const tour = await Tour.findByIdAndUpdate(
            req.params.id, 
            req.body , 
            {   new : true, // returns updated object
                runValidators : true
            }
        )

        res.status(200).json({
            'status' : 'success',
            data : {tour}
        })

    }catch(err){
        res.status(404).json({
            'status' : 'fail',
            message : err
        })
    }
}

exports.deleteTour = async (req,res) => {
    try{
        const tour = await Tour.findByIdAndDelete(
            req.params.id, 
        )

        res.status(204).json({
            'status' : 'successfully deleted',
        })

    }catch(err){
        res.status(404).json({
            'status' : 'fail',
            message : err
        })
    }
}