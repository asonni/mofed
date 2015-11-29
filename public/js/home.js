'use strict';

var app = angular.module('mofed', ['ngRoute', 'ngMessages', 'ui-notification', 'toggle-switch', 'nya.bootstrap.select']);

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

app.service('checkService', function(){
  
  this.nid = "119861412541";
  this.regnum = "12345";
  this.lawnum = "393";

});

app.controller('HomeCtrl', ['$scope', function($scope) {

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


  // $scope.check = function(){
  //   $http.post('/user/check',{
  //     'nid': $scope.nid,
  //     'regnum': $scope.regnum,
  //     'lawnum': $scope.lawnum
  //   }).success(function (result){
  //     console.log(result);
  //     $scope.name = result.name;
  //     $location.path('/results');
  //     // if (result.check == true) {
  //     //   // $scope.nid='';
  //     //   // $scope.regnum='';
  //     //   // $scope.lawnum='';
  //     //   $location.path('/results');
  //     //   // window.location.replace('/user#/results');
  //     // } else {
  //     //   $scope.nid='';
  //     //   $scope.regnum='';
  //     //   $scope.lawnum='';
  //     //   Notification.error({message: 'الرجاء التأكد من البيانات المدخلة', title: '<div class="text-right">خطأ</div>'});
  //     // }
  //   }).error(function (data, status){
  //     console.log(data);
  //   });
  // };
}]);

app.controller('ConfirmCtrl', ['$scope', '$http', 'checkService', function($scope, $http, checkService) {
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
  $scope.enabled = true;
  if ($scope.confirmName && $scope.confirmName){
    $scope.enabled = false;
  };
  $scope.confirm = function(){
    $http.post('/user/confirm',{
        'nid': $scope.person.person.nid,
        'sid': $scope.sid.sid
      }).success(function (results){
        console.log(results);
      }).error(function (data, status){
      console.log(data);
    });
  }
}]);
