const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//retrieving Cloudinary account information
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

//name of folder in Cloundinary database is ArtistDisplay and only accept given file types
const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'ArtistDisplay',
        allowedFormats:['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}