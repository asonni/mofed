'use strict';

var app = angular.module('mofed', ['ngRoute', 'remoteValidation', 'ui-notification', 'toggle-switch', 'nya.bootstrap.select', 'ui.bootstrap', 'blockUI']);

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
  })
  .when('/recruit', {
    templateUrl: '../recruit.html',
    controller: 'RecruitCtrl'
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
// Coustom Directive Start End
// Angular Custom Service Start
app.service('checkService', function(){
  this.name = "";
  this.nid = "";
  this.regnum = "";
  this.lawnum = "";
});
// Angular Custom Service End
// Angular Controllers Start
app.controller('HomeCtrl', ['$scope', '$http', '$location', 'blockUI', function($scope, $http, $location, blockUI) {
  blockUI.start("تحميل, الرجاء الانتظار...");
  $scope.verify = 1;
  $http.post('/user/verify',{
  }).success(function (results){
    if (results.verify == 1) {
      blockUI.stop();
      $scope.verify = 24;
      $scope.type = 'warning';
      $scope.statusName = 'اكتمال مرحلة التسجيل';
    } else if (results.verify == 2) {
      blockUI.stop();
      $scope.verify = 58.7;
      $scope.type = 'info';
      $scope.statusName = 'اكتمال مرحلة التأكيد';
    }
    else if (results.verify == 3) {
      blockUI.stop();
      $scope.verify = 100;
      $scope.type = 'success';
      $scope.statusName = 'اكتمال مرحلة التطابق';
    }
  }).error(function (data, status){
    console.log(data);
  });
  $scope.check = function(){
    $location.path("/check");
  }
}]);

app.controller('CheckCtrl', ['$scope', '$http', 'Notification', '$location', 'checkService', function($scope, $http, Notification, $location, checkService) {
  $scope.name = checkService.name;
  $scope.nid = checkService.nid;
  $scope.regnum = checkService.regnum;
  $scope.lawnum = checkService.lawnum;
  $scope.$watchGroup(['name','nid', 'regnum', 'lawnum'], function(){
    checkService.name = $scope.name;
    checkService.nid = $scope.nid;
    checkService.regnum = $scope.regnum;
    checkService.lawnum = $scope.lawnum;
  });
  $scope.check = function(){
    $location.path("/confirm");
  };
}]);

app.controller('ConfirmCtrl', ['$scope', '$http', '$location', 'checkService', 'Notification', 'blockUI', function($scope, $http, $location, checkService, Notification, blockUI) {
  blockUI.start("تحميل...");
  $scope.name = checkService.name;
  $scope.nid = checkService.nid;
  $scope.regnum = checkService.regnum;
  $scope.lawnum = checkService.lawnum;
  $http.post('/user/check',{
    'name': $scope.name,
    'nid': $scope.nid,
    'regnum': $scope.regnum,
    'lawnum': $scope.lawnum
  }).success(function (person){
    if(!person){
      console.log(person)
      blockUI.stop();
      Notification.error({message: 'حدث خطأ الرجاء التأكد من البيانات المدخلة أو إعادة المحاولة لاحقا', title: '<div class="text-right">فشل</div>'});
    } else {
      blockUI.stop();
      $scope.person = person;
    }
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
    $scope.country = $scope.sid.country;
  });
  $scope.confirm = function(){
    blockUI.start("تحميل...");
    $http.post('/user/confirm',{
      'nid': $scope.person.person._id,
      'sid': $scope.sid._id,
      'country': $scope.country
    }).success(function (results){
      if (results.verify==true){
        blockUI.stop();
        Notification.info({message: 'تم تسجيل بياناتك الرجاء متابعة البريد الالكتروني', title: '<div class="text-right">نجح</div>'});
        $location.path("/");
      } else if (results.verify==2){
        blockUI.stop();
        Notification.error({message: 'حدث خطأ الرجاء إعادة المحاولة لاحقا', title: '<div class="text-right">فشل</div>'});
        $location.path("/");
      } else if (results.verify==3){
        blockUI.stop();
        Notification.error({message: 'حدث خطأ الرجاء إعادة المحاولة لاحقا', title: '<div class="text-right">فشل</div>'});
      }
    }).error(function (data, status){
      console.log(data);
    });
  }

  $scope.unconfirm = function(){
    $location.path("/check");
    Notification.info({message: 'الرجاء التحقق من البيانات المدخلة او مراجعة إدارة البعثات', title: '<div class="text-right">رسالة تحقق</div>'});
  }
}]);


app.controller('JobCtl',['$scope', '$http', 'blockUI', function($scope, $http, blockUI){
  blockUI.start("تحميل, الرجاء الانتظار...");
  $http.post('/user/verify',{
  }).success(function (results){
    $scope.verify = results.verify;
    blockUI.stop();
  });
  $scope.getJobInfo = function(){
    $http.get('/user/getJobInfo',{
    }).success(function (results){
      // blockUI.stop();
      $scope.job = results.job;
      $scope.area = results.area;
    }).error(function (data, status){
      console.log(data);
    });
  }
}]);

app.controller('RecruitCtrl',['$scope', '$http', 'blockUI', function($scope, $http, blockUI){
  $scope.addJobInfo = function(){
    $http.post('/user/addJobInfo',{
      'salary': $scope.salary
    }).success(function (results){
      console.log(results);
    }).error(function (data, status){
      console.log(data);
    });
  }
}]);
// Angular Controllers End