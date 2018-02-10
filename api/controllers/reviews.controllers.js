var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');
//GET all reviews for a hotel 
module.exports.reviewsGetAll = function(request, response) {
	var hotelId = request.params.hotelId;
	console.log("GET reviews for hotelId", hotelId);
	Hotel.findById(hotelId).select('reviews').exec(function(err, doc) {
		var res = {
			status: 200,
			message: []
		};
		if (err) {
			console.log("Error finding hotel");
			res.status = 500;
			res.message = err;
		} else if (!doc) {
			res.status = 404;
			res.message = {
				"message": "Hotel ID not found" + hotelId
			};
		} else {
			res.message = doc.reviews ? doc.reviews : [];
			res.status(res.status).json(res.message);
		}
	});
};
//GET single review for a hotel 
module.exports.reviewsGetOne = function(request, response) {
	var hotelId = request.params.hotelId;
	var reviewId = request.params.reviewId;
	console.log("GET reviewId " + reviewId + " for hotelId " + hotelId);
	Hotel.findById(hotelId).select('reviews').exec(function(err, hotel) {
		var res = {
			status: 200,
			message: {}
		};
		if (err) {
			console.log("Error finding hotel");
			res.status = 500;
			res.message = err;
		} else if (!hotel) {
			console.log("Hotel id not found in database", hotelId);
			res.status = 404;
			res.message = {
				"message": "Hotel Id not found " + hotelId
			};
		} else {
			//Get the review 
			res.message = hotel.reviews.id(reviewId);
			//if the review doesn't exist Mongoose returns null
			if (!res.message) {
				res.status = 404;
				res.message = {
					"message": "Review ID not found" + reviewId
				};
			}
		}
		res.status(res.status).json(res.message);
	});
};