/*global angular*/
//angular.module('meanhotel', ['ngRoute']).config(config);
angular.module('meanhotel', ['ngRoute']).config(config).run(run);

function config($routeProvider) {
    $routeProvider
    .when('./', {
        templateUrl: 'angular-app/hotel-list/hotels.html',
        controller: HotelsController,
        controllerAs:'vm'
    });
}

