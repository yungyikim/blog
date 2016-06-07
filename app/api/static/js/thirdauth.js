var app = angular.module('myapp', ['ngRoute']);
app.controller('MainCtrl', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    $(".ui.sidebar")
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('attach events','.launch');
}]);
