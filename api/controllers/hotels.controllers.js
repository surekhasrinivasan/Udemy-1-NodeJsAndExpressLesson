var dbconn = require('../data/dbconnection.js');
var ObjectId = require('mongodb').ObjectId;
var hotelData = require('../data/hotel-data.json');

module.exports.hotelsGetAll = function(request, response){
    
    var db = dbconn.get();
    var collection = db.collection('hotels');
    
    var offset = 0;
    var count = 5;
    
    if(request.query && request.query.offset){
        offset = parseInt(request.query.offset, 10);
    }
    
    if(request.query && request.query.count){
        count = parseInt(request.query.count, 10);
    }
    
    collection
        .find()
        .skip(offset)
        .limit(count)
        .toArray(function(err,docs){
            console.log("Found hotels", docs);
        response
            .status(200)
            .json(docs);            
    });
};

module.exports.hotelsGetOne = function(request, response){
    var db = dbconn.get();
    var collection = db.collection('hotels');
    
    var hotelId = request.params.hotelId;
    //var thisHotel = hotelData[hotelId];
    console.log("GET hotelId", hotelId);
    
    collection
        .findOne({
            _id : ObjectId(hotelId)
        }, function(err, doc){
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