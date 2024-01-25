const passport = require('passport');

const googleStrategy= require('passport-google-oauth').OAuth2Strategy;
const crypto =require('crypto');
const User = require('../models/user');
require('dotenv').config();


// tell passport to use new google strategy 
passport.use(new googleStrategy(
    {

    
        clientID:process.env.CLIENT_ID_GOOGLE,
        clientSecret:process.env.CLIENT_SECRET_GOOGLE,
        callbackURL:process.env.CALLBACK_URL_GOOGLE,

      
    },
     async  function(accessToken, refreshToken,profile, done)
      {
        // find the user 
        const user= await User.findOne({email: profile.emails[0].value})
          // console.log(profile);
        if(user)
        {
              
              return done(null, user);
        }else
        {
            // if user not found create the user and set it req.user
             const newuser= await User.create(
                {
                    name:profile.displayName,
                    email: profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex'),
                    scope: ['profile', 'email'],
                })
                if(newuser)
                {
                    return done(null, newuser);
                }else
                {
                  req.flash('error', "error in signing up");
                    console.log(error, " error in creating the newuser")
                }
        
        }

      } 
    ))


