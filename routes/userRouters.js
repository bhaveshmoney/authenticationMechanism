const router = require('express').Router();
const userctrl = require('../controller/userctrl');

router.post('/register', userctrl.register);
router.post('/login', userctrl.login);
router.get('/refresh_token', userctrl.refreshToken);

module.exports = router