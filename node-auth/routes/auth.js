const express = require('express');
const {check,body} = require('express-validator')

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',[check('email','Enter valid email').isEmail().normalizeEmail(),body('password','Password must be 5 characters long').isLength({min:5}).isAlphanumeric().trim()], authController.postLogin);

router.post('/signup',[check('email').isEmail().normalizeEmail().
withMessage('Please enter a valid email')
.custom((value,{req})=>{
    if(value ==="test@test.com"){
         throw new Error('This email is forbidden')
    }
    return true;
}),
body('password','the password should be atlest 5 character long').isLength({min:5}).isAlphanumeric().trim(),
body('confirmPassword').custom((value,{req})=>{
    if(value!== req.body.password){
        throw new Error('Password must match');
    }
    return true;
})
], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset',authController.getReset);

router.post('/reset',authController.postReset);

router.get('/reset/:token',authController.getNewPassword);

router.post('/new-password',authController.postNewPassword);

module.exports = router;