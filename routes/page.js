const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
})

router.get("/register", (req, res) => {
    res.render('register');
})

router.get("/login", (req, res) => {
    res.render('login');
})

router.get("/college", (req, res) => {
    res.render('college');
})

router.get("/exam", (req, res) => {
    res.render('exam');
})

router.get("/career", (req, res) => {
    res.render('career');
})


module.exports = router;
