'use strict';

var app = angular.module('mofed', ['ngRoute', 'remoteValidation', 'ui-notification', 'toggle-switch', 'nya.bootstrap.select', 'ui.bootstrap', 'blockUI', 'ngCsvImport']);

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
  })
  .when('/importCSV',{
    templateUrl: '../importCSV.html',
    controller: 'importCsvCtrl'
  });
}]);
// Coustom Directive Start
app.directive('autoActive', ['$location', function ($location) {
  return {
    restrict: 'A',
    scope: false,
    link: function (scope, element) {
      function setActive() {
        var path = $location.path();
        if (path) {
          angular.forEach(element.find('li'), function (li) {
            var anchor = li.querySelector('a');
            if (anchor.href.match('#' + path + '(?=\\?|$)')) {
              angular.element(li).addClass('active');
            } else {
              angular.element(li).removeClass('active');
            }
          });
        }
      }
      setActive();
      scope.$on('$locationChangeSuccess', setActive);
    }
  }
}]);
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
app.controller('AdminCtrl', ['$scope', '$http', '$location', '$route', function($scope, $http, $location, $route) {
  $scope.$route = $route;
}]);

app.controller('StudentsCtrl', ['$scope', '$http', '$location', '$window', 'blockUI','$document', function($scope, $http, $location, $window, blockUI,$document) {
  blockUI.start("تحميل, الرجاء الانتظار...");
  $scope.pageSize = 10;
  $scope.currentPage = 1;
  $scope.total = 0;
  $scope.init = function () {
    $http.get('/admin/students/'+$scope.pageSize+'/'+$scope.currentPage,{
    }).success(function (results){
      $scope.students = results.students;
      $scope.total = results.count;
      blockUI.stop();
    }).error(function (data, status){
      console.log(data);
    });
  };
  $scope.getVerifyID = function(id, studentNid){
    $scope.id = id;
    $http.post('/admin/checkDuplicates',{
      'id': id,
      'nid': studentNid
    }).success(function (results){
      $scope.studentDupicate = results;
      console.log(results);
    }).error(function (data, status){
      console.log(data);
    });
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
  };
  $scope.errors =[{"errorId":1, "errorName":"خطأ في رقم القيد"},
                  {"errorId":2, "errorName":"خطأ في الرقم الوطني"},
                  {"errorId":3, "errorName":"خطأ في الاسم"},
                  {"errorId":4, "errorName":"خطأ في الساحة"}];
  $scope.showSelectError = false;
  $scope.unVerify = function(){
    if (!$scope.error){
      $scope.showSelectError = true;
    } else if ($scope.error.errorId) {
      $scope.modal = "modal";
      blockUI.start("تحميل, الرجاء الانتظار...");
      $http.post('/admin/unVerify',{
        'id': $scope.id,
        'errorId': $scope.error.errorId
      }).success(function (results){
        $scope.init();
      }).error(function (data, status){
        console.log(data);
      });
    }
  };
  $scope.resetSelect = function(){
    $scope.showSelectError = false;
    $scope.error = '';
  };
  // $scope.getDeleteId = function(id) {
  //   $scope.deleteId = id;
  // };
  // $scope.deleteDuplicates = function() {
  //   $http.post('/admin/removeDuplicates',{
  //     'id': $scope.deleteId
  //   }).success(function (){
  //     $scope.init();
  //   }).error(function (data, status){
  //     console.log(data);
  //   });
  // };
  $document.on('keydown', function(e){
    if( e.target.nodeName !== "INPUT"){ // you can add others here.
      e.preventDefault();
    }
  });
  $scope.searchAllStudent =function(){
    if ($scope.searchByNidOrName.length >= 7){
      $http.get('/admin/searchAll/'+$scope.searchByNidOrName,{
      }).success(function (results){
        $scope.students = results.students;
        // blockUI.stop();
      }).error(function (data, status){
        console.log(data);
      });
    } else {
      blockUI.start("تحميل, الرجاء الانتظار...");
      $scope.init();
    }
  };
}]);

