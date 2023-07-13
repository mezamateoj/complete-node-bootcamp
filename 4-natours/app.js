const fs = require('fs')
const express = require('express')
const app = express()
PORT = 3001

// middleware to use body data as js object
app.use(express.json())

const tours = JSON.parse(fs.readFileSync(`${__dirname}/starter/dev-data/data/tours-simple.json`));



// app.get('/', (req, res) => {
//     res.status(200).json({ message: 'hello from server' })
// })

// app.post('/', (req, res) => {
//     res.send('Post request')
// })

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours: tours }
    })

})


app.post('/api/v1/tours', (req, res) => {
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
})


app.listen(PORT, () => {
    console.log(`Server Listening on port: ${PORT}`)
})
