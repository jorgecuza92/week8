const express = require('express')
const app = express()
var bcrypt = require('bcryptjs')
var session = require('express-session')

// initializing pg promise 
const pgp = require('pg-promise')()

// connection string 
const connectionString = 'postgres://localhost:5432/booksdb'
// use connection string to create the pg-promise object 
// this db object contains a lot of functions to work with the postgres database 
const db = pgp(connectionString)


const mustacheExpress = require('mustache-express')
// setting up Express to use Mustache Express as template pages 
app.engine('mustache', mustacheExpress())
// the pages are located in views directory
app.set('views', './views')
// extension will be .mustachenp
app.set('view engine', 'mustache')

app.use(express.urlencoded())
// initialize a session 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.get('/login', (req,res) => {
  res.render('login')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.get('/dashboard', (req,res) => {

  db.any('SELECT users.user_id, username, name, isbn, author FROM users JOIN books ON users.user_id = books.user_id')
  .then(result => {
    console.log(result)
  })

  const user = {user_id: 3, username: 'jacuza20', books: [
      {name: 'Atomic Habits', isbn: '222222'},
      {name: 'Intro JS', isbn: '222223'},

  ]}
  console.log(user)
  res.send('OK')
})


app.get('/my-books', (req,res) => {

  const userId = req.session.userId
  db.any('SELECT book_id, name, isbn, author, FROM books where user_id = $1',[userId])
  .then((books) => {
    res.json(books)
  })
 
})




app.post('/register', (req, res) => {

  const username = req.body.username
  const password = req.body.password

  bcrypt.genSalt(10, function (error, salt) {
    bcrypt.hash(password, salt, function (error, hash) {
      if (!error) {
        db.none('INSERT INTO users(username, password) VALUES($1, $2)', [username, hash])
          .then(() => {
            res.send('User Registered')
          })
      }
    })
  })

})


app.post('/login', (req, res) => {

  const username = req.body.username
  const password = req.body.password

  db.one('SELECT user_id, username, password FROM users WHERE username = $1', [username])
    .then((user) => {
      // now compare the passwords
      bcrypt.compare(password, user.password, function (error, result) {
        if (result) {

          if (req.session) {
            req.session.userId = user.user_id
            req.session.username = user.username


            res.redirect('/my-books')
          }

          res.send('user is autheticated')
        } else {
          res.send('invalid password')
        }
      })

    }).catch((error) => {
      console.log(error)
      res.send('user is not found!')
    })
})

app.listen(3000, () => {
  console.log('Server is running...')
})