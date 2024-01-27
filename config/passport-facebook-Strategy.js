const passport = require('passport');
const User = require('../models/user');
const crypto = require('crypto'); // Add this line
require('dotenv').config();
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy(
    {
        clientID: process.env.CLIENT_ID_FACEBOOK,
        clientSecret: process.env.CLIENT_SECRET_FACEBOOK,
        callbackURL: process.env.CALLBACK_URL_FACEBOOK,
    },
    

    async function (accessToken, refreshToken, profile, done) {
        try {
             
            console.log('Callback URL:', process.env.CALLBACK_URL_FACEBOOK);
            const user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // Update user information if necessary
                // For example: user.name = profile.displayName;
                // Save the updated user: await user.save();
                return done(null, user);
            } else {
                const newuser = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex'),
                });

                if (newuser) {
                    return done(null, newuser);
                } else {
                    console.error('Error in creating the new user');
                    return done(null, false);
                }
            }
        } catch (error) {
            console.error('Error during user creation:', error);
            return done(error);
        }
    }
));




    