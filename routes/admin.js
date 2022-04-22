const express = require('express');
const chalk = require('chalk');
const { createCollege, deleteCollege } = require('../controller/admin/college');
const College = require('../model/College');
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
   res.render('admin_exam');
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

router.post('/career', (req, res) => {});

router.post('/exam', (req, res) => {});

module.exports = router;
