'use strict';

var app = angular.module('mofed', ['ngRoute', 'ngMessages', 'ui-notification']);

app.config(['$routeProvider', '$locationProvider' , function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '../home.html',
    controller: 'HomeCtrl'
  })
  .when('/check', {
    templateUrl: '../check.html',
    controller: 'CheckCtrl'
  })
  .when('/results', {
    templateUrl: '../results.html',
    controller: 'ResultsCtrl'
  });
  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });
}]);

app.controller('HomeCtrl', ['$scope', function($scope) {

}]);

app.controller('CheckCtrl', ['$scope', '$http', 'Notification', function($scope, $http, Notification) {
  $scope.check = function(){
    $http.post('/user/check',{
      'nid': $scope.nid,
      'regnum': $scope.regnum,
      'lawnum': $scope.lawnum
    }).success(function (result){
      if (result.check == true) {
        $scope.nid='';
        $scope.regnum='';
        $scope.lawnum='';
        window.location.replace('/user#/results');
      } else {
        $scope.nid='';
        $scope.regnum='';
        $scope.lawnum='';
        Notification.error({message: 'الرجاء التأكد من البيانات المدخلة', title: '<div class="text-right">خطأ</div>'});
      }
    }).error(function (data, status){
      console.log(data);
    });
  };
}]);

app.controller('ResultsCtrl', ['$scope', function($scope) {

}]);
