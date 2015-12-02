'use strict';

var app = angular.module('mofed', ['ngRoute', 'ngMessages', 'ui-notification', 'toggle-switch', 'nya.bootstrap.select', 'ui.bootstrap', 'blockUI']);

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
  })
  .when('/users',{
    templateUrl: '../users.html',
    controller: 'UsersCtrl'
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

app.controller('StudentsCtrl', ['$scope', '$http', '$location', 'blockUI', function($scope, $http, $location, blockUI) {
  blockUI.start("تحميل, الرجاء الانتظار...");
  $scope.init = function () {
    $http.post('/admin/students',{
    }).success(function (results){
      $scope.students = results;
      blockUI.stop();
    }).error(function (data, status){
      console.log(data);
    });
  };

  $scope.getVerifyID = function(id){
    $scope.id = id;
  };

  $scope.verify = function (){
    blockUI.start("تحميل, الرجاء الانتظار...");
    $http.post('/admin/verify',{
      'id': $scope.id
    }).success(function (results){
      blockUI.stop();
      $scope.init();
    }).error(function (data, status){
      console.log(data);
    });
  }
}]);

app.controller('MatchingCtrl', ['$scope', '$http', '$location', 'blockUI', function($scope, $http, $location, blockUI) {

}]);

app.controller('NotMatchingCtrl', ['$scope', '$http', '$location', 'blockUI', function($scope, $http, $location, blockUI) {

}]);

app.controller('UsersCtrl', ['$scope', '$http', '$location', 'blockUI', function($scope, $http, $location, blockUI) {

}]);
// Angular Controllers End