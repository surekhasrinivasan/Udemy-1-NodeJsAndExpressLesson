var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

//GET all reviews for a hotel 
module.exports.reviewsGetAll = function(request,response){
    var hotelId = request.params.hotelId;
    console.log("GET hotelId", hotelId);
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, doc){
            console.log("Returned doc", doc);
            response
                .status(200)
                .json(doc.reviews);
        });
};

//GET single review for a hotel 
module.exports.reviewsGetOne = function(request, response){
    var hotelId = request.params.hotelId;
    var reviewId = request.params.reviewId;
    console.log("GET reviewId " + reviewId + " for hotelId " + hotelId);
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, hotel){
            console.log("Returned doc", hotel);
            var review = hotel.reviews.id(reviewId);
            response
                .status(200)
                .json(review);
        });
};