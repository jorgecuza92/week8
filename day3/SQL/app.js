const express = require('express')
const app = express()
var session = require('express-session')
const models = require('./models')
const { Op } = require('sequelize')

// importing bcryptjs
var bcrypt = require('bcryptjs');

// initializing pg promsise
const pgp = require('pg-promise')()


// initialize a session
app.use(session({
  secret: 'getsmart',
  resave: false,
  saveUninitialized: true
}))

// connection string
const connectionString = 'postgres://localhost:5432/moviesdb'

const db = pgp(connectionString)

const mustacheExpress = require('mustache-express')

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.static('public'))

app.use(express.urlencoded())


app.get('/movies', (req,res) => {
  models.Movie.findAll({})
  .then(movies => {
    res.render(movies)
    // res.json(movies)
  })
})

// return all movies with rating greater than 4
app.get('/top-movies', (req,res) => {
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
app.post('/delete-movie', (req,res) => {

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
app.post('/update-movie', (req,res) => {

  const movieId = req.body.movieId
  const title = req.body.title
  const rating = req.body.rating
  const director = req.body.director

  let movie = models.Movie.build({
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

// get movie by movieId localhost:3000/movies/2
app.get('/movies/:movieId', (req,res) => {

  const movieId= req.params.movieId
  
  models.Movie.findByPk(movieId)
  .then((movie) => {
    // res.json(movie)
    res.render('movie-detail', {movie: movie})
  })

})


app.post('/add-movie', (req, res) => {

  const title = req.body.title
  const rating = parseInt(req.body.rating)
  const director = req.body.director

  let movie = models.Movie.build({
    name: title,
    rating: rating,
    director: director
  
  
  })
  // save the movie to the Movies table
  movie.save().then((savedMovie) =>{
    console.log(savedMovie)
    res.json({message: 'Movie is saved!'})
  }) 

})

app.listen(3000, () => {
  console.log('Server is running..')
})