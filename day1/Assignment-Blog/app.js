const express = require('express')
const app = express()
var session = require('express-session')

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
const connectionString = 'postgres://localhost:5432/blogsdb'

const db = pgp(connectionString)

const mustacheExpress = require('mustache-express')

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
app.use(express.static('public'))

app.use(express.urlencoded())


app.get('/my-posts', (req,res) => {
  const userId = req.session.userId

  db.any('SELECT post_id, title, body, blogs2.date_created, blogs2.date_updated, blogs2.is_published FROM blogs2 WHERE user_id = $1',
  [userId])
  .then((blogs2) => {
    res.json(blogs2)
    
    // res.render('my-posts')
  })
})


app.get('/login', (req,res) => {
  res.render('login')
})


app.post('/login', (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.one('SELECT user_id, username, password FROM users WHERE username = $1',[username])
    .then((user) => {
      bcrypt.compare(password, user.password, function(error, result) {
        if(result) {
          if(req.session) {
            req.session.userId = user.user_id
            req.session.username = user.username

            console.log(req.session.userId)

            res.redirect('/my-posts')
          }
        } else {
          res.send('invalid password')
        }
      })
      }).catch((error) => {
        res.send('User not found!')
      }) 


})




app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  bcrypt.genSalt(10, function (error, salt) {
    bcrypt.hash(password, salt, function (error, hash) {
      // if there is no error 
      if (!error) {
        db.none('INSERT INTO users(username, password) VALUES($1, $2)', [username, hash])
          .then(() => {
            res.send('User Registered')
          }).catch((error) => {
            res.send(error)
          }) 
      } else {
        console.log(error)
      }
    })
  })
})







app.get('/', (req,res) => {
  db.any('SELECT post_id, title, body, date_created, date_updated, is_published FROM blogs2')
  .then(blogs2 => {
    res.render('index', { blogs2: blogs2 })
  })
})

app.get('/create-post', (req,res) => {
  res.render('create-post')
})

app.post('/create-post', (req,res) => {
  
  const title = req.body.title
  const body = req.body.body 
  const isPublished = req.body.isPublished == 'on' ? true : false 
  const userId = req.session.userId
  db.none('INSERT INTO blogs2(title, body, is_published, user_id) VALUES($1, $2, $3, $4)',
  [title, body, isPublished, userId])
  .then(() => {
    res.redirect('/')
  })

})

app.post('/delete-post', (req,res) => {
  const post_id = req.body.post_id
  db.none('DELETE FROM blogs2 WHERE post_id = $1;', [post_id])
    .then(() => {
      res.redirect('/')
    })
})



app.listen(3000, () => {
  console.log('Server is running..')
})