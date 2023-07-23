const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json()); // middleware for Post request
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`)
})
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

//#region - 1. BASIC ROUTING
    // a) Send Text
    app.get('/', (req, res) => {
        res.status(200).send('Hello From Server Side');
    })

    // b) Send JSON Obj - automatically appends "Content-Type: application/json; charset=utf-8" to response header
    app.get('/', (req, res) => {
        res.status(200).json({'message':'Hello From Server Side', 'app': 'Natours'});
    })

    // c) if you dont have method defined then server will send back below template
    {/* <body>
        <pre>Cannot GET /</pre>
    </body> */}

    // d) post method...
    app.post('/', (req, res) => {
        res.status(200).json({'message':'You can use post method', 'app': 'Natours'});
    })
//#endregion

//#region - 2. HANDLING GET REQUEST

    app.get('/api/v1/tours', (req,res) => {
        res.status(200).json({
            'status' : 'success',
            result : tours.length,
            data : { tours }
        })
    })

//#endregion

//#region - 3. HANDLING POST REQUEST
    app.post('/api/v1/tours', (req,res) => {

        const newId =  tours[tours.length - 1].id + 1;
        const newTour = Object.assign({id: newId}, req.body);
        tours.push(newTour);

        fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
            res.status(201).json({
                'status' : 'success',
                data : { tour : newTour }
            })
        });
    })
//#endregion

//#region - 4. HANDLING URL PARAMS
    // /api/v1/tours/:id/:x/:y => send 3 params 
    // on console.log(req.params); => { id: '2', x: '3', y: '4' }
    //  optional params => /api/v1/tours/:id/:x/:y? => { id: '2', x: '3', y: undefined }

    
    app.get('/api/v1/tours/:id', (req,res) => {
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
    })

//#endregion

//#region - 5. PATCH - only update the property and not all object
    
    app.patch('/api/v1/tours/:id', (req,res) => {

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
    })

//#endregion

//#region - 6. DELETE 
    
    app.delete('/api/v1/tours/:id', (req,res) => {
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
    })

//#endregion

