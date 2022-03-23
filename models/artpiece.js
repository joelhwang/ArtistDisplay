const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArtPieceSchema = new Schema({
    title: String,
    image:
        {
            url: String,
            filename: String        
        }
    ,
    description: String,
    artist:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {}
});

module.exports = mongoose.model('ArtPiece', ArtPieceSchema);