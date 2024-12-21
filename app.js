
require('dotenv').config();
const express = require('express');
const expresslayout = require('express-ejs-layouts');
const app = express();
const connectdb = require('./server/config/db.js');
const mongostore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const methodoverride = require('method-override'); // it helps you use put , delete you cant use them without this
const session = require('express-session');
// port declaration
const port = process.env.port || 5000;

//database connection function
connectdb();
// using middleware so that we can pass data to database;
app.use(express.urlencoded({extended:true}));
app.use(express.json());
// public folder for css,img,js
app.use(express.static('public'));
//cookies-parser
app.use(cookieParser());
// templating engine
app.use(expresslayout);
// method override
app.use(methodoverride('_method'));
// sessions

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: mongostore.create({
        mongoUrl: process.env.mongodb_con
    }),
}))

//layout declaration
app.set('layout', './layouts/main');

app.set('view engine', 'ejs');

app.use('/', require('./server/main.js'));
app.use('/', require('./server/admin.js'));

app.listen(port, () =>{
    console.log(`app listening on port http://localhost:${port}`);
})