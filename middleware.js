const { artSchema } = require('./schemas.js');
const CustomError = require('./helpers/CustomError');
const ArtPiece = require('./models/artpiece');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/user/login');
    }
    next();
}

module.exports.validateArt = (req, res, next) =>{
    const {error} = artSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        // join if there is more than one error
        throw new CustomError(msg, 400)
    }
    else{
        next();
    }
}

module.exports.isCreator = async(req, res, next)=>{
    const { id } = req.params;
    const artpiece = await ArtPiece.findById(id);
    if(!artpiece.artist.equals(req.user._id)){
        req.flash('error', 'You do not have permission to edit this art!');
        return res.redirect(`/artpieces/${id}`);
    }
    next();
}