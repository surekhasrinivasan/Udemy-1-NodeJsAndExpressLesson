var express = require("express");
var router = express.Router();

router
    .route('/json')
    .get(function(request, response){
    console.log("GET the json");
    response
            .status(200)
            .json({"jsonData" :true});
    })
    .post(function(request, response){
    console.log("POST the json route");
    response
            .status(200)
            .json({"jsonData" :"POST received"});
    });


module.exports = router;


