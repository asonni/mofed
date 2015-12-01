'use strict';

var app = angular.module('mofed', ['ngRoute', 'ui-notification', 'toggle-switch', 'nya.bootstrap.select', 'ui.bootstrap', 'blockUI']);

app.config(['$routeProvider', '$locationProvider' , function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '../home.html',
    controller: 'HomeCtrl'
  })
  .when('/check', {
    templateUrl: '../check.html',
    controller: 'CheckCtrl'
  })
  .when('/confirm', {
    templateUrl: '../confirm.html',
    controller: 'ConfirmCtrl'
  });
  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });
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
// Angular Custom Service Start
app.service('checkService', function(){
  this.nid = "";
  this.regnum = "";
  this.lawnum = "";
});

// Angular Custom Service End
// Angular Controllers Start
app.controller('HomeCtrl', ['$scope', '$http', '$location', '$timeout', 'blockUI', function($scope, $http, $location, $timeout, blockUI) {
  blockUI.start("تحميل...");
  $scope.verify = 1;
  $http.post('/user/verify',{
  }).success(function (results){
    if (results.verify == 1) {
      $timeout(function() {
        blockUI.stop();
        $scope.verify = 24;
        $scope.type = 'warning';
        $scope.statusName = 'اكتمال مرحلة التسجيل';
      }, 2000);
    } else if (results.verify == 2) {
      $timeout(function() {
        blockUI.stop();
        $scope.verify = 58.7;
        $scope.type = 'info';
        $scope.statusName = 'اكتمال مرحلة التأكيد';
      }, 2000);
    }
    else if (results.verify == 3) {
      $timeout(function() {
        blockUI.stop();
        $scope.verify = 100;
        $scope.type = 'success';
        $scope.statusName = 'اكتمال مرحلة التطابق';
      }, 2000);
    }
  }).error(function (data, status){
    console.log(data);
  });
  $scope.check = function(){
    $location.path("/check");
  }
}]);

app.controller('CheckCtrl', ['$scope', '$http', 'Notification', '$location', 'checkService', function($scope, $http, Notification, $location, checkService) {
  $scope.nid = checkService.nid;
  $scope.regnum = checkService.regnum;
  $scope.lawnum = checkService.lawnum;
  $scope.$watchGroup(['nid', 'regnum', 'lawnum'], function(){
    checkService.nid = $scope.nid;
    checkService.regnum = $scope.regnum;
    checkService.lawnum = $scope.lawnum;
  });
  $scope.check = function(){
    $location.path("/confirm");
  };
}]);

app.controller('ConfirmCtrl', ['$scope', '$http', '$location', '$timeout', 'checkService', 'Notification', 'blockUI', function($scope, $http, $location, $timeout, checkService, Notification, blockUI) {
  blockUI.start("تحميل...");
  $scope.nid = checkService.nid;
  $scope.regnum = checkService.regnum;
  $scope.lawnum = checkService.lawnum;
  $http.post('/user/check',{
    'nid': $scope.nid,
    'regnum': $scope.regnum,
    'lawnum': $scope.lawnum
  }).success(function (person){
    $timeout(function() {
      blockUI.stop();
      $scope.person = person;
    } ,2000);
  }).error(function (data, status){
    console.log(data);
  });
  $scope.selectName = false;
  $scope.confirmName = false;
  $scope.sid = '';
  $scope.$watch('sid', function(){
    if($scope.sid){
      $scope.selectName = true;
    }
  });
  $scope.confirm = function(){
    blockUI.start("تحميل...");
    $http.post('/user/confirm',{
      'nid': $scope.person.person._id,
      'sid': $scope.sid._id
    }).success(function (results){
      if (results.verify==true){
        $timeout(function() {
          blockUI.stop();
          Notification.info({message: 'تم تسجيل بياناتك الرجاء متابعة البريد الالكتروني', title: '<div class="text-right">نجح</div>'});
          $location.path("/");
        }, 2000);
      } else if (results.verify==2){
        $timeout(function() {
          blockUI.stop();
          Notification.error({message: 'حدث خطأ الرجاء إعادة المحاولة لاحقا', title: '<div class="text-right">فشل</div>'});
          $location.path("/");
        }, 2000);
      }
    }).error(function (data, status){
      console.log(data);
    });
  }
}]);
// Angular Controllers End