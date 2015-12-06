'use strict';

var app = angular.module('mofed', ['ngRoute', 'ngAnimate', 'remoteValidation', 'ui-notification', 'toggle-switch', 'nya.bootstrap.select', 'ui.bootstrap', 'blockUI']);

app.config(['$routeProvider', '$locationProvider' , function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '../admin.html',
    controller: 'AdminCtrl'
  })
  .when('/students', {
    templateUrl: '../students.html',
    controller: 'StudentsCtrl'
  })
  .when('/matching',{
    templateUrl: '../matching.html',
    controller: 'MatchingCtrl'
  })
  .when('/notMatching',{
    templateUrl: '../notMatching.html',
    controller: 'NotMatchingCtrl'
  })
  .when('/users',{
    templateUrl: '../users.html',
    controller: 'UsersCtrl'
  })
  .when('/addUser',{
    templateUrl: '../addUser.html',
    controller: 'AddUserCtrl'
  });
}]);

// Coustom Directive Start
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
// Coustom Directive End
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
// Angular Controllers Start
app.controller('AdminCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {

}]);

app.controller('StudentsCtrl', ['$scope', '$http', '$location', 'blockUI', function($scope, $http, $location, blockUI) {
  blockUI.start("تحميل, الرجاء الانتظار...");
  $scope.pageSize = 10;
  $scope.currentPage = 1;
  $scope.total = 0;
  $scope.init = function () {
    $http.get('/admin/students/'+$scope.pageSize+'/'+$scope.currentPage,{
    }).success(function (results){
      console.log(results);
      $scope.students = results.students;
      $scope.total = results.count;
      console.log($scope.students);
      blockUI.stop();
    }).error(function (data, status){
      console.log(data);
    });
  };

  $scope.getVerifyID = function(id){
    $scope.id = id;
  };

  $scope.verify = function (){
    blockUI.start("تحميل, الرجاء الانتظار...");
    $http.post('/admin/verify',{
      'id': $scope.id
    }).success(function (results){
      $scope.init();
    }).error(function (data, status){
      console.log(data);
    });
  }
}]);

app.controller('MatchingCtrl', ['$scope', '$http', '$location', 'blockUI', function($scope, $http, $location, blockUI) {
  blockUI.start("تحميل, الرجاء الانتظار...");
  $scope.pageSize = 10;
  $scope.currentPage = 1;
  $scope.total = 0;
  $scope.init = function () {
    $http.post('/admin/matching/'+$scope.pageSize+'/'+$scope.currentPage,{
    }).success(function (results){
      $scope.students = results.students;
      $scope.total = results.count;
      blockUI.stop();
    }).error(function (data, status){
      console.log(data);
    });
  }
}]);

app.controller('NotMatchingCtrl', ['$scope', '$http', '$location', 'blockUI', function($scope, $http, $location, blockUI) {
  blockUI.start("تحميل, الرجاء الانتظار...");
  $scope.pageSize = 10;
  $scope.currentPage = 1;
  $scope.total = 0;
  $scope.init = function () {
    $http.post('/admin/notMatching/'+$scope.pageSize+'/'+$scope.currentPage,{
    }).success(function (results){
      $scope.students = results.students;
      $scope.total = results.count;
      blockUI.stop();
    }).error(function (data, status){
      console.log(data);
    });
  };

  $scope.getVerifyID = function(id){
    $scope.id = id;
  };

  $scope.verify = function (){
    blockUI.start("تحميل, الرجاء الانتظار...");
    $http.post('/admin/verify',{
      'id': $scope.id
    }).success(function (results){
      $scope.init();
    }).error(function (data, status){
      console.log(data);
    });
  }
}]);

app.controller('UsersCtrl', ['$scope', '$http', 'blockUI', function($scope, $http, blockUI) {
  blockUI.start("تحميل, الرجاء الانتظار...");
  $scope.init = function () {
    $http.post('/admin/users',{
    }).success(function (results){
      $scope.admins = results;
      blockUI.stop();
    }).error(function (data, status){
      console.log(data);
    });
  };

  $scope.sendID = function(id){
    $scope.id = id;
  };

  $scope.removeUser = function(){
    blockUI.start("تحميل, الرجاء الانتظار...");
    $http.post('/admin/remove',{
      'id': $scope.id
    }).success(function (results){
      if (results.remove == true){
        $scope.init();
      } else {
        $scope.init();
      }
    }).error(function (data, status){
      console.log(data);
    });
  };

}]);

app.controller('AddUserCtrl', ['$scope', '$http', '$location', 'blockUI', 'Notification', function($scope, $http, $location, blockUI, Notification) {
  $scope.addUser = function(){
    blockUI.start("تحميل, الرجاء الانتظار...");
    $http.post('/admin/addUser',{
      'name': $scope.name,
      'phone': $scope.phone,
      'email': $scope.email,
      'password': $scope.password
    }).success(function (result){
        $scope.name='';
        $scope.phone='';
        $scope.email='';
        $scope.confirmEmail='';
        $scope.password='';
        $scope.confirmPassword='';
      if (result.addUser == true){
        blockUI.stop();
        $location.path("/users");
        Notification.success({message: 'تم إضافة مستخدم جديد بنجاح', title: '<div class="text-right">نجاح</div>'});
      } else if(result.addUser == false) {
        blockUI.stop();
        $location.path("/users");
        Notification.error({message: 'حدث خطأ الرجاء المحاولة لاحقا', title: '<div class="text-right">فشل</div>'});
      }
    }).error(function (data, status){
      console.log(data);
    });
  };
}]);
// Angular Controllers End