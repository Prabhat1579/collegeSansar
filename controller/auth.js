const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { append } = require('express/lib/response');
const Connection = require('mysql/lib/Connection');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});

exports.Register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT Email from userlogin WHERE Email = ?', [email], async (error, results) =>{
        if(error){
            console.log(error);
        } 
        
        if(results.length > 0 ){
            return res.render('Register', {
                message: 'That email already exist'
            }) 
            } else if( password !== passwordConfirm){
                return res.render('Register', {
                    message: 'Passwords do not match'
                });
        }
        
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
    });
    
    db.query('INSERT INTO userlogin SET ?', {name: name, email: email, password: password }, (error, results) =>
    {
        if(error){
        console.log(error);
    } else {
        return res.render('Register', {
            message: 'user Registered Successfully!'
        });
    }

});
};



// login code
exports.login = (req, res) => {
    console.log(req.body);

    const {email, password} = req.body;

    db.query('Select * from userlogin where email = ? and password = ?',[email, password], (error, results, fields) => {

        if(error) throw error

        if(results.length <= 0){
            return res.render('login', {
                message: 'Please enter correct email or password!'
            });
        } else {
            res.render('Index');
        }

        
    })

};



