// Declares the initial angular module "homelessResourceMap". Module grabs other controllers and services.
var app = angular.module('homelessResourceMap', ['selectTypeCtrl', 'addCtrl', 'geolocation', 'gserviceForProviders', 'ngRoute'])
    // Configures Angular routing -- showing the relevant view and controller when needed.
    .config(function ($routeProvider) {

        $routeProvider
        
            .when('/selecttype', {
            controller: 'selectTypeCtrl',
            templateUrl: 'partials/selectTypeForm.html',
        })
            .when("/join", {
            controller: "addCtrl",
            templateUrl: 'partials/addForm.html' ,
        })
            .otherwise({
            redirectTo: '/selecttype',
        })
    });
    
     /*.when('/find', {
            controller: 'queryCtrl',
            templateUrl: 'partials/queryForm.html',

            // List unique service types
        })
            .when('/listtypes', {
            controller: 'listAllTypesCtrl',
            templateUrl: 'partials/listAllTypesForm.html',

            // List available services for specified type(s)
        })
            .when('/listservices', {
            controller: 'listServicesCtrl',
            templateUrl: 'partials/listServicesForm.html',

            // Select specific services to display
        })*/