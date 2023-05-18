const router = require('express').Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {

    const user_data = req.body;

    const user = await User.findOne({
        where: {
            email: user_data.email
        }
    });

    if (!user) return res.redirect('/register');

    const valid_pass = await user.validatePass(user_data.password);

    if (!valid_pass) return res.redirect('/login');

    req.session.user_id = user.id;
    req.session.userEmail = user.email;

    res.redirect('/dashboard');
});

router.post('/register', async (req, res) => {
    const user_data = req.body;

    try {
        console.log('creating new user');
        const user = await User.create(user_data);

        req.session.user_id = user.id;
        req.session.userEmail = user.email;

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        res.redirect('/login');
    }
});

router.get('/logout', async (req, res) => {
    console.log('logging out')
    try {
        req.session.destroy();
        res.clearCookie(this.cookie), { path: '/' };
        res.redirect('/')
    } catch (error) {
        console.log('errors ', error);
    }
});

module.exports = router;