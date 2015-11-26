'use strict';

var app = angular.module('mofed', ['ngRoute', 'ui-notification', 'remoteValidation']);

app.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {
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
    reditectTo: '/'
  });
  // $locationProvider.html5Mode(true);
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

app.controller('LoginCtrl', ['$scope', '$http', '$location', 'Notification', function($scope, $http, $location, Notification) {
  $scope.login = function(){
    $http.post('/user/login',{
      'username': $scope.email,
      'password': $scope.password
    }).success(function (result){
      if (result.login == true) {
        $scope.email='';
        $scope.password='';
        window.location.replace('/user');
      } else if (result.login == 3) {
        $scope.email='';
        $scope.password='';
        Notification.warning({message: 'حسابك غير مفعل الرجاء زيار بريدك الالكتروني', title: '<div class="text-right">فشل</div>'});
      }
    }).error(function (data, status){
      console.log(data);
    });
  };
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
      Notification.success({message: 'تم التسجيل بنجاح الرجاء التأكيد علي البريد الالكتروني', title: '<div class="text-right">نجاح</div>'});
    }).error(function (data, status){
      console.log(data);
    });
  };
}]);

app.controller('RestoreCtrl', ['$scope', function($scope) {

}]);