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
			res.status(500).json(err);
		} else {
			res.status(200).json(results);
		}
	});
};
module.exports.hotelsGetAll = function(request, response) {
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
		response.status(400).json({
			"message": "If supplied in querystring count and offset shoud be numbers"
		});
		return;
	}
	if (count > maxCount) {
		response.status(400).json({
			"message": "Count limit of " + maxCount + " exceeded"
		});
		return;
	}
	Hotel.find().skip(offset).limit(count).exec(function(err, hotels) {
		if (err) {
			console.log("Error finding hotels");
			response.status(500).json(err);
		} else {
			console.log("Found hotels", hotels.length);
			response.json(hotels);
		}
	});
};
module.exports.hotelsGetOne = function(request, response) {
	var hotelId = request.params.hotelId;
	console.log("GET hotelId", hotelId);
	Hotel.findById(hotelId).exec(function(err, doc) {
		var res = {
			status: 200,
			message: doc
		};
		if (err) {
			console.log("Error finding hotels");
			res.status = 500;
			res.message = err;
		} else if (!doc) {
			res.status = 404;
			res.message = {
				"message": "Hotel ID not found"
			};
		}
		response.status(res.status).json(res.message);
	});
};
module.exports.hotelsAddOne = function(request, response) {
	var db = dbconn.get();
	var collection = db.collection('hotels');
	var newHotel;
	console.log("POST new hotel");
	if (request.body && request.body.name && request.body.stars) {
		newHotel = request.body;
		newHotel.stars = parseInt(request.body.stars, 10);
		console.log(newHotel);
		collection.insertOne(newHotel, function(err, res) {
			console.log(res);
			console.log(res.ops);
			response.status(201).json(res.ops);
		});
	} else {
		console.log("Data missing from body");
		response.status(400).json({
			message: "Required data missing from body"
		});
	}
};