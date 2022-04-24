const express = require('express');
const chalk = require('chalk');
const path = require('path');
const { createCollege, deleteCollege } = require('../controller/admin/college');
const College = require('../model/College');
const Exam = require('../model/Exam');
const router = express.Router();

// * GET ROUTES

router.get('/', (req, res) => {
   res.render('admin_index');
});

router.get('/college', async (req, res) => {
   const { collegeCreated } = req.query;

   const collegeList = await College.findAll();

   res.render('admin_college', {
      colleges: collegeList.map(({ name, fee, description, thumbnail, id }) => ({
         name,
         fee,
         description,
         thumbnail,
         formAction: `/admin/college/delete/${id}`,
      })),

      collegeCreated,
   });
});

router.get('/career', (req, res) => {
   res.render('admin_career');
});

router.get('/exam', (req, res) => {
   const { examAdded } = req.query;

   res.render('admin_exam', { examAdded });
});

router.get('/login', (req, res) => {
   res.render('admin_login');
});

router.get('/register', (req, res) => {
   res.render('admin_register');
});

router.get('/logout', (req, res) => {});

// * POST ROUTES

router.post('/login', (req, res) => {
   console.log(req.body);
});

router.post('/register', (req, res) => {});

router.post('/college', createCollege);
router.post('/college/delete/:college_id', deleteCollege);

router.post('/exam/add', async (req, res) => {
   const { userId } = req.session;

   const {
      examTitle,
      examType,
      contact,
      admitCardReleaseDate,
      eligibility,
      syllabus,
      practicePaper,
      featuredImage,
      examDate,
      result,
      overview,
   } = req.body;

   Object.keys(req.files).map(async (key) => {
      const fileUploadPath = path.join(__dirname, '..', 'uploads', req.files[key].name);
      const file = req.files[key];
      await file.mv(fileUploadPath);
   });

   const exam = Exam.build({
      user_id: userId,
      examTitle,
      examType,
      contact,
      admitCardReleaseDate,
      eligibility,
      examDate,
      result,
      overview,

      featurtedImage: path.join(__dirname, '..', 'uploads', req.files.featuredImage.name),
      practicePaper: path.join(__dirname, '..', 'uploads', req.files.practicePaper.name),
      syllabus: path.join(__dirname, '..', 'uploads', req.files.syllabus.name),
   });

   await exam.save();

   res.redirect(`/admin/exam?examAdded=true`);
});

router.post('/career', (req, res) => {});

router.post('/exam', (req, res) => {});

module.exports = router;
