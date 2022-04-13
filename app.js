const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const nodemon = require("nodemon");
const mysql = require("mysql");
const session = require("express-session");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("flash");
const expressValidator = require("express-validator");
const logger = require("morgan");



const app=express();

app.set("view engine", "hbs")

dotenv.config({
  path: './.env'
})

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE

});

db.connect( (error) => {
  if(error) {
      console.log(error);
  } else {
      console.log("mySql Connected...");
  }
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public/'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({ 
  secret: '123456cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.use(flash());
app.use(expressValidator());

// defining routes

app.use('/',require('./routes/page'));

app.use('/auth', require('./routes/auth'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
 
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
 
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(5000, () => {
  console.log("server running in port 5000");
})
