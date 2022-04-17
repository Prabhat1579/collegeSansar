const express = require('express');
const College = require('../model/College');
const Sequelize = require('sequelize');

const router = express.Router();

router.get('/', (req, res) => {
   const { userId, username, isLoggedIn } = req.session;
   console.log(username, userId);
   res.render('index', { username, isLoggedIn });
});

router.get('/college', async (req, res) => {
   const collegeList = await College.findAll();

   res.render('college', {
      title: 'Colleges',
      colleges: collegeList.map(({ id, name, category, description, thumbnail }) => ({
         name,
         category,
         description,
         link: `/college/${id}`,
         img: `/assets/${thumbnail}`,
      })),
   });
});

router.post('/search-college', async (req, res) => {
   const { search } = req.body;
   const Op = Sequelize.Op;
   const collegeList = await College.findAll({ where: { name: { [Op.like]: `%${search}%` } } });

   res.render('college', {
      title: `Search Results for " ${search} "`,
      noResults: collegeList.map((i) => i.id).length < 1,
      colleges: collegeList.map(({ id, name, category, description, thumbnail }) => ({
         name,
         category,
         description,
         link: `/college/${id}`,
         img: `/assets/${thumbnail}`,
      })),
   });
});

router.get('/search-college/:category', async (req, res) => {
   const { category } = req.params;
   const Op = Sequelize.Op;
   const collegeList = await College.findAll({ where: { category: { [Op.like]: `%${category}%` } } });

   res.render('college', {
      title: `Colleges for " ${category} "`,
      noResults: collegeList.map((i) => i.id).length < 1,
      colleges: collegeList.map(({ id, name, category, description, thumbnail }) => ({
         name,
         category,
         description,
         link: `/college/${id}`,
         img: `/assets/${thumbnail}`,
      })),
   });
});

router.get('/college/:college_id', async (req, res) => {
   const { college_id } = req.params;

   const college = await College.findByPk(college_id);

   console.log(req.session);

   const { id, name, category, description, courses } = college;
   res.render('college_single', { id, name, category, description, courses, isLoggedIn: req.session.isLoggedIn });
});
router.post('/college/submit_review', async (req, res) => {
   const { title, description } = req.body;
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
