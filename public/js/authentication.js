'use strict';

var app = angular.module('mofed', ['ngRoute', 'ui-notification', 'remoteValidation', 'blockUI']);

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

app.directive('checkEmailOnBlur', function(){
  var EMAIL_REGX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (attr.type === 'radio' || attr.type === 'checkbox') return;
      elm.unbind('input').unbind('keydown').unbind('change');
      elm.bind('blur', function () {
        scope.$apply(dovalidation);
      });
      scope.$on('kickOffValidations', dovalidation)
      function dovalidation() {
        if (EMAIL_REGX.test(elm.val())) {
          ctrl.$setValidity('emails', true);
        } else {
          ctrl.$setValidity('emails', false);
        }
      }
    }
  };
});

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

app.controller('LoginCtrl', ['$scope', '$http', '$location', 'Notification','$routeParams', 'blockUI', '$timeout', function($scope, $http, $location, Notification, $routeParams, blockUI, $timeout) {
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
  // $scope.test = function(){
  //   blockUI.start("تحميل ....");
  //   $timeout(function() {
  //     blockUI.stop();
  //   }, 5000);
  // }
  $scope.login = function(){
    blockUI.start("التحقق من صحة الحساب...");
    $http.post('/user/login',{
      'username': $scope.username,
      'password': $scope.password
    }).success(function (result){
      if (result.login == true) {
        blockUI.stop();
        window.location.replace('/user');
      } else if (result.login == 2) {
        blockUI.stop();
        $scope.username='';
        $scope.password='';
        Notification.warning({message: ' خطأ في كلمة المرور او البريد الالكتروني', title: '<div class="text-right">فشل</div>'});
      } else if (result.login == 3) {
        blockUI.stop();
        $scope.username='';
        $scope.password='';
        Notification.warning({message: 'حسابك غير مفعل الرجاء زيار بريدك الالكتروني', title: '<div class="text-right">فشل</div>'});
      } else if (result.login == 'admin') {
        blockUI.stop();
        $scope.username='';
        $scope.password='';
        window.location.replace('/admin');
      }
    }).error(function (data, status){
      console.log(data);
    });
  };
}]);

app.controller('RegisterCtrl', ['$scope', '$location', '$http', 'Notification', function($scope, $location, $http, Notification) {
  $scope.register = function(){
    blockUI.start("تحميل...");
    $http.post('/user/register',{
      'email': $scope.email,
      'password': $scope.password
    }).success(function (result){
      blockUI.stop();
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
