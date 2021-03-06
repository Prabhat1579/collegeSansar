const chalk = require('chalk');
const path = require('path');
const nodemailer = require('nodemailer');

const express = require('express');
const College = require('../model/College');
const Sequelize = require('sequelize');
const Review = require('../model/Review');
const Apply = require('../model/Apply');
const User = require('../model/User');
const Career = require('../model/Career');
const Exam = require('../model/Exam');
const Subscribe = require('../model/Subscribe');
const sendEmail = require('./sendEmail');

const router = express.Router();

router.get('/', async (req, res) => {
	sendEmail({
		email: 'prabhat.dahal123@gmail.com',
	});

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
		colleges: colleges.map(({ id, name, category, courses, description, thumbnail }) => ({
			name,
			category,
			courses: courses.substring(0, 20) + '...',
			description: description.substring(0, 20) + '...',
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
			description: description.substring(0, 20) + '...',
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
			description: description.substring(0, 20) + '...',
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
			description: description.substring(0, 20) + '...',
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
			description: description.substring(0, 20) + '...',
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
	try {
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

	if(req.files){
		Object.keys(req.files).map(async (key) => {
			const fileUploadPath = path.join(__dirname, '..', 'uploads', req.files[key].name);
			const file = req.files[key];
			await file.mv(fileUploadPath);
		});

	}
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
		citizenship: (req.files && req.files.citizenship)?req.files.citizenship.name:'',
		photo: (req.files && req.files.photo)?req.files.photo.name:'',
		slcGrade,
		plus2Grade,
		slcMarksheet: (req.files && req.files.slcMarksheet)?req.files.slcMarksheet.name:'',
		plus2Marksheet: (req.files && req.files.plus2Marksheet)?req.files.plus2Marksheet.name:'',
	});

	await apply.save();

	res.redirect(`/college/${college_id}?collegeApplied=true`);
	} catch (error) {
		console.error(error)
	}
});

router.get('/exam', async (req, res) => {
	const { search, isCategory } = req.query;
	const Op = Sequelize.Op;
	const exams = await Exam.findAll();
	let searchExams = [];

	if (isCategory) {
		searchExams = await Exam.findAll({ where: { examCategory: { [Op.like]: `%${search}%` } } });
	} else {
		searchExams = await Exam.findAll({ where: { examTitle: { [Op.like]: `%${search}%` } } });
	}

	const upcomingExam = await Exam.findAll({ limit: 1, order: [['createdAt', 'DESC']] });

	let examId= '';
	let examTitle = '';
	let examCategory = '';
	let examDate = '';
	let featurtedImage = '';

	if (upcomingExam[0]) {
		examId = upcomingExam[0].id;
		examTitle = upcomingExam[0].examTitle;
		examCategory = upcomingExam[0].examCategory;
		examDate = upcomingExam[0].examDate;
		featurtedImage = upcomingExam[0].featurtedImage;
	}

	searchExams.forEach((item) => {
		item.featuredImage = `/uploads/${item.featurtedImage}`;
	});

	if (search && search.length > 0) {
		return res.render('exam_search', {
			searchExams,
		});
	} else {
		res.render('exam', {
			//* upcoming exam
			examId,
			examTitle,
			examCategory,
			examDate,
			featuredImage: `/uploads/${featurtedImage}`,
			exams,
			//* upcoming exam

			searchExams,
		});
	}
});

router.get('/career', async (req, res) => {
	const careers = await Career.findAll();

	careers.forEach((item) => {
		item.featuredImage = `/uploads/${item.featuredImage}`;
		item.shortDescription = item.careerDescription.substring(0, 20) + '...';
		item.viewLink = `/career/${item.id}`;
	});

	res.render('career', {
		careers,
	});
});


router.get('/career/:career_id', async (req, res) => {
	const { career_id } = req.params;

	const career = await Career.findByPk(career_id);
	const featuredImage = '/uploads/' + career.featuredImage;
	const { careerName, careerDescription } = career;

	res.render('career_single', {
		careerName,
		careerDescription,
		featuredImage,
	});
});

router.post('/career/search-career', async (req, res) => {
	const { search } = req.body;

	const Op = Sequelize.Op;

	const colleges = await College.findAll({ where: { name: { [Op.like]: `%${search}%` } } });
	const careers = await Career.findAll({ where: { careerName: { [Op.like]: `%${search}%` } } });

	careers.forEach((item) => {
		item.featuredImage = `/uploads/${item.featuredImage}`;
		item.shortDescription = item.careerDescription.substring(0, 20) + '...';
		item.viewLink = `/career/${item.id}`;
	});

	const collegeList = colleges.map(({ id, name, category, description, thumbnail }) => ({
		name,
		category,
		description: description.substring(0, 20) + '...',
		link: `/college/${id}`,
		img: `/assets/${thumbnail}`,
	}));

	res.render('career', {
		colleges: collegeList,
		careers,
	});
});

router.post('/exam/subscribe', async (req, res) => {
	const {name, email, exam: exam_id} = req.body;
	const exam  = await Exam.findByPk(exam_id);
	const subscribe = Subscribe.build({
		name: name,
		email: email,
		examDate: new Date(exam.examDate),
		title: exam.examTitle
	})
	await subscribe.save()
	res.redirect(`/exam`);
});

router.get('/exam/:exam_id', async (req, res) => {
	const { exam_id } = req.params;

	const exam = await Exam.findByPk(exam_id);
	const featuredImage = '/uploads/' + exam.featuredImage;
	const { examTitle, overview } = exam;

	res.render('exam_single', {
		featuredImage,
		examTitle,
		overview,
		exam,
	});
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
