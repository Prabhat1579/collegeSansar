const chalk = require('chalk');
const path = require('path');
const express = require('express');
const College = require('../model/College');
const Sequelize = require('sequelize');
const Review = require('../model/Review');
const Apply = require('../model/Apply');
const User = require('../model/User');

const router = express.Router();

router.get('/', async (req, res) => {
   const { username, isLoggedIn } = req.session;
   const collegeList = await College.findAll();
   const colleges = collegeList.sort((a, b) => a.viewsCount - b.viewsCount).slice(0, 3);

   let reviews = await Review.findAll();
   reviews = await Promise.all(
      reviews.map(async (review) => {
         review.user = await User.findOne({ where: { id: review.user_id } });
         review.college = await College.findOne({ where: { id: review.college_id } });
         return review;
      })
   );

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

      reviews: reviews.map(({ user, college, title, description, rate }) => ({
         username: user.name,
         college: college.name,
         title,
         description,
         rate,
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

//* THIS IS ADDITIONAL BASED ON STUPID REQUIREMENT : SAME AS BELOW ROUTE
router.post('/search-college-location', async (req, res) => {
   const { username, isLoggedIn } = req.session;
   const { search } = req.body;
   const Op = Sequelize.Op;

   const collegeList = await College.findAll({ where: { location: { [Op.like]: `%${search}%` } } });

   res.render('college', {
      username,
      isLoggedIn,
      title: `Search Results for " ${search || ''} "`,
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
      title: `Search Results for " ${search || ''} "`,
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
   const { collegeApplied, reviewAdded } = req.query;

   const college = await College.findByPk(college_id);
   await College.update({ viewsCount: college.viewsCount + 1 }, { where: { id: college_id } });

   let reviews = await Review.findAll({ where: { college_id } });
   reviews = await Promise.all(
      reviews.map(async (review) => {
         review.user = await User.findOne({ where: { id: review.user_id } });
         return review;
      })
   );

   const { id, name, category, description, courses, eligibility, fee } = college;
   res.render('college_single', {
      username,
      isLoggedIn,
      id,
      name,
      category,
      description,
      courses,
      eligibility,
      fee,

      createReviewLink: `/review/create/${college_id}`,
      applyLink: `/college/apply/${college_id}`,

      reviews: reviews.map(({ user, title, description, rate }) => ({
         username: user.name,
         title,
         description,
         rate,
      })),

      collegeApplied,
      reviewAdded,
   });
});

router.post('/review/create/:college_id', async (req, res) => {
   const { userId } = req.session;
   const { college_id } = req.params;
   const { title, description, rating } = req.body;

   const review = Review.build({ user_id: userId, college_id, title, description, rate: rating });
   await review.save();

   res.redirect(`/college/${college_id}?reviewAdded=true`);
});

router.post('/college/apply/:college_id', async (req, res) => {
   const { userId } = req.session;
   const { college_id } = req.params;

   const {
      fullName,
      email,
      phone,
      fatherName,
      motherName,
      dob,
      parentContact,
      citizenId,
      citizenship,
      photo,
      slcGrade,
      plus2Grade,
      slcMarksheet,
      plus2Marksheet,
   } = req.body;

   Object.keys(req.files).map(async (key) => {
      const fileUploadPath = path.join(__dirname, '..', 'uploads', req.files[key].name);
      const file = req.files[key];
      await file.mv(fileUploadPath);
   });

   const apply = Apply.build({
      user_id: userId,
      college_id,
      fullName,
      email,
      phone,
      fatherName,
      motherName,
      dob,
      parentContact,
      citizenId,
      citizenship: path.join(__dirname, '..', 'uploads', req.files.citizenship.name),
      photo: path.join(__dirname, '..', 'uploads', req.files.photo.name),
      slcGrade,
      plus2Grade,
      slcMarksheet: path.join(__dirname, '..', 'uploads', req.files.slcMarksheet.name),
      plus2Marksheet: path.join(__dirname, '..', 'uploads', req.files.plus2Marksheet.name),
   });
   await apply.save();

   res.redirect(`/college/${college_id}?collegeApplied=true`);
});

router.get('/exam', (req, res) => {
   res.render('exam');
});

router.get('/career', (req, res) => {
   res.render('career');
});

router.get('/register', (req, res) => {
   const { registerFailed, failMessage } = req.query;
   res.render('register', { registerFailed, failMessage });
});

router.get('/login', (req, res) => {
   const { loginFailed, failMessage } = req.query;
   res.render('login', { loginFailed, failMessage });
});

module.exports = router;
