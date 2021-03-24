const express = require('express')
const app = express()
var session = require('express-session')
const mustacheExpress = require('mustache-express')
const models = require('./models')
const { Op } = require('sequelize')

//initialize session
app.use(session({
  secret: 'thanksforthebubblejug',
  resave: false,
  saveUninitialized: true
}))

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.static('public'))

app.use(express.urlencoded())

// get all movies
app.get('/movies', (req,res) => {
  models.Movie.findAll({})
  .then(movies => {
    res.render('movies', { movies: movies })
  })
})


app.get('/add-movie', (req,res) => {
  res.render('add-movie')
})


// adding movie to Movies table
app.post('/add-movie', (req,res) => {
  const title = req.body.title
  const director = req.body.director
  const rating = parseFloat(req.body.rating)
  const poster_url = req.body.poster_url
  const isPublished = req.body.isPublished


  let movie = models.Movie.build({
    title: title,
    director: director,
    rating: rating,
    poster_url: poster_url,
    isPublished: isPublished
  })
  movie.save().then((savedMovie) => { // saves to the Movies table
    console.log(savedMovie)
    res.json({message: 'Movie is saved.'})

  })

})

//Delete a movie
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

// filtering Top rated movies 9 or greater
app.get('/top-movies', (req,res) => {
  models.Movie.findAll({
    where: {
      rating: {
        [Op.gt]: 8    // operator, greater-than 8 (9 or above)
      }
    }
  }).then(movies => {
    res.render('top-movies', {movies: movies})
  })
})

// update page render
app.get('/update-movie/:movieId', (req,res) => {
  const movieId = req.params.movieId

  models.Movie.findByPk(movieId).then(movie => {
    res.render('update-movie', {movie: movie})
  })
  
})

// update ane existing movie
app.post('/update-movie/:movieId', (req,res) => {

  const movieId = req.params.movieId
  const title = req.body.title
  const rating = req.body.rating
  const director = req.body.director
  const poster_url = req.body.poster_url
  const isPublished = req.body.isPublished
  console.error(movieId)
  models.Movie.update({
    title: title,
    director: director,
    rating: rating,
    poster_url: poster_url,
    isPublished: isPublished
  }, {
    where: {
      id: movieId
    }
  }).then(updatedMovie => {
      res.redirect('/movies')
  })
})




app.listen(3000, () => {
  console.log('Server is running...')
})