const User = require('../models/user');

//search results page
module.exports.getSearch = async(req, res)=>{
    var noMatch = null;
    if(req.query.search){
        //implements fuzzy search for finding artists
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        //finds all usernames containing search input and adds them to allUsers array
        User.find({username: regex}, function(err, allUsers){
            if(err) {
                throw err;
            } 
            else{
                if(allUsers.length < 1){
                    noMatch = "No artists match that search.";
                }
                //renders ejs template for search results
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
};

module.exports.getAllArtists = async(req, res)=>{
    /*
        Handles pagination for all users page by placing the page and limit(number of items per page) as a query in the search bar.
        The query values are set by clicking on the page number which is rendered on the artists ejs template.
    */
    if(req.query.page && req.query.limit){
        const allUsers = await User.find({}).populate('artpieces');
        const totalLength = allUsers.length;
        //gets page and limit(how many entried on each page) from query params
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        //start and end index depends on current page and limit
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        allUsers.sort(dynamicSort('username'));
        const users = allUsers.slice(startIndex, endIndex);
        res.render('home/artists', { users, totalLength, page});
    }
    else{
        res.redirect('/artists?page=1&limit=10')
    }
};

module.exports.getFiltered = async(req, res)=>{
    const fLetter = req.params.firstLetter;
    /*
        Handles pagination for filtered users by placing the page and limit(number of items per page) as a query in the search bar.
        The query values are set by clicking on the page number which is rendered on the filteredArtists ejs template.
    */
    if(req.query.page && req.query.limit){
        const unfilteredUsers = await User.find({}).populate('artpieces');
        const filteredUsers = [];
        //adds only artists with given first letter in username to array for rendering
        for(user of unfilteredUsers){
            if(user.firstLetter == fLetter){
                filteredUsers.push(user);
            }
        }
        filteredUsers.sort(dynamicSort('username'));
        const totalLength = filteredUsers.length;
        //gets page and limit(how many entried on each page) from query params
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        //start and end index depends on current page and limit
        const endIndex = page * limit;
        const users = filteredUsers.slice(startIndex, endIndex);
        res.render('home/filteredArtists', { users, totalLength, fLetter, page});
    }
    else{
       res.redirect(`/artists/${fLetter}?page=1&limit=5`)
    }
}

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
};