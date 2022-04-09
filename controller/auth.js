const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const { append } = require('express/lib/response');
// const Connection = require('mysql/lib/Connection');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE

});


exports.Register = (req, res) => {
    // console.log(req.body);



    const { name, email, password, confirmPassword } = req.body;

    db.query('SELECT Email from userlogin WHERE Email = ?', [email], async (error, results) =>{
        if(error){
            console.log(error);
        }

        if(results.length > 0 ){
          return res.render('register', {message: 'user already registered'})
        }
        else if( password !== confirmPassword){
          console.log(password,confirmPassword);
                return res.render('register', {message: 'Passwords do not match'});
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        // console.log(hashedPassword);

        db.query('INSERT INTO userlogin SET ?', {name: name, email: email, password: hashedPassword }, (error, results) =>
        {
            if(error){
            console.log(error);
          }
          else {
            return res.render('register', {message: 'user registered successfully'});
          }
    });
  });
};



// login code
// exports.login = (req, res) => {
//     console.log(req.body);
//
//     db.query('Select * from userlogin where email = ? and password = ?',(error, results, fields) => {
//         if(results.length > 0 ){
//             res.render("/Index")
//         } else {
//
//         }
//     })
//
// };
