const express = require('express');
const morgan = require('morgan');
const fs = require('fs');

const app = express();
const PORT = 3000;

//#region 3. MiddleWare
app.use(express.json()); // middleware for Post request

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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//#region 1. API callback functions
const getAllTours = (req,res) => {
    console.log('getAllTours');
    res.status(200).json({
        'status' : 'success',
        requestTime : req.requestTime,
        result : tours.length,
        data : { tours }
    })
}

const createTour = (req,res) => {

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

const getTourById = (req,res) => {
    console.log(req.params);
    const id = req.params.id * 1;
    const tour = tours.find( el => el.id === id);

    if(id > tours.length || !tour){
        return res.status(404).json({
            'status' : 'fail',
            message : 'invalid Id'
        })
    }

    console.log(tour);
    res.status(200).json({
        'status' : 'success',
        data : { tour }
    })
}

const updateTour = (req,res) => {
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

const deleteTour = (req,res) => {
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
//#endregion

//#region 2. Endpoints code refactor

    // app.get('/api/v1/tours', getAllTours)
    // app.post('/api/v1/tours', createTour)
    // app.get('/api/v1/tours/:id', getTourById)
    // app.patch('/api/v1/tours/:id', updateTour)
    // app.delete('/api/v1/tours/:id', deleteTour)

    app.route('/api/v1/tours').get(getAllTours).post(createTour);
    app.route('/api/v1/tours/:id').get(getTourById).patch(updateTour).delete(deleteTour);

//#endregion

//#region 4. User Resource

    const getAllUsers = (req, res) => {
        res.status(500).json({
            status : 'Error',
            message : 'This route is not yet defined'
        })
    }
    const createUser = (req, res) => {
        res.status(500).json({
            status : 'Error',
            message : 'This route is not yet defined'
        })
    }
    const getUser = (req, res) => {
        res.status(500).json({
            status : 'Error',
            message : 'This route is not yet defined'
        })
    }
    const updateUser = (req, res) => {
        res.status(500).json({
            status : 'Error',
            message : 'This route is not yet defined'
        })
    }
    const deleteUser = (req, res) => {
        res.status(500).json({
            status : 'Error',
            message : 'This route is not yet defined'
        })
    }

    app.route('/api/v1/users').get(getAllUsers).post(createUser);
    app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

//#endregion

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`)
})