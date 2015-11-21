'use strict';

var app = angular.module('mofed', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '../confirm.html',
    controller: 'ConfirmCtrl'
  })
  .when('/results', {
    templateUrl: '../resultConfirm.html',
    controller: 'ResultConfirmCtrl'
  });
}]);

app.controller('ConfirmCtrl', ['$scope', function($scope) {

}]);

app.controller('ResultConfirmCtrl', ['$scope', function($scope) {

}]);
