//jshint esversion:6
const {
    check,
    body
} = require('express-validator/check');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');
//POST create user/ Sign up
router.post('/newuser', [
    check('name').isLength({
        min: 3
    }).withMessage('Name is too short or invalid').matches(/^([^0-9]*)$/).withMessage('Not numbers allowed'),
    check('last_name').isLength({
        min: 3
    }).withMessage('last Name is too short or invalid').matches(/^([^0-9]*)$/).withMessage('Not numbers allowed'),
    check('phone').isLength({
        min: 12
    }).withMessage('Phone is invalid').withMessage('Phone is invalid'),
    check('email').isEmail().trim().normalizeEmail().withMessage('Invalid email'),
    check('password').trim().isLength({
        min: 6
    }).withMessage('Password must be at least 6 characters long'),
    body('password1').custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');

        }
        return true;
    })
], userController.createUser);
//POST Longin user
router.post('/login', [
    check('email').isEmail().trim().withMessage('Invalid email').normalizeEmail(),

], userController.loginUser);

router.get('/coaches', auth, userController.getCoaches);

router.get('/all', auth, userController.getAllUsers);
// PUT Update user
router.put('/update', auth, userController.updateUser);
// GET user 
router.get('/me', auth, userController.getUser);
// GET user by ID
router.get('/:id', auth, userController.getUserById);

router.post('/forgot', userController.forgotPassword);

router.post('/reset', userController.resetPassword);

router.delete('/:id', auth, admin, userController.deleteUser);



module.exports = router;