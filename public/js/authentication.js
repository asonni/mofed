'use strict';

var app = angular.module('mofed', ['ngRoute', 'ui-notification']);

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
  })
  .otherwise({
    reditectTo: 'login.html'
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

app.controller('LoginCtrl', ['$scope', function($scope) {

}]);

app.controller('RegisterCtrl', ['$scope', '$location', '$http', 'Notification', function($scope, $location, $http, Notification) {
  $scope.register = function(){
    $http.post('/user/register',{
      'email': $scope.email,
      'password': $scope.password
    }).success(function (result){
      $scope.email='';
      $scope.password='';
      $location.path("/");
      Notification.success({message: 'تم التسجيل بنجاح الرجاء التأكيد علي البريد الالكتروني', title: 'نجاح'});
    }).error(function (data, status){
      console.log(data);
    });
  };
}]);

app.controller('RestoreCtrl', ['$scope', function($scope) {

}]);