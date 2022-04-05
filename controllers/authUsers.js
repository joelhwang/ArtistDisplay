const User = require('../models/user');

module.exports.renderRegisterForm = (req, res)=>{
    res.render('users/register');
}

module.exports.registerUser = async(req, res)=>{
    try{
        const { username, password, verifyPassword } = req.body;
        if(password != verifyPassword){
            req.flash('error', 'Passwords do not match');
            res.redirect('register');
        }
        else{
            const user = new User({ username });
            user.firstLetter = username.charAt(0);
            const registeredUser = await User.register(user, password);
            req.login(registeredUser, err=>{
                if(err) return next(err);
                req.flash('success', 'Welcome to Artist Display!');
                res.redirect('/');
            })
        }
    } 
    catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLoginForm = (req, res)=>{
    res.render('users/login');
}

module.exports.loginUser = (req, res)=>{
    req.flash('success', 'Logged in successfully!');
    const redirect = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirect);
}

module.exports.logoutUser = (req, res) =>{
    req.logout();
    req.flash('success', "Successfully logged out!");
    res.redirect('/');
}

module.exports.showUser = async (req, res, next) => {
    const user = await User.findById(req.params.id).populate('artpieces');
    if(!user){
        req.flash('error', 'Cannot find that user');
        res.redirect('/');
    }
    res.render('users/userShow', { user });
}