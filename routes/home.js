const express = require('express')
const router = express.Router();
const tryAsync = require('../helpers/tryAsync');
const User = require('../models/user');

router.get('/', tryAsync(async(req, res)=>{
    var noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');;
        User.find({username: regex}, function(err, allUsers){
            if(err) {
                throw err;
            } 
            else{
                if(allUsers.length < 1){
                    noMatch = "No artists match that search.";
                }
                res.render('home/searchIndex', { users:allUsers, noMatch:noMatch }); 
            }
        }).populate('artpieces');
    }
    else{
        User.find({}, function(err, allUsers){
            if(err) {
                throw err;
            } 
            else{
                res.render('home/home', { users:allUsers, noMatch:noMatch }); 
            }
        }).populate('artpieces');
    }
}));
 
router.get('/artists', tryAsync(async(req, res)=>{
    const users = await User.find({}).populate('artpieces');
    users.sort(dynamicSort('username'));
    res.render('home/artists', { users });
}));

router.get('/artists/:firstLetter', tryAsync(async(req, res)=>{
    const fLetter = req.params.firstLetter;
    const unfilteredUsers = await User.find({}).populate('artpieces');
    const users = [];
    for(user of unfilteredUsers){
        if(user.firstLetter == fLetter){
            users.push(user);
        }
    }
    users.sort(dynamicSort('username'));
    res.render('home/artists', { users });
}));



//https://stackoverflow.com/questions/38421664/fuzzy-searching-with-mongodb
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

module.exports = router;