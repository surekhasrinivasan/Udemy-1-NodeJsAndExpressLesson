angular.module('myApp').controller('MainController', MainController);

function MainController(FilmFactory) {
    var vm = this;
    
    FilmFactory.getAllFilms().then(function(response){
        //console.log(response.data);
        vm.films = response.results;
    });
    vm.name = 'Surekha';
    
    vm.date1 = '12 February 2016';
    vm.date2 = '11 March 2016';
    vm.date3 = '03 January 2015';
    vm.date4 = '02 April 2014';
    vm.date5 = '01 May 2016';
}

