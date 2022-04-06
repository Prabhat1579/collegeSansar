const express=require("express");
const bodyParser=require("body-parser");
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public/'));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
})
app.get("/college",function(req,res){
  res.sendFile(__dirname+"/college.html");
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
  res.sendFile(__dirname+"/Login.html");
})

app.listen(3000,function(){
  console.log("server running in port 3000");
})
