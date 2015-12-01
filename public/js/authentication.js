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

app.directive("matchVerify", function() {
   return {
      require: "ngModel",
      scope: {
        matchVerify: '='
      },
      link: function(scope, element, attrs, ctrl) {
        scope.$watch(function() {
            var combined;

            if (scope.matchVerify || ctrl.$viewValue) {
               combined = scope.matchVerify + '_' + ctrl.$viewValue; 
            }                    
            return combined;
        }, function(value) {
            if (value) {
                ctrl.$parsers.unshift(function(viewValue) {
                    var origin = scope.matchVerify;
                    if (origin !== viewValue) {
                        ctrl.$setValidity("matchVerify", false);
                        return undefined;
                    } else {
                        ctrl.$setValidity("matchVerify", true);
                        return viewValue;
                    }
                });
            }
        });
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
        $timeout(function() {
          blockUI.stop();
          window.location.replace('/user');
        }, 2000);
      } else if (result.login == 2) {
        $timeout(function() {
          blockUI.stop();
          $scope.username='';
          $scope.password='';
          Notification.warning({message: ' خطأ في كلمة المرور او البريد الالكتروني', title: '<div class="text-right">فشل</div>'});
        }, 2000);
      } else if (result.login == 3) {
        $timeout(function() {
          blockUI.stop();
          $scope.username='';
          $scope.password='';
          Notification.warning({message: 'حسابك غير مفعل الرجاء زيار بريدك الالكتروني', title: '<div class="text-right">فشل</div>'});
        }, 2000);
      } else if (result.login == 'admin') {
        $timeout(function() {
          blockUI.stop();
          window.location.replace('/admin');
          $scope.username='';
          $scope.password='';
        }, 2000);
      }
    }).error(function (data, status){
      console.log(data);
    });
  };
}]);

app.controller('RegisterCtrl', ['$scope', '$location', '$http', '$timeout', 'Notification', 'blockUI', function($scope, $location, $http, $timeout, Notification, blockUI) {
  $scope.register = function(){
    blockUI.start("تحميل, الرجاء الانتظار...");
    $http.post('/user/register',{
      'email': $scope.email,
      'password': $scope.password
    }).success(function (result){
      $timeout(function() {
        blockUI.stop();
        $scope.email='';
        $scope.password='';
        $location.path("/");
        Notification.success({message: 'تم التسجيل بنجاح الرجاء التأكيد علي البريد الالكتروني', title: '<div class="text-right">نجاح</div>'});
      }, 2000);
    }).error(function (data, status){
      console.log(data);
    });
  };
}]);

app.controller('RestoreCtrl', ['$scope', '$http', '$timeout', 'Notification', 'blockUI', function($scope, $http, $timeout, Notification, blockUI) {
  $scope.restore = function(){
    blockUI.start("تحميل, الرجاء الانتظار...");
    $http.post('/user/forgotPassword', {
      'email': $scope.email
    }).success(function (result){
      if (result.restore == true) {
        $timeout(function() {
          blockUI.stop();
          $scope.email='';
          $location.path("/");
          Notification.success({message: 'تم ارسال رسالة الي بريدك تحتوي علي كلمة المرور', title: '<div class="text-right">نجاح</div>'});
        }, 1000);
      } else {
        $timeout(function() {
          blockUI.stop();
          $scope.email='';
          $location.path("/");
          Notification.error({message: 'البريد الذي ادخلته غير موجود', title: '<div class="text-right">خطأ</div>'});
        }, 2000);
      }
    }).error(function (data, status){
      console.log(data);
    })
  }
}]);

app.controller('TestCtrl', ['$scope', function($scope) {

}]);