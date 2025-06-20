const User = require('../models/user');
module.exports.renderRegister = (req,res)=>{
    res.render('users/register')
};
module.exports.register = async (req,res)=>{
    try{
        const {email, username, password} = req.body;
        const user = new User({
            username,
            email
        })
        const registeredUser = await User.register(user,password);
        req.login(registeredUser, err=>{
            if(err){
                return next(err);
            }
            else{
                req.flash('success','Welcome to yelpcamp');
                res.redirect('/campgrounds');
            }
        })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}
module.exports.loginShow = (req,res)=>{
    res.render('users/login');
};
module.exports.saveLogin = (req,res)=>{
    req.flash('success','Welcome Back');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
module.exports.logoutShow = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success','Good Bye!');
        res.redirect('/campgrounds');
    });
};