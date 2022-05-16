const User = require('../models/user');

//register form
module.exports.renderRegisterForm = (req, res)=>{
    res.render('users/register');
}

//register user post request
module.exports.registerUser = async(req, res)=>{
    try{
        const { username, password, verifyPassword } = req.body;
        //making sure the passwords entered match
        if(password != verifyPassword){
            req.flash('error', 'Passwords do not match');
            res.redirect('register');
        }
        else{
            const user = new User({ username });
            //first letter of username is stored for filtering in all artists page
            user.firstLetter = username.charAt(0);
            const registeredUser = await User.register(user, password);
            //if login failed, redirect to home
            req.login(registeredUser, err=>{
                if(err) return next(err);
                req.flash('success', 'Welcome to Artist Display!');
                res.redirect('/');
            })
        }
    }
    //if register failed, show failure message and redirect to register page 
    catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
}

//login form
module.exports.renderLoginForm = (req, res)=>{
    res.render('users/login');
}

//login request
module.exports.loginUser = (req, res)=>{
    req.flash('success', 'Logged in successfully!');
    //redirect to the page the user was viewing before logging in
    const redirect = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirect);
}

//logout user
module.exports.logoutUser = (req, res) =>{
    req.logout();
    req.flash('success', "Successfully logged out!");
    res.redirect('/');
}

//user profile page
module.exports.showUser = async (req, res, next) => {
    const user = await User.findById(req.params.id).populate('artpieces');
    /*
        Handles pagination by placing the page and limit(number of items per page) as a query in the search bar.
        The query values are set by clicking on the page number which is rendered on the userShow ejs template.
    */
    if(req.query.page && req.query.limit){
        const totalLength = user.artpieces.length;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedArt =user.artpieces.reverse().slice(startIndex, endIndex);
        res.render('users/userShow', { user, paginatedArt, totalLength, page});
    }
    else{
        res.redirect(`/user/${user._id}?page=1&limit=9`)
    }
}