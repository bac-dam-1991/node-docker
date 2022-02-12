const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

module.exports.signUp = async (req, res) => {
	try {
		const { username, password } = req.body;
		const hashPassword = await bcrypt.hash(password, 12);
		const newUser = await User.create({ username, password: hashPassword });
		req.session.user = newUser;
		res.status(201).json({ status: 'success', data: { user: newUser } });
	} catch (e) {
		res.status(400).json({ status: 'fail' });
	}
};

module.exports.login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user) {
			throw new Error('Invalid credentials');
		}
		const isCorrect = await bcrypt.compare(password, user.password);
		if (!isCorrect) {
			throw new Error('Invalid credentials');
		}
		req.session.user = user;
		res.status(200).json({ status: 'success' });
	} catch (e) {
		res.status(400).json({ status: 'fail', message: e.message });
	}
};

module.exports.logout = async (req, res) => {};
