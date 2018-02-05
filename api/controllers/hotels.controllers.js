var hotelData = require('../data/hotel-data.json');

module.exports.hotelsGetAll = function(request, response){
    console.log("GET the hotels");
    response
            .status(200)
            .json(hotelData);    
};