const bcrypt = require('bcrypt');
const User = require('../model/User');
const hashPassword = require('./utils/hashPassword');

const register = (req, res) => {
	try {
		const { name, email, password, confirmPassword } = req.body;
		if (password !== confirmPassword) throw new Error('Passwords do not match');

		const hashedPassword = hashPassword(password);

		const user = User.build({ name, email, password: hashedPassword });

		user
			.save()
			.then(() => {
				res.redirect('/');
			})
			.catch((err) => {
				throw new Error(err.message);
			});
	} catch (err) {
		res.redirect(`/register?registerFailed=true&&failMessage=${err.message}`);
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ where: { email } });
		if (!user) throw new Error('Invalid Email/Password');

		const passwordMatch = bcrypt.compareSync(password, user.password);
		if (!passwordMatch) throw new Error('Invalid Email/Password');

		req.session.userId = user.id;
		req.session.username = user.name;
		req.session.isLoggedIn = true;

		res.redirect('/admin');
	} catch (err) {
		res.redirect(`/login?loginFailed=true&&failMessage=${err.message}`);
	}
};

const logout = (req, res) => {
	try {
		req.session.destroy();

		//* TODo
		res.redirect('/');
	} catch (err) {
		//* TODo
		res.send(`FAILED: ${err.message}`);
	}
};

module.exports = {
	register,
	login,
	logout,
};
