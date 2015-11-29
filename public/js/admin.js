'use strict';

var app = angular.module('mofed', ['ngRoute', 'ngMessages', 'ui-notification', 'toggle-switch', 'nya.bootstrap.select', 'ui.bootstrap']);

app.config(['$routeProvider', '$locationProvider' , function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '../admin.html',
    controller: 'AdminCtrl'
  })
  .when('/students', {
    templateUrl: '../students.html',
    controller: 'StudentsCtrl'
  })
  .when('/matching',{
    templateUrl: '../matching.html',
    controller: 'MatchingCtrl'
  })
  .when('/not-matching',{
    templateUrl: '../notmatching.html',
    controller: 'NotMatchingCtrl'
  });
}]);
// Angular Notification Configuration Start
app.config(function(NotificationProvider) {
  NotificationProvider.setOptions({
    delay: 10000,
    right:10,
    startTop: 20,
    startRight: 10,
    verticalSpacing: 20,
    horizontalSpacing: 20,
    positionX: 'center',
    positionY: 'top'
  });
});
// Angular Notification Configuration End
// Angular Controllers Start
app.controller('AdminCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

}]);

app.controller('StudentsCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

}]);
// Angular Controllers End