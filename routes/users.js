const express= require('express');
const router= express.Router();
const passport= require('passport');
const userController= require('../controllers/user_controller');



router.get('/signup', userController.signUp)
router.get('/signin', userController.signIn)
router.post('/create', userController.create);
router.post('/createsession', passport.authenticate(
    
        'local',
        {
            failureRedirect : '/users/signup'
        },
    ), userController.createsession);
router.get('/profile', passport.checkAuthentication, userController.profile);

router.get('/sign-out', userController.destroysession );
router.get('/reset-password-page', userController.resetPasswordPage)
router.post('/reset-password', userController.resetPassword)

router.get('/auth/google', passport.authenticate('google', {scope:['profile', 'email']}))
router.get('/auth/google/callback', passport.authenticate(
    
        'google',

        {  
            failureRedirect:'/users/signin',
        },

), userController.createsession);



router.get('/auth/facebook', passport.authenticate('facebook', {scope:['profile', 'email']}));
router.get('/auth/facebook/callback', passport.authenticate(
    
        'facebook',
       {
        failureRedirect:'/users/signin',
       }
    ), userController.createsession);




module.exports= router;