var hotelData = require('../data/hotel-data.json');

module.exports.hotelsGetAll = function(request, response){
    console.log("GET the hotels");
    response
            .status(200)
            .json(hotelData);    
};

module.exports.hotelsGetOne = function(request, response){
    var hotelId = request.params.hotelId;
    var thisHotel = hotelData[hotelId];
    console.log("GET hotelId", hotelId);
    
    response
            .status(200)
            .json(thisHotel);    
};