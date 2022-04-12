const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const nodemon = require("nodemon");
const mysql = require("mysql");

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

// defining routes

app.use('/',require('./routes/page'));

app.use('/auth', require('./routes/auth'));

app.listen(5000, () => {
  console.log("server running in port 5000");
})
