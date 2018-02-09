// var dbconn = require('../data/dbconnection.js');
// var ObjectId = require('mongodb').ObjectId;
// var hotelData = require('../data/hotel-data.json');

var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.hotelsGetAll = function(request, response){
    
    // var db = dbconn.get();
    // var collection = db.collection('hotels');
    
    var offset = 0;
    var count = 5;
    
    if(request.query && request.query.offset){
        offset = parseInt(request.query.offset, 10);
    }
    
    if(request.query && request.query.count){
        count = parseInt(request.query.count, 10);
    }
    
    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, hotels){
            console.log("Found hotels", hotels.length);
            response
                .json(hotels);
        });
};

module.exports.hotelsGetOne = function(request, response){
    
    var hotelId = request.params.hotelId;
    console.log("GET hotelId", hotelId);
    
    Hotel
        .findById(hotelId)
        .exec(function(err, doc){
            response
                .status(200)
                .json(doc);
        });
};

module.exports.hotelsAddOne = function(request, response){
    var db = dbconn.get();
    var collection = db.collection('hotels');
    var newHotel;

    console.log("POST new hotel");
    
    if(request.body && request.body.name && request.body.stars){
            newHotel = request.body;
            newHotel.stars= parseInt(request.body.stars, 10);
            console.log(newHotel);
            collection.insertOne(newHotel, function(err,res){
                console.log(res);
                console.log(res.ops);
                response
                    .status(201)
                    .json(res.ops);
            });
    } else {
                console.log("Data missing from body");
                    response
                        .status(400)
                        .json({message : "Required data missing from body"});
            }
};