var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://surekhasrinivasan-firstworkspace-5563392';

var _connection = null;

var open = function(){
    MongoClient.connect(dburl, function(err, client){
        if(err) {
            console.log("DB connection failed");
            return;
        }
    // set _connection
        _connection = client.db("meanhotel");
        console.log("DB connection open", client);
    });
};

var get = function() {
    return _connection;
};

module.exports = {
    open : open,
    get : get
};
