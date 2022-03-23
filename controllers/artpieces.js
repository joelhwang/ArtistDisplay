const ArtPiece = require('../models/artpiece');
const { cloudinary} = require("../cloudinary");
const {getDate} = require('../helpers/getDate');


module.exports.index = async (req, res) => {
    const artpieces = await ArtPiece.find({});
    res.render('artpieces/index', { artpieces });
}

module.exports.renderNewForm = (req, res)=>{
    res.render('artpieces/new');
}

module.exports.uploadArtpiece = async(req,res)=>{
    const artpiece = new ArtPiece(req.body.artpiece);
    if(req.file == undefined){
        req.flash('error', 'Image is required');
        res.redirect('/artpieces/new')
    }
    artpiece.image.url = req.file.path;
    artpiece.image.filename = req.file.filename;
    artpiece.artist = req.user._id;
    const date = getDate();
    artpiece.date = date;
    console.log(artpiece.date);
    await artpiece.save();
    res.locals.currentUser.artpieces.push(artpiece);
    await res.locals.currentUser.save();
    req.flash('success', 'Successfully uploaded new art piece!');
    res.redirect(`/artpieces/${artpiece._id}`);
}

module.exports.showArtpiece = async (req, res, next) => {
    const artpiece = await ArtPiece.findById(req.params.id).populate('artist');
    if(!artpiece){
        req.flash('error', 'Cannot find that art piece');
        res.redirect('/artpieces');
    }
    res.render('artpieces/show', { artpiece });
}

module.exports.renderEditForm = async (req, res,) => {
    const { id } = req.params;
    const artpiece = await ArtPiece.findById(id);
    if(!artpiece){
        req.flash('error', 'Cannot find that art piece');
        res.redirect('/artpieces');
    }
    res.render('artpieces/edit', { artpiece })
}

module.exports.editArtpiece = async(req, res)=>{
    const {id} = req.params;
    const artpiece = await ArtPiece.findByIdAndUpdate(id, {...req.body.artpiece})
    req.flash('success', 'Successfully updated art piece!')
    res.redirect(`/artpieces/${artpiece._id}`)
}

module.exports.deleteArtpiece = async(req, res)=>{
    const{id} = req.params
    const artpiece = await ArtPiece.findById(id).populate('artist');
    await cloudinary.uploader.destroy(artpiece.image.filename);
    await ArtPiece.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted art piece!')
    res.redirect(`/user/${artpiece.artist._id}`)
}