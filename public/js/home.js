'use strict';

var app = angular.module('mofed', ['ngRoute', 'ngMessages']);

app.config(['$routeProvider', '$locationProvider' , function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '../home.html',
    controller: 'HomeCtrl'
  })
  .when('/check', {
    templateUrl: '../check.html',
    controller: 'CheckCtrl'
  });
  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });
}]);

app.controller('HomeCtrl', ['$scope', function($scope) {

}]);

app.controller('CheckCtrl', ['$scope', function($scope) {

}]);
