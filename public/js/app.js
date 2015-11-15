'use strict';

var app = angular.module('mofed', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'login.html',
    controller: 'LoginCtrl'
  })
  .when('/register', {
    templateUrl: 'register.html',
    controller: 'RegisterCtrl'
  })
  .when('/restore', {
    templateUrl: 'restore.html',
    controller: 'RestoreCtrl'
  });
}]);

app.controller('LoginCtrl', ['$scope', function($scope) {

}]);

app.controller('RegisterCtrl', ['$scope', function($scope) {

}]);