'use strict';

var app = angular.module('mofed', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: '../home.html',
    controller: 'HomeCtrl'
  });
}]);

app.controller('HomeCtrl', ['$scope', function($scope) {

}]);
