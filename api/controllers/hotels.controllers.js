var hotelData = require('../data/hotel-data.json');

module.exports.hotelsGetAll = function(request, response){
    console.log("GET the hotels");
    console.log(request.query);
    
    var offset = 0;
    var count = 5;
    
    if(request.query && request.query.offset){
        offset = parseInt(request.query.offset, 10);
    }
    
    if(request.query && request.query.count){
        count = parseInt(request.query.count, 10);
    }
    var returnData = hotelData.slice(offset, offset+count);
    
    response
            .status(200)
            .json(returnData);    
};

module.exports.hotelsGetOne = function(request, response){
    var hotelId = request.params.hotelId;
    var thisHotel = hotelData[hotelId];
    console.log("GET hotelId", hotelId);
    
    response
            .status(200)
            .json(thisHotel);    
};

module.exports.hotelsAddOne = function(request, response){
    console.log("POST new hotel");
    console.log(request.body);
    response
            .status(200)
            .json(request.body);
};