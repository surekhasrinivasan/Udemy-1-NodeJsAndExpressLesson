/*global angular*/
angular.module('meanhotel').controller('HotelController', HotelController);

function HotelController($routeParams, hotelDataFactory) {
    var vm = this;
    var id = $routeParams.id;
    
    hotelDataFactory.hotelDisplay(id).then(function(response){
        console.log(response);
        vm.hotel = response;
        vm.stars = _getStarRating(response.stars);
        //vm.stars=response.stars;
    });
    
    function _getStarRating(stars) {
        return new Array(stars);
    }
}
