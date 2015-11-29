'use strict';

var app = angular.module('mofed', ['ngRoute', 'ngMessages', 'ui-notification', 'toggle-switch', 'nya.bootstrap.select', 'ui.bootstrap']);

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
  this.nid = "119861412541";
  this.regnum = "12345";
  this.lawnum = "393";
});
// Angular Custom Service End
// Angular Controllers Start
app.controller('HomeCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
  $http.post('/user/verify',{
  }).success(function (results){
    $scope.verify = 1;
    if (results.verify == 1) {
      $scope.verify = 24;
    } else if (results.verify == 2) {
      $scope.verify = 58.7;
    }
    else if (results.verify == 3) {
      $scope.verify = 100;
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
  $scope.$watch('nid','regnum','lawnum', function(){
    checkService.nid = $scope.nid;
    checkService.regnum = $scope.regnum;
    checkService.lawnum = $scope.lawnum;
  });
  $scope.check = function(){
    $location.path("/confirm");
  };
}]);

app.controller('ConfirmCtrl', ['$scope', '$http', '$location', 'checkService', 'Notification', function($scope, $http, $location, checkService, Notification) {
  $scope.nid = checkService.nid;
  $scope.regnum = checkService.regnum;
  $scope.lawnum = checkService.lawnum;
  $http.post('/user/check',{
    'nid': $scope.nid,
    'regnum': $scope.regnum,
    'lawnum': $scope.lawnum
  }).success(function (person, students){
    $scope.person = person;
  }).error(function (data, status){
    console.log(data);
  });
  $scope.selectName = false;
  $scope.confirmName = false;
  $scope.confirm = function(){
    $http.post('/user/confirm',{
        'nid': $scope.person.person._id,
        'sid': $scope.sid._id
      }).success(function (results){
        if (results.verify==true){
          Notification.info({message: 'تم تسجيل بياناتك الرجاء متابعة البريد الالكتروني', title: '<div class="text-right">نجح</div>'});
          $location.path("/");
        } else if (results.verify==2){
           Notification.error({message: 'حدث خطأ الرجاء إعادة المحاولة لاحقا', title: '<div class="text-right">فشل</div>'});
          $location.path("/");
        }
        console.log(results.verify);
      }).error(function (data, status){
      console.log(data);
    });
  }
}]);
// Angular Controllers End