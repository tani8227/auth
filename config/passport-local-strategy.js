const User = require('../models/user')
const bcrypt= require('bcrypt');
const passport = require('passport');
const LocalStrategy= require('passport-local').Strategy;


passport.use(new LocalStrategy(
    {
     usernameField: 'email',
     passReqToCallback: true,
    },
     async function(req ,email, password, done)
     {
        // find the user and establish the identity
        const user = await User.findOne({email:email});
        if(user)
        {

            const hashPasswordMatched = await bcrypt.compare(password, user.password);

               
              if(hashPasswordMatched)
              {
                
                return done(null, user);
                
              }else
              {
                console.log("username/password inccorect")
                req.flash('error', "username/password inccorect");
                return done(null, false);
              }
        }else
        {
            req.flash('error', "unauthorized user");
            return done(null, false);
        }
     }
    ));


    // serializing the user to decide which key to be kept in the cookie

    passport.serializeUser(function(user, done)
    {
         done(null, user.id);
    });


    // deserializing the user from the key in the  cookies

    passport.deserializeUser(async function(id, done)
    {
       
        const user = await User.findById(id);
        if(user)
        {
            return done(null, user);
        }
       
    });


// check if the user is authenticated 
passport.checkAuthentication= function(req,res, next)
{
   // if user is signed in pass on the req to the next function 
    if(req.isAuthenticated())
    {
        return next();
    }else
    {
        // if the user is not signin 
        req.flash('error', "unauthorized user");
        return res.redirect('/users/signin')
    }
}


// set the user for view 
passport.setAuthenticatedUser = function(req,res, next)
{
    if(req.isAuthenticated())
    {
        // req.user contains the current signed in user from the session cookie and we are sending this locals to the view 
        res.locals.user= req.user;
    }
    next();
}   
      
      


module.exports=passport;


