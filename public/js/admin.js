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
  $scope.init = function () {
    $http.post('/admin/students',{
    }).success(function (results){
      console.log(results);
      $scope.students = results;
    }).error(function (data, status){
      console.log(data);
    });
  };

  $scope.getVerifyID = function(id){
    $scope.id = id;
  };

  $scope.verify = function (){
    $http.post('/admin/verify',{
      'id': $scope.id
    }).success(function (results){
      $scope.init();
      console.log(results);
    }).error(function (data, status){
      console.log(data);
    });
  }
}]);

app.controller('MatchingCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

}]);

app.controller('NotMatchingCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

}]);
// Angular Controllers End