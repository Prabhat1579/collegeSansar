const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('Index');
})

router.get("/Register", (req, res) => {
    res.render('Register');
})

router.get("/login", (req, res) => {
    res.render('Login');
})

router.get("/college", (req, res) => {
    res.render('college');
})

router.get("/Exam", (req, res) => {
    res.render('Exam');
})

router.get("/Career", (req, res) => {
    res.render('Career');
})
router.get('/', (req, res) => {
    res.render('Index');
})

router.get("/Register", (req, res) => {
    res.render('Register');
})

router.get("/login", (req, res) => {
    res.render('Login');
})

router.get("/college", (req, res) => {
    res.render('college');
})

router.get("/Exam", (req, res) => {
    res.render('Exam');
})

router.get("/Career", (req, res) => {
    res.render('Career');
})


module.exports = router;