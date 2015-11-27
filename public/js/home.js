'use strict';

var app = angular.module('mofed', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider' , function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '../home.html',
    controller: 'HomeCtrl'
  });
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);

app.controller('HomeCtrl', ['$scope', function($scope) {

}]);
