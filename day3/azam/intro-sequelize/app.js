const express = require('express')
const app = express()
var session = require('express-session')
const models = require('./models')
const { Op } = require('sequelize')

// importing bcryptjs 
var bcrypt = require('bcryptjs');

// initialize a session 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))

// configure mustache 
const mustacheExpress = require('mustache-express')
// setting up Express to use Mustache Express as template pages 
app.engine('mustache', mustacheExpress())
// the pages are located in views directory
app.set('views', './views')
// extension will be .mustache
app.set('view engine', 'mustache')

app.use(express.urlencoded())

app.get('/movies', (req, res) => {
    models.Movie.findAll({})
    .then(movies => {
        //res.json(movies)
        res.render('movies', {movies: movies})
    })
})

// return all movies where rating > 4
app.get('/top-movies', (req, res) => {
    models.Movie.findAll({
        where: {
            rating: {
                [Op.gt]: 4
            }
        }
    }).then(movies => {
        res.json(movies)
    })
})

// delete a movie 
app.post('/delete-movie', (req, res) => {

    const movieId = req.body.movieId 

    models.Movie.destroy({
        where: {
            id: movieId 
        }
    }).then(deletedMovie => {
        res.redirect('/movies')
    })
})

// update a movie 
app.post('/update-movie', (req, res) => {

    const movieId = req.body.movieId 
    const title = req.body.title 
    const rating = req.body.rating 
    const director = req.body.director 

    models.Movie.update({
        name: title, 
        director: director, 
        rating: rating 
    }, {
        where: {
            id: movieId 
        }
    }).then(updatedMovie => {
        res.redirect('/movies')
    })

})


// get movie by id 
app.get('/movies/:movieId', (req, res) => {

    const movieId = req.params.movieId 

    models.Movie.findByPk(movieId)
    .then((movie) => {
        //res.json(movie)
        res.render('movie-detail', {movie: movie})
    })

})


app.post('/add-movie', (req, res) => {

    const title = req.body.title 
    const rating = parseInt(req.body.rating) 
    const director = req.body.director 

    // creating the object for Movie which can then be saved to the database 
    let movie = models.Movie.build({
        name: title, 
        rating: rating, 
        director: director 
    })

    movie.save().then((savedMovie) => {
        console.log(savedMovie)
        res.json({message: 'Movie is saved!'})
    })

})

app.listen(3000, () => {
    console.log('Server is running...')
})

