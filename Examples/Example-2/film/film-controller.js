angular.module('myApp').controller('FilmController', FilmController);

function FilmController($http, $routeParams) {
    var vm = this;
    var id = $routeParams.id;
    $http.get('https://swapi.co/api/films/' + id).then(function(response){
        //console.log(response.data);
        vm.film = response.data;
    });
}