const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    artpieces: [{
        type: Schema.Types.ObjectId,
        ref: 'ArtPiece'
    }],
    veryfyPassword: String,
    firstLetter: String
})
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)