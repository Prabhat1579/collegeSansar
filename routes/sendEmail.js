const nodemailer = require('nodemailer');

const sendEmail = async ({ text, email }) => {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'dahaljohn06@gmail.com',
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
