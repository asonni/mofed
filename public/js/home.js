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

app.service('checkService', function(){
  
  this.nid = "119861412541";
  this.regnum = "12345";
  this.lawnum = "393";

});

app.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
  $http.post('/user/verify',{
  })
  .success(function (results){
    console.log(results);
  }).error(function (data, status){
    console.log(data);
  });
  var value = Math.floor((Math.random() * 100) + 1);
  // var type;

    if (value < 25) {
      type = 'success';
    } else if (value < 50) {
      type = 'info';
    } else if (value < 75) {
      type = 'warning';
    } else {
      type = 'danger';
    }

    $scope.showWarning = (type === 'danger' || type === 'warning');

    $scope.dynamic = value;
    $scope.type = type;
  };
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
  $scope.confirm = function(){
    $http.post('/user/confirm',{
        'nid': $scope.person.person._id,
        'sid': $scope.sid._id
      }).success(function (results){
        console.log(results);
      }).error(function (data, status){
      console.log(data);
    });
  }
}]);
