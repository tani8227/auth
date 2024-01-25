const passport = require('passport');
const User = require('../models/user');
require('dotenv').config();
const facebookStrategy = require('passport-facebook').Strategy;

passport.use(new facebookStrategy(
    {
        clientID:process.env.CLIENT_ID_FACEBOOK,
        clientSecret:process.env.CLIENT_SECRET_FACEBOOK,
        callbackURL:process.env.CALLBACK_URL_FACEBOOK,
        
    },
    async function(accessToken , refreshToken, profile, done)
    {
            const user= await User.findOne({email: profile.emails[0].value});

            if(user)
            {
                return done(null, user);
            }else
            {
        
                try {
                    const newuser = await User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: crypto.randomBytes(20).toString('hex'),
                    });
            
                    if (newuser) {
                        return done(null, newuser);
                    } else {
                        req.flash('error', 'Error in signing up');
                        console.log('Error in creating the newuser');
                        return done(null, false);
                    }
                } catch (error) {
                    console.error('Error during user creation:', error);
                    return done(error);
                }
            }
               
            
            
    }
    
    
    ))







    