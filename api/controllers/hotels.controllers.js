var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function(req, res) {
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	
	if (isNaN(lng) || isNaN(lat)) {
		res.status(400).json({
			"message": "Both lng and lat supplied on the querystring must be numbers"
		});
		return;
	}
	//A geoJSON point
	var point = {
		type: "Point",
		coordinates: [lng, lat]
	};
	Hotel.aggregate([{
		"$geoNear": {
			"near": point,
			"distanceField": "distance",
			"spherical": true,
			"maxDistance": 2000, //in meters = 2km
			"num": 5
		}
	}], function(err, results, stats) {
		console.log('Geo results', results);
		console.log('Geo stats', stats);
		if (err) {
			console.log("Error finding hotels");
			res
				.status(500)
				.json(err);
		} else {
			res
				.status(200)
				.json(results);
		}
	});
};
module.exports.hotelsGetAll = function(request, response) {
	console.log('Requested by: '+ request.user);
	console.log('GET the hotels');
	console.log(request.query);
	
	var offset = 0;
	var count = 5;
	var maxCount = 10;
	
	if (request.query && request.query.lat && request.query.lng) {
		runGeoQuery(request, response);
		return;
	}
	if (request.query && request.query.offset) {
		offset = parseInt(request.query.offset, 10);
	}
	if (request.query && request.query.count) {
		count = parseInt(request.query.count, 10);
	}
	if (isNaN(offset) || isNaN(count)) {
		response
			.status(400)
			.json({
			"message": "If supplied in querystring count and offset shoud be numbers"
		});
		return;
	}
	if (count > maxCount) {
		response
			.status(400)
			.json({
			"message": "Count limit of " + maxCount + " exceeded"
		});
		return;
	}
	Hotel
		.find()
		.skip(offset)
		.limit(count)
		.exec(function(err, hotels) {
		if (err) {
			console.log("Error finding hotels");
			response
				.status(500)
				.json(err);
		} else {
			console.log("Found hotels", hotels.length);
			response.json(hotels);
		}
	});
};
module.exports.hotelsGetOne = function(request, response) {
	
	var id = request.params.hotelId;
	console.log("GET hotelId", id);
	
	Hotel
		.findById(id)
		.exec(function(err, doc) {
		var res = {
			status: 200,
			message: doc
		};
		if (err) {
			console.log("Error finding hotel");
			res.status = 500;
			res.message = err;
		} else if (!doc) {
			console.log("HotelId not found in database", id)
			res.status = 404;
			res.message = {
				"message": "Hotel ID not found" + id
			};
		}
		response
			.status(res.status)
			.json(res.message);
	});
};

var _splitArray = function(input) {
    var output;
    if(input && input.length > 0) {
        output = input.split(";");
    } else {
        output = [];
    }
    return output;
};

module.exports.hotelsAddOne = function(request, response) {
	Hotel
	   .create({
	       name : request.body.name,
	       description : request.body.description,
	       stars : parseInt(request.body.stars, 10),
	       services : _splitArray(request.body.services),
	       photos : _splitArray(request.body.photos),
	       currency : request.body.currency,
	       location : {
	           address : request.body.address,
	           coordinates : [
	               parseFloat(request.body.lng), 
	               parseFloat(request.body.lat)
	               ]
	       }
	   }, function(err, hotel){
	       if(err){
	           console.log("Error creating hotel");
	           response
	            .status(400)
	            .json(err);
	           
	       } else {
	           console.log("Hotel created", hotel);
	           response
	                .status(201)
	                .json(hotel);
	       }
	   });
};

module.exports.hotelsUpdateOne = function(req, res){
	
	var hotelId = req.params.hotelId;
	console.log("GET hotelId", hotelId);
	
	Hotel
		.findById(hotelId)
		.select("-reviews -rooms")
		.exec(function(err, doc) {
		var response = {
			status: 200,
			message: doc
		};
		if (err) {
			console.log("Error finding hotel");
			response.status = 500;
			response.message = err;
		} else if (!doc) {
			//console.log("HotelId not found in database")
			response.status = 404;
			response.message = {
				"message": "Hotel ID not found"
			};
		}
		if(response.status !=200) {
			res
				.status(response.status)
				.json(response.message);
		} else {
			doc.name = req.body.name;
			doc.description = req.body.description;
	    	doc.stars = parseInt(req.body.stars, 10);
	    	doc.services = _splitArray(req.body.services);
	    	doc.photos = _splitArray(req.body.photos);
	    	doc.currency = req.body.currency;
	    	doc.location = {
	           address : req.body.address,
	           coordinates : [
	               parseFloat(req.body.lng), 
	               parseFloat(req.body.lat)
	               ]
	       };
	       doc.save(function(err, hotelUpdated){
	       		if(err) {
	       			res
	       				.status(500)
	       				.json(err);
	       			
	       		} else {
	       			res
	       				.status(204)
	       				.json();
	       		}
	       });
		}
	});
};

module.exports.hotelsDeleteOne = function(req, res) {
	
	var hotelId = req.params.hotelId;
	Hotel
		.findByIdAndRemove(hotelId)
		.exec(function(err, hotel){
			if(err){
				res
					.status(404)
					.json(err);
			} else {
				console.log("Hotel deleted, id: ", hotelId);
				res 
					.status(204)
					.json();
			}
		});
};