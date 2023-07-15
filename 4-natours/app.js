const fs = require('fs')
const express = require('express')
const app = express()
const morgan = require('morgan')



PORT = 3001

// 1) MIDDLEWARES
app.use(morgan('dev'))
// middleware to use body data as js object
app.use(express.json())

app.use((req, res, next) => {
    console.log('Hello from middleware');
    next();
})

app.use((req, res, next) => {
    req.requesTime = new Date().toISOString();
    next();
})

// const getAllTours = require('./controllers/getAllTours')

let tours = JSON.parse(fs.readFileSync(`${__dirname}/starter/dev-data/data/tours-simple.json`));
let users = JSON.parse(fs.readFileSync(`${__dirname}/starter/dev-data/data/users.json`))

// 2) ROUTE HANDLERS
const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requesTime,
        results: tours.length,
        data: { tours: tours }
    })
}

const getTourById = (req, res) => {
    const { id } = req.params;
    const tour = tours.find(t => t.id === Number(id))

    try {
        if (!tour) {
            throw Error(`Tour with id: ${id} not found`)
        }
        res.status(200).json({
            status: 'success',
            data: { tour: tour }
        })
    } catch (error) {
        res.status(404).json({ status: 'fail', error: error.message })
    }
}

const createTour = (req, res) => {
    // console.log(req.body)
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body)

    tours.push(newTour);

    fs.writeFile(`${__dirname}/starter/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        // 201 means created
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
}

const updateTour = (req, res) => {
    const { id } = req.params
    const { name, duration } = req.body;
    let tour = tours.find(t => t.id === Number(id))

    try {
        if (!tour) {
            throw Error(`Tour with id: ${id} not found`)
        }
        tour.name = name;
        tour.duration = duration;

        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        })

    } catch (error) {
        res.status(404).json({ status: 'fail', error: error.message })

    }
}

const deleteTour = (req, res) => {
    const { id } = req.params;
    try {

        if (Number(id) > tours.length) {
            throw Error(`Tour with id: ${id} not found`)
        }
        tours = tours.filter(t => t.id !== Number(id))

        res.status(204).json({
            status: 'success',
            data: null
        })

    } catch (error) {
        res.status(404).json({ status: 'fail', error: error.message })
    }
}

// ? USERS Handlers / Controllers

const getAllUsers = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requesTime,
        results: users.length,
        data: { users: users }
    })
}

const getUserById = (req, res) => {
    const { _id } = req.params;
    const user = users.find(t => t.id === _id)

    try {
        if (!user) {
            throw Error(`User with id: ${id} not found`)
        }
        res.status(200).json({
            status: 'success',
            data: { user }
        })
    } catch (error) {
        res.status(404).json({ status: 'fail', error: error.message })
    }
}

const createUser = (req, res) => {
    const newId = users[users.length - 1].id + 1;
    const newUser = Object.assign({ _id: newId }, req.body)

    users.push(newUser);

    fs.writeFile(`${__dirname}/starter/dev-data/data/users.json`, JSON.stringify(users), err => {
        // 201 means created
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    })
}

const updateUser = (req, res) => {
    const { _id } = req.params
    const { email, role } = req.body;
    let user = users.find(t => t._id === _id)

    try {
        if (!user) {
            throw Error(`User with id: ${id} not found`)
        }
        user.email = email;
        user.role = role;

        res.status(200).json({
            status: 'success',
            data: {
                user: user
            }
        })

    } catch (error) {
        res.status(404).json({ status: 'fail', error: error.message })
    }
}

const deleteUser = (req, res) => {
    const { _id } = req.params;
    try {

        // if (Number(id) > tours.length) {
        //     throw Error(`Tour with id: ${id} not found`)
        // }
        users = users.filter(t => t._id !== _id)

        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (error) {
        res.status(404).json({ status: 'fail', error: error.message })
    }
}

// app.get('/api/v1/tours', getAllTours)

// // we could implement more params ex: /:x/:y?
// // ? indicates that the route param is optional
// app.get('/api/v1/tours/:id', getTourById)

// app.post('/api/v1/tours', createTour)

// // put whe expect that the app receives the entire new updated obj
// // patch we only expect properties that need to be changes on the obj
// app.patch('/api/v1/tours/:id', updateTour)

// app.delete('/api/v1/tours/:id', deleteTour)

// another route alternative

// 3) ROUTES
const tourRouter = express.Router()
const userRouter = express.Router()


tourRouter
    .route('/')
    .get(getAllTours)
    .post(createTour)

tourRouter
    .route('/:id')
    .get(getTourById)
    .patch(updateTour)
    .delete(deleteTour)

// USER Routes
userRouter
    .route('/')
    .get(getAllUsers)
    .post(createUser)

userRouter
    .route('/:id')
    .get(getUserById)
    .patch(updateUser)
    .delete(deleteUser)

// mounting the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) START SERVER
app.listen(PORT, () => {
    console.log(`Server Listening on port: ${PORT}`)
})
