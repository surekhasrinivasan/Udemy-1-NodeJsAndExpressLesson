angular.module('myApp').controller('MainController', MainController);

function MainController($http) {
    var vm = this;
    
    $http.get('https://swapi.co/api/films/').then(function(response){
        //console.log(response.data);
        vm.films = response.data.results;
    });
    vm.name = 'Surekha';
}

