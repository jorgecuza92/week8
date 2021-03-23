const express = require('express')
const app = express()
var session = require('express-session')

// importing bcryptjs 
var bcrypt = require('bcryptjs');

// initializing pg promise 
const pgp = require('pg-promise')()

// initialize a session 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))

// connection string 
const connectionString = 'postgres://localhost:5432/booksdb'
// use connection string to create the pg-promise object 
// this db object contains a lot of functions to work with the poastgres database 
const db = pgp(connectionString)

const mustacheExpress = require('mustache-express')
// setting up Express to use Mustache Express as template pages 
app.engine('mustache', mustacheExpress())
// the pages are located in views directory
app.set('views', './views')
// extension will be .mustache
app.set('view engine', 'mustache')

app.use(express.urlencoded())

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/dashboard', (req, res) => {

    db.any('SELECT users.user_id, username, name, isbn, author FROM users JOIN books ON users.user_id = books.user_id').then(result => {
        console.log(result)
    })


    const user = {user_id: 3, username: 'JohnDoe', books: [
        {name: 'Atomic Habits', isbn: '22222'},
        {name: 'Intro JS', isbn: '2222'}
    ]}

    console.log(user)
    res.send("OK")

})


app.get('/my-books', (req, res) => {

    const userId = req.session.userId 

    db.any('SELECT book_id, name, isbn, author FROM books where user_id = $1',[userId])
    .then((books) => {
        res.json(books)
    })

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
                    })
            }
        })
    })
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    db.one('SELECT user_id, username, password FROM users WHERE username = $1', [username])
        .then((user) => {
            // now compare the password 
            // password is the password user entered through the ui 
            // user.password is the one stored in db in hashed format 
            bcrypt.compare(password, user.password, function (error, result) {
                if (result) {
                    // create a session 
                    // and store user_id in the session 
                    if(req.session) {
                        req.session.userId = user.user_id 
                        req.session.username = user.username 
                        
                        // you can also assign an object to your custom property 
                        //req.session.user = {username: user.username, userId: user.user_id}

                        res.redirect('/my-books')
                    }
                    
                } else {
                    res.send('Invalid password')
                }
            })

        }).catch((error) => {
            console.log(error)
            res.send('User not found!')
        })

})

app.listen(3000, () => {
    console.log('Server is running...')
})


/*

function formatUsersAndAddressesForDisplay(list) {

    let users = [] 

    list.forEach((item) => {
        if(users.length == 0) {
            let user = {userId: item.user_id,firstName: item.first_name,
                 lastName: item.last_name,addresses: [{city: item.city, street: item.street}]}
            users.push(user)
        } else {
            let user = users.find(user => user.userId == item.user_id)
            if(user) {
                user.addresses.push({city: item.city, street: item.street})
            } else {
                let user = {userId: item.user_id,firstName: item.first_name,
                    lastName: item.last_name,addresses: [{city: item.city, street: item.street}]}
               users.push(user)
            }
        }
    })

    return users 

}

*/