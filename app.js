const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const nodemon = require("nodemon");
const mysql = require("mysql");

const app=express();

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


app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
})
app.get("/college",function(req,res){
  res.sendFile(__dirname+"/college.html");
})

app.get("/Index",function(req,res){
  res.sendFile(__dirname+"/Index.html");
})

app.get("/career",function(req,res){
  res.sendFile(__dirname+"/career.html");
})
app.get("/Exam",function(req,res){
  res.sendFile(__dirname+"/Exam.html");
})
app.get("/Login",function(req,res){
  res.sendFile(__dirname+"/Login.html");
})
app.get("/Register",function(req,res){
  res.sendFile(__dirname+"/Register.html");
})


app.listen(3000,function(){
  console.log("server running in port 3000");
})
