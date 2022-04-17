const express = require('express');
const College = require('../model/College');
const Sequelize = require('sequelize');

const router = express.Router();

router.get('/', async (req, res) => {
   const { username, isLoggedIn } = req.session;
   const collegeList = await College.findAll();
   const colleges = collegeList.sort((a, b) => a.viewsCount - b.viewsCount).slice(0, 3);

   res.render('index', {
      username,
      isLoggedIn,
      colleges: colleges.map(({ id, name, category, description, thumbnail }) => ({
         name,
         category,
         description,
         link: `/college/${id}`,
         img: `/assets/${thumbnail}`,
      })),
   });
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
   const { username, isLoggedIn } = req.session;
   const { search, option } = req.body;
   const Op = Sequelize.Op;

   let collegeList = [];
   if (option === 'location') {
      collegeList = await College.findAll({ where: { location: { [Op.like]: `%${search}%` } } });
   } else {
      collegeList = await College.findAll({ where: { name: { [Op.like]: `%${search}%` } } });
   }

   res.render('college', {
      username,
      isLoggedIn,
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
   const { username, isLoggedIn } = req.session;
   const { category } = req.params;
   const Op = Sequelize.Op;
   const collegeList = await College.findAll({ where: { category: { [Op.like]: `%${category}%` } } });

   res.render('college', {
      username,
      isLoggedIn,
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
   const { username, isLoggedIn } = req.session;
   const { college_id } = req.params;

   const college = await College.findByPk(college_id);
   await College.update({ viewsCount: college.viewsCount + 1 }, { where: { id: college_id } });

   const { id, name, category, description, courses } = college;
   res.render('college_single', { username, isLoggedIn, id, name, category, description, courses });
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
