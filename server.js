// Packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const ejs = require('ejs');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
require('dotenv').config()

// Import routes 
const loginRoute = require('./routes/authRoute'); 

// Import Passport Config
require("./config/passport")(passport)

// Server Config
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.static('views'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({origin: '*'}))

// Express Session Middleware
app.use(session({
    secret: 'keyboard',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash())

// Global variables
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
  next();
})

// Db Config
const URI = 'mongodb+srv://zaki:zaki@cluster0.dk3io.mongodb.net/Cluster0?retryWrites=true&w=majority';
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true },  () => {console.log('Connected to Db')})

// View Engine
app.set('views', 'ejs');

// Routes Middleware
app.use('/', loginRoute)
app.use('/register', loginRoute)

// App listener
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${port}`)
})