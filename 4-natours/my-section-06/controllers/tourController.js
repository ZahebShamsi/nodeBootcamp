const fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
  );

//#region middleware
exports.checkId = (req, res, next, val) => {
    console.log(`Tour id is: ${val}`);
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
          status: 'fail',
          message: 'Invalid ID'
        });
      }

    next(); // will goto next middleware if validated ... else return
}
//#endregion

exports.checkBody = (req, res, next) => {
  console.log(req);
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing name or price'
      });
    }
    next();
  };

exports.getAllTours = (req,res) => {
    res.status(200).json({
        'status' : 'success',
        requestTime : req.requestTime,
        result : tours.length,
        data : { tours }
    })
}

exports.createTour = (req,res) => {

    const newId =  tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
        res.status(201).json({
            'status' : 'success',
            data : { tour : newTour }
        })
    });
}

exports.getTourById = (req,res) => {
    const id = req.params.id * 1;
    const tour = tours.find( el => el.id === id);

    res.status(200).json({
        'status' : 'success',
        data : { tour }
    })
}

exports.updateTour = (req,res) => {
    const tour = tours.find( el => el.id === req.params.id);
    if(req.params.id * 1 > tours.length){
        return res.status(404).json({
            'status' : 'fail',
            message : 'invalid Id'
        })
    }
    res.status(200).json({
        'status' : 'success',
        data : '<>updated tour</>'
    })
}

exports.deleteTour = (req,res) => {
    const tour = tours.find( el => el.id === req.params.id);
    if(req.params.id * 1 > tours.length){
        return res.status(404).json({
            'status' : 'fail',
            message : 'invalid Id'
        })
    }
    res.status(204).json({
        'status' : 'success',
        data : null
    })
}