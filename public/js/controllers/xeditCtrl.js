/*var addCtrl = angular.module('addCtrl', ['geolocation', 'gserviceForProviders']);
addCtrl.controller('addCtrl', function ($scope, $http, $rootScope, geolocation, gserviceForProviders) {
*/



var xeditCtrl = angular.module('xeditCtrl', []);
xeditCtrl.controller('xeditCtrl', function($scope) {
  $scope.user = {
    name: 'awesome user'
  };  
});