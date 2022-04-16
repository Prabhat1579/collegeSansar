const express = require('express');
const College = require('../model/College');

const router = express.Router();

router.get('/', (req, res) => {
   const { userId, username, isLoggedIn } = req.session;
   console.log(username, userId);
   res.render('index', { username, isLoggedIn });
});

router.get('/college', async (req, res) => {
   const collegeList = await College.findAll();

   res.render('college', {
      colleges: collegeList.map(({ name, fee, description, thumbnail }) => ({
         name,
         fee,
         description,
         img: `assets/${thumbnail}`,
      })),
   });
});

router.get('/exam', (req, res) => {
   res.render('exam');
});

router.get('/career', (req, res) => {
   res.render('career');
});

router.get('/register', (req, res) => {
   res.render('register');
});

router.get('/login', (req, res) => {
   res.render('Login');
});

module.exports = router;
