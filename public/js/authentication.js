'use strict';

var app = angular.module('mofed', ['ngRoute', 'ui-notification', 'remoteValidation']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider,$locationProvider) {
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
    templateUrl: '404.html'
  });
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
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

app.controller('LoginCtrl', ['$scope', '$http', '$location', 'Notification','$routeParams', function($scope, $http, $location, Notification, $routeParams) {
  console.log($routeParams);
  if($routeParams.msg==2){
    $location.url($location.path());
    Notification.error({message: 'الرجاء التأكد من البريد الالكتروني وكلمة المرور', title: '<div class="text-right">خطأ</div>'});
  } else if($routeParams.msg==4){
    $location.url($location.path());
    Notification.info({message: 'تم تفعيل حسابك, الرجاء قم بالدخول', title: '<div class="text-right">نجح</div>'});
  } else if ($routeParams.msg==5){
    $location.url($location.path());
    Notification.error({message: 'لم يتم العتور علي حسابك, الرجاء التفعيل من جديد', title: '<div class="text-right">خطأ</div>'});
  }
  // $scope.hasError = function(field, validation){
  //   if(validation){
  //     return ($scope.form[field].$dirty && $scope.form[field].$error[validation]) || ($scope.submitted && $scope.form[field].$error[validation]);
  //   }
  //   return ($scope.form[field].$dirty && $scope.form[field].$invalid) || ($scope.submitted && $scope.form[field].$invalid);
  // };
  $scope.login = function(){
    $scope.submitted = true;
    $http.post('/user/login',{
      'username': $scope.email,
      'password': $scope.password
    }).success(function (result){
      if (result.login == true) {
        $scope.email='';
        $scope.password='';
        window.location.replace('/user');
      } else if (result.login == 2) {
        $scope.email='';
        $scope.password='';
        Notification.warning({message: ' خطأ في كلمة المرور او البريد الالكتروني', title: '<div class="text-right">فشل</div>'});
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