app.controller('MatchingCtrl', ['$scope', '$http', '$location', '$window', 'blockUI', function($scope, $http, $location, $window, blockUI) {
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
  };
  $scope.getUnVerifyID = function(id){
    $scope.id = id;
  };
  $scope.errors =[{"errorId":1, "errorName":"خطأ في رقم القيد"},
                  {"errorId":2, "errorName":"خطأ في الرقم الوطني"},
                  {"errorId":3, "errorName":"خطأ في الاسم"},
                  {"errorId":4, "errorName":"خطأ في الساحة"}];
  $scope.showSelectError = false;
  $scope.unVerify = function(){
    if (!$scope.error){
      $scope.showSelectError = true;
    } else if ($scope.error.errorId) {
      blockUI.start("تحميل, الرجاء الانتظار...");
      $http.post('/admin/unVerify',{
        'id': $scope.id,
        'errorId': $scope.error.errorId
      }).success(function (results){
        $scope.init();
      }).error(function (data, status){
        console.log(data);
      });
    }
  };
  $scope.resetSelect = function(){
    $scope.showSelectError = false;
    $scope.error = '';
  };
  $scope.searchMatching =function(){
    if ($scope.searchByNidOrName.length >= 5){
      console.log($scope.searchByNidOrName);
    }
  };
}]);

app.controller('NotMatchingCtrl', ['$scope', '$http', '$location', '$window', 'blockUI', function($scope, $http, $location, $window, blockUI) {
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
  };
  $scope.errors =[{"errorId":1, "errorName":"خطأ في رقم القيد"},
                  {"errorId":2, "errorName":"خطأ في الرقم الوطني"},
                  {"errorId":3, "errorName":"خطأ في الاسم"},
                  {"errorId":4, "errorName":"خطأ في الساحة"}];
  $scope.showSelectError = false;
  $scope.unVerify = function(){
    if (!$scope.error){
      $scope.showSelectError = true;
    } else if ($scope.error.errorId) {
      blockUI.start("تحميل, الرجاء الانتظار...");
      $http.post('/admin/unVerify',{
        'id': $scope.id,
        'errorId': $scope.error.errorId
      }).success(function (results){
        $scope.init();
      }).error(function (data, status){
        console.log(data);
      });
    }
  };
  $scope.resetSelect = function(){
    $scope.showSelectError = false;
    $scope.error = '';
  };
  $scope.searchNotMatching =function(){
    if ($scope.searchByNidOrName.length >= 5){
      console.log($scope.searchByNidOrName);
    }
  };
}]);

app.controller('UsersCtrl', ['$scope', '$http', 'blockUI', function($scope, $http, blockUI) {
  blockUI.start("تحميل, الرجاء الانتظار...");
  $scope.pageSize = 10;
  $scope.currentPage = 1;
  $scope.total = 0;
  $scope.init = function () {
    $http.get('/admin/users/'+$scope.pageSize+'/'+$scope.currentPage,{
    }).success(function (results){
      $scope.admins = results.admins;
      $scope.total = results.count;
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

app.controller('importCsvCtrl', ['$scope', '$http', 'blockUI', 'Notification', function($scope, $http, blockUI, Notification) {
  $scope.csv = {
    result: null,
    encoding: 'UTF-8',
  };
  $scope.sendCSV = function (){
    blockUI.start("تحميل, الرجاء الانتظار...");
    $http.get('/admin/autoConfirm',{
      'results': $scope.csv
    }).success(function (results){
      console.log($scope.csv);
      blockUI.stop();
      Notification.success({message: 'تمت المطابقة بنجاح', title: '<div class="text-right">نجاح</div>'});
    }).error(function (data, status){
      console.log(data);
    });
  };
}]);

// Angular Controllers End