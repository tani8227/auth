const express = require("express");
const cookieParser= require('cookie-parser');
require('dotenv').config();
const port =process.env.PORT ;
const app = express();
app.use(cookieParser());
const db= require('./config/mongoose')
// use for session cookie
const session= require('express-session');
const passport = require('passport');
const passportLocal= require('./config/passport-local-strategy')
const passportGoogle= require('./config/passport-google-oauth2-strategy');
const passportFacebook= require('./config/passport-facebook-Strategy');
const expressLayouts= require('express-ejs-layouts');
const MongoStore = require("connect-mongo");
const flash= require('express-flash');
const customMware= require('./config/middleware');
app.set('view engine', 'ejs');
app.set('views', './views')
app.use(express.static('./assets'))
app.use(express.urlencoded({extended: true}));
app.set("layout extractStyles", true)
app.set("layout extractScripts", true)
app.use(expressLayouts);
app.use(session(
    {
        name:"auth",
        secret:process.env.SECRET,
        saveUninitialized:false,
        resave:false,
        cookie:
        {
            maxAge: 100*60*1000,
        },
        store: new MongoStore({
           mongoUrl:process.env.MONGO_URL,
            autoRemove:'disabled'
          } , function(err)
          {
            console.log(err, "error");
          }),
    }));

    app.use((req, res, next) => {
        res.setHeader('Permissions-Policy', 'geolocation=(); microphone=()');
        next();
      });
      

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser)

app.use(flash());
app.use(customMware.setflash);



  
 
app.use('/', require('./routes'))


app.listen(port, function(err)
{
    if(err)
    {
        console.log("error in running the server");
    }else
    {
        console.log("server is running on port :", port);
    }
})
