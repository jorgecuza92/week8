const express = require('express')
const app = express()

// initializing pg promise 
const pgp = require('pg-promise')() 

// connection string 
const connectionString = 'postgres://localhost:5432/booksdb'
// use connection string to create the pg-promise object 
// this db object contains a lot of functions to work with the postgres database 
const db = pgp(connectionString)
//console.log(db)

const mustacheExpress = require('mustache-express')
// setting up Express to use Mustache Express as template pages 
app.engine('mustache', mustacheExpress())
    // the pages are located in views directory
app.set('views', './views')
    // extension will be .mustache
app.set('view engine', 'mustache')

app.use(express.urlencoded())

// any returns an array 
// get all books 
/*
db.any('SELECT book_id, name, isbn, author, is_published, rating FROM books')
.then((books) => {
    console.log(books)
}) */

// get all books 
app.get('/', (req, res) => {
    db.any('SELECT book_id, name, isbn, author, is_published, rating FROM books')
    .then(books => {
        res.render('index',{books: books})
    })
})

app.get('/add-book', (req, res) => {
    res.render('add-book')
})

app.post('/add-book', (req, res) => {

    console.log(req.body)

    const name = req.body.name 
    const isbn = req.body.isbn 
    const author = req.body.author 
    const isPublished = req.body.isPublished == "on" ? true : false 
    const rating = parseInt(req.body.rating) 

    db.none('INSERT INTO books(name, isbn, author, is_published, rating) VALUES($1, $2, $3,$4, $5)',[name, isbn, author, isPublished, rating])
    .then(() => {
        res.redirect('/')
    }) 
})


// get all books where rating is greater than 3 

app.get('/books/rating/:rating', (req, res) => {
    
    const rating = parseInt(req.params.rating) 

    db.any('SELECT book_id, name, isbn, author, is_published, rating FROM books WHERE rating >= $1',[rating]).then((books) => {
        //res.render('index', {books: books})
        res.json(books)
    })
})

app.post('/delete-book',(req,res) => {

    const bookId = req.body.bookId 

    db.none('DELETE FROM books WHERE book_id = $1;',[bookId])
        .then(() => {
            res.redirect('/')
        })
})



app.listen(3000,() => {
    console.log('Server is running...')
})