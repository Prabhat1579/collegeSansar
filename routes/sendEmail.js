const nodemailer = require('nodemailer');

const sendEmail = async ({ text, email }) => {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'your_email',
			pass: 'your_password',
		},
	});

	var mailOptions = {
		from: 'your_email',
		to: email,
		subject: 'Upcoming Exam Notification',
		text: 'http://localhost:5000/exam',
	};

	const response = await transporter.sendMail(mailOptions);
	return response;
};

module.exports = sendEmail;
