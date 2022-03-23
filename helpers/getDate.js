module.exports.getDate = ()=>{
    const date = new Date();
    const year = date.getFullYear();
    const day = date.getDate()
    const months = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"];
    
    let month = months[date.getMonth()];

    return month + ' ' + day  + ', ' + year;
}

