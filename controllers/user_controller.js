
const User = require('../models/user')
const bcrypt= require('bcrypt');


// render the profile page
module.exports.profile= async function(req, res)
{    
    
    // {
     // only for manual authentication 
    // console.log(req.cookies.user_id)
    // checking if the user id exist in the cookie that we set while user was signing in.
    // if the user id exist in the browser so we find the user in the database with that user id.
    // then  we find the user correndance with that user id so we user can see the profile page .
       
    // console.log(req.cookies.auth);
    // if(req.cookies.user_id)
    // {
    //     console.log("in");
    //     console.log(req.cookies);
    //     const user = await User.findById({_id: req.cookies.user_id});

    //     if(user)
    //     {
    //         console.log("current user matches with the req user")
    //         return res.render('profile');
    //     }
    // }
    // }

//    if(req.isAuthenticated())
//    { 
    return res.render('profile',
    {
        title:"Profile",
    });
//    }else
//    {
    // return res.redirect('/users/siginin');
//    }
}




// render the sign up page
module.exports.signUp= async function(req, res)
{
    // console.log(req.cookies);

    if(req.isAuthenticated())
    { 
        return res.redirect('back');
    }
    else
    {
        return res.render('signup');
    }
}


// render the sign in page
module.exports.signIn= async function(req, res)
{

    if(req.isAuthenticated())
    { 
        return res.redirect('back');
    }
    else
    {
        return res.render('signin');
    }
    
}


// create the user 
module.exports.create=  async function(req, res)
{
    // console.log(req.body);
    // console.log(req.cookies);
      const user= await User.findOne({email: req.body.email});

      if(user)
      {
          req.flash('error', "user already existed")
          return res.redirect('/users/signin')
      }
      
      else
      {

        const hashpassword= await bcrypt.hash(req.body.password, 10);

        if(hashpassword){ 
         const usercreated= await User.create(
            {
              name: req.body.name,
              email: req.body.email,
              password:hashpassword,
            })


            if(usercreated)
            {
                console.log("user created");
                req.flash('success', "user created succesfully")
                return res.redirect('/users/signin');
            }else
            {
                console.log("error in creating the user");
                req.flash('error', "error in creating the user")
                return res.redirect('back');
            }
        }else
        {
            console.log("error in encrypting the password");
            req.flash('error', "Unknown error")
            return res.redirect('back');
        }
      }
   
}


// create the session for user or signin the user 
module.exports.createsession= async function(req, res)
{ 


    // console.log(req.body.password)
    // manual signing in 
    // const user= await User.findOne({email: req.body.email});
  
    // if(user)
    // {
    //     console.log(user._id);
    //     // if user exist in the database so we set the user id as cookie in the browser
    //     res.cookie('user_id', user._id);
    //     return res.redirect('/users/profile');
    // }
    // else
    // {

    //     return res.redirect('/users/signup');
    // }


    // console.log('work', req.user.id)

    req.flash('success', "sign in successfully");
    // console.log(req.flash('success'));
    console.log(req,res);
    return res.redirect('/users/profile');

}


// destroy session or sign out 
module.exports.destroysession = function(req, res)
{
    req.logout(function(err)
    {
        if(err)
        {
            console.log('error in loging out')
            req.flash('error', "error in log out");
            return res.redirect('back');
        }
        req.flash('success', "log out successfully");
        return res.redirect('/');
    });
   
}



//  reset the passwords
module.exports.resetPasswordPage= async function(req, res)
{
     return res.render('forget_password');  
}

// reset the passwords 
module.exports.resetPassword= async function(req, res)
{
     const user = await User.findOne({email: req.body.email})
     if(user)
     {
        const hashpassword= await bcrypt.hash(req.body.password, 10);
        if(hashpassword){ 
        const updatepassword= await User.findByIdAndUpdate(
            {
                _id:user._id,
            },
            
            {
               password:hashpassword,
            },

           {   new : true}
           
           )
           if(updatepassword)
           {
            console.log('updated password')
            req.flash('success', "password updated succesfully")
            
            return res.redirect('/');
           }

        }else
        {
            console.log("error in encrypting the password");
            req.flash('error', "Unknown error")
            return res.redirect('back');
        }
     }else
     {
        req.flash('error', "email not found")
        return res.redirect('back');
    }
    
}