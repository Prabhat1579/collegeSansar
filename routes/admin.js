const express = require('express');
const chalk = require('chalk');
const path = require('path');
const { createCollege, deleteCollege } = require('../controller/admin/college');
const College = require('../model/College');
const Exam = require('../model/Exam');
const Career = require('../model/Career');
const User = require('../model/User');
const Apply = require('../model/Apply');
const sendEmail = require('./sendEmail');
const router = express.Router();

// * GET ROUTES

router.get('/', async (req, res) => {
	const colleges = await College.findAll();
	const users = await User.findAll();
	const applies = await Apply.findAll();
	const exams = await Exam.findAll();

	res.render('admin_index', {
		colleges: colleges.length,
		students: users.length,
		applies: applies.length,
		exams: exams.length,
	});
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

			editLink: `/admin/college/edit/${id}`,
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

		item.editLink = `/admin/career/edit/${item.id}`;
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

	if (req.files) {
		Object.keys(req.files).map(async (key) => {
			const fileUploadPath = path.join(__dirname, '..', 'uploads', req.files[key].name);
			const file = req.files[key];
			await file.mv(fileUploadPath);
		});
	}

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

		featurtedImage: req.files?.featuredImage?.name,
		practicePaper: req.files?.practicePaper?.name,
		syllabus: req.files?.syllabus?.name,
	});

	await exam.save();

	const users = await User.findAll();
	users.forEach((user) => {
		sendEmail({
			email: user.email,
			text: `Upcoming exam: ${examTitle}... Link: http://localhost:5000/exam/${exam.id}`,
		});
	});

	res.redirect(`/admin/exam?examAdded=true`);
});

router.get('/college/edit/:college_id', async (req, res) => {
	const { college_id } = req.params;
	const { collegeUpdated } = req.query;

	const college = await College.findByPk(college_id);

	const {
		id,
		name = '',
		category = '',
		description = '',
		courses = '',
		eligibility = '',
		facilities = '',
		fee = '',
		featuredImage = '',
	} = college;

	res.render('admin_college_edit', {
		id,
		name,
		category,
		description,
		courses,
		eligibility,
		facilities,
		featuredImage,
		fee,

		postLink: `/admin/college/edit/${id}`,
		collegeUpdated,
	});
});

router.post('/college/edit/:college_id', async (req, res) => {
	const { college_id } = req.params;

	const { name, location, fee, eligibility, courses, category, description, thumbnail } = req.body;

	await College.update(
		{ name, location, fee, eligibility, courses, category, description, thumbnail },
		{ where: { id: college_id } }
	);

	res.redirect(`/admin/college/edit/${college_id}?collegeUpdated=true`);
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

router.get('/career/edit/:career_id', async (req, res) => {
	const { career_id } = req.params;
	const { careerUpdated } = req.query;

	const career = await Career.findByPk(career_id);

	res.render('admin_career_edit', {
		careerName: career.careerName,
		careerDescription: career.careerDescription,

		careerUpdated,
		editLink: `/admin/career/edit/${career_id}`,
	});
});

router.post('/career/edit/:career_id', async (req, res) => {
	const { career_id } = req.params;

	const { careerName, careerDescription } = req.body;

	let featuredImage;

	if (req.files) {
		featuredImage = req.files.featuredImage;
		const fileUploadPath = path.join(__dirname, '..', 'uploads', featuredImage.name);
		const file = featuredImage;
		await file.mv(fileUploadPath);
	}

	await Career.update(
		{ careerName, careerDescription, featuredImage: featuredImage ? featuredImage.name : '' },
		{ where: { id: career_id } }
	);

	res.redirect(`/admin/career/edit/${career_id}?careerUpdated=true`);
});

router.post('/exam', (req, res) => {});

module.exports = router;
