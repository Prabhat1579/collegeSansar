const express = require('express');
const chalk = require('chalk');
const path = require('path');
const { createCollege, deleteCollege } = require('../controller/admin/college');
const College = require('../model/College');
const Exam = require('../model/Exam');
const Career = require('../model/Career');
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

router.get('/career', async (req, res) => {
	const { careerAdded, careerDeleted } = req.query;

	const careers = await Career.findAll();

	careers.forEach((item) => {
		item.featuredImage = `/uploads/${item.featuredImage}`;
		item.shortDescription = item.careerDescription.substring(0, 20);
		item.deleteLink = `/admin/career/delete/${item.id}`;
	});

	res.render('admin_career', {
		careerAdded,
		careerDeleted,
		careers,
	});
});

router.get('/exam/delete/:exam_id', async (req, res) => {
	const { exam_id } = req.params;

	await Exam.destroy({
		where: {
			id: exam_id,
		},
	});

	res.redirect('/admin/exam?examDeleted=true');
});

router.get('/exam', async (req, res) => {
	const { examAdded, examDeleted } = req.query;

	const exams = await Exam.findAll();

	exams.forEach((exam) => {
		exam.featurtedImage = `/uploads/${exam.featurtedImage}`;
		exam.syllabus = `/uploads/${exam.syllabus}`;
		exam.practicePaper = `/uploads/${exam.practicePaper}`;
		exam.deleteLink = `/admin/exam/delete/${exam.id}`;
	});

	res.render('admin_exam', {
		examAdded,
		examDeleted,
		exams: exams,
	});
});

router.post('/career/create', async (req, res) => {
	const { careerName, careerDescription } = req.body;
	const { featuredImage } = req.files;

	const fileUploadPath = path.join(__dirname, '..', 'uploads', featuredImage.name);
	const file = featuredImage;
	await file.mv(fileUploadPath);

	const career = Career.build({
		careerName,
		careerDescription,

		featuredImage: featuredImage.name,
	});

	await career.save();

	res.redirect('/admin/career?careerAdded=true');
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
		examCategory,
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
		examCategory,
		contact,
		admitCardReleaseDate,
		eligibility,
		examDate,
		result,
		overview,

		featurtedImage: req.files.featuredImage.name,
		practicePaper: req.files.practicePaper.name,
		syllabus: req.files.syllabus.name,
	});

	await exam.save();
	res.redirect(`/admin/exam?examAdded=true`);
});

router.get('/career/delete/:career_id', async (req, res) => {
	const { career_id } = req.params;

	await Career.destroy({
		where: {
			id: career_id,
		},
	});

	res.redirect('/admin/career?careerDeleted=true');
});

router.post('/exam', (req, res) => {});

module.exports = router;
