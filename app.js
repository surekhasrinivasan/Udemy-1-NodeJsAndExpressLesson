var express = require('express');
var app = express();
var path = require('path');

app.set('port', process.env.PORT);

app.get('/', function(request, response){
    console.log("GET the homepage");
    response
            .status(200)
            .sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/json', function(request, response){
    console.log("GET the json");
    response
            .status(200)
            .json({"jsonData" :true});
});
app.get('/file', function(request, response){
    console.log("GET the file");
    response
            .status(200)
            .sendFile(path.join(__dirname, 'app.js'));
});

var server = app.listen(app.get('port'), function(){
    var port = server.address().port;
    console.log("Magic happens on port" + port);    
});
