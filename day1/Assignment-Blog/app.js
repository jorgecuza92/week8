const express = require('express')
const app = express()

// initializing pg promsise
const pgp = require('pg-promise')()

// connection string
const connectionString = 'postgres://localhost:5432/blogsdb'

const db = pgp(connectionString)

const mustacheExpress = require('mustache-express')

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(express.urlencoded())


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
  // const dateCreated = req.body.dateCreated 
  // const dateUpdated = req.body.dateUpdated
  const isPublished = req.body.isPublished == 'on' ? true : false 

  db.none('INSERT INTO blogs2(title, body, is_published) VALUES($1, $2, $3)',
  [title, body, isPublished])
  .then(() => {
    res.redirect('/')
  })

})



app.listen(3000, () => {
  console.log('Server is running..')
})